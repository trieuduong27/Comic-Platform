# Comic Platform - Tiêu Chuẩn Vibe Coding & Agent Protocol

Dự án này được tối ưu để hoạt động hiệu quả khi làm việc với các hệ thống AI (như Antigravity, Cline, Cursor, v.v.). Để đảm bảo chất lượng source code, thống nhất về UI/UX và không gây ra các bug tiềm ẩn trong tương lai, mọi tác nhân (Dev hoặc AI Agent) phải tuân thủ nghiêm ngặt các quy tắc dưới đây.

## 1. Kiến Trúc Cấu Trúc Tổng Thể

- **Backend (API):** Đặt tại `Backend/ComicPlatform.API`.
  - Tech stack: C# ASP.NET Core (.NET 8/9), Entity Framework Core.
  - Chức năng: Đóng vai trò là RESTful API thuần. KHÔNG render HTML.
- **Database:** SQL Server. Kịch bản khởi tạo nằm tại `Database/init_db.sql`.
- **Frontend (Web):** Đặt tại `Frontend/comic-platform-web`.
  - Tech stack: Next.js (App Router), React, TypeScript.
  - CSS: Vanilla CSS thuần túy được khai báo trong `globals.css`.

## 2. Quy Tắc Lập Trình Frontend (Vibe & UI)

### 2.1 CSS & Design System
- **KHÔNG dùng TailwindCSS ngẫu nhiên:** Hệ thống đã được thiết kế bằng Vanilla CSS tinh xảo trong `globals.css` với các Token (CSS Variables).
- **Hệ Glassmorphism & Dark Mode:** Mọi card, bảng, component bắt buộc dùng hiệu ứng kính, viền mờ, đổ bóng theo style Dark Mode. Sử dụng class `.glass-panel` và các biến `--surface-color` cho background.
- **Micro-Animations:** Tận dụng tối đa hiệu ứng `:hover` với scale, translateY như class `.comic-card` đang có để trang web trông "sống động" (Dynamic Design).
- Mọi trang / component mới thêm phải có ít nhất `animate-fade-in` ở lớp wrapper ngoài cùng.

### 2.2 React & Next.js Performance
- **Luôn Lazy Load ẢNH:** Thành phần "Đọc truyện" (`Reader.tsx`) tải rất nhiều hình ảnh, bắt buộc phải dùng thuộc tính HTML `loading="lazy"` cho từng thẻ `<img>`.
- **SSR vs CSR:** Các component có tương tác (State, OnClick) phải được thâm `"use client";` ở dòng đầu (vd: Reader.tsx). Layout và Page tĩnh thì ưu tiên SSR.

## 3. Quy Tắc Lập Trình Backend (C# & EF Core)

### 3.1 RESTful API Chuẩn Mực
- Đặt tên endpoint dùng danh từ số nhiều (VD: `/api/comics`, `/api/chapters`).
- **Pagination Bắt Buộc:** Nếu một endpoint GET trả về List Model (như list truyện), luôn LUÔN nhận parameter `page` và `pageSize` và dùng LINQ `Skip().Take()`.

### 3.2 Tối Ưu Caching & Database Access
- **Network Optimize:** Thêm Header `Cache-Control` (`[ResponseCache]`) cho các dữ liệu ít đổi (VD: Lấy chi tiết một chapter cũ).
- **N+1 Query:** Luôn nhớ ghi `ThenInclude()` khi cần gọi các bảng nhiều lớp (Comic -> ComicGenre -> Genre).

## 4. Troubleshooting (Xử Lý Lỗi Vibe Coding)

Nếu AI / Dev thêm logic mới mà gây lỗi:
1. **Lắp ráp UI hỏng:** Kiểm tra lại thẻ đóng/mở `<div className="...">`. Kiểm tra xem đã import đúng đường dẫn `/globals.css` ở Layout hay chưa.
2. **CORS Error (Mạng):** Check file `Program.cs` xem `.UseCors("AllowAll")` đã đặt đúng trước `.UseAuthorization()` chưa.
3. **Empty Map / Map on Null:** Tại Frontend, luôn check data tồn tại `data?.length` trước khi return array map (`comics.map`). Tránh sập Next.js do Backend trả về Null.

> Tuân thủ các nguyên tắc trên, dự án sẽ không bao giờ rối và cực kỳ dễ mở rộng. Happy Vibe Coding! 🚀
