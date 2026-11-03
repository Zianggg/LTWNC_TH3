import { countdownLabel, daysUntil, formatDue, isUpcoming } from "@/lib/countdown";

// 23:30 ngày 03/11/2026 giờ Việt Nam: đã là 16:30 UTC, sát nửa đêm giờ VN.
const now = new Date("2026-11-03T23:30:00+07:00");

describe("daysUntil tính theo ngày lịch giờ Việt Nam", () => {
  test("hạn trong cùng ngày (dù đã qua giờ) là 0", () => {
    expect(daysUntil("2026-11-03T08:00:00+07:00", now)).toBe(0);
  });

  test("hạn 00:10 ngày mai là còn 1 ngày, không phải 0", () => {
    expect(daysUntil("2026-11-04T00:10:00+07:00", now)).toBe(1);
  });

  test("hạn 23:59 hôm qua là quá hạn 1 ngày", () => {
    expect(daysUntil("2026-11-02T23:59:00+07:00", now)).toBe(-1);
  });

  test("nhiều ngày phía trước", () => {
    expect(daysUntil("2026-11-10T23:59:00+07:00", now)).toBe(7);
  });
});

describe("countdownLabel", () => {
  test("còn hạn", () => expect(countdownLabel(5)).toBe("Còn 5 ngày"));
  test("hết hạn hôm nay", () => expect(countdownLabel(0)).toBe("Hết hạn hôm nay"));
  test("quá hạn", () => expect(countdownLabel(-2)).toBe("Quá hạn 2 ngày"));
});

describe("formatDue", () => {
  test("hiển thị theo giờ Việt Nam dạng dd/MM/yyyy HH:mm", () => {
    expect(formatDue("2026-11-10T23:59:00+07:00")).toBe("10/11/2026 23:59");
    expect(formatDue("2026-11-10T16:59:00Z")).toBe("10/11/2026 23:59");
  });
});

describe("isUpcoming so theo thời điểm, không theo ngày lịch", () => {
  const afternoon = new Date("2026-11-03T15:00:00+07:00");

  test("bài thi 09:00 hôm nay đã qua lúc 15:00 thì không còn là sắp tới", () => {
    expect(isUpcoming("2026-11-03T09:00:00+07:00", afternoon)).toBe(false);
  });

  test("hạn 23:59 hôm nay vẫn là sắp tới", () => {
    expect(isUpcoming("2026-11-03T23:59:00+07:00", afternoon)).toBe(true);
  });
});
