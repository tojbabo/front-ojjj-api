import {
  API_BASE_URL,
  REQ_APILIST,
  REQ_APISERVICE,
  REQ_RELEASESERVICE,
} from "@/src/common/const_";

/**
 * 서버 응답의 tokens 배열을 api id → token 문자열 맵으로 변환합니다.
 */
export function buildTokenByApiIdFromList(tokenlist: unknown): Record<number, string> {
  if (!Array.isArray(tokenlist)) return {};
  const out: Record<number, string> = {};
  for (const tokenItem of tokenlist) {
    if (!tokenItem || typeof tokenItem !== "object") continue;
    const item = tokenItem as Record<string, unknown>;
    const apiRaw = item.api;
    const token = item.token;
    const apiId =
      typeof apiRaw === "number"
        ? apiRaw
        : typeof apiRaw === "string"
          ? Number(apiRaw)
          : NaN;
    if (!Number.isNaN(apiId) && typeof token === "string") {
      out[apiId] = token;
    }
  }
  return out;
}

/**
 * 서버에 사용중인 API Service token list 일괄 요청
 * @param accessToken 
 * @returns api service token lise
 */
export async function RequestAPIServiceTokenList(accessToken:string): Promise<any[]> {
  const res = await fetch(`${API_BASE_URL}${REQ_APILIST}`, {
    method: "POST",
    credentials: "include",
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    }
  });

  const payload = await res.json().catch(()=>({status: res.status, ok:false}));
  return payload.tokens
}

/**
 * API Service 신청, 새로 발급받은 token을 발급받음 
 * @param accessToken 
 * @param serviceid 
 * @returns 
 */
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

/**
 * 특정 API Service를 release함
 * @param accessToken 
 * @param serviceid 
 * @returns 
 */
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

/**
 * api: windowsprocs 요청.
 * @param params 
 * @returns 
 */
export async function RequestWindowProcs(params:Record<string,string>): Promise<any>{
  const endpoint = `${API_BASE_URL}/api/winprocs`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        const message = (typeof payload?.message === "string" && payload.message) || "요청 처리에 실패했습니다.";
        throw new Error(message);
      }
      return payload;
}
