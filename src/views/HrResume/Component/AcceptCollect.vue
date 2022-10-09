<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  accept: boolean;
}>();

const emits = defineEmits(['update:modelValue', 'update:accept']);

const showPopup = computed({
  get: () => {
    return props.modelValue;
  },
  set: (val) => {
    emits('update:modelValue', val);
  },
});

const accept_flag = computed({
  get: () => {
    return props.accept;
  },
  set: (val) => {
    emits('update:accept', val);
  },
});

// 不同意则返回上一级路由
const notAgree = () => history.back();

// 同意，则关闭popup窗口，同时勾选同意
const agree = () => {
  showPopup.value = false;
  accept_flag.value = true;
};
</script>

<template>
  <van-cell-group>
    <van-cell>
      <template #value>
        <van-checkbox label-disabled v-model="accept_flag" shape="square" icon-size="16px">
          本人已认真阅读并同意签署<a style="color: #1989fa" @click="showPopup = true"
            >《 员工个人信息收集告知同意书》 </a
          >，且以上所有信息真实有效，如有隐瞒，接受开出处分，录用后，若发生重大舞弊行为，所造成一切后果由本人承担，三等亲家属将负以连带责任，与公司无关。
        </van-checkbox>
      </template>
    </van-cell>
    <van-popup
      v-model:show="showPopup"
      round
      :close-on-click-overlay="false"
      style="height: 95%; width: 95%; display: flex; flex-direction: column"
    >
      <h3 style="text-align: center; line-height: 40px">个人信息收集告知同意书</h3>
      <div style="margin: 15px; overflow: auto">
        <strong>
          昆达电脑科技(昆山)有限公司（下称本公司）因劳动人力资源管理需要收集处理入职员工的个人信息，根据《中华人民共和国个人信息保护法》《中华人民共和国网络安全法》等相关法规，特告知如下，请您仔细阅读并理解文本件全部内容之后，决定是否同意本公司收集和处理您的个人信息。
        </strong>
        <br /><br />

        <strong>第1条</strong>
        鉴于本公司考勤管理方式、新冠疫情防控需要、薪资支付、保險事務、公司信息传达联系等方面原因，
        需要收集处理员工以下个人信息，包括并不限于与确定自然人相关的生物识别、位置、行为等信息，如姓名、性别、出生日期、身份证号、学历、工作经历、薪资入账银行账号、住址、人脸识别、指纹识别、医疗健康状况、行踪轨迹、特定身份、家庭成员、手机号码、家庭成员、緊急聯繫人联系方式、电子邮箱、社交帳號(如微信,
        Line, Facebook, Twitter …号)及其他信息。
        <br /><br />

        <strong>第2条</strong>
        本公司收集处理的员工个人信息目的仅用于本公司与员工之间的人力资源管理活动。
        <br /><br />

        <strong>第3条</strong>
        本公司是台湾神达集团在中国大陆投资的独资子公司，鉴于集团需要对各子公司的人力資源信息进行统筹管理，故本公司收集的员工个人信息将会提供给台湾神达集团属下包括并不限于神达电脑股份有限公司、神达数位科技股份有限公司、神雲科技股份有限公司及其他神达集团关联公司。
        <br /><br />

        <strong>第4条</strong>
        本公司收集的个人信息储存和使用期限自从收集日开始一直到劳动关系终止后两年为止，期满后本公司将主动删除，不再保留和存储相关员工的个人信息。
        <br /><br />

        <strong>第5条</strong>
        如您对本公司收集您的上述个人信息有异议，您可以拒绝签署本同意书，本公司将删除已收集的您的所有信息。
        如您同意签署此同意书，即表示已仔细阅读并理解以上所有事项，同意本公司对您个人信息的收集和使用。
        <br /><br />

        <strong>第6条</strong>
        若您对本告知同意书的内容、执行有其它疑问、建议、意见或需查阅、复制、更正、补充个人信息的，也欢迎与本公司HR联系，HR联系人：杜佩佩
        电话：57367777+2816。
        <br /><br />
      </div>
      <div style="margin: 16px; flex: 1">
        <van-button round block type="primary" @click="agree"> 同意收集 </van-button>
        <van-button round block type="danger" style="margin-top: 16px" @click="notAgree">
          不同意
        </van-button>
      </div>
    </van-popup>
  </van-cell-group>
</template>

<style lang="scss" scoped>
strong {
  font-weight: bold;
}
</style>
