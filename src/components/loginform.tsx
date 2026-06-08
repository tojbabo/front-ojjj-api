"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { safeNextPath } from "@/src/auth/lib/safeNextPath";
import { loginUseCase } from "@/src/auth/usecases/loginUseCase";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [request, setRequest] = useState<{id:string, pw:string}>({
    id: "",
    pw: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const response = await loginUseCase(request);
      if (response === 1) {
        router.push(safeNextPath(searchParams.get("next")));
      }
      if(response == 0){
        setErrorMessage("로그인에 실패했습니다.");
      }
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "로그인에 실패했습니다.",
      );
    }
    finally{
      setLoading(false);
    }
  }

  return (
    <div className="w-full rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">로그인</h2>
          <p className="mt-1 text-sm text-muted">
            개발자 센터에 로그인하고 맞춤 문서를 이용하세요.
          </p>
        </div>
        <span className="rounded-full bg-[color:var(--brand-weak)] px-2 py-1 text-xs font-medium text-foreground">
          OJ Auth
        </span>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-2">
          <label htmlFor="id" className="text-xs font-medium text-muted">
            아이디
          </label>
          <input
            id="id"
            name="id"
            type="text"
            inputMode="email"
            autoComplete="username"
            placeholder="you@example.com"
            value={request.id}
            onChange={(e) => setRequest((prev) => ({ ...prev, id: e.target.value }))}
            disabled={loading}
            className="h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none placeholder:text-muted focus:border-[color:var(--brand)] disabled:opacity-70"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="pw" className="text-xs font-medium text-muted">
            비밀번호
          </label>
          <input
            id="pw"
            name="pw"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={request.pw}
            onChange={(e) => setRequest((prev) => ({ ...prev, pw: e.target.value }))}
            disabled={loading}
            className="h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none placeholder:text-muted focus:border-[color:var(--brand)] disabled:opacity-70"
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <a href="#" className="text-sm text-muted hover:text-foreground">
            비밀번호를 잊으셨나요?
          </a>
          <span className="text-xs text-muted">로그인 요청</span>
        </div>

        {errorMessage ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-700">
            {errorMessage}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex h-11 items-center justify-center rounded-full bg-[color:var(--brand)] px-5 text-sm font-semibold text-white shadow-sm hover:brightness-95 disabled:opacity-70"
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <div className="mt-5 border-t border-border pt-5 text-center text-sm text-muted">
        계정이 없으신가요?{" "}
        <Link
          href="/login/join"
          className="text-foreground hover:text-foreground/80"
        >
          회원가입
        </Link>
      </div>
    </div>
  );
}