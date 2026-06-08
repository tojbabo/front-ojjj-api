import { Suspense } from "react";
import LoginPage from "@/src/components/loginform";
function CheckIcon() {
  return (
    <span
      aria-hidden="true"
      className="mt-0.5 inline-flex h-5 w-5 flex-none items-center justify-center rounded-full bg-[color:var(--brand-weak)] text-[color:var(--brand)]"
    >
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="m20 7-11 11-5-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  )
}

export default function Page() {
  return (
    <main>
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-24 left-1/2 h-72 w-[720px] -translate-x-1/2 rounded-full bg-[color:var(--brand-weak)] blur-2xl" />
          <div className="absolute -bottom-24 right-[-120px] h-72 w-72 rounded-full bg-[color:var(--brand-weak)] blur-2xl" />
        </div>

        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-[1.1fr_.9fr] md:py-20">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand)]" />
              인증으로 시작하는 개발 경험
            </div>

            <h1 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
              로그인하고 더 빠르게 찾아보세요
            </h1>

            <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-muted md:text-lg">
              문서/SDK/에러코드 검색과 공지 업데이트를 한 번에 관리할 수
              있도록 도와드립니다.
            </p>

            <ul className="mt-6 grid gap-3 text-sm">
              <li className="flex gap-2">
                <CheckIcon />
                문서/가이드 하이라이트와 저장 기능
              </li>
              <li className="flex gap-2">
                <CheckIcon />
                권한에 맞춘 예시와 오류 대응 가이드
              </li>
              <li className="flex gap-2">
                <CheckIcon />
                공지 및 변경 이력 알림
              </li>
            </ul>
          </div>

          <div className="flex items-center justify-center">
            <Suspense
              fallback={
                <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 text-center text-sm text-muted shadow-sm">
                  로그인 폼을 불러오는 중…
                </div>
              }
            >
              <LoginPage />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  )
}