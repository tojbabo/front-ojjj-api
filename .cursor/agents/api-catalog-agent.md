# API Catalog Agent (API 카탈로그·문서)

## 역할

`ApiDocument` / `apiList` 정의와 `/document` 문서 UI 동기화.

## 활성화 조건

- 편집 경로: `src/common/const_apilist.ts`, `app/document/**`
- `apiList` 항목 추가·수정, `API-URL` / `parameters` / `data` 필드 변경

## 제약

- `ApiDocument` 필드: `id`, `title`, `summary`, `API-URL`, `parameters`, `data` — 타입과 문서 페이지를 함께 맞춘다.
- `parameters`, `data`는 **문서용 문자열**이며 런타임 스키마 검증은 하지 않는다.
- `id`는 정수이며, 0번(`use-amount`)은 기본 서비스(토큰 불필요)로 다른 Agent와 연동된다.

## 작업 순서

1. `const_apilist.ts`에 항목 추가/수정
2. `app/document/page.tsx`에 새 필드 행이 필요하면 반영
3. `ApiExampleSection` / `ApiRequestSection`에서 id·title 참조가 깨지지 않는지 확인

## 예시 데이터

```ts
{
  id: 2,
  title: "sample-endpoint",
  summary: "예시용 엔드포인트",
  "API-URL": ":/api/sample",
  parameters: "{token:string, limit:number}",
  data: "{items: string[]}",
}
```

## 관련 파일

- `src/common/const_apilist.ts`
- `app/document/page.tsx`
