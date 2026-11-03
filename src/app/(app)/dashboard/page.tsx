import type { Metadata } from "next";
import { DeadlineCard } from "@/components/deadline-card";
import { ToggleDoneButton } from "@/components/toggle-done-button";
import { getDashboardRows, summarize } from "@/lib/dashboard";
import { requireSession } from "@/lib/guards";

// SSR: mỗi request render lại theo phiên của người đang xem.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Bảng của tôi",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const session = await requireSession("/dashboard");
  const rows = await getDashboardRows(session.user.id);
  const stats = summarize(rows, new Date());
  const pending = rows.filter((r) => !r.done);

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">Chào {session.user.name}</h1>
      <p className="mt-2 text-muted-foreground">Đánh dấu bài đã nộp để bảng này chỉ còn những việc cần làm.</p>

      <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border sm:grid-cols-4">
        <Stat label="Tổng deadline" value={stats.total} />
        <Stat label="Đã xong" value={stats.done} />
        <Stat label="Hạn trong 7 ngày" value={stats.dueThisWeek} tone="text-soon" />
        <Stat label="Quá hạn chưa xong" value={stats.overdue} tone="text-overdue" />
      </dl>

      <h2 className="mt-10 text-xl font-bold tracking-tight">Chưa hoàn thành</h2>
      {pending.length > 0 ? (
        <ul className="mt-4 space-y-6 sm:space-y-3">
          {pending.map(({ deadline, subject }) => (
            <li key={deadline.id} className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1">
                <DeadlineCard deadline={deadline} subject={subject} />
              </div>
              <ToggleDoneButton id={deadline.id} done={false} title={deadline.title} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
          Bạn đã xong toàn bộ deadline. Khi lớp trưởng thêm bài mới, bài đó sẽ hiện ở đây.
        </p>
      )}
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div className="bg-card p-4">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className={`mt-1 text-3xl font-bold tabular-nums ${tone ?? ""}`}>{value}</dd>
    </div>
  );
}
