import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Trang riêng tư: chặn bot thu thập. /login và /dashboard còn có thêm meta noindex.
      disallow: ["/dashboard", "/admin", "/api/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
