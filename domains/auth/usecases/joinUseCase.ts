import type { JoinRequest, JoinResponse } from "@/domains/auth/api/authApi";
import { joinApi } from "@/domains/auth/api/authApi";
import { useAuthStore } from "@/domains/auth/store/authStore";

export async function joinUseCase(
  request: JoinRequest,
): Promise<JoinResponse> {
  const response = await joinApi(request);
  const accesstoken = response.accesstoken;

  if (accesstoken) {
    useAuthStore.getState().setAccessToken(String(accesstoken));
  }

  return response;
}
