import { ResultEnum } from '@/enums/httpEnum';
import type { RequestOptions, Result } from '@/types/axios';
import type { AxiosResponse } from 'axios';
import { Dialog, Notify, Toast } from 'vant';

/**
 * @description: 处理网络错误
 */
export const handleNetworkError = (errStatus: number) => {
  let errMessage = '未知错误';
  if (errStatus) {
    switch (errStatus) {
      case 400:
        errMessage = '错误的请求';
        break;
      case 401:
        errMessage = '未授权，请重新登录';
        break;
      case 403:
        errMessage = '拒绝访问';
        break;
      case 404:
        errMessage = '请求错误,未找到该资源';
        break;
      case 405:
        errMessage = '请求方法未允许';
        break;
      case 408:
        errMessage = '请求超时';
        break;
      case 500:
        errMessage = '服务器端出错';
        break;
      case 501:
        errMessage = '网络未实现';
        break;
      case 502:
        errMessage = '网络错误';
        break;
      case 503:
        errMessage = '服务不可用';
        break;
      case 504:
        errMessage = '网络超时';
        break;
      case 505:
        errMessage = 'http版本不支持该请求';
        break;
      default:
        errMessage = `其他连接错误 --${errStatus}`;
    }
  } else {
    errMessage = `无法连接到服务器！`;
  }

  Notify(errMessage);
};

/**
 * @description: 处理认证错误
 */
export const handleAuthError = (errno: number) => {
  const authErrMap: any = {
    '10031': '登录失效，需要重新登录', // token 失效
    '10032': '您太久没登录，请重新登录~', // token 过期
    '10033': '账户未绑定角色，请联系管理员绑定角色',
    '10034': '该用户未注册，请联系管理员注册用户',
    '10035': 'code 无法获取对应第三方平台用户',
    '10036': '该账户未关联员工，请联系管理员做关联',
    '10037': '账号已无效',
    '10038': '账号未找到',
  };

  // eslint-disable-next-line no-prototype-builtins
  if (authErrMap.hasOwnProperty(errno)) {
    Toast(authErrMap[errno]);
    // 授权错误，登出账户
    //logout();
    return false;
  }

  return true;
};

/**
 * @description: 处理请求回来的数据。如果数据不是预期格式，可直接抛出错误
 */
export const transformRequestHook = (res: AxiosResponse<Result>, options: RequestOptions) => {
  const { data } = res;

  // 后端api返回值为空
  if (!data) {
    throw new Error('[HTTP] Request has no return value');
  }

  // return data;
  //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
  const { code, result, message } = data;

  // 这里逻辑可以根据项目进行修改
  const hasSuccess = data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS;
  if (hasSuccess) {
    return result;
  }

  // 在此处根据自己项目的实际情况对不同的code执行不同的操作
  // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
  let timeoutMsg = '';
  switch (code) {
    case ResultEnum.TIMEOUT:
      timeoutMsg = '请求超时';
      // const userStore = useUserStoreWithOut();
      // userStore.setToken(undefined);
      // userStore.logout(true);
      break;
    default:
      if (message) {
        timeoutMsg = message;
      }
  }

  // errorMessageMode='modal'的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
  // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示
  if (options.errorMessageMode === 'modal') {
    Dialog.alert({
      message: timeoutMsg,
      theme: 'round-button',
    }).then(() => {
      // on close
    });
  } else if (options.errorMessageMode === 'message') {
    Notify(timeoutMsg);
  }

  throw new Error(timeoutMsg || '');
};
