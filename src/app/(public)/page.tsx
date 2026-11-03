import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { NextUp } from "@/components/next-up";
import { getDeadlines, getSubjects } from "@/lib/data";

// SSG: không dùng cookie, không revalidate. HTML được sinh một lần lúc build.
export default async function HomePage() {
  const [subjects, deadlines] = await Promise.all([getSubjects(), getDeadlines()]);
  const subjectBySlug = new Map(subjects.map((s) => [s.slug, s]));

  const nextUpItems = deadlines.map((d) => {
    const subject = subjectBySlug.get(d.subjectSlug);
    return { id: d.id, title: d.title, dueAt: d.dueAt, subjectName: subject?.name ?? "", color: subject?.color ?? "#64748b" };
  });

  return (
    <>
      <section className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <div>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-balance sm:text-5xl">
            Mọi hạn nộp của lớp, xếp theo từng ngày.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
            {subjects.length} môn học, {deadlines.length} deadline. Xem còn bao nhiêu ngày, mở chi tiết từng bài, đăng nhập để đánh dấu những bài đã nộp.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/deadlines">Xem tất cả deadline</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dashboard">Bảng của tôi</Link>
            </Button>
          </div>
        </div>
        <NextUp items={nextUpItems} />
      </section>

      <section id="mon-hoc" aria-labelledby="subjects-title" className="scroll-mt-20 py-8">
        <h2 id="subjects-title" className="text-2xl font-bold tracking-tight">
          Môn học trong kỳ
        </h2>
        <ul className="mt-6 grid gap-5 sm:grid-cols-2">
          {subjects.map((subject, index) => {
            const count = deadlines.filter((d) => d.subjectSlug === subject.slug).length;
            return (
              <li key={subject.slug}>
                <Link href={`/subjects/${subject.slug}`} className="group block overflow-hidden rounded-lg border bg-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
                  <Image
                    src={subject.image}
                    alt={`Ảnh bìa môn ${subject.name}`}
                    width={1200}
                    height={630}
                    sizes="(min-width: 1152px) 560px, (min-width: 640px) 50vw, 100vw"
                    priority={index < 2}
                    className="aspect-[1200/630] h-auto w-full object-cover"
                  />
                  <div className="p-5">
                    <h3 className="font-semibold leading-snug group-hover:underline group-hover:underline-offset-4">{subject.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {subject.lecturer}, {count} deadline
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
