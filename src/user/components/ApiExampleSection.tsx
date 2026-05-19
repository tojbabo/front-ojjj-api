"use client";

import { apiList, ApiDocument } from "@/src/common/const_apilist";
import {
  getLoginCredentialsFromStore,
  useAuthHydrated,
  useAuthStore,
} from "@/src/auth/store/authStore";
import { useEffect, useMemo, useState } from "react";
import { RequestUsage, RequestWindowProcs } from "../api/userApi";
import { GetKeysFromDictString, GetTodayyyymmdd, UnknownToNumber } from "@/src/common/utils";

const parseResponseRows = (value: unknown): Record<string, unknown>[] => {
  if (Array.isArray(value)) {
    return value
      .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
      .slice(0, 20);
  }

  if (typeof value === "object" && value !== null) {
    const asRecord = value as Record<string, unknown>;
    if (Array.isArray(asRecord.data)) {
      return asRecord.data
        .filter((item): item is Record<string, unknown> => typeof item === "object" && item !== null)
        .slice(0, 20);
    }
    return [asRecord];
  }

  return [{ value }];
};

const pickTimeValue = (value: Record<string, unknown>): string | null => {
  const timeKeys = ["time", "timestamp", "datetime", "date", "dt", "logtime", "collect_time", "stime"];
  for (const key of timeKeys) {
    const raw = value[key];
    if (typeof raw === "string" && raw.trim()) return raw.trim();
    if (typeof raw === "number" && Number.isFinite(raw)) return String(raw);
  }
  return null;
};

const formatTimeLabel = (value: string): string => {
  const digits = value.replace(/\D/g, "");
  if (digits.length >= 12) {
    const hh = digits.slice(8, 10);
    const mm = digits.slice(10, 12);
    return `${hh}:${mm}`;
  }
  if (digits.length >= 4) {
    const hh = digits.slice(0, 2);
    const mm = digits.slice(2, 4);
    return `${hh}:${mm}`;
  }
  return value;
};

const formatMetricTwoDecimals = (value: number): string =>
  Number.isFinite(value) ? value.toFixed(2) : "-";

const extractProcessLineSeries = (
  rows: Record<string, unknown>[],
  metric: UsageMetric,
): { times: string[]; series: ProcessLineSeries[] } => {
  const allTimes = new Set<string>();
  const processMap = new Map<string, Map<string, number>>();

  rows.forEach((row, rowIdx) => {
    const processName =
      (typeof row.pname === "string" && row.pname) ||
      (typeof row.process === "string" && row.process) ||
      `process-${rowIdx + 1}`;
    const data = Array.isArray(row.data) ? row.data : [];
    if (data.length === 0) return;

    const valueByTime = processMap.get(processName) ?? new Map<string, number>();
    data.forEach((item) => {
      if (!item || typeof item !== "object") return;
      const point = item as Record<string, unknown>;
      const timeKey = pickTimeValue(point);
      if (!timeKey) return;
      allTimes.add(timeKey);
      const metricValue = UnknownToNumber(point[metric]);
      valueByTime.set(timeKey, Number.isFinite(metricValue) ? metricValue : 0);
    });
    processMap.set(processName, valueByTime);
  });

  const times = Array.from(allTimes).sort((a, b) => a.localeCompare(b));
  const series = Array.from(processMap.entries()).map(([label, valueByTime]) => ({
    label,
    values: times.map((time) => valueByTime.get(time) ?? 0),
  }));

  return { times, series };
};

const toUsagePoint = (value: unknown, fallbackId: string): UsagePoint | null => {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const cpu = UnknownToNumber(row.cpu);
  const mem = UnknownToNumber(row.mem);
  const time = UnknownToNumber(row.time);
  if ([cpu, mem, time].some((item) => Number.isNaN(item))) return null;

  const rawLabel = row.process ?? row.pname ?? fallbackId;
  const label = typeof rawLabel === "string" ? rawLabel : String(rawLabel);

  return { label, cpu, mem, time };
};

type BarGraphEntry = {
  key: string;
  rank: number;
  label: string;
  value: number;
};

