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

const API_BASE_URL = "http://localhost:3000";
const LOGIN_PATH = "/api/auth/login";
const JOIN_PATH = "/api/auth/join";

function getErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") return fallback;
  const anyPayload = payload as Record<string, unknown>;
  const message =
    (typeof anyPayload.message === "string" && anyPayload.message) ||
    (typeof anyPayload.error === "string" && anyPayload.error);
  return message || fallback;
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
    throw new Error(getErrorMessage(payload, "로그인에 실패했습니다."));
  }

  return (await res.json()) as LoginResponse;
}

export type JoinRequest = {
  id: string;
  pw: string;
};

export type JoinResponse = {
  message?: string;
  shorttoken?: string;
  longtoken?: string;
  [key: string]: unknown;
};

export async function joinApi(request: JoinRequest): Promise<JoinResponse> {
  const res = await fetch(`${API_BASE_URL}${JOIN_PATH}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: request.id,
      pw: request.pw,
    }),
  });

  const payload = (await res
    .json()
    .catch(() => ({ status: res.status, ok: false }))) as JoinResponse;

  if (!res.ok) {
    throw new Error(getErrorMessage(payload, "회원가입에 실패했습니다."));
  }

  return payload;
}
