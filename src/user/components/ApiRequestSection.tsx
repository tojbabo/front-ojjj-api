"use client";
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import { RequestAPIService, RequestReleaseToken } from "@/src/user/api/userApi";
import { useAuthStore } from "@/src/auth/store/authStore";
import { apiList, ApiDocument } from "@/src/common/const_apilist";

type ApiRequestSectionProps = {
    tokenByApiId: Record<number, string>;
    setTokenByApiId: Dispatch<SetStateAction<Record<number, string>>>;
};

const defaultRequestApiList: RequestApiItem[] = apiList.map((api: ApiDocument) => ({
    id: api.id,
    name: api.title,
    description: api.summary,
    tokenKey: undefined,
}));

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const extractTokenKey = (value: unknown): string | undefined => {
    if (typeof value === "string") return value;
    if (Array.isArray(value)) return undefined;
    if (!isObject(value)) return undefined;

    const token = value.token;
    if (typeof token === "string") return token;

    const tokenKey = value.tokenKey;
    if (typeof tokenKey === "string") return tokenKey;

    const data = value.data;
    if (!isObject(data)) return undefined;

    const dataToken = data.token;
    if (typeof dataToken === "string") return dataToken;

    const dataTokenKey = data.tokenKey;
    if (typeof dataTokenKey === "string") return dataTokenKey;

    return undefined;
};

export default function ApiRequestSection({ tokenByApiId, setTokenByApiId }: ApiRequestSectionProps) {
    const accessToken = useAuthStore((state) => state.accessToken);
    const requestApiList = useMemo<RequestApiItem[]>(
        () =>
            defaultRequestApiList.map((item) => ({
                ...item,
                tokenKey: tokenByApiId[item.id],
            })),
        [tokenByApiId],
    );
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

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

    const handleRequestServiceTouch = async (serviceId: number, flag: boolean) => {
        if (!accessToken) return;
        
        if(flag){
            const receivedtoken = await RequestAPIService(accessToken, serviceId);
            const nextTokenKey = extractTokenKey(receivedtoken);

            if (nextTokenKey) {
                setTokenByApiId((prev) => ({
                    ...prev,
                    [serviceId]: String(nextTokenKey),
                }));
            }
        }
        else{
            const result = await RequestReleaseToken(accessToken, serviceId);
            const isReleaseSuccess =
                result === true ||
                (isObject(result) && (result.result === true || result.success === true));

            if (isReleaseSuccess) {
                setTokenByApiId((prev) => {
                    const next = { ...prev };
                    delete next[serviceId];
                    return next;
                });
            }

        }
    };

    const hasUsableToken = (tokenKey: string | undefined) =>
        Boolean(tokenKey && tokenKey.trim().length > 0);

    return (
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6">
                <h2 className="text-lg font-semibold">API 요청</h2>
                <p className="mt-1 text-sm text-muted">
                API 사용을 위한 Token Key를 요청하세요.
                </p>
                <div className="mt-4 overflow-x-auto">
                <div className="min-w-[900px] rounded-2xl border border-border bg-background">
                    {requestApiList.map((api, index) => (
                    <div key={api.name}
                        className={`grid grid-cols-[1.1fr_1.8fr_1.8fr_auto] items-center gap-3 px-4 py-3 ${
                        index !== requestApiList.length - 1 ? "border-b border-border" : ""}`}>
                        <div className="text-sm font-medium text-foreground">{api.name}</div>
                        <div className="text-sm text-muted">{api.description}</div>
                        <div className="flex flex-col gap-2">
                        <div key={`${api.name}`} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={api.tokenKey ?? ""}
                                onChange={(e) =>
                                    setTokenByApiId((prev) => ({
                                        ...prev,
                                        [api.id]: e.target.value,
                                    }))
                                }
                                placeholder="토큰이 없습니다. 신청하기를 눌러 발급받으세요."
                                className="inline-block h-9 w-[250px] min-w-[250px] rounded-lg border border-border bg-card px-2 py-1 font-mono text-xs text-foreground outline-none focus:border-[color:var(--brand)]"
                                autoComplete="off"
                                spellCheck={false}
                            />
                            <button
                                type="button"
                                onClick={() => api.tokenKey && handleCopyToken(api.tokenKey)}
                                disabled={!hasUsableToken(api.tokenKey)}
                                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-muted transition-colors hover:bg-[color:var(--brand-weak)] hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label={`${api.name} 토큰 키 복사`}>
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
                            {copiedKey === api.tokenKey ? (
                                <span className="text-xs font-medium text-[color:var(--brand)]">복사됨</span>
                            ) : null}
                        </div>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                        <button type="button"
                            onClick={() =>handleRequestServiceTouch(api.id, !hasUsableToken(api.tokenKey))}
                            className="inline-flex h-9 items-center justify-center rounded-full bg-[color:var(--brand)] 
                            px-4 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90">
                            {hasUsableToken(api.tokenKey) ? "반납하기" : "신청하기"}
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
                </div>
            </div>
    )
}

