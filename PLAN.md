# Kế hoạch — LTWNC BTTH 3: Class Deadline Hub

> Đề gốc: `C:\Users\ADMIN\Downloads\LTWNC BTTH 3 Xây dựng Class Deadline Hub.md`
> Bám theo slide Buổi 7 (SSR/SSG/ISR, App Router) và Buổi 8 (Auth.js, Middleware, RBAC, SEO) trong `Tong_hop_Buoi1-8.md`.

## 0. Tóm tắt đề

Cổng deadline của lớp: khách xem deadline công khai (có SEO + ảnh chia sẻ), sinh viên đăng nhập để đánh dấu đã xong, lớp trưởng (admin) thêm/xoá deadline. Dữ liệu là file JSON phía server: 4 môn, khoảng 12 deadline. Hai tài khoản bắt buộc: `admin@ptit.edu.vn / admin123` (admin), `sv@ptit.edu.vn / sv123456` (user).

## 1. Công nghệ

| Hạng mục | Chọn | Lý do |
|---|---|---|
| Framework | **Next.js 15.5.x** (App Router, `src/`, TypeScript) | Slide viết theo cú pháp Next 15 và dùng `middleware.ts`. Next 16 (bản latest 16.4) đổi tên Middleware thành `proxy.ts` và coi `middleware.ts` là deprecated, dễ lệch với đề và tiêu chí chấm. |
| Auth | `next-auth@beta` (Auth.js v5, hiện 5.0.0-beta.32) | Đúng slide; có `auth()` dùng chung cho Server Component, Middleware và Server Action. |
| UI | Tailwind v4 + shadcn/ui + lucide | Stack quen thuộc. |
| Validate | `zod` | Slide 27. |
| Băm mật khẩu | `bcryptjs` | Không lưu mật khẩu dạng thô trong `users.json`. |
| Test (điểm cộng) | Jest + ts-jest | Test `can()`. |

## 2. Cấu trúc thư mục dự kiến

```
LTWNC_TH3/
├─ data/
│  ├─ subjects.json        # 4 môn: slug, tên, giảng viên, ảnh
│  ├─ deadlines.json       # ~12 deadline: id "1".."12", subjectSlug, title, dueAt, mô tả
│  ├─ users.json           # 2 tài khoản, mật khẩu đã băm bcrypt
│  └─ completions.json     # { [userId]: string[] } các deadline đã xong
├─ public/subjects/*.webp  # ảnh môn học cho next/image
├─ src/
│  ├─ auth.config.ts       # cấu hình nhẹ (callbacks, pages) — dùng được ở Edge/Middleware
│  ├─ auth.ts              # NextAuth đầy đủ: Credentials (+ GitHub), JWT session
│  ├─ middleware.ts        # bảo vệ /dashboard, /admin
│  ├─ types/next-auth.d.ts # Role = 'admin' | 'user'; mở rộng Session, User, JWT
│  ├─ lib/
│  │  ├─ permissions.ts    # MA TRẬN DUY NHẤT + can(role, action)
│  │  ├─ data.ts           # đọc/ghi JSON (fs/promises), 'server-only'
│  │  ├─ schemas.ts        # zod schema cho form thêm/xoá/đánh dấu
│  │  └─ seo.ts            # SITE_URL, hàm tạo JSON-LD
│  ├─ actions/             # Server Actions: toggleDone, createDeadline, deleteDeadline, login, logout
│  ├─ components/
│  │  ├─ header/           # Header (server) + UserMenu (client, useSession)
│  │  ├─ countdown.tsx     # 'use client' — "Còn X ngày / Quá hạn Y ngày"
│  │  ├─ deadline-filter.tsx # 'use client' — lọc theo môn / trạng thái
│  │  └─ dashboard-nav.tsx # 'use client' — usePathname để tô sáng menu
│  └─ app/
│     ├─ layout.tsx        # next/font (Be Vietnam Pro, subset vietnamese), SessionProvider
│     ├─ not-found.tsx     # 404 của dự án
│     ├─ error.tsx / loading.tsx
│     ├─ sitemap.ts / robots.ts
│     ├─ (public)/
│     │  ├─ layout.tsx     # header + footer công khai
│     │  ├─ page.tsx                       # /            SSG
│     │  ├─ subjects/[slug]/page.tsx       # SSG (generateStaticParams, dynamicParams=false)
│     │  ├─ deadlines/page.tsx             # ISR revalidate = 60
│     │  ├─ deadlines/[id]/page.tsx        # ISR on-demand + generateMetadata + JSON-LD
│     │  ├─ deadlines/[id]/opengraph-image.tsx
│     │  ├─ login/page.tsx                 # noindex
│     │  └─ 403/page.tsx
│     ├─ (app)/
│     │  ├─ layout.tsx     # khung ứng dụng (đã đăng nhập)
│     │  ├─ dashboard/layout.tsx           # sidebar lồng nhau
│     │  ├─ dashboard/page.tsx             # SSR, noindex
│     │  ├─ dashboard/done/page.tsx        # (trang con thứ 2 để menu có ý nghĩa)
│     │  └─ admin/page.tsx                 # SSR, chỉ admin
│     └─ api/auth/[...nextauth]/route.ts
├─ __tests__/permissions.test.ts
└─ README.md
```

