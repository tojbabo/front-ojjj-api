import type { JoinRequest, JoinResponse } from "@/domains/auth/api/authApi";
import { joinApi } from "@/domains/auth/api/authApi";

export async function joinUseCase(
  request: JoinRequest,
): Promise<JoinResponse> {
  return joinApi(request);
}
