import "server-only";
import fs from "node:fs/promises";
import path from "node:path";

export const OG_SIZE = { width: 1200, height: 630 };

// Satori (ImageResponse) không đọc được woff2 nên dùng bản .woff của @fontsource,
// nạp cả subset latin và vietnamese để chữ có dấu không bị thay bằng ô vuông.
const FONT_FILES = [
  { file: "be-vietnam-pro-latin-400-normal.woff", weight: 400 },
  { file: "be-vietnam-pro-vietnamese-400-normal.woff", weight: 400 },
  { file: "be-vietnam-pro-latin-700-normal.woff", weight: 700 },
  { file: "be-vietnam-pro-vietnamese-700-normal.woff", weight: 700 },
] as const;

export async function loadOgFonts() {
  return Promise.all(
    FONT_FILES.map(async ({ file, weight }) => ({
      name: "Be Vietnam Pro",
      data: await fs.readFile(path.join(process.cwd(), "assets/fonts", file)),
      weight,
      style: "normal" as const,
    })),
  );
}
