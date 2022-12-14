<script setup lang="ts">
import { ref } from 'vue';
import BasePicker from '../../../components/Form/BasePicker.vue';
import BaseDatePicker from '../../../components/Form/BaseDatePicker.vue';
import { useParamStore } from '@/stores/parameters';
import { Notify } from 'vant';
import BaseRadioList from '../../../components/List/BaseRadioList.vue';
import type { dataList } from '@/types/base-component';
import ResumeReview from '../../HrResume/Component/ResumeReview.vue';
import BaseLoading from '../../../components/Utils/BaseLoading.vue';
import { api } from '@/api';
import BaseField from '../../../components/Form/BaseField.vue';
import router from '@/router';

const onClickLeft = () => router.push('/HomeList'); //history.back();

// 获取页面所需的所有参数
const paramStore = useParamStore();

// 查询条件
const search = ref({
  work_type: 'IDL', //面试者类型
  status: '2', //审核状态,待录用
  idCardLast4: '', //身份证后四位
  creation_date: '', //填表时间
  salary_type: '', //工种类型
  batch_no: '', //当日批次
  name: '',
});

//获取满足条件的人员list
let list = ref<dataList[]>([]);
// 点击选中的人员身份证号
const checked = ref<string>('');
const loading = ref(false);

const onSubmit = async () => {
  //清空面试记录
  Object.keys(result.value).forEach((k) => (result.value[k as keyof typeof result.value] = ''));
  list.value = [];
  checked.value = '';
  loading.value = true;

  const res = await api.getEmployeeList(search.value);
  list.value.push(...res);
  if (list.value.length == 0) {
    Notify('未查询到符合条件人员资料');
  }
  // 加载状态结束
  loading.value = false;
};

// 子组件传递过来的当前的人员身份证id，用于review其详细资料
const currentCheckBoxId = ref('');
const getCurrentId = async (id: string) => {
  currentCheckBoxId.value = id;
  // 点击面试者后，带出其主管结论
  const res = await api.getManagerComment(id);
  result.value.company = res.company;
  result.value.add_work_year = res.add_work_year;
  result.value.dept_name = res.dept_name;
};

// 回填的结果
const result = ref({
  company: '', // 公司别代码
  dept_name: '', // 部门名称
  add_work_year: '', // 是否续年资
  out_work_year: '', // 公司外年资
  job_appellation: '', // 职称
  job_degree: '', // 职等
  arrival_date: '', // 导致日期
  id_card_no: '',
  hr_empno: '',
});

// 点击按钮，录用或不录用
let globalLoading = ref(false);
const buttonClick = async (type: string) => {
  if (!checked.value.length) {
    Notify('请点击选中人员！');
    return;
  }
  let resResult;
  globalLoading.value = true;

  // 不予录用，参数：idcardno，status(6)，delete（是否删除其资料）：删 与hr共用接口（提示是否确认删除其资料）
  if (type == 'cancel') {
    const updateParams = {
      idCardNoList: [checked.value],
      status: '6',
      delete: true,
      empno: paramStore.userId,
    };
    resResult = await api.updateStatus(updateParams);
  } else {
    // 完成录用，参数：idcardno，status(idl:3) 及职等职称等，单独接口
    result.value.id_card_no = checked.value;
    result.value.hr_empno = paramStore.userId; //因为在查询前已经重置了result对象，所以需要给其赋值
    resResult = await api.insertResult(result.value);
  }

  if (resResult !== 'OK') {
    Notify(resResult);
  } else {
    Notify({ type: 'success', message: '操作成功' });
  }
  globalLoading.value = false;
  //清空面试记录
  checked.value = '';
  Object.keys(result.value).forEach((k) => (result.value[k as keyof typeof result.value] = ''));
};
</script>

<template>
  <!-- 页面头部 -->
  <van-nav-bar title="IDL录用确认" left-text="返回" left-arrow @click-left="onClickLeft" />
  <base-loading :global-loading="globalLoading"></base-loading>

  <!-- 表单查询项 -->
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <!-- 面试者类型 -->
      <base-picker v-model="search.work_type" label="员工类型" :columns="paramStore.workTypeList" />

      <!-- 面试者录用状态 -->
      <base-picker
        v-model="search.status"
        label="录用状态"
        :columns="paramStore.idlEmployStatusList"
      />

      <van-field
        v-model.trim="search.name"
        label="面试者姓名"
        placeholder="请填写面试者姓名"
        clearable
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
  <base-radio-list
    v-model="checked"
    :dataList="list"
    :loading="loading"
    :is-link="false"
    @getCurrentId="getCurrentId"
  >
    <!-- 面试者详细资料组件,以插槽的形式传递过去 -->
    <resume-review :id="currentCheckBoxId" />
  </base-radio-list>

  <van-form @submit="buttonClick" ref="submitRef">
    <!-- 面试记录 -->
    <van-cell-group inset :style="{ 'margin-top': '15px' }">
      <van-divider content-position="left"> 面试记录 </van-divider>

      <!-- 公司别、部门名称，IDL/DL都有 -->
      <base-picker
        v-model="result.company"
        name="companyCode"
        label="公司别"
        placeholder="请选择公司别"
        :columns="paramStore.companyCodeList"
      ></base-picker>
      <van-field
        v-model="result.dept_name"
        name="deptName"
        label="部门名称"
        placeholder="请输入部门名称或代码"
        required
        :rules="[{ required: true, message: '请填写部门名称或代码' }]"
        clearable
      />

      <!-- 1.是否續年資 -->
      <base-picker
        v-model="result.add_work_year"
        v-if="search.work_type === 'IDL'"
        name="isAddWorkYear"
        label="是否續年資"
        placeholder="请选择是否續年資"
        :columns="paramStore.judgeList"
      ></base-picker>

      <base-field
        label="公司外年资"
        v-model="result.out_work_year"
        v-if="result.add_work_year === 'Y'"
        validate-type="number"
        >年</base-field
      >
      <van-field
        v-model="result.job_appellation"
        v-if="search.work_type === 'IDL'"
        name="deptName"
        label="职称"
        placeholder="请输入职称"
        required
        :rules="[{ required: true, message: '请填写职称' }]"
        clearable
      />
      <van-field
        v-model="result.job_degree"
        v-if="search.work_type === 'IDL'"
        name="deptName"
        label="职等"
        placeholder="请输入职等"
        required
        :rules="[{ required: true, message: '请填写职等' }]"
        clearable
      />

      <!-- 录用者到职日期 -->
      <base-date-picker
        v-model="result.arrival_date"
        v-if="search.work_type === 'IDL'"
        name="arrivalDate"
        label="到职日期"
        placeholder="点击选择到职日期"
      ></base-date-picker>

      <!-- 面试通过按钮 -->
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit"> 完成录用 </van-button>
      </div>
      <!-- 不予录用按钮 -->
      <div style="margin: 16px">
        <van-button round block type="danger" @click="buttonClick('cancel')"> 不予录用 </van-button>
      </div>
    </van-cell-group>
  </van-form>
</template>

<style lang="scss" scoped></style>
