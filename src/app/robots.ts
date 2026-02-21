import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/signin",
          "/signup",
          "/terms-of-service",
          "/privacy-policy",
          "/about",
        ],
        disallow: [
          "/dashboard",
          "/calendar",
          "/settings",
          "/morning",
          "/evening",
          "/concern-topics",
          "/api/",
        ],
      },
    ],
    sitemap: "https://climode.app/sitemap.xml",
  };
}
