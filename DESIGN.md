---
name: Class Deadline Hub
description: Sổ kế hoạch chung của lớp, nơi mọi hạn nộp được xếp theo ngày.
colors:
  ink: "#172036"
  paper: "#f6f7fa"
  sheet: "#ffffff"
  ruled-line: "#dde1ea"
  field-line: "#cfd5e1"
  pencil: "#5b6478"
  tint: "#e9ecf3"
  focus-ink: "#3b4a6b"
  overdue-red: "#c4161c"
  soon-amber: "#8f4207"
  later-teal: "#0f766e"
  done-slate: "#64748b"
  night-paper: "#0f1524"
  night-sheet: "#161d2f"
  night-ink: "#e6e9f0"
  night-pencil: "#9aa3b5"
  night-line: "#273049"
  night-overdue: "#ff7a7a"
  night-soon: "#f2a65a"
  night-later: "#4fd1b5"
  night-panel: "#232e4d"
typography:
  display:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    lineHeight: 1.375
  body:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.43
  label-small:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "0.8rem"
    fontWeight: 500
    lineHeight: 1.43
  date-numeral:
    fontFamily: "Be Vietnam Pro, system-ui, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "\"tnum\" 1"
rounded:
  md: "6.4px"
  lg: "8px"
  xl: "11.2px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.lg}"
    height: "32px"
    padding: "0 10px"
  button-outline:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    height: "32px"
  deadline-row:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
  countdown-pill-overdue:
    backgroundColor: "#c4161c1a"
    textColor: "{colors.overdue-red}"
    rounded: "{rounded.pill}"
    height: "28px"
  countdown-pill-soon:
    backgroundColor: "#8f42071a"
    textColor: "{colors.soon-amber}"
    rounded: "{rounded.pill}"
    height: "28px"
  countdown-pill-later:
    backgroundColor: "#0f766e1a"
    textColor: "{colors.later-teal}"
    rounded: "{rounded.pill}"
    height: "28px"
  next-up-panel:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    rounded: "{rounded.xl}"
    padding: "32px"
  input-field:
    backgroundColor: "{colors.sheet}"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    height: "36px"
---

# Design System: Class Deadline Hub

## Overview

**Creative North Star: "Sổ kế hoạch sinh viên"**

Giao diện là một cuốn sổ kế hoạch mở trên bàn học: giấy màu lạnh, các dòng kẻ mảnh, mực xanh đậm, và một cột ngày bên lề trái để mắt dò theo thời gian trước khi đọc nội dung. Mỗi deadline là một dòng trong sổ, không phải một tấm thẻ quảng cáo. Câu hỏi "còn bao lâu" luôn được trả lời trước câu "là gì".

Mật độ vừa phải, ưu tiên quét nhanh trên điện thoại. Màu chỉ để báo trạng thái: đỏ PTIT là mực đỏ của giáo viên, chỉ dùng khi đã trễ; hổ phách cho việc sắp đến; xanh mòng két cho việc còn xa. Điểm nhấn duy nhất của cả hệ là khối "Hạn gần nhất" trên trang chủ, một trang sổ đảo màu mực đậm với con số ngày to.

Giao diện tối là cùng cuốn sổ đọc dưới đèn bàn ban đêm: giấy xanh than sâu, chữ trắng ngà, các mực trạng thái sáng lên để giữ tương phản.

**Key Characteristics:**
- Cột ngày bên trái dùng số căn đều (tabular), mọi danh sách sắp theo hạn.
- Màu chỉ mang nghĩa trạng thái hoặc nhận diện môn học, không dùng để trang trí.
- Một họ chữ duy nhất (Be Vietnam Pro), phân cấp bằng cỡ và độ đậm.
- Bề mặt phẳng, phân lớp bằng viền mảnh và nền giấy, không đổ bóng.
- Sáng và tối đều là giao diện chính thức, theo hệ thống và có nút đổi.

## Colors

Bảng màu giấy và mực, lạnh và trung tính, với ba mực trạng thái và một màu riêng cho mỗi môn học.

### Primary
- **Mực xanh than** (ink): chữ chính, nút chính, nền khối "Hạn gần nhất", mục đang chọn ở sidebar. Ở giao diện tối, vai trò này đổi sang **Trắng ngà đêm** (night-ink).

### Secondary
- **Đỏ trễ hạn** (overdue-red): chỉ cho deadline đã quá hạn và thao tác xoá. Ở giao diện tối dùng night-overdue.
- **Hổ phách sắp đến** (soon-amber): deadline trong vòng 3 ngày; số "Hạn trong 7 ngày" ở dashboard. Ở giao diện tối dùng night-soon.
- **Mòng két còn xa** (later-teal): deadline còn hơn 3 ngày. Ở giao diện tối dùng night-later.
- **Xám đá đã xong** (done-slate): deadline sinh viên đã đánh dấu xong.

