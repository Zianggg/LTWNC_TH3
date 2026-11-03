import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { DeadlineCard } from "@/components/deadline-card";
import { getDeadlinesBySubject, getSubject, getSubjects } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

// SSG: sinh sẵn đủ 4 môn lúc build. Slug lạ gọi notFound() nên vẫn ra 404.
// Không dùng dynamicParams = false: khi admin thêm/xoá, revalidatePath làm các trang này
// bị purge và Next 15 trả 404 cho mọi slug vì không được phép render lại.
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getSubjects()).map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const subject = await getSubject((await params).slug);
  if (!subject) return { title: "Không tìm thấy môn học" };
  return {
    title: subject.name,
    description: `Deadline môn ${subject.name} (${subject.code}), ${subject.lecturer}. ${subject.description}`,
    alternates: { canonical: `/subjects/${subject.slug}` },
    openGraph: { images: [{ url: subject.image, width: 1200, height: 630, alt: subject.name }] },
  };
}

export default async function SubjectPage({ params }: Props) {
  const { slug } = await params;
  const subject = await getSubject(slug);
  if (!subject) notFound();
  const deadlines = await getDeadlinesBySubject(slug);

  return (
    <div className="py-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{subject.code}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance sm:text-4xl">{subject.name}</h1>
          <p className="mt-2 text-muted-foreground">Giảng viên: {subject.lecturer}</p>
          <p className="mt-4 max-w-prose leading-relaxed">{subject.description}</p>
        </div>
        <Image
          src={subject.image}
          alt={`Ảnh bìa môn ${subject.name}`}
          width={1200}
          height={630}
          priority
          sizes="(min-width: 1024px) 600px, 100vw"
          className="h-auto w-full rounded-lg border"
        />
      </div>

      <h2 className="mt-12 text-xl font-bold tracking-tight">{deadlines.length} deadline của môn</h2>
      <ul className="mt-4 space-y-3">
        {deadlines.map((d) => (
          <li key={d.id}>
            <DeadlineCard deadline={d} subject={subject} />
          </li>
        ))}
      </ul>
    </div>
  );
}
