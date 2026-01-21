import { writeClient } from "@/sanity/lib/serverClient";
import {
  PROMOTIONAL_BANNERS_FOR_EXPIRATION_QUERY,
  ACTIVE_PROMOTIONAL_BANNERS_QUERY,
} from "@/sanity/queries/promotionalBanner";

export async function getActivePromotionalBanners(targetAudience = "all") {
  try {
    // 1️⃣ Fetch only minimal data to find expired banners
    let banners = await writeClient.fetch(
      PROMOTIONAL_BANNERS_FOR_EXPIRATION_QUERY
    );

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split("T")[0];

      const expired = (banners || []).filter((b) => {
        if (!b.isActive || !b.endDate) return false;
        const endDateStr = b.endDate.split("T")[0];
        return endDateStr < todayStr;
      });

      // 2️⃣ Auto-deactivate expired banners in Sanity
      if (expired.length > 0) {
        const tx = writeClient.transaction();
        expired.forEach((banner) => {
          tx.patch(banner._id, (p) => p.set({ isActive: false }));
        });
        await tx.commit();
      }
    } catch (err) {
    }

    // 3️⃣ Fetch full data ONLY for active and valid banners
    let activeBanners = await writeClient.fetch(
      ACTIVE_PROMOTIONAL_BANNERS_QUERY
    );

    // 4️⃣ Filter by target audience if specified
    if (targetAudience !== "all") {
      // Handle multiple audiences (comma-separated)
      const audiences = targetAudience.split(",").map((a) => a.trim());
      activeBanners = activeBanners.filter(
        (banner) =>
          banner.targetAudience === "all" ||
          audiences.includes(banner.targetAudience)
      );
    }

    return activeBanners || [];
  } catch (error) {
    return [];
  }
}
