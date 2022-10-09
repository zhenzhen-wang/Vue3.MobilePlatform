<script setup lang="ts">
import type { dataList } from '@/types/base-component';
import { computed } from '@vue/reactivity';
import { ref } from 'vue';

const emits = defineEmits(['update:modelValue', 'getCurrentId']);

const props = defineProps<{
  loading: boolean;
  modelValue: string; // 点击选中的人员身份证号
  dataList: dataList[];
  isLink?: boolean; // 是否显示cell单元格右侧的箭头，并有打开popup的功能
  label?: string;
}>();

const checked = computed({
  get: () => props.modelValue,
  set: (val) => emits('update:modelValue', val),
});

// 控制popup窗口的弹出
const show = ref(false);
const showPopup = (id: string): void => {
  emits('getCurrentId', id);
  // 如果list中已有此人，即代表选中，则跳出popup.反之取消勾选是不跳出popup
  if (props.modelValue.includes(id) && props.isLink) show.value = true;
};
</script>

<template>
  <!-- 符合条件的面试者清单 -->
  <van-cell-group inset class="group_list">
    <van-loading size="40px" type="spinner" vertical v-show="loading">查询中...</van-loading>

    <van-radio-group v-model="checked" ref="checkboxGroup">
      <van-divider content-position="left" v-show="dataList.length">
        {{ label == null ? '人员列表' : label }}
      </van-divider>
      <van-cell
        :is-link="isLink"
        v-for="item in dataList"
        clickable
        :key="item.id_card_no"
        @click="showPopup(item.id_card_no)"
      >
        <van-radio :name="item.id_card_no" icon-size="18px">{{
          item.name + ' ' + item.id_card_no
        }}</van-radio>
      </van-cell>
      <div v-show="dataList.length" class="van-list__finished-text"
        >共计{{ dataList.length }}人，没有更多了</div
      >
    </van-radio-group>
  </van-cell-group>

  <!-- 弹出框显示面试者的详细资料 -->
  <van-popup v-model:show="show" position="bottom" round closeable :style="{ height: '90%' }">
    <!-- 面试者详细资料组件 -->
    <slot></slot>
  </van-popup>
</template>

<style lang="scss" scoped>
.group_list {
  // min-height: 100px;
  max-height: 400px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .van-loading {
    margin: 30px;
  }
}
</style>
