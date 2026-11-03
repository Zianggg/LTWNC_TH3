import type { Metadata } from "next";
import { formatDue } from "@/lib/countdown";
import { getDeadlines, getSubjects } from "@/lib/data";
import { requirePermission } from "@/lib/guards";
import { DEADLINE_TYPE_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quản trị deadline",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  // Kiểm tra quyền TRƯỚC khi đọc dữ liệu, kể cả khi Middleware bị cấu hình sai hoặc bị vượt qua.
  await requirePermission("deadline:create", "/admin");
  const [deadlines, subjects] = await Promise.all([getDeadlines(), getSubjects()]);
  const subjectBySlug = new Map(subjects.map((s) => [s.slug, s]));

  return (
    <main id="noi-dung">
      <h1 className="text-3xl font-bold tracking-tight">Quản trị deadline</h1>
      <p className="mt-2 text-muted-foreground">Thêm deadline mới hoặc xoá deadline đã huỷ. Trang công khai được cập nhật ngay sau khi lưu.</p>

      <div className="mt-8 overflow-x-auto rounded-lg border bg-card">
        <table className="w-full text-sm">
          <caption className="sr-only">Danh sách {deadlines.length} deadline</caption>
          <thead className="border-b bg-muted/50 text-left text-muted-foreground">
            <tr>
              <th scope="col" className="px-4 py-3 font-medium">Id</th>
              <th scope="col" className="px-4 py-3 font-medium">Deadline</th>
              <th scope="col" className="px-4 py-3 font-medium">Môn</th>
              <th scope="col" className="px-4 py-3 font-medium">Hạn</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {deadlines.map((d) => (
              <tr key={d.id}>
                <td className="px-4 py-3 tabular-nums text-muted-foreground">{d.id}</td>
                <td className="px-4 py-3">
                  <p className="font-medium">{d.title}</p>
                  <p className="text-muted-foreground">{DEADLINE_TYPE_LABELS[d.type]}</p>
                </td>
                <td className="px-4 py-3">{subjectBySlug.get(d.subjectSlug)?.name}</td>
                <td className="px-4 py-3 whitespace-nowrap tabular-nums">{formatDue(d.dueAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
