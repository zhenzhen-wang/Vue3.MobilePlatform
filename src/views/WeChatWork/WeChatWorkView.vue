<script setup lang="ts">
import BaseTabbar from '@/components/Utils/BaseTabbar.vue';
import { RouterView } from 'vue-router';
const list = [
  {
    id: 1,
    name: '主页',
    to: '/HomeList',
    icon: 'home-o',
  },
  {
    id: 2,
    name: '我的',
    to: '/MyList',
    icon: 'user-o',
  },
];
</script>

<template>
  <!-- TabbarPage页面路由占位符，在此父组件中通过title传值给子路由 -->
  <router-view title="企业微信应用" />
  <!-- 最下方tabbar标签页导航 -->
  <base-tabbar :tabList="list" />
</template>

<style lang="scss" scoped></style>
