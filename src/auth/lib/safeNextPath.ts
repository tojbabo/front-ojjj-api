const DEFAULT_AFTER_LOGIN = "/user";

/**
 * 로그인 후 이동할 경로. 오픈 리다이렉트 방지를 위해 상대 경로만 허용합니다.
 */
export function safeNextPath(raw: string | null): string {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) {
    return DEFAULT_AFTER_LOGIN;
  }
  return raw;
}
