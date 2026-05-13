"use client";

import { useMemo, useState } from "react";
import { apiList } from "@/src/common/const_apilist";
import { prettyPrintApiField } from "@/src/common/utils";

export default function DocumentPage() {
  const [selectedApiId, setSelectedApiId] = useState<number | null>(
    apiList[0]?.id ?? null
  );

  const selectedApi = useMemo(
    () => apiList.find((api) => api.id === selectedApiId) ?? null,
    [selectedApiId]
  );

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:py-10">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8">
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">API 문서</h1>
        <p className="mt-2 text-sm text-muted md:text-base">
          API 목록에서 항목을 선택하면 해당 API의 문서와 데이터 표가 표시됩니다.
        </p>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-2xl border border-border bg-card p-4 shadow-sm">
          <h2 className="mb-3 text-sm font-semibold text-muted">API 목록</h2>
          {apiList.length === 0 ? (
            <p className="text-sm text-muted">
              `src/constants/apilist.ts`에 API 목록을 추가해 주세요.
            </p>
          ) : (
            <ul className="space-y-2">
              {apiList.map((api) => {
                const isSelected = selectedApiId === api.id;

                return (
                  <li key={api.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedApiId(api.id)}
                      className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                        isSelected
                          ? "border-[color:var(--brand)] bg-[color:var(--brand-weak)] text-foreground"
                          : "border-border bg-background text-foreground/85 hover:bg-[color:var(--brand-weak)]"
                      }`}
                    >
                      {api.title}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        <article className="rounded-2xl border border-border bg-card p-4 shadow-sm md:p-6">
          {!selectedApi ? (
            <div className="rounded-xl border border-dashed border-border bg-background p-6 text-sm text-muted">
              표시할 API가 없습니다. 먼저 API 목록을 추가해 주세요.
            </div>
          ) : (
            <>
              <h2 className="text-xl font-semibold tracking-tight">
                {selectedApi.title}
              </h2>
              <p className="mt-2 text-sm text-muted">
                선택한 API의 기본 문서 정보입니다.
              </p>

              <div className="mt-5 overflow-hidden rounded-xl border border-border">
                <table className="w-full border-collapse text-sm">
                  <tbody>
                    <tr className="border-b border-border">
                      <th className="w-44 bg-background px-4 py-3 text-left font-semibold">
                        API 제목
                      </th>
                      <td className="px-4 py-3">{selectedApi.title}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <th className="bg-background px-4 py-3 text-left font-semibold">
                        데이터 개요
                      </th>
                      <td className="px-4 py-3">{selectedApi.summary}</td>
                    </tr>
                    <tr className="border-b border-border">
                      <th className="align-top bg-background px-4 py-3 text-left font-semibold">
                        파라미터
                      </th>
                      <td className="px-4 py-3">
                        <pre className="m-0 max-h-[min(70vh,28rem)] overflow-auto rounded-lg border border-border bg-background/80 p-3 font-mono text-xs leading-relaxed text-foreground [tab-size:2]">
                          {prettyPrintApiField(selectedApi.parameters)}
                        </pre>
                      </td>
                    </tr>
                    <tr>
                      <th className="align-top bg-background px-4 py-3 text-left font-semibold">
                        데이터
                      </th>
                      <td className="px-4 py-3">
                        <pre className="m-0 max-h-[min(70vh,28rem)] overflow-auto rounded-lg border border-border bg-background/80 p-3 font-mono text-xs leading-relaxed text-foreground [tab-size:2]">
                          {prettyPrintApiField(selectedApi.data)}
                        </pre>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </>
          )}
        </article>
      </section>
    </main>
  );
}
