import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router';
import type { App, Plugin } from 'vue';
import { isObject } from './is';
import lrz from 'lrz';

/**
 * @description:  Set ui mount node
 */
export function getPopupContainer(node?: HTMLElement): HTMLElement {
  return (node?.parentNode as HTMLElement) ?? document.body;
}

/**
 * Add the object as a parameter to the URL
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = '';
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}

export function getRawRoute(route: RouteLocationNormalized): RouteLocationNormalized {
  if (!route) return route;
  const { matched, ...opt } = route;
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : undefined) as RouteRecordNormalized[],
  };
}

export const withInstall = <T>(component: T, alias?: string) => {
  const comp = component as any;
  comp.install = (app: App) => {
    app.component(comp.name || comp.displayName, component);
    if (alias) {
      app.config.globalProperties[alias] = component;
    }
  };
  return component as T & Plugin;
};

// 获取当前时间的年月日字符串
export const getDate = (param: string): string => {
  const date = new Date();
  let mon: string | number = date.getMonth() + 1; //getMonth()返回的是0-11，则需要加1
  if (mon <= 9) {
    //如果小于9的话，则需要加上0
    mon = '0' + mon;
  }
  let day: string | number = date.getDate(); //getdate()返回的是1-31，则不需要加1
  if (day <= 9) {
    //如果小于9的话，则需要加上0
    day = '0' + day;
  }
  return date.getFullYear() + param + mon + param + day;
};

//先给图片添加水印再压缩,再将base64URL赋值给对应的model
export async function addWaterMark(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // 创建所需要添加水印的img图片
      const img = new Image();
      img.src = url;
      // 允许跨域操作
      img.crossOrigin = 'anonymous';
      img.onload = function () {
        // 创建canvas，并将创建的img绘制成canvas
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0);
        ctx!.textAlign = 'right';
        ctx!.textBaseline = 'top';
        ctx!.font = '40px Microsoft Yahei';
        ctx!.fillStyle = 'rgba(255, 255, 255, 0.2)';
        ctx?.rotate(-(Math.PI / 180) * 15); //逆时针旋转15度
        // 循环绘制水印
        for (let i = 0; i < img.height / 200; i++) {
          for (let j = 0; j < img.width / 100; j++) {
            ctx?.fillText('MiTAC机密文件', i * 400, j * 200, img.width);
          }
        }
        // 将绘制完成的canvas转换为base64的地址
        resolve(canvas.toDataURL()); //'image/png',0.6  有损压缩
      };
    } catch (e: any) {
      reject(e);
    }
  });
}

// 使用插件lrz，压缩图片
export async function zipFile(base64Url: string): Promise<string> {
  //width {Number} 图片最大不超过的宽度，默认为原图宽度，高度不设时会适应宽度。
  //height {Number} 同上
  //quality {Number} 图片压缩质量，取值 0 - 1，默认为0.7。所有参数可省略
  return new Promise((resolve, reject) => {
    lrz(base64Url, { quality: 0.3 })
      .then((rst: any) => resolve(rst.base64))
      .catch((err: any) => reject(err));
  });
}
