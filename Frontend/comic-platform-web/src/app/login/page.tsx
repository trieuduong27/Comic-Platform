"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5134/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, passwordHash: password }), // Backend maps PasswordHash field currently
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Login failed");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username);
      localStorage.setItem("userId", data.userId);
      
      // Navigate to home and refresh
      window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "Invalid username or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div className="glass-panel" style={{ padding: "3rem", width: "100%", maxWidth: "400px", borderRadius: "16px" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700, textAlign: "center", marginBottom: "2rem" }}>Đăng Nhập</h2>
        
        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "white", outline: "none" }}
              placeholder="Nhập tài khoản"
            />
          </div>
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "white", outline: "none" }}
              placeholder="Nhập mật khẩu"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            style={{ width: "100%", padding: "1rem", borderRadius: "8px", background: "var(--accent-color)", color: "white", fontWeight: 600, border: "none", cursor: isLoading ? "not-allowed" : "pointer", marginTop: "1rem", opacity: isLoading ? 0.7 : 1 }}
          >
            {isLoading ? "Đang xử lý..." : "Đăng Nhập"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "2rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Chưa có tài khoản? <Link href="/register" style={{ color: "var(--accent-color)", textDecoration: "none", fontWeight: 600 }}>Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  );
}