/** 막대 그래프: pname이 같으면 지표 값 합산, 값 큰 순 정렬, rank는 1이 최대값 */
const buildBarGraphEntries = (
  rows: Record<string, unknown>[],
  metric: UsageMetric,
): BarGraphEntry[] => {
  const sums = new Map<string, { displayLabel: string; value: number }>();

  const add = (sortKey: string, displayLabel: string, v: number) => {
    if (!Number.isFinite(v)) return;
    const cur = sums.get(sortKey);
    if (cur) {
      cur.value += v;
    } else {
      sums.set(sortKey, { displayLabel, value: v });
    }
  };

  rows.forEach((row, rowIdx) => {
    const rowPname =
      typeof row.pname === "string" && row.pname.trim().length > 0 ? row.pname.trim() : null;
    const nestedData = Array.isArray(row.data) ? row.data : null;

    if (nestedData && nestedData.length > 0) {
      nestedData.forEach((item, itemIdx) => {
        if (!item || typeof item !== "object") return;
        const pt = item as Record<string, unknown>;
        const v = UnknownToNumber(pt[metric]);
        if (!Number.isFinite(v)) return;

        const processLabel =
          typeof pt.process === "string" && pt.process.trim().length > 0
            ? pt.process.trim()
            : `item-${itemIdx}`;

        if (rowPname) {
          add(rowPname, rowPname, v);
        } else {
          add(`${rowIdx}:${processLabel}`, processLabel, v);
        }
      });
    } else {
      const point = toUsagePoint(row, `row-${rowIdx}`);
      if (!point) return;
      const v = point[metric];
      if (!Number.isFinite(v)) return;
      if (rowPname) {
        add(rowPname, rowPname, v);
      } else {
        add(`${rowIdx}:${point.label}`, point.label, v);
      }
    }
  });

  const sorted = Array.from(sums.entries())
    .map(([sortKey, { displayLabel, value }]) => ({
      key: `bar-${sortKey}`,
      rank: 0,
      label: displayLabel,
      value,
    }))
    .sort((a, b) => b.value - a.value);

  sorted.forEach((entry, idx) => {
    entry.rank = idx + 1;
  });

  return sorted;
};

const FormatToyyyymmdd = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, "").slice(0, 12);
  return digitsOnly;
};


type LoginCredentials = {
  id?: string;
  pw?: string;
};

const getDefaultParameterValuesForApi = (
  api?: ApiDocument,
  savedTokenByApiId?: Record<number, string>,
  credentials?: LoginCredentials,
): ParamMap => {
  const keys = GetKeysFromDictString(api?.parameters ?? "");
  const rawSaved = api != null ? savedTokenByApiId?.[api.id] : undefined;
  const savedToken = typeof rawSaved === "string" && rawSaved.trim() ? rawSaved.trim() : "";

  if (api?.title === "use-amount" || api?.id === 0) {
    const today = GetTodayyyymmdd();
    return {
      id: credentials?.id?.trim() ?? "",
      pw: credentials?.pw ?? "",
      serviceid: "1",
      stime: `${today}0000`,
      etime: `${today}2359`,
      size: "100",
    };
  }

  if (api?.title === "windows-usage") {
    const today = GetTodayyyymmdd();
    const base: ParamMap = {
      stime: `${today}0000`,
      etime: `${today}2359`,
      size: "100",
    };
    if (keys.includes("token")) {
      base.token = savedToken;
    }
    return base;
  }

  if (keys.includes("token")) {
    return { token: savedToken };
  }

  return {};
};

type ApiExampleSectionProps = {
  tokenByApiId: Record<number, string>;
};

