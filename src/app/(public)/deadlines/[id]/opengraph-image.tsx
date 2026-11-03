import { ImageResponse } from "next/og";
import { formatDue } from "@/lib/countdown";
import { getDeadline, getDeadlines, getSubject } from "@/lib/data";
import { OG_SIZE, loadOgFonts } from "@/lib/og";
import { DEADLINE_TYPE_LABELS } from "@/lib/types";

export const size = OG_SIZE;
export const contentType = "image/png";
export const alt = "Ảnh chia sẻ của deadline";
export const revalidate = false;
export const dynamicParams = true;

export async function generateStaticParams() {
  return (await getDeadlines()).map((d) => ({ id: d.id }));
}

type Props = { params: Promise<{ id: string }> };

// Mỗi deadline một ảnh 1200×630: màu môn học, tên bài, ngày hạn. Next tự gắn thẻ og:image.
export default async function Image({ params }: Props) {
  const { id } = await params;
  const deadline = await getDeadline(id);
  const subject = deadline ? await getSubject(deadline.subjectSlug) : null;
  const fonts = await loadOgFonts();

  const color = subject?.color ?? "#172036";
  const title = deadline?.title ?? "Không tìm thấy deadline";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          fontFamily: "Be Vietnam Pro",
          background: "#f6f7fa",
          color: "#172036",
        }}
      >
        <div style={{ width: 28, height: "100%", background: color, display: "flex" }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "64px 72px", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 30, color: "#5b6478" }}>
            <div style={{ width: 22, height: 22, borderRadius: 999, background: color, display: "flex" }} />
            <span>{subject ? `${subject.code}  ${subject.name}` : "Class Deadline Hub"}</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {deadline && (
              <span style={{ fontSize: 30, fontWeight: 700, color }}>{DEADLINE_TYPE_LABELS[deadline.type]}</span>
            )}
            <span style={{ fontSize: title.length > 40 ? 66 : 80, fontWeight: 700, lineHeight: 1.1, letterSpacing: -1.5 }}>{title}</span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            {deadline ? (
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: 26, color: "#5b6478" }}>Hạn nộp</span>
                <span style={{ fontSize: 56, fontWeight: 700 }}>{formatDue(deadline.dueAt)}</span>
              </div>
            ) : (
              <span />
            )}
            <span style={{ fontSize: 28, fontWeight: 700, color: "#5b6478" }}>Class Deadline Hub</span>
          </div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
