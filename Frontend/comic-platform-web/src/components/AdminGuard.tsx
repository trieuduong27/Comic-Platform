"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "Admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
      router.push("/"); // Redirect normal users or non-logged in
    }
  }, [router]);

  if (isAdmin === null) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <p>Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  return isAdmin ? <>{children}</> : null;
}
