"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<{ username: string; role?: string | null } | null>(null);
  const [genres, setGenres] = useState<any[]>([]);
  const [isHovering, setIsHovering] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    const role = localStorage.getItem("role");
    if (token && username) {
      setUser({ username, role });
    }

    // Load genres
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    fetch(`${apiUrl}/api/genres`)
      .then(res => res.json())
      .then(data => setGenres(data))
      .catch(console.error);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    setUser(null);
    router.refresh(); // Refresh page to handle cache
  };

  return (
    <nav style={{ padding: "1.5rem 2rem", borderBottom: "1px solid var(--surface-border)", background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* LOGO AND NAVIGATION */}
        <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "nowrap" }}>
          {/* LOGO */}
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", whiteSpace: "nowrap" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(139, 92, 246, 0.4)", flexShrink: 0 }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
              </svg>
            </div>
            <h1 style={{ fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.05em", color: "var(--text-primary)", margin: 0, whiteSpace: "nowrap" }}>
              Truyện Tranh <span style={{ color: "var(--accent-color)" }}>Online</span>
            </h1>
          </Link>

          {/* MAIN NAVIGATION */}
          <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", whiteSpace: "nowrap" }}>
          <Link href="/" style={{ 
            color: pathname === '/' ? "white" : "var(--text-secondary)", 
            textDecoration: "none", 
            transition: "all 0.2s",
            fontSize: "1.05rem",
            fontWeight: pathname === '/' ? 700 : 500,
            whiteSpace: "nowrap",
            textShadow: pathname === '/' ? "0 0 12px rgba(59, 130, 246, 0.5)" : "none"
          }}>
            Trang Chủ
          </Link>
          <Link href="/latest" style={{ 
            color: pathname === '/latest' ? "white" : "var(--text-secondary)", 
            textDecoration: "none", 
            transition: "all 0.2s",
            fontSize: "1.05rem",
            fontWeight: pathname === '/latest' ? 700 : 500,
            whiteSpace: "nowrap",
            textShadow: pathname === '/latest' ? "0 0 12px rgba(59, 130, 246, 0.5)" : "none"
          }}>
            Truyện Mới Nhất
          </Link>
          <div 
            style={{ position: "relative" }} 
            className="nav-dropdown-wrapper"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <Link href="/categories" style={{ 
               color: pathname?.startsWith('/categories') ? "white" : "var(--text-secondary)", 
               textDecoration: "none", 
               transition: "all 0.2s",
               fontSize: "1.05rem",
               fontWeight: pathname?.startsWith('/categories') ? 700 : 500,
               whiteSpace: "nowrap",
               textShadow: pathname?.startsWith('/categories') ? "0 0 12px rgba(59, 130, 246, 0.5)" : "none",
               display: "flex",
               alignItems: "center",
               gap: "0.25rem",
               padding: "1rem 0"
            }}>
              Thể Loại Truyện ▾
            </Link>
            
            {/* Mega Menu Dropdown */}
            {isHovering && genres.length > 0 && (
              <div style={{
                position: "absolute",
                top: "100%",
                left: "-200%",
                width: "600px",
                background: "var(--surface-color)",
                border: "1px solid var(--surface-border)",
                borderRadius: "8px",
                padding: "1.5rem",
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "1rem",
                boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                zIndex: 100,
                backdropFilter: "blur(12px)"
              }}>
                 {genres.map(g => (
                   <Link 
                     key={g.genreId} 
                     href={`/categories?genreId=${g.genreId}`}
                     onClick={() => { setIsHovering(false); }}
                     style={{
                       color: "var(--text-secondary)",
                       textDecoration: "none",
                       fontSize: "0.95rem"
                     }}
                     className="genre-dropdown-item"
                   >
                     {g.name}
                   </Link>
                 ))}
                 <style dangerouslySetInnerHTML={{__html: `
                   .genre-dropdown-item:hover { color: var(--accent-color) !important; font-weight: 600; }
                 `}} />
              </div>
            )}
          </div>
          </div>
        </div>
        
        {/* RIGHT MENU -> AUTH AND ADMIN */}
        <div style={{ display: "flex", gap: "1.5rem", fontWeight: 500, color: "var(--text-secondary)", alignItems: "center", whiteSpace: "nowrap" }}>
          {user?.role === "Admin" && (
            <Link href="/admin" style={{ 
              color: pathname?.startsWith('/admin') ? "white" : "var(--accent-color)", 
              fontWeight: 600, 
              textDecoration: "none",
              whiteSpace: "nowrap",
              textShadow: pathname?.startsWith('/admin') ? "0 0 12px rgba(139, 92, 246, 0.5)" : "none"
            }}>Quản Trị</Link>
          )}
          
          <div style={{ width: "1px", height: "24px", background: "var(--surface-border)" }}></div>
          
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {user.role === "Admin" ? (
                <span style={{ color: "var(--accent-color)", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.25rem", background: "rgba(139, 92, 246, 0.15)", padding: "0.4rem 0.8rem", borderRadius: "8px" }}>
                  👑 Admin: {user.username}
                </span>
              ) : (
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Hi, {user.username}</span>
              )}
              <button 
                onClick={handleLogout}
                style={{ background: "transparent", border: "1px solid var(--surface-border)", color: "var(--text-secondary)", padding: "0.5rem 1rem", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s" }}
              >
                Đăng Xuất
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: "1rem" }}>
              <Link href="/login" style={{ color: "var(--text-primary)", textDecoration: "none", padding: "0.5rem 1rem", borderRadius: "8px", transition: "background 0.2s" }}>
                Đăng Nhập
              </Link>
              <Link href="/register" style={{ background: "var(--accent-color)", color: "white", textDecoration: "none", padding: "0.5rem 1rem", borderRadius: "8px", fontWeight: 600, transition: "background 0.2s" }}>
                Đăng Ký
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