### Neutral
- **Giấy lạnh** (paper): nền trang. Ở giao diện tối dùng night-paper.
- **Tờ trắng** (sheet): nền dòng deadline, form, bảng. Ở giao diện tối dùng night-sheet.
- **Dòng kẻ** (ruled-line): mọi viền và vạch chia. Ở giao diện tối dùng night-line.
- **Viền ô nhập** (field-line): viền input, select.
- **Bút chì** (pencil): chữ phụ, nhãn, ngày tháng phụ. Ở giao diện tối dùng night-pencil.
- **Nền nhạt** (tint): hover, nền nút phụ.
- **Mực focus** (focus-ink): vòng focus bàn phím.

### Named Rules
**The Red Pen Rule.** Đỏ chỉ dành cho việc đã trễ hoặc thao tác phá huỷ. Không dùng đỏ cho nhấn mạnh, logo hay trang trí.

**The Subject Dot Rule.** Màu môn học (lấy từ `data/subjects.json`) chỉ xuất hiện như một chấm tròn 10px cạnh tên môn, thanh màu của ảnh OG và ảnh bìa môn. Không tô nền, không làm viền dày.

**The Tinted Pill Rule.** Nhãn trạng thái là chữ màu đậm trên nền cùng màu 10% độ đậm; cả hai chế độ sáng và tối đều phải đạt tương phản AA 4.5:1.

## Typography

**Display Font:** Be Vietnam Pro (với system-ui, sans-serif)
**Body Font:** Be Vietnam Pro

**Character:** Một họ chữ geometric sans thiết kế cho tiếng Việt, dấu đặt gọn nên tiêu đề dày đặc vẫn sạch. Phân cấp hoàn toàn bằng cỡ chữ và độ đậm, không phối thêm font thứ hai.

### Hierarchy
- **Display** (700, 3rem trên desktop, 2.25rem trên mobile, line-height 1.1): duy nhất một câu tiêu đề trang chủ.
- **Headline** (700, 1.875–2.25rem, 1.2): tiêu đề trang (h1) như "Tất cả deadline", tên deadline ở trang chi tiết.
- **Title** (600, 1rem, 1.375): tên deadline trong dòng danh sách, tên môn.
- **Body** (400, 1rem, 1.625): mô tả yêu cầu, đoạn giới thiệu; tối đa khoảng 65ch.
- **Label** (500, 0.875rem): nhãn trường, chữ phụ, menu.
- **Label small** (500, 0.8rem): chữ trong nút cỡ nhỏ (header, thao tác phụ).
- **Date numeral** (700, 1.875rem, 1, tabular nums): số ngày trong cột lề; mọi ngày giờ và số liệu đều dùng chữ số căn đều.

### Named Rules
**The Tabular Time Rule.** Mọi ngày, giờ và số đếm dùng chữ số tabular để các dòng thẳng cột.

**The No Eyebrow Rule.** Không đặt nhãn nhỏ viết hoa phía trên tiêu đề; tiêu đề tự đứng được.

## Layout

Vùng nội dung tối đa 72rem (max-w-6xl), lề 16px trên mobile và 24px từ 640px. Trang chi tiết thu hẹp còn 48rem để dễ đọc. Dashboard là lưới hai cột trên desktop (sidebar 13rem cố định khi cuộn) và một cột trên mobile, sidebar thành hàng tab cuộn ngang. Dòng deadline là lưới ba cột (lề ngày 5rem, nội dung, đếm ngược); trên mobile đếm ngược xuống dưới nội dung. Header cao 64px, dưới 640px có thêm một hàng menu riêng thay vì menu hamburger.

Nhịp dọc theo thang 4px: 12px giữa các dòng danh sách, 32–40px giữa các khối, 48–64px quanh phần mở đầu trang chủ.

## Elevation & Depth

Phẳng hoàn toàn. Chiều sâu đến từ lớp giấy: nền trang giấy lạnh, dòng deadline và form là tờ trắng với viền kẻ 1px. Header dính trên cùng dùng nền giấy 90% kèm làm mờ phía sau để nội dung cuộn bên dưới vẫn thấy được. Toast của sonner là chỗ duy nhất có bóng đổ (mặc định thư viện).

### Named Rules
**The Flat Notebook Rule.** Không đổ bóng cho thẻ hay nút. Trạng thái hover đổi màu viền hoặc nền nhạt, không nổi khối lên.

## Shapes

