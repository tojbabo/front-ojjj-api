import type { LoginRequest, LoginResponse } from "@/domains/auth/api/authApi";
import { loginApi } from "@/domains/auth/api/authApi";
import { useAuthStore } from "@/domains/auth/store/authStore";

// 유즈케이스: 로그인 요청을 수행하고, 필요한 비즈니스 흐름을 담당합니다.
export async function loginUseCase(
  request: LoginRequest,
): Promise<number> {
  const response = await loginApi(request);
  const accessToken =
    response.accessToken ??
    (response as { accesstoken?: string }).accesstoken ??
    response.token;

  if (accessToken) {
    useAuthStore.getState().setAccessToken(String(accessToken));
    return 1;
}

  return 0;
}

