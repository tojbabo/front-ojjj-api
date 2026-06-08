## 📖 프로젝트 소개

프로젝트 개요 작성

> 다양한 데이터를 API 형태로 제공하기 위한 데이터 플랫폼 프로젝트입니다.
>
> 사용자는 웹 페이지를 통해 회원 인증, API 탐색, 문서 조회 및 API 테스트를 수행할 수 있으며, 발급받은 API Key를 이용하여 서비스를 연동할 수 있습니다.
>
> API 서비스 운영에 필요한 인증, 권한 관리, 문서화 및 테스트 환경을 직접 구현하여 데이터 제공 플랫폼의 전체 흐름을 경험하는 것을 목표로 개발하였습니다.

<br>

## 🖥 화면 구성

### 메인 화면

![메인화면](./img/main.png)

간단한 설명

---

### 상세 화면

![상세화면](./img/detail.png)

간단한 설명

---

### 설정 화면

![설정화면](./img/setting.png)

간단한 설명

<br>

## 📂 파일 구조

```text
app
 ├── login
 ├── user
 ├── document
 └── page [entry]

src
 ├── auth
 │   ├── api
 │   ├── lib 
 │   ├── store
 │   └── usecases
 ├── user
 │   ├── api
 │   ├── components
 │   └── usecase
 ├── common
 ├── components
 └── types
```

구조 설명

***비즈니스 로직(src)과 UI(app) 계층 분리 설계***

**app**
* login — 로그인 및 회원가입 UI
* user — API 서비스 조회, 테스트 및 관리 UI
* documnet — API 사용 가이드 및 문서 페이지
* *page — 애플리케이션 진입점 및 라우팅 구성*


**src**
* auth — 인증 관련 비즈니스 로직
* user — API 서비스 관련 비즈니스 로직
* common — 공통 유틸리티 및 상수
* components — 재사용 가능한 UI 컴포넌트 




<br>

## 🚀 기술적 도전 및 주요 기능

### 기능 1

#### 문제

어떤 문제가 있었는지 작성

#### 해결

어떻게 해결했는지 작성

#### 결과

어떤 효과가 있었는지 작성



## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
