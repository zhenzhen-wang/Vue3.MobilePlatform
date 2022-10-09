<script setup lang="ts">
// defineProps(['gridList', 'count']);
type GridList = {
  id: number;
  icon: string;
  text: string;
  to: string;
};

defineProps<{
  gridList: GridList[];
  count: number;
}>();
</script>

<template>
  <van-grid square :column-num="count" :gutter="10">
    <van-grid-item v-for="item in gridList" :key="item.id" :text="item.text" :to="item.to">
      <template #icon>
        <van-icon :name="item.icon" color="#1989fa" size="30" />
      </template>
    </van-grid-item>
  </van-grid>
</template>

<style lang="scss" scoped></style>
