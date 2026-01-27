import { groq } from "next-sanity";

export const USER_BY_ID_OR_CLERKID_QUERY = groq`
  *[_type == "user" && (_id == $id || clerkId == $clerkId)][0]
`;

export const USER_ROLE_AND_MEMBERSHIPS_BY_CLERK_ID_QUERY = groq`
  *[_type == "user" && clerkId == $userId][0] {
    _id,
    role,
    memberships
  }
`;
