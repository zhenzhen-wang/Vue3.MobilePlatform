<script setup lang="ts">
defineProps(['cellList']);
const emits = defineEmits(['preview']);
const previewDetial = (previewId: number) => {
  emits('preview', previewId);
};

const deleteItem = (val: number) => {
  console.log(val);
};
</script>
<template>
  <!--可滑动的List组件-->
  <div>
    <!--如果list为空，则显示空图片-->
    <van-empty v-if="cellList.length == 0" description="暂无待处理项" />
    <!--可滑动单元格列表-->
    <van-swipe-cell v-for="item in cellList" :key="item.id">
      <van-cell-group>
        <van-cell :title="item.title" :value="item.status" :label="item.desc" @click="previewDetial(item.id)" />
      </van-cell-group>
      <!--从右侧滑动删除item-->
      <template #right>
        <van-button square type="danger" class="delete-button" text="删除" @click="deleteItem(item.id)" />
      </template>
    </van-swipe-cell>
  </div>
</template>

<style scoped>
.delete-button {
  height: 100%;
}
</style>
