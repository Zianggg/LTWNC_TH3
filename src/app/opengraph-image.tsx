import { ImageResponse } from "next/og";
import { getDeadlines, getSubjects } from "@/lib/data";
import { OG_SIZE, loadOgFonts } from "@/lib/og";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Class Deadline Hub, cổng deadline của lớp";

// Ảnh chia sẻ mặc định cho các trang không có ảnh riêng (trang chủ, /deadlines).
export default async function Image() {
  const [subjects, deadlines, fonts] = await Promise.all([getSubjects(), getDeadlines(), loadOgFonts()]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          fontFamily: "Be Vietnam Pro",
          background: "#172036",
          color: "#f6f7fa",
        }}
      >
        <span style={{ fontSize: 32, fontWeight: 700 }}>Class Deadline Hub</span>
        <span style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.08, letterSpacing: -2 }}>
          Mọi hạn nộp của lớp, xếp theo từng ngày.
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {subjects.map((s) => (
            <div key={s.slug} style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 26, color: "#c9cfdc" }}>
              <div style={{ width: 18, height: 18, borderRadius: 999, background: s.color, display: "flex" }} />
              {s.code}
            </div>
          ))}
          <span style={{ marginLeft: "auto", fontSize: 26, color: "#c9cfdc" }}>{deadlines.length} deadline</span>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
