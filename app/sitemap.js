import { client } from "@/sanity/lib/client";

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Fetch all companies
  const companies = await client.fetch(`
    *[_type == "tenant" && tenantType == "company" && !(_id in path("drafts.**"))] {
      "slug": slug.current,
      _updatedAt
    }
  `);

  // Fetch all suppliers
  const suppliers = await client.fetch(`
    *[_type == "tenant" && tenantType == "supplier" && !(_id in path("drafts.**"))] {
      "slug": slug.current,
      _updatedAt
    }
  `);

  // Fetch all blogs
  const blogs = await client.fetch(`
    *[_type == "blog" && !(_id in path("drafts.**"))] {
      "slug": slug.current,
      _updatedAt,
      publishedAt
    }
  `);

  // Fetch all categories
  const categories = await client.fetch(`
    *[_type == "category" && !(_id in path("drafts.**"))] {
      "slug": slug.current,
      _updatedAt
    }
  `);

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/companies`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/suppliers`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/offers`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/become`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Dynamic company pages
  const companyPages = companies.map((company) => ({
    url: `${baseUrl}/companies/${company.slug}`,
    lastModified: new Date(company._updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic supplier pages
  const supplierPages = suppliers.map((supplier) => ({
    url: `${baseUrl}/suppliers/${supplier.slug}`,
    lastModified: new Date(supplier._updatedAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Dynamic blog pages
  const blogPages = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: new Date(blog._updatedAt || blog.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...companyPages,
    ...supplierPages,
    ...blogPages,
  ];
}
