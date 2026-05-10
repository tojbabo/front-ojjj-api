export const GetKeysFromDictString = (parameterText: string): string[] => {
    const trimmed = parameterText.trim();
    if (!trimmed.startsWith("{") || !trimmed.endsWith("}")) return [];

    const inside = trimmed.slice(1, -1).trim();
    if (!inside) return [];

    return inside
        .split(",")
        .map((segment) => segment.trim())
        .filter(Boolean)
        .map((segment) => segment.split(":")[0]?.trim())
        .filter((key): key is string => Boolean(key));
};

export const UnknownToNumber = (value: unknown): number => {
    if (typeof value === "number") return value;
    if (typeof value === "string") {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : NaN;
    }
    return NaN;
};

export const GetTodayyyymmdd = (): string => {
    const now = new Date();
    const year = String(now.getFullYear());
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}${month}${day}`;
};