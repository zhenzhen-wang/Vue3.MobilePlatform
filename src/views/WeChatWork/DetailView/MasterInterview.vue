<script setup lang="ts">
import { ref } from 'vue';
import { Notify } from 'vant';
import type { dataList } from '@/types/base-component';
import ResumeReview from '../../HrResume/Component/ResumeReview.vue';
import BaseRadioList from '../../../components/List/BaseRadioList.vue';
import { api } from '@/api';
import BaseLoading from '../../../components/Utils/BaseLoading.vue';
import { useParamStore } from '@/stores/parameters';
import router from '@/router';

const onClickLeft = () => router.push('/HomeList'); //history.back();

// 获取填写页面的所有参数
const paramStore = useParamStore();

// 查询条件
const search = ref({
  work_type: 'IDL', //面试者类型
  status: '1,2,3,4,5,6', //
  name: '',
  idCardLast4: '', //身份证后四位
});
// 获取满足条件的人员list
let list = ref<dataList[]>([]);
// 点击选中的人员身份证号
const checked = ref<string>('');
const loading = ref(false);

const onSubmit = async () => {
  list.value = [];
  checked.value = '';
  loading.value = true;

  const result = await api.getEmployeeList(search.value);
  console.log(result);

  list.value.push(...result);
  if (list.value.length == 0) {
    Notify('未查询到符合条件人员资料');
  }
  // 加载状态结束
  loading.value = false;
};

// 子组件传递过来的当前的人员身份证id，用于review其详细资料
const currentCheckBoxId = ref('');
const getCurrentId = (id: string) => {
  currentCheckBoxId.value = id;
  console.log(id);
};

// 录用通过，参数：idcardno，status(idl:2)  与hr共用接口
// 不予录用，参数：idcardno，status(6)，type（是否删除其资料）：删  与hr共用接口
let globalLoading = ref(false);
const update = async (status: string) => {
  if (!checked.value.length) {
    Notify('请点击选中人员！');
    return;
  }
  globalLoading.value = true;
  const updateParams = {
    idCardNoList: [checked.value],
    status: status,
    delete: false,
    empno: paramStore.userId,
  };
  const result = await api.updateStatus(updateParams);
  if (result !== 'OK') {
    Notify(result);
  } else {
    Notify({ type: 'success', message: '操作成功' });
  }
  globalLoading.value = false;
};
</script>

<template>
  <!-- 页面头部 -->
  <van-nav-bar title="中心主管面试" left-text="返回" left-arrow @click-left="onClickLeft" />
  <base-loading :global-loading="globalLoading"></base-loading>

  <!-- 表单查询项 -->
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <van-field
        v-model.trim="search.name"
        label="面试者姓名"
        placeholder="请填写面试者姓名（可选填）"
        clearable
      />

      <van-field
        v-model.trim="search.idCardLast4"
        type="digit"
        label="身份证后四位"
        placeholder="请填写身份证后四位（可选填）"
        clearable
      />
    </van-cell-group>

    <!-- 查询按钮 -->
    <div style="margin: 26px">
      <van-button round block type="warning" native-type="submit"> 查询 </van-button>
    </div>
  </van-form>

  <!-- 符合条件的面试者清单 -->
  <base-radio-list
    v-model="checked"
    :dataList="list"
    :loading="loading"
    :is-link="true"
    @getCurrentId="getCurrentId"
  >
    <!-- 面试者详细资料组件,以插槽的形式传递过去 -->
    <resume-review :id="currentCheckBoxId" />
  </base-radio-list>

  <van-form>
    <!-- 面试记录 -->
    <van-cell-group inset :style="{ 'margin-top': '15px' }" v-show="list.length">
      <!-- 面试通过按钮 -->
      <div style="margin: 16px">
        <van-button round block type="primary" @click="update('2')"> 面试通过 </van-button>
      </div>
      <!-- 不予录用按钮 -->
      <div style="margin: 16px">
        <van-button round block type="danger" @click="update('6')"> 不予录用 </van-button>
      </div>
    </van-cell-group>
  </van-form>
</template>

<style lang="scss" scoped></style>
