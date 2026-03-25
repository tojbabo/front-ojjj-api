import type { LoginRequest, LoginResponse } from "@/domains/auth/api/authApi";
import { loginApi } from "@/domains/auth/api/authApi";

// 유즈케이스: 로그인 요청을 수행하고, 필요한 비즈니스 흐름을 담당합니다.
export async function loginUseCase(
  request: LoginRequest,
): Promise<LoginResponse> {
  // 여기서 입력 검증/정규화가 필요하면 추가하세요.
  return loginApi(request);
}

