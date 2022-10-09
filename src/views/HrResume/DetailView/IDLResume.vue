<script setup lang="ts">
import { Collapse, CollapseItem, Dialog, Notify } from 'vant';
import { nextTick, onBeforeMount, onUnmounted, ref, toRefs, watch } from 'vue';
import { useIdlStore } from '@/stores/user';
import { useParamStore } from '@/stores/parameters';
import { storeToRefs } from 'pinia';
import BasePicker from '@/components/Form/BasePicker.vue';
import BaseDatePicker from '@/components/Form/BaseDatePicker.vue';
import BaseEsign from '@/components/Esign/BaseEsign.vue';
import BaseField from '@/components/Form/BaseField.vue';
import AcceptCollect from '../Component/AcceptCollect.vue';
import { api } from '@/api';
import router from '@/router';

//#region 设置全局样式配置
// themeVars 内的值会被转换成对应 CSS 变量
// 比如 sliderBarHeight 会转换成 `--van-slider-bar-height`
const themeVars = {
  // 将手风琴面板的内容背景改为淡蓝色
  collapseItemContentBackgroundColor: '#1e80ff0d',
};
//#endregion

//#region 解构出面试者的基本信息
const idlStore = useIdlStore();
const { form, hr_talent_attach, talentFile, educationFile } = storeToRefs(idlStore);
const {
  hr_base_info: base,
  hr_relationship: relation,
  hr_education: education,
  hr_work_experience: work,
  hr_family_info: family,
  hr_attachment: attach,
} = toRefs(form.value);

// 获取填写页面的所有参数
const paramStore = useParamStore();
//#endregion

// 返回
const onClickLeft = () => history.back(); //router.go(-1);

//防止has_relationship状态与hr_relationship.length长度不一致，做监听限制其保持一致
watch([() => base.value.has_relationship, relation], idlStore.watchRelationStatus);
watch([() => base.value.has_talent, hr_talent_attach], idlStore.watchTalentStatus);

//#region 页面初始化信息
// 折叠面板状态，默认全部打开
const activeName = ref(['1', '2', '3', '4', '5', '6', '7', '8', '9']);

// 控制个人信息弹出框的显示与隐藏
const showPopup = ref(false);

// 加载遮罩层，全域
let globalOverlay = ref(false);

let timer: any;
// 初始化加载localstorage中的表单信息
onBeforeMount(() => {
  if (localStorage.getItem('resume_info')) idlStore.setInfo();

  // 一打开页面即打开个人信息弹出框
  // showPopup.value = true;

  // 初始化页面参数
  paramStore.initParams();

  // 定时缓存信息存放到localStorage
  timer = setInterval(() => {
    idlStore.bufferInfo();
    console.log('ok');
  }, 10 * 1000);
});
// 需要在页面销毁时，销毁定时器，否则定时器一直运作
onUnmounted(() => {
  clearInterval(timer);
});
//#endregion

//#region 附件上传：身份证/手写签名
// 限制上传文件大小
const maxSize = 4 * 1024 * 1024;
const onOversize = () => {
  Notify({ type: 'danger', message: '文件大小不能超过 4M' });
};

// 上传身份证照片-正面
const ChooseFrontIdCard = async (file: any) => {
  // 打开遮罩层
  globalOverlay.value = true;
  // 调用百度接口识别身份证读取信息
  await idlStore.getFrontIdCardInfo(file.content);

  globalOverlay.value = false;
  //setInterval(() => (globalOverlay.value = false), 3000);
};

// 上传身份证照片-反面
const ChooseBackIdCard = async (file: any) => {
  // 打开遮罩层
  globalOverlay.value = true;
  // 调用百度接口识别身份证读取信息
  await idlStore.getBackIdCardInfo(file.content);
  globalOverlay.value = false;
};

// 获取手写签名
const getImg = (val: string) => {
  idlStore.generateEsignAttachment(val);
};
//#endregion

// 表单fail，验证失败时执行，errorInfo为失败的信息数组
//  native-type="submit"，触发表单验证（验证失败触发failed事件，成功触发submit事件）
const onFailed = (errorInfo: any) => {
  Notify(errorInfo.errors[0].message);
  console.log('failed', errorInfo);
};

