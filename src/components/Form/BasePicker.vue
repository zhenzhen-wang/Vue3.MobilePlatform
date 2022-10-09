<!-- 
  2022/08/04 By Bonnie
  此组件可以接受字符串数组，也可以接受对象数组
  1.若column接收的是string数组，则text跟value是一样的
  2.若column接收的是对象数组，则显示text数据，传递给父组件的值是value，text用于前台显示，value用于跟后端交互
    2.1 如果后台得到的对象数组，无text栏位名，则使用colunmsFieldNames重命名栏位名---暂未实现
 -->
<script setup lang="ts">
import { ref, computed } from 'vue';

const showPicker = ref(false);

type columnType = {
  text: string;
  value: string;
};
const onConfirm = (value: string | columnType): void => {
  if (typeof value === 'string') {
    result.value = value;
  } else {
    result.value = value.text;
  }
  showPicker.value = false;
};

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  name?: string; // 用于submit时，将name属性传递给values
  label: string;
  placeholder?: string;
  //picker下拉框的数组可能是字符串数组，也可能是对象数组[{text:'',value:''}]
  columns: string[] | columnType[];
  customFieldName?: columnType;
  modelValue: string;
  noRequired?: boolean; // 是否显示必填星号*,不指定则默认必填
}>();

//显示text数据，v-model传递给父组件value值
const result = computed({
  // 用于显示数据，如果是对象数组，则穿过来的props.modelValue是value值，需要串出text用于显示
  get: () => {
    // 如果传入的是一个object数组，则根据传过来的value值得到text值用于显示
    if (props.columns[0] instanceof Object) {
      return (props.columns as columnType[]).filter((e: any) => e.value == props.modelValue)[0]
        .text;
    } else {
      return props.modelValue;
    }
  },
  // 用于传递给父组件，对象则传递value，string数组则直接传递val
  set: (val) => {
    // 如果传入的是一个object数组，则回传value值给父组件
    if (props.columns[0] instanceof Object) {
      emit(
        'update:modelValue',
        (props.columns as columnType[]).filter((e: any) => e.text == val)[0].value,
      );
    } else {
      emit('update:modelValue', val);
    }
  },
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
    <van-picker
      :title="label"
      :columns="columns"
      @confirm="onConfirm"
      @cancel="showPicker = false"
    />
    <!-- :colunmsFieldNames="customFieldName" -->
  </van-popup>
</template>

<style lang="scss" scoped></style>
