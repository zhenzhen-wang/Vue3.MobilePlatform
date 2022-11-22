<script setup lang="ts">
defineProps<{
  globalLoading: boolean;
}>();
</script>

<template>
  <!-- 全局遮罩层 -->
  <van-overlay :show="globalLoading">
    <div class="wrapper" @click.stop>
      <van-loading class="block" type="spinner" color="white" size="60px" vertical>
        加载中,请稍后...
      </van-loading>
    </div>
  </van-overlay>
</template>

<style lang="scss" scoped>
// loading样式
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.block {
  width: 120px;
  height: 120px;
  // background-color: #fff;
}
</style>