Bo góc vừa, thống nhất 8px cho dòng deadline, nút và bảng; 11px cho khối "Hạn gần nhất" và form lớn; 6px cho ô nhập; viên thuốc tròn hoàn toàn cho nhãn trạng thái và chấm màu môn học. Viền luôn 1px. Bảng thông số ở trang chi tiết là các ô liền nhau chia bằng khe 1px màu dòng kẻ.

## Components

### Buttons
- **Shape:** bo 8px (rounded.lg), cao 32px trên desktop, 40px trên mobile cho các nút chính.
- **Primary:** nền mực, chữ giấy. Dùng cho hành động chính duy nhất của khối: "Xem tất cả deadline", "Đăng nhập", "Thêm deadline", "Đánh dấu đã xong".
- **Outline / Ghost:** nền tờ trắng có viền, hoặc trong suốt; dùng cho hành động phụ ("Bỏ đánh dấu", "Đăng xuất", "Quản trị").
- **Destructive:** chữ đỏ trễ hạn trên nền trong suốt, hover nền đỏ 10%; luôn hỏi xác nhận.
- **Focus:** vòng mực focus 3px, chỉ hiện khi dùng bàn phím.

### Chips (nhãn đếm ngược)
- **Style:** viên thuốc cao 28px, rộng tối thiểu 112px, chữ 12px đậm, tabular; chữ trạng thái trên nền cùng màu 10%.
- **State:** quá hạn (đỏ), còn tối đa 3 ngày (hổ phách), còn xa (mòng két), đã xong (xám đá). Trước khi trình duyệt biết ngày hiện tại, hiện một khung xám cùng kích thước.

### Cards / Containers (dòng deadline)
- **Corner Style:** 8px.
- **Background:** tờ trắng trên nền giấy.
- **Shadow Strategy:** không bóng (xem Elevation).
- **Border:** 1px dòng kẻ; hover chuyển sang mực focus 40%.
- **Internal Padding:** 16px. Toàn bộ dòng bấm được (link tiêu đề phủ cả thẻ); nút thao tác đặt ngoài thẻ.

### Inputs / Fields
- **Style:** nền tờ trắng, viền 1px màu viền ô nhập, bo 6px, cao 36px (40px trên mobile cho select của bộ lọc).
- **Focus:** viền đổi sang mực focus kèm vòng 3px.
- **Error:** viền đỏ, thông báo lỗi tiếng Việt ngay dưới ô (liên kết bằng aria-describedby); giá trị đã nhập được giữ lại.

### Navigation
- **Header:** logo "DH" trên ô mực bo 6px; nút biểu tượng đổi giao diện (Tự động → Sáng → Tối, lucide Monitor/Sun/Moon) đặt trước menu người dùng; menu chữ 14px màu bút chì, hover nền nhạt. Dưới 640px menu là hàng riêng gồm Deadline, Môn học, Bảng của tôi, vùng chạm 44px. Tên và vai trò người dùng luôn hiển thị.
- **Sidebar dashboard:** mục đang mở nền mực chữ giấy (aria-current); mục đang tải hiện chấm nhỏ nhấp nháy bên phải.

### Hạn gần nhất (signature)
Một trang sổ đảo màu: nền mực, bo 11px, padding 32px (token `--panel`; ở giao diện tối là night-panel, nổi nhẹ trên giấy đêm thay vì đảo thành mảng sáng). Con số ngày còn lại cỡ 4.5rem đậm, tabular; dưới là chấm màu môn, tên deadline (link) và câu hạn đầy đủ. Đây là điểm nhấn duy nhất của hệ; không lặp lại khối đảo màu này ở chỗ khác.

## Do's and Don'ts

### Do:
- **Do** sắp mọi danh sách deadline theo hạn tăng dần và đặt cột ngày bên trái.
- **Do** dùng chữ số tabular cho ngày, giờ và số liệu.
- **Do** chỉ dùng đỏ trễ hạn cho việc đã trễ và thao tác xoá.
- **Do** kiểm tra cả giao diện sáng và tối ở 390px và 1280px, tương phản AA cho mọi nhãn trạng thái.
- **Do** để vùng chạm tối thiểu 40px trên mobile cho các điều khiển chính.

### Don't:
- **Don't** dùng viền trái màu dày (trên 1px) cho thẻ, khối trích dẫn hay thông báo; dùng chấm màu môn học thay thế.
- **Don't** đổ bóng cho thẻ hay nút.
- **Don't** thêm font thứ hai hay chữ monospace cho ngày giờ.
- **Don't** đặt nhãn nhỏ viết hoa (eyebrow) phía trên tiêu đề.
- **Don't** dùng emoji hay ký tự Unicode thay icon; dùng lucide.
