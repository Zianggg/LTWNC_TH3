import type { MetadataRoute } from "next";
import { getDeadlines, getSubjects } from "@/lib/data";
import { absoluteUrl } from "@/lib/seo";

// Sinh lúc build; Server Action thêm/xoá deadline gọi revalidatePath("/sitemap.xml") để cập nhật.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [deadlines, subjects] = await Promise.all([getDeadlines(), getSubjects()]);
  const now = new Date();

  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/deadlines"), lastModified: now, changeFrequency: "hourly", priority: 0.9 },
    ...subjects.map((s) => ({
      url: absoluteUrl(`/subjects/${s.slug}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...deadlines.map((d) => ({
      url: absoluteUrl(`/deadlines/${d.id}`),
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
