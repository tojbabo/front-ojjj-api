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
    title: "use-amount",
    summary: "API 서비스 사용 내역, 용량",
    parameters: "{id:string, pw:string, serviceid:number, stime:YYYYMMDDhhmm, etime: YYYYMMDDhhmm, size:number}",
    data: "[]",
  },
  {
    id: 1,
    title: "windows-usage",
    summary: "주인장의 윈도우 주요 프로그램 사용 시간",
    parameters: "{token:string, stime: YYYYMMDDhhmm, etime: YYYYMMDDhhmm, size: number}",
    data: "{pname: string, data:[{process:string, mem:float, time:number, id:string, cpu:float}]}",
  }
];
