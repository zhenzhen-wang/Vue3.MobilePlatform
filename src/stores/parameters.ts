import { api } from '@/api';
import { defineStore } from 'pinia';

// interface Parameters {
//   recruitPathList: string[];
//   groupCompanyList: string[];
// }

export const useParamStore = defineStore({
  id: 'parameters', //仓库id 唯一
  state: (): any => ({
    recruitPathList: [], //['BOSS直聘', '前程無憂', '智聯招聘', '校招', '人才市場', '獵聘網', '內薦'],
    groupCompanyList: [],
    sexList: ['男', '女'],
    relationList: ['父亲', '母亲', '夫妻', '子女', '兄弟姐妹'],
    judgeList: ['Y', 'N'],
    salaryList: ['正式工', '短期工'],
    batchList: ['', 'A', 'B', 'C', 'D'],
    educationList: ['研究生', '本科', '大专', '高中', '中专', '初中及初中以下'],
    jobList: [], //['人资', '物流', 'MIS', '业务', '资财', '财会'],
    marriageList: ['未婚', '已婚', '离婚'],
    workTypeList: ['IDL', 'DL'],
    salaryTypeList: ['正式工', '临时工'],
    companyCodeList: ['MKL', 'MISK'],

    /**
     * 0： 面试者已填好简历，待HR审核
     * 1： HR已审核，待面试
     * 2： 已面试，还可以继续复试，待录用（IDL特有，DL无此状态）
     * 3： 已录用
     * **/
    auditStatusList: [
      // picker里面默认展示键text的值
      // values必须是数组，当栏位为数值时不可以用values定义
      { text: '待审核', value: '0' },
      { text: '已审核', value: '1,2,3,4,5,6' }, //为了方便查询到这些状态人员，将其状态改为0，方便二次填写或者修改
    ],
    interviewStatusList: [
      { text: '待面试', value: '1,2' },
      { text: '已录用', value: '3' },
    ],
    idlEmployStatusList: [
      { text: '待录用', value: '2' },
      { text: '已录用', value: '3' },
      { text: '未录用', value: '6' },
    ],
    // 自定义label名，当后台返回的数组中label名称不是text时，可以用此来修改
    customFieldName: {
      text: 'team',
      // children: 'values',
    },
  }),
  getters: {
    // 类似于computed()
    // doubleCount: (state) => state.counter * 2
  },
  actions: {
    async initParams() {
      this.recruitPathList = await api.getRecruitPath('RecruitPath', 'I'); //.then 可以获取请求的response
      this.jobList = await api.getRecruitPath('JobType', 'I');
      this.groupCompanyList = await api.getRecruitPath('Company', 'A');
    },
  },
});
