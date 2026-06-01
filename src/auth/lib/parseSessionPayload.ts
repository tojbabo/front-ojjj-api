export type SessionPayload = {
  userId: string;
  accessToken: string;
};

export function parseSessionPayload(payload: unknown): SessionPayload | null {
  if (payload == null) return null;

  if (Array.isArray(payload) && payload.length >= 2) {
    const userId = String(payload[0] ?? "").trim();
    const accessToken = String(payload[1] ?? "").trim();
    if (!accessToken) return null;
    return { userId, accessToken };
  }

  if (typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const accessToken =
      (typeof record.accessToken === "string" && record.accessToken) ||
      (typeof record.token === "string" && record.token) ||
      "";
    if (!accessToken) return null;

    const userId =
      (typeof record.userId === "string" && record.userId.trim()) ||
      (typeof record.userid === "string" && record.userid.trim()) ||
      "";

    return { userId, accessToken };
  }

  return null;
}
