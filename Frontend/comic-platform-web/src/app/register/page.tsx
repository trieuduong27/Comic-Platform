"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5134/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, passwordHash: password }), // Backend maps PasswordHash field currently
      });

      if (!res.ok) {
        let msg = "Register failed";
        try {
          const data = await res.json();
          msg = data.message || msg;
        } catch {
          msg = await res.text();
        }
        throw new Error(msg);
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Đăng ký thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
      <div className="glass-panel" style={{ padding: "3rem", width: "100%", maxWidth: "400px", borderRadius: "16px" }}>
        <h2 style={{ fontSize: "2rem", fontWeight: 700, textAlign: "center", marginBottom: "2rem" }}>Đăng Ký</h2>
        
        {error && (
          <div style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background: "rgba(34, 197, 94, 0.1)", color: "#22c55e", padding: "1rem", borderRadius: "8px", marginBottom: "1.5rem", fontSize: "0.9rem" }}>
            Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...
          </div>
        )}

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
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
          <div>
            <label style={{ display: "block", marginBottom: "0.5rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "0.8rem 1rem", borderRadius: "8px", border: "1px solid var(--surface-border)", background: "rgba(255,255,255,0.05)", color: "white", outline: "none" }}
              placeholder="Nhập lại mật khẩu"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading || success}
            style={{ width: "100%", padding: "1rem", borderRadius: "8px", background: "var(--accent-color)", color: "white", fontWeight: 600, border: "none", cursor: (isLoading || success) ? "not-allowed" : "pointer", marginTop: "1rem", opacity: (isLoading || success) ? 0.7 : 1 }}
          >
            {isLoading ? "Đang xử lý..." : "Đăng Ký"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "2rem", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
          Đã có tài khoản? <Link href="/login" style={{ color: "var(--accent-color)", textDecoration: "none", fontWeight: 600 }}>Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
