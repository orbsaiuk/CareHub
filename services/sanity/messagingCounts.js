import { writeClient } from "@/sanity/lib/serverClient";
import {
  UNREAD_COUNT_FOR_TENANT_QUERY,
  UNREAD_COUNT_FOR_USER_QUERY,
  BUSINESS_BY_TENANT_ID_QUERY,
  UNREAD_COUNT_FOR_TENANT_BY_BUSINESS_ID_QUERY,
  USER_BY_CLERK_ID_FOR_UNREAD_QUERY,
  UNREAD_COUNT_FOR_USER_BY_USER_ID_QUERY,
} from "@/sanity/queries/messaging";

export async function getUnreadForTenant({ tenantType, tenantId }) {
  // Get the business document ID
  const business = await writeClient.fetch(BUSINESS_BY_TENANT_ID_QUERY, {
    tenantId,
  });

  if (!business?._id) {
    return 0;
  }

  // Count unread messages in conversations where this business is a participant
  const count = await writeClient.fetch(
    UNREAD_COUNT_FOR_TENANT_BY_BUSINESS_ID_QUERY,
    {
      participantKey: `${tenantType}:${tenantId}`,
      businessId: business._id,
    }
  );

  return Number(count || 0);
}

export async function getUnreadForUser({ clerkId }) {
  // Get the user document ID
  const user = await writeClient.fetch(USER_BY_CLERK_ID_FOR_UNREAD_QUERY, {
    clerkId,
  });

  if (!user?._id) {
    return 0;
  }

  // Count unread messages in conversations where this user is a participant
  const count = await writeClient.fetch(
    UNREAD_COUNT_FOR_USER_BY_USER_ID_QUERY,
    {
      participantKey: `user:${clerkId}`,
      userId: user._id,
    }
  );

  return Number(count || 0);
}
