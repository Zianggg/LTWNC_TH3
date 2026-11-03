// Sinh ảnh bìa 1200×630 cho từng môn: node scripts/gen-subject-images.mjs
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const subjects = JSON.parse(fs.readFileSync(path.join(root, "data/subjects.json"), "utf8"));
const outDir = path.join(root, "public/subjects");
fs.mkdirSync(outDir, { recursive: true });

// Mỗi môn một hoạ tiết hình học riêng, không dùng ảnh có bản quyền.
const motifs = [
  // web: cửa sổ trình duyệt + dấu ngoặc
  `<rect x="640" y="150" width="440" height="300" rx="28" fill="white" fill-opacity=".14"/>
   <rect x="640" y="150" width="440" height="56" rx="28" fill="white" fill-opacity=".22"/>
   <circle cx="682" cy="178" r="9" fill="white"/><circle cx="712" cy="178" r="9" fill="white" fill-opacity=".7"/><circle cx="742" cy="178" r="9" fill="white" fill-opacity=".45"/>
   <path d="M790 270 l-60 55 l60 55 M930 270 l60 55 l-60 55" stroke="white" stroke-width="22" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`,
  // CSDL phân tán: các nút trụ nối nhau
  `<g fill="white" fill-opacity=".9"><ellipse cx="740" cy="200" rx="70" ry="24"/><ellipse cx="980" cy="260" rx="70" ry="24"/><ellipse cx="820" cy="420" rx="70" ry="24"/></g>
   <g fill="white" fill-opacity=".25"><rect x="670" y="200" width="140" height="80"/><rect x="910" y="260" width="140" height="80"/><rect x="750" y="420" width="140" height="80"/></g>
   <path d="M760 300 L820 400 M960 360 L860 410 M810 230 L910 255" stroke="white" stroke-width="10" stroke-dasharray="4 18" stroke-linecap="round"/>`,
  // di động: điện thoại + bong bóng chat
  `<rect x="760" y="110" width="230" height="410" rx="40" fill="white" fill-opacity=".16" stroke="white" stroke-width="12"/>
   <rect x="820" y="130" width="110" height="18" rx="9" fill="white" fill-opacity=".6"/>
   <rect x="795" y="220" width="140" height="56" rx="24" fill="white" fill-opacity=".85"/>
   <rect x="830" y="300" width="130" height="56" rx="24" fill="white" fill-opacity=".45"/>
   <rect x="795" y="380" width="110" height="56" rx="24" fill="white" fill-opacity=".85"/>`,
  // kiểm thử: danh sách tick
  `<g stroke="white" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" fill="none">
     <path d="M690 210 l26 26 l48 -56"/><path d="M690 320 l26 26 l48 -56"/><path d="M700 410 l52 52 M752 410 l-52 52"/>
   </g>
   <g fill="white" fill-opacity=".55"><rect x="800" y="196" width="260" height="30" rx="15"/><rect x="800" y="306" width="220" height="30" rx="15"/><rect x="800" y="420" width="240" height="30" rx="15"/></g>`,
];

for (const [i, s] of subjects.entries()) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${s.color}"/><stop offset="1" stop-color="#0f172a"/></linearGradient></defs>
    <rect width="1200" height="630" fill="url(#g)"/>
    <circle cx="1080" cy="-40" r="260" fill="white" fill-opacity=".06"/><circle cx="120" cy="640" r="220" fill="white" fill-opacity=".05"/>
    <text x="90" y="300" font-family="Arial, sans-serif" font-size="120" font-weight="700" fill="white">${s.code}</text>
    <rect x="94" y="340" width="120" height="10" rx="5" fill="white" fill-opacity=".7"/>
    ${motifs[i % motifs.length]}
  </svg>`;
  const file = path.join(outDir, `${s.slug}.webp`);
  await sharp(Buffer.from(svg)).webp({ quality: 80 }).toFile(file);
  console.log("đã tạo", path.relative(root, file));
}