## 3. Các điểm dễ mất điểm — phải xử lý đúng

1. **Header đọc phiên sẽ phá SSG/ISR.** Nếu layout gọi `auth()` (đọc cookie) thì mọi trang con bị chuyển sang dynamic, và `npm run build` sẽ không còn hiện `○` / `●` cho `/`, `/subjects/[slug]`, `/deadlines`. Cách làm: phần "tên, vai trò, Đăng nhập/Đăng xuất" là Client Component dùng `useSession()`; trang public không gọi `auth()`.
2. **Đếm ngược trên trang tĩnh.** HTML được sinh lúc build nên số ngày phải tính ở client sau khi mount, nếu không sẽ bị lệch hydration và sai ngày. → `Countdown` là `'use client'`, server chỉ render ngày hạn cố định.
3. **ISR on-demand cho `/deadlines/[id]`.** Dùng `generateStaticParams` + `dynamicParams = true` (deadline mới thêm vẫn render được) + `revalidate = false`. Server Action thêm/xoá gọi `revalidatePath('/deadlines/[id]', 'page')`, `revalidatePath('/deadlines')`, `revalidatePath('/subjects/[slug]', 'page')`, `revalidatePath('/')`. Id không tồn tại thì gọi `notFound()`.
4. **Phân quyền nhiều lớp.** Middleware chỉ là lớp 1. Trang `/admin` tự gọi `auth()` + `can()`. Mọi Server Action đều kiểm tra: phiên → `can(role, action)` → `zod.parse` → mới ghi file.
5. **Edge runtime.** Middleware import từ `auth.config.ts` (không có bcrypt hay fs); `auth.ts` mới chứa Credentials `authorize`.
6. **Middleware:** chưa đăng nhập → `/login?callbackUrl=<đường dẫn cũ>`; đã đăng nhập là user mà vào `/admin` → `/403`. Trang login đọc `callbackUrl` để quay lại.
7. **Kiểu Role:** `type Role = 'admin' | 'user'` cho session; `'guest'` chỉ xuất hiện trong ma trận quyền. Không dùng `string`.
8. **noindex:** `/login` và `/dashboard` khai báo `metadata.robots = { index: false }`; `robots.ts` chặn `/dashboard`, `/admin`.
9. **Ghi file JSON khi chạy trên Vercel:** filesystem trên Vercel là read-only nên thêm/xoá/đánh dấu sẽ không lưu được. Nếu làm điểm cộng deploy thì ghi rõ trong README (bản deploy để demo phần xem + SEO), hoặc chuyển sang Vercel Blob/KV — quyết định khi tới bước đó.

## 4. Ma trận phân quyền (`src/lib/permissions.ts`)

```ts
export type Role = 'guest' | 'user' | 'admin';
export type Action = 'deadline:read' | 'deadline:complete' | 'deadline:create' | 'deadline:delete';
const PERMISSIONS: Record<Role, readonly Action[]> = {
  guest: ['deadline:read'],
  user:  ['deadline:read', 'deadline:complete'],
  admin: ['deadline:read', 'deadline:complete', 'deadline:create', 'deadline:delete'],
};
export const can = (role: Role, action: Action) => PERMISSIONS[role].includes(action);
```

Middleware, trang `/admin` và các Server Action đều import từ file này.

## 5. Các giai đoạn thực hiện

