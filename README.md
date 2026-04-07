# 📚 Đọc Truyện Tranh Online

> Nền tảng đọc truyện tranh hiện đại, tốc độ cao với giao diện cao cấp và trải nghiệm người dùng mượt mà.

![Platform Preview](https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200&h=400&auto=format&fit=crop)

---

## ✨ Tính Năng Nổi Bật

- 🏠 **Trang Chủ** — Hiển thị truyện nổi bật, xếp hạng theo lượt xem
- 🕐 **Latest** — Truyện tranh mới nhất được cập nhật
- 📚 **Categories** — Lọc truyện theo thể loại (Action, Fantasy, Romance...)
- 🔐 **Đăng Ký / Đăng Nhập** — Xác thực người dùng với JWT & BCrypt
- 📖 **Đọc Truyện** — Trình đọc truyện inline với đa trang
- 🎨 **Dark Mode UI** — Thiết kế glassmorphism sang chảnh

---

## 🛠️ Công Nghệ Sử Dụng

### Frontend
| Công nghệ | Mô tả |
|-----------|-------|
| [Next.js 15](https://nextjs.org/) | React Framework với App Router |
| TypeScript | Type-safe JavaScript |
| Vanilla CSS | Custom design system |
| Google Fonts (Inter) | Typography |

### Backend
| Công nghệ | Mô tả |
|-----------|-------|
| ASP.NET Core (.NET 10) | Web API RESTful |
| Entity Framework Core | ORM & Database migrations |
| SQL Server (LocalDB) | Cơ sở dữ liệu |
| JWT Bearer | Xác thực token |
| BCrypt.Net | Mã hóa mật khẩu |

### DevOps
| Công nghệ | Mô tả |
|-----------|-------|
| Docker | Containerization |
| Docker Compose | Multi-service orchestration |

---

## 📁 Cấu Trúc Dự Án

```
Comic-Platform/
├── Backend/
│   └── ComicPlatform.API/       # ASP.NET Core Web API
│       ├── Controllers/         # API Endpoints
│       ├── Models/              # Entity Models
│       ├── Data/                # DbContext
│       └── appsettings.json     # Cấu hình
├── Frontend/
│   └── comic-platform-web/      # Next.js App
│       └── src/
│           ├── app/             # Pages (App Router)
│           │   ├── page.tsx         # Trang chủ
│           │   ├── latest/          # Truyện mới nhất
│           │   ├── categories/      # Thể loại
│           │   ├── login/           # Đăng nhập
│           │   ├── register/        # Đăng ký
│           │   └── reader/[id]/     # Đọc truyện
│           └── components/
│               └── Navbar.tsx       # Navigation bar
├── Database/
│   ├── init_db.sql              # Tạo schema
│   └── seed_db.sql              # Dữ liệu mẫu (10 bộ truyện)
├── docker-compose.yml           # Docker setup
└── README.md
```

---

## 🚀 Hướng Dẫn Cài Đặt

### Yêu Cầu
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/)
- [SQL Server LocalDB](https://docs.microsoft.com/en-us/sql/database-engine/configure-windows/sql-server-express-localdb) hoặc Docker

---

### 1. Cài Đặt Database

```bash
# Chạy script tạo database và thêm dữ liệu mẫu
sqlcmd -S "(localdb)\MSSQLLocalDB" -i Database/init_db.sql
sqlcmd -S "(localdb)\MSSQLLocalDB" -i Database/seed_db.sql
```

---

### 2. Chạy Backend

```bash
cd Backend/ComicPlatform.API
dotnet restore
dotnet run --launch-profile http
```

> API sẽ chạy tại: `http://localhost:5134`

---

### 3. Chạy Frontend

```bash
cd Frontend/comic-platform-web
npm install
npm run dev
```

> Web sẽ chạy tại: `http://localhost:3000`

---

### 🐳 Chạy Bằng Docker (Tùy Chọn)

```bash
docker-compose up -d --build
```

---

## 🔌 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/comics` | Lấy tất cả truyện (sắp theo view) |
| `GET` | `/api/comics/latest` | Lấy truyện mới nhất |
| `GET` | `/api/comics/{id}` | Chi tiết một bộ truyện |
| `GET` | `/api/comics/by-genre/{genreId}` | Lọc theo thể loại |
| `GET` | `/api/genres` | Danh sách thể loại |
| `GET` | `/api/chapters/{id}` | Chi tiết chapter |
| `POST` | `/api/auth/register` | Đăng ký tài khoản |
| `POST` | `/api/auth/login` | Đăng nhập, trả về JWT |

---

## 📖 Dữ Liệu Mẫu (10 Bộ Truyện)

| Tên Truyện | Thể Loại | Trạng Thái |
|-----------|----------|------------|
| The Beginning After The End | Action, Fantasy | Ongoing |
| Solo Leveling | Action | Completed |
| Chainsaw Man | Action | Ongoing |
| Omniscient Reader | Fantasy | Ongoing |
| Jujutsu Kaisen | Action | Ongoing |
| Naruto | Action, Fantasy | Completed |
| One Piece | Action, Fantasy | Ongoing |
| Bleach | Action, Fantasy | Completed |
| Attack on Titan | Action | Completed |
| Dragon Ball | Action, Fantasy | Completed |

---

## 👨‍💻 Tác Giả

**Triều Dương** — [@trieuduong27](https://github.com/trieuduong27)

---

## 📄 License

MIT License — Free to use and modify.
