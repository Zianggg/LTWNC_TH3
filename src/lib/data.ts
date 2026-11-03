import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import type { Deadline, NewDeadline, Subject, UserRecord } from "./types";

// Toàn bộ đọc/ghi file JSON đi qua module này.
type Completions = Record<string, string[]>;
/** Bộ đếm id chỉ tăng: id của deadline đã xoá không bao giờ được cấp lại (link cũ vẫn ra 404). */
type Meta = { lastDeadlineId: number };

const dataDir = () => process.env.DATA_DIR ?? path.join(process.cwd(), "data");

async function readJson<T>(file: string): Promise<T> {
  const raw = await fs.readFile(path.join(dataDir(), file), "utf8");
  return JSON.parse(raw) as T;
}

// Ghi ra file tạm rồi rename để không bao giờ để lại file JSON ghi dở.
async function writeJson(file: string, value: unknown): Promise<void> {
  const target = path.join(dataDir(), file);
  const tmp = `${target}.${process.pid}.${Date.now()}.tmp`;
  try {
    await fs.writeFile(tmp, JSON.stringify(value, null, 2) + "\n", "utf8");
    await fs.rename(tmp, target);
  } catch (error) {
    // Trên Vercel thư mục mã nguồn chỉ đọc: báo lỗi có tên để Server Action trả thông báo dễ hiểu.
    const code = (error as NodeJS.ErrnoException).code;
    if (code === "EROFS" || code === "EACCES" || code === "EPERM") throw new Error("READ_ONLY_STORAGE");
    throw error;
  }
}

// Các thao tác ghi chạy nối tiếp nhau để hai request không ghi đè lẫn nhau.
let writeQueue: Promise<unknown> = Promise.resolve();
function serialized<T>(task: () => Promise<T>): Promise<T> {
  const run = writeQueue.then(task, task);
  writeQueue = run.catch(() => undefined);
  return run;
}

const byDueAt = (a: Deadline, b: Deadline) =>
  new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime();

export async function getSubjects(): Promise<Subject[]> {
  return readJson<Subject[]>("subjects.json");
}

export async function getSubject(slug: string): Promise<Subject | null> {
  return (await getSubjects()).find((s) => s.slug === slug) ?? null;
}

export async function getDeadlines(): Promise<Deadline[]> {
  return (await readJson<Deadline[]>("deadlines.json")).sort(byDueAt);
}

export async function getDeadline(id: string): Promise<Deadline | null> {
  return (await getDeadlines()).find((d) => d.id === id) ?? null;
}

export async function getDeadlinesBySubject(slug: string): Promise<Deadline[]> {
  return (await getDeadlines()).filter((d) => d.subjectSlug === slug);
}

export async function findUserByEmail(email: string): Promise<UserRecord | null> {
  const normalized = email.trim().toLowerCase();
  const users = await readJson<UserRecord[]>("users.json");
  return users.find((u) => u.email.toLowerCase() === normalized) ?? null;
}

export async function getCompletedIds(userId: string): Promise<string[]> {
  const completions = await readJson<Completions>("completions.json");
  return completions[userId] ?? [];
}

export function setCompleted(userId: string, deadlineId: string, done: boolean): Promise<void> {
  return serialized(async () => {
    if (!(await getDeadline(deadlineId))) throw new Error("DEADLINE_NOT_FOUND");
    const completions = await readJson<Completions>("completions.json");
    const current = new Set(completions[userId] ?? []);
    if (done) current.add(deadlineId);
    else current.delete(deadlineId);
    completions[userId] = [...current];
    await writeJson("completions.json", completions);
  });
}

export function createDeadline(input: NewDeadline): Promise<Deadline> {
  return serialized(async () => {
    const deadlines = await readJson<Deadline[]>("deadlines.json");
    const meta = await readJson<Meta>("meta.json").catch((): Meta => ({ lastDeadlineId: 0 }));
    const maxExisting = deadlines.reduce((max, d) => Math.max(max, Number(d.id) || 0), 0);
    const nextId = Math.max(meta.lastDeadlineId, maxExisting) + 1;
    const created: Deadline = { ...input, id: String(nextId) };
    await writeJson("deadlines.json", [...deadlines, created]);
    await writeJson("meta.json", { lastDeadlineId: nextId } satisfies Meta);
    return created;
  });
}

export function deleteDeadline(id: string): Promise<boolean> {
  return serialized(async () => {
    const deadlines = await readJson<Deadline[]>("deadlines.json");
    const remaining = deadlines.filter((d) => d.id !== id);
    if (remaining.length === deadlines.length) return false;
    await writeJson("deadlines.json", remaining);

    const completions = await readJson<Completions>("completions.json");
    for (const userId of Object.keys(completions)) {
      completions[userId] = completions[userId].filter((doneId) => doneId !== id);
    }
    await writeJson("completions.json", completions);
    return true;
  });
}
