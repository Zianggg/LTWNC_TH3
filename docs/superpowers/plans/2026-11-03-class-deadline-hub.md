# Class Deadline Hub Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cổng web deadline của lớp (LTWNC BTTH 3): khách xem deadline công khai có SEO, sinh viên đăng nhập để đánh dấu đã xong, admin thêm/xoá deadline. Mỗi route dùng đúng chiến lược render mà đề yêu cầu.

**Architecture:** Next.js 15 App Router, dữ liệu là file JSON trong `data/`, đọc/ghi qua một lớp `src/lib/data.ts` duy nhất. Trang public không đọc cookie để giữ SSG/ISR; phiên được đọc ở client (`useSession`). Trang private đọc phiên bằng `auth()` (SSR). Phân quyền đi qua một ma trận duy nhất `can(role, action)`, được gọi ở Middleware, ở page và ở mọi Server Action.

**Tech Stack:** Next.js 15.5.x, React 19, TypeScript, Tailwind v4, shadcn/ui (radix-nova) + lucide, next-auth@5 beta (Auth.js), zod, bcryptjs, Jest + ts-jest.

**Spec:** `E:\project\LTWNC_TH3\PLAN.md` và đề gốc `C:\Users\ADMIN\Downloads\LTWNC BTTH 3 Xây dựng Class Deadline Hub.md`. Quy ước code theo slide Buổi 7–8 trong `C:\Users\ADMIN\Downloads\Tong_hop_Buoi1-8.md`.

## Global Constraints

- Thư mục dự án: `E:\project\LTWNC_TH3` (Next app nằm ngay ở gốc folder này; `PLAN.md` và `docs/` giữ nguyên). Dùng npm, Windows.
- Toàn bộ UI viết tiếng Việt.
- Tài khoản bắt buộc: `admin@ptit.edu.vn` / `admin123` / admin; `sv@ptit.edu.vn` / `sv123456` / user.
- Dữ liệu: 4 môn học, 12 deadline, id deadline là chuỗi số `"1"`…`"12"` (README cần `/deadlines/1`).
- Bảng render: `/` SSG · `/subjects/[slug]` SSG · `/deadlines` ISR 60s · `/deadlines/[id]` ISR làm mới khi admin thêm/xoá · `/dashboard` SSR (đã đăng nhập) · `/admin` SSR (chỉ admin).
- Route groups `(public)` và `(app)`, mỗi nhóm có layout riêng.
- `'use client'` chỉ dùng ở: Countdown, DeadlineFilter, DashboardNav, UserMenu, SessionProvider wrapper, LoginForm, các form/nút có trạng thái pending, `error.tsx`.
- Session strategy `jwt`. `Role = 'admin' | 'user'` (không dùng `string`). Ma trận quyền có thêm `'guest'`.
- Chưa đăng nhập mà vào `/dashboard` hoặc `/admin` → `/login?callbackUrl=<path>`. Đã đăng nhập là user mà vào `/admin` → `/403`.
- `robots.ts` chặn `/dashboard`, `/admin`; `/login` và `/dashboard` có `robots: { index: false }`.
- Font: `next/font/google` Be Vietnam Pro, `subsets: ['latin', 'vietnamese']`. Ảnh dùng `next/image`.
- Múi giờ hiển thị: `Asia/Ho_Chi_Minh`; `dueAt` lưu dạng ISO có offset `+07:00`.

## Review Focus

1. `callbackUrl` độc hại (`//evil.com`, `https://evil.com`) → bỏ qua, chuyển về `/dashboard`. Test: `safeCallbackUrl` trong Task 6.
2. Id deadline không tồn tại (`999`, `abc`, id vừa bị xoá) → trang 404 của dự án, không phải 500. Test: build + kiểm tra thủ công ở Task 5, và `getDeadline('abc')` trả `null` ở Task 2.
3. Form thêm deadline có dữ liệu xấu (tiêu đề rỗng, ngày sai định dạng, `subjectSlug` không tồn tại) → báo lỗi tiếng Việt, không ghi file. Test: `createDeadlineSchema` ở Task 8.
4. Mốc đếm ngược: hạn trong hôm nay → "Hết hạn hôm nay"; hạn ngày mai → "Còn 1 ngày"; hạn hôm qua → "Quá hạn 1 ngày". Tính theo ngày lịch giờ Việt Nam, không theo khoảng 24h. Test: `daysUntil` ở Task 4.
5. Sai mật khẩu / email không tồn tại → hiện "Email hoặc mật khẩu không đúng" trên trang login, không ném lỗi 500. Đánh dấu xong một deadline không tồn tại → bị từ chối. Test: `verifyCredentials` ở Task 6, `setCompleted` ở Task 2.

