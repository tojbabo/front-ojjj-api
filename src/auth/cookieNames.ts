/**
 * 로그인 시 백엔드가 Set-Cookie로 내려줘야 하는 이름과 맞춥니다.
 * 미들웨어는 localStorage/Zustand를 볼 수 없으므로, 보호 라우트 판별은 이 쿠키로만 합니다.
 *
 * 백엔드 권장: refreshToken은 HttpOnly + Path=/ + SameSite=Lax(프로덕션은 Secure).
 * 프론트와 API 호스트가 다르면 쿠키 Domain/SameSite/CORS(credentials)까지 맞춰야
 * 브라우저가 Next 앱 요청에 쿠키를 붙입니다.
 */
