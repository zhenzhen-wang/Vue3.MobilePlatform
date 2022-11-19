<script setup lang="ts">
import { rotateBase64Img } from '@/hooks/useImage';
import vueEsign from 'vue-esign';
import { ref, type Ref } from 'vue';
import { Toast } from 'vant';

defineProps<{ title: string }>();
const emit = defineEmits(['getImg']);

// popup显示状态
const show: Ref<boolean> = ref(false);

const bgColor = ref('rgb(235 235 235 / 60%)'); //rgb(235 235 235 / 50%)
//签名base64源码
const signPic = ref<string>();

// 清空画板
const esign = ref();
const handleReset = () => {
  esign.value.reset();
};
// 生成签字图
const handleGenerate = () => {
  esign.value
    .generate() // 使用生成器调用把签字的图片转换成为base64图片格式
    .then((res: string) => {
      const callback = (imgData: string) => {
        signPic.value = imgData;
        emit('getImg', imgData);
      };
      // 旋转签名图片
      rotateBase64Img(res, 270, callback);
      // 隐藏popup
      show.value = false;
    })
    .catch((err: string) => {
      // 画布没有签字时会执行这里提示一下
      Toast('画布没有签字' + err);
    });
};
</script>

<template>
  <van-cell :title="title" style="color: grey">
    <template #value>
      <van-button is-link type="primary" size="small" @click="show = true"> 点击签名 </van-button>
    </template>
  </van-cell>

  <!-- 签名展示区 -->
  <img
    :src="signPic"
    v-show="signPic"
    style="width: 96%; height: 200px; margin: 10px 2% 0; border-radius: 10px"
  />

  <!-- 点击签名调出此popup窗口签名 -->
  <van-popup v-model:show="show" round style="width: 95%; height: 95%; display: flex">
    <!-- 按钮群组 -->
    <div class="buttongroup">
      <van-button type="warning" @click="show = false"> 取消 </van-button>
      <van-button type="danger" @click="handleReset">清空 </van-button>
      <van-button type="primary" @click="handleGenerate"> 确定 </van-button>
    </div>

    <!-- 签名画板区域 -->
    <div class="esign">
      <vue-esign
        ref="esign"
        :width="450"
        :height="1080"
        :isCrop="false"
        :lineWidth="6"
        lineColor="#000000"
        v-model:bgColor="bgColor"
      />
    </div>
  </van-popup>
</template>

<style lang="scss" scoped>
// 手写签名按钮
.buttongroup {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  button {
    transform: rotate(90deg);
    width: 60px;
  }
}

// 设置一下签字区域的边框
.esign {
  flex: 5;
  border: solid 2px #ccc;
  align-self: center;
}
</style>
