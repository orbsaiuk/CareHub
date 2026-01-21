// Conversations and messages GROQ

export const CONVERSATION_BY_KEY_QUERY = `
*[_type == "conversation" && compositeKey == $key][0]{
  _id, participant1, participant2, createdAt
}
`;

export const CONVERSATIONS_FOR_USER_QUERY = `
*[_type == "conversation" && (participant1._ref in *[_type == "user" && clerkId == $clerkId]._id || participant2._ref in *[_type == "user" && clerkId == $clerkId]._id)] 
  | order(createdAt desc)[$offset...$end]{
  _id, participant1, participant2, createdAt,
  "participant1Data": participant1->{_id, _type, name, image, logo, clerkId, tenantId},
  "participant2Data": participant2->{_id, _type, name, image, logo, clerkId, tenantId},
  "lastMessage": *[_type == "message" && conversation._ref == ^._id] | order(createdAt desc)[0]{
    _id, text, createdAt, messageType, 
    "senderData": sender->{_id, _type, name}
  },
  "lastMessagePreview": select(
    *[_type == "message" && conversation._ref == ^._id] | order(createdAt desc)[0].messageType == "order_request" => "طلب جديد",
    *[_type == "message" && conversation._ref == ^._id] | order(createdAt desc)[0].text
  ),
  "lastMessageAt": *[_type == "message" && conversation._ref == ^._id] | order(createdAt desc)[0].createdAt,
  "unreadCount": count(*[_type == "message" && conversation._ref == ^._id && !($participantKey in readBy[].participantKey) && sender._ref != *[_type == "user" && clerkId == $clerkId]._id[0]])
}
`;

export const CONVERSATIONS_FOR_TENANT_QUERY = `
*[_type == "conversation" && (participant1._ref in *[_type in ["company", "supplier"] && tenantId == $tenantId]._id || participant2._ref in *[_type in ["company", "supplier"] && tenantId == $tenantId]._id)] 
  | order(createdAt desc)[$offset...$end]{
  _id, participant1, participant2, createdAt,
  "participant1Data": participant1->{_id, _type, name, image, logo, clerkId, tenantId},
  "participant2Data": participant2->{_id, _type, name, image, logo, clerkId, tenantId},
  "lastMessage": *[_type == "message" && conversation._ref == ^._id] | order(createdAt desc)[0]{
    _id, text, createdAt, messageType, 
    "senderData": sender->{_id, _type, name}
  },
  "lastMessagePreview": select(
    *[_type == "message" && conversation._ref == ^._id] | order(createdAt desc)[0].messageType == "order_request" => "طلب جديد",
    *[_type == "message" && conversation._ref == ^._id] | order(createdAt desc)[0].text
  ),
  "lastMessageAt": *[_type == "message" && conversation._ref == ^._id] | order(createdAt desc)[0].createdAt,
  "unreadCount": count(*[_type == "message" && conversation._ref == ^._id && !($participantKey in readBy[].participantKey) && sender._ref != *[_type in ["company", "supplier"] && tenantId == $tenantId]._id[0]])
}
`;

export const MESSAGES_FOR_CONVERSATION_QUERY = `
*[_type == "message" && conversation._ref == $cid && createdAt <= $before]
  | order(createdAt desc)[$offset...$end]{
  _id, 
  text, 
  createdAt, 
  messageType, 
  readBy,
  "senderData": sender->{_id, _type, name, image, logo, clerkId, tenantId},
  "orderRequestData": orderRequest->{
    _id,
    "orderRequestId": _id,
    title,
    deliveryDate,
    deliveryAddress,
    phoneNumber,
    orderDetails,
    status,
    companyResponse,
    targetCompanyTenantId,
    requestedBy,
    createdAt
  }
}
`;

export const UNREAD_COUNT_FOR_USER_QUERY = `
count(*[_type == "message" 
  && !($participantKey in readBy[].participantKey) 
  && sender._ref != *[_type == "user" && clerkId == $clerkId]._id[0]
  && conversation._ref in *[_type == "conversation" && (participant1._ref in *[_type == "user" && clerkId == $clerkId]._id || participant2._ref in *[_type == "user" && clerkId == $clerkId]._id)]._id])
`;

export const UNREAD_COUNT_FOR_TENANT_QUERY = `
count(*[_type == "message" 
  && !($participantKey in readBy[].participantKey) 
  && sender._ref != *[_type in ["company", "supplier"] && tenantId == $tenantId]._id[0]
  && conversation._ref in *[_type == "conversation" && (participant1._ref in *[_type in ["company", "supplier"] && tenantId == $tenantId]._id || participant2._ref in *[_type in ["company", "supplier"] && tenantId == $tenantId]._id)]._id])
`;

// Additional queries for messaging service
export const CONVERSATION_BY_PARTICIPANTS_QUERY = `
*[_type == "conversation" && 
  ((participant1._ref == $p1 && participant2._ref == $p2) || 
   (participant1._ref == $p2 && participant2._ref == $p1))][0]
`;

export const USER_BY_CLERK_ID_QUERY = `
*[_type == "user" && clerkId == $userId][0]
`;

export const TENANT_BY_TENANT_ID_QUERY = `
*[_type == $kind && tenantId == $tenantId][0]
`;

export const USER_ID_BY_CLERK_ID_QUERY = `
*[_type == "user" && clerkId == $clerkId][0]._id
`;

export const TENANT_ID_BY_KIND_AND_TENANT_ID_QUERY = `
*[_type == $kind && tenantId == $tenantId][0]._id
`;

export const UNREAD_MESSAGES_BY_CONVERSATION_AND_PARTICIPANT_QUERY = `
*[_type == "message" && conversation._ref == $conversationId && !($participantKey in readBy[].participantKey)]
`;

export const BUSINESS_BY_TENANT_ID_QUERY = `
*[_type in ["company", "supplier"] && tenantId == $tenantId][0]
`;

export const UNREAD_COUNT_FOR_TENANT_BY_BUSINESS_ID_QUERY = `
count(*[_type == "message" 
  && !($participantKey in readBy[].participantKey) 
  && sender._ref != $businessId
  && conversation._ref in *[_type == "conversation" && (participant1._ref == $businessId || participant2._ref == $businessId)]._id])
`;

export const USER_BY_CLERK_ID_FOR_UNREAD_QUERY = `
*[_type == "user" && clerkId == $clerkId][0]
`;

export const UNREAD_COUNT_FOR_USER_BY_USER_ID_QUERY = `
count(*[_type == "message" 
  && !($participantKey in readBy[].participantKey) 
  && sender._ref != $userId
  && conversation._ref in *[_type == "conversation" && (participant1._ref == $userId || participant2._ref == $userId)]._id])
`;
