import { writeClient } from "@/sanity/lib/serverClient";
import {
  DISCOUNT_CODES_FOR_EXPIRATION_QUERY,
  ACTIVE_DISCOUNT_CODES_QUERY,
} from "@/sanity/queries/discountCode";

export async function getActiveDiscountCodes() {
  try {
    // 1️⃣ Fetch only minimal data to find expired codes
    let codes = await writeClient.fetch(
      DISCOUNT_CODES_FOR_EXPIRATION_QUERY
    );

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split("T")[0];

      const expired = (codes || []).filter((c) => {
        if (c.status !== "active" || !c.endDate) return false;
        const endDateStr = c.endDate.split("T")[0];
        return endDateStr < todayStr;
      });

      // 2️⃣ Auto-expire them in Sanity
      if (expired.length > 0) {
        const tx = writeClient.transaction();
        expired.forEach((code) => {
          tx.patch(code._id, (p) => p.set({ status: "expired" }));
        });
        await tx.commit();
      }
    } catch (err) {
    }

    // 3️⃣ Fetch full data ONLY for active and valid codes
    const activeCodes = await writeClient.fetch(ACTIVE_DISCOUNT_CODES_QUERY);
    return activeCodes || [];
  } catch (error) {
    return [];
  }
}
