"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { countdownLabel, daysUntil, formatDue, isUpcoming } from "@/lib/countdown";

export interface NextUpItem {
  id: string;
  title: string;
  dueAt: string;
  subjectName: string;
  color: string;
}

// Trang chủ là SSG nên "deadline gần nhất" phải chọn ở trình duyệt theo ngày thật.
export function NextUp({ items }: { items: NextUpItem[] }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => setNow(new Date()), []);

  const upcoming = now ? items.filter((d) => isUpcoming(d.dueAt, now)) : [];
  const next = upcoming[0];

  return (
    <section aria-labelledby="next-up-title" className="relative overflow-hidden rounded-xl bg-primary p-6 text-primary-foreground sm:p-8">
      <h2 id="next-up-title" className="text-sm font-medium text-primary-foreground/70">
        Hạn gần nhất
      </h2>
      {!now ? (
        <div className="mt-4 space-y-3" aria-hidden="true">
          <div className="h-16 w-40 rounded-md bg-primary-foreground/10" />
          <div className="h-6 w-3/4 rounded-md bg-primary-foreground/10" />
          <div className="h-4 w-1/2 rounded-md bg-primary-foreground/10" />
        </div>
      ) : next ? (
        <>
          <p className="mt-3 text-6xl font-bold leading-none tabular-nums sm:text-7xl">
            {daysUntil(next.dueAt, now) === 0 ? "Hôm nay" : `${daysUntil(next.dueAt, now)} ngày`}
          </p>
          <p className="mt-5 flex items-center gap-2 text-sm text-primary-foreground/70">
            <span className="size-2.5 rounded-full" style={{ backgroundColor: next.color }} aria-hidden="true" />
            {next.subjectName}
          </p>
          <Link href={`/deadlines/${next.id}`} className="mt-1 block text-xl font-semibold leading-snug text-balance underline-offset-4 hover:underline">
            {next.title}
          </Link>
          <p className="mt-2 text-sm text-primary-foreground/70">
            Hạn {formatDue(next.dueAt)}. {countdownLabel(daysUntil(next.dueAt, now))}.
          </p>
          {upcoming.length > 1 && (
            <p className="mt-6 border-t border-primary-foreground/15 pt-4 text-sm text-primary-foreground/70">
              Sau đó còn {upcoming.length - 1} deadline nữa đang chờ.
            </p>
          )}
        </>
      ) : (
        <p className="mt-4 text-lg">Không còn deadline nào sắp tới. Cả lớp đang được nghỉ.</p>
      )}
    </section>
  );
}
