"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { daysUntil } from "@/lib/countdown";
import { cn } from "@/lib/utils";

type Status = "all" | "upcoming" | "overdue";

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: "all", label: "Tất cả" },
  { value: "upcoming", label: "Sắp tới" },
  { value: "overdue", label: "Quá hạn" },
];

export interface FilterItem {
  id: string;
  subjectSlug: string;
  dueAt: string;
  /** Thẻ deadline đã render sẵn ở server. */
  content: ReactNode;
}

// Chỉ phần lọc chạy ở client; nội dung từng thẻ vẫn là HTML do server render.
export function DeadlineFilter({ items, subjects }: { items: FilterItem[]; subjects: { slug: string; name: string }[] }) {
  const [subject, setSubject] = useState("all");
  const [status, setStatus] = useState<Status>("all");
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => setNow(new Date()), []);

  const visible = useMemo(
    () =>
      items.filter((item) => {
        if (subject !== "all" && item.subjectSlug !== subject) return false;
        if (status === "all" || !now) return true;
        const days = daysUntil(item.dueAt, now);
        return status === "overdue" ? days < 0 : days >= 0;
      }),
    [items, subject, status, now],
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="inline-flex rounded-lg border bg-card p-1" role="group" aria-label="Lọc theo trạng thái">
          {STATUS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={status === option.value}
              onClick={() => setStatus(option.value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                status === option.value ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Môn học
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="h-9 rounded-md border bg-card px-3 text-sm text-foreground focus-visible:outline-2 focus-visible:outline-ring"
          >
            <option value="all">Tất cả môn</option>
            {subjects.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="text-sm text-muted-foreground" aria-live="polite">
        Đang hiện {visible.length} trên {items.length} deadline
      </p>

      {visible.length > 0 ? (
        <ul className="space-y-3">
          {visible.map((item) => (
            <li key={item.id}>{item.content}</li>
          ))}
        </ul>
      ) : (
        <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
          Không có deadline nào khớp bộ lọc. Chọn “Tất cả” để xem lại toàn bộ.
        </p>
      )}
    </div>
  );
}
