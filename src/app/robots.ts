import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/account", "/checkout", "/api/", "/login", "/signup", "/otp"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
