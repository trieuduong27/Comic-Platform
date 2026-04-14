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

  // MangaDex logic
  const [showMangaDexUI, setShowMangaDexUI] = useState(false);
  const [mangaInfo, setMangaInfo] = useState({ mangaId: "" });
  const [isFetchingMD, setIsFetchingMD] = useState(false);
  const [mdChapters, setMdChapters] = useState<any[]>([]);
  const [importedMDChapters, setImportedMDChapters] = useState<Set<string>>(new Set());
  const [importingChapterId, setImportingChapterId] = useState<string | null>(null);

  const fetchMangaDexChapters = async () => {
    setIsFetchingMD(true);
    try {
      const apiUrl = process.env.API_URL || "http://localhost:8080";
      let mdId = mangaInfo.mangaId;

      if (!mdId) {
        // Find by title
        const resSearch = await fetch(`${apiUrl}/api/mangadex/search?title=${encodeURIComponent(comicTitle)}`);
        if (resSearch.ok) {
          const results = await resSearch.json();
          if (results.length > 0) {
            mdId = results[0].id;
            setMangaInfo({ mangaId: mdId });
          }
        }
      }

      if (!mdId) {
        alert("Không tìm thấy truyện trên MangaDex. Thử đổi tên hoặc dán trực tiếp ID MangaDex.");
        setIsFetchingMD(false);
        return;
      }

      const res = await fetch(`${apiUrl}/api/mangadex/manga/${mdId}/chapters`);
      if (res.ok) {
        const data = await res.json();
        setMdChapters(data || []);
      }
    } catch (err) {
      alert("Lỗi khi kết nối lấy danh sách chapter.");
    } finally {
      setIsFetchingMD(false);
    }
  };

  const importMdChapter = async (mdChapterId: string, chapterNum: string, titleStr: string) => {
    setImportingChapterId(mdChapterId);
    try {
      const apiUrl = process.env.API_URL || "http://localhost:8080";
      const token = localStorage.getItem("token");
      const res = await fetch(`${apiUrl}/api/mangadex/import-chapter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          mangaDexChapterId: mdChapterId,
          comicId: Number(comicId),
          chapterTitle: titleStr,
          chapterNumberStr: chapterNum
        })
      });

      if (res.ok) {
        // Success
        setImportedMDChapters(prev => {
          const next = new Set(prev);
          next.add(mdChapterId);
          return next;
        });
        fetchComicData(comicId); // Reload chapters list
      } else {
        const errorMsg = await res.text();
        alert(`Không thể tải: ${errorMsg}`);
      }
    } catch (err) {
      alert("Lỗi kết nối khi import chapter.");
    } finally {
      setImportingChapterId(null);
    }
  };

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
        <div style={{ display: "flex", gap: "10px" }}>
            <button className="btn" style={{ background: "#f97316" }} onClick={() => setShowMangaDexUI(!showMangaDexUI)}>
            {showMangaDexUI ? "Đóng MangaDex" : "Kéo từ MangaDex"}
            </button>
            <Link href={`/admin/comics/${comicId}/chapters/new`} className="btn">
            + Thêm Chapter
            </Link>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem", display: showMangaDexUI ? "block" : "none" }}>
        <h3 style={{ marginTop: 0, color: "#f97316" }}>Tải Chapter tự động bằng MangaDex API</h3>
        <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
            <input 
              type="text" 
              className="form-input" 
              style={{ flex: 1, margin: 0 }} 
              placeholder="Nhập MangaDex ID hoặc để trống hệ thống sẽ tự tìm theo tên..."
              value={mangaInfo.mangaId}
              onChange={e => setMangaInfo({...mangaInfo, mangaId: e.target.value})}
            />
            <button className="btn" onClick={fetchMangaDexChapters} disabled={isFetchingMD} style={{ width: "150px", background: "#f97316" }}>
              {isFetchingMD ? "Đang quét..." : "Quét Chapter"}
            </button>
        </div>
        
        {mdChapters.length > 0 && (
          <div style={{ maxHeight: "300px", overflowY: "auto", background: "rgba(0,0,0,0.2)", padding: "10px", borderRadius: "8px" }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Chương</th>
                  <th>Tên Chương MangaDex</th>
                  <th>Ngôn ngữ</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {mdChapters.map(c => (
                  <tr key={c.id}>
                    <td>Chapter {c.chapter}</td>
                    <td>{c.title || "---"}</td>
                    <td>{c.language}</td>
                    <td>
                      <button 
                        className="btn" 
                        style={{ padding: "0.3rem 0.6rem", fontSize: "0.8rem", background: importedMDChapters.has(c.id) ? "green" : "var(--accent-color)" }}
                        onClick={() => importMdChapter(c.id, c.chapter, c.title)}
                        disabled={importedMDChapters.has(c.id) || importingChapterId === c.id}
                      >
                        {importingChapterId === c.id ? "Đang tải..." : (importedMDChapters.has(c.id) ? "Đã Xong" : "Import")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
