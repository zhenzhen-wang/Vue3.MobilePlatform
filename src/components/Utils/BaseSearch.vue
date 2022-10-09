<script lang="ts" setup>
import { ref } from 'vue';

defineProps(['placeholder']);
const emits = defineEmits(['searchChange']);

const searchItem = ref('');

// 将子组件的数据当做参数传递给父组件，searchChange为父组件的事件名
const onSearch = () => emits('searchChange', searchItem);
</script>
<template>
  <div>
    <!--搜索框-->
    <van-search v-model="searchItem" shape="round" :placeholder="placeholder" @search="onSearch" />
  </div>
</template>

<style scoped></style>
