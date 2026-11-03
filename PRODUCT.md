# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Giảng viên chấm bài (LTWNC, PTIT):** mở bài nộp BTTH 3, đối chiếu từng yêu cầu của đề (render, Auth.js, middleware, phân quyền, SEO), chạy `npm run build`, xem Lighthouse và view-source. Cần mọi yêu cầu tìm thấy được trong vài giây.
- **Sinh viên trong lớp:** mở trên điện thoại hoặc laptop, thường lúc gần hạn, để biết hôm nay và tuần này phải nộp gì, rồi đánh dấu bài đã nộp.
- **Lớp trưởng (admin):** thêm deadline khi giảng viên giao bài, xoá deadline bị huỷ, gửi link deadline lên nhóm lớp.

Sản phẩm phục vụ cả hai mục tiêu: đạt điểm tối đa khi chấm, và đủ tốt để lớp dùng thật sau đó.

## Product Purpose

Một nơi duy nhất, công khai, cho mọi hạn nộp của lớp, thay cho tin nhắn ghim trên Zalo/Messenger và lịch cá nhân. Thành công nghĩa là:

1. Mở ra là biết ngay việc gấp nhất và những gì đã quá hạn.
2. Mỗi sinh viên theo dõi được việc của riêng mình (đã nộp hay chưa).
3. Link một deadline gửi lên nhóm có ảnh xem trước đẹp, và Google tìm được.
4. Nhắc hạn chủ động trước khi hết hạn (mong muốn, chưa làm; xem Capabilities).

## Positioning

Khác tin nhắn ghim ở chỗ deadline được sắp theo thời gian thực, gắn với môn học, và tính riêng cho từng người (đã xong hay chưa). Khác Google Calendar ở chỗ do lớp trưởng quản lý chung cho cả lớp, xem công khai không cần đăng nhập, và mỗi deadline là một trang có thể chia sẻ, có SEO.

## Operating Context

- Bài thực hành 3 môn Lập trình Web nâng cao (Buổi 7–8). Đề gốc: `C:\Users\ADMIN\Downloads\LTWNC BTTH 3 Xây dựng Class Deadline Hub.md`; quy ước theo slide `Tong_hop_Buoi1-8.md`.
- Chấm bằng: đọc README, chạy `npm run build && npm start`, xem bảng route, Lighthouse trên bản production, view-source `/deadlines/1`.
- Lớp dùng thật: link deadline được gửi vào nhóm chat; sinh viên mở trên điện thoại.
- Giờ Việt Nam (`Asia/Ho_Chi_Minh`), toàn bộ giao diện tiếng Việt.

## Capabilities and Constraints

- **Có:** trang công khai (SSG/ISR), đăng nhập Credentials + GitHub tuỳ chọn (Auth.js, JWT), đánh dấu đã xong, admin thêm/xoá, ma trận quyền `can(role, action)`, metadata/OG image/sitemap/robots/JSON-LD.
- **Ràng buộc cứng:** giữ đúng phạm vi đề. Không thêm thứ gì làm sai chiến lược render đã định cho từng route, làm yếu phân quyền nhiều lớp, hay làm giảm Lighthouse/SEO. Next.js 15 + `middleware.ts` (theo slide). Dữ liệu là file JSON phía server; filesystem trên Vercel chỉ đọc.
- **Tài khoản bắt buộc:** `admin@ptit.edu.vn / admin123` (admin), `sv@ptit.edu.vn / sv123456` (user).
- **Mong muốn, chưa quyết:** nhắc hạn chủ động (email, push, hoặc file .ics thêm vào lịch). Chỉ làm nếu không phá phạm vi đề.
- **Bắt buộc bổ sung:** dark mode (người dùng xem buổi tối).

## Evidence on Hand

- Dữ liệu mẫu do người làm bài tự đặt: 4 môn (`data/subjects.json`), 12 deadline (`data/deadlines.json`), ảnh bìa môn tự sinh (`public/subjects/*.webp`).
- Đo thật: Lighthouse 100/100/100/100 cho `/` và `/deadlines/1` (`docs/lighthouse/`).
- Không có logo hay nhận diện PTIT chính thức, không có lời chứng thực, không có số liệu người dùng. Không được bịa.

## Product Principles

1. **Việc gấp nhất lên trước.** Mọi màn hình trả lời "còn bao lâu" trước khi trả lời "là gì".
2. **Đúng đề trước, đẹp sau.** Mỗi yêu cầu chấm phải tìm thấy và kiểm chứng được; trau chuốt không được làm lệch chiến lược render hay phân quyền.
3. **Công khai mặc định, riêng tư khi cần.** Xem deadline không cần tài khoản; chỉ trạng thái cá nhân và quản trị mới cần đăng nhập.
4. **Mỗi deadline là một trang chia sẻ được.** Link gửi lên nhóm phải tự giải thích được nhờ tiêu đề, hạn và ảnh xem trước.

## Accessibility & Inclusion

WCAG 2.2 AA: tương phản, bàn phím, vùng chạm trên điện thoại, tôn trọng `prefers-reduced-motion`. Dark mode là yêu cầu bắt buộc.
