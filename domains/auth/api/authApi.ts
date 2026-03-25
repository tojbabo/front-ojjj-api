export type LoginRequest = {
  id: string;
  pw: string;
};

export type LoginResponse = {
  token?: string;
  accessToken?: string;
  user?: unknown;
  [key: string]: unknown;
};

const API_BASE_URL = "http://localhost:3000"
const LOGIN_PATH = "/api/auth/login";

function getErrorMessage(payload: unknown) {
  if (!payload || typeof payload !== "object") return "로그인에 실패했습니다.";
  const anyPayload = payload as Record<string, unknown>;
  const message =
    (typeof anyPayload.message === "string" && anyPayload.message) ||
    (typeof anyPayload.error === "string" && anyPayload.error);
  return message || "로그인에 실패했습니다.";
}

export async function loginApi(request: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}${LOGIN_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: request.id,
      pw: request.pw,
    }),
  });

  if (!res.ok) {
    const payload = await res
      .json()
      .catch(() => ({ status: res.status, ok: false }));
    throw new Error(getErrorMessage(payload));
  }

  return (await res.json()) as LoginResponse;
}

