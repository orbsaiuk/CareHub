import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q");
    const address = searchParams.get("address");
    const city = searchParams.get("city");
    const region = searchParams.get("region");
    const zipCode = searchParams.get("zipCode");
    const country = searchParams.get("country");

    let query = q;
    if (!query) {
      const parts = [address, city, region, zipCode, country]
        .filter(Boolean)
        .map((s) => String(s).trim())
        .filter((s) => s.length > 0);
      query = parts.join(", ");
    }

    if (!query || query.trim().length === 0) {
      return new NextResponse("Missing query", { status: 400 });
    }

    const contact = process.env.GEOCODE_CONTACT_EMAIL || "admin@dateshub.com";

    const parse = (row) => {
      if (!row) return null;
      const lat = row.lat ?? row.latitude;
      const lng = row.lon ?? row.lng ?? row.longitude;
      if (!lat || !lng) return null;
      const latNum = Number(lat);
      const lngNum = Number(lng);
      if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) return null;
      return { lat: latNum, lng: lngNum };
    };

    // Primary: Nominatim search with rate limiting delay
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), 10000);
      const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
        query
      )}&limit=5&accept-language=ar,en`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": `DatesHub/1.0 (${contact})`,
          "Accept": "application/json",
          "Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
        },
        cache: "no-store",
        signal: controller.signal,
      });
      clearTimeout(t);
      if (res.ok) {
        const data = await res.json();
        const first = Array.isArray(data) && data.length > 0 ? data[0] : null;
        const mapped = parse(first);
        if (mapped) {
          return NextResponse.json(mapped);
        }
      }
    } catch (err) {
      // Continue to fallback
    }

    // Fallback 1: Photon API
    try {
      const url2 = `https://photon.komoot.io/api/?q=${encodeURIComponent(
        query
      )}&lang=en&limit=5`;
      const res2 = await fetch(url2, {
        cache: "no-store",
        headers: {
          "Accept": "application/json"
        }
      });
      if (res2.ok) {
        const data2 = await res2.json();
        const first2 = data2?.features?.[0];
        if (first2?.geometry?.coordinates) {
          const [lng, lat] = first2.geometry.coordinates;
          const mapped2 = parse({ lat, lng });
          if (mapped2) {
            return NextResponse.json(mapped2);
          }
        }
      }
    } catch (err) {
      // Continue to fallback
    }

    // Fallback 2: OpenCage (if API key is available)
    const openCageKey = process.env.OPENCAGE_API_KEY;
    if (openCageKey) {
      try {
        const url3 = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
          query
        )}&key=${openCageKey}&language=ar&limit=5`;
        const res3 = await fetch(url3, { cache: "no-store" });
        if (res3.ok) {
          const data3 = await res3.json();
          const first3 = data3?.results?.[0];
          if (first3?.geometry) {
            const mapped3 = parse({ lat: first3.geometry.lat, lng: first3.geometry.lng });
            if (mapped3) {
              return NextResponse.json(mapped3);
            }
          }
        }
      } catch (err) {
        // Continue
      }
    }

    return NextResponse.json(null);
  } catch (e) {
    return NextResponse.json(null);
  }
}
