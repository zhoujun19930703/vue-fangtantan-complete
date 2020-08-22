<template>
  <div class="content">
    <span>风格测试结果正在生成...</span>
    <nprogress
      :h="10"
      :w="npgressW"
      bgc="rgba(255, 255, 255, 0.8)"
      parentBgc="rgba(245,245,245,.2)"
      sec="2s"
    />
  </div>
</template>
<script>
import nprogress from './nprogress.vue'
import {api_getTestData} from '../../api'

export default {
  components: {
    nprogress,
  },
  props: {
    choosedList: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      npgressW: '0%',
    }
  },
  mounted () {
    setTimeout(() => {
      this.npgressW = '100%'
      this.test(this.choosedList)
    }, 1000)
  },
  methods: {
    test (data) {
      this.$ajax(api_getTestData, { result: data }).then((res) => {
        console.log('测试', res)
        if (res.code == 200) {
          setTimeout(_ =>{
            this.$emit('update:show', 4)
          },2000)
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.content {
  span {
    font-size: 26px;
    font-family: "PingFangSC-Regular,PingFang SC";
    color: #ffffff;
    margin-bottom: 60px;
  }

  height: 100px;
  width: 488px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
}
</style>
