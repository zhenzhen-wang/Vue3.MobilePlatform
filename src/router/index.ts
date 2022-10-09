import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import { Notify } from 'vant';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 首页
    {
      path: '/',
      meta: { title: '昆达移动APP平台' },
      name: 'home',
      component: HomeView,
    },
    // 1.个人简历主页面
    {
      path: '/HrResumeView',
      name: 'HrResumeView',
      meta: {
        title: '昆达微服务',
      },
      component: () => import('../views/HrResume/HrResumeView.vue'),
    },
    // 个人简历主页面中各个方块的路由
    {
      path: '/DLResume',
      meta: {
        title: '昆达微服务',
      },
      component: () => import('../views/HrResume/DetailView/DLResume.vue'),
    },
    {
      path: '/IDLResume',
      meta: {
        title: '昆达微服务',
      },
      component: () => import('../views/HrResume/DetailView/IDLResume.vue'),
    },

    // 2.企业微信应用页面
    {
      path: '/WeChatWorkView',
      meta: { title: '企业微信应用' },
      component: () => import('../views/WeChatWork/WeChatWorkView.vue'),
      redirect: '/HomeList', // 默认刚打开第一个tab是HomeList
      // tab子路由,显示在WeChatWorkView.vue中路由占位符的位置
      children: [
        {
          path: '/HomeList',
          component: () => import('../views/WeChatWork/TabbarView/HomeList.vue'),
        },
        {
          path: '/MyList',
          component: () => import('../views/WeChatWork/TabbarView/MyList.vue'),
        },
      ],
    },
    // 企业微信应用页面中各个方块的路由
    {
      path: '/HrAudit',

      meta: { isAuth: true, role: 'manager', title: '企业微信应用' },
      component: () => import('../views/WeChatWork/DetailView/HrAudit.vue'),
    },
    {
      path: '/HrResultConfirm',
      meta: { isAuth: true, role: 'manager', title: '企业微信应用' },
      component: () => import('../views/WeChatWork/DetailView/HrResultConfirm.vue'),
    },
    {
      path: '/MasterInterview',
      meta: { isAuth: true, role: 'manager', title: '企业微信应用' },
      component: () => import('../views/WeChatWork/DetailView/MasterInterview.vue'),
    },
    {
      path: '/ManagerInterview',
      meta: { isAuth: true, role: 'manager', title: '企业微信应用' },
      component: () => import('../views/WeChatWork/DetailView/ManagerInterview.vue'),
    },
    {
      path: '/Wait',
      meta: { title: '企业微信应用' },
      component: () => import('../views/WeChatWork/DetailView/Wait.vue'),
    },
  ],
});

// 挂载路由导航守卫
router.beforeEach((to) => {
  // to代表将要访问的路径
  // from代表从哪个路径调整而来

  // 待访问的页面需要权限认证，且登陆者权限不等于页面要求时，弹出错误提示框
  if (to.meta.isAuth && to.meta.role !== 'manager') {
    // console.log(to.fullPath);
    Notify({ type: 'danger', message: '您没有访问此页面的权限' });
    return '/WeChatWorkView';
  }

  const menuTitle = to.meta.title as string;
  /* 路由meta的title不为空，则将index的title设置为此 */
  if (menuTitle) {
    document.title = menuTitle;
  }
  return true; //代表放行此路由请求
});

export default router;
