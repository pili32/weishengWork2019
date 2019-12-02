<template>
  <div ref="dom" class="charts chart-bar"></div>
</template>
<script>
import echarts from 'echarts'
import tdTheme from './data.json'
import { on, off } from '@/libs/util'
echarts.registerTheme('tdTheme', tdTheme)
export default {
  name: 'ChartBar',
  props: {
    value: Array,
    text: String,
    subtext: String
  },
  data () {
    return {
      dom: null
    }
  },
  watch:{
    value(newData){
      let option = {
        series: [{
          data: newData,
        }]
      }
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    }
  },
  methods: {
    resize () {
      this.dom.resize()
    }
  },
  mounted () {
    this.$nextTick(() => {
      let option = {
        title:{
          show:false
        },
        tooltip : {
            trigger: 'axis'
        },
        grid: {
            left: '2%',
            right: '2%',
            bottom: '3%',
            top:"8%",
            containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"]
        },
        yAxis: {
          type: 'value',
          show:false,
          axisLabel:{
            show:false
          }
        },
        series: [{
          barWidth: '30%',
          data: this.value,
          type: 'bar',
          label:{
            show:true,
            position:"top"
          }
        }]
      }
      this.dom = echarts.init(this.$refs.dom, 'tdTheme')
      this.dom.setOption(option)
      on(window, 'resize', this.resize)
    })
  },
  beforeDestroy () {
    off(window, 'resize', this.resize)
  }
}
</script>
