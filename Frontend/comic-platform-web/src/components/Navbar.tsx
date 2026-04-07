"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [user, setUser] = useState<{ username: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (token && username) {
      setUser({ username });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userId");
    setUser(null);
    router.refresh(); // Refresh page to handle cache
  };

  return (
    <nav style={{ padding: "1.5rem 2rem", borderBottom: "1px solid var(--surface-border)", background: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* LOGO */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none" }}>
          <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(139, 92, 246, 0.4)" }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/>
            </svg>
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.05em", color: "var(--text-primary)", margin: 0 }}>
            Đọc Truyện Tranh <span style={{ color: "var(--accent-color)" }}>Online</span>
          </h1>
        </Link>
        
        {/* NAVIGATION LINKS */}
        <div style={{ display: "flex", gap: "2rem", fontWeight: 500, color: "var(--text-secondary)", alignItems: "center" }}>
          <Link href="/" style={{ color: "var(--text-primary)", textDecoration: "none", transition: "color 0.2s" }}>Home</Link>
          <Link href="/latest" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }}>Latest</Link>
          <Link href="/categories" style={{ color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }}>Categories</Link>
          
          <div style={{ width: "1px", height: "24px", background: "var(--surface-border)" }}></div>
          
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>Hi, {user.username}</span>
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
