"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";

export default function NewComicPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    coverImage: "",
    status: "Ongoing"
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const apiUrl = process.env.API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/api/upload/single`, {
        method: "POST",
        body: formDataUpload
      });
      
      if (res.ok) {
        const data = await res.json();
        const fullUrl = `${apiUrl}${data.url}`;
        setFormData({ ...formData, coverImage: fullUrl });
      } else {
        alert("Upload ảnh thất bại!");
      }
    } catch (err) {
      alert("Lỗi khi kết nối upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const apiUrl = process.env.API_URL || "http://localhost:8080";
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/comics`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        const errorText = await res.text();
        console.error("Lỗi từ backend:", errorText);
        alert(`Lỗi khi thêm truyện: ${errorText}`);
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối Backend.");
    } finally {
      setSubmitting(false);
    }
  };

  const updateSlug = (title: string) => {
    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w ]+/g, "")
      .replace(/ +/g, "-");
    setFormData({ ...formData, title, slug });
  };

  return (
    <AdminGuard>
      <div className="container animate-fade-in" style={{ maxWidth: "800px" }}>
      <Link href="/admin" style={{ color: "var(--text-secondary)", display: "block", marginBottom: "1rem" }}>
        ← Quay lại trang quản trị
      </Link>
      <h1 className="title">Thêm Truyện Mới</h1>

      <form className="glass-panel" style={{ padding: "2rem" }} onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên Truyện</label>
          <input
            type="text"
            className="form-input"
            required
            value={formData.title}
            onChange={(e) => updateSlug(e.target.value)}
            placeholder="Ví dụ: Solo Leveling"
          />
        </div>

        <div className="form-group">
          <label>Slug (Đường dẫn tĩnh)</label>
          <input
            type="text"
            className="form-input"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Link Ảnh Bìa (URL) hoặc Tải từ máy tính</label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input
              type="url"
              className="form-input"
              required
              value={formData.coverImage}
              onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
              placeholder="https://..."
              style={{ flex: 1 }}
            />
            <label style={{ cursor: "pointer", background: "var(--surface-color)", padding: "0.8rem 1rem", borderRadius: "8px", border: "1px solid var(--surface-border)", fontSize: "0.9rem", color: "var(--text-primary)" }}>
              {uploading ? "Đang tải..." : "Tệp từ máy..."}
              <input type="file" accept="image/*" onChange={handleUploadCover} style={{ display: "none" }} disabled={uploading} />
            </label>
          </div>
          {formData.coverImage && (
            <div style={{ marginTop: "1rem" }}>
              <img src={formData.coverImage} alt="Cover Preview" style={{ width: "100px", borderRadius: "8px", objectFit: "cover" }} />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Trạng Thái</label>
          <select
            className="form-input"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="Ongoing">Đang tiến hành (Ongoing)</option>
            <option value="Completed">Hoàn thành (Completed)</option>
          </select>
        </div>

        <div className="form-group">
          <label>Mô tả</label>
          <textarea
            className="form-input"
            rows={5}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Nội dung tóm tắt truyện..."
            style={{ fontFamily: "inherit" }}
          />
        </div>

        <button type="submit" className="btn" style={{ width: "100%", marginTop: "1rem" }} disabled={submitting}>
          {submitting ? "Đang xử lý..." : "Tạo Truyện Mới"}
        </button>
      </form>
    </div>
    </AdminGuard>
  );
}
