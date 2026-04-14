"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AdminGuard from "@/components/AdminGuard";

interface Chapter {
  chapterId: number;
  chapterNumber: number;
  title: string;
  createdAt: string;
}

export default function ChaptersManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [comicTitle, setComicTitle] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [comicId, setComicId] = useState<string>("");

  useEffect(() => {
    params.then((p) => {
        setComicId(p.id);
        fetchComicData(p.id);
    });
  }, [params]);

  const fetchComicData = async (id: string) => {
    try {
      const apiUrl = process.env.API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/api/comics/${id}`);
      if (res.ok) {
        const result = await res.json();
        setComicTitle(result.title);
        
        // Ensure chapters are sorted ascending by chapter number
        const sortedChapters = (result.chapters || []).sort((a: any, b: any) => a.chapterNumber - b.chapterNumber);
        setChapters(sortedChapters);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const deleteChapter = async (chapterId: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa Chapter này và toàn bộ ảnh?")) return;
    
    try {
      const apiUrl = process.env.API_URL || "http://localhost:8080";
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/chapters/${chapterId}`, { 
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setChapters(chapters.filter(c => c.chapterId !== chapterId));
      } else {
          alert("Lỗi khi xóa Chapter");
      }
    } catch (err) {
      alert("Lỗi kết nối");
    }
  };

  return (
    <AdminGuard>
      <div className="container animate-fade-in">
        <div style={{ marginBottom: "1rem" }}>
           <Link href="/admin" style={{ color: "var(--text-secondary)", textDecoration: "none" }}>← Trở về danh sách truyện</Link>
        </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 className="title" style={{ margin: 0 }}>Quản lý Chapter: <span style={{ color: "var(--accent-color)" }}>{comicTitle}</span></h1>
        <Link href={`/admin/comics/${comicId}/chapters/new`} className="btn">
          + Thêm Chapter
        </Link>
      </div>

      <div className="glass-panel" style={{ padding: "2rem" }}>
        {loading ? (
          <p>Đang tải danh sách...</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Số Chapter</th>
                <th>Tiêu đề</th>
                <th>Ngày tạo</th>
                <th>Thao Tác</th>
              </tr>
            </thead>
            <tbody>
              {chapters.map((chap) => (
                <tr key={chap.chapterId}>
                  <td>
                    <div style={{ fontWeight: 600 }}>Chapter {chap.chapterNumber}</div>
                  </td>
                  <td>{chap.title || "---"}</td>
                  <td>{new Date(chap.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <Link href={`/admin/comics/${comicId}/chapters/${chap.chapterId}/edit`} className="btn" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem", background: "var(--accent-color)" }}>
                        Sửa
                      </Link>
                      <button onClick={() => deleteChapter(chap.chapterId)} className="btn-danger">
                        Xóa
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {chapters.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ textAlign: "center", padding: "2rem" }}>Chưa có chapter nào.</td>
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
