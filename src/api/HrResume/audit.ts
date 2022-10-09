import { http } from '@/utils/http';

enum Api {
  Audit = '/Audit',
}

export function getEmployeeList(search: object) {
  return http.get<any>({
    url: Api.Audit,
    params: search,
  });
}

export function saveIdlData(formData: string) {
  return http.post<string>({
    url: Api.Audit,
    data: { formData },
  });
}
export const auditApi = {
  getEmployeeList,
  saveIdlData,
};
