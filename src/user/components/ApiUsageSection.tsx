"use client";

import { useEffect, useState } from "react";
import { RequestUsageTotal } from "../api/userApi";
import { useAuthStore } from "@/src/auth/store/authStore";
import { GetTodayyyymmdd } from "@/src/common/utils";

type UsageCount = {
    serviceId: number;
    name: string;
    count: number;
    todayCount: number;
    startDate: string;
    endDate: string;
};

type UsageSummary = {
    todayTotal: number;
    monthTotal: number;
    successRate: string;
};

const formatDateOnly = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    if (digits.length >= 8) {
        const y = digits.slice(0, 4);
        const m = digits.slice(4, 6);
        const d = digits.slice(6, 8);
        return `${y}.${m}.${d}`;
    }
    return value;
};

const formatDateRange = (startDate: string, endDate: string): string => {
    const startLabel = formatDateOnly(startDate);
    const endLabel = formatDateOnly(endDate);
    if (startLabel === endLabel) return startLabel;
    return `${startLabel} ~ ${endLabel}`;
};

const pickDateField = (item: Record<string, unknown>, keys: string[]): string | undefined => {
    for (const key of keys) {
        const raw = item[key];
        if (typeof raw === "string" && raw.trim()) return raw.trim();
        if (typeof raw === "number" && Number.isFinite(raw)) return String(raw);
    }
    return undefined;
};

const pickNumberField = (source: Record<string, unknown>, keys: string[]): number | undefined => {
    for (const key of keys) {
        const raw = source[key];
        if (typeof raw === "number" && Number.isFinite(raw)) return raw;
        if (typeof raw === "string" && raw.trim()) {
            const parsed = Number(raw.replace(/[^\d.-]/g, ""));
            if (Number.isFinite(parsed)) return parsed;
        }
    }
    return undefined;
};

const formatSuccessRate = (value: unknown): string => {
    if (typeof value === "string" && value.trim()) {
        return value.includes("%") ? value.trim() : `${value.trim()}%`;
    }
    if (typeof value === "number" && Number.isFinite(value)) {
        return `${value}%`;
    }
    return "—";
};

const parseUsageRows = (
    payload: Record<string, unknown>,
    defaultStart: string,
    defaultEnd: string,
): UsageCount[] => {
    const rawRows = Array.isArray(payload.usage) ? payload.usage : [];
    const rows: UsageCount[] = [];

    for (const item of rawRows) {
        if (typeof item !== "object" || item === null) continue;
        const record = item as Record<string, unknown>;

        rows.push({
            serviceId: Number(record.serviceId ?? 0),
            name: String(record.name ?? "알 수 없는 서비스"),
            count: Number(record.count ?? 0),
            todayCount: Number(
                pickNumberField(record, ["todayCount", "today", "dailyCount", "today_count"]) ?? 0,
            ),
            startDate: pickDateField(record, ["stime", "startDate", "start"]) ?? defaultStart,
            endDate: pickDateField(record, ["etime", "endDate", "end"]) ?? defaultEnd,
        });
    }

    return rows;
};

const parseUsageSummary = (payload: Record<string, unknown>, rows: UsageCount[]): UsageSummary => {
    const todayTotal =
        pickNumberField(payload, ["todayTotal", "todayCount", "today_total"]) ??
        rows.reduce((sum, row) => sum + row.todayCount, 0);

    const monthTotal =
        pickNumberField(payload, ["monthTotal", "monthCount", "month_total"]) ??
        rows.reduce((sum, row) => sum + row.count, 0);

    const successRate = formatSuccessRate(
        payload.successRate ?? payload.avgSuccessRate ?? payload.averageSuccessRate,
    );

    return { todayTotal, monthTotal, successRate };
};

export default function ApiUsageSection() {
    const accessToken = useAuthStore((state) => state.accessToken);
    const [usageList, setUsageList] = useState<UsageCount[]>([]);
    const [summary, setSummary] = useState<UsageSummary>({
        todayTotal: 0,
        monthTotal: 0,
        successRate: "—",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getUsageTotal = async () => {
            if (!accessToken) {
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const payload = await RequestUsageTotal(accessToken);
                const today = GetTodayyyymmdd();
                const defaultStart = `${today}0000`;
                const defaultEnd = `${today}2359`;
                const safePayload =
                    typeof payload === "object" && payload !== null
                        ? (payload as Record<string, unknown>)
                        : {};
                const rows = parseUsageRows(safePayload, defaultStart, defaultEnd);

                setUsageList(rows);
                setSummary(parseUsageSummary(safePayload, rows));
            } finally {
                setLoading(false);
            }
        };

        getUsageTotal();
    }, [accessToken]);

    return (
        <div className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6">
            <h2 className="text-lg font-semibold">상세 사용량</h2>
            <p className="mt-1 text-sm text-muted">서비스별 요청 횟수와 기간별 사용량을 확인할 수 있습니다.</p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-border bg-background p-4">
                    <div className="text-xs text-muted">오늘 총 요청</div>
                    <div className="mt-1 text-xl font-semibold tabular-nums">
                        {loading ? "—" : summary.todayTotal.toLocaleString()}
                    </div>
                </div>
                <div className="rounded-2xl border border-border bg-background p-4">
                    <div className="text-xs text-muted">이번달 요청</div>
                    <div className="mt-1 text-xl font-semibold tabular-nums">
                        {loading ? "—" : summary.monthTotal.toLocaleString()}
                    </div>
                </div>
                <div className="rounded-2xl border border-border bg-background p-4">
                    <div className="text-xs text-muted">평균 성공률</div>
                    <div className="mt-1 text-xl font-semibold">{loading ? "—" : summary.successRate}</div>
                </div>
            </div>

            <div className="mt-4 overflow-x-auto">
                <div className="min-w-[720px] overflow-hidden rounded-2xl border border-border bg-background">
                    <div className="grid grid-cols-[1.4fr_1.3fr_auto_auto] gap-3 border-b border-border bg-[color:var(--brand-weak)]/40 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted">
                        <div>서비스</div>
                        <div>기간</div>
                        <div className="text-right">요청 횟수</div>
                        <div className="text-right">오늘 요청</div>
                    </div>

                    {loading ? (
                        <div className="px-4 py-8 text-center text-sm text-muted">불러오는 중...</div>
                    ) : usageList.length === 0 ? (
                        <div className="px-4 py-8 text-center text-sm text-muted">
                            표시할 사용량 데이터가 없습니다.
                        </div>
                    ) : (
                        usageList.map((item, index) => (
                            <div
                                key={`${item.serviceId}-${item.startDate}-${index}`}
                                className={`grid grid-cols-[1.4fr_1.3fr_auto_auto] items-center gap-3 px-4 py-3 transition-colors hover:bg-[color:var(--brand-weak)]/20 ${
                                    index !== usageList.length - 1 ? "border-b border-border" : ""
                                }`}
                            >
                                <div className="text-sm font-medium text-foreground">{item.name}</div>
                                <div className="font-mono text-sm text-muted">
                                    {formatDateRange(item.startDate, item.endDate)}
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex min-w-[3.5rem] items-center justify-center rounded-full border border-border bg-card px-3 py-1 text-sm font-semibold tabular-nums text-foreground">
                                        {item.count.toLocaleString()}회
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="inline-flex min-w-[3.5rem] items-center justify-center rounded-full border border-border bg-[color:var(--brand-weak)]/30 px-3 py-1 text-sm font-semibold tabular-nums text-foreground">
                                        {item.todayCount.toLocaleString()}회
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
