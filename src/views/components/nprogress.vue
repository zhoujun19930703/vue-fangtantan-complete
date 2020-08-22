<template>
  <div class="wrap" :style="{height:h+'px',background:parentBgc}">
    <div class="son" :style="{width:w,height:h+'px',background:bgc,transitionDuration: sec}"></div>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    // 宽
    w: {
      type: String | Number,
      default: "100%",
    },
    // 高
    h: {
      type: String | Number,
      default: "100%",
    },
    // 背景色
    bgc: {
      type: String,
      default: "#FFFF",
    },
    // 容器的背景色
    parentBgc: {
      type: String,
      default: "#171d26",
    },
    // 动画时间
    sec: {
      type: String,
      default: "0.5s",
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.wrap {
  width: 100%;
  .son {
    transition: all 0.5s;
  }
}
</style>
