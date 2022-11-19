import type { App } from 'vue';
// https://vuejs.org/guide/reusability/custom-directives.html#custom-directives

// 如果要通过app.use方式全局注册，必须通过install函数来实现
const registerDirective = {
  // https://vuejs.org/guide/reusability/plugins.html#introduction
  install(app: App<HTMLElement>) {
    app.directive('focus', {
      // https://vuejs.org/guide/reusability/custom-directives.html#directive-hooks
      mounted(el) {
        el.focus();
      },
    });
    // 注册颜色指令
    app.directive('color', (el, binding) => {
      // this will be called for both `mounted` and `updated`
      el.style.color = binding.value;
    });
  },
};

export default registerDirective;
