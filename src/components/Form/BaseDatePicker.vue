<script setup lang="ts">
import { ref, computed } from 'vue';
const currentDate = ref(new Date());
const minDate = new Date(2019, 0, 1);
const maxDate = new Date(2100, 10, 1);

const showPicker = ref(false);
const onConfirm = (value: string) => {
  result.value = formatDate(new Date(value));
  showPicker.value = false;
};

//格式化日期
const formatDate = (d: Date): string => {
  let year = d.getFullYear();
  let month: number | string = d.getMonth() + 1;
  let date: number | string = d.getDate();
  month = month < 10 ? '0' + month : month;
  date = date < 10 ? '0' + date : date;
  return year + '-' + month + '-' + date;
};

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  name?: string;
  label: string;
  placeholder?: string;
  modelValue: string;
  noRequired?: boolean; // 是否显示必填星号*,不指定则默认必填
}>();

const result = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>

<template>
  <van-field
    v-model="result"
    is-link
    readonly
    :name="name"
    :label="label"
    :placeholder="placeholder ? placeholder : `请选择${label}`"
    @click="showPicker = true"
    :required="noRequired ? false : true"
    :rules="[{ required: noRequired ? false : true, message: `必须选择${label}` }]"
  />
  <van-popup v-model:show="showPicker" position="bottom">
    <van-datetime-picker
      v-model="currentDate"
      type="date"
      :min-date="minDate"
      :max-date="maxDate"
      :title="label"
      @confirm="onConfirm"
      @cancel="showPicker = false"
    />
  </van-popup>
</template>

<style lang="scss" scoped></style>
