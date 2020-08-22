<template>
  <div class="wrap">
    <!-- 进度条 -->
    <nprogress :h="4" :w="npgressW" bgc="rgba(255, 255, 255, 0.8)" parentBgc="#171d26"/>
    <div class="title"></div>
    <div class="stack-wrapper">
      <stack
        ref="stack"
        :pages="someList"
        :stackinit="stackinit"
        @progressHandle="progressHandle"
        @change="changeHandel"
        :like.sync="like"
      ></stack>
    </div>
    <div class="controls">
      <div class="left">
        <div class="button" @click="prev">
          <img src="../../assets/no_like.png" alt :style="{width:!like ? radioW+'px' : '54px'}"/>
        </div>
        <span>不喜欢</span>
      </div>
      <div class="left">
        <div class="button" @click="next">
          <img src="../../assets/like.png" :style="{width:like ? radioW+'px' : '54px'}" alt/>
        </div>
        <span>喜欢</span>
      </div>
    </div>
  </div>
</template>
<script>
import stack from './stack.vue'
import nprogress from './nprogress.vue'
import { api_getImgList } from '../../api'

export default {
  // el: "#stack",
  data () {
    return {
      like: true, //显示喜欢不喜欢的按钮
      npgressW: '0%', //滑动图片的进度
      someList: [], //图片集合
      radioW: 54, //底部喜欢不喜欢的宽度
      stackinit: {
        visible: 3,
      },
    }
  },
  props: {
    tabIndex: {
      type: Number,
      default: 2,
    },
  },
  mounted () {
    // 获取图片列表
    this.getImgList()
  },
  components: {
    stack,
    nprogress,
  },
  methods: {
    getImgList () {
      this.$ajax(api_getImgList, {}).then((res) => {
        console.log('请求结果', res)
        if (res.code == 200) {
          let result = res.result
          result.filter((v) => {
            v.progress = 0
            v.opacity = 1
          })
          this.someList = result
        }
      })
    },
    prev () {
      this.$refs.stack.$emit('prev')
    },
    next () {
      this.$refs.stack.$emit('next')
    },
    // 进度条
    progressHandle (pageGress) {
      // 更新进度条
      console.log('进度条', pageGress)
      this.npgressW = pageGress + '%'
      if (pageGress == 100) {
        // 最后一张跳转页面
        this.$emit('update:show', 3)
      }
    },
    // 图片滑动
    changeHandel (label, idx, progess) {
      if (label == 'opacity') {
        this.$set(this.someList[idx], label, progess)
        return
      }
      // 控制爱心的大小
      if (progess > 0.8) {
        this.radioW = 54 * 1.5
      } else if (progess > 0.6) {
        this.radioW = 54 * 1.4
      } else if (progess > 0.3) {
        this.radioW = 54 * 1.2
      } else {
        this.radioW = 54
      }
      console.log('progess', progess, this.radioW, this.like)
      this.$set(this.someList[idx], label, progess * 2)
    },
  },
}
</script>
<style lang="scss" scoped>
.wrap {
  .title {
    height: 140px;
  }
}

.stack-wrapper {
  margin: 0 auto;
  position: relative;
  z-index: 1000;
  width: 620px;
  height: 880px;
  padding: 0;
  list-style: none;
  pointer-events: none;
  // overflow: hidden;
  // border-radius: 20px;
}

.controls {
  margin-top: 100px;
  display: flex;
  padding: 0px 146px;
  align-items: center;
  justify-content: space-between;

  .left {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .button {
    width: 110px;
    height: 110px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background: #ffffff;

    img {
      width: 54px;
      // height: 46px;
      height: auto;
      max-width: 100px;
      transition: all 0.5s;
    }
  }

  span {
    margin-top: 20px;
    font-family: "PingFangSC-Regular,PingFang SC";
    font-size: 26px;
    color: rgba(255, 255, 255, 0.6);
  }
}
</style>
