<script setup lang="ts">
import BaseGrid from '@/components/Utils/BaseGrid.vue';
import type { GridList } from '@/types/base-component';

const list: GridList[] = [
  {
    id: 1,
    icon: 'records',
    text: 'DL电子简历',
    to: '/DLResume',
  },
  {
    id: 2,
    icon: 'newspaper-o',
    text: 'IDL电子简历',
    to: '/IDLResume',
  },
  {
    id: 3,
    icon: 'weapp-nav',
    text: '待开发',
    to: '',
  },
];
</script>
<template>
  <!-- closeable 模式，在右侧显示关闭按钮 -->
  <van-notice-bar mode="closeable"
    >昆达电脑科技欢迎您！了解详情请咨询HR电话：0512-57367777+2816。
  </van-notice-bar>
  <!-- 标题 -->
  <!-- <van-nav-bar>
    <template #title>
      <div style="font: bold 16px Microsoft Yahei">
        昆达微服务
        <img src="@/assets/images/mic_logo.png" style="max-width: 70px" />
      </div>
    </template>
  </van-nav-bar> -->
  <!-- 宫格显示 -->
  <base-grid :gridList="list" :count="3" />
</template>

<style lang="scss" scoped></style>
