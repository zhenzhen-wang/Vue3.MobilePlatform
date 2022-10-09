<script setup lang="ts">
const onClickLeft = () => history.back();
</script>

<template>
  <van-nav-bar title="待上线页面" left-text="返回" left-arrow @click-left="onClickLeft" />
  <van-empty description="此页面待开发中，暂未上线" />
</template>

<style lang="scss" scoped></style>
