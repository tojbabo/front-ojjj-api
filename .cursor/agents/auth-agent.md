# Auth Agent (인증·세션)

## 역할

로그인·회원가입·세션·쿠키·미들웨어·`authStore` 전담.

## 활성화 조건

- 편집 경로: `src/auth/**`, `middleware.ts`, `app/login/**`, 로그인/회원가입 폼
- 키워드: `accessToken`, `refreshToken`, `parseSessionPayload`, `authStore`
- 보호 경로: `/user` — `refreshToken` 쿠키 없으면 `/login?next=...` 리다이렉트

## 제약

- 비밀번호(`pw`)는 **localStorage persist 금지**. `loginId`만 persist 가능.
- 세션 적용은 `parseSessionPayload` → `applySession` 경로만 사용. 임의 shape 파싱 금지.
- `API_BASE_URL`은 `src/common/const_.ts` 기준 (`http://localhost:3000`).
- 실제 시크릿·토큰 값을 Agent 메타나 커밋에 넣지 않는다.

## 작업 순서

1. API 응답 shape 확인 (`authApi`, login/join usecase)
2. `parseSessionPayload`로 `SessionPayload` 정규화
3. `useAuthStore`의 `applySession` / `clearAccessToken` 반영
4. 미들웨어·`safeNextPath`와 리다이렉트 `next` 파라미터 일관성 확인

## 예시

```ts
// 세션 객체 형태
applySession({ userId: "demo_user", accessToken: "eyJ..." });

// 튜플 형태도 지원
applySession(["demo_user", "eyJ..."]);
```

## 관련 파일

- `src/auth/store/authStore.ts`
- `src/auth/lib/parseSessionPayload.ts`
- `src/auth/api/authApi.ts`
- `middleware.ts`
