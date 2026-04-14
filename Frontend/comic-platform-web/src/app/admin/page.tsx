"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";

export default function AdminDashboard() {
  const [comics, setComics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComics();
  }, []);

  const fetchComics = async () => {
    try {
      const apiUrl = process.env.API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/api/comics?pageSize=100`);
      if (res.ok) {
        const result = await res.json();
        setComics(result.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteComic = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa bộ truyện này và toàn bộ chương của nó?")) return;
    
    try {
      const apiUrl = process.env.API_URL || "http://localhost:8080";
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/comics/${id}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setComics(comics.filter(c => c.comicId !== id));
      }
    } catch (err) {
      alert("Lỗi khi xóa truyện");
    }
  };

  return (
    <AdminGuard>
      <div className="container animate-fade-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="title" style={{ margin: 0 }}>Quản Lý Truyện Tranh</h1>
        <Link href="/admin/comics/new" className="btn">
          + Thêm Truyện Mới
        </Link>
      </div>

      <div className="glass-panel" style={{ padding: "2rem" }}>
        {loading ? (
          <p>Đang tải danh sách...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Bìa</th>
                <th>Tên Truyện</th>
                <th>Trạng Thái</th>
                <th>Lượt Xem</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {comics.map((comic) => (
                <tr key={comic.comicId}>
                  <td>
                    <img src={comic.coverImage} alt="" style={{ width: "50px", height: "70px", objectFit: "cover", borderRadius: "4px" }} />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{comic.title}</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{comic.slug}</div>
                  </td>
                  <td>{comic.status}</td>
                  <td>{comic.viewCount}</td>
                  <td>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <Link href={`/admin/comics/${comic.comicId}/chapters`} className="btn" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem", background: "var(--accent-color)" }}>
                        QL Chapters
                      </Link>
                      <button onClick={() => deleteComic(comic.comicId)} className="btn-danger">
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {comics.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "2rem" }}>Chưa có truyện nào trong hệ thống.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </AdminGuard>
  );
}
