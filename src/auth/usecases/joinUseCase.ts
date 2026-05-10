import type { JoinRequest, JoinResponse } from "@/src/auth/api/authApi";
import { RequestJoin } from "@/src/auth/api/authApi";
import { useAuthStore } from "@/src/auth/store/authStore";

export async function joinUseCase(
  request: JoinRequest,
): Promise<JoinResponse> {
  const response = await RequestJoin(request);
  const accessToken = response.accessToken;

  if (accessToken) {
    useAuthStore.getState().setAccessToken(String(accessToken));
  }

  return response;
}
