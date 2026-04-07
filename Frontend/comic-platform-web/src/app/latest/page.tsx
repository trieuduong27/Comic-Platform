import Link from "next/link";

export default async function LatestPage() {
  let comics: any[] = [];
  let total = 0;
  try {
    const apiUrl = process.env.API_URL || "http://localhost:5134";
    const res = await fetch(`${apiUrl}/api/comics/latest`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      comics = json.data ?? json;
      total = json.total ?? comics.length;
    }
  } catch (err) {
    console.error("Backend offline", err);
  }

  return (
    <div className="container animate-fade-in" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
          <Link href="/" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem" }}>Home</Link>
          <span style={{ color: "var(--text-secondary)" }}>/</span>
          <span style={{ color: "var(--text-primary)", fontSize: "0.9rem" }}>Latest</span>
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: 0 }}>
          🕐 Truyện Mới Nhất <span style={{ fontSize: "1rem", fontWeight: 400, color: "var(--text-secondary)" }}>({total} truyện)</span>
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "0.5rem" }}>Các bộ truyện mới được cập nhật gần đây nhất</p>
      </div>

      {/* Grid */}
      <div className="glass-panel" style={{ padding: "2rem" }}>
        <div className="comic-grid">
          {comics.length === 0 ? (
            <p style={{ color: "var(--text-secondary)", gridColumn: "1/-1", textAlign: "center", padding: "4rem 0" }}>Không có truyện nào.</p>
          ) : (
            comics.map((comic, i) => (
              <Link href={`/reader/${comic.comicId}`} key={comic.comicId} style={{ textDecoration: "none" }}>
                <div className="comic-card" style={{ animationDelay: `${i * 0.04}s` }}>
                  <img src={comic.coverImage} alt={comic.title} className="comic-cover" loading="lazy" />
                  <div className="comic-info">
                    <h3 className="comic-title">{comic.title}</h3>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span className="comic-status" style={{ color: comic.status === "Ongoing" ? "#34d399" : "#94a3b8" }}>
                        • {comic.status}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                        👁 {comic.viewCount?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