## Skills sử dụng

| Giai đoạn | Skill | Dùng để |
|---|---|---|
| Lập kế hoạch | `superpowers:brainstorming` | Chốt yêu cầu (người dùng chọn bỏ qua hỏi đáp, dùng mặc định) |
| Lập kế hoạch | `superpowers:writing-plans` | Viết file kế hoạch này |
| Thực thi (Native) | `superpowers:executing-plans` | Chạy lần lượt từng task, đánh dấu checkbox |
| Task 2, 3, 4, 6, 8, 9 | `superpowers:test-driven-development` | Viết test lỗi trước, rồi mới viết code |
| Task 5–9, 11 | `vercel-react-best-practices` | Server/Client Component, dữ liệu, bundle, Core Web Vitals |
| Task 4, 5, 7 (giao diện) | `frontend-design` | Hướng thẩm mỹ cho trang public và dashboard, tránh giao diện mẫu |
| Task 11 | `web-design-guidelines` | Rà accessibility và UX trước khi đo Lighthouse |
| Kiểm tra trên trình duyệt | `anthropic-skills:built-in-browser` | Mở bản `npm start` trong browser pane: view-source, redirect, 404, OG image |
| Khi gặp lỗi | `superpowers:systematic-debugging` | Tìm nguyên nhân gốc trước khi sửa |
| Cuối mỗi task và trước khi báo xong | `superpowers:verification-before-completion` | Chạy `npm test` / `npm run build` và đọc kết quả thật |
| Sau Task 11 | `superpowers:requesting-code-review` | Một reviewer độc lập đọc toàn bộ mã nguồn |

---

### Task 1: Khởi tạo dự án

**Files:**
- Create: toàn bộ scaffold của `create-next-app` trong `E:\project\LTWNC_TH3`, `jest.config.ts`, `.env.example`, `.env.local`
- Modify: `src/app/layout.tsx`, `src/app/globals.css`, `package.json` (scripts)

**Interfaces:**
- Produces: alias `@/*` → `src/*`; `npm test` chạy Jest; font CSS variable `--font-sans`.

- [ ] **Step 1:** Scaffold vào một thư mục tạm trong scratchpad (folder đích đã có `PLAN.md`/`docs`), rồi chép sang `E:\project\LTWNC_TH3`:
  `npx create-next-app@15 class-deadline-hub --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm --no-turbopack`
- [ ] **Step 2:** `npm i next-auth@beta zod bcryptjs` và `npm i -D jest ts-jest @types/jest @types/bcryptjs`. Ghim `next` ở `15.5.x`.
- [ ] **Step 3:** `npx shadcn@latest init` (preset radix-nova), thêm các component `button card badge input label select table separator sonner`.
- [ ] **Step 4:** `jest.config.ts`: preset `ts-jest`, `testEnvironment: 'node'`, `moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' }`, `testMatch: ['**/__tests__/**/*.test.ts']`. Thêm script `"test": "jest"`.
- [ ] **Step 5:** Root layout: `<html lang="vi">`, Be Vietnam Pro (weights 400/500/600/700, subsets latin + vietnamese, `variable: '--font-sans'`), `metadataBase: new URL(process.env.SITE_URL ?? 'http://localhost:3000')`, title template `'%s | Class Deadline Hub'`.
- [ ] **Step 6:** `.env.example` với `AUTH_SECRET=`, `SITE_URL=http://localhost:3000`, `AUTH_GITHUB_ID=`, `AUTH_GITHUB_SECRET=`. Tạo `.env.local` bằng `npx auth secret`.
- [ ] **Step 7:** Chạy `npm run build`. Kỳ vọng: build thành công.
- [ ] **Step 8:** Commit `chore: scaffold Next.js 15 + shadcn + jest`.

### Task 2: Kiểu dữ liệu, dữ liệu mẫu và lớp truy cập dữ liệu

**Files:**
- Create: `src/lib/types.ts`, `src/lib/data.ts`, `data/subjects.json`, `data/deadlines.json`, `data/users.json`, `data/completions.json`, `scripts/hash-password.mjs`, `public/subjects/*.webp` (4 ảnh)
- Test: `__tests__/data.test.ts`

**Interfaces:**
- Produces (`src/lib/types.ts`):
  ```ts
  export type Role = 'admin' | 'user';
  export type DeadlineType = 'assignment' | 'quiz' | 'project' | 'exam';
  export interface Subject { slug: string; code: string; name: string; lecturer: string; image: string; color: string; description: string }
  export interface Deadline { id: string; subjectSlug: string; title: string; description: string; type: DeadlineType; dueAt: string }
  export interface UserRecord { id: string; email: string; name: string; passwordHash: string; role: Role }
  export type NewDeadline = Omit<Deadline, 'id'>;
  ```
