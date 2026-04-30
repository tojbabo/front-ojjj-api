export type ApiDocument = {
  id: string;
  title: string;
  summary: string;
  parameters: string;
  data: string;
};

export const apiList: ApiDocument[] = [
  {
    id: "sample-api",
    title: "windows-usage",
    summary: "주인장의 윈도우 프로그램 점유율을 확인하세요",
    parameters: "{start-time: HHMMSS, end-time: HHMMSS}",
    data: "[proc_name: string, proc_ram:int]",
  },
];
