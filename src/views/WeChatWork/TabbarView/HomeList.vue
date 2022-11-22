<script setup lang="ts">
import BaseGrid from '@/components/Utils/BaseGrid.vue';
import { api } from '@/api';
import { useParamStore } from '@/stores/parameters';
import { Notify } from 'vant';
import { onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';

// 请求微信接口，获取个人信息userid写入paramStore中
onBeforeMount(async () => {
  try {
    // code用于获取登录者的userid
    const route = useRoute();
    const { code } = route.query;
    const paramStore = useParamStore();

    //如果获取到code且userid不为空，继续获取userid
    if (code && !paramStore.userId) {
      // 向公司后端api发起请求企微的accesstoken
      const token = await api.getAccessToken();

      // 通过accesstoken和code，通过前端程式直接向微信接口发起请求
      const res = await api.getUserInfo(token, code as string);
      // 将userid写入参数store中，便于全局调用
      paramStore.setUserId(res.data.userid);
    }
  } catch (err: any) {
    Notify({ type: 'danger', message: err.toString() });
  }
});

defineProps({ title: String });
const list = [
  {
    id: 1,
    icon: 'contact',
    text: 'HR资料审核',
    to: '/HrAudit',
  },
  {
    id: 2,
    icon: 'friends',
    text: '主管面试',
    to: '/ManagerInterview',
  },
  {
    id: 3,
    icon: 'completed',
    text: 'HR录用确认(IDL)',
    to: '/HrResultConfirm',
  },
  {
    id: 4,
    icon: 'manager',
    text: '中心主管面试',
    to: '/MasterInterview',
  },
  {
    id: 5,
    icon: 'weapp-nav',
    text: '待开发',
    to: '/Wait',
  },
];
</script>

<template>
  <!-- 标题:企业微信应用,路由占位符中传过来的 -->
  <!-- <van-nav-bar :title="title"></van-nav-bar> -->
  <!-- 宫格显示项目 -->
  <base-grid :gridList="list" :count="3" />
</template>

<style lang="scss" scoped></style>
