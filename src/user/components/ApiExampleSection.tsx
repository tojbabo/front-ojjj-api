"use client";

import { apiList, ApiDocument } from "@/src/constants/apilist";
import { useMemo, useState } from "react";

type ResultTab = "graph" | "list";
type RequestState = "idle" | "loading" | "success" | "error";
type ParamMap = Record<string, string>;

const API_BASE_URL = "http://localhost:3000";

const parseParameterKeys = (parameterText: string): string[] => {
  const trimmed = parameterText.trim();
  if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return [];
  const inside = trimmed.slice(1, -1).trim();
  if (!inside) return [];

  return inside
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean)
    .map((segment) => segment.split(":")[0]?.trim())
    .filter((key): key is string => Boolean(key));
};

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

const getNumericEntries = (row: Record<string, unknown>): Array<{ key: string; value: number }> => {
  return Object.entries(row)
    .map(([key, value]) => ({
      key,
      value: typeof value === "number" ? value : Number(value),
    }))
    .filter((entry) => !Number.isNaN(entry.value));
};

export default function ApiExampleSection() {
  const [selectedApiId, setSelectedApiId] = useState<number>(apiList[0]?.id ?? 0);
  const [requestState, setRequestState] = useState<RequestState>("idle");
  const [resultTab, setResultTab] = useState<ResultTab>("graph");
  const [responseRows, setResponseRows] = useState<Record<string, unknown>[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const selectedApi = useMemo<ApiDocument | undefined>(
    () => apiList.find((item) => item.id === selectedApiId),
    [selectedApiId],
  );

  const parameterKeys = useMemo(
    () => parseParameterKeys(selectedApi?.parameters ?? ""),
    [selectedApi?.parameters],
  );

  const [parameterValues, setParameterValues] = useState<ParamMap>({});

  const handleSelectApi = (nextApiId: number) => {
    setSelectedApiId(nextApiId);
    setParameterValues({});
    setResponseRows([]);
    setRequestState("idle");
    setErrorMessage("");
  };

  const handleChangeParameter = (key: string, value: string) => {
    setParameterValues((prev) => ({ ...prev, [key]: value }));
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
      const endpoint = `${API_BASE_URL}/api/document/${selectedApi.title}`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message =
          (typeof payload?.message === "string" && payload.message) || "요청 처리에 실패했습니다.";
        throw new Error(message);
      }

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

  const graphSource = responseRows[0];
  const graphEntries = graphSource ? getNumericEntries(graphSource).slice(0, 8) : [];
  const maxGraphValue = graphEntries.length ? Math.max(...graphEntries.map((entry) => entry.value), 1) : 1;

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
                    className="h-10 rounded-lg border border-border bg-card px-3 outline-none focus:border-[color:var(--brand)]"
                    placeholder={`${key} 값을 입력하세요`}
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
            {graphEntries.length === 0 ? (
              <div className="text-sm text-muted">그래프로 표시할 숫자 데이터가 없습니다.</div>
            ) : (
              graphEntries.map((entry) => (
                <div key={entry.key}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium">{entry.key}</span>
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
