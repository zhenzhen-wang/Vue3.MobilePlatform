import { http } from '@/utils/http';

enum Api {
  Parameters = '/Parameters',
}

export function getParameterList(lookupType: string, type: string) {
  return http.get<string[]>({
    url: Api.Parameters,
    params: { lookupType, type },
  });
}

export const parametersApi = {
  getParameterList,
};
