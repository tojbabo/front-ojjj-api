"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { logoutApi } from "@/domains/auth/api/authApi";
import { useAuthStore } from "@/domains/auth/store/authStore";

export default function HeaderAuthButton() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const logout = async () => {
    await logoutApi();
    clearAccessToken();
    window.location.href = "/";
  };

  if (!hydrated || !accessToken) {
    return (
      <Link
        className="inline-flex h-10 items-center justify-center rounded-full bg-[color:var(--brand)] px-4 text-sm font-semibold text-white shadow-sm hover:brightness-95"
        href="/login"
      >
        로그인
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={() => void logout()}
      className="inline-flex h-10 items-center justify-center rounded-full bg-[color:var(--brand)] px-4 text-sm font-semibold text-white shadow-sm hover:brightness-95"
    >
      로그아웃
    </button>
  );
}

