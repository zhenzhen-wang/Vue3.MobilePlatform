<script setup lang="ts">
interface GridParams {
  id: number;
  icon: string;
  text: string;
  to: string;
}
defineProps<{
  list: GridParams[];
}>();
</script>

<template>
  <van-grid clickable direction="horizontal" :column-num="1" icon-size="40px" :gutter="10">
    <van-grid-item
      v-for="item in list"
      :key="item.id"
      :icon="item.icon"
      :text="item.text"
      :to="item.to"
    />
    <!-- icon-color="#1e80ffde" -->
  </van-grid>
</template>

<style lang="scss" scoped></style>
