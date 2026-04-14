"use client";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";

export default function EditChapterPage({ params }: { params: Promise<{ id: string, chapterId: string }> }) {
  const router = useRouter();
  
  const [comicId, setComicId] = useState("");
  const [chapterId, setChapterId] = useState("");
  const [comicTitle, setComicTitle] = useState("");
  
  const [formData, setFormData] = useState({
    chapterNumber: 1,
    title: "",
    imageListContent: "" // Textarea for URLs
  });
  const [loading, setLoading] = useState(true);
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
      e.target.value = '';
    }
  };
  useEffect(() => {
    params.then((p) => {
        setComicId(p.id);
        setChapterId(p.chapterId);
        fetchData(p.id, p.chapterId);
    });
  }, [params]);

  const fetchData = async (cId: string, chId: string) => {
    try {
      const apiUrl = process.env.API_URL || "http://localhost:8080";
      
      // Fetch Comic
      const resComic = await fetch(`${apiUrl}/api/comics/${cId}`);
      if (resComic.ok) {
        const dataComic = await resComic.json();
        setComicTitle(dataComic.title);
      }

      // Fetch Chapter
      const resChapter = await fetch(`${apiUrl}/api/chapters/${chId}`);
      if (resChapter.ok) {
        const dataChapter = await resChapter.json();
        const urls = dataChapter.chapterImages?.map((img: any) => img.imageUrl).join("\n") || "";
        
        setFormData({
            chapterNumber: dataChapter.chapterNumber,
            title: dataChapter.title || "",
            imageListContent: urls
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
        setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

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
      chapterId: Number(chapterId),
      comicId: Number(comicId),
      chapterNumber: Number(formData.chapterNumber),
      title: formData.title,
      chapterImages: images
    };

    try {
      const apiUrl = process.env.API_URL || "http://localhost:8080";
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/chapters/${chapterId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        router.push(`/admin/comics/${comicId}/chapters`);
      } else {
        alert("Lỗi khi sửa chương.");
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
      <Link href={`/admin/comics/${comicId}/chapters`} style={{ color: "var(--text-secondary)", display: "block", marginBottom: "1rem" }}>
        ← Quay lại danh sách Chapter
      </Link>
      <h1 className="title">Chỉnh Sửa Chapter</h1>
      <p style={{ color: "var(--accent-color)", fontWeight: 600, marginBottom: "2rem" }}>Truyện: {comicTitle}</p>

      {loading ? (
          <p>Đang tải dữ liệu...</p>
      ) : (
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
                Hệ thống sẽ tự động cập nhật số thứ tự trang từ trên xuống dưới.
            </p>
            </div>

            <button type="submit" className="btn" style={{ width: "100%", marginTop: "1rem", background: "var(--accent-color)" }} disabled={submitting}>
            {submitting ? "Đang xử lý..." : "Cập nhật Chapter & Ảnh"}
            </button>
        </form>
      )}
    </div>
    </AdminGuard>
  );
}
