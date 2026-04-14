"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const API_URL = "http://localhost:8080";

interface Genre {
  genreId: number;
  name: string;
  slug: string;
}

interface Comic {
  comicId: number;
  title: string;
  coverImage: string;
  status: string;
  viewCount: number;
}

export default function CategoriesPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<Genre | null>(null);
  const [comics, setComics] = useState<Comic[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const genreIdParam = searchParams.get("genreId");

  // Load genres on mount, auto-select based on URL ?genreId=
  useEffect(() => {
    fetch(`${API_URL}/api/genres`)
      .then((r) => r.json())
      .then((data: Genre[]) => {
        setGenres(data);
        if (data.length > 0) {
          if (genreIdParam) {
            const matched = data.find(g => g.genreId === parseInt(genreIdParam));
            setSelectedGenre(matched ?? data[0]);
          } else {
            setSelectedGenre(data[0]);
          }
        }
      })
      .catch(console.error);
  }, [genreIdParam]);

  // Load comics for selected genre
  useEffect(() => {
    if (!selectedGenre) return;
    setLoading(true);
    fetch(`${API_URL}/api/comics/by-genre/${selectedGenre.genreId}`)
      .then((r) => r.json())
      .then((json) => {
        setComics(json.data ?? json);
        setTotal(json.total ?? 0);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedGenre]);

  const genreColors: Record<string, string> = {
    Action: "linear-gradient(135deg,#ef4444,#f97316)",
    Fantasy: "linear-gradient(135deg,#8b5cf6,#3b82f6)",
    Romance: "linear-gradient(135deg,#ec4899,#f43f5e)",
  };

  return (
    <div className="container animate-fade-in" style={{ paddingTop: "2rem", paddingBottom: "4rem" }}>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <Link href="/" style={{ color: "var(--text-secondary)", textDecoration: "none", fontSize: "0.9rem" }}>Trang Chủ</Link>
        <span style={{ color: "var(--text-secondary)" }}>/</span>
        <span style={{ color: "var(--text-primary)", fontSize: "0.9rem" }}>Thể Loại</span>
      </div>

      <h1 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>Thể Loại Truyện</h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Khám phá truyện theo thể loại yêu thích</p>



      {/* Comics Grid */}
      <div className="glass-panel" style={{ padding: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>
            {selectedGenre?.name}
            {!loading && (
              <span style={{ fontSize: "0.9rem", fontWeight: 400, color: "var(--text-secondary)", marginLeft: "0.5rem" }}>
                ({total} truyện)
              </span>
            )}
          </h2>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem 0", color: "var(--text-secondary)" }}>
            <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>⏳</div>
            Đang tải...
          </div>
        ) : (
          <div className="comic-grid">
            {comics.length === 0 ? (
              <p style={{ color: "var(--text-secondary)", gridColumn: "1/-1", textAlign: "center", padding: "4rem 0" }}>
                Không có truyện nào trong thể loại này.
              </p>
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
        )}
      </div>
    </div>
  );
}
