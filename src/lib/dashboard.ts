import "server-only";
import { daysUntil, isUpcoming } from "./countdown";
import { getCompletedIds, getDeadlines, getSubjects } from "./data";
import type { Deadline, Subject } from "./types";

export interface DashboardRow {
  deadline: Deadline;
  subject: Subject;
  done: boolean;
}

/** Dữ liệu cho /dashboard: mọi deadline kèm môn học và trạng thái đã xong của người dùng. */
export async function getDashboardRows(userId: string): Promise<DashboardRow[]> {
  const [deadlines, subjects, completed] = await Promise.all([getDeadlines(), getSubjects(), getCompletedIds(userId)]);
  const subjectBySlug = new Map(subjects.map((s) => [s.slug, s]));
  const doneIds = new Set(completed);

  return deadlines.flatMap((deadline) => {
    const subject = subjectBySlug.get(deadline.subjectSlug);
    return subject ? [{ deadline, subject, done: doneIds.has(deadline.id) }] : [];
  });
}

export function summarize(rows: DashboardRow[], now: Date) {
  const pending = rows.filter((r) => !r.done);
  return {
    total: rows.length,
    done: rows.length - pending.length,
    overdue: pending.filter((r) => !isUpcoming(r.deadline.dueAt, now)).length,
    dueThisWeek: pending.filter((r) => isUpcoming(r.deadline.dueAt, now) && daysUntil(r.deadline.dueAt, now) <= 7).length,
  };
}
