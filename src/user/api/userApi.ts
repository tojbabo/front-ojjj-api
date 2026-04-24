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
const PATH_CHECK_TOKEN = "/api/auth/refresh";
const REQ_APILIST = "/api/user/apilist";
const REQ_APISERVICE = "/api/user/addapi";
const REQ_RELEASESERVICE = "/api/user/releaseapi";

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

export type JoinRequest = {
  id: string;
  pw: string;
};

export type JoinResponse = {
  message?: string;
  accessToken?: string;
  longtoken?: string;
  [key: string]: unknown;
};

export async function joinApi(request: JoinRequest): Promise<JoinResponse> {
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

export async function logoutApi(): Promise<void> {
  await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    credentials: "include",
  }).catch(() => undefined);
}

export async function hasRefreshSessionApi(): Promise<any> {
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

export async function RequestAPIListGet(accessToken:string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}${REQ_APILIST}`, {
    method: "GET",
    credentials: "include",
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    }
  });


  const payload = await res.json().catch(()=>({status: res.status, ok:false}));
  console.log(payload);


  return null
}

export async function RequestAPIList(accessToken:string): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}${REQ_APILIST}`, {
    method: "POST",
    credentials: "include",
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    }
  });


  const payload = await res.json().catch(()=>({status: res.status, ok:false}));
  return [payload.list, payload.tokens]
}

export async function RequestAPIService(accessToken:string, serviceid: number): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}${REQ_APISERVICE}`, {
    method: "POST",
    credentials: "include",
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      serviceid: serviceid
    })
  });

  const payload = await res.json().catch(()=>({status: res.status, ok:false}));
  return payload
}

export async function RequestReleaseToken(accessToken:string, serviceid: number): Promise<boolean> {
  const res = await fetch(`${API_BASE_URL}${REQ_RELEASESERVICE}`, {
    method: "POST",
    credentials: "include",
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      serviceid: serviceid
    })
  });

  return true;
}
