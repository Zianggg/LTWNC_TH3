"use client";

import { useEffect, useState } from "react";
import { countdownLabel, daysUntil } from "@/lib/countdown";
import { cn } from "@/lib/utils";

// Trang được sinh sẵn lúc build nên "hôm nay" chỉ biết được ở trình duyệt.
// Lần render đầu giữ chỗ trống cùng kích thước để không bị lệch hydration hay giật layout.
export function Countdown({ dueAt, done = false, className }: { dueAt: string; done?: boolean; className?: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(timer);
  }, []);

  const base = "inline-flex h-7 min-w-28 items-center justify-center rounded-full px-3 text-xs font-semibold tabular-nums whitespace-nowrap";

  if (!now) {
    return <span className={cn(base, "bg-muted", className)} aria-hidden="true" />;
  }

  if (done) {
    return <span className={cn(base, "bg-done/10 text-done", className)}>Đã xong</span>;
  }

  const days = daysUntil(dueAt, now);
  const tone = days < 0 ? "bg-overdue/10 text-overdue" : days <= 3 ? "bg-soon/10 text-soon" : "bg-later/10 text-later";

  return (
    <span className={cn(base, tone, className)}>
      {countdownLabel(days)}
    </span>
  );
}
