import { writeClient } from "@/sanity/lib/serverClient";
import {
  PROMOTED_OFFERS_FOR_EXPIRATION_QUERY,
  ACTIVE_PROMOTED_OFFERS_QUERY,
  EXPIRED_PRODUCT_OFFERS_QUERY,
  ALL_PRODUCT_OFFERS_QUERY,
} from "@/sanity/queries/productOffer";

export async function getPromotedProductOffers() {
  try {
    // Step 1: Fetch minimal documents to detect expired ones
    const allOffers = await writeClient.fetch(PROMOTED_OFFERS_FOR_EXPIRATION_QUERY);

    const today = new Date().toISOString().split("T")[0];
    const expired = allOffers.filter((offer) => {
      if (offer?.status !== "active" || !offer?.endDate) return false;
      const endDateStr = offer.endDate.split("T")[0];
      return endDateStr < today;
    });

    // Step 2: Update expired offers in Sanity
    if (expired.length > 0) {
      const tx = writeClient.transaction();
      expired.forEach((offer) => {
        tx.patch(offer._id, (p) => p.set({ status: "expired" }));
      });
      await tx.commit();
    }

    // Step 3: Fetch full data ONLY for active offers
    const activeOffers = await writeClient.fetch(ACTIVE_PROMOTED_OFFERS_QUERY);
    return activeOffers || [];

  } catch (error) {
    return [];
  }
}
export async function getExpiredProductOffers() {
  try {
    const expiredOffers = await writeClient.fetch(EXPIRED_PRODUCT_OFFERS_QUERY);
    return expiredOffers || [];
  } catch (error) {
    return [];
  }
}

export async function getAllProductOffers() {
  try {
    const allOffers = await writeClient.fetch(ALL_PRODUCT_OFFERS_QUERY);
    return allOffers || [];
  } catch (error) {
    return [];
  }
}

export async function autoExpireProductOffers() {
  try {
    // Get all offers to check expiration
    const offers = await writeClient.fetch(`
      *[_type == "offersPage" && status == "active" && defined(endDate)] {
        _id,
        endDate
      }
    `);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split("T")[0];

    // Find expired ones
    const expired = offers.filter((offer) => {
      const endDateStr = offer.endDate.split("T")[0];
      return endDateStr < todayStr;
    });

    // Auto-update expired offers
    if (expired.length > 0) {
      const tx = writeClient.transaction();
      expired.forEach((offer) => {
        tx.patch(offer._id, (p) => p.set({ status: "expired" }));
      });
      await tx.commit();

      return expired.length;
    }

    return 0;
  } catch (error) {
    return 0;
  }
}