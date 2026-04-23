"use client";
import { useEffect, useState } from "react";
import { RequestAPIList, RequestAPIService } from "@/src/user/api/userApi";
import { useAuthStore } from "@/src/auth/store/authStore";

type RequestApiItem = {
    id: number;
    name: string;
    description: string;
    tokenKeys: string[];
};

type ApiTokenItem = {
    api?: number | string;
    token?: string;
};

const TOKEN_DISPLAY_LENGTH = 24;
  
const defaultRequestApiList: RequestApiItem[] = [
    {
      id: 1,
      name: "인증 API",
      description: "로그인/로그아웃 및 토큰 갱신 처리",
      tokenKeys: ["tok_auth_a1b2c3d4"],
    },
    {
      id: 2,
      name: "회원 API",
      description: "회원가입, 탈퇴, 계정 기본 정보 관리",
      tokenKeys: ["tok_member_e5f6g7h8"],
    },
    {
      id: 3,
      name: "프로필 API",
      description: "프로필 조회 및 수정 기능 제공",
      tokenKeys: ["tok_profile_i9j0k1l2"],
    },
    {
      id: 4,
      name: "결제 API",
      description: "결제 승인, 취소, 영수증 조회 지원",
      tokenKeys: ["tok_payment_m3n4o5p6"],
    },
    {
      id: 5,
      name: "알림 API",
      description: "푸시/이메일/문자 알림 발송 연동",
      tokenKeys: ["tok_notice_q7r8s9t0"],
    },
];

export default function ApiRequestSection() {
    const accessToken = useAuthStore((state) => state.accessToken);
    const [requestApiList, setRequestApiList] = useState<RequestApiItem[]>(defaultRequestApiList);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    useEffect(() => {
        const getApiList = async () => {
            if (!accessToken) {
                setRequestApiList(defaultRequestApiList);
                return;
            }

            try {
                const result = await RequestAPIList(accessToken);
                const apiList = Array.isArray(result[0]) ? result[0] : [];
                const tokenlist: ApiTokenItem[] = Array.isArray(result[1]) ? result[1] : [];

                const fetchedRequestApiList: RequestApiItem[] = apiList.map((element: any) => ({
                    id: element.id,
                    name: element.name,
                    description: element.desc,
                    tokenKeys: tokenlist
                        .filter((tokenItem) => Number(tokenItem.api) === Number(element.id))
                        .map((tokenItem) => tokenItem.token)
                        .filter((token): token is string => Boolean(token)),
                }));

                // 목록을 먼저 완성한 뒤 한 번에 UI 상태를 갱신
                setRequestApiList([...defaultRequestApiList, ...fetchedRequestApiList]);
            } catch {
                setRequestApiList(defaultRequestApiList);
            }
        };

        getApiList();
    }, [accessToken]);

    const handleCopyToken = async (tokenKey: string) => {
        try {
            await navigator.clipboard.writeText(tokenKey);
            setCopiedKey(tokenKey);
            window.setTimeout(() => {
                setCopiedKey((prev) => (prev === tokenKey ? null : prev));
            }, 1200);
        } catch {
            setCopiedKey(null);
        }
    };

    const handleApiAction = async (apiName: string, action: "send" | "cancel") => {
        const endpoint = `/api/test/${action}`;

        try {
            await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
                },
                body: JSON.stringify({ apiName }),
            });
        } catch {
            // TODO: 실제 API 연동 시 에러 처리 UI 추가
        }
    };

    const handleRequestServiceTouch = async (serviceId: number) => {
        if (!accessToken) return;
        console.log(await RequestAPIService(accessToken, serviceId))
    };

    const getDisplayToken = (tokenKey: string) => {
        if (!tokenKey) return "-";
        if (tokenKey.length <= TOKEN_DISPLAY_LENGTH) return tokenKey;
        return `${tokenKey.slice(0, TOKEN_DISPLAY_LENGTH)}...`;
    };

    return (
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6">
                <h2 className="text-lg font-semibold">API 요청</h2>
                <p className="mt-1 text-sm text-muted">
                API 사용을 위한 Token Key를 요청하세요.
                </p>
                <div className="mt-4 overflow-x-auto">
                <div className="min-w-[900px] rounded-2xl border border-border bg-background">
                    {requestApiList.map((api, index) => (
                    <div
                        key={api.name}
                        className={`grid grid-cols-[1.1fr_1.8fr_1.8fr_auto] items-center gap-3 px-4 py-3 ${
                        index !== requestApiList.length - 1 ? "border-b border-border" : ""
                        }`}
                    >
                        <div className="text-sm font-medium text-foreground">{api.name}</div>
                        <div className="text-sm text-muted">{api.description}</div>
                        <div className="flex flex-col gap-2">
                        {(api.tokenKeys.length > 0 ? api.tokenKeys : [""]).map((tokenKey, tokenIndex) => (
                            <div key={`${api.name}-${tokenIndex}`} className="flex items-center gap-2">
                                <span className="inline-block w-[250px] min-w-[250px] rounded-lg border border-border bg-card px-2 py-1 font-mono text-xs text-foreground">

                                    {getDisplayToken(tokenKey)}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => tokenKey && handleCopyToken(tokenKey)}
                                    disabled={!tokenKey}
                                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-muted transition-colors hover:bg-[color:var(--brand-weak)] hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                                    aria-label={`${api.name} 토큰 키 복사`}
                                >
                                    <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    >
                                    <rect
                                        x="9"
                                        y="9"
                                        width="11"
                                        height="11"
                                        rx="2"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                    />
                                    <path
                                        d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                    />
                                    </svg>
                                </button>
                                {tokenKey && copiedKey === tokenKey ? (
                                    <span className="text-xs font-medium text-[color:var(--brand)]">복사됨</span>
                                ) : null}
                            </div>
                        ))}
                        </div>
                        <div className="flex items-center justify-end gap-2">
                        <button
                            type="button"
                            onClick={() =>handleRequestServiceTouch(api.id)}
                            className="inline-flex h-9 items-center justify-center rounded-full bg-[color:var(--brand)] px-4 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
                        >
                            {api.tokenKeys.length > 0 ? "추가하기" : "신청하기"}
                        </button>
                        <button
                            type="button"
                            onClick={() => handleApiAction(api.name, "cancel")}
                            className="inline-flex h-9 items-center justify-center rounded-full border border-border bg-card px-4 text-sm font-medium text-foreground transition-colors hover:bg-[color:var(--brand-weak)]"
                        >
                            반납하기
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </div>
    )
}

