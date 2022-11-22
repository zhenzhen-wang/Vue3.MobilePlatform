<script setup lang="ts">
import { Collapse, CollapseItem, Dialog } from 'vant';
import { onUpdated, ref } from 'vue';
import { api } from '@/api';
// import { storeToRefs } from 'pinia';

// 父组件传过来的人员person_id
const props = defineProps<{ id: string }>();

// 面板状态
const activeName = ref(['1', '2', '3', '4', '5', '6', '7', '8']);

//#region 设置全局样式配置
// themeVars 内的值会被转换成对应 CSS 变量
// 比如 sliderBarHeight 会转换成 `--van-slider-bar-height`
const themeVars = {
  // 将手风琴面板的内容背景改为淡蓝色
  collapseItemContentBackgroundColor: '#1e80ff0d',
};
//#endregion

type UploadFile = {
  url: string;
  isImage: boolean;
};

type AttachFile = {
  pic_src: UploadFile[];
  pic_name: string;
};

const idList = ref<UploadFile[]>([]);
const attachList = ref<AttachFile[]>([]);

// 骨架屏loading
const loading = ref(true);

let base = ref();
let relation = ref();
let education = ref();
let work = ref();
let family = ref();
let comment = ref();

const initialData = async () => {
  idList.value = [];

  // 根据id号获得详细信息
  const data = await api.getDetailByIdStatus(props.id, '');

  //#region 格式化查询到的数据
  //身份证信息，格式化日期，去掉时分秒
  data.hr_base_info.birthday = data.hr_base_info.birthday?.substr(0, 10);
  data.hr_base_info.id_expire_date = data.hr_base_info.id_expire_date?.substr(0, 10);

  for (const value of data.hr_education) {
    //毕业日期
    value.enrollment_date = value.enrollment_date?.substr(0, 10);
    value.graduation_date = value.graduation_date?.substr(0, 10);
  }
  for (const value of data.hr_work_experience) {
    //工作经历日期
    value.work_fromdate = value.work_fromdate?.substr(0, 10);
    value.work_todate = value.work_todate?.substr(0, 10);
  }
  //拼接完整base64URL
  for (const value of data.hr_attachment) {
    value.pic_src = 'data:image/jpg;base64,' + value.pic_src;
  }
  //#endregion

  // 根据id号查询是否在黑名单
  const res = await api.getBlackInfo(props.id);
  //当被选中且有黑名单信息，则跳出黑名单提示框
  //如果有黑名单信息，'黑名單:-'后面会接着一串黑名单信息：2022/04/13 12:40:08mhr_msl_ps_employee_hei
  if (res.indexOf('黑名單:-舊工號') < 0) Dialog({ message: '此人在黑名单，请考量！' });

  base.value = data.hr_base_info;
  relation.value = data.hr_relationship;
  education.value = data.hr_education;
  work.value = data.hr_work_experience;
  family.value = data.hr_family_info;
  comment.value = data.hr_manager_comment;

  // 将身份证照片放入idList数组，其余的放入attachList
  for (const item of data.hr_attachment) {
    if (item.file_type == 'idcard_front' || item.file_type == 'idcard_back') {
      idList.value.push({ url: item.pic_src, isImage: true });
    } else {
      attachList.value.push({
        pic_src: [{ url: item.pic_src, isImage: true }],
        pic_name: item.pic_name,
      });
    }
  }
  loading.value = false;
};
initialData();

onUpdated(() => {
  initialData();
});
</script>

