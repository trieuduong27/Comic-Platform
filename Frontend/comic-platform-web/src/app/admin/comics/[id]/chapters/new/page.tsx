"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";

export default function NewChapterPage() {
  const router = useRouter();
  const params = useParams();
  const comicId = params.id;
  
  const [comicTitle, setComicTitle] = useState("");
  const [formData, setFormData] = useState({
    chapterNumber: 1,
    title: "",
    imageListContent: "" // Textarea for URLs
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleUploadPages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Sort files alphanumerically (e.g. 1.jpg, 2.jpg, ... 10.jpg)
    const filesArray = Array.from(files).sort((a, b) => 
      a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' })
    );

    setUploading(true);
    const formDataUpload = new FormData();
    for (const file of filesArray) {
        formDataUpload.append("files", file);
    }

    try {
      const apiUrl = process.env.API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/api/upload/multiple`, {
        method: "POST",
        body: formDataUpload
      });
      
      if (res.ok) {
        const data = await res.json();
        const fullUrls = data.urls.map((url: string) => `${apiUrl}${url}`);
        
        const currentContent = formData.imageListContent.trim();
        const newContent = currentContent 
            ? currentContent + "\n" + fullUrls.join("\n") 
            : fullUrls.join("\n");
            
        setFormData({ ...formData, imageListContent: newContent });
      } else {
        alert("Upload ảnh thất bại!");
      }
    } catch (err) {
      alert("Lỗi khi kết nối upload.");
    } finally {
      setUploading(false);
      // Reset input so user can select same files again if needed
      e.target.value = '';
    }
  };
  useEffect(() => {
    fetchComicInfo();
  }, [comicId]);

  const fetchComicInfo = async () => {
    try {
      const apiUrl = process.env.API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/api/comics/${comicId}`);
      if (res.ok) {
        const data = await res.json();
        setComicTitle(data.title);
        setFormData(prev => ({ ...prev, chapterNumber: (data.chapters?.length || 0) + 1 }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Parse image list
    const images = formData.imageListContent
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map((url, index) => ({
        imageUrl: url,
        pageOrder: index + 1
      }));

    if (images.length === 0) {
      alert("Vui lòng nhập ít nhất một URL ảnh trang truyện.");
      setSubmitting(false);
      return;
    }

    const payload = {
      comicId: Number(comicId),
      chapterNumber: Number(formData.chapterNumber),
      title: formData.title,
      chapterImages: images
    };

    try {
      const apiUrl = process.env.API_URL || "http://localhost:8080";
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/chapters`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        router.push("/admin");
      } else {
        alert("Lỗi khi thêm chương.");
      }
    } catch (err) {
      alert("Lỗi kết nối Backend.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminGuard>
      <div className="container animate-fade-in" style={{ maxWidth: "800px" }}>
      <Link href="/admin" style={{ color: "var(--text-secondary)", display: "block", marginBottom: "1rem" }}>
        ← Quay lại trang quản trị
      </Link>
      <h1 className="title">Thêm Chapter Mới</h1>
      <p style={{ color: "var(--accent-color)", fontWeight: 600, marginBottom: "2rem" }}>Truyện: {comicTitle}</p>

      <form className="glass-panel" style={{ padding: "2rem" }} onSubmit={handleSubmit}>
        <div style={{ display: "flex", gap: "20px" }}>
           <div className="form-group" style={{ width: "80px" }}>
            <label>Chapter</label>
            <input
              type="number"
              className="form-input"
              required
              value={formData.chapterNumber}
              onChange={(e) => setFormData({ ...formData, chapterNumber: Number(e.target.value) })}
            />
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Tên Chapter (Tùy chọn)</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="VD: Sự khởi đầu..."
            />
          </div>
        </div>

        <div className="form-group">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <label style={{ margin: 0 }}>Danh sách URL Ảnh (Mỗi dòng 1 URL)</label>
            <label style={{ cursor: "pointer", background: "var(--accent-color)", color: "white", padding: "0.5rem 1rem", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600 }}>
              {uploading ? "Đang tải ảnh lên..." : "+ Chọn ảnh từ máy tính"}
              <input type="file" multiple accept="image/*" onChange={handleUploadPages} style={{ display: "none" }} disabled={uploading} />
            </label>
          </div>
          <textarea
            className="form-input"
            rows={12}
            required
            value={formData.imageListContent}
            onChange={(e) => setFormData({ ...formData, imageListContent: e.target.value })}
            placeholder="https://imgur.com/image1.jpg&#10;https://imgur.com/image2.jpg&#10;..."
            style={{ fontFamily: "monospace", fontSize: "0.85rem" }}
          />
          <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "0.5rem" }}>
            Hệ thống sẽ tự động đánh số thứ tự trang từ trên xuống dưới.
          </p>
        </div>

        <button type="submit" className="btn" style={{ width: "100%", marginTop: "1rem", background: "#10b981" }} disabled={submitting}>
          {submitting ? "Đang xử lý..." : "Lưu Chapter & Ảnh"}
        </button>
      </form>
    </div>
    </AdminGuard>
  );
}
