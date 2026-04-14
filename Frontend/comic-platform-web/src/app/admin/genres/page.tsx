"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface Genre {
  genreId: number;
  name: string;
  slug: string;
}

export default function AdminGenresPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  
  // Form State
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const router = useRouter();

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/genres`);
      if (res.ok) {
        setGenres(await res.json());
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !slug) return alert("Vui lòng nhập tên và slug!");

    const token = localStorage.getItem("token");
    if (!token) return router.push("/login");

    const payload = { genreId: isEditing || 0, name, slug };
    const url = isEditing ? `${API_URL}/api/genres/${isEditing}` : `${API_URL}/api/genres`;
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsEditing(null);
        setName("");
        setSlug("");
        fetchGenres();
      } else {
        const err = await res.text();
        alert(`Lỗi: ${err}`);
      }
    } catch (error) {
      alert("Đã xảy ra lỗi hệ thống.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa thể loại này? Tất cả các truyện thuộc thể loại này sẽ bị gỡ bỏ danh mục.")) return;

    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/api/genres/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });

    if (res.ok) {
      fetchGenres();
    } else {
      alert("Lỗi khi xóa thể loại!");
    }
  };

  const startEdit = (genre: Genre) => {
    setIsEditing(genre.genreId);
    setName(genre.name);
    setSlug(genre.slug);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing) {
      // Auto generate slug
      let s = val.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9\-]/g, '');
      setSlug(s);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <Link href="/admin" className="btn" style={{ background: "transparent", border: "1px solid var(--surface-border)" }}>
           ← Trở về Dashboard
        </Link>
      </div>

      <h1 className="title">Quản Lý Thể Loại (Genres)</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Thêm, sửa, xóa các thể loại truyện (Được tự động gán lên thanh điều hướng cho người đọc).</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
        {/* FORM */}
        <div className="glass-panel" style={{ padding: "1.5rem", height: "fit-content" }}>
          <h2 style={{ marginTop: 0, marginBottom: "1.5rem" }}>
            {isEditing ? "✏️ Cập Nhật Thể Loại" : "✨ Thêm Thể Loại Mới"}
          </h2>
          <form onSubmit={handleCreateOrUpdate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">Tên thể loại (Tiếng Việt)</label>
              <input type="text" className="form-input" value={name} onChange={(e) => handleNameChange(e.target.value)} required placeholder="VD: Hành Động" />
            </div>
            <div className="form-group">
              <label className="form-label">Liên kết tĩnh (Slug)</label>
              <input type="text" className="form-input" value={slug} onChange={(e) => setSlug(e.target.value)} required placeholder="VD: hanh-dong" />
            </div>
            <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
               <button type="submit" className="btn" style={{ flex: 1 }}>{isEditing ? "Lưu Thay Đổi" : "Tạo Mới"}</button>
               {isEditing && (
                 <button type="button" className="btn" onClick={() => { setIsEditing(null); setName(""); setSlug(""); }} style={{ background: "transparent", border: "1px solid var(--surface-border)" }}>Hủy</button>
               )}
            </div>
          </form>
        </div>

        {/* LIST */}
        <div className="glass-panel" style={{ padding: "1.5rem" }}>
          <h2 style={{ marginTop: 0, marginBottom: "1.5rem" }}>Danh Sách {genres.length > 0 && `(${genres.length})`}</h2>
          {loading ? (
            <p>Đang tải...</p>
          ) : genres.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", border: "1px dashed var(--surface-border)", borderRadius: "8px" }}>
              Chưa có thể loại nào. Hãy thêm ở form bên trái!
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {genres.map(g => (
                <div key={g.genreId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem", background: "rgba(0,0,0,0.2)", borderRadius: "8px", border: "1px solid var(--surface-border)" }}>
                  <div>
                    <strong style={{ fontSize: "1.1rem", display: "block", color: "var(--accent-color)" }}>{g.name}</strong>
                    <span style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>/{g.slug}</span>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button className="btn" onClick={() => startEdit(g)} style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem", background: "#f59e0b" }}>Sửa</button>
                    <button className="btn" onClick={() => handleDelete(g.genreId)} style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem", background: "#ef4444" }}>Xóa</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
