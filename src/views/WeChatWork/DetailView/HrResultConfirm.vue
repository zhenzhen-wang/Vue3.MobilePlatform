<script setup lang="ts">
import { ref } from 'vue';
import BasePicker from '../../../components/Form/BasePicker.vue';
import BaseDatePicker from '../../../components/Form/BaseDatePicker.vue';
import { useParamStore } from '@/stores/parameters';
import { Notify } from 'vant';
import BaseRadioList from '../../../components/List/BaseRadioList.vue';
import type { dataList } from '@/types/base-component';
import ResumeReview from '../../HrResume/Component/ResumeReview.vue';

const onClickLeft = () => history.back();

// 获取页面所需的所有参数
const paramStore = useParamStore();

// 查询条件
const search = ref({
  workTypeVal: 'IDL', //面试者类型
  employStatusVal: '2', //录用状态（待录用）
  name: '',
  idCardLast4Number: '', //身份证后四位
});
// console.log(...[search]);

// 回填的结果
const result = ref({
  companyCodeVal: '', //公司别代码
  isAddWorkYearVal: '', //是否续年资
  deptName: '', //部门名称
  outWorkYear: '', // 公司外年资
  jobAppellation: '', // 职称
  jobDegree: '', // 职等
  arrivalDate: '', // 导致日期
});

//获取满足条件的人员list
let list = ref<dataList[]>([]);
// 点击选中的人员身份证号
const checked = ref<string>('');
const loading = ref(false);

const onSubmit = (values: object) => {
  list.value = [];
  loading.value = true;

  console.log('submit', values);

  // 抓取符合条件的后端数据
  setTimeout(() => {
    // 加载状态结束
    loading.value = false;

    const data = [
      { name: '汪文渊', id: '320724199101110028' },
      { name: '张三', id: '320724199101110027' },
    ];
    list.value.push(...data);

    if (list.value.length == 0) {
      Notify({ type: 'danger', message: '未查询到符合人员资料' });
    }
  }, 1000);
};

// 子组件传递过来的当前的人员身份证id，用于review其详细资料
const currentCheckBoxId = ref('');
const getCurrentId = (id: string) => {
  currentCheckBoxId.value = id;
  console.log(id);
};

const onSubmit1 = (values: object) => {
  console.log('submit1', values);
};
// 完成录用，参数：idcardno，status(idl:2) 及职等职称等，单独接口
// 不予录用，参数：idcardno，status(6)，type（是否删除其资料）：删 与hr共用接口
</script>

<template>
  <!-- 页面头部 -->
  <van-nav-bar title="IDL录用确认" left-text="返回" left-arrow @click-left="onClickLeft" />

  <!-- 表单查询项 -->
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <!-- 面试者类型 -->
      <base-picker
        v-model="search.workTypeVal"
        label="员工类型"
        :columns="paramStore.workTypeList"
      />

      <!-- 面试者录用状态 -->
      <base-picker
        v-model="search.employStatusVal"
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
        v-model.trim="search.idCardLast4Number"
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

  <van-form @submit="onSubmit1">
    <!-- 面试记录 -->
    <van-cell-group inset :style="{ 'margin-top': '15px' }">
      <van-divider content-position="left"> 面试记录 </van-divider>

      <!-- 公司别、部门名称，IDL/DL都有 -->
      <base-picker
        v-model="result.companyCodeVal"
        name="companyCode"
        label="公司别"
        placeholder="请选择公司别"
        :columns="paramStore.companyCodeList"
      ></base-picker>
      <van-field
        v-model="result.deptName"
        name="deptName"
        label="部门名称"
        placeholder="请输入部门名称或代码"
        required
        :rules="[{ required: true, message: '请填写部门名称或代码' }]"
      />

      <!-- 1.是否續年資 -->
      <base-picker
        v-model="result.isAddWorkYearVal"
        v-if="search.workTypeVal === 'IDL'"
        name="isAddWorkYear"
        label="是否續年資"
        placeholder="请选择是否續年資"
        :columns="paramStore.judgeList"
      ></base-picker>

      <van-field
        v-model="result.outWorkYear"
        v-if="result.isAddWorkYearVal === 'Y'"
        name="deptName"
        label="公司外年资"
        placeholder="请输入公司外年资"
        required
        :rules="[{ required: true, message: '请填写公司外年资' }]"
      />
      <van-field
        v-model="result.jobAppellation"
        v-if="search.workTypeVal === 'IDL'"
        name="deptName"
        label="职称"
        placeholder="请输入职称"
        required
        :rules="[{ required: true, message: '请填写职称' }]"
      />
      <van-field
        v-model="result.jobDegree"
        v-if="search.workTypeVal === 'IDL'"
        name="deptName"
        label="职等"
        placeholder="请输入职等"
        required
        :rules="[{ required: true, message: '请填写职等' }]"
      />

      <!-- 录用者到职日期 -->
      <base-date-picker
        v-model="result.arrivalDate"
        v-if="search.workTypeVal === 'IDL'"
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
        <van-button round block type="danger"> 不予录用 </van-button>
      </div>
    </van-cell-group>
  </van-form>
</template>

<style lang="scss" scoped></style>