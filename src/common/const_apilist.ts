export type ApiDocument = {
  id: number;
  title: string;
  summary: string;
  "API-URL":string;
  parameters: string;
  data: string;
};

export const apiList: ApiDocument[] = [
  {
    id: 0,
    title: "use-amount",
    summary: "API 서비스 사용 내역, 용량",
    "API-URL": ":/api/usage",
    parameters: '{id:string, pw:string, serviceid:number, stime:"YYYYMMDDhhmm", etime: "YYYYMMDDhhmm", size:number}',
    data: "[{serviceId:number, count:number}]",
  },
  {
    id: 1,
    title: "windows-usage",
    summary: "주인장의 윈도우 주요 프로그램 사용 시간",
    "API-URL": ":/api/winprocs",
    parameters: '{token:string, stime: "YYYYMMDDhhmm", etime: "YYYYMMDDhhmm", size: number}',
    data: '{pname: string, data:[{process:string, mem:float, time:"YYYYMMDDhhmm", id:string, cpu:float}]}',
  }
];