- Produces (`src/lib/data.ts`, có `import 'server-only'` ở đầu; thư mục dữ liệu lấy từ `process.env.DATA_DIR ?? path.join(process.cwd(), 'data')`):
  - `getSubjects(): Promise<Subject[]>`, `getSubject(slug: string): Promise<Subject | null>`
  - `getDeadlines(): Promise<Deadline[]>` (sắp theo `dueAt` tăng dần), `getDeadline(id: string): Promise<Deadline | null>`, `getDeadlinesBySubject(slug: string): Promise<Deadline[]>`
  - `findUserByEmail(email: string): Promise<UserRecord | null>` (so sánh không phân biệt hoa thường)
  - `getCompletedIds(userId: string): Promise<string[]>`
  - `setCompleted(userId: string, deadlineId: string, done: boolean): Promise<void>`: ném `Error('DEADLINE_NOT_FOUND')` nếu id không có
  - `createDeadline(input: NewDeadline): Promise<Deadline>`: id = `String(max(id số) + 1)`
  - `deleteDeadline(id: string): Promise<boolean>`: đồng thời gỡ id khỏi `completions.json`
  - Ghi file bằng cách ghi vào `*.tmp` rồi `rename` (ghi nguyên tử).

- [ ] **Step 1: Viết test lỗi.** Mỗi test copy `data/` vào một thư mục tạm và đặt `DATA_DIR`. Jest map `server-only` sang một module rỗng (`moduleNameMapper: { '^server-only$': '<rootDir>/__tests__/empty.ts' }`).
  - `getDeadlines` trả 12 phần tử, đã sắp xếp; `getSubjects` trả 4 phần tử
  - `getDeadline('1')` có `id === '1'`; `getDeadline('abc')` và `getDeadline('999')` là `null`
  - `findUserByEmail('ADMIN@ptit.edu.vn')` có `role === 'admin'`
  - `createDeadline(...)` trả `id === '13'`, sau đó `getDeadline('13')` khác `null`
  - `setCompleted('u-sv', '2', true)` → `getCompletedIds('u-sv')` chứa `'2'`; gọi lại với `false` thì không còn chứa
  - `setCompleted('u-sv', '999', true)` bị reject với `DEADLINE_NOT_FOUND`
  - `deleteDeadline('2')` trả `true`, gỡ `'2'` khỏi danh sách đã xong; `deleteDeadline('2')` lần nữa trả `false`
- [ ] **Step 2:** `npm test -- data` → FAIL.
- [ ] **Step 3: Dữ liệu mẫu.** 4 môn (do tôi tự đặt): `lap-trinh-web-nang-cao` (LTWNC), `co-so-du-lieu-phan-tan`, `phat-trien-ung-dung-di-dong`, `kiem-thu-phan-mem`. 12 deadline, mỗi môn 3, trải từ khoảng 2 tuần trước đến khoảng 6 tuần sau ngày 2026-11-03 (có quá hạn, có sắp tới, đủ 4 loại `type`). Users: `u-admin` (Lớp trưởng), `u-sv` (Sinh viên PTIT). Mật khẩu băm bằng `scripts/hash-password.mjs` (bcryptjs, cost 10). `completions.json` là `{}`. Ảnh môn học: 4 ảnh webp 1200×630 tự tạo (khối màu + icon, không lấy ảnh có bản quyền).
- [ ] **Step 4:** Viết `types.ts` và `data.ts`.
- [ ] **Step 5:** `npm test -- data` → PASS.
- [ ] **Step 6:** Commit `feat: JSON data layer with seed data`.

### Task 3: Ma trận phân quyền `can()`

**Files:**
- Create: `src/lib/permissions.ts`
- Test: `__tests__/permissions.test.ts`

**Interfaces:**
- Produces:
  ```ts
  export type PermissionRole = 'guest' | Role;
  export type Action = 'deadline:read' | 'deadline:complete' | 'deadline:create' | 'deadline:delete';
  export const PERMISSIONS: Record<PermissionRole, readonly Action[]>;
  export function can(role: PermissionRole, action: Action): boolean;
  export function roleOf(session: { user?: { role?: Role } } | null): PermissionRole; // null → 'guest'
  ```
  File này không import gì ngoài `type Role`, để dùng được ở Edge.

