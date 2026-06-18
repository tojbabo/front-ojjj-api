# API Catalog Agent (API 카탈로그·문서)

## 역할
`app/`과 `src/**/*.tsx`의 UI 디자인 설계 구현
UI 디자인 새로 설계 및 구현

## 활성화 조건
- 편집 경로: `*.tsx*`
- UI 디자인 설계 및 기능 구현

## 제약
- UI Event 구현 시 이벤트 호출 부분만 구현, 내부 로직 부분은 구현하지 않음

## 작업 순서

1. `const_apilist.ts`에 항목 추가/수정
2. `app/document/page.tsx`에 새 필드 행이 필요하면 반영
3. `ApiExampleSection` / `ApiRequestSection`에서 id·title 참조가 깨지지 않는지 확인

## 예시 데이터

## 관련 파일

- `src/`
- `app/**/*.tsx`
