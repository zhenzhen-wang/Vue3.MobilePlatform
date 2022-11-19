import { createRouter, createWebHistory } from 'vue-router';
import { useParamStore } from '@/stores/parameters';
import HomeView from '@/views/HomeView.vue';
// import { Notify } from 'vant';

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

    // 2.电子简历审核页面
    {
      path: '/WeChatWorkView',
      meta: { title: '电子简历审核' },
      component: () => import('../views/WeChatWork/WeChatWorkView.vue'),
      redirect: '/HomeList', // 默认刚打开第一个tab是HomeList
      // redirect: (to) => {return '/HomeList';},
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
    // 电子简历审核页面中各个方块的路由
    {
      path: '/HrAudit',

      meta: { isAuth: true, role: 'manager', title: '电子简历审核' },
      component: () => import('../views/WeChatWork/DetailView/HrAudit.vue'),
    },
    {
      path: '/HrResultConfirm',
      meta: { isAuth: true, role: 'manager', title: '电子简历审核' },
      component: () => import('../views/WeChatWork/DetailView/HrResultConfirm.vue'),
    },
    {
      path: '/MasterInterview',
      meta: { isAuth: true, role: 'manager', title: '电子简历审核' },
      component: () => import('../views/WeChatWork/DetailView/MasterInterview.vue'),
    },
    {
      path: '/ManagerInterview',
      meta: { isAuth: true, role: 'manager', title: '电子简历审核' },
      component: () => import('../views/WeChatWork/DetailView/ManagerInterview.vue'),
    },
    {
      path: '/Wait',
      meta: { title: '电子简历审核' },
      component: () => import('../views/WeChatWork/DetailView/Wait.vue'),
    },
  ],
});

// 挂载路由导航守卫
router.beforeEach((to) => {
  // to代表将要访问的路径
  // from代表从哪个路径调整而来

  // TODO:待访问的页面需要权限认证，且登陆者权限不等于页面要求时，弹出错误提示框
  // const role = 'manager'; // 获取人员角色或者职务
  // // 也可以根据tag判断，判断userid是否在此tag标签内来控制权限:isInTag(usrId,tagName):boolen
  // const tagName = '电子简历';
  // if (to.meta.isAuth && role !== to.meta.role) {
  //   Notify({ type: 'danger', message: '您没有访问此页面的权限' });
  //   return '/WeChatWorkView';
  // }

  // 根据路由meta中的title设置页面显示的标题
  const menuTitle = to.meta.title as string;
  /* 路由meta的title不为空，则将index的title设置为此 */
  if (menuTitle) {
    document.title = menuTitle;
  }

  const paramStore = useParamStore();
  // 一打开电子简历审核首页即构造网页授权链接，跳转到/WeChatWorkView
  // 参数中无code才需要跳转到构造链接获取code,且userId不为空
  // 生产环境
  if (import.meta.env.PROD && to.path == '/HomeList' && !to.query.code && !paramStore.userId) {
    // 当前企业的 corp_id
    const corp_id = 'wx4a4723d207da25fe';

    // 重定向 URL，地址必须是在企业微信应用中配置的可信安全域名,window.location.href + 'HomeList'
    const redirect_uri = encodeURI('http://wechat-resume.mitac-mkl.com.cn:86/HomeList');

    // 授权链接 URL
    const new_url = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${corp_id}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_base&state=STATE#wechat_redirect`;
    // 定向到构造的新网址，然后会自动跳转到redirect_uri，并且query中带着code
    window.location.href = new_url;
  }

  return true; //代表放行此路由请求
});

export default router;
