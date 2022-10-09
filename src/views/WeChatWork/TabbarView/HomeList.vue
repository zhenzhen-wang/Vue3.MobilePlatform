<script setup lang="ts">
import BaseGrid from '@/components/Utils/BaseGrid.vue';

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
