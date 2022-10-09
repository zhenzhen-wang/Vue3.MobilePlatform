import { http } from '@/utils/http';

enum Api {
  Audit = '/Audit',
  UpdateComment = '/Audit/UpdateComment',
  UpdateResult = '/Audit/UpdateResult',
}

export function getEmployeeList(search: object) {
  return http.get<any>({
    url: Api.Audit,
    params: search,
  });
}

export function updateStatus(updateParams: any) {
  return http.put<string>({
    url: Api.Audit,
    data: updateParams,
  });
}
export const auditApi = {
  getEmployeeList,
  updateStatus,
};
