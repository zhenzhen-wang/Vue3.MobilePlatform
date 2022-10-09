<script setup lang="ts">
import BaseSwipeList from '@/components/Utils/BaseSwipeList.vue';
import BaseSearch from '@/components/Utils/BaseSearch.vue';
import type { Ref, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
// 子组件传过来的id
const previewDetail = (id: number) => {
  router.push('/IDLResumeReview');
  console.log('id:' + id);
};
// 子组件传过来的查询字段
const getItem = (returnVal: Ref) => {
  console.log(returnVal.value);
};
const list = [
  {
    id: 1,
    title: '张三的个人简历',
    status: '签核中',
    desc: '表现一般，待下一步面试',
  },
  {
    id: 2,
    title: '李四的个人简历',
    status: '已录用',
    desc: '表现良好，予以录取',
  },
];
</script>

<template>
  <!-- 搜索框 -->
  <base-search @searchChange="getItem" placeholder="请输入名称检索"></base-search>

  <!-- 明细列表 -->
  <div style="margin-top: 5px">
    <base-swipe-list :cellList="list" @preview="previewDetail" />
  </div>
</template>

<style lang="scss" scoped></style>
