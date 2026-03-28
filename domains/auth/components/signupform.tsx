"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { joinUseCase } from "@/domains/auth/usecases/joinUseCase";

const EMAIL_RE =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignupForm() {
  const router = useRouter();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedId = id.trim();
    if (!EMAIL_RE.test(trimmedId)) {
      setErrorMessage("아이디는 이메일 형식이어야 합니다.");
      return;
    }
    if (pw !== pwConfirm) {
      setErrorMessage("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }
    if (!pw) {
      setErrorMessage("비밀번호를 입력해 주세요.");
      return;
    }

    setLoading(true);
    try {
      await joinUseCase({ id: trimmedId, pw });
      router.push("/auth");
    } catch (err) {
      setErrorMessage(
        err instanceof Error ? err.message : "회원가입에 실패했습니다.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">회원가입</h2>
          <p className="mt-1 text-sm text-muted">
            이메일과 비밀번호로 계정을 만듭니다.
          </p>
        </div>
        <span className="rounded-full bg-[color:var(--brand-weak)] px-2 py-1 text-xs font-medium text-foreground">
          OJ Auth
        </span>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={onSubmit}>
        <div className="grid gap-2">
          <label htmlFor="join-id" className="text-xs font-medium text-muted">
            아이디 (이메일)
          </label>
          <input
            id="join-id"
            name="id"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={id}
            onChange={(e) => setId(e.target.value)}
            disabled={loading}
            className="h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none placeholder:text-muted focus:border-[color:var(--brand)] disabled:opacity-70"
          />
        </div>

        <div className="grid gap-2">
          <label htmlFor="join-pw" className="text-xs font-medium text-muted">
            비밀번호
          </label>
          <input
            id="join-pw"
            name="pw"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            disabled={loading}
            className="h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none placeholder:text-muted focus:border-[color:var(--brand)] disabled:opacity-70"
          />
        </div>

        <div className="grid gap-2">
          <label
            htmlFor="join-pw-confirm"
            className="text-xs font-medium text-muted"
          >
            비밀번호 확인
          </label>
          <input
            id="join-pw-confirm"
            name="pwConfirm"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={pwConfirm}
            onChange={(e) => setPwConfirm(e.target.value)}
            disabled={loading}
            className="h-11 rounded-xl border border-border bg-background px-3 text-sm outline-none placeholder:text-muted focus:border-[color:var(--brand)] disabled:opacity-70"
          />
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
          {loading ? "처리 중..." : "회원가입 요청"}
        </button>
      </form>

      <div className="mt-5 border-t border-border pt-5 text-center text-sm text-muted">
        이미 계정이 있으신가요?{" "}
        <Link
          href="/auth"
          className="text-foreground hover:text-foreground/80"
        >
          로그인
        </Link>
      </div>
    </div>
  );
}
