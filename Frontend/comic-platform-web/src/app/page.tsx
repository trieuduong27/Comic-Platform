import Link from "next/link";

export default async function Home() {
  let comics: any[] = [];
  let total = 0;
  try {
    const apiUrl = process.env.API_URL || "http://localhost:5134";
    const res = await fetch(`${apiUrl}/api/comics`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      comics = json.data ?? json;
      total = json.total ?? comics.length;
    }
  } catch (err) {
    console.error("Backend offline", err);
  }

  return (
    <div className="container animate-fade-in">
      <header style={{ marginTop: "3rem", marginBottom: "3rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "80px", height: "80px", borderRadius: "20px", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 10px 20px rgba(139, 92, 246, 0.4)", marginBottom: "1rem" }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
          </svg>
        </div>
        <h1 className="title">Đọc Truyện Tranh Online</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "1.2rem", maxWidth: 600, margin: "0 auto" }}>
          Nền tảng đọc truyện mượt mà, tốc độ cao và cực kỳ xịn xò.
        </p>
      </header>

      <div className="glass-panel" style={{ padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>🔥 Truyện Nổi Bật <span style={{ fontSize: "0.9rem", fontWeight: 400, color: "var(--text-secondary)" }}>({total} truyện)</span></h2>
          <Link href="/latest" style={{ background: "var(--accent-color)", color: "white", textDecoration: "none", padding: "0.5rem 1.2rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.9rem" }}>Xem Mới Nhất →</Link>
        </div>

        <div className="comic-grid">
          {comics?.map((comic, i) => (
            <Link href={`/reader/${comic.comicId}`} key={comic.comicId} style={{ textDecoration: "none" }}>
              <div className="comic-card" style={{ animationDelay: `${i * 0.05}s` }}>
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
          ))}
        </div>
      </div>
    </div>
  );
}
