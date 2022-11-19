<script setup lang="ts">
import { ref } from 'vue';
import BasePicker from '../../../components/Form/BasePicker.vue';
import BaseDatePicker from '../../../components/Form/BaseDatePicker.vue';
import { useParamStore } from '@/stores/parameters';
import BaseCheckboxList from '../../../components/List/BaseCheckboxList.vue';
import type { dataList } from '@/types/base-component';
import ResumeReview from '../../HrResume/Component/ResumeReview.vue';
import { Notify } from 'vant';
import { api } from '@/api';
import BaseLoading from '../../../components/Utils/BaseLoading.vue';
import router from '@/router';

const onClickLeft = () => router.push('/HomeList'); //history.back();

// 获取填写页面的所有参数
const paramStore = useParamStore();

const search = ref({
  work_type: 'IDL', //面试者类型
  status: '0', //审核状态（待审核）
  idCardLast4: '', //身份证后四位
  creation_date: '', //填表时间
  salary_type: '', //工种类型
  batch_no: '', //当日批次
});

// 点击选中的人员身份证号list
const checkedList = ref<string[]>([]);
// 后台查询到的所有人员清单
let list = ref<dataList[]>([]);
const loading = ref(false);

// 查询
const onSubmit = async () => {
  list.value = [];
  checkedList.value = [];
  loading.value = true;

  const result = await api.getEmployeeList(search.value);
  list.value.push(...result);
  if (list.value.length == 0) {
    Notify('未查询到符合条件人员资料');
  }
  // 加载状态结束
  loading.value = false;
};

// 选中的人员身份证号
const currentCheckBoxId = ref('');
const getCurrentId = (id: string) => {
  // 将获取的身份证号码传给resume-review组件，调出详细信息查询窗口
  currentCheckBoxId.value = id;
};

// 审核通过&取消审核：参数idcardno，status（通过status：1 取消status：0），delete（是否删除其资料）：不删
// 加载遮罩层，全域
let globalLoading = ref(false);
const update = async (status: string) => {
  if (!checkedList.value.length) {
    Notify('请点击选中人员！');
    return;
  }
  globalLoading.value = true;
  const updateParams = {
    idCardNoList: checkedList.value,
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
  <van-nav-bar title="HR资料审核" left-text="返回" left-arrow @click-left="onClickLeft" />
  <base-loading :global-loading="globalLoading"></base-loading>

  <!-- 表单查询项 -->
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <!-- 面试者类型 -->
      <base-picker v-model="search.work_type" label="员工类型" :columns="paramStore.workTypeList" />

      <!-- 面试者简历审核状态 -->
      <base-picker v-model="search.status" label="审核状态" :columns="paramStore.auditStatusList" />
      <!-- :customFieldName="paramStore.customFieldName" -->

      <!-- 面试者填表时间 -->
      <base-date-picker v-model="search.creation_date" label="填表时间" no-required />

      <!-- 工种类型 -->
      <base-picker
        v-model="search.salary_type"
        v-if="search.work_type === 'DL'"
        label="工种类型"
        :columns="paramStore.salaryTypeList"
        no-required
      />
      <!-- 当日批次 -->
      <base-picker
        v-model="search.batch_no"
        v-if="search.work_type === 'DL'"
        label="当日批次"
        :columns="paramStore.batchList"
        no-required
      />
      <van-field
        v-model.trim="search.idCardLast4"
        type="digit"
        label="身份证后四位"
        placeholder="请填写身份证后四位"
        clearable
      />
    </van-cell-group>

    <!-- 查询按钮 -->
    <div style="margin: 16px">
      <van-button round block type="warning" native-type="submit"> 查询 </van-button>
    </div>
  </van-form>

  <!-- 符合条件的面试者清单 -->
  <base-checkbox-list
    v-model="checkedList"
    :dataList="list"
    :loading="loading"
    :is-link="true"
    @getCurrentId="getCurrentId"
  >
    <!-- 面试者详细资料组件,以插槽的形式传递过去 -->
    <resume-review :id="currentCheckBoxId" />
  </base-checkbox-list>

  <div v-show="list.length">
    <div style="margin: 16px">
      <van-button round block type="primary" @click="update('1')"> 审核通过 </van-button>
    </div>
    <div style="margin: 16px">
      <van-button round block type="danger" @click="update('0')"> 取消审核 </van-button>
    </div>
    <!-- 审核通过按钮 -->
    <van-cell-group inset> </van-cell-group>
  </div>
</template>

<style lang="scss" scoped></style>
