import Link from "next/link";
import { apiList } from "@/src/common/const_apilist";

const features = [
  {
    title: "API 문서",
    desc: "엔드포인트, 파라미터, 응답 스키마를 한눈에 확인합니다.",
    meta: `${apiList.length}개 API`,
    href: "/document",
  },
  {
    title: "내 API 대시보드",
    desc: "API 현황, 신청·반납, 상세 사용량, 예시 호출을 관리합니다.",
    meta: "현황 · 신청 · 사용량 · 예시",
    href: "/user",
  },
  {
    title: "로그인",
    desc: "세션을 확인하고 API 신청·호출 기능을 이용합니다.",
    meta: "세션 인증",
    href: "/login",
  },
  {
    title: "회원가입",
    desc: "계정을 만들고 API 센터 서비스를 시작합니다.",
    meta: "신규 가입",
    href: "/login/join",
  },
];

const quickStart = [
  {
    step: "1) 회원가입 · 로그인",
    desc: "계정을 만들거나 로그인해 세션을 발급받습니다.",
    href: "/login",
  },
  {
    step: "2) API 문서 확인",
    desc: "use-amount, windows-usage 등 제공 API 스펙을 살펴봅니다.",
    href: "/document",
  },
  {
    step: "3) API 신청 · 예시 호출",
    desc: "대시보드에서 토큰을 신청하고 바로 테스트해 봅니다.",
    href: "/user",
  },
];

