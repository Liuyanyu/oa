<template>
    <div>
        <div id="line" class="line">

        </div>
        <div id="bar" class="bar">

        </div>
        <div id="pie" class="pie">

        </div>
    </div>
</template>

<script>
    import {getSupplierPage, addObj, editObj, deleteObj} from "../../api/customer/supplier.js";
    import { mapGetters } from 'vuex'
    export default {
        data(){
            return{

            }
        },
        computed:{
            ...mapGetters([
                'permissions'
            ])
        },
        created() {
            this.$nextTick(function() {
                this.drawLine();
                this.drawBar();
                this.drawPie();
            })



        },
        mounted() {
        },
        methods:{
            drawLine(){
                let line = this.$echarts.init(document.getElementById('line'));
                let optionLine={
                    title: {
                        text: '折线图堆叠'
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:['邮件营销','联盟广告','视频广告','直接访问','搜索引擎']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    toolbox: {
                        feature: {
                            saveAsImage: {}
                        }
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['周一','周二','周三','周四','周五','周六','周日']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name:'邮件营销',
                            type:'line',
                            stack: '总量',
                            data:[120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            name:'联盟广告',
                            type:'line',
                            stack: '总量',
                            data:[220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            name:'视频广告',
                            type:'line',
                            stack: '总量',
                            data:[150, 232, 201, 154, 190, 330, 410]
                        },
                        {
                            name:'直接访问',
                            type:'line',
                            stack: '总量',
                            data:[320, 332, 301, 334, 390, 330, 320]
                        },
                        {
                            name:'搜索引擎',
                            type:'line',
                            stack: '总量',
                            data:[820, 932, 901, 934, 1290, 1330, 1320]
                        }
                    ]
                }
                line.setOption(optionLine,window.onresize = line.resize)
            },
            drawBar(){
                let bar = this.$echarts.init(document.getElementById('bar'));
                let optionBar= {
                    color: ['#003366', '#006699', '#4cabce', '#e5323e'],
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow'
                        }
                    },
                    legend: {
                        data: ['Forest', 'Steppe', 'Desert', 'Wetland']
                    },
                    toolbox: {
                        show: true,
                        orient: 'vertical',
                        left: 'right',
                        top: 'center',
                        feature: {
                            mark: {show: true},
                            dataView: {show: true, readOnly: false},
                            magicType: {show: true, type: ['line', 'bar', 'stack', 'tiled']},
                            restore: {show: true},
                            saveAsImage: {show: true}
                        }
                    },
                    calculable: true,
                    xAxis: [
                        {
                            type: 'category',
                            axisTick: {show: false},
                            data: ['2012', '2013', '2014', '2015', '2016']
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name: 'Forest',
                            type: 'bar',
                            barGap: 0,
                            data: [320, 332, 301, 334, 390]
                        },
                        {
                            name: 'Steppe',
                            type: 'bar',
                            data: [220, 182, 191, 234, 290]
                        },
                        {
                            name: 'Desert',
                            type: 'bar',
                            data: [150, 232, 201, 154, 190]
                        },
                        {
                            name: 'Wetland',
                            type: 'bar',
                            data: [98, 77, 101, 99, 40]
                        }
                    ]
                }
                bar.setOption(optionBar,window.onresize = bar.resize)
            },
            drawPie(){
                let pie = this.$echarts.init(document.getElementById('pie'));
                let optionPie = {
                    title : {
                        text: '某站点用户访问来源',
                        subtext: '纯属虚构',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left',
                        data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']
                    },
                    series : [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius : '55%',
                            center: ['50%', '60%'],
                            data:[
                                {value:335, name:'直接访问'},
                                {value:310, name:'邮件营销'},
                                {value:234, name:'联盟广告'},
                                {value:135, name:'视频广告'},
                                {value:1548, name:'搜索引擎'}
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                }
                pie.setOption(optionPie,window.onresize = pie.resize)
                // pie.setOption(optionPie)
            }
        }
    }
</script>

<style type="text/scss" scoped lang="scss">
    .line{
        width: 100%;
        height: 400px;
    }
    .bar{
        width: 60%;
        height: 400px;
        float: left;
    }
    .pie{
        width: 40%;
        height: 400px;
        float: left;

    }
</style>
