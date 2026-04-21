"use client";

import Link from "next/link";
import { useEffect } from "react";
import { logoutApi, ValidToken } from "@/src/auth/api/authApi";
import { useAuthStore } from "@/src/auth/store/authStore";

export default function HeaderAuthButton() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);
  const setToken = useAuthStore((state)=> state.setAccessToken);

  useEffect(() => {
    if(accessToken == null){
      const valider = async ()=>{
        const result = await ValidToken();
        if(result != null){
          setToken(result.accessToken);
        }
      }
      valider();
    }
  }, []);

  const logout = async () => {
    await logoutApi();
    clearAccessToken();
    // window.location.href = "/";
  };

  if (!accessToken) {
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

