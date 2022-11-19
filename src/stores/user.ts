import { api } from '@/api';
import { addWaterMark, getDate, zipFile } from '@/utils';
import { defineStore } from 'pinia';
import { Dialog, Notify, type UploaderFileListItem } from 'vant';
import { ref } from 'vue';

export const useIdlStore = defineStore({
  id: 'idlUser', //仓库id 唯一
  state: () => ({
    form: {
      //个人基本信息
      hr_base_info: {
        name: '',
        id_card_no: '',
        id_expire_date: '',
        telphone: '',
        birthday: '',
        sex: '',
        race: '',
        education_degree: '',
        family_address: '',
        current_address: '',
        emergency_name: '',
        emergency_tel: '',
        salary_type: '正式工',
        recruit_path: '',
        // batch_no: '',
        accept_flag: false,
        // accept_security: false,
        work_type: 'IDL', //IDL
        has_talent: true,
        has_relationship: true, //有无三等亲家属
        is_criminal: '',
        is_drug: '',
        is_evil: '',
        job_position: '',
        job_type: '',
        height: '',
        weight: '',
        marriage: '',
        mail_address: '',
      },
      //家庭成员信息
      hr_family_info: [
        {
          name: '',
          sex: '',
          kinship: '',
          job: '',
          tel: '',
        },
      ],

      //三等亲亲属
      hr_relationship: [{ company: '', name: '', relationship: '' }],

      //学历信息（目前是单个，做多个学历在附件上传方面容易有bug）
      hr_education: [
        {
          education: '',
          school: '',
          major: '',
          enrollment_date: '',
          graduation_date: '',
          graduated: '',
          // pic_src: '',
        },
      ],

      //附件信息
      hr_attachment: [
        {
          pic_name: '身份证正面',
          pic_src: '',
          file_type: 'idcard_front',
        },
        {
          pic_name: '身份证反面',
          pic_src: '',
          file_type: 'idcard_back',
        },
      ],

      //工作经历
      hr_work_experience: [
        {
          company: '',
          duty: '',
          work_fromdate: '',
          work_todate: '',
          salary: '',
          leave_reason: '',
          manager_name: '',
          tel: '',
        },
      ],

      //考试
      // hr_exam: [
      //   { lookup_code: 'AA01', result: '', score: '0' },
      //   { lookup_code: 'AA02', result: '', score: '0' },
      //   { lookup_code: 'AA03', result: '', score: '0' },
      //   { lookup_code: 'AA04', result: '', score: '0' },
      //   { lookup_code: 'AA05', result: '', score: '0' },
      // ],
    },
    phoneVerifyResult: false,
    // 临时存储，未缓存
    // （缓存talentFile后，读取只能读到第一个）
    talentFile: ref<UploaderFileListItem[][]>([]),
    // // 临时存储，未缓存，上传前从此读取毕业证书
    educationFile: ref<UploaderFileListItem[]>([]),
    // 临时存储，未缓存，用于新增删除技能，上传前从此读取技能证书
    hr_talent_attach: [
      {
        pic_name: '',
        pic_src: '',
        file_type: 'talent_certificate',
      },
    ],
    // 临时存储，未缓存，上传前从此读取手写签名
    hr_esign_attach: {
      pic_name: '手写签名',
      pic_src: '',
      file_type: 'esign',
    },
  }),
  getters: {
    // 类似于computed()
    // 技能证书数组
    // hr_talent_attach: (state) =>
    //   state.form.hr_attachment.filter((e) => e.file_type == 'talent_certificate'),
  },
  actions: {
    // 请求身份证正面信息
    async getFrontIdCardInfo(base64: string) {
      try {
        // 请求百度api接口获取身份证信息（正面）
        const res = await api.postIdCard(base64, 'front');
        const idCardInfo = JSON.parse(res);
        // console.log(idCardInfo);

        // 验证IDcard是否有风险
        // risk_type:normal-正常身份证；copy-复印件；temporary-临时身份证；screen-翻拍；unknown-其他未知情况
        if (idCardInfo.risk_type == 'unknown' || idCardInfo.risk_type == 'screen') {
          Notify('身份证照片疑似翻拍或者PS修改过,请用证件原始照片');
          return;
        }

        // 验证IDcard是否是正常的身份证正面照片
        //#region image_status:
        /*normal - 识别正常
        reversed_side - 身份证正反面颠倒
        non_idcard - 上传的图片中不包含身份证
        blurred - 身份证模糊
        other_type_card - 其他类型证照
        over_exposure - 身份证关键字段反光或过曝
        over_dark - 身份证欠曝（亮度过低）
        unknown - 未知状态 */
        //#endregion
        if (idCardInfo.image_status !== 'normal') {
          Notify('身份证识别失败');
          return;
        }

        // 1. 查询此人是否已有资料，并且资料未经HR访谈确认,有则带出他已填写的资料,即status=0
        const data = await api.getDetailByIdStatus(idCardInfo.words_result.公民身份号码.words, '0');
        //有资料，则自动带出。人员可以根据此资料修改
        if (Object.keys(data).length > 0) {
          //#region 格式化数据
          //身份证信息，格式化日期，去掉时分秒
          data.hr_base_info.birthday = data.hr_base_info.birthday.substr(0, 10);
          data.hr_base_info.id_expire_date = data.hr_base_info.id_expire_date.substr(0, 10);

          for (const value of data.hr_education) {
            //毕业日期
            value.enrollment_date = value.enrollment_date.substr(0, 10);
            value.graduation_date = value.graduation_date.substr(0, 10);
          }
          for (const value of data.hr_work_experience) {
            //工作经历日期
            value.work_fromdate = value.work_fromdate.substr(0, 10);
            value.work_todate = value.work_todate.substr(0, 10);
          }
          //拼接完整base64URL
          for (const value of data.hr_attachment) {
            value.pic_src = 'data:image/jpg;base64,' + value.pic_src;
          }
          //#endregion

          // 将查询到的数据赋值到页面
          this.form.hr_base_info = data.hr_base_info;
          this.form.hr_education = data.hr_education;
          this.form.hr_family_info = data.hr_family_info;
          this.form.hr_relationship = data.hr_relationship;
          this.form.hr_work_experience = data.hr_work_experience;
        }

        // 2. 检查此人身份证号是否有效，是否未满16周岁
        const result = await api.checkIdCard(idCardInfo.words_result.公民身份号码.words);
        // 返回值为空，即有异常，则退出
        if (!result) return;
        // {
        // 异常信息不为空，则提示信息并退出
        // Notify(msg);
        // return;
        // }

        // 3. 满足条件，则将读取的身份证信息显示到UI
        {
          // 图片加水印
          // const imgZiped = await addWaterMark(base64);
          // 压缩 await zipFile(imgZiped)
          this.form.hr_attachment[0].pic_src = base64;

          //#region 显示身份证信息到UI
          this.form.hr_base_info.name = idCardInfo.words_result.姓名.words;
          this.form.hr_base_info.id_card_no = idCardInfo.words_result.公民身份号码.words;
          this.form.hr_base_info.sex = idCardInfo.words_result.性别.words;
          const birth = idCardInfo.words_result.出生.words;
          this.form.hr_base_info.birthday =
            birth.substr(0, 4) + '-' + birth.substr(4, 2) + '-' + birth.substr(6, 2);
          this.form.hr_base_info.race = idCardInfo.words_result.民族.words;
          this.form.hr_base_info.family_address = idCardInfo.words_result.住址.words;
          //#endregion
        }
      } catch (err: any) {
        Notify(err.toString() ?? '未得到异常信息');
        return;
      }
    },

    // 请求身份证反面信息
    async getBackIdCardInfo(base64: string) {
      // 请求百度api接口获取身份证信息(反面)
      const res = await api.postIdCard(base64, 'back');
      const idCardInfo = JSON.parse(res);

      if (idCardInfo.image_status !== 'normal') {
        Notify('身份证识别失败');
        return;
      }

      //检查是否失效
      const expireDate = idCardInfo.words_result.失效日期.words;
      if (getDate('') > expireDate) {
        //this.form.hr_base_info.id_expire_date = '';
        Notify('身份证已失效');
        return;
      }

      // 有效，则给身份证反面加水印并压缩
      // 图片加水印
      const imgZiped = await addWaterMark(base64);
      // 压缩 await zipFile(imgZiped);
      this.form.hr_attachment[1].pic_src = base64;

      this.form.hr_base_info.id_expire_date =
        expireDate.substr(0, 4) + '-' + expireDate.substr(4, 2) + '-' + expireDate.substr(6, 2);
    },

    // 缓存到浏览器
    bufferInfo() {
      localStorage.setItem('resume_info', JSON.stringify(this.form));
    },

    // 从浏览器读取已缓存数据
    setInfo() {
      const data = JSON.parse(localStorage.getItem('resume_info') as string);

      this.form.hr_base_info = data.hr_base_info;
      this.form.hr_family_info = data.hr_family_info;
      this.form.hr_relationship = data.hr_relationship;
      this.form.hr_education = data.hr_education;
      this.form.hr_attachment = data.hr_attachment;
      this.form.hr_work_experience = data.hr_work_experience;
    },

    // 当点击三等亲疑问按钮后，跳出备注提示
    remarkInfo() {
      Dialog.alert({
        title: '在集团内上班的三等亲含义',
        message:
          '1.三等亲以内家属指：配偶、子女、父母、兄弟姐妹、伯叔姑舅姨、侄甥\r\n 2.集团内公司包括：昆达、旭达、研达、神达投控、汉达、神讯、汉扬、丰航\r\n  3.如有则需填写在集团任职的亲属信息',
      }).then(() => {
        // on close
      });
    },

    //#region 各成员的增删改
    // 新增删除家庭成员
    addFamilyMembers() {
      const member = { name: '', sex: '', kinship: '', job: '', tel: '' };
      this.form.hr_family_info.push(member);
    },
    delFamilyMembers() {
      this.form.hr_family_info.splice(-1, 1); //从最后一个开始删除
    },

    // 新增删除三等亲
    addRelationshipInfo() {
      const member = { company: '', name: '', relationship: '' };
      this.form.hr_relationship.push(member);
      // 如果数组不为空，将switch按钮打开
      if (this.form.hr_relationship.length > 0) this.form.hr_base_info.has_relationship = true;
    },
    delRelationshipInfo() {
      this.form.hr_relationship.splice(-1, 1);
      // 如果数组为空，则将switch按钮关闭
      if (this.form.hr_relationship.length < 1) this.form.hr_base_info.has_relationship = false;
    },
    delAllRelationship() {
      this.form.hr_relationship.splice(0); // 清空
    },

    // 新增删除工作经验
    addExperiences() {
      const member = {
        company: '',
        duty: '',
        work_fromdate: '',
        work_todate: '',
        salary: '',
        leave_reason: '',
        manager_name: '',
        tel: '',
      };
      this.form.hr_work_experience.push(member);
    },
    delExperiences() {
      this.form.hr_work_experience.splice(-1, 1); //从最后一个开始删除
    },

    // 新增删除教育信息
    addEducations() {
      const member = {
        education: '',
        school: '',
        major: '',
        enrollment_date: '',
        graduation_date: '',
        graduated: '',
        // pic_src: '',
      };
      this.form.hr_education.push(member);
    },
    delEducations() {
      this.form.hr_education.splice(-1, 1);
    },

    // 新增删除技能
    addTalentFile() {
      const member = {
        pic_name: '',
        pic_src: '',
        file_type: 'talent_certificate',
      };
      this.hr_talent_attach.push(member);
      // 如果数组不为空，将switch按钮打开
      if (this.hr_talent_attach.length > 0) this.form.hr_base_info.has_talent = true;
    },
    delTalentFile() {
      // 如果最后一个未上传图片，则不删除talentFile数组
      if (!this.hr_talent_attach.slice(-1)[0].pic_src) {
        // 从最后一个开始删除
        this.hr_talent_attach.splice(-1, 1);
      } else {
        this.hr_talent_attach.splice(-1, 1);
        this.talentFile.splice(-1, 1);
      }

      // 如果数组为空，则将switch按钮关闭
      if (this.hr_talent_attach.length < 1) this.form.hr_base_info.has_talent = false;
    },
    delAllTalentFile() {
      this.hr_talent_attach.splice(0); // 清空
      this.talentFile.splice(0);
    },

    // 获取手写签名传到hr_esign_attach
    generateEsignAttachment(base64: string) {
      this.hr_esign_attach.pic_src = base64;
    },

    // 新增attachment附件
    addAttachment(name: string, src: string, type: string) {
      this.form.hr_attachment.push({
        pic_name: name,
        pic_src: src,
        file_type: type,
      });
    },
    // 删除attachment附件
    delAttachment(type: string) {
      this.form.hr_attachment = this.form.hr_attachment.filter((e) => e.file_type !== type);
    },
    //#endregion

    // 将毕业证书及技能证书,手写签名移到attachment，便于统一上传
    copyFileToAttachment() {
      // 移除attchment中已经存在的毕业证书及技能证书
      this.delAttachment('graduate_certificate');
      this.delAttachment('talent_certificate');
      this.delAttachment('esign');
      // copy毕业证书
      for (const item of this.educationFile) {
        this.addAttachment('毕业证书', item.content as string, 'graduate_certificate');
      }
      // copy技能
      for (const item of this.hr_talent_attach) {
        // 如果pic_src不为空，则将其移至attachment中
        if (item.pic_src) {
          this.addAttachment(item.pic_name, item.pic_src, 'talent_certificate');
        }
      }
      // copy手写签名,如果pic_src不为空
      if (this.hr_esign_attach.pic_src) this.form.hr_attachment.push(this.hr_esign_attach);
    },

    // 防呆
    proofIsOk(): boolean {
      try {
        // 将毕业证书及技能证书,手写签名移到attachment，便于统一上传
        this.copyFileToAttachment();

        // 1. 身份证上传判断
        if (!this.form.hr_attachment.filter((e) => e.file_type == 'idcard_front')[0].pic_src) {
          Notify('必须上传身份证正面照片');
          return false;
        }
        if (!this.form.hr_attachment.filter((e) => e.file_type == 'idcard_back')[0].pic_src) {
          Notify('必须上传身份证反面照片');
          return false;
        }

        // 2.技能证书判断
        if (this.form.hr_base_info.has_talent) {
          for (const item of this.hr_talent_attach) {
            if (!item.pic_src) {
              // 如果技能证书为空，则报错
              Notify('打开switch按钮，则必须上传对应技能证书');
              return false;
            }
          }
        }

        // 3.毕业证书
        if (this.form.hr_education[0].graduated === 'Y' && this.educationFile.length < 1) {
          Notify('已经毕业，则必须上传毕业证书');
          return false;
        }

        // 4.手写签名
        if (!this.hr_esign_attach.pic_src) {
          Notify('必须手写签名');
          return false;
        }
      } catch (error: any) {
        Notify(error.toString());
        return false;
      }
      return true;
    },

    // 保存前，处理文件，加水印压缩
    async zipAddWater() {
      for (const item of this.form.hr_attachment) {
        // 加水印
        const imgZiped = await addWaterMark(item.pic_src);
        // 压缩
        item.pic_src = await zipFile(imgZiped);
      }
    },

    //防止has_relationship状态与hr_relationship.length长度不一致，做监听限制其保持一致
    watchRelationStatus() {
      // 如果有亲属在集团任职，则新增一笔资料
      if (this.form.hr_base_info.has_relationship && this.form.hr_relationship.length < 1) {
        this.addRelationshipInfo();
      } else if (!this.form.hr_base_info.has_relationship) {
        // 没有则清空list
        this.delAllRelationship();
      }
    },
    // 同上原理
    watchTalentStatus() {
      if (this.form.hr_base_info.has_talent && this.hr_talent_attach.length < 1) {
        this.addTalentFile();
      } else if (!this.form.hr_base_info.has_talent) {
        this.delAllTalentFile();
      }
    },
  },
});