// 保存数据：表单submit,验证通过的时候执行（即input即picker控件已验证通过）
const onSubmit = async (values: object) => {
  console.log('submit', values);
  // 打开遮罩层
  globalOverlay.value = true;

  // TODO:数据提交前的防呆（主要判断附件是否上传）:有异常则退出，并移除loading图标
  if (!idlStore.isProofOk()) {
    globalOverlay.value = false;
    return;
  }

  // 处理附件，加水印压缩
  await idlStore.zipAddWater();

  // 保存数据
  const result = await api.saveIdlData(JSON.stringify(form.value));
  if (result) {
    // 提示异常信息
    Notify(result);
  } else {
    Dialog.alert({
      title: '保存成功',
      message: '您已成功上传您的个人简历资料。',
      theme: 'round-button',
    }).then(() => {
      // on close
      router.push('/HrResumeView'); // 返回上一层
    });
  }
  globalOverlay.value = false;
};

// TODO:手机号验证码
const sms = ref('');

const placeholder = '无需填写，由身份证上传自动带出';

//#region test
// 通过 ref 可以获取到 Form 实例并调用实例方法：重置验证信息，获取表单值等
const refForm = ref();
const clear = () => {
  idlStore.$reset(); // 重置数据
  console.log(refForm.value?.getValues()); //resetFields？
};

// 光标定位到某个输入框
const eleRef = ref();
nextTick(() => {
  eleRef.value?.focus();
});
//#endregion
</script>