<template>
  <van-config-provider :theme-vars="themeVars">
    <van-nav-bar title="IDL简历预览" :border="false" />
    <van-skeleton title :row="10" round :loading="loading">
      <!-- 表单收集面试者基本信息 -->
      <van-form>
        <!-- 手风琴折叠面板 -->
        <collapse v-model="activeName">
          <!-- 1：身份证信息 -->
          <collapse-item name="1">
            <template #title>
              <div><van-icon name="graphic" color="#014A94" /> 身份证信息</div>
            </template>

            <!-- 由身份证识别自动带出的信息，无需手动输入，但可以手动修改 -->
            <van-cell-group>
              <van-cell title="身份照片" center>
                <template #value>
                  <van-uploader
                    :style="{ flex: 2 }"
                    name="talentFile"
                    v-model="idList"
                    multiple
                    :max-count="2"
                    :deletable="false"
                  />
                </template>
              </van-cell>
              <van-cell title="姓名" :value="base.name" />
              <van-cell title="身份证号" :value="base.id_card_no" />
              <van-cell title="性别" :value="base.sex" />
              <van-cell title="生日" :value="base.birthday" />
              <van-cell title="名族" :value="base.race" />
              <van-cell title="户籍地址" :value="base.family_address" />
              <van-cell title="身份证有效期" :value="base.id_expire_date" />
            </van-cell-group>
          </collapse-item>

          <!-- 2：个人基本信息 -->
          <collapse-item name="2">
            <template #title>
              <div><van-icon name="column" color="#014A94" /> 个人基本信息</div>
            </template>

            <van-cell-group>
              <van-cell title="申请职位" :value="base.job_position" />
              <van-cell title="职位类别" :value="base.job_type" />
              <van-cell title="文化程度" :value="base.education_degree" />
              <van-cell title="招聘途径" :value="base.recruit_path" />
              <van-cell title="手机号" :value="base.telphone" />
              <van-cell title="邮箱" :value="base.mail_address" />
              <van-cell title="身高" :value="base.height" />
              <van-cell title="体重" :value="base.weight" />
              <van-cell title="婚姻状况" :value="base.marriage" />
              <van-cell title="现居住地址" :value="base.current_address" />
              <van-cell title="紧急联系人" :value="base.emergency_name" />
              <van-cell title="紧急联系人号码" :value="base.emergency_tel" />
              <van-cell title="是否有犯罪记录" :value="base.is_criminal" />
              <van-cell title="是否有吸毒史" :value="base.is_drug" />
              <van-cell title="是否有参加邪教组织史" :value="base.is_evil" />
            </van-cell-group>
          </collapse-item>

          <!-- 3：家庭成员信息 -->
          <collapse-item name="3" v-if="family.length">
            <template #title>
              <div> <van-icon name="friends" color="#014A94" /> 家庭成员信息 </div>
            </template>
            <!-- 家庭成员detail -->
            <van-cell-group v-for="(item, index) in family" :key="index" style="margin-top: 5px">
              <van-cell title="姓名" :value="item.name" />
              <van-cell title="关系" :value="item.kinship" />
              <van-cell title="性别" :value="item.sex" />
              <van-cell title="联系电话" :value="item.tel" />
              <van-cell title="工作单位" :value="item.job" />
            </van-cell-group>
          </collapse-item>

          <!-- 4：三等亲信息 -->
          <collapse-item name="4" v-if="relation.length">
            <template #title>
              <div> <van-icon name="manager" color="#014A94" /> 三等亲信息 </div>
            </template>

            <van-cell-group v-for="(item, index) in relation" :key="index" style="margin-top: 5px">
              <van-cell title="姓名" :value="item.name" />
              <van-cell title="公司名称" :value="item.company" />
              <van-cell title="关系" :value="item.relationship" />
            </van-cell-group>
          </collapse-item>

          <!-- 5：学历信息 -->
          <collapse-item name="5" v-if="education.length">
            <template #title>
              <div><van-icon name="invitation" color="#014A94" /> 学历信息(最高)</div>
            </template>

            <!-- 学历信息detail -->
            <van-cell-group v-for="(item, index) in education" :key="index" style="margin-top: 5px">
              <van-cell title="学校名称" :value="item.school" />
              <van-cell title="学历" :value="item.education" />
              <van-cell title="专业" :value="item.major" />
              <van-cell title="入学时间" :value="item.enrollment_date" />
              <van-cell title="毕业时间" :value="item.graduation_date" />
              <van-cell title="是否毕业" :value="item.graduated" />
            </van-cell-group>
          </collapse-item>

          <!-- 6：工作经验 -->
          <collapse-item name="6" v-if="work.length">
            <!-- #1989fa -->
            <template #title>
              <div><van-icon name="wap-nav" color="#014A94" /> 工作经验</div>
            </template>

            <!-- 工作经验 detail -->
            <van-cell-group v-for="(item, index) in work" :key="index" style="margin-top: 5px">
              <van-cell title="主管姓名" :value="item.manager_name" />
              <van-cell title="公司姓名" :value="item.company" />
              <van-cell title="职位" :value="item.duty" />
              <van-cell title="开始时间" :value="item.work_fromdate" />
              <van-cell title="结束时间" :value="item.work_todate" />
              <van-cell title="主管姓名" :value="item.manager_name" />
              <van-cell title="主管电话" :value="item.tel" />
              <van-cell title="离职原因" :value="item.leave_reason" />
              <van-cell title="薪水" :value="item.salary" />
            </van-cell-group>
          </collapse-item>

          <!-- 7：附件预览 -->
          <collapse-item name="7">
            <template #title>
              <div><van-icon name="photo" color="#014A94" /> 附件</div>
            </template>

            <van-cell-group
              v-for="(item, index) in attachList"
              :key="index"
              style="margin-top: 5px"
            >
              <!-- <van-cell title="名称" :value="item.pic_name" /> -->

              <van-cell :title="item.pic_name" center>
                <template #value>
                  <van-uploader
                    name="talentFile"
                    v-model="item.pic_src"
                    multiple
                    :max-count="1"
                    :deletable="false"
                  />
                </template>
              </van-cell>
            </van-cell-group>
          </collapse-item>

          <!-- 8：主管评价 -->
          <collapse-item name="8">
            <template #title>
              <div><van-icon name="invitation" color="#014A94" /> 主管评价</div>
            </template>

            <van-cell-group v-for="(item, index) in comment" :key="index" style="margin-top: 5px">
              <van-cell title="主管" :value="item.manager_name" />
              <van-cell title="录用公司" :value="item.company" />
              <van-cell title="录用部门" :value="item.dept_name" />
              <van-cell title="是否需年资" :value="item.add_work_year" />
              <van-cell title="性格特征" :value="item.character" />
              <van-cell title="外语能力" :value="item.english_talent" />
              <van-cell title="电脑能力" :value="item.computer_talent" />
              <van-cell title="工作经历" :value="item.work_experience" />
              <van-cell title="专业能力" :value="item.profession_talent" />
              <van-cell title="管理能力" :value="item.manage_talent" />
              <!-- <van-cell title="续年资" :value="item.out_work_year" v-if="item.add_work_year" /> -->
            </van-cell-group>
          </collapse-item>
        </collapse>
      </van-form>
    </van-skeleton>
  </van-config-provider>
</template>

<style lang="scss" scoped>
// 设置头部标题
.van-nav-bar {
  margin-bottom: 10px;
}

// 如果想修改vant自带的样式，1：css用'父类'>>>'想要修改的子类'  2: less及scss用'/deep/'或者'::v-deep'
:deep(.van-cell__value) {
  flex: 2;
}
</style>
