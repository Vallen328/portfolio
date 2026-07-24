import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://your-domain.com/en",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}