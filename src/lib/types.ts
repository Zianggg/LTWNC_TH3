export type Role = "admin" | "user";

export type DeadlineType = "assignment" | "quiz" | "project" | "exam";

export interface Subject {
  slug: string;
  code: string;
  name: string;
  lecturer: string;
  image: string;
  color: string;
  description: string;
}

export interface Deadline {
  id: string;
  subjectSlug: string;
  title: string;
  description: string;
  type: DeadlineType;
  /** ISO 8601 có offset, ví dụ 2026-11-10T23:59:00+07:00 */
  dueAt: string;
}

export interface UserRecord {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: Role;
}

export type NewDeadline = Omit<Deadline, "id">;

export const DEADLINE_TYPE_LABELS: Record<DeadlineType, string> = {
  assignment: "Bài tập",
  quiz: "Quiz",
  project: "Đồ án",
  exam: "Kiểm tra",
};