export default function ApiExampleSection({ tokenByApiId }: ApiExampleSectionProps) {
  const authHydrated = useAuthHydrated();
  const loginId = useAuthStore((state) => state.loginId);
  const loginPw = useAuthStore((state) => state.loginPw);
  const loginCredentials = useMemo<LoginCredentials>(
    () => getLoginCredentialsFromStore(),
    [loginId, loginPw],
  );

  const [selectedApiId, setSelectedApiId] = useState<number>(apiList[0]?.id ?? 0);
  const [requestState, setRequestState] = useState<RequestState>("idle");
  const [resultTab, setResultTab] = useState<ResultTab>("graph");
  const [graphType, setGraphType] = useState<GraphType>("bar");
  const [usageMetric, setUsageMetric] = useState<UsageMetric>("cpu");
  const [responseRows, setResponseRows] = useState<Record<string, unknown>[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const selectedApi = useMemo<ApiDocument | undefined>(
    () => apiList.find((item) => item.id === selectedApiId),
    [selectedApiId],
  );

  const parameterKeys = useMemo(
    () => GetKeysFromDictString(selectedApi?.parameters ?? ""),
    [selectedApi?.parameters],
  );

  const [parameterValues, setParameterValues] = useState<ParamMap>(() =>
    getDefaultParameterValuesForApi(apiList[0], tokenByApiId, getLoginCredentialsFromStore()),
  );

  const isWindowsUsageApi = selectedApi?.title === "windows-usage";
  const isUseAmountApi = selectedApi?.title === "use-amount" || selectedApi?.id === 0;

  const isDatetimeField = (key: string) =>
    (isWindowsUsageApi || isUseAmountApi) && (key === "stime" || key === "etime");

  const handleSelectApi = (nextApiId: number) => {
    const nextApi = apiList.find((item) => item.id === nextApiId);
    setSelectedApiId(nextApiId);
    setParameterValues(
      getDefaultParameterValuesForApi(nextApi, tokenByApiId, getLoginCredentialsFromStore()),
    );
    setResponseRows([]);
    setRequestState("idle");
    setErrorMessage("");
  };

  useEffect(() => {
    if (!authHydrated || !isUseAmountApi) return;
    setParameterValues(
      getDefaultParameterValuesForApi(selectedApi, tokenByApiId, getLoginCredentialsFromStore()),
    );
  }, [authHydrated, isUseAmountApi, selectedApiId, loginId, loginPw, selectedApi]);

  useEffect(() => {
    if (!parameterKeys.includes("token")) return;
    const saved = tokenByApiId[selectedApiId]?.trim() ?? "";
    if (!saved) return;
    setParameterValues((prev) => {
      const current = prev.token ?? "";
      if (current.trim() !== "") return prev;
      return { ...prev, token: saved };
    });
  }, [tokenByApiId, selectedApiId, parameterKeys]);

  const handleChangeParameter = (key: string, value: string) => {
    if (isDatetimeField(key)) {
      const formatted = FormatToyyyymmdd(value);
      setParameterValues((prev) => ({ ...prev, [key]: formatted }));
      return;
    }
    setParameterValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleBlurParameter = (key: string) => {
    if (!isDatetimeField(key)) return;
    setParameterValues((prev) => {
      const current = prev[key] ?? "";
      const today = GetTodayyyymmdd();
      const defaultValue = key === "stime" ? `${today}0000` : `${today}2359`;
      const nextValue = FormatToyyyymmdd(current);
      if (nextValue.length !== 12) return { ...prev, [key]: defaultValue };
      if (current === nextValue) return prev;
      return { ...prev, [key]: nextValue };
    });
  };

  const requestPayload = useMemo(() => {
    return parameterKeys.reduce<Record<string, string>>((acc, key) => {
      acc[key] = parameterValues[key] ?? "";
      return acc;
    }, {});
  }, [parameterKeys, parameterValues]);

  const handleRequest = async () => {
    if (!selectedApi) return;
    setRequestState("loading");
    setErrorMessage("");
    try {
      if (isUseAmountApi) {
        const payload = await RequestUsage(requestPayload);
        console.log(payload);
        setResponseRows([]);
        setRequestState("success");
        return;
      }

      const payload = await RequestWindowProcs(requestPayload);
      const rows = parseResponseRows(payload);

      setResponseRows(rows);
      setRequestState("success");
      setResultTab("graph");
    } catch (error) {
      setResponseRows([]);
      setRequestState("error");
      setErrorMessage(error instanceof Error ? error.message : "요청 중 오류가 발생했습니다.");
    }
  };

  const selectedMetricLabel = usageMetric === "cpu" ? "CPU" : usageMetric === "mem" ? "MEM" : "Time";
  const barGraphEntries = useMemo(
    () => buildBarGraphEntries(responseRows, usageMetric),
    [responseRows, usageMetric],
  );
  const maxBarGraphValue = barGraphEntries.length
    ? Math.max(...barGraphEntries.map((entry) => entry.value), 1)
    : 1;
  const processLineData = useMemo(
    () => extractProcessLineSeries(responseRows, usageMetric),
    [responseRows, usageMetric],
  );
  const processLineMax = processLineData.series.length
    ? Math.max(...processLineData.series.flatMap((item) => item.values), 1)
    : 1;
  const linePalette = [
    "#2563eb",
    "#dc2626",
    "#16a34a",
    "#9333ea",
    "#ea580c",
    "#0891b2",
    "#ca8a04",
    "#be123c",
    "#0d9488",
    "#4f46e5",
  ];

  const paramInputClassName =
    "h-10 w-full rounded-lg border border-border bg-card px-3 outline-none focus:border-[color:var(--brand)]";

  const isPasswordField = (key: string) => key === "pw";

  const renderParamField = (key: string) => (
    <label key={key} className="flex flex-col gap-1 text-sm">
      <span className="text-xs text-muted">{key}</span>
      <input
        type={isPasswordField(key) ? "password" : "text"}
        value={parameterValues[key] ?? ""}
        onChange={(e) => handleChangeParameter(key, e.target.value)}
        onBlur={() => handleBlurParameter(key)}
        className={paramInputClassName}
        placeholder={isDatetimeField(key) ? "YYYYMMDDhhmm" : `${key} 값을 입력하세요`}
        autoComplete={key === "id" ? "username" : isPasswordField(key) ? "current-password" : "off"}
        style={{ maxWidth: "20rem" }}
      />
    </label>
  );

  const windowsUsageLayoutKeys = new Set(["token", "stime", "etime", "size"]);
  const windowsUsageExtraKeys = isWindowsUsageApi
    ? parameterKeys.filter((k) => !windowsUsageLayoutKeys.has(k))
    : [];

  return (
    <div className="rounded-3xl border border-border bg-card p-5 shadow-sm md:p-6">
      <h2 className="text-lg font-semibold">API 예시 테스트</h2>
      <p className="mt-1 text-sm text-muted">
        API를 선택하고 파라미터를 입력해 요청한 뒤, 응답 데이터를 그래프 또는 리스트로 확인하세요.
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="rounded-2xl border border-border bg-background p-3">
          <div className="mb-2 text-sm font-semibold">테스트 API 리스트</div>
          <div className="space-y-2">
            {apiList.map((api) => {
              const active = api.id === selectedApiId;
              return (
                <button
                  key={api.id}
                  type="button"
                  onClick={() => handleSelectApi(api.id)}
                  className={
                    active
                      ? "w-full rounded-xl border border-[color:var(--brand)] bg-[color:var(--brand-weak)] p-3 text-left"
                      : "w-full rounded-xl border border-border bg-card p-3 text-left hover:bg-[color:var(--brand-weak)]"
                  }
                >
                  <div className="text-sm font-semibold">{api.title}</div>
                  <div className="mt-1 text-xs text-muted">{api.summary}</div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-background p-4">
          <div className="text-sm font-semibold">요청 파라미터</div>
          <div className="mt-1 text-xs text-muted">
            선택 API: <span className="font-mono">{selectedApi?.title ?? "-"}</span>
          </div>

          <div className="mt-4">
            {parameterKeys.length === 0 ? (
              <div className="rounded-lg border border-border px-3 py-2 text-sm text-muted">
                설정할 파라미터가 없습니다.
              </div>
            ) : isWindowsUsageApi ? (
              <div className="flex flex-col gap-4">
                {parameterKeys.includes("token") ? renderParamField("token") : null}
                <div className="grid gap-3 sm:grid-cols-2">
                  {parameterKeys.includes("stime") ? renderParamField("stime") : null}
                  {parameterKeys.includes("etime") ? renderParamField("etime") : null}
                </div>
                {parameterKeys.includes("size") ? renderParamField("size") : null}
                {windowsUsageExtraKeys.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-2">{windowsUsageExtraKeys.map(renderParamField)}</div>
                ) : null}
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">{parameterKeys.map(renderParamField)}</div>
            )}
          </div>

          <button
            type="button"
            onClick={handleRequest}
            disabled={requestState === "loading" || !selectedApi}
            className="mt-4 inline-flex h-10 items-center justify-center rounded-full bg-[color:var(--brand)] px-4 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {requestState === "loading" ? "요청 중..." : "요청 보내기"}
          </button>

          {requestState === "error" ? (
            <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              {errorMessage}
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-background p-4">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-semibold">응답 데이터</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setResultTab("graph")}
              className={
                resultTab === "graph"
                  ? "rounded-full bg-[color:var(--brand)] px-3 py-1 text-xs font-semibold text-white"
                  : "rounded-full border border-border px-3 py-1 text-xs"
              }
            >
              그래프
            </button>
            <button
              type="button"
              onClick={() => setResultTab("list")}
              className={
                resultTab === "list"
                  ? "rounded-full bg-[color:var(--brand)] px-3 py-1 text-xs font-semibold text-white"
                  : "rounded-full border border-border px-3 py-1 text-xs"
              }
            >
              리스트
            </button>
          </div>
        </div>

        {requestState === "idle" ? (
          <div className="mt-4 text-sm text-muted">요청을 보내면 응답 데이터가 표시됩니다.</div>
        ) : null}

        {requestState === "success" && resultTab === "graph" ? (
          <div className="mt-4 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setGraphType("bar")}
                className={
                  graphType === "bar"
                    ? "rounded-full bg-[color:var(--brand)] px-3 py-1 text-xs font-semibold text-white"
                    : "rounded-full border border-border px-3 py-1 text-xs"
                }
              >
                막대 그래프
              </button>
              <button
                type="button"
                onClick={() => setGraphType("line")}
                className={
                  graphType === "line"
                    ? "rounded-full bg-[color:var(--brand)] px-3 py-1 text-xs font-semibold text-white"
                    : "rounded-full border border-border px-3 py-1 text-xs"
                }
              >
                라인 그래프
              </button>
              <div className="ml-auto flex items-center gap-2 text-xs">
                <span className="text-muted">지표</span>
                <select
                  value={usageMetric}
                  onChange={(e) => setUsageMetric(e.target.value as UsageMetric)}
                  className="h-8 rounded-lg border border-border bg-card px-2"
                >
                  <option value="cpu">CPU</option>
                  <option value="mem">Memory</option>
                  <option value="time">Time</option>
                </select>
              </div>
            </div>
            {graphType === "line" ? (
              <div className="rounded-xl border border-border p-3">
                <div className="mb-2 text-xs text-muted">
                  시간(X) - {selectedMetricLabel}(Y) 프로세스별 라인 그래프
                </div>
                {processLineData.times.length === 0 || processLineData.series.length === 0 ? (
                  <div className="text-sm text-muted">시간 데이터가 없어 라인 그래프를 표시할 수 없습니다.</div>
                ) : (
                  <>
                    <svg viewBox="0 0 100 100" className="h-56 w-full">
                      {processLineData.series.map((series, seriesIdx) => {
                        const points = series.values
                          .map((value, idx) => {
                            const x =
                              processLineData.times.length === 1
                                ? 0
                                : (idx / (processLineData.times.length - 1)) * 100;
                            const y = 100 - (value / processLineMax) * 100;
                            return `${x},${Math.max(0, y)}`;
                          })
                          .join(" ");
                        const color = linePalette[seriesIdx % linePalette.length];
                        return (
                          <g key={`series-${series.label}`}>
                            <polyline fill="none" stroke={color} strokeWidth="1.8" points={points} />
                            {series.values.map((value, idx) => {
                              const cx =
                                processLineData.times.length === 1
                                  ? 0
                                  : (idx / (processLineData.times.length - 1)) * 100;
                              const cy = 100 - (value / processLineMax) * 100;
                              return (
                                <circle
                                  key={`dot-${series.label}-${idx}`}
                                  cx={cx}
                                  cy={Math.max(0, cy)}
                                  r="1"
                                  fill={color}
                                />
                              );
                            })}
                          </g>
                        );
                      })}
                    </svg>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
                      <span>{formatTimeLabel(processLineData.times[0])}</span>
                      <span>
                        {formatTimeLabel(
                          processLineData.times[Math.floor((processLineData.times.length - 1) / 2)],
                        )}
                      </span>
                      <span>{formatTimeLabel(processLineData.times[processLineData.times.length - 1])}</span>
                    </div>
                  </>
                )}
                <div className="mt-3 grid grid-cols-2 gap-2 text-xs sm:grid-cols-3">
                  {processLineData.series.map((series, idx) => (
                    <div key={`legend-${series.label}`} className="rounded-lg border border-border px-2 py-1">
                      <div className="truncate text-muted">{series.label}</div>
                      <div className="font-mono" style={{ color: linePalette[idx % linePalette.length] }}>
                        {selectedMetricLabel}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : barGraphEntries.length === 0 ? (
              <div className="text-sm text-muted">막대 그래프로 표시할 숫자 데이터가 없습니다.</div>
            ) : (
              barGraphEntries.map((entry) => (
                <div key={entry.key}>
                  <div className="mb-1 flex items-center justify-between gap-2 text-xs">
                    <span className="min-w-0 font-medium">
                      <span className="mr-1.5 tabular-nums text-muted">{entry.rank}.</span>
                      {entry.label}
                    </span>
                    <span className="shrink-0 font-mono">{formatMetricTwoDecimals(entry.value)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-border/50">
                    <div
                      className="h-2 rounded-full bg-[color:var(--brand)]"
                      style={{ width: `${Math.max((entry.value / maxBarGraphValue) * 100, 4)}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        ) : null}

        {requestState === "success" && resultTab === "list" ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left text-muted">
                  <th className="py-2 font-medium">#</th>
                  <th className="py-2 font-medium">데이터</th>
                </tr>
              </thead>
              <tbody>
                {responseRows.map((row, idx) => (
                  <tr key={`row-${idx}`} className="border-b border-border/70 align-top">
                    <td className="py-3">{idx + 1}</td>
                    <td className="py-3">
                      <pre className="max-w-[860px] overflow-x-auto rounded-lg border border-border bg-card p-2 text-xs">
                        {JSON.stringify(row, null, 2)}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
