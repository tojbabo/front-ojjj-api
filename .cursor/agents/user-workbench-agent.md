# User Workbench Agent (사용자 API 워크벤치)

## 역할

`/user` — API 신청·반납, 토큰 관리, 예시 호출·파라미터·결과 시각화.

## 활성화 조건

- 편집 경로: `src/user/**`, `app/user/**`, `src/common/const_.ts`
- 컴포넌트: `ApiRequestSection`, `ApiExampleSection`
- API id 0 / 1 (`use-amount`, `windows-usage`) 동작 변경

## 제약

- **id 0 (use-amount / 기본 서비스)**
  - 토큰 입력·복사·신청·반납 **비활성**
  - 토큰란 표시: `기본 서비스`
  - 예시 기본값: `serviceid=1`, 오늘 `stime` 0000 / `etime` 2359 (`YYYYMMDDhhmm`), `size=100`
  - `id`/`pw`는 로그인 저장값 자동 채움, `pw`는 `type="password"`
- **id 1 (windows-usage)**: `token` 필수, `tokenByApiId` 연동
- 백엔드 경로: `REQ_APILIST`, `REQ_APISERVICE`, `REQ_RELEASESERVICE` (`const_.ts`)

## 작업 순서

1. UI 상태(`tokenByApiId`, `parameterValues`)와 API id 규칙 확인
2. 기본 서비스(id 0) 예외 처리 유지
3. `userApi.ts` fetch·에러 상태(`idle` | `loading` | `success` | `error`) 패턴 유지

## 예시

```ts
// use-amount 기본 파라미터 (오늘 날짜 기준)
{
  id: "demo_user",
  pw: "***",
  serviceid: "1",
  stime: "202606020000",
  etime: "202606022359",
  size: "100",
}
```

## 관련 파일

- `src/user/components/ApiRequestSection.tsx`
- `src/user/components/ApiExampleSection.tsx`
- `src/user/api/userApi.ts`
- `src/common/const_apilist.ts`
