import type { Metadata } from "next";
import { DeadlineCard } from "@/components/deadline-card";
import { DeadlineFilter } from "@/components/deadline-filter";
import { getDeadlines, getSubjects } from "@/lib/data";

// ISR: phục vụ HTML tĩnh; quá 60 giây thì request kế tiếp kích hoạt sinh lại trang ở nền.
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tất cả deadline",
  description: "Danh sách toàn bộ deadline của lớp, lọc theo môn học và trạng thái còn hạn hay quá hạn.",
  alternates: { canonical: "/deadlines" },
};

export default async function DeadlinesPage() {
  const [deadlines, subjects] = await Promise.all([getDeadlines(), getSubjects()]);
  const subjectBySlug = new Map(subjects.map((s) => [s.slug, s]));

  const items = deadlines.flatMap((d) => {
    const subject = subjectBySlug.get(d.subjectSlug);
    if (!subject) return [];
    return [{ id: d.id, subjectSlug: d.subjectSlug, dueAt: d.dueAt, content: <DeadlineCard deadline={d} subject={subject} headingLevel="h2" /> }];
  });

  return (
    <div className="py-10">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Tất cả deadline</h1>
      <p className="mt-2 max-w-prose text-muted-foreground">Sắp theo ngày hạn. Danh sách được làm mới tối đa mỗi 60 giây.</p>
      <div className="mt-8">
        <DeadlineFilter items={items} subjects={subjects.map((s) => ({ slug: s.slug, name: s.name }))} />
      </div>
    </div>
  );
}
