import { wechatHttp, http } from '@/utils/http';
import axios from 'axios';

enum Api {
  AccessToken = '/Wechat',
  UserInfo = '/auth/getuserinfo',
}

export function getAccessToken() {
  return http.get<string>({
    url: Api.AccessToken,
  });
}

// 未使用已封装的http方法，用原生的axios请求企业微信服务器api
export function getUserInfo(access_token: string, code: string): Promise<any> {
  return new Promise((resolve, reject) => {
    // 基本url:/wechat,此步需要在nginx设置转发来解决跨域
    axios.defaults.baseURL = import.meta.env.VITE_GLOB_WECHAT_URL;
    axios
      .get(Api.UserInfo, {
        params: { access_token, code },
      })
      .then(function (data) {
        resolve(data); //成功
      })
      .catch(function (err) {
        reject(err); // 失败
      });
  });

  // TODO:需要调整transformRequestHook方法才可以使用如下api
  // return wechatHttp.get<any>({
  //   url: Api.UserInfo,
  //   params: { access_token, code },
  // });
}
export const wechatApi = {
  getAccessToken,
  getUserInfo,
};
