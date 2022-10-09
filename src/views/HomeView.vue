<script lang="ts" setup>
import BaseHorizontalGrid from '@/components/Utils/BaseHorizontalGrid.vue';

const mainSystemList = [
  {
    id: 1,
    icon: 'desktop-o',
    text: '企业微信应用',
    to: '/WeChatWorkView',
  },
  {
    id: 2,
    icon: 'friends-o',
    text: '昆达微服务',
    to: '/HrResumeView',
  },
];
</script>

<template>
  <!-- <van-nav-bar>
    <template #title>
      <div style="font: bold 16px Microsoft Yahei">昆达移动APP平台</div>
    </template>
  </van-nav-bar> -->
  <BaseHorizontalGrid :list="mainSystemList" />
</template>

<style scoped></style>
