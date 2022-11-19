// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
// The axios configuration can be changed according to the project, just change the file, other files can be left unchanged

import { VAxios } from './Axios';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { deepMerge } from '@/utils';
import type { CreateAxiosOptions } from '@/types/axios';

function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        // See https://developer.mozilla.org/en-US/docs/Web/HTTP/Authentication#authentication_schemes
        // authentication schemes，e.g: Bearer
        // authenticationScheme: 'Bearer',
        authenticationScheme: '',
        timeout: 200 * 1000,
        // 基础接口地址
        // baseURL: import.meta.env.VITE_GLOB_API_URL,

        headers: { 'Content-Type': ContentTypeEnum.JSON },
        // 如果是form-data格式
        // headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },//如果是此格式，需要用qs.stringfy对数据进行序列化
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 是否返回原生响应头 比如：需要获取响应头时使用该属性
          isReturnNativeResponse: false,
          // 需要对返回数据进行处理
          isTransformResponse: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'message',
          // 接口地址
          apiUrl: import.meta.env.VITE_GLOB_API_URL,
          // 接口拼接地址
          urlPrefix: import.meta.env.VITE_GLOB_API_URL_PREFIX,
          //  是否加入时间戳
          joinTime: true,
          // 忽略重复请求
          ignoreCancelToken: true,
          // 是否携带token
          withToken: false,
        },
      },
      opt || {},
    ),
  );
}

export const http = createAxios();

// 微信,暂时未使用，如果使用需要修改transformRequestHook方法
// transformRequestHook目前处理的数据是跟necoreapi返回的数据格式想对应的
// 兼容微信的返回数据格式，需要调整transformRequestHook方法
export const wechatHttp = createAxios({
  requestOptions: {
    apiUrl: import.meta.env.VITE_GLOB_WECHAT_URL,
  },
});
