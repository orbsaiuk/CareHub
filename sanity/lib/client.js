import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId } from "../env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Set to false if statically generating pages, using ISR or tag-based revalidation
  perspective: "published", // Only fetch published documents
  stega: {
    enabled: true,
    studioUrl: "/studio",
  },
});

// Client with no-cache for dynamic content
export const noStoreClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "published",
  stega: {
    enabled: true,
    studioUrl: "/studio",
  },
});

// Helper to fetch with no caching
export async function sanityFetch(query, params = {}) {
  return client.fetch(query, params, {
    next: { revalidate: 0 },
    cache: 'no-store',
  });
}
