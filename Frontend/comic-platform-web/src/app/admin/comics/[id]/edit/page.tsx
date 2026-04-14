"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";

export default function EditComicPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  const [comicId, setComicId] = useState<string>("");
  const [formData, setFormData] = useState({
    comicId: 0,
    title: "",
    slug: "",
    description: "",
    coverImage: "",
    status: ""
  });
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [availableGenres, setAvailableGenres] = useState<any[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const resolvedParams = await params;
      setComicId(resolvedParams.id);
      fetchComicData(resolvedParams.id);
    };
    init();
  }, [params]);

  const fetchComicData = async (id: string) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    try {
      // Load genres
      const resGenres = await fetch(`${apiUrl}/api/genres`);
      if (resGenres.ok) {
        setAvailableGenres(await resGenres.json());
      }

      // Load comic
      const resComic = await fetch(`${apiUrl}/api/comics/${id}`);
      if (resComic.ok) {
        const comic = await resComic.json();
        setFormData({
          comicId: comic.comicId,
          title: comic.title,
          slug: comic.slug,
          description: comic.description || "",
          coverImage: comic.coverImage || "",
          status: comic.status || "Ongoing"
        });

        if (comic.comicGenres) {
          setSelectedGenres(comic.comicGenres.map((cg: any) => cg.genreId));
        }
      } else {
        alert("Không tìm thấy truyện!");
        router.push("/admin");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleGenre = (genreId: number) => {
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter(id => id !== genreId));
    } else {
      setSelectedGenres([...selectedGenres, genreId]);
    }
  };

  const handleUploadCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
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
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const token = localStorage.getItem("token");
      
      // Update basic info
      const res = await fetch(`${apiUrl}/api/comics/${comicId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        // Assign genres
        await fetch(`${apiUrl}/api/comics/${comicId}/genres`, {
            method: "POST",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(selectedGenres)
        });

        alert("Đã cập nhật bộ truyện thành công!");
        router.push("/admin");
      } else {
        const errorText = await res.text();
        alert(`Lỗi khi cập nhật truyện: ${errorText}`);
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

  if (loading) return <div className="container" style={{ padding: "4rem", textAlign: "center" }}>Đang tải...</div>;

  return (
    <AdminGuard>
      <div className="container animate-fade-in" style={{ maxWidth: "800px" }}>
      <Link href="/admin" style={{ color: "var(--text-secondary)", display: "block", marginBottom: "1rem" }}>
        ← Quay lại trang quản trị
      </Link>
      <h1 className="title">Chỉnh Sửa Truyện</h1>

      <form className="glass-panel" style={{ padding: "2rem" }} onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Tên Truyện</label>
          <input
            type="text"
            className="form-input"
            required
            value={formData.title}
            onChange={(e) => updateSlug(e.target.value)}
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
              style={{ flex: 1 }}
            />
            <label style={{ cursor: "pointer", background: "var(--surface-color)", padding: "0.8rem 1rem", borderRadius: "8px", border: "1px solid var(--surface-border)", fontSize: "0.9rem", color: "var(--text-primary)" }}>
              {uploading ? "Đang tải..." : "Tệp từ máy..."}
              <input type="file" accept="image/*" onChange={handleUploadCover} style={{ display: "none" }} disabled={uploading} />
            </label>
          </div>
          {formData.coverImage && (
            <div style={{ marginTop: "1rem", borderRadius: "8px", overflow: "hidden", width: "120px", border: "1px solid #444" }}>
              <img src={formData.coverImage} alt="Cover Preview" style={{ width: "100%", height: "auto", objectFit: "cover" }} />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Thể Loại (Genres)</label>
          {availableGenres.length === 0 ? (
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }}>Chưa có thể loại nào.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "10px", marginTop: "10px" }}>
              {availableGenres.map(g => (
                <label key={g.genreId} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", padding: "0.5rem", background: "rgba(255,255,255,0.05)", borderRadius: "6px", border: selectedGenres.includes(g.genreId) ? "1px solid var(--accent-color)" : "1px solid transparent" }}>
                  <input 
                    type="checkbox" 
                    checked={selectedGenres.includes(g.genreId)} 
                    onChange={() => toggleGenre(g.genreId)} 
                    style={{ width: "16px", height: "16px", accentColor: "var(--accent-color)" }}
                  />
                  <span>{g.name}</span>
                </label>
              ))}
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
            style={{ fontFamily: "inherit" }}
          />
        </div>

        <button type="submit" className="btn" style={{ width: "100%", marginTop: "1rem" }} disabled={submitting}>
          {submitting ? "Đang xử lý..." : "Lưu Thông Tin Truyện"}
        </button>
      </form>
    </div>
    </AdminGuard>
  );
}
