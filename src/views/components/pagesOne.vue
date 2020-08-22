<template>
  <div class="wrap">
    <div class="title">
      <div class="f1">我家适合什么风格？</div>
      <div class="f2">人工智能小虎AI更懂你</div>
    </div>
    <div class="center">
      <img class="img" src="../../assets/login_icon.png" alt />
      <div class="in" v-for="(label, idx) in inArr" :key="inKey[idx]" :class="'in' + idx">
        <i></i>
        <span>{{ label }}</span>
      </div>
      <div class="out" v-for="(label, idx) in outArr" :key="outKey[idx]" :class="'out' + idx">
        <i></i>
        <span>{{ label }}</span>
      </div>
    </div>
    <div class="bottom">
      <div class="avater">
        <img class="image" :src="item.user_img" alt v-for="(item, idx) in avaterArr" :key="idx" />
      </div>
      <div class="text">
        累计服务
        <span>{{ num }}</span>
        次风险服务
      </div>
      <div class="button">
        <button @click="goTest">开始测试</button>
      </div>
    </div>
  </div>
</template>

<script>
import shortId from "shortid";
export default {
  props: {
    tabIndex: {
      type: Number,
      default: 2,
    },
  },
  mounted() {
    this.inKey = this.inArr.map((v) => shortId.generate());
    this.outKey = this.outArr.map((v) => shortId.generate());
  },
  data() {
    return {
      num: 786969,
      avaterArr: [
        {
          user_img:
            "https://wx.qlogo.cn/mmopen/vi_32/NzURjl5c3vSUFxrNjov05eRyhyc7U2bvMCSzjUuGpwib9yUH013OG4UMHic6bliaEpe5ibqrw21Wdm46ZObg3TJChw/132",
        },
        {
          user_img:
            "https://img.xiaohongshu.com/avatar/5cb5bfb7f7756c00014a54e6.jpg@750w_750h_92q_1e_1c_1x.jpg",
        },
        {
          user_img: "https://hjapi.51hejia.com/mmexport1592376066582.jpg",
        },
        {
          user_img:
            "https://hjapi.51hejia.com/8266fce0-ffd7-4258-94f3-0068595d883e.jpg",
        },
        {
          user_img: "https://userimg.51hejia.com/user_default_img.png",
        },
        {
          user_img: "https://hjapi.51hejia.com/mmexport1592376066582.jpg",
        },
      ],
      inArr: ["现代极简", "潮流混搭", "欧式豪华", "其他", "日式"],
      outArr: [
        "日式",
        "现代简约",
        "中式现代",
        "工业风",
        "欧式",
        "地中海",
        "现代简约",
        "日式",
        "地中海",
        "美欧风",
        "北欧极简",
      ],
      inKey: [],
      outKey: [],
    };
  },
  methods: {
    goTest() {
      this.$emit("update:show", 2);
    },
  },
};
</script>

<style lang="scss" scoped>
@keyframes myfirst {
  0% {
    background: rgba(255, 166, 176, 0.5);
  }
  25% {
    background: rgba(255, 166, 176, 1);
  }
  50% {
    background: rgba(255, 166, 176, 0.5);
  }
  100% {
    background: rgba(255, 166, 176, 1);
  }
}
.wrap {
  padding-top: 100px;
  .title {
    width: 100%;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .f1 {
      font-size: 44px;
      font-family: "PingFangSC-Medium, PingFang SC";
      font-weight: bold;
    }
    .f2 {
      font-size: 28px;
      font-family: "PingFangSC-Regular, PingFang SC";
      margin-top: 14px;
    }
  }
  .center {
    margin: 80px auto 120px;
    width: 536px;
    height: 534px;
    background-image: url("../../assets/background.png");
    background-repeat: no-repeat;
    background-size: 536px 534px;
    position: relative;
    .img {
      width: 118px;
      height: 124px;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .in,
    .out {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: absolute;
      i {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        animation: myfirst 4s ease infinite alternate;
      }
      span {
        margin-top: 6px;
        font-size: 10px;
        font-family: "PingFangSC-Regular,PingFang SC";
        font-weight: 400;
        color: rgba(255, 255, 255, 1);
        font-size: 20px;
      }
    }
    .in {
      &.in0 {
        right: 202px;
        top: 120px;
      }
      &.in1 {
        right: 72px;
        top: 264px;
      }
      &.in2 {
        right: 174px;
        bottom: 104px;
      }
      &.in3 {
        left: 152px;
        top: 364px;
      }
      &.in4 {
        left: 110px;
        top: 192px;
      }
    }
    .out {
      &.out0 {
        left: 282px;
        top: 6px;
      }
      &.out1 {
        right: 74px;
        top: 50px;
      }
      &.out2 {
        right: -8px;
        top: 165px;
      }
      &.out3 {
        right: -10px;
        top: 336px;
      }
      &.out4 {
        right: 72px;
        top: 436px;
      }
      &.out5 {
        bottom: -28px;
        left: 280px;
      }
      &.out6 {
        left: 54px;
        bottom: 42px;
      }
      &.out7 {
        left: -12px;
        top: 320px;
      }
      &.out8 {
        left: -16px;
        top: 210px;
      }
      &.out9 {
        left: 24px;
        top: 104px;
      }
      &.out10 {
        left: 120px;
        top: 22px;
      }
    }
  }
  .bottom {
    .avater {
      width: 400px;
      // border: 1px solid red;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      .image {
        width: 50px;
        height: 50px;
        overflow: hidden;
        border-radius: 50%;
        border: 2px solid rgba(255, 255, 255, 1);
        box-sizing: border-box;
        display: block;
        margin-left: -6px;
      }
    }
    .text {
      font-family: "PingFangSC-Regular,PingFang SC";
      font-size: 26px;
      line-height: 36px;
      color: #ffffff;
      text-align: center;
      margin-top: 18px;
      span {
        font-size: 30px;
        color: #ff3047;
      }
    }
    .button {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      margin-top: 30px;
    }
    button {
      width: 640px;
      height: 90px;
      background: #ff3047;
      color: #ffffff;
      font-size: 34px;
      font-family: "PingFangSC-Medium,PingFang SC";
      font-weight: 500;
      text-align: center;
      border: none;
      border-radius: 10px;
    }
  }
}
</style>
