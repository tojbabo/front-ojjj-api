type ResultTab = "graph" | "list";
type RequestState = "idle" | "loading" | "success" | "error";
type ParamMap = Record<string, string>;
type GraphType = "bar" | "line";
type UsageMetric = "cpu" | "mem" | "time";

type RequestApiItem = {
    id: number;
    name: string;
    description: string;
    tokenKey: string | undefined;
};

type ApiTokenItem = {
    api?: number | string;
    token?: string;
};

type ProcessLineSeries = {
    label: string;
    values: number[];
  };
type UsagePoint = {
    label: string;
    cpu: number;
    mem: number;
    time: number;
};
