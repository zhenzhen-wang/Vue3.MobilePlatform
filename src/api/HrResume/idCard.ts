import { http } from '@/utils/http';

enum Api {
  IDCard = '/IDCard',
}

export function postIdCard(base64Img: string, side: string) {
  return http.post<string>({
    url: Api.IDCard,
    data: { base64Img, side },
  }); // 用params传参，参数会自动拼接到url，data传参是放到body中传送
}

export function checkIdCard(idCardNo: string) {
  return http.get<string>({
    url: Api.IDCard,
    params: { idCardNo },
  });
}

export const idCardApi = {
  postIdCard,
  checkIdCard,
};
