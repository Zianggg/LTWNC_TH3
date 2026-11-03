import Link from "next/link";
import { Countdown } from "@/components/countdown";
import { TIME_ZONE, formatDue } from "@/lib/countdown";
import { DEADLINE_TYPE_LABELS, type Deadline, type Subject } from "@/lib/types";

const dayPart = new Intl.DateTimeFormat("vi-VN", { timeZone: TIME_ZONE, day: "2-digit" });
const monthPart = new Intl.DateTimeFormat("vi-VN", { timeZone: TIME_ZONE, month: "numeric" });
const weekdayPart = new Intl.DateTimeFormat("vi-VN", { timeZone: TIME_ZONE, weekday: "long" });

// Một dòng trong "sổ kế hoạch": cột ngày bên trái, nội dung ở giữa, đếm ngược bên phải.
export function DeadlineCard({
  deadline,
  subject,
  done,
  headingLevel = "h3",
}: {
  deadline: Deadline;
  subject: Subject;
  done?: boolean;
  /** Cấp tiêu đề theo ngữ cảnh trang để không nhảy cấp (h1 → h3). */
  headingLevel?: "h2" | "h3";
}) {
  const due = new Date(deadline.dueAt);
  const Heading = headingLevel;
  return (
    <article className="group relative grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-2 rounded-lg border bg-card p-4 transition-colors hover:border-ring/40 sm:grid-cols-[5rem_1fr_auto] sm:items-center">
      <time dateTime={deadline.dueAt} className="row-span-2 flex flex-col items-center border-r pr-4 text-center sm:row-span-1">
        <span className="text-3xl font-bold leading-none tabular-nums">{dayPart.format(due)}</span>
        <span className="mt-1 text-xs font-medium text-muted-foreground">Tháng {monthPart.format(due)}</span>
        <span className="text-xs text-muted-foreground capitalize">{weekdayPart.format(due)}</span>
      </time>
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: subject.color }} aria-hidden="true" />
          <span className="truncate">{subject.name}</span>
        </p>
        <Heading className="mt-1 text-base font-semibold leading-snug">
          <Link href={`/deadlines/${deadline.id}`} className="outline-none after:absolute after:inset-0 after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-ring">
            {deadline.title}
          </Link>
        </Heading>
        <p className="mt-1 text-sm text-muted-foreground">
          {DEADLINE_TYPE_LABELS[deadline.type]}, hạn {formatDue(deadline.dueAt)}
        </p>
      </div>
      <Countdown dueAt={deadline.dueAt} done={done} className="col-start-2 justify-self-start sm:col-start-3 sm:justify-self-end" />
    </article>
  );
}
