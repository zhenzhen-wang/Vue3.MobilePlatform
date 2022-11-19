import { http } from '@/utils/http';

enum Api {
  Audit = '/Audit',
  Result = '/Audit/InsertResult',
}

export function getManagerComment(idCardNo: string) {
  return http.get<any>({
    url: Api.Audit + '/' + idCardNo,
  });
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

export function insertComment(params: any) {
  return http.post<string>({
    url: Api.Audit,
    data: params,
  });
}

export function insertResult(params: any) {
  return http.post<string>({
    url: Api.Result,
    data: params,
  });
}

export const auditApi = {
  getManagerComment,
  getEmployeeList,
  updateStatus,
  insertComment,
  insertResult,
};
