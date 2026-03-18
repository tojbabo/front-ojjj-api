import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-4">
          <Link href="/" className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--brand)] text-white"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 18V6h6.25c3.14 0 5.3 2.02 5.3 5 0 3.05-2.2 5.02-5.46 5.02H9.8V18H6Z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">
                OJ 개발자 센터
              </div>
              <div className="text-xs text-muted">Developers</div>
            </div>
          </Link>

          <nav className="ml-4 hidden items-center gap-5 text-sm font-medium md:flex">
            <a className="text-foreground/80 hover:text-foreground" href="#docs">
              문서
            </a>
            <a
              className="text-foreground/80 hover:text-foreground"
              href="#api"
            >
              API
            </a>
            <a
              className="text-foreground/80 hover:text-foreground"
              href="#guides"
            >
              가이드
            </a>
            <a
              className="text-foreground/80 hover:text-foreground"
              href="#notice"
            >
              공지
            </a>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <label className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-2 text-sm text-muted shadow-sm sm:flex">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-muted"
              >
                <path
                  d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M16.5 16.5 21 21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <input
                className="w-64 bg-transparent outline-none placeholder:text-muted"
                placeholder="문서/SDK/에러코드 검색"
              />
              <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted">
                /
              </span>
            </label>
            <a
              className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-card px-4 text-sm font-medium shadow-sm hover:bg-[color:var(--brand-weak)]"
              href="#"
            >
              콘솔
            </a>
            <a
              className="inline-flex h-10 items-center justify-center rounded-full bg-[color:var(--brand)] px-4 text-sm font-semibold text-white shadow-sm hover:brightness-95"
              href="#"
            >
              로그인
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <div className="absolute -top-24 left-1/2 h-72 w-[720px] -translate-x-1/2 rounded-full bg-[color:var(--brand-weak)] blur-2xl" />
            <div className="absolute -bottom-24 right-[-120px] h-72 w-72 rounded-full bg-[color:var(--brand-weak)] blur-2xl" />
          </div>

          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-[1.2fr_.8fr] md:py-20">
            <div className="flex flex-col justify-center">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted shadow-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--brand)]" />
                빠르게 시작하는 개발자 경험
              </div>
              <h1 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                API부터 가이드까지, 개발에 필요한 모든 것을 한 곳에.
              </h1>
              <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-muted md:text-lg">
                인증, 요청/응답 예시, SDK, 샘플 코드, 에러 코드, 변경 이력까지.
                팀이 바로 적용할 수 있도록 정리된 문서를 제공합니다.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#docs"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background shadow-sm hover:opacity-90"
                >
                  문서 시작하기
                </a>
                <a
                  href="#api"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-semibold shadow-sm hover:bg-[color:var(--brand-weak)]"
                >
                  API 레퍼런스
                </a>
              </div>

              <dl className="mt-10 grid grid-cols-3 gap-4">
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <dt className="text-xs text-muted">가이드</dt>
                  <dd className="mt-1 text-lg font-semibold tracking-tight">
                    20+
                  </dd>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <dt className="text-xs text-muted">API</dt>
                  <dd className="mt-1 text-lg font-semibold tracking-tight">
                    60+
                  </dd>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <dt className="text-xs text-muted">업데이트</dt>
                  <dd className="mt-1 text-lg font-semibold tracking-tight">
                    주 1회
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">빠른 시작</div>
                <span className="rounded-full bg-[color:var(--brand-weak)] px-2 py-1 text-xs font-medium text-foreground">
                  3분 컷
                </span>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-2xl border border-border bg-background p-4">
                  <div className="font-semibold">1) 앱 등록</div>
                  <div className="mt-1 text-muted">
                    콘솔에서 키 발급 및 도메인 설정
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-background p-4">
                  <div className="font-semibold">2) 인증 적용</div>
                  <div className="mt-1 text-muted">
                    토큰/서명 규칙 및 샘플 코드 확인
                  </div>
                </div>
                <div className="rounded-2xl border border-border bg-background p-4">
                  <div className="font-semibold">3) 호출 &amp; 모니터링</div>
                  <div className="mt-1 text-muted">
                    요청 로그/에러 코드/레이트리밋 체크
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-border bg-background p-4">
                <div className="text-xs text-muted">예시 요청</div>
                <pre className="mt-2 overflow-x-auto text-xs leading-5 text-foreground/90">
{`curl -X POST "https://api.oj.example/v1/messages" \\
  -H "Authorization: Bearer <token>" \\
  -H "Content-Type: application/json" \\
  -d '{"message":"hello"}'`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section id="docs" className="border-t border-border">
          <div className="mx-auto w-full max-w-6xl px-4 py-14">
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  문서 &amp; 도구
                </h2>
                <p className="mt-2 text-sm text-muted">
                  가장 많이 찾는 항목을 빠르게 탐색하세요.
                </p>
              </div>
              <a
                href="#"
                className="hidden text-sm font-semibold text-foreground/80 hover:text-foreground md:block"
              >
                전체 보기 →
              </a>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card
                title="API 레퍼런스"
                desc="엔드포인트, 파라미터, 응답 스키마"
                meta="REST • JSON"
                href="#api"
              />
              <Card
                title="인증 가이드"
                desc="토큰/서명, 권한, 보안 권장사항"
                meta="OAuth • HMAC"
                href="#guides"
              />
              <Card
                title="SDK & 샘플"
                desc="빠르게 붙여쓰는 예제와 스타터"
                meta="JS • TS"
                href="#guides"
              />
              <Card
                title="에러 코드"
                desc="원인/해결 방법과 재시도 정책"
                meta="Troubleshooting"
                href="#guides"
              />
              <Card
                title="변경 이력"
                desc="버전별 변경 사항과 마이그레이션"
                meta="Changelog"
                href="#notice"
              />
              <Card
                title="상태 페이지"
                desc="장애/점검/지연 현황 모니터링"
                meta="Status"
                href="#notice"
              />
            </div>
          </div>
        </section>

        <section id="api" className="border-t border-border">
          <div className="mx-auto w-full max-w-6xl px-4 py-14">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  읽기 쉬운 API, 바로 붙는 예제
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  요청/응답 예시와 함께 필수 헤더, 페이지네이션, 레이트리밋,
                  오류 처리까지 한 번에 확인할 수 있습니다.
                </p>

                <ul className="mt-6 grid gap-3 text-sm">
                  <li className="flex gap-2">
                    <Check />
                    인증/권한 모델을 문서 중심으로 정리
                  </li>
                  <li className="flex gap-2">
                    <Check />
                    에러 코드별 재시도/대응 가이드 제공
                  </li>
                  <li className="flex gap-2">
                    <Check />
                    샘플 코드/SDK로 빠른 PoC 지원
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">엔드포인트 예시</div>
                  <span className="text-xs text-muted">v1</span>
                </div>
                <div className="mt-4 space-y-3">
                  <Endpoint
                    method="GET"
                    path="/v1/profile"
                    desc="내 프로필 조회"
                  />
                  <Endpoint
                    method="POST"
                    path="/v1/messages"
                    desc="메시지 발송"
                  />
                  <Endpoint
                    method="GET"
                    path="/v1/messages/{id}"
                    desc="메시지 상세"
                  />
                </div>
                <div className="mt-6 rounded-2xl border border-border bg-background p-4 text-sm">
                  <div className="font-semibold">Tip</div>
                  <div className="mt-1 text-muted">
                    각 엔드포인트에 요청 예시, 권한 범위, 오류 코드가 함께
                    제공되도록 설계해두면 운영 단계에서 시간이 크게 절약됩니다.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="notice" className="border-t border-border">
          <div className="mx-auto w-full max-w-6xl px-4 py-14">
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  공지 &amp; 업데이트
                </h2>
                <p className="mt-2 text-sm text-muted">
                  변경 사항과 운영 공지를 빠르게 확인하세요.
                </p>
              </div>
              <a
                href="#"
                className="hidden text-sm font-semibold text-foreground/80 hover:text-foreground md:block"
              >
                더 보기 →
              </a>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
              <Notice
                tag="업데이트"
                title="v1 메시지 API 응답 필드 확장"
                date="2026.03.18"
              />
              <Notice
                tag="점검"
                title="콘솔 일부 기능 점검 안내"
                date="2026.03.21"
              />
              <Notice
                tag="가이드"
                title="인증 실패(401) 디버깅 체크리스트"
                date="2026.03.12"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[color:var(--brand)] text-white">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 18V6h6.25c3.14 0 5.3 2.02 5.3 5 0 3.05-2.2 5.02-5.46 5.02H9.8V18H6Z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <div>
                <div className="text-sm font-semibold tracking-tight">
                  OJ 개발자 센터
                </div>
                <div className="text-xs text-muted">
                  © {new Date().getFullYear()} OJ. All rights reserved.
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              <a className="hover:text-foreground" href="#">
                이용약관
              </a>
              <a className="hover:text-foreground" href="#">
                개인정보처리방침
              </a>
              <a className="hover:text-foreground" href="#">
                문의하기
              </a>
              <a className="hover:text-foreground" href="#">
                상태 페이지
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Card({
  title,
  desc,
  meta,
  href,
}: {
  title: string;
  desc: string;
  meta: string;
  href: string;
}) {
  return (
    <a
      href={href}
      className="group rounded-3xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-[color:var(--brand-weak)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-semibold tracking-tight">{title}</div>
          <div className="mt-1 text-sm leading-6 text-muted">{desc}</div>
        </div>
        <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-border bg-background text-foreground/80 transition-colors group-hover:bg-card">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 17 17 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M10 7h7v7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
      <div className="mt-4 inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted">
        {meta}
      </div>
    </a>
  );
}

function Check() {
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
  );
}

function Endpoint({
  method,
  path,
  desc,
}: {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  desc: string;
}) {
  const methodTone =
    method === "GET"
      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
      : method === "POST"
        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
        : "bg-zinc-500/10 text-zinc-700 dark:text-zinc-300";

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center gap-3">
        <span
          className={`inline-flex h-7 items-center rounded-full px-3 text-xs font-semibold ${methodTone}`}
        >
          {method}
        </span>
        <code className="text-sm font-semibold">{path}</code>
      </div>
      <div className="mt-2 text-sm text-muted">{desc}</div>
    </div>
  );
}

function Notice({
  tag,
  title,
  date,
}: {
  tag: string;
  title: string;
  date: string;
}) {
  return (
    <a
      href="#"
      className="rounded-3xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-[color:var(--brand-weak)]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground/80">
          {tag}
        </span>
        <span className="text-xs text-muted">{date}</span>
      </div>
      <div className="mt-4 text-base font-semibold leading-6 tracking-tight">
        {title}
      </div>
      <div className="mt-3 text-sm font-semibold text-foreground/80">
        자세히 보기 →
      </div>
    </a>
  );
}
