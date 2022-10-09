import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { registerGlobVant } from './plugins';
import App from './App.vue';
import router from './router';
import { registerGlobDirectives } from './directives';
import registerDirective from './directives/registerDirective';

const app = createApp(App);

//全局注册vant组件
registerGlobVant(app);

// 方式一：Register global directive
registerGlobDirectives(app);
// 方式二：注册全局指令
app.use(registerDirective);

/* 
app.use: 全局注册指令或者组件,必须有install函数。写了install函数后，此组件或指令可供其他项目灵活重用
app.directive('focus',{}): 直接注册全局指令
app.component('button',component): 直接注册自定义组件 
*/

app.use(createPinia());
app.use(router);

app.mount('#app');
