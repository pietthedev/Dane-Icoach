import type { MetadataRoute } from "next";

const BASE = "https://companionai.coach";

// Centralised list of all indexable URLs.
// Update lastModified when page content changes significantly.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: new Date("2026-05-23"),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE}/about-dane`,
      lastModified: new Date("2026-05-23"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/ai-coaching-companion`,
      lastModified: new Date("2026-05-23"),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE}/integral-coaching`,
      lastModified: new Date("2026-05-23"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE}/pricing`,
      lastModified: new Date("2026-05-23"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE}/faq`,
      lastModified: new Date("2026-05-23"),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE}/contact`,
      lastModified: new Date("2026-05-23"),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${BASE}/privacy`,
      lastModified: new Date("2026-05-23"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${BASE}/terms`,
      lastModified: new Date("2026-05-23"),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${BASE}/resources`,
      lastModified: new Date("2026-05-23"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE}/resources/what-is-ai-coaching`,
      lastModified: new Date("2026-05-23"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/resources/what-is-integral-coaching`,
      lastModified: new Date("2026-05-23"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/resources/how-to-build-confidence-before-a-difficult-conversation`,
      lastModified: new Date("2026-05-23"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/resources/how-to-find-your-voice`,
      lastModified: new Date("2026-05-23"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/resources/self-trust-coaching-exercises`,
      lastModified: new Date("2026-05-23"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE}/resources/ai-coaching-vs-human-coaching`,
      lastModified: new Date("2026-05-23"),
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];
}
