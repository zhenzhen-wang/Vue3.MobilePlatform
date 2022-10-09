<script setup lang="ts">
import { RouterView } from 'vue-router';
// console.log(import.meta.env.VITE_GLOB_APP_TITLE);
</script>

<template>
  <RouterView />
</template>

<style>
@import '@/assets/base.css';

#app {
  max-width: 912px;
  margin: 0 auto;
  font-weight: normal;
}
/* 设置头部标题 */
.van-nav-bar {
  margin-bottom: 10px;
}

/* grid样式 */
.van-grid {
  padding-top: 10px;
}
</style>
