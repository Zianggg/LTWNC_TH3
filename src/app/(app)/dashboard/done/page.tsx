import type { Metadata } from "next";
import { DeadlineCard } from "@/components/deadline-card";
import { getDashboardRows } from "@/lib/dashboard";
import { requireSession } from "@/lib/guards";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Đã hoàn thành",
  robots: { index: false, follow: false },
};

export default async function DonePage() {
  const session = await requireSession("/dashboard/done");
  const done = (await getDashboardRows(session.user.id)).filter((r) => r.done);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Đã hoàn thành</h1>
      <p className="mt-2 text-muted-foreground">{done.length} deadline bạn đã đánh dấu là xong.</p>
      {done.length > 0 ? (
        <ul className="mt-8 space-y-3">
          {done.map(({ deadline, subject }) => (
            <li key={deadline.id}>
              <DeadlineCard deadline={deadline} subject={subject} done />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-8 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          Chưa có bài nào được đánh dấu. Vào Tổng quan và bấm “Đánh dấu đã xong” khi nộp bài.
        </p>
      )}
    </div>
  );
}
