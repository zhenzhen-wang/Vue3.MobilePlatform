import type { AxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosRequestHeaders } from 'axios';
import type { RequestOptions, Result, UploadFileParams, CreateAxiosOptions } from '@/types/axios';
import axios from 'axios';
// import qs from 'qs';
import { cloneDeep } from 'lodash-es';
import { ContentTypeEnum } from '@/enums/httpEnum';
import {
  beforeRequestHook,
  handleAuthError,
  handleNetworkError,
  transformRequestHook,
} from './handleHooks';

/**
 * @description:  axios module
 */
export class VAxios {
  private axiosInstance: AxiosInstance;
  private readonly options: CreateAxiosOptions;

  constructor(options: CreateAxiosOptions) {
    this.options = options;
    this.axiosInstance = axios.create(options);
    this.setupInterceptors();
  }

  /**
   * @description: Set general header
   */
  setHeader(headers: any): void {
    if (!this.axiosInstance) {
      return;
    }
    Object.assign(this.axiosInstance.defaults.headers, headers);
  }

  /**
   * @description: Interceptor configuration
   */
  private setupInterceptors() {
    // 请求拦截处理
    this.axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
      // do something before request is sent
      // eslint-disable-next-line no-constant-condition
      if (false) {
        //如果设置了token，则在请求头加入token请求api
        // let each request carry token
        // ['X-Token'] is a custom headers key
        // please modify it according to the actual situation
        (config.headers as AxiosRequestHeaders)['X-Token'] = localStorage.getItem('token') || '';
      }
      return config;
    });

    // 相应拦截处理
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse<Result>) => {
        if (response.status !== 200) return Promise.reject(response.data);
        handleAuthError(response.data.code);
        // handleGeneralError(response.data.code, response.data.message);
        return response;
      },
      (err) => {
        handleNetworkError(err.response.status);
        Promise.reject(err.response);
      },
    );
  }

  /**
   * @description:  File Upload
   */
  uploadFile<T>(config: AxiosRequestConfig, params: UploadFileParams) {
    const formData = new window.FormData();
    const customFilename = params.name || 'file';

    if (params.filename) {
      formData.append(customFilename, params.file, params.filename);
    } else {
      formData.append(customFilename, params.file);
    }

    if (params.data) {
      Object.keys(params.data).forEach((key) => {
        const value = params.data?.[key];
        if (Array.isArray(value)) {
          value.forEach((item) => {
            formData.append(`${key}[]`, item);
          });
          return;
        }

        formData.append(key, params.data?.[key]);
      });
    }

    return this.axiosInstance.request<T>({
      ...config,
      method: 'POST',
      data: formData,
      headers: {
        'Content-type': ContentTypeEnum.FORM_DATA,
        ignoreCancelToken: true,
      },
    });
  }

  // support form-data
  //   supportFormData(config: AxiosRequestConfig) {
  //     const headers = config.headers || this.options.headers;
  //     const contentType = headers?.['Content-Type'] || headers?.['content-type'];

  //     if (
  //       contentType !== ContentTypeEnum.FORM_URLENCODED ||
  //       !Reflect.has(config, 'data') ||
  //       config.method?.toUpperCase() === RequestEnum.GET
  //     ) {
  //       return config;
  //     }

  //     return {
  //       ...config,
  //       data: qs.stringify(config.data, { arrayFormat: 'brackets' }),
  //     };
  //   }

  get<T>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'GET' }, options);
  }

  post<T>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'POST' }, options);
  }

  put<T>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'PUT' }, options);
  }

  delete<T>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    return this.request({ ...config, method: 'DELETE' }, options);
  }

  request<T>(config: AxiosRequestConfig, options?: RequestOptions): Promise<T> {
    let conf: CreateAxiosOptions = cloneDeep(config);

    const { requestOptions } = this.options;

    const opt: RequestOptions = Object.assign({}, requestOptions, options);

    if (beforeRequestHook) conf = beforeRequestHook(conf, opt);

    conf.requestOptions = opt;

    return new Promise((resolve, reject) => {
      this.axiosInstance
        .request<any, AxiosResponse<Result>>(conf)
        .then((res: AxiosResponse<Result>) => {
          if (transformRequestHook) {
            try {
              const ret = transformRequestHook(res, opt);
              resolve(ret);
            } catch (err) {
              reject(err || new Error('request error!'));
            }
            return;
          }
          resolve(res as unknown as Promise<T>);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }
}