- [ ] **Step 1: Viết test lỗi** bằng `test.each` cho đủ 12 ô của bảng trong đề: guest chỉ được `deadline:read`; user được `read` + `complete`; admin được cả 4. Thêm test: `roleOf(null) === 'guest'`, `roleOf({ user: { role: 'admin' } }) === 'admin'`.
- [ ] **Step 2:** `npm test -- permissions` → FAIL.
- [ ] **Step 3:** Viết `permissions.ts`.
- [ ] **Step 4:** `npm test -- permissions` → PASS.
- [ ] **Step 5:** Commit `feat: RBAC matrix with can()`.

### Task 4: Đếm ngược và bộ lọc (client)

**Files:**
- Create: `src/lib/countdown.ts`, `src/components/countdown.tsx`, `src/components/deadline-filter.tsx`, `src/components/deadline-card.tsx`
- Test: `__tests__/countdown.test.ts`

**Interfaces:**
- Produces:
  - `daysUntil(dueAt: string, now: Date): number`: hiệu số ngày lịch theo `Asia/Ho_Chi_Minh` (dương = còn, âm = quá hạn)
  - `countdownLabel(days: number): string`: `> 0` → `Còn ${d} ngày`, `0` → `Hết hạn hôm nay`, `< 0` → `Quá hạn ${-d} ngày`
  - `<Countdown dueAt={string} />` (`'use client'`): lần render đầu (SSR) chỉ hiện ngày hạn dạng `dd/MM/yyyy HH:mm`; sau `useEffect` mới hiện nhãn đếm ngược kèm màu (quá hạn: đỏ, ≤ 3 ngày: vàng cam, còn lại: xanh)
  - `<DeadlineCard deadline={Deadline} subject={Subject} />` (server): link tới `/deadlines/[id]`, có tên môn, loại, `<Countdown>`
  - `<DeadlineFilter deadlines={Deadline[]} subjects={Subject[]} />` (`'use client'`): lọc theo môn (select) và trạng thái `Tất cả | Sắp tới | Quá hạn`; render danh sách card (card được truyền qua props, không kéo dữ liệu server vào client)

- [ ] **Step 1: Viết test lỗi** với `now = new Date('2026-11-03T23:30:00+07:00')`: hạn `2026-11-03T08:00+07:00` → 0; hạn `2026-11-04T00:10+07:00` → 1; hạn `2026-11-02T23:59+07:00` → -1; `countdownLabel(0) === 'Hết hạn hôm nay'`, `countdownLabel(5) === 'Còn 5 ngày'`, `countdownLabel(-2) === 'Quá hạn 2 ngày'`.
- [ ] **Step 2:** `npm test -- countdown` → FAIL.
- [ ] **Step 3:** Viết `countdown.ts` (lấy ngày lịch qua `Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Ho_Chi_Minh' })`, rồi trừ hai ngày UTC-midnight), sau đó viết 3 component.
- [ ] **Step 4:** `npm test -- countdown` → PASS.
- [ ] **Step 5:** Commit `feat: countdown and filter client components`.

### Task 5: Các route public và chiến lược render

**Files:**
- Create: `src/app/(public)/layout.tsx`, `src/app/(public)/page.tsx`, `src/app/(public)/subjects/[slug]/page.tsx`, `src/app/(public)/deadlines/page.tsx`, `src/app/(public)/deadlines/[id]/page.tsx`, `src/app/not-found.tsx`, `src/app/(public)/loading.tsx`, `src/app/(public)/error.tsx`, `src/components/header/site-header.tsx`, `src/components/site-footer.tsx`
- Delete: `src/app/page.tsx` (mặc định của scaffold)

**Interfaces:**
- Consumes: data layer (Task 2), `DeadlineCard` / `DeadlineFilter` / `Countdown` (Task 4).
- Produces: `<SiteHeader />` là server component, nhận slot `userMenu` (Task 6 sẽ cắm `<UserMenu />` vào); hiện tại để trống.

- [ ] **Step 1:** `/`: hero + 4 thẻ môn học (`next/image`, ảnh đầu `priority`) + 5 deadline sắp tới gần nhất. Không export `revalidate`/`dynamic` (SSG thuần).
- [ ] **Step 2:** `/subjects/[slug]`: `generateStaticParams` từ `getSubjects`, `dynamicParams = false`, `generateMetadata`, slug lạ → `notFound()`. `params` là `Promise` (Next 15).
- [ ] **Step 3:** `/deadlines`: `export const revalidate = 60`; render `<DeadlineFilter>`.
- [ ] **Step 4:** `/deadlines/[id]`: `generateStaticParams` (12 id), `export const dynamicParams = true`, `export const revalidate = false`; `getDeadline` trả `null` → `notFound()`. Nội dung: breadcrumb (Trang chủ › Môn › Deadline), tiêu đề, môn, loại, hạn, `<Countdown>`, mô tả.
- [ ] **Step 5:** `not-found.tsx` (404 tiếng Việt, có link về trang chủ), `loading.tsx` (skeleton), `error.tsx` (`'use client'`, nút "Thử lại" gọi `reset()`).
- [ ] **Step 6:** `npm run build`. Kỳ vọng trong bảng route: `/` là `○`, `/deadlines` là `○` với Revalidate `1m`, `/subjects/[slug]` và `/deadlines/[id]` là `●`. Không route public nào là `ƒ`.
- [ ] **Step 7:** `npm start` rồi mở `/deadlines/999`, `/deadlines/abc`, `/subjects/khong-co` → đều ra trang 404 của dự án.
- [ ] **Step 8:** Commit `feat: public routes with SSG/ISR`.

