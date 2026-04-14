"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminGuard from "@/components/AdminGuard";
import Link from "next/link";

export default function MangaDexPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [importingId, setImportingId] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setResults([]);

    try {
      const apiUrl = process.env.API_URL || "http://localhost:8080";
      const res = await fetch(`${apiUrl}/api/mangadex/search?title=${encodeURIComponent(searchQuery)}`);
      
      if (res.ok) {
        const data = await res.json();
        setResults(data || []);
      } else {
        alert("Lỗi khi tìm kiếm trên MangaDex.");
      }
    } catch (err) {
      alert("Lỗi kết nối.");
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (mangaId: string) => {
    setImportingId(mangaId);
    try {
      const apiUrl = process.env.API_URL || "http://localhost:8080";
      const token = localStorage.getItem("token");
      
      const res = await fetch(`${apiUrl}/api/mangadex/import-comic`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ mangaId })
      });

      if (res.ok) {
        const data = await res.json();
        alert("Thêm truyện thành công! Đang chuyển hướng đến trang Quản lý Chapter...");
        router.push(`/admin/comics/${data.comicId}/chapters`);
      } else {
        alert("Thêm truyện thất bại.");
      }
    } catch (err) {
      alert("Lỗi kết nối khi thêm truyện.");
    } finally {
      setImportingId(null);
    }
  };

  return (
    <AdminGuard>
      <div className="container animate-fade-in" style={{ maxWidth: "1000px" }}>
        <Link href="/admin" style={{ color: "var(--text-secondary)", display: "block", marginBottom: "1rem" }}>
          ← Quay lại danh sách Truyện
        </Link>
        <h1 className="title" style={{ color: "#f97316" }}>Tự Động Crawl (MangaDex)</h1>
        
        <form onSubmit={handleSearch} className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem", display: "flex", gap: "10px" }}>
          <input
            type="text"
            className="form-input"
            style={{ flex: 1, margin: 0 }}
            placeholder="Nhập tên truyện (VD: Solo Leveling, One Piece...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn" style={{ background: "#f97316", width: "150px" }} disabled={loading}>
            {loading ? "Đang tìm..." : "Tìm Kiếm"}
          </button>
        </form>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "20px" }}>
          {results.map((manga) => (
            <div key={manga.id} className="glass-panel" style={{ padding: "1.5rem", display: "flex", gap: "15px" }}>
              <img 
                src={manga.coverUrl || "https://via.placeholder.com/100x150"} 
                alt={manga.title} 
                style={{ width: "100px", height: "150px", objectFit: "cover", borderRadius: "8px" }} 
              />
              <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
                <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {manga.title}
                </h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                  {manga.description}
                </p>
                <button 
                  className="btn" 
                  style={{ background: "var(--accent-color)", padding: "0.5rem", fontSize: "0.9rem" }}
                  onClick={() => handleImport(manga.id)}
                  disabled={importingId === manga.id}
                >
                  {importingId === manga.id ? "Đang xử lý..." : "Import Truyện Này"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {!loading && results.length === 0 && searchQuery && (
          <div className="glass-panel" style={{ padding: "2rem", textAlign: "center" }}>
            Không tìm thấy truyện nào.
          </div>
        )}
      </div>
    </AdminGuard>
  );
}
