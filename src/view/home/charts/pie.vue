<template>
    <div ref="dom" class="charts chart-pie"></div>
</template>
<script>
import echarts from 'echarts'
import echartsData from './data.json'
import {on ,off} from '@/libs/util'
echarts.registerTheme('echartsData', echartsData)
export default {
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
    methods: {
        resize () {
            this.dom.resize()
        }
    },
    mounted () {
        this.$nextTick(() => {
            let legend = this.value.map(_ => _.name)
            let option = {
                series: [
                    {
                        type: 'pie',
                        radius: ['60%', '75%'],
                        center: ['50%', '50%'],
                        data: this.value,
                        avoidLabelOverlap: false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center'
                            },
                            emphasis: {
                                show: true,
                                textStyle: {
                                    fontSize: '12',
                                    fontWeight: 'bold'
                                }
                            }
                        }
                    }
                ]
            }
            this.dom = echarts.init(this.$refs.dom, 'echartsData')
            this.dom.setOption(option)
            on(window, 'resize', this.resize)
        })
    },
    beforeDestroy () {
        off(window, 'resize', this.resize)
    }
}
</script>

