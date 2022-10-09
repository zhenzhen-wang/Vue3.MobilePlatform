<script setup lang="ts">
import type { dataList } from '@/types/base-component';
import { computed } from '@vue/reactivity';
import { ref, watch } from 'vue';

const emits = defineEmits(['update:modelValue', 'getCurrentId']);

const props = defineProps<{
  loading: boolean;
  modelValue: string[]; // 点击选中的人员身份证号list
  dataList: dataList[];
  isLink?: boolean; // 是否显示cell单元格右侧的箭头，并有打开popup的功能
  label?: string;
}>();

const checkedList = computed({
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

// 控制list的全选与反选
const checkboxGroup = ref();
const allChecked = ref(false);
watch(allChecked, () => {
  if (allChecked.value) {
    checkboxGroup.value?.toggleAll(true);
  } else {
    checkboxGroup.value?.toggleAll();
  }
});
</script>

<template>
  <!-- 符合条件的面试者清单 -->
  <van-cell-group inset class="group_list">
    <van-loading size="40px" type="spinner" vertical v-show="loading">查询中...</van-loading>

    <van-divider content-position="left" v-show="dataList.length">
      <van-checkbox v-model="allChecked" shape="square" icon-size="18px">全选：</van-checkbox>
      {{ label == null ? '人员列表' : label }}
    </van-divider>
    <van-checkbox-group v-model="checkedList" ref="checkboxGroup">
      <van-cell
        :is-link="isLink"
        v-for="item in dataList"
        clickable
        :key="item.id_card_no"
        @click="showPopup(item.id_card_no)"
      >
        <van-checkbox :name="item.id_card_no" shape="square" icon-size="18px">{{
          item.name + ' ' + item.id_card_no
        }}</van-checkbox>
      </van-cell>
      <div v-show="dataList.length" class="van-list__finished-text"
        >共计{{ dataList.length }}人，没有更多了</div
      >
    </van-checkbox-group>
  </van-cell-group>

  <!-- 弹出框显示面试者的详细资料 -->
  <van-popup v-model:show="show" position="bottom" round closeable :style="{ height: '90%' }">
    <!-- 面试者详细资料组件 -->
    <slot></slot>
  </van-popup>

  <!-- 分割线 -->
  <!-- <van-divider /> -->

  <!-- <van-list
      v-model:loading="loading"
      :finished="finished"
      finished-text="没有更多了"
      style="max-height: 400px; overflow: scroll"
    >
      <template v-for="item in list" :key="item.id">
        <van-cell is-link @click="showPopup(item.id)">
          <template #title>
            <van-checkbox v-model="item.checked" shape="square" icon-size="16px"
              >{{ item.name }}：{{ item.id }}</van-checkbox
            >
          </template>
          <template #label> {{ item.id }} </template>
        </van-cell>

        <van-popup
          v-model:show="showPicker"
          position="bottom"
          round
          closeable
          :style="{ height: '80%' }"
        >
          <van-cell-group style="margin-top: 50px">
            <van-cell title="姓名" value="张三" />
            <van-cell title="身份证" value="5345345345435" label="描述信息" />
          </van-cell-group>
        </van-popup>
      </template>
    </van-list> -->
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
