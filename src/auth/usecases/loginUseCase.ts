import { RequestLogin } from "@/src/auth/api/authApi";
import { useAuthStore } from "@/src/auth/store/authStore";

// 유즈케이스: 로그인 요청을 수행하고, 필요한 비즈니스 흐름을 담당합니다.
export async function loginUseCase(
  request: {id:string, pw:string},
): Promise<number> {
  const response = await RequestLogin(request);
  const accessToken =
    response.accessToken ??
    (response as { accessToken?: string }).accessToken ??
    response.token;

  if (accessToken) {
    useAuthStore.getState().setAccessToken(String(accessToken));
    return 1;
}

  return 0;
}

