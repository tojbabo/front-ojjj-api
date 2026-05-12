"use client";

import { apiList, ApiDocument } from "@/src/common/const_apilist";
import { useMemo, useState } from "react";
import { RequestWindowProcs } from "../api/userApi";
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

const extractUsagePoints = (rows: Record<string, unknown>[]): UsagePoint[] => {
  const direct = rows
    .map((row, idx) => toUsagePoint(row, `row-${idx}`))
    .filter((item): item is UsagePoint => Boolean(item));
  if (direct.length > 0) return direct.slice(0, 12);

  const nested: UsagePoint[] = [];
  rows.forEach((row, rowIdx) => {
    const nestedData = row.data;
    if (!Array.isArray(nestedData)) return;
    nestedData.forEach((item, nestedIdx) => {
      
      const point = toUsagePoint(item, `row-${rowIdx}-${nestedIdx}`);
      if (!point) return;
      const pname = typeof row.pname === "string" ? row.pname : "";
      if (pname) {
        point.label = `${pname}:${point.label}`;
      }
      nested.push(point);
    });
  });
  return nested.slice(0, 12);
};

const FormatToyyyymmdd = (value: string): string => {
  const digitsOnly = value.replace(/\D/g, "").slice(0, 12);
  return digitsOnly;
};


const getDefaultParameterValuesForApi = (api?: ApiDocument): ParamMap => {
  if (api?.title !== "windows-usage") return {};
  const today = GetTodayyyymmdd();
  return {
    stime: `${today}0000`,
    etime: `${today}2359`,
    size: '100'
  };
};

export default function ApiExampleSection() {
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
    getDefaultParameterValuesForApi(apiList[0]),
  );

  const isWindowsUsageApi = selectedApi?.title === "windows-usage";

  const isDatetimeField = (key: string) => isWindowsUsageApi && (key === "stime" || key === "etime");

  const handleSelectApi = (nextApiId: number) => {
    const nextApi = apiList.find((item) => item.id === nextApiId);
    setSelectedApiId(nextApiId);
    setParameterValues(getDefaultParameterValuesForApi(nextApi));
    setResponseRows([]);
    setRequestState("idle");
    setErrorMessage("");
  };

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
      const payload = await RequestWindowProcs(requestPayload);
      console.log(payload);
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

  const usagePoints = useMemo(() => extractUsagePoints(responseRows), [responseRows]);
  const selectedMetricLabel = usageMetric === "cpu" ? "CPU" : usageMetric === "mem" ? "MEM" : "Time";
  const graphEntries = useMemo(
    () =>
      usagePoints.map((point, idx) => ({
        key: `point-${idx}`,
        label: point.label,
        value: point[usageMetric],
      })),
    [usagePoints, usageMetric],
  );
  const maxGraphValue = graphEntries.length
    ? Math.max(...graphEntries.map((entry) => entry.value), 1)
    : 1;
  const linePoints = graphEntries
    .map((entry, idx) => {
      const x = graphEntries.length === 1 ? 0 : (idx / (graphEntries.length - 1)) * 100;
      const y = 100 - (entry.value / maxGraphValue) * 100;
      return `${x},${Math.max(0, y)}`;
    })
    .join(" ");
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

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {parameterKeys.length === 0 ? (
              <div className="rounded-lg border border-border px-3 py-2 text-sm text-muted">
                설정할 파라미터가 없습니다.
              </div>
            ) : (
              parameterKeys.map((key) => (
                <label key={key} className="flex flex-col gap-1 text-sm">
                  <span className="text-xs text-muted">{key}</span>
                  <input
                    value={parameterValues[key] ?? ""}
                    onChange={(e) => handleChangeParameter(key, e.target.value)}
                    onBlur={() => handleBlurParameter(key)}
                    className="h-10 rounded-lg border border-border bg-card px-3 outline-none focus:border-[color:var(--brand)]"
                    placeholder={isDatetimeField(key) ? "YYYYMMDDhhmm" : `${key} 값을 입력하세요`}
                  />
                </label>
              ))
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
            {graphEntries.length === 0 ? (
              <div className="text-sm text-muted">그래프로 표시할 숫자 데이터가 없습니다.</div>
            ) : graphType === "line" ? (
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
            ) : (
              graphEntries.map((entry) => (
                <div key={entry.key}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium">{entry.label}</span>
                    <span className="font-mono">{entry.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-border/50">
                    <div
                      className="h-2 rounded-full bg-[color:var(--brand)]"
                      style={{ width: `${Math.max((entry.value / maxGraphValue) * 100, 4)}%` }}
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
