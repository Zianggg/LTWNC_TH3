import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Countdown } from "@/components/countdown";
import { JsonLd } from "@/components/json-ld";
import { formatDue } from "@/lib/countdown";
import { getDeadline, getDeadlines, getSubject } from "@/lib/data";
import { SITE_NAME, breadcrumbJsonLd } from "@/lib/seo";
import { DEADLINE_TYPE_LABELS } from "@/lib/types";

type Props = { params: Promise<{ id: string }> };

// ISR theo yêu cầu (on-demand): 12 trang sinh sẵn lúc build và không tự hết hạn theo thời gian.
// Server Action thêm/xoá gọi revalidatePath để làm mới ngay; id mới được render lần đầu khi có người mở.
export const revalidate = false;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getDeadlines()).map((d) => ({ id: d.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const deadline = await getDeadline((await params).id);
  const subject = deadline ? await getSubject(deadline.subjectSlug) : null;
  if (!deadline || !subject) return { title: "Không tìm thấy deadline" };

  const summary = deadline.description.length > 150 ? `${deadline.description.slice(0, 147)}…` : deadline.description;
  const description = `${DEADLINE_TYPE_LABELS[deadline.type]} môn ${subject.name}, hạn ${formatDue(deadline.dueAt)}. ${summary}`;
  const url = `/deadlines/${deadline.id}`;
  // og:image do opengraph-image.tsx cùng thư mục tự sinh và gắn vào.
  return {
    title: deadline.title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", url, title: deadline.title, description, siteName: SITE_NAME, locale: "vi_VN" },
    twitter: { card: "summary_large_image", title: deadline.title, description },
  };
}

export default async function DeadlineDetailPage({ params }: Props) {
  const { id } = await params;
  const deadline = await getDeadline(id);
  if (!deadline) notFound();
  const subject = await getSubject(deadline.subjectSlug);
  if (!subject) notFound();

  const breadcrumb = breadcrumbJsonLd([
    { name: "Trang chủ", path: "/" },
    { name: subject.name, path: `/subjects/${subject.slug}` },
    { name: deadline.title, path: `/deadlines/${deadline.id}` },
  ]);

  return (
    <article className="mx-auto max-w-3xl py-10">
      <JsonLd data={breadcrumb} />
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/" className="hover:text-foreground hover:underline">Trang chủ</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/subjects/${subject.slug}`} className="hover:text-foreground hover:underline">{subject.name}</Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-foreground">{deadline.title}</li>
        </ol>
      </nav>

      <div className="mt-8 border-l-4 pl-5" style={{ borderColor: subject.color }}>
        <p className="text-sm font-medium text-muted-foreground">
          {DEADLINE_TYPE_LABELS[deadline.type]}, {subject.code}
        </p>
        <h1 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-balance sm:text-4xl">{deadline.title}</h1>
      </div>

      <dl className="mt-8 grid gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-3">
        <div className="bg-card p-4">
          <dt className="text-sm text-muted-foreground">Hạn nộp</dt>
          <dd className="mt-1 font-semibold tabular-nums">
            <time dateTime={deadline.dueAt}>{formatDue(deadline.dueAt)}</time>
          </dd>
        </div>
        <div className="bg-card p-4">
          <dt className="text-sm text-muted-foreground">Môn học</dt>
          <dd className="mt-1 font-semibold">
            <Link href={`/subjects/${subject.slug}`} className="hover:underline">{subject.name}</Link>
          </dd>
        </div>
        <div className="bg-card p-4">
          <dt className="text-sm text-muted-foreground">Thời gian còn lại</dt>
          <dd className="mt-1">
            <Countdown dueAt={deadline.dueAt} />
          </dd>
        </div>
      </dl>

      <h2 className="mt-10 text-lg font-semibold">Yêu cầu</h2>
      <p className="mt-2 max-w-prose leading-relaxed">{deadline.description}</p>

      <p className="mt-10 text-sm text-muted-foreground">
        Đã nộp bài?{" "}
        <Link href="/dashboard" className="font-medium text-foreground underline underline-offset-4">
          Mở bảng của bạn
        </Link>{" "}
        để đánh dấu đã xong.
      </p>
    </article>
  );
}