<template>
  <!-- 用configprovider修改页面整体样式 -->
  <van-config-provider :theme-vars="themeVars">
    <!-- 页面头部 -->
    <van-nav-bar left-text="返回" left-arrow @click-left="onClickLeft" title="IDL电子简历">
    </van-nav-bar>

    <!-- 表单收集面试者基本信息 -->
    <van-form @submit="onSubmit" @failed="onFailed" ref="refForm" scroll-to-error>
      <!--validate-first:是否在某一项校验不通过时停止校验，scroll-to-error移动到表单验证失败的控件，accordion指手风琴折叠面板，且activeName需要是string-->
      <!-- 折叠面板 -->
      <collapse v-model="activeName">
        <!-- 全局遮罩层 -->
        <van-overlay :show="globalOverlay">
          <div class="wrapper" @click.stop>
            <van-loading class="block" type="spinner" color="white" size="60px" vertical>
              加载中,请稍后...
            </van-loading>
          </div>
        </van-overlay>

        <!-- 1：身份证上传 -->
        <collapse-item name="1">
          <template #title>
            <div><van-icon name="photograph" color="#014A94" /> 身份证上传</div>
          </template>

          <!-- 正面 -->
          <van-cell-group inset>
            <div class="resumeIdCard">
              <van-uploader
                :after-read="ChooseFrontIdCard"
                :max-size="maxSize"
                @oversize="onOversize"
              >
                <img
                  v-if="!attach[0].pic_src"
                  src="@/assets/images/card_front.png"
                  class="IDcardPhoto"
                />
                <img v-else :src="attach[0].pic_src" class="IDcardPhoto" />
              </van-uploader>
            </div>
            <p class="idcard-label">点击上传身份证正面照片</p>

            <!-- 反面 -->
            <div class="resumeIdCard">
              <van-uploader
                :after-read="ChooseBackIdCard"
                :max-size="maxSize"
                @oversize="onOversize"
              >
                <!-- 小于等于4K的图片，在build时，vue会自动将其打包成base64，以内联样式展示，assert文件夹中无实体图片 -->
                <!-- 由于将默认的src路径写入ts中时，打包不成功，故使用vif来控制图片的显示 -->
                <img
                  v-if="!attach[1].pic_src"
                  src="@/assets/images/card_back.png"
                  class="IDcardPhoto"
                />
                <img v-else :src="attach[1].pic_src" class="IDcardPhoto" />
              </van-uploader>
            </div>
            <p class="idcard-label">点击上传身份证背面照片</p>
          </van-cell-group>
        </collapse-item>

        <!-- 2：身份证信息 -->
        <collapse-item name="2">
          <template #title>
            <div><van-icon name="label" color="#014A94" /> 身份证信息</div>
          </template>

          <!-- 由身份证识别自动带出的信息，无需手动输入，但可以手动修改 -->
          <van-cell-group inset>
            <base-field v-model="base.name" label="姓名" :placeholder="placeholder" />
            <base-field
              v-model="base.id_card_no"
              label="身份证号"
              :placeholder="placeholder"
              validate-type="number"
            />
            <base-field v-model="base.sex" label="性别" :placeholder="placeholder" />
            <base-field v-model="base.birthday" label="生日" :placeholder="placeholder" />
            <base-field v-model="base.race" label="名族" :placeholder="placeholder" />
            <base-field v-model="base.family_address" label="户籍地址" :placeholder="placeholder" />
            <base-field
              v-model="base.id_expire_date"
              label="证件有效期"
              :placeholder="placeholder"
            />
          </van-cell-group>
        </collapse-item>

        <!-- 3：个人基本信息 -->
        <collapse-item name="3">
          <template #title>
            <div><van-icon name="column" color="#014A94" /> 个人基本信息</div>
          </template>

          <van-cell-group inset>
            <base-field v-model="base.job_position" label="申请职位" />
            <base-picker v-model="base.job_type" label="职位类别" :columns="paramStore.jobList" />
            <base-picker
              v-model="base.education_degree"
              label="文化程度"
              :columns="paramStore.educationList"
            />
            <base-picker
              v-model="base.recruit_path"
              label="招聘途径"
              :columns="paramStore.recruitPathList"
            />
            <base-field
              v-model="base.mail_address"
              label="邮箱"
              placeholder="用于接收offer(选填)"
              no-required
              validate-type="email"
            />

            <!-- start:手机号码验证 -->
            <base-field v-model="base.telphone" label="手机号">
              <van-button size="small" type="primary">发送验证码</van-button>
            </base-field>
            <base-field v-model="sms" label="验证码">
              <van-button size="small" type="primary">点击验证</van-button>
            </base-field>
            <!-- end:手机号码验证 -->

            <base-field v-model="base.height" label="身高" validate-type="number"> Cm </base-field>
            <base-field v-model="base.weight" label="体重" validate-type="number"> Kg </base-field>
            <base-picker
              v-model="base.marriage"
              label="婚姻状况"
              :columns="paramStore.marriageList"
            />
            <base-field v-model="base.current_address" label="现居住地址" />
            <base-field v-model="base.emergency_name" label="紧急联系人" />
            <base-field v-model="base.emergency_tel" label="紧急联系人号码" validate-type="phone" />

            <base-picker
              v-model="base.is_criminal"
              label="有无犯罪记录"
              :columns="paramStore.judgeList"
            />
            <base-picker
              v-model="base.is_drug"
              label="有无吸毒史"
              :columns="paramStore.judgeList"
            />
            <base-picker
              v-model="base.is_evil"
              label="有无参加邪教组织史"
              :columns="paramStore.judgeList"
            />
          </van-cell-group>
        </collapse-item>

        <!-- 4：家庭成员信息 -->
        <collapse-item name="4">
          <template #title>
            <div> <van-icon name="friends" color="#014A94" /> 家庭成员信息 </div>
          </template>

          <!-- 删除新增按钮 -->
          <van-cell-group inset>
            <van-cell>
              <template #title>
                <van-icon
                  name="add-o"
                  size="20"
                  style="padding-left: 88%"
                  @click="idlStore.addFamilyMembers"
                />
              </template>
              <template #right-icon>
                <van-icon name="delete-o" size="20" @click="idlStore.delFamilyMembers" />
              </template>
            </van-cell>
          </van-cell-group>

          <!-- 家庭成员detail -->
          <van-cell-group
            inset
            v-for="(item, index) in family"
            :key="index"
            style="margin-top: 10px"
          >
            <base-field v-model="item.name" label="姓名" />
            <base-picker v-model="item.kinship" label="关系" :columns="paramStore.relationList" />
            <base-picker v-model="item.sex" label="性别" :columns="paramStore.sexList" />
            <base-field v-model="item.tel" label="联系电话" validate-type="phone" />
            <base-field v-model="item.job" label="工作单位" />
          </van-cell-group>
        </collapse-item>

        <!-- 5：三等亲信息 -->
        <collapse-item name="5">
          <template #title>
            <div> <van-icon name="manager" color="#014A94" /> 三等亲信息 </div>
          </template>

          <!-- 头部操作区域 -->
          <van-cell-group inset>
            <van-field center>
              <!-- 左侧标题 -->
              <template #label>
                集团内是否有三等亲属 <van-icon name="question-o" @click="idlStore.remarkInfo" />
              </template>

              <!-- 中间的switch组件 -->
              <template #input>
                <van-switch v-model="base.has_relationship" size="20" />
              </template>

              <!-- 右侧的删除新增按钮 -->
              <template #right-icon>
                <van-cell>
                  <template #title>
                    <van-icon
                      name="add-o"
                      size="20"
                      @click="idlStore.addRelationshipInfo"
                      style="margin-right: 20px"
                    />
                  </template>
                  <template #value>
                    <van-icon name="delete-o" size="20" @click="idlStore.delRelationshipInfo" />
                  </template>
                </van-cell>
              </template>
            </van-field>
          </van-cell-group>

          <!-- 三等亲信息detail -->
          <van-cell-group
            v-for="(item, index) in relation"
            :key="index"
            style="margin-top: 10px"
            inset
          >
            <base-field v-model="item.name" label="姓名" />
            <base-picker
              v-model="item.company"
              label="公司名称"
              :columns="paramStore.groupCompanyList"
            />
            <base-field v-model="item.relationship" label="与其关系" />
          </van-cell-group>
        </collapse-item>

        <!-- 6：学历信息 -->
        <collapse-item name="6">
          <template #title>
            <div><van-icon name="invitation" color="#014A94" /> 学历信息(最高)</div>
          </template>

          <!-- 删除新增按钮，学历目前是单个，做多个学历在附件上传方面容易有bug-->
          <!-- <van-cell-group inset>
            <van-cell>
              <template #title>
                <van-icon
                  name="add-o"
                  size="20"
                  style="padding-left: 88%"
                  @click="idlStore.addEducations"
                />
              </template>
              <template #right-icon>
                <van-icon name="delete-o" size="20" @click="idlStore.delEducations" />
              </template>
            </van-cell>
          </van-cell-group> -->

          <!-- 学历信息detail -->
          <van-cell-group inset v-for="(item, index) in education" :key="index">
            <base-field v-model="item.school" label="学校名称" />
            <base-picker
              v-model="item.education"
              label="学历"
              :columns="paramStore.educationList"
            />
            <base-field v-model="item.major" label="专业" />
            <base-date-picker v-model="item.enrollment_date" label="入学时间" />
            <base-date-picker v-model="item.graduation_date" label="毕业时间" />
            <base-picker
              v-model="item.graduated"
              label="是否毕业"
              :columns="paramStore.judgeList"
            />
            <!-- 如果已经毕业，则毕业证书必须上传 -->
            <van-field label="证书上传" :required="item.graduated == 'Y' ? true : false">
              <template #input>
                <van-uploader
                  v-model="educationFile"
                  :max-size="maxSize"
                  @oversize="onOversize"
                  multiple
                  :max-count="3"
                />
              </template>
            </van-field>
          </van-cell-group>
        </collapse-item>

        <!-- 7：技能证书 -->
        <collapse-item name="7">
          <template #title>
            <div><van-icon name="coupon" color="#014A94" /> 技能证书</div>
          </template>

          <van-cell-group inset>
            <van-field label="是否有技能证书" center>
              <!-- 中间的switch组件 -->
              <template #input>
                <van-switch v-model="base.has_talent" size="20" />
              </template>

              <!-- 右侧的删除新增按钮 -->
              <template #right-icon>
                <van-cell>
                  <template #title>
                    <van-icon
                      name="add-o"
                      size="20"
                      @click="idlStore.addTalentFile"
                      style="margin-right: 20px"
                    />
                  </template>
                  <template #value>
                    <van-icon name="delete-o" size="20" @click="idlStore.delTalentFile" />
                  </template>
                </van-cell>
              </template>
            </van-field>
          </van-cell-group>

          <van-cell-group
            v-for="(item, index) in hr_talent_attach"
            :key="index"
            inset
            style="margin-top: 10px"
          >
            <base-field v-model="item.pic_name" label="证书名称" />
            <van-field label="证书上传" required>
              <template #input>
                <van-uploader
                  v-model="talentFile[index]"
                  :max-size="maxSize"
                  @oversize="onOversize"
                  multiple
                  :max-count="1"
                  :after-read="(file:any) => (item.pic_src = file.content)"
                  :before-delete="(file:any)=>{item.pic_src = '';return true;}"
                />
              </template>
            </van-field>
          </van-cell-group>
        </collapse-item>

        <!-- 8：工作经验 -->
        <collapse-item name="8">
          <!-- #1989fa -->
          <template #title>
            <div><van-icon name="wap-nav" color="#014A94" /> 工作经验</div>
          </template>

          <!-- 删除新增按钮 -->
          <van-cell-group inset>
            <van-cell>
              <template #title>
                <van-icon
                  name="add-o"
                  size="20"
                  style="padding-left: 88%"
                  @click="idlStore.addExperiences"
                />
              </template>
              <template #right-icon>
                <van-icon name="delete-o" size="20" @click="idlStore.delExperiences" />
              </template>
            </van-cell>
          </van-cell-group>

          <!-- 工作经验 detail -->
          <van-cell-group inset v-for="(item, index) in work" :key="index" style="margin-top: 10px">
            <base-field v-model="item.company" label="公司名称" />
            <base-field v-model="item.duty" label="职位" />
            <base-date-picker v-model="item.work_fromdate" label="开始时间" />
            <base-date-picker v-model="item.work_todate" label="结束时间" />
            <base-field v-model="item.manager_name" label="主管姓名" />
            <base-field v-model="item.tel" label="主管电话" validate-type="phone" />
            <base-field v-model="item.leave_reason" label="离职原因" />
            <base-field v-model="item.salary" label="薪水" validate-type="number" />
          </van-cell-group>
        </collapse-item>

        <!-- 9：手写签名 -->
        <collapse-item name="9">
          <template #title>
            <div><van-icon name="font" color="#014A94" /> 手写签名</div>
          </template>

          <!-- 手写签名组件 -->
          <van-cell-group inset>
            <base-esign title="个人签名" @getImg="getImg"></base-esign>
          </van-cell-group>
        </collapse-item>
      </collapse>

      <!-- 10:同意收集个人信息勾选框 -->
      <accept-collect v-model="showPopup" v-model:accept="base.accept_flag" />

      <!-- 提交按钮 -->
      <div style="margin: 10px">
        <van-button
          round
          block
          type="primary"
          native-type="submit"
          :style="{ 'margin-bottom': '20px' }"
        >
          提交
        </van-button>
      </div>
    </van-form>
  </van-config-provider>
</template>

<style lang="scss" scoped>
// group-inset边距设置
.van-cell-group--inset {
  margin: auto;
}

/*上传身份证照片容器*/
.resumeIdCard {
  text-align: center;
  /*margin: 20px auto;*/
}

/*上传身份证img标签样式*/
.IDcardPhoto {
  margin: 20px 0 0;
  height: 128px;
  width: 187px;
}

/*身份证上传文本label样式*/
.idcard-label {
  text-align: center;
  // font: normal bold 14px Microsoft Yahei;
  margin: 10px 0;
}

/* 设置头部标题 */
.van-nav-bar {
  margin-bottom: 0px;
}

// loading样式
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.block {
  width: 120px;
  height: 120px;
  // background-color: #fff;
}
</style>
