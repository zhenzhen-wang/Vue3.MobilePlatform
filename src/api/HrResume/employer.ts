import { http } from '@/utils/http';

enum Api {
  Employer = '/Employer',
  SendSms = '/SendSms',
}
export function getBlackInfo(idCardNo: string) {
  return http.get<any>({
    url: Api.Employer + '/' + idCardNo,
  });
}

export function getDetailByIdStatus(idCardNo: string, status: string) {
  return http.get<any>({
    url: Api.Employer,
    params: { idCardNo, status },
  });
}

export function insertHrResume(formData: string) {
  return http.post<string>({
    url: Api.Employer,
    data: { formData },
  });
}

export function sendSms(phone: string) {
  return http.get<string>({
    url: Api.SendSms,
    params: { phone },
  });
}

export const employerApi = {
  getBlackInfo,
  getDetailByIdStatus,
  insertHrResume,
  sendSms,
};
