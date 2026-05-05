export type ApiDocument = {
  id: number;
  title: string;
  summary: string;
  parameters: string;
  data: string;
};

export const apiList: ApiDocument[] = [
  {
    id: 0,
    title: "windows-usage",
    summary: "주인장의 윈도우 주요 프로그램 사용 시간",
    parameters: "{stime: YYYYMMDDhhmm, etime: YYYYMMDDhhmm, size: number}",
    data: "[proc_name: string, proc_ram:string]",
  },
  {
    id: 1,
    title: "templist",
    summary: "temp api data",
    parameters: "{}",
    data: "[]",
  },
];