| # | Giai đoạn | Việc chính | Kiểm tra xong khi |
|---|---|---|---|
| 1 | Khởi tạo | `create-next-app@15` (TS, Tailwind, src, App Router), shadcn, next/font tiếng Việt, layout gốc | `npm run dev` chạy, chữ có dấu hiển thị đúng font |
| 2 | Dữ liệu | Seed 4 môn + 12 deadline (trộn quá hạn / sắp tới), 2 user (bcrypt), `lib/data.ts` đọc/ghi JSON | Có hàm `getDeadlines`, `getDeadline(id)`, `getSubjects`, ... |
| 3 | Trang public + render | `/`, `/subjects/[slug]`, `/deadlines` (ISR 60s), `/deadlines/[id]` (ISR on-demand), not-found, loading, error có nút "Thử lại" | `npm run build` hiện đúng ký hiệu ○ / ● cho từng route; `/deadlines/999` ra 404 của dự án |
| 4 | Client components | Countdown, bộ lọc, menu tô sáng | Chỉ những file này có `'use client'` |
| 5 | Auth | `auth.config.ts`, `auth.ts`, route handler, `next-auth.d.ts`, trang login, Header hiển thị tên + vai trò | Đăng nhập được bằng 2 tài khoản; `session.user.role` có kiểu đúng |
| 6 | Phân quyền | `permissions.ts`, `middleware.ts`, `/403`, `/dashboard` (SSR, sidebar), `/admin` (SSR) | Khách vào `/dashboard` → `/login?callbackUrl=/dashboard`; sv vào `/admin` → `/403` |
| 7 | Server Actions | toggleDone, createDeadline, deleteDeadline: auth + can + zod + revalidatePath | Admin thêm deadline → `/deadlines/13` xem được ngay; gọi action bằng tài khoản sv bị từ chối |
| 8 | SEO | `generateMetadata` + `opengraph-image.tsx` cho `/deadlines/[id]`, sitemap (đủ mọi deadline), robots, JSON-LD BreadcrumbList, next/image | view-source `/deadlines/1` có title, og:image, JSON-LD |
| 9 | Điểm cộng | Jest cho `can()`; GitHub OAuth (vai trò mặc định `user`); deploy Vercel | `npm test` xanh |
| 10 | Đo và nộp | `npm run build && npm start`, Lighthouse cho `/` và `/deadlines/1`, chụp ảnh, viết README, dọn `node_modules` và `.next` | README đủ 5 mục nộp bài |

## 6. README cần có

- Cách chạy (`npm i`, tạo `.env.local` với `AUTH_SECRET`, `npm run build`, `npm start`), tài khoản demo.
- Ảnh kết quả `npm run build` + bảng "route → chiến lược → lý do".
- Điểm Lighthouse (production) cho `/` và `/deadlines/1`.
- Ảnh view-source của `/deadlines/1`.
- Trả lời 2 câu hỏi:
  1. *Vì sao `/deadlines/[id]` dùng ISR?* Nội dung công khai, cần SEO và tải nhanh như trang tĩnh, nhưng thay đổi khi admin thêm/xoá. ISR on-demand cho HTML tĩnh phục vụ từ cache, chỉ sinh lại đúng lúc dữ liệu đổi. SSG thuần sẽ bị cũ cho tới lần build sau; SSR thì tốn tài nguyên server cho mỗi request.
  2. *Chỉ dùng Middleware để bảo vệ `/admin` thì có rủi ro gì?* Server Action là endpoint công khai, gọi thẳng được mà không đi qua matcher của Middleware. Matcher có thể cấu hình thiếu hoặc sai. Middleware chỉ kiểm tra phiên nhẹ ở Edge. Từng có lỗ hổng bỏ qua Middleware (CVE-2025-29927, header `x-middleware-subrequest`). → Cần kiểm tra lại ở page và trong từng action (defense in depth).

## 7. Câu hỏi cần chốt trước khi code

1. Dùng **Next 15.5** (khớp slide và tên `middleware.ts`) hay **Next 16** (stack quen thuộc, nhưng Middleware đã đổi tên thành `proxy.ts`)? → Đề xuất: Next 15.5.
2. Có làm điểm cộng không: GitHub OAuth / deploy Vercel / Jest? → Đề xuất: làm Jest (rẻ, chắc điểm) + GitHub OAuth; deploy Vercel để cuối.
3. Tên 4 môn học: dùng môn thật của kỳ này hay tự đặt?
