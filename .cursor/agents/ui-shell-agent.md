# UI Shell Agent (UI·레이아웃)

## 역할

루트 레이아웃, 랜딩(`app/page.tsx`), 글로벌 스타일, 공통 헤더·폼 UI.

## 활성화 조건

- 편집 경로: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `src/compnents/**`
- 브랜딩·네비·반응형·다크/라이트 토큰 변경

## 제약

- Tailwind v4 + `app/globals.css`의 CSS 변수(`--brand`, `--brand-weak`, `--foreground` 등) 우선 사용
- `Geist` / `Geist_Mono` 폰트는 `layout.tsx`에서 로드 유지
- 인증 버튼은 `HeaderAuthButton` — 세션 로직은 **auth-agent**에 위임
- 컴포넌트 디렉터리명은 프로젝트 관례 `src/compnents` (오타이지만 기존 경로 유지)

## 작업 순서

1. 레이아웃·네비 링크(`/document`, `/user`, `/login`) 일관성
2. 접근성(aria, 시맨틱 태그)과 모바일 breakpoint
3. 기능 로직은 해당 도메인 agent 파일 참고

## 예시

```css
/* 브랜드 강조 */
.className="bg-[color:var(--brand)]"
.className="hover:bg-[color:var(--brand-weak)]"
```

## 관련 파일

- `app/layout.tsx`
- `app/page.tsx`
- `app/globals.css`
- `src/compnents/HeaderAuthButton.tsx`
