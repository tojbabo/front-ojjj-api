"use client";

import ApiRequestSection from "@/src/user/components/ApiRequestSection";
import ApiExampleSection from "@/src/user/components/ApiExampleSection";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckSessionGetAccessToken } from "@/src/auth/api/authApi";
import { useAuthStore } from "@/src/auth/store/authStore";

type UserTab = "status" | "requests" | "usage" | "example";

type ApiItem = {
  name: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  count: number;
  successRate: string;
  lastCalledAt: string;
};


const apiList: ApiItem[] = [
  {
    name: "로그인 API",
    endpoint: "/api/auth/login",
    method: "POST",
    count: 42,
    successRate: "97.6%",
    lastCalledAt: "방금 전",
  },
  {
    name: "회원가입 API",
    endpoint: "/api/auth/join",
    method: "POST",
    count: 15,
    successRate: "100%",
    lastCalledAt: "3분 전",
  },
  {
    name: "유저 정보 조회 API",
    endpoint: "/api/user/me",
    method: "GET",
    count: 88,
    successRate: "99.1%",
    lastCalledAt: "10초 전",
  },
];

const tabs: { key: UserTab; label: string }[] = [
  { key: "status", label: "API 현황" },
  { key: "requests", label: "API 신청" },
  { key: "usage", label: "상세 사용량" },
  { key: "example", label: "API 예시" },
];


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

export default function UserPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<UserTab>("status");
  const [checkingSession, setCheckingSession] = useState(true);
  const accessToken = useAuthStore((state) => state.accessToken);
  const clearAccessToken = useAuthStore((state) => state.clearAccessToken);
  const setToken = useAuthStore((state)=> state.setAccessToken);

  const totalCalls = useMemo(
    () => apiList.reduce((acc, item) => acc + item.count, 0),
    [],
  );

  useEffect(() => {
    let mounted = true;

    const verifySession = async () => {
      if(accessToken == null){
        const result = await CheckSessionGetAccessToken();
        if (!mounted) return;
  
        if(result == null){
          router.replace("/user?next=/user");
          clearAccessToken();
          return;
        }
        else{
          setToken(result.accessToken)
        }
      }
      setCheckingSession(false);
    };

    verifySession();
    return () => {
      mounted = false;
    };
  }, [router]);

  if (checkingSession) {
    return (
      <main className="mx-auto w-full max-w-6xl px-4 py-10 md:py-14">
        <section className="rounded-3xl border border-border bg-card p-6 text-sm text-muted shadow-sm">
          세션 확인 중...
        </section>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-10 md:py-14">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">내 API 대시보드</h1>
            <p className="mt-1 text-sm text-muted">
              현재 요청 중인 API와 사용 현황을 한눈에 확인합니다.
            </p>
          </div>
          <span className="rounded-full bg-[color:var(--brand-weak)] px-3 py-1 text-xs font-medium">
            총 호출 {totalCalls}회
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={
                  isActive
                    ? "inline-flex h-10 items-center justify-center rounded-full bg-[color:var(--brand)] px-4 text-sm font-semibold text-white shadow-sm"
                    : "inline-flex h-10 items-center justify-center rounded-full border border-border bg-background px-4 text-sm font-medium hover:bg-[color:var(--brand-weak)]"
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6 grid gap-4">
        {activeTab === "status" ? (
          <div>
            
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6">
              <h2 className="text-lg font-semibold">API 현황</h2>
              <p className="mt-1 text-sm text-muted">
                현재 사용 중인 API 목록입니다.
              </p>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[640px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-muted">
                      <th className="py-2 font-medium">API 이름</th>
                      <th className="py-2 font-medium">엔드포인트</th>
                      <th className="py-2 font-medium">메서드</th>
                      <th className="py-2 font-medium">호출 수</th>
                      <th className="py-2 font-medium">성공률</th>
                      <th className="py-2 font-medium">최근 호출</th>
                    </tr>
                  </thead>
                  <tbody>
                    {apiList.map((api) => (
                      <tr key={`${api.method}-${api.endpoint}`} className="border-b border-border/70">
                        <td className="py-3">{api.name}</td>
                        <td className="py-3 font-mono text-xs">{api.endpoint}</td>
                        <td className="py-3">{api.method}</td>
                        <td className="py-3">{api.count}</td>
                        <td className="py-3">{api.successRate}</td>
                        <td className="py-3">{api.lastCalledAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div style={{margin: "20px 0"}}></div>
            
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6">
              <h2 className="text-lg font-semibold">사용 가능한 API</h2>
              <div className="mt-4 overflow-x-auto">
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
            </div>
          </div>
          
        ) : null}

        {activeTab === "requests" ? (
          <ApiRequestSection/>
        ) : null}

        {activeTab === "usage" ? (
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6">
            <h2 className="text-lg font-semibold">상세 사용량</h2>
            <p className="mt-1 text-sm text-muted">
              시간대/엔드포인트별 상세 사용량 영역입니다.
            </p>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="text-xs text-muted">오늘 총 요청</div>
                <div className="mt-1 text-xl font-semibold">{totalCalls}</div>
              </div>
              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="text-xs text-muted">가장 많이 호출</div>
                <div className="mt-1 text-xl font-semibold">GET /api/user/me</div>
              </div>
              <div className="rounded-2xl border border-border bg-background p-4">
                <div className="text-xs text-muted">평균 성공률</div>
                <div className="mt-1 text-xl font-semibold">98.9%</div>
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === "example" ? (
          <ApiExampleSection />
        ) : null}
      </section>
    </main>
  );
}

