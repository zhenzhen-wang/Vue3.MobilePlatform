/**
 * Global authority directive
 * Used for fine-grained control of component permissions
 * @Example v-auth="RoleEnum.TEST"
 */
import type { RoleEnum } from '@/enums/roleEnum';
import { isArray } from '@/utils/is';
import { intersection } from 'lodash-es';
import type { App, Directive, DirectiveBinding } from 'vue';

/**
 * Determine whether there is permission
 */
function hasPermission(value?: RoleEnum | RoleEnum[] | string | string[], def = true): boolean {
  console.log(value);

  // v-auth后面不跟角色，默认可以看见
  if (!value) {
    return def;
  }

  // 获取登录者的权限codelist
  const allCodeList = ['super']; //permissionStore.getPermCodeList as string[];
  if (!isArray(value)) {
    // 如果value不是数组，则判断value在不在其权限范围内
    return allCodeList.includes(value);
  }
  return (intersection(value, allCodeList) as string[]).length > 0; //如果是array则通过lodash的方法判断
}

function isAuth(el: Element, binding: any) {
  const value = binding.value;
  if (!value) return;
  if (!hasPermission(value)) {
    el.parentNode?.removeChild(el);
  }
}

const mounted = (el: Element, binding: DirectiveBinding<any>) => {
  isAuth(el, binding);
};

const authDirective: Directive = {
  mounted,
};

export function setupPermissionDirective(app: App) {
  app.directive('auth', authDirective);
}

export default authDirective;
