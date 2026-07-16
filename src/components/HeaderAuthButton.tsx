"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { RequestLogout, CheckSessionGetAccessToken } from "@/src/auth/api/authApi";
import { useAuthStore } from "@/src/auth/store/authStore";

export default function HeaderAuthButton() {
  const router = useRouter();
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);
  const applySession = useAuthStore((state) => state.applySession);

  useEffect(() => {
    if (accessToken != null) return;

    let mounted = true;

    const validateSession = async () => {
      const session = await CheckSessionGetAccessToken();
      if (!mounted || session == null) return;
      applySession(session);
    };

    void validateSession();

    return () => {
      mounted = false;
    };
  }, [accessToken, applySession]);

  const logout = async () => {
    await RequestLogout();
    clearAccessToken();
    router.replace("/");
  };

  if (accessToken == null) {
    return (
      <Link
        className="inline-flex h-10 items-center justify-center rounded-full bg-[color:var(--brand)] px-4 text-sm font-semibold text-white shadow-sm hover:brightness-95"
        href="/login"
      >
        로그인
      </Link>
    );
  }
  else{
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

}

