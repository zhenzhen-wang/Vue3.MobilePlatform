<script setup lang="ts">
import { ref } from 'vue';
import BasePicker from '../../../components/Form/BasePicker.vue';
import BaseDatePicker from '../../../components/Form/BaseDatePicker.vue';
import BaseLoading from '../../../components/Utils/BaseLoading.vue';
import { useParamStore } from '@/stores/parameters';
import { Notify } from 'vant';
import BaseCheckboxList from '../../../components/List/BaseCheckboxList.vue';
import type { dataList } from '@/types/base-component';
import ResumeReview from '../../HrResume/Component/ResumeReview.vue';
import { api } from '@/api';

const onClickLeft = () => history.back();

// 获取填写页面的所有参数
const paramStore = useParamStore();

// 查询条件
const search = ref({
  work_type: 'IDL', //面试者类型
  status: '1,2', //审核状态（待面试）
  idCardLast4: '', //身份证后四位
  creation_date: '', //填表时间
  salary_type: '', //工种类型
  batch_no: '', //当日批次
});

// 获取满足条件的人员list
let list = ref<dataList[]>([]);
// 点击选中的人员身份证号list
const checkedList = ref<string[]>([]);
const loading = ref(false);

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

// 子组件传递过来的当前的人员身份证id，用于review其详细资料
const currentCheckBoxId = ref('');
const getCurrentId = (id: string) => {
  currentCheckBoxId.value = id;
};

// 回填的结果
const result = ref({
  companyCodeVal: '', // 公司别代码
  isAddWorkYearVal: 'N', // 是否续年资
  deptName: '', // 部门名称
  character: '', // 性格
  englishTalent: '',
  computerTalent: '',
  workExperience: '',
  professionTalent: '',
  manageTalent: '',
});

// 录用通过，参数：idcardno，status(idl:2,dl:3) 及公司别评价等，单独接口
const confirm = (values: object) => {
  console.log('submit1', values);
};

// 不予录用，参数：idcardno，status(6)，delete（是否删除其资料）：删 与hr共用接口（提示是否确认删除其资料）
let globalLoading = ref(false);
const cancel = async () => {
  if (!checkedList.value.length) {
    Notify('请点击选中人员！');
    return;
  }
  globalLoading.value = true;
  const updateParams = { idCardNoList: checkedList.value, status: '2', delete: true };
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
  <van-nav-bar title="主管面试" left-text="返回" left-arrow @click-left="onClickLeft" />
  <base-loading :global-loading="globalLoading"></base-loading>

  <!-- 表单查询项 -->
  <van-form @submit="onSubmit">
    <van-cell-group inset>
      <!-- 面试者类型 -->
      <base-picker v-model="search.work_type" label="员工类型" :columns="paramStore.workTypeList" />

      <!-- 面试者面试状态-->
      <base-picker
        v-model="search.status"
        label="面试状态"
        :columns="paramStore.interviewStatusList"
      />

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
        v-focus
      />
      <!-- v-focus在vant input中失效，原生input ok的 -->
      <!-- <div v-color="'#ff0000'" class="box"> hi, v-color </div> -->
    </van-cell-group>

    <!-- 查询按钮 -->
    <div style="margin: 26px">
      <van-button round block type="warning" native-type="submit" v-auth="'super'">
        查询
      </van-button>
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

  <van-form @submit="confirm">
    <!-- 面试记录 -->
    <van-cell-group inset :style="{ 'margin-top': '15px' }" v-show="list.length">
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

      <!-- 主管对能力的评价，IDL特有 -->
      <!-- 1.是否續年資 -->
      <base-picker
        v-model="result.isAddWorkYearVal"
        v-if="search.work_type === 'IDL'"
        name="isAddWorkYear"
        label="是否續年資"
        placeholder="请选择是否續年資"
        :columns="paramStore.judgeList"
      ></base-picker>

      <van-field
        v-model="result.character"
        v-if="search.work_type === 'IDL'"
        name="character"
        label="性格特征"
        rows="1"
        autosize
        type="textarea"
        placeholder="请填写性格特征"
        :rules="[{ required: true, message: '请填写性格特征' }]"
        required
      />

      <van-field
        v-model="result.englishTalent"
        v-if="search.work_type === 'IDL'"
        name="englishTalent"
        label="外語應用能力"
        rows="1"
        autosize
        type="textarea"
        placeholder="请填写外語應用能力"
        :rules="[{ required: true, message: '请填写外語應用能力' }]"
        required
      />

      <van-field
        v-model="result.computerTalent"
        v-if="search.work_type === 'IDL'"
        name="computerTalent"
        label="電腦操作能力"
        rows="1"
        autosize
        type="textarea"
        placeholder="请填写電腦操作能力"
        :rules="[{ required: true, message: '请填写電腦操作能力' }]"
        required
      />

      <van-field
        v-model="result.workExperience"
        v-if="search.work_type === 'IDL'"
        name="workExperience"
        label="工作經驗"
        rows="1"
        autosize
        type="textarea"
        placeholder="请填写工作經驗"
        :rules="[{ required: true, message: '请填写工作經驗' }]"
        required
      />

      <van-field
        v-model="result.professionTalent"
        v-if="search.work_type === 'IDL'"
        name="professionTalent"
        label="專業能力"
        rows="1"
        autosize
        type="textarea"
        placeholder="请填写專業能力"
        :rules="[{ required: true, message: '请填写專業能力' }]"
        required
      />

      <van-field
        v-model="result.manageTalent"
        v-if="search.work_type === 'IDL'"
        name="manageTalent"
        label="管理能力"
        rows="1"
        autosize
        type="textarea"
        placeholder="请填写管理能力"
        :rules="[{ required: true, message: '请填写管理能力' }]"
        required
      />

      <!-- 面试通过按钮 -->
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit"> 面试通过 </van-button>
      </div>
      <!-- 不予录用按钮 -->
      <div style="margin: 16px">
        <van-button round block type="danger" @click="cancel"> 不予录用 </van-button>
      </div>
    </van-cell-group>
  </van-form>
</template>

<style lang="scss" scoped></style>
