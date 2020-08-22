<template>
  <ul class="stack">
    <li
      class="stack-item"
      v-for="(item, index) in pages"
      :key="index"
      :style="[transformIndex(index), transform(index)]"
      @touchmove.stop.capture.prevent="touchmove"
      @touchstart.stop.capture.prevent="touchstart"
      @touchend.stop.capture.prevent="touchend"
      @touchcancel.stop.capture.prevent="touchend"
      @mousedown.stop.capture.prevent="touchstart"
      @mouseup.stop.capture.prevent="touchend"
      @mousemove.stop.capture.prevent="touchmove"
      @mouseout.stop.capture.prevent="touchend"
      @webkit-transition-end="onTransitionEnd(index)"
      @transitionend="onTransitionEnd(index)"
    >
      <div class="icon" :style="{ opacity: item.progress }">
        <img v-if="!like" src="../../assets/no_like.png" alt />
        <img v-else src="../../assets/like.png" alt />
      </div>
      <div class="img_wrap">
        <img :src="item.url" :alt="index" :style="{ opacity: item.opacity }" />
      </div>
    </li>
  </ul>
</template>
<script>
import detectPrefixes from "../../utils/detect-prefixes.js";
import Bus from '../../utils/bus'
export default {
  props: {
    stackinit: {
      type: Object,
      default: [],
    },
    pages: {
      type: Array,
      default: {},
    },
    like: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      basicdata: {
        start: {},
        end: {},
      },
      temporaryData: {
        prefixes: detectPrefixes(),
        offsetY: "",
        poswidth: 0,
        posheight: 0,
        lastPosWidth: "",
        lastPosHeight: "",
        lastZindex: "",
        rotate: 0,
        lastRotate: 0,
        visible: this.stackinit.visible || 3,
        tracking: false,
        animation: false,
        currentPage: this.stackinit.currentPage || 0,
        opacity: 1,
        lastOpacity: 0,
        swipe: false,
        zIndex: 10,
      },
      limit: false, // 限制上下滑动能否划出范围
      choosedList: [] // 划过的列表，里面装着喜欢和不喜欢的图片信息
    };
  },
  computed: {
    // 划出面积比例
    offsetRatio() {
      let width = this.$el.offsetWidth;
      let height = this.$el.offsetHeight;
      let offsetWidth = width - Math.abs(this.temporaryData.poswidth);
      let offsetHeight = height - Math.abs(this.temporaryData.posheight);
      let ratio = 1 - (offsetWidth * offsetHeight) / (width * height) || 0;
      // console.log("offsetRatio", ratio);
      return ratio > 1 ? 1 : ratio;
    },
    // 划出宽度比例
    offsetWidthRatio() {
      let width = this.$el.offsetWidth;
      let offsetWidth = width - Math.abs(this.temporaryData.poswidth);
      let ratio = 1 - offsetWidth / width || 0;
      return ratio;
    },
  },
  mounted() {
    // 绑定事件
    this.$on("next", () => {
      this.next();
    });
    this.$on("prev", () => {
      this.prev();
    });
    document.addEventListener("touchmove", (e) => {
      e.preventDefault();
    });
  },
  methods: {
    touchstart(e) {
      if (this.temporaryData.tracking) {
        return;
      }
      // 是否为touch
      if (e.type === "touchstart") {
        if (e.touches.length > 1) {
          this.temporaryData.tracking = false;
          return;
        } else {
          // 记录起始位置
          this.basicdata.start.t = new Date().getTime();
          this.basicdata.start.x = e.targetTouches[0].clientX;
          this.basicdata.start.y = e.targetTouches[0].clientY;
          this.basicdata.end.x = e.targetTouches[0].clientX;
          this.basicdata.end.y = e.targetTouches[0].clientY;
          // offsetY在touch事件中没有，只能自己计算
          this.temporaryData.offsetY =
            e.targetTouches[0].pageY - this.$el.offsetParent.offsetTop;
        }
        // pc操作
      } else {
        this.basicdata.start.t = new Date().getTime();
        this.basicdata.start.x = e.clientX;
        this.basicdata.start.y = e.clientY;
        this.basicdata.end.x = e.clientX;
        this.basicdata.end.y = e.clientY;
        this.temporaryData.offsetY = e.offsetY;
      }
      this.temporaryData.tracking = true;
      this.temporaryData.animation = false;
    },
    touchmove(e) {
      // 记录滑动位置
      if (this.temporaryData.tracking && !this.temporaryData.animation) {
        this.limit = false;
        // 限制往上、往下拖动的范围
        // 获取可视区的高度
        let clientHeight = document.body.clientHeight;
        // 纵向拖动的距离
        let dragHeightDiff =
          (e.type === "touchmove" ? e.targetTouches[0].clientY : e.clientY) -
          this.basicdata.start.y;
        // 盒子的高度
        let dragBoxHeight = e.target.scrollHeight;
        // 盒子距离盒子顶部的距离（初始值）
        let dragTopNum = e.target.scrollTop;
        // 计算盒子拖动后距离顶部的距离
        let topNum = dragTopNum + dragHeightDiff;
        // 计算盒子拖动后超过底部的距离
        let topBottom =
          dragTopNum + dragHeightDiff + dragBoxHeight - clientHeight;
        // 限制盒子往上、往下只能拖动二分之一的距离
        if ((topNum < 0 && Math.round(Math.abs(topNum)) > Math.round(dragBoxHeight / 2)) ||
          (topBottom > 0 && Math.round(Math.abs(topBottom)) > Math.round(dragBoxHeight / 2))) {
          let dragWidthNum = (e.type === "touchmove" ? e.targetTouches[0].clientX : e.clientX) - this.basicdata.start.x;
          if (Math.abs(dragWidthNum) <= 50) {this.limit = true;}
          return false;
        }
        this.limit = false;
        // 拖拽
        if (e.type === "touchmove") {
          e.preventDefault();
          this.basicdata.end.x = e.targetTouches[0].clientX;
          this.basicdata.end.y = e.targetTouches[0].clientY;
        } else {
          e.preventDefault();
          this.basicdata.end.x = e.clientX;
          this.basicdata.end.y = e.clientY;
        }
        // 计算滑动值
        this.temporaryData.poswidth = this.basicdata.end.x - this.basicdata.start.x;
        this.temporaryData.posheight = this.basicdata.end.y - this.basicdata.start.y;
        // 获取盒子的宽度
        let targetw = e.target.offsetWidth;
        let targeth = e.target.offsetHeight;
        // 显示喜欢不喜欢的按钮
        // this.like = this.temporaryData.poswidth < 0 ? false : true;
        this.$emit(
          "update:like",
          this.temporaryData.poswidth < 0 ? false : true
        );
        this.$emit(
          "change",
          "progress",
          this.temporaryData.currentPage,
          Math.abs(this.temporaryData.poswidth) / targetw
        );
        let rotateDirection = this.rotateDirection();
        let angleRatio = this.angleRatio();
        this.temporaryData.rotate =
          rotateDirection * this.offsetWidthRatio * 15 * angleRatio;
      }
    },
    touchend(e) {
      this.$emit("change", "progress", this.temporaryData.currentPage, 0);
      this.temporaryData.tracking = false;
      this.temporaryData.animation = true;
      // 滑动结束，触发判断
      // 判断划出面积是否大于0.4
      if (this.offsetRatio >= 0.4 && !this.limit) {
        // 计算划出后最终位置
        let ratio = Math.abs(
          this.temporaryData.posheight / this.temporaryData.poswidth
        );
        this.temporaryData.poswidth =
          this.temporaryData.poswidth >= 0
            ? this.temporaryData.poswidth + 200
            : this.temporaryData.poswidth - 200;
        this.temporaryData.posheight =
          this.temporaryData.posheight >= 0
            ? Math.abs(this.temporaryData.poswidth * ratio)
            : -Math.abs(this.temporaryData.poswidth * ratio);
        this.temporaryData.opacity = 0;
        this.temporaryData.swipe = true;
        this.nextTick();
        // 不满足条件则滑入
      } else {
        this.temporaryData.poswidth = 0;
        this.temporaryData.posheight = 0;
        this.temporaryData.swipe = false;
        this.temporaryData.rotate = 0;
        console.log("回到了起始位置");
      }
    },
    nextTick() {
      // 记录最终滑动距离
      this.temporaryData.lastPosWidth = this.temporaryData.poswidth;
      this.temporaryData.lastPosHeight = this.temporaryData.posheight;
      this.temporaryData.lastRotate = this.temporaryData.rotate;
      this.temporaryData.lastZindex = 20;
      let currentpage = this.temporaryData.currentPage + 1;
      // 更新进度条
      let pageGress = (currentpage / this.pages.length) * 100;
      // 处理获取喜欢、不喜欢的值
      console.log(this.temporaryData.lastRotate, '获取偏移值')
      let data = JSON.parse(JSON.stringify(this.pages[this.temporaryData.currentPage]))
      delete data.url
      if (this.temporaryData.lastRotate > 0) { // 不喜欢，往左滑动
        Object.assign(data, { likeFlag: false })
      } else { // 喜欢，往右滑动
        Object.assign(data, { likeFlag: true })
      }
      this.getParams(data)
      this.choosedList = this.choosedList.map(item => {
        delete item.likeFlag
        delete item.opacity
        delete item.progress
        return item
      })
      // 切换页面
      if (this.temporaryData.currentPage === this.pages.length - 1) {
        Bus.$emit('getParams',this.choosedList)
        // return;
      }
      this.$emit("progressHandle", pageGress);
      // 循环currentPage
      this.temporaryData.currentPage = this.temporaryData.currentPage + 1;
      // this.temporaryData.currentPage === this.pages.length - 1
      //   ? 0
      //   : this.temporaryData.currentPage + 1;
      // currentPage切换，整体dom进行变化，把第一层滑动置最低
      this.$nextTick(() => {
        this.temporaryData.poswidth = 0;
        this.temporaryData.posheight = 0;
        this.temporaryData.opacity = 1;
        this.temporaryData.rotate = 0;
      });
    },
    onTransitionEnd(index) {
      let lastPage =
        this.temporaryData.currentPage === 0
          ? this.pages.length - 1
          : this.temporaryData.currentPage - 1;
      // dom发生变化正在执行的动画滑动序列已经变为上一层
      if (this.temporaryData.swipe && index === lastPage) {
        this.temporaryData.animation = true;
        this.temporaryData.lastPosWidth = 0;
        this.temporaryData.lastPosHeight = 0;
        this.temporaryData.lastOpacity = 0;
        this.temporaryData.lastRotate = 0;
        this.temporaryData.swipe = false;
        this.temporaryData.lastZindex = -1;
      }
    },
    prev() {
      this.temporaryData.tracking = false;
      this.temporaryData.animation = true;
      // 计算划出后最终位置
      let width = this.$el.offsetWidth;
      this.temporaryData.poswidth = -width;
      this.temporaryData.posheight = 0;
      this.temporaryData.opacity = 0;
      this.temporaryData.rotate = 3;
      this.temporaryData.swipe = true;
      this.nextTick();
    },
    next() {
      this.temporaryData.tracking = false;
      this.temporaryData.animation = true;
      // 计算划出后最终位置
      let width = this.$el.offsetWidth;
      this.temporaryData.poswidth = width;
      this.temporaryData.posheight = 0;
      this.temporaryData.opacity = 0;
      this.temporaryData.rotate = -3;
      this.temporaryData.swipe = true;
      this.nextTick();
    },
    rotateDirection() {
      if (this.temporaryData.poswidth <= 0) {
        return -1;
      } else {
        return 1;
      }
    },
    angleRatio() {
      let height = this.$el.offsetHeight;
      let offsetY = this.temporaryData.offsetY;
      let ratio = -1 * ((2 * offsetY) / height - 1);
      return ratio || 0;
    },
    inStack(index, currentPage) {
      let stack = [];
      let visible = this.temporaryData.visible;
      let length = this.pages.length;
      for (let i = 0; i < visible; i++) {
        if (currentPage + i < length) {
          stack.push(currentPage + i);
        }
        // else {
        //   stack.push(currentPage + i - length);
        // }
      }
      return stack.indexOf(index) >= 0;
    },
    // 非首页样式切换
    transform(index) {
      // 初始化非首页的状态
      let currentPage = this.temporaryData.currentPage;
      let length = this.pages.length;
      let lastPage =
        currentPage === 0 ? this.pages.length - 1 : currentPage - 1;
      let style = {};
      let visible = this.temporaryData.visible;
      if (index === this.temporaryData.currentPage) {
        return;
      }
      // console.log("计算页数", this.inStack(index, currentPage), index);
      if (this.inStack(index, currentPage)) {
        let perIndex =
          index - currentPage > 0
            ? index - currentPage
            : index - currentPage + length;
        style["opacity"] = "1";
        style["transform"] =
          "translate3D(0," +
          -2 * 60 * (perIndex - this.offsetRatio) +
          "px" +
          "," +
          -1 * 60 * (perIndex - this.offsetRatio) +
          "px" +
          ")";
        style["zIndex"] = visible - perIndex;
        // console.log(
        //   "zIndex",
        //   visible - perIndex,
        //   "visible",
        //   visible,
        //   "perIndex",
        //   perIndex,
        //   "offsetRatio",
        //   this.offsetRatio,
        //   "currentPage",
        //   currentPage
        // );
        if (perIndex == 1 && currentPage < this.pages.length - 1) {
          this.$emit(
            "change",
            "opacity",
            currentPage + perIndex,
            this.offsetRatio
          );
        } else if (currentPage + perIndex < this.pages.length) {
          this.$emit("change", "opacity", currentPage + perIndex, 0);
        }

        // this.maskProgess(currentPage, perIndex, this.offsetRatio);
        if (!this.temporaryData.tracking) {
          style[this.temporaryData.prefixes.transition + "TimingFunction"] =
            "ease";
          style[this.temporaryData.prefixes.transition + "Duration"] =
            300 + "ms";
        }
      } else if (index === lastPage) {
        style["transform"] =
          "translate3D(" +
          this.temporaryData.lastPosWidth +
          "px" +
          "," +
          this.temporaryData.lastPosHeight +
          "px" +
          ",0px) " +
          "rotate(" +
          this.temporaryData.lastRotate +
          "deg)";
        style["opacity"] = this.temporaryData.lastOpacity;
        style["zIndex"] = this.temporaryData.lastZindex;
        style[this.temporaryData.prefixes.transition + "TimingFunction"] =
          "ease";
        style[this.temporaryData.prefixes.transition + "Duration"] = 300 + "ms";
      } else {
        style["zIndex"] = "-1";
        style["transform"] =
          "translate3D(0,0," + -1 * visible * 60 + "px" + ")";
      }
      // console.log("style", style);
      return style;
    },
    // 首页样式切换
    transformIndex(index) {
      if (index === this.temporaryData.currentPage) {
        // 首页透明度为1
        this.$emit("change", "opacity", index, 1);
        let style = {};
        style["transform"] =
          "translate3D(" +
          this.temporaryData.poswidth +
          "px" +
          "," +
          this.temporaryData.posheight +
          "px" +
          ",0px) " +
          "rotate(" +
          this.temporaryData.rotate +
          "deg)";
        style["opacity"] = this.temporaryData.opacity;
        style["zIndex"] = 10;
        if (this.temporaryData.animation) {
          style[this.temporaryData.prefixes.transition + "TimingFunction"] =
            "ease";
          style[this.temporaryData.prefixes.transition + "Duration"] =
            (this.temporaryData.animation ? 300 : 0) + "ms";
        }
        return style;
      }
    },
    // 处理返回的参数如 [{type_id: '1', like_nums: 10, dis_like_nums: 11}]
    getParams (item) {
      let like_nums = item.likeFlag ? 1 : 0
      let dis_like_nums = item.likeFlag ? 0 : 1
      if (this.choosedList && this.choosedList.length === 0) {
        Object.assign(item, {
          like_nums,
          dis_like_nums
        })
        this.choosedList.push(item)
      } else {
        if (this.choosedList.some(data => data.type_id === item.type_id)) {
          let index = this.choosedList.findIndex(value => value.type_id === item.type_id)
          if (item.likeFlag) {
            this.choosedList[index].like_nums++
          } else {
            this.choosedList[index].dis_like_nums++
          }
        } else {
          Object.assign(item, {
            like_nums,
            dis_like_nums
          })
          this.choosedList.push(item)
        }
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.stack {
  width: 100%;
  height: 100%;
  position: relative;
  perspective: 1000px;
  perspective-origin: 50% 150%;
  -webkit-perspective: 1000px;
  -webkit-perspective-origin: 50% 150%;
  margin: 0;
  padding: 0;
}
.stack-item {
  // background: #fff;
  height: 100%;
  width: 100%;
  border-radius: 20px;
  text-align: center;
  overflow: hidden;
  position: absolute;
  opacity: 0;
  display: -webkit-flex;
  display: flex;
  -webkit-flex-direction: column;
  flex-direction: column;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  pointer-events: auto;
  .icon {
    width: 110px;
    height: 110px;
    background: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    overflow: hidden;
    img {
      width: 54px;
      height: 46px;
    }
  }
}
.stack-item .img_wrap {
  display: block;
  width: 620px;
  height: 880px;
  background: rgba(255, 255, 255, 0.12);
}
.stack-item img {
  width: 620px;
  height: 880px;
  display: block;
  pointer-events: none;
}
.stack-container li.move-back {
  /* http://matthewlein.com/ceaser/ */
  -webkit-transition-timing-function: cubic-bezier(
    0.175,
    0.885,
    0.47,
    1
  ); /* older webkit */
  -webkit-transition-timing-function: cubic-bezier(0.175, 0.885, 0.47, 1.515);
  transition-timing-function: cubic-bezier(0.175, 0.885, 0.47, 1.515);
}
</style>
