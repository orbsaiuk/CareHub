// Queries specifically for Content Creator Blogs

export const CONTENT_CREATOR_BLOG_PROJECTION = `{
  _id,
  _type,
  title,
  slug,
  excerpt,
  target,
  blogImage{
    asset->{
      url
    },
    alt
  },
  content[]{
    ...,
    _type == "image" => {
      ...,
      asset->{
        url,
        metadata
      }
    }
  },
  _createdAt,
  featured
}`;

// Get all content creator blogs
export const ALL_CONTENT_CREATOR_BLOGS_QUERY = `
*[_type == "contentCreatorBlog"] | order(_createdAt desc) ${CONTENT_CREATOR_BLOG_PROJECTION}
`;

// Get content creator blogs by role
// - target "all": visible to everyone
// - target "business": visible only to companies and suppliers
export const CONTENT_CREATOR_BLOGS_BY_ROLE_QUERY = `
*[_type == "contentCreatorBlog" && (
  target == "all" ||
  (target == "business" && ($role == "company" || $role == "supplier"))
)] | order(_createdAt desc) ${CONTENT_CREATOR_BLOG_PROJECTION}
`;

// Get featured content creator blogs
export const FEATURED_CONTENT_CREATOR_BLOGS_QUERY = `
*[_type == "contentCreatorBlog" && featured == true] | order(_createdAt desc) ${CONTENT_CREATOR_BLOG_PROJECTION}
`;

// Get content creator blog by slug
export const CONTENT_CREATOR_BLOG_BY_SLUG_QUERY = `
*[_type == "contentCreatorBlog" && slug.current == $slug][0] ${CONTENT_CREATOR_BLOG_PROJECTION}
`;

// Get content creator blog by ID
export const CONTENT_CREATOR_BLOG_BY_ID_QUERY = `
*[_type == "contentCreatorBlog" && _id == $id][0] ${CONTENT_CREATOR_BLOG_PROJECTION}
`;
