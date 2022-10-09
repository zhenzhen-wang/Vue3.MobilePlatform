import { http } from '@/utils/http';

enum Api {
  Employer = '/Employer',
}

export function queryDetail(idCardNo: string, status: string) {
  return http.get<any>({
    url: Api.Employer,
    params: { idCardNo, status },
  });
}

export function saveIdlData(formData: string) {
  return http.post<string>({
    url: Api.Employer,
    data: { formData },
  });
}
export const idlResumeApi = {
  queryDetail,
  saveIdlData,
};
