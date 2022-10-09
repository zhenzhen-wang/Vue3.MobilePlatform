<script setup lang="ts">
import { ref } from 'vue';
import { useParamStore } from '@/stores/parameters';
import { Notify } from 'vant';
import type { dataList } from '@/types/base-component';
import ResumeReview from '../../HrResume/Component/ResumeReview.vue';
import BaseRadioList from '../../../components/List/BaseRadioList.vue';

const onClickLeft = () => history.back();

// 获取填写页面的所有参数
const paramStore = useParamStore();

// 查询条件
const search = ref({
  name: '',
  idCardLast4Number: '', // 身份证后四位
});

// 回填的结果
const result = ref({
  companyCodeVal: '', // 公司别代码
  isAddWorkYearVal: 'N', // 是否续年资
  deptName: '', //部门名称
  character: '', // 性格
  englishTalent: '',
  computerTalent: '',
  workExperience: '',
  professionTalent: '',
  manageTalent: '',
});

// 获取满足条件的人员list
let list = ref<dataList[]>([]);
// 点击选中的人员身份证号
const checked = ref<string>('');
const loading = ref(false);

const onSubmit = (values: object) => {
  list.value = [];
  loading.value = true;
  console.log('submit', values);

  // 异步更新数据
  // setTimeout 仅做示例，真实场景中一般为 ajax 请求
  setTimeout(() => {
    // 加载状态结束
    loading.value = false;

    const data = [
      { name: '汪文渊', id: '320724199101110028', checked: false, show: false },
      { name: '张三', id: '320724199101110027', checked: false, show: false },
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

// 录用通过，参数：idcardno，status(idl:2)  与hr共用接口
// 不予录用，参数：idcardno，status(6)，type（是否删除其资料）：删  与hr共用接口
</script>

<template>
  <!-- 页面头部 -->
  <van-nav-bar title="中心主管面试" left-text="返回" left-arrow @click-left="onClickLeft" />

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
        v-model.trim="search.idCardLast4Number"
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

  <van-form @submit="onSubmit1">
    <!-- 面试记录 -->
    <van-cell-group inset :style="{ 'margin-top': '15px' }" v-show="list.length">
      <van-divider content-position="left"> 面试记录 </van-divider>

      <!-- 面试通过按钮 -->
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit"> 面试通过 </van-button>
      </div>
      <!-- 不予录用按钮 -->
      <div style="margin: 16px">
        <van-button round block type="danger"> 不予录用 </van-button>
      </div>
    </van-cell-group>
  </van-form>
</template>

<style lang="scss" scoped></style>
