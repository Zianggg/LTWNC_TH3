export const TIME_ZONE = "Asia/Ho_Chi_Minh";

const DAY_MS = 24 * 60 * 60 * 1000;
const calendarDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

// Ngày lịch (giờ VN) của một thời điểm, quy về nửa đêm UTC để trừ cho nhau.
function dayIndex(date: Date): number {
  const [y, m, d] = calendarDate.format(date).split("-").map(Number);
  return Date.UTC(y, m - 1, d) / DAY_MS;
}

/** Số ngày lịch từ hôm nay tới hạn: dương là còn, âm là đã quá hạn. */
export function daysUntil(dueAt: string, now: Date): number {
  return dayIndex(new Date(dueAt)) - dayIndex(now);
}

export function countdownLabel(days: number): string {
  if (days > 0) return `Còn ${days} ngày`;
  if (days === 0) return "Hết hạn hôm nay";
  return `Quá hạn ${-days} ngày`;
}

const dueFormat = new Intl.DateTimeFormat("vi-VN", {
  timeZone: TIME_ZONE,
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** Định dạng ngày hạn cố định (giống nhau ở server và client): 10/11/2026 23:59 */
export function formatDue(dueAt: string): string {
  const parts = Object.fromEntries(dueFormat.formatToParts(new Date(dueAt)).map((p) => [p.type, p.value]));
  return `${parts.day}/${parts.month}/${parts.year} ${parts.hour}:${parts.minute}`;
}
