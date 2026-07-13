import {
  API_BASE_URL,
  JOIN_PATH,
  LOGIN_PATH,
  PATH_CHECK_TOKEN,
} from "@/src/common/const_";

export type LoginResponse = {
  token?: string;
  accessToken?: string;
  user?: unknown;
  [key: string]: unknown;
};

export type JoinResponse = {
  message?: string;
  accessToken?: string;
  longtoken?: string;
  [key: string]: unknown;
};


function getErrorMessage(payload: unknown, fallback: string) {
  if (!payload || typeof payload !== "object") return fallback;
  const anyPayload = payload as Record<string, unknown>;
  const message =
    (typeof anyPayload.message === "string" && anyPayload.message) ||
    (typeof anyPayload.error === "string" && anyPayload.error);
  return message || fallback;
}

/**
 * id, pw를 통한 로그인 요청
 * @param request 
 * @returns 
 */
export async function RequestLogin(request: {id:string, pw:string}): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}${LOGIN_PATH}`, {
    method: "POST",
    credentials: "include",
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

/**
 * 새 id, pw를 통한 회원가입 요청
 * @param request 
 * @returns 
 */
export async function RequestJoin(request: {id:string, pw:string}): Promise<JoinResponse> {
  const res = await fetch(`${API_BASE_URL}${JOIN_PATH}`, {
    method: "POST",
    credentials: "include",
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

/**
 * 로그아웃 요청
 */
export async function RequestLogout(): Promise<void> {
  await fetch(`${API_BASE_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  }).catch(() => undefined);
}

/**
 * Session 확인 후 RefreshToken을 확인. 유효한 경우 [userId, accessToken] 또는 동일 필드 객체 반환
 */
export async function CheckSessionGetAccessToken(): Promise<null | Record<string,any>> {
  const res = await fetch(`${API_BASE_URL}${PATH_CHECK_TOKEN}`, {
    method: "POST",
    credentials: "include",
  }).catch(() => null);

  if(!res?.ok){
    return null;
  }
  else{
    const payload = await res.json().catch(()=>({status: res.status, ok:false}));
    return payload;
  }
}