### Task 6: Xác thực bằng Auth.js

**Files:**
- Create: `src/auth.config.ts`, `src/auth.ts`, `src/types/next-auth.d.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/lib/auth-helpers.ts`, `src/actions/auth.ts`, `src/components/providers.tsx`, `src/components/header/user-menu.tsx`, `src/app/(public)/login/page.tsx`, `src/components/login-form.tsx`
- Modify: `src/app/layout.tsx` (bọc `<Providers>`), `src/app/(public)/layout.tsx` (cắm `<UserMenu />`)
- Test: `__tests__/auth-helpers.test.ts`

**Interfaces:**
- Produces:
  - `auth.config.ts`: `export const authConfig = { pages: { signIn: '/login' }, session: { strategy: 'jwt' }, callbacks: { jwt, session }, providers: [] } satisfies NextAuthConfig`. Callback `jwt` gắn `id`, `role` khi có `user`; callback `session` copy sang `session.user`.
  - `auth.ts`: `export const { handlers, auth, signIn, signOut } = NextAuth({ ...authConfig, providers: [Credentials({ authorize })] })`; `authorize` gọi `verifyCredentials`.
  - `next-auth.d.ts`: mở rộng `User { role: Role }`, `Session.user { id: string; role: Role }`, `JWT { id: string; role: Role }` theo slide 16.
  - `auth-helpers.ts` (server-only):
    - `verifyCredentials(email: unknown, password: unknown): Promise<{ id: string; name: string; email: string; role: Role } | null>`: parse bằng zod `loginSchema` (email hợp lệ, password ≥ 6 ký tự), rồi so khớp bcrypt
    - `safeCallbackUrl(raw: string | null | undefined): string`: chỉ chấp nhận chuỗi bắt đầu bằng `/` và không bắt đầu bằng `//` hoặc `/\`; ngược lại trả `'/dashboard'`
  - `actions/auth.ts`: `loginAction(prev: { error?: string }, formData: FormData): Promise<{ error?: string }>`, gọi `signIn('credentials', { email, password, redirectTo: safeCallbackUrl(callbackUrl) })`, bắt `AuthError` → `{ error: 'Email hoặc mật khẩu không đúng' }` (lỗi redirect thì ném lại); `logoutAction(): Promise<void>` gọi `signOut({ redirectTo: '/' })`.
  - `<UserMenu />` (`'use client'`, `useSession`): đang tải → skeleton; khách → nút "Đăng nhập" (link `/login?callbackUrl=<pathname hiện tại>`); đã đăng nhập → tên, badge vai trò (`Lớp trưởng` / `Sinh viên`), link Dashboard (+ Admin nếu là admin), nút "Đăng xuất" (form gọi `logoutAction`).

- [ ] **Step 1: Viết test lỗi** cho `auth-helpers` (dùng `DATA_DIR` tạm như Task 2): đúng mật khẩu của admin → `role === 'admin'`; `sv@ptit.edu.vn` + `sai123456` → `null`; email không tồn tại → `null`; `email = 123` → `null`. `safeCallbackUrl('/admin') === '/admin'`; `'//evil.com'`, `'https://evil.com'`, `'/\\evil.com'`, `null` → `'/dashboard'`.
- [ ] **Step 2:** `npm test -- auth-helpers` → FAIL.
- [ ] **Step 3:** Viết các file auth. Trang login: `metadata.robots = { index: false, follow: false }`, đọc `searchParams.callbackUrl` (Promise), `<LoginForm>` dùng `useActionState(loginAction)`; có ô gợi ý 2 tài khoản demo.
- [ ] **Step 4:** `npm test -- auth-helpers` → PASS.
- [ ] **Step 5:** `npm run build`: các route public vẫn giữ `○` / `●` như Task 5 (Header không được làm chúng thành dynamic).
- [ ] **Step 6:** Kiểm tra thủ công trên `npm start`: đăng nhập admin → header hiện "Lớp trưởng" + nút Đăng xuất; sai mật khẩu → báo lỗi trên form.
- [ ] **Step 7:** Commit `feat: Auth.js credentials login with typed session`.

### Task 7: Middleware, 403, dashboard và admin (SSR)

**Files:**
- Create: `src/middleware.ts`, `src/app/(public)/403/page.tsx`, `src/app/(app)/layout.tsx`, `src/app/(app)/dashboard/layout.tsx`, `src/app/(app)/dashboard/page.tsx`, `src/app/(app)/dashboard/done/page.tsx`, `src/app/(app)/admin/page.tsx`, `src/app/(app)/loading.tsx`, `src/app/(app)/error.tsx`, `src/components/dashboard-nav.tsx`, `src/lib/guards.ts`

**Interfaces:**
- Consumes: `authConfig` (Task 6), `can`, `roleOf` (Task 3).
- Produces:
  - `middleware.ts`: `const { auth } = NextAuth(authConfig); export default auth(req => ...)`; `matcher: ['/dashboard/:path*', '/admin/:path*']`. Chưa có `req.auth` → redirect `/login?callbackUrl=<pathname+search>`; path bắt đầu bằng `/admin` và `!can(roleOf(req.auth), 'deadline:create')` → redirect `/403`.
  - `guards.ts` (server-only): `requireSession(callbackPath: string): Promise<Session>` (không có phiên → `redirect('/login?callbackUrl=…')`); `requirePermission(action: Action, callbackPath: string): Promise<Session>` (thiếu quyền → `redirect('/403')`).
  - `<DashboardNav items={{ href: string; label: string }[]} />` (`'use client'`, `usePathname`): mục đang mở có `aria-current="page"` và nền tô sáng.

- [ ] **Step 1:** Viết `middleware.ts` và `guards.ts`.
- [ ] **Step 2:** `/403`: thông báo không đủ quyền, link về `/dashboard`; `robots: { index: false }`.
- [ ] **Step 3:** `(app)/layout.tsx`: header kiểu ứng dụng dùng chung `<SiteHeader>` + `<UserMenu>`. `dashboard/layout.tsx`: sidebar `<DashboardNav>` với các mục `Tổng quan` (`/dashboard`), `Đã hoàn thành` (`/dashboard/done`), và `Quản trị` (`/admin`, chỉ hiện khi `can(role,'deadline:create')`).
- [ ] **Step 4:** `/dashboard`: `export const dynamic = 'force-dynamic'`, `metadata.robots = { index: false, follow: false }`, gọi `requireSession('/dashboard')`; hiện thống kê (tổng / đã xong / quá hạn chưa xong) và danh sách deadline chưa xong, mỗi dòng có nút đánh dấu (nút sẽ cắm ở Task 8; hiện để placeholder). `/dashboard/done`: danh sách đã xong.
- [ ] **Step 5:** `/admin`: `force-dynamic`, `requirePermission('deadline:create', '/admin')` chạy TRƯỚC khi đọc dữ liệu; bảng toàn bộ deadline (form thêm và nút xoá sẽ có ở Task 8).
- [ ] **Step 6:** `npm run build` → `/dashboard`, `/dashboard/done`, `/admin` là `ƒ`; route public không đổi.
- [ ] **Step 7:** Kiểm tra thủ công trên `npm start`: khách vào `/admin` → `/login?callbackUrl=%2Fadmin`, đăng nhập admin → quay lại `/admin`; sv vào `/admin` → `/403`; menu sidebar tô sáng đúng trang.
- [ ] **Step 8:** Commit `feat: middleware protection, dashboard and admin SSR pages`.

### Task 8: Server Actions và form

**Files:**
- Create: `src/lib/schemas.ts`, `src/actions/deadlines.ts`, `src/components/toggle-done-button.tsx`, `src/components/admin/create-deadline-form.tsx`, `src/components/admin/delete-deadline-button.tsx`
- Modify: `src/app/(app)/dashboard/page.tsx`, `src/app/(app)/dashboard/done/page.tsx`, `src/app/(app)/admin/page.tsx`
- Test: `__tests__/schemas.test.ts`

**Interfaces:**
- Produces:
  - `schemas.ts`: `createDeadlineSchema` (title 3–120 ký tự sau trim, description ≤ 1000, `type` thuộc `DeadlineType`, `subjectSlug` là chuỗi không rỗng, `dueAt` từ `<input type="datetime-local">` được chuyển sang ISO `+07:00`, phải là ngày hợp lệ); `deadlineIdSchema = z.string().regex(/^\d+$/)`; `toggleDoneSchema = z.object({ id: deadlineIdSchema, done: z.enum(['true','false']).transform(v => v === 'true') })`. Thông báo lỗi bằng tiếng Việt.
  - `actions/deadlines.ts` (`'use server'`), kiểu trả về chung `ActionResult = { ok: true; message: string } | { ok: false; error: string; fieldErrors?: Record<string, string[]> }`:
    - `toggleDoneAction(formData: FormData): Promise<ActionResult>`: `auth()` → `can(role,'deadline:complete')` → parse → `setCompleted` → `revalidatePath('/dashboard', 'layout')`
    - `createDeadlineAction(prev: ActionResult | null, formData: FormData): Promise<ActionResult>`: `auth()` → `can(role,'deadline:create')` → parse → kiểm tra `getSubject(subjectSlug)` tồn tại → `createDeadline` → revalidate
    - `deleteDeadlineAction(formData: FormData): Promise<ActionResult>`: `auth()` → `can(role,'deadline:delete')` → parse → `deleteDeadline` → revalidate
    - "revalidate" của create/delete: `revalidatePath('/')`, `revalidatePath('/deadlines')`, `revalidatePath('/deadlines/[id]', 'page')`, `revalidatePath('/subjects/[slug]', 'page')`, `revalidatePath('/sitemap.xml')`, `revalidatePath('/admin')`, `revalidatePath('/dashboard', 'layout')`
    - Thiếu phiên hoặc thiếu quyền → `{ ok: false, error: 'Bạn không có quyền thực hiện thao tác này' }` (không ném lỗi).

- [ ] **Step 1: Viết test lỗi** cho `schemas`: input hợp lệ → `dueAt` kết thúc bằng `+07:00`; title `'  '` → lỗi; `dueAt: 'abc'` → lỗi; `type: 'party'` → lỗi; `deadlineIdSchema.safeParse('1').success === true`, `'abc'` và `'../x'` → `false`.
- [ ] **Step 2:** `npm test -- schemas` → FAIL.
- [ ] **Step 3:** Viết `schemas.ts` → `npm test -- schemas` → PASS.
- [ ] **Step 4:** Viết actions và component: `ToggleDoneButton` (`useTransition`, toast), `CreateDeadlineForm` (`useActionState`, hiện `fieldErrors` dưới từng ô, select môn), `DeleteDeadlineButton` (hỏi xác nhận bằng `confirm()`, toast). Cắm vào dashboard và admin.
- [ ] **Step 5:** Kiểm tra thủ công trên bản production (`npm run build && npm start`): admin thêm deadline → `/deadlines/13` xem được ngay và có trong `/deadlines`; admin xoá deadline 13 → `/deadlines/13` ra 404; sv đánh dấu xong → `/dashboard/done` cập nhật. Gọi `deleteDeadlineAction` khi đang đăng nhập bằng sv (tạm gắn nút xoá vào dashboard rồi gỡ ngay) → nhận thông báo không đủ quyền, file không đổi.
- [ ] **Step 6:** Khôi phục `data/*.json` về dữ liệu mẫu ban đầu (`git checkout data/`).
- [ ] **Step 7:** Commit `feat: guarded server actions for complete/create/delete`.

### Task 9: SEO

**Files:**
- Create: `src/lib/seo.ts`, `src/app/(public)/deadlines/[id]/opengraph-image.tsx`, `src/app/opengraph-image.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/components/json-ld.tsx`
- Modify: `src/app/(public)/deadlines/[id]/page.tsx` (thêm `generateMetadata`, JSON-LD)
- Test: `__tests__/seo.test.ts`

**Interfaces:**
- Produces:
  - `seo.ts`: `SITE_URL: string`; `absoluteUrl(path: string): string`; `breadcrumbJsonLd(items: { name: string; path: string }[]): object` → `{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [{ '@type': 'ListItem', position: i+1, name, item: absoluteUrl(path) }] }`
  - `<JsonLd data={object} />`: render `<script type="application/ld+json">`, escape ký tự `<` thành `\u003c`.

- [ ] **Step 1: Viết test lỗi:** `breadcrumbJsonLd` với 3 mục cho ra `position` 1,2,3, `item` là URL tuyệt đối bắt đầu bằng `SITE_URL`.
- [ ] **Step 2:** `npm test -- seo` → FAIL → viết `seo.ts` → PASS.
- [ ] **Step 3:** `generateMetadata` cho `/deadlines/[id]`: title = tên deadline, description = "{Môn} · Hạn {dd/MM/yyyy HH:mm} · {mô tả rút gọn 150 ký tự}", `alternates.canonical`, `openGraph` (`type: 'article'`, url); id lạ → `{ title: 'Không tìm thấy deadline' }`.
- [ ] **Step 4:** `opengraph-image.tsx` 1200×630: nền gradient theo `subject.color`, mã môn, tên deadline, ngày hạn, nhãn loại, tên site. Dùng font Be Vietnam Pro tải bằng `fetch` từ Google Fonts (dạng TTF) để tiếng Việt hiển thị đúng dấu. `generateStaticParams` giống trang. Thêm OG image mặc định cho site ở `src/app/opengraph-image.tsx`.
- [ ] **Step 5:** `sitemap.ts`: `/`, `/deadlines`, 4 trang môn, mọi `/deadlines/{id}` (`lastModified` = ngày build). `robots.ts`: `allow: '/'`, `disallow: ['/dashboard', '/admin', '/api/']`, có `sitemap`.
- [ ] **Step 6:** `npm run build && npm start`, xem view-source `/deadlines/1`: có `<title>`, `og:image`, `application/ld+json` với `BreadcrumbList`; `/sitemap.xml` có 12 URL deadline; `/robots.txt` chặn 2 đường dẫn; mở `/deadlines/1/opengraph-image` thấy ảnh, chữ tiếng Việt đúng.
- [ ] **Step 7:** Commit `feat: dynamic metadata, OG images, sitemap, robots, JSON-LD`.

### Task 10: Điểm cộng: GitHub OAuth

**Files:**
- Modify: `src/auth.ts`, `src/components/login-form.tsx`, `src/actions/auth.ts`

**Interfaces:**
- Produces: `githubLoginAction(formData: FormData): Promise<void>`, gọi `signIn('github', { redirectTo: safeCallbackUrl(callbackUrl) })`.

- [ ] **Step 1:** Chỉ thêm provider `GitHub` khi có `AUTH_GITHUB_ID` (`...(process.env.AUTH_GITHUB_ID ? [GitHub({ profile: p => ({ id: \`github:${p.id}\`, name: p.name ?? p.login, email: p.email, image: p.avatar_url, role: 'user' }) })] : [])`). Nút "Đăng nhập với GitHub" chỉ hiện khi provider đã bật. Truyền cờ này từ server page xuống form.
- [ ] **Step 2:** Callback URL của GitHub OAuth App: `http://localhost:3000/api/auth/callback/github`. Hướng dẫn tạo app ghi trong README; Client ID/Secret do người dùng tự tạo và tự dán vào `.env.local`.
- [ ] **Step 3:** Kiểm tra: không có env → build và login credentials vẫn chạy, không hiện nút GitHub. Có env → đăng nhập GitHub vào được `/dashboard` với vai trò Sinh viên, vào `/admin` → `/403`.
- [ ] **Step 4:** Commit `feat: optional GitHub OAuth login`.

### Task 11: Đo trên production, README và đóng gói

**Files:**
- Create: `README.md`, `docs/screenshots/*.png`

- [ ] **Step 1:** `npm test` → tất cả PASS. `npm run lint` → không lỗi.
- [ ] **Step 2:** `npm run build`, chụp ảnh bảng route → `docs/screenshots/build.png`.
- [ ] **Step 3:** `npm start`, chạy Lighthouse (Chrome DevTools, chế độ Mobile, cửa sổ ẩn danh) cho `/` và `/deadlines/1`. Mục tiêu: Performance ≥ 90, SEO = 100. Nếu chưa đạt thì sửa (ảnh `sizes`/`priority`, font `display: swap`, giảm JS client) rồi đo lại. Chụp `lighthouse-home.png`, `lighthouse-deadline.png`.
- [ ] **Step 4:** Chụp view-source `/deadlines/1` → `view-source.png`.
- [ ] **Step 5:** README gồm: giới thiệu; cách chạy (`npm i`, `.env.local`, `npm run build`, `npm start`, `npm test`); tài khoản demo; bảng route → chiến lược → lý do; ảnh build; điểm Lighthouse; ảnh view-source; trả lời 2 câu hỏi (dựa trên mục 6 của `PLAN.md`); bảng "yêu cầu đề → file thực hiện"; phần điểm cộng; cấu trúc thư mục.
- [ ] **Step 6:** Đóng gói nộp bài: zip mã nguồn không kèm `node_modules`, `.next`, `.env.local`.
- [ ] **Step 7:** Commit `docs: README with build, Lighthouse and answers`.
- [ ] **Step 8 (tuỳ chọn, điểm cộng):** Deploy Vercel. Ghi rõ trong README rằng thao tác ghi file JSON không lưu được trên Vercel (filesystem chỉ đọc), nên bản deploy để demo phần xem + SEO + đăng nhập. Việc này cần người dùng đăng nhập Vercel của họ, nên làm sau khi hỏi lại.