export default function Home() {
  return (
    <>
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
                OJJJ&apos;s API Center
              </div>
              <h1 className="mt-5 text-balance text-4xl font-semibold leading-tight tracking-tight md:text-5xl">
                문서 확인부터 API 호출까지, 한 곳에서.
              </h1>
              <p className="mt-4 max-w-xl text-pretty text-base leading-7 text-muted md:text-lg">
                API 스펙 문서, 토큰 신청, 사용량 조회, 예시 호출까지 실제
                구현된 기능으로 바로 시작할 수 있습니다.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/document"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background shadow-sm hover:opacity-90"
                >
                  API 문서 보기
                </Link>
                <Link
                  href="/user"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-semibold shadow-sm hover:bg-[color:var(--brand-weak)]"
                >
                  내 API 관리
                </Link>
              </div>

              <dl className="mt-10 grid grid-cols-3 gap-4">
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <dt className="text-xs text-muted">제공 API</dt>
                  <dd className="mt-1 text-lg font-semibold tracking-tight">
                    {apiList.length}개
                  </dd>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <dt className="text-xs text-muted">대시보드</dt>
                  <dd className="mt-1 text-lg font-semibold tracking-tight">
                    4탭
                  </dd>
                </div>
                <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <dt className="text-xs text-muted">인증</dt>
                  <dd className="mt-1 text-lg font-semibold tracking-tight">
                    로그인
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold">빠른 시작</div>
                <span className="rounded-full bg-[color:var(--brand-weak)] px-2 py-1 text-xs font-medium text-foreground">
                  3단계
                </span>
              </div>
              <div className="mt-4 space-y-3 text-sm">
                {quickStart.map((item) => (
                  <Link
                    key={item.step}
                    href={item.href}
                    className="block rounded-2xl border border-border bg-background p-4 transition-colors hover:bg-[color:var(--brand-weak)]"
                  >
                    <div className="font-semibold">{item.step}</div>
                    <div className="mt-1 text-muted">{item.desc}</div>
                  </Link>
                ))}
              </div>

              <div className="mt-6 rounded-2xl border border-border bg-background p-4">
                <div className="text-xs text-muted">예시 요청 (use-amount)</div>
                <pre className="mt-2 overflow-x-auto text-xs leading-5 text-foreground/90">
{`POST /api/usage
Content-Type: application/json

{
  "id": "<user>",
  "pw": "<password>",
  "serviceid": 1,
  "stime": "202606020000",
  "etime": "202606022359",
  "size": 100
}`}
                </pre>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-t border-border">
          <div className="mx-auto w-full max-w-6xl px-4 py-14">
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  바로가기
                </h2>
                <p className="mt-2 text-sm text-muted">
                  구현된 화면으로 이동해 문서 확인과 API 관리를 시작하세요.
                </p>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <FeatureCard key={feature.href} {...feature} />
              ))}
            </div>
          </div>
        </section>

        <section id="api" className="border-t border-border">
          <div className="mx-auto w-full max-w-6xl px-4 py-14">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-center">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">
                  제공 중인 API
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  문서 페이지에서 파라미터와 응답 형식을 확인하고, 대시보드
                  예시 탭에서 직접 호출해 볼 수 있습니다.
                </p>

                <ul className="mt-6 grid gap-3 text-sm">
                  <li className="flex gap-2">
                    <Check />
                    use-amount — 서비스 사용 내역·용량 조회
                  </li>
                  <li className="flex gap-2">
                    <Check />
                    windows-usage — 윈도우 프로그램 사용 시간
                  </li>
                  <li className="flex gap-2">
                    <Check />
                    토큰 신청·반납 및 예시 호출 지원
                  </li>
                </ul>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href="/document"
                    className="inline-flex h-10 items-center justify-center rounded-full bg-[color:var(--brand)] px-4 text-sm font-semibold text-white shadow-sm hover:brightness-95"
                  >
                    전체 문서 보기
                  </Link>
                  <Link
                    href="/user"
                    className="inline-flex h-10 items-center justify-center rounded-full border border-border bg-card px-4 text-sm font-medium shadow-sm hover:bg-[color:var(--brand-weak)]"
                  >
                    예시 호출하기
                  </Link>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">API 목록</div>
                  <Link
                    href="/document"
                    className="text-xs font-medium text-muted hover:text-foreground"
                  >
                    문서 →
                  </Link>
                </div>
                <div className="mt-4 space-y-3">
                  {apiList.map((api) => (
                    <ApiCard key={api.id} api={api} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="dashboard" className="border-t border-border">
          <div className="mx-auto w-full max-w-6xl px-4 py-14">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                내 API 대시보드
              </h2>
              <p className="mt-2 text-sm text-muted">
                로그인 후 아래 기능을 이용할 수 있습니다.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DashboardTab
                label="API 현황"
                desc="호출 수, 성공률, 최근 호출 이력"
              />
              <DashboardTab
                label="API 신청"
                desc="토큰 발급·반납, 기본 서비스 안내"
              />
              <DashboardTab
                label="상세 사용량"
                desc="서비스별 사용량 차트와 통계"
              />
              <DashboardTab
                label="API 예시"
                desc="use-amount, windows-usage 직접 호출"
              />
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex h-11 items-center justify-center rounded-full bg-foreground px-5 text-sm font-semibold text-background shadow-sm hover:opacity-90"
              >
                로그인하기
              </Link>
              <Link
                href="/login/join"
                className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-semibold shadow-sm hover:bg-[color:var(--brand-weak)]"
              >
                회원가입
              </Link>
              <Link
                href="/user"
                className="inline-flex h-11 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-medium shadow-sm hover:bg-[color:var(--brand-weak)]"
              >
                대시보드 바로가기
              </Link>
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
                  OJJJ&apos;s API Center
                </div>
                <div className="text-xs text-muted">
                  © {new Date().getFullYear()} OJ. All rights reserved.
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              <Link className="hover:text-foreground" href="/document">
                문서
              </Link>
              <Link className="hover:text-foreground" href="/user">
                내 API
              </Link>
              <Link className="hover:text-foreground" href="/login">
                로그인
              </Link>
              <Link className="hover:text-foreground" href="/login/join">
                회원가입
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

function FeatureCard({
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
    <Link
      href={href}
      className="group rounded-3xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-[color:var(--brand-weak)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-semibold tracking-tight">{title}</div>
          <div className="mt-1 text-sm leading-6 text-muted">{desc}</div>
        </div>
        <span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-border bg-background text-foreground/80 transition-colors group-hover:bg-card">
          <ArrowIcon />
        </span>
      </div>
      <div className="mt-4 inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted">
        {meta}
      </div>
    </Link>
  );
}

function ApiCard({
  api,
}: {
  api: (typeof apiList)[number];
}) {
  const path = api["API-URL"].replace(/^:/, "");

  return (
    <Link
      href="/document"
      className="block rounded-2xl border border-border bg-background p-4 transition-colors hover:bg-[color:var(--brand-weak)]"
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-7 items-center rounded-full bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
          POST
        </span>
        <code className="text-sm font-semibold">{path}</code>
      </div>
      <div className="mt-2 text-sm font-medium">{api.title}</div>
      <div className="mt-1 text-sm text-muted">{api.summary}</div>
    </Link>
  );
}

function DashboardTab({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="text-sm font-semibold">{label}</div>
      <div className="mt-1 text-sm text-muted">{desc}</div>
    </div>
  );
}

function ArrowIcon() {
  return (
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
