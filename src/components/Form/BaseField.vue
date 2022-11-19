<script setup lang="ts">
import type { FieldType } from 'vant';
import { computed } from 'vue';

const emit = defineEmits(['update:modelValue']);
const props = defineProps<{
  name?: string;
  label: string;
  type?: FieldType | undefined; //vant：digit调起数字键盘等
  placeholder?: string;
  modelValue: string | number;
  noRequired?: boolean; // 是否显示必填星号*,不指定则默认必填
  validateType?: string; // 验证类型（手机号或者邮箱等）
}>();

const result = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

const validator = () => {
  // 值不为空则检查其是否符合类型要求（用于选填的类型验证）
  if (result.value) {
    switch (props.validateType) {
      case 'number':
        return /^\d+$/.test(result.value as string);
      case 'phone':
        return /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/.test(
          result.value as string,
        );
      case 'email':
        return /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/.test(
          result.value as string,
        );
      default:
        return true;
    }
  } else {
    // 为空则不验证类型
    return true;
  }
};
// 如果传过来的placeholder为空，则默认填写请填写${label}.不为空，则填写placeholder
</script>

<template>
  <van-field
    v-model.trim="result"
    :name="name"
    :label="label"
    :type="type"
    :placeholder="placeholder ? placeholder : `请填写${label}`"
    :required="noRequired ? false : true"
    :rules="[
      { required: noRequired ? false : true, message: `${label}不可留空` },
      { validator, message: `请输入正确的${label}` }, //validator属性名跟属性名称一致，省略，验证默认返回true，即不做正确性的验证
    ]"
    clearable
  >
    <template #right-icon>
      <slot />
    </template>
  </van-field>
</template>

<style lang="scss" scoped></style>
