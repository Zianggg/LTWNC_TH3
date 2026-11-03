// Ưu tiên SITE_URL; trên Vercel tự dùng domain production; chạy trên máy thì localhost.
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : undefined;
export const SITE_URL = (process.env.SITE_URL || vercelUrl || "http://localhost:3000").replace(/\/+$/, "");
export const SITE_NAME = "Class Deadline Hub";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** JSON cho thẻ <script type="application/ld+json">: escape "<" để dữ liệu không thể đóng thẻ script. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
