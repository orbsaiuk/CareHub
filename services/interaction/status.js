import { writeClient } from "@/sanity/lib/serverClient";

export async function getCompanyInteractionStatus(userId, companyTenantId) {
    if (!userId || !companyTenantId) {
        return {
            hasAcceptedRequest: false,
            hasPendingRequest: false,
            hasConversation: false,
            canMessage: false,
        };
    }

    try {
        const acceptedEventRequestQuery = `*[
      _type == "eventRequest" && 
      requestedBy == $userId && 
      targetCompanyTenantId == $companyTenantId && 
      status == "accepted"
    ][0]`;

        const acceptedEventRequest = await writeClient.fetch(
            acceptedEventRequestQuery,
            { userId, companyTenantId }
        );

        const pendingEventRequestQuery = `*[
      _type == "eventRequest" && 
      requestedBy == $userId && 
      targetCompanyTenantId == $companyTenantId && 
      status == "pending"
    ][0]`;

        const pendingEventRequest = await writeClient.fetch(
            pendingEventRequestQuery,
            { userId, companyTenantId }
        );

        const conversationQuery = `*[
      _type == "conversation" && 
      "user" in participants[]._ref &&
      participants[]._ref match $userId &&
      companyTenantId == $companyTenantId
    ][0]`;

        const existingConversation = await writeClient.fetch(conversationQuery, {
            userId,
            companyTenantId,
        });

        return {
            hasAcceptedRequest: !!acceptedEventRequest,
            hasPendingRequest: !!pendingEventRequest,
            hasConversation: !!existingConversation,
            canMessage: !!(acceptedEventRequest || existingConversation),
        };
    } catch (error) {
        return {
            hasAcceptedRequest: false,
            hasPendingRequest: false,
            hasConversation: false,
            canMessage: false,
        };
    }
}
