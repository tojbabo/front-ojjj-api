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

const indentUnit = "  ";

function prettyPrintLooseBraces(input: string): string {
    let i = 0;
    const len = input.length;
    let out = "";
    let depth = 0;

    const skipWs = () => {
        while (i < len && /\s/.test(input[i]!)) i += 1;
    };

    const currentIndent = () => indentUnit.repeat(depth);

    while (i < len) {
        const c = input[i]!;
        if (/\s/.test(c)) {
            i += 1;
            continue;
        }
        if (c === "{") {
            i += 1;
            skipWs();
            if (input[i] === "}") {
                i += 1;
                out += "{}";
                continue;
            }
            out += "{\n";
            depth += 1;
            out += currentIndent();
            continue;
        }
        if (c === "}") {
            depth = Math.max(0, depth - 1);
            out += `\n${currentIndent()}}`;
            i += 1;
            continue;
        }
        if (c === "[") {
            i += 1;
            skipWs();
            if (input[i] === "]") {
                i += 1;
                out += "[]";
                continue;
            }
            out += "[\n";
            depth += 1;
            out += currentIndent();
            continue;
        }
        if (c === "]") {
            depth = Math.max(0, depth - 1);
            out += `\n${currentIndent()}]`;
            i += 1;
            continue;
        }
        if (c === ",") {
            i += 1;
            out += `,\n${currentIndent()}`;
            skipWs();
            continue;
        }
        out += c;
        i += 1;
    }
    return out;
}

/** API 문서용: JSON이면 2-space 포맷, 아니면 `{`/`[` 기준으로 개행·들여쓰기 */
export const prettyPrintApiField = (value: string): string => {
    const trimmed = value.trim();
    if (!trimmed) return "";
    try {
        return JSON.stringify(JSON.parse(trimmed), null, 2);
    } catch {
        return prettyPrintLooseBraces(trimmed);
    }
};