import { writeClient } from "@/sanity/lib/serverClient";
import {
  SUBBANNERS_FOR_EXPIRATION_QUERY,
  ACTIVE_SUBBANNERS_QUERY,
} from "@/sanity/queries/subbanner";

export async function getActiveSubbanners() {
  try {
    // 1️⃣ Fetch only minimal data to find expired subbanners
    let subbanners = await writeClient.fetch(
      SUBBANNERS_FOR_EXPIRATION_QUERY
    );

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split("T")[0];

      const expired = (subbanners || []).filter((s) => {
        if (s.status !== "active" || !s.endDate) return false;
        const endDateStr = s.endDate.split("T")[0];
        return endDateStr < todayStr;
      });

      // 2️⃣ Auto-expire them in Sanity
      if (expired.length > 0) {
        const tx = writeClient.transaction();
        expired.forEach((subbanner) => {
          tx.patch(subbanner._id, (p) => p.set({ status: "expired" }));
        });
        await tx.commit();
      }
    } catch (err) {
    }

    // 3️⃣ Fetch full data ONLY for active and valid subbanners
    const activeSubbanners = await writeClient.fetch(ACTIVE_SUBBANNERS_QUERY);
    return activeSubbanners || [];
  } catch (error) {
    return [];
  }
}
