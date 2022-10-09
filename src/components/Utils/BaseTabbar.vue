<script setup lang="ts">
defineProps(['tabList']);
</script>

<template>
  <van-tabbar route active-color="#1989fa">
    <van-tabbar-item v-for="item in tabList" replace :key="item.id" :to="item.to" :icon="item.icon">
      {{ item.name }}
    </van-tabbar-item>
  </van-tabbar>
</template>

<style lang="scss" scoped></style>
