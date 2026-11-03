import { serializeJsonLd } from "@/lib/seo";

/** Structured data cho Google (Rich Results). Render ở server, nằm sẵn trong HTML. */
export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
