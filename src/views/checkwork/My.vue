<template>
    <div>
        <div>
            <span class="tit">我的考勤</span>
            <el-form :inline="true" :model="query">
                <el-form-item>
                    <el-date-picker
                        v-model="query.selectMonth"
                        :picker-options="expireTimeOption"
                        type="month"
                        value-format="yyyy-MM"
                        placeholder="选择月">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="medium" v-on:click="getClockList()" icon="el-icon-search">搜索</el-button>
                </el-form-item>
                <el-form-item class="subtotal">
                    <el-button type="primary"  @click="getStatisticsUserId">当月小计</el-button>
                </el-form-item>
            </el-form>
        </div>

        <el-row>
<!--            <el-col  :xs="{span:24}" :md="{span:15}">-->
                <el-table :data="list"
                          stripe
                          border
                          :span-method="objectSpanMethod"

                          v-loading="listLoading"
                          style="width: 100%;">
                    <el-table-column prop="day" min-width="100" label="日期"
                    ></el-table-column>
                    <el-table-column prop="time" min-width="80" label="时间"></el-table-column>
                    <el-table-column prop="type" min-width="80" label="类型" :formatter="formatType">
                    </el-table-column>
                    <el-table-column prop="status" min-width="130" label="状态">
                        <template slot-scope="scope">
                            <el-tag v-if="scope.row.status == 0" type="success">菜单</el-tag>
                            <el-tag v-if="scope.row.status == 1" type="">正常</el-tag>
                            <el-tag v-if="scope.row.status == 2" type="danger">迟到</el-tag>
                            <el-tag v-if="scope.row.status == 3" type="danger">早退</el-tag>
                            <el-tag v-if="scope.row.status == 4" type="danger">旷工</el-tag>

                            <el-tag v-if="scope.row.status == 1930" type="success">加班到19:30</el-tag>
                            <el-tag v-if="scope.row.status == 2000" type="success">加班到20:00</el-tag>
                            <el-tag v-if="scope.row.status == 2030" type="success">加班到20:30</el-tag>
                            <el-tag v-if="scope.row.status == 2100" type="success">加班到21:00</el-tag>
                            <el-tag v-if="scope.row.status == 2130" type="success">加班到21:30</el-tag>
                            <el-tag v-if="scope.row.status == 2200" type="success">加班到22:00</el-tag>
                            <el-tag v-if="scope.row.status == 2230" type="success">加班到22:30</el-tag>
                            <el-tag v-if="scope.row.status == 2300" type="success">加班到23:00</el-tag>
                            <el-tag v-if="scope.row.status == 2330" type="success">加班到23:30</el-tag>
                            <el-tag v-if="scope.row.status == 2400" type="success">加班到00:00</el-tag>
                            <el-tag v-if="scope.row.status == 2430" type="success">加班到00:30</el-tag>
                            <el-tag v-if="scope.row.status == 2500" type="success">加班到01:00</el-tag>

                            <el-tag v-if="scope.row.status == 21" type="warning">五分钟内第一次</el-tag>
                            <el-tag v-if="scope.row.status == 22" type="warning">五分钟内第二次</el-tag>
                            <el-tag v-if="scope.row.status == 23" type="warning">五分钟内第三次</el-tag>

                            <el-tag v-if="scope.row.status == 101" type="info">第一次未打卡</el-tag>
                            <el-tag v-if="scope.row.status == 102" type="info">第二次未打卡</el-tag>
                            <el-tag v-if="scope.row.status == 103" type="info">第三次未打卡</el-tag>
                            <el-tag v-if="scope.row.status == 104" type="info">第四次未打卡</el-tag>
                            <el-tag v-if="scope.row.status == 105" type="info">第五次未打卡</el-tag>

                        </template>
                    </el-table-column>
                    <el-table-column prop="start" min-width="60" label="提前"></el-table-column>
                    <el-table-column prop="end" min-width="60" label="加班"></el-table-column>
                    <el-table-column prop="createTime" min-width="160" label="创建时间"></el-table-column>
                    <el-table-column label="操作" min-width="100">
                        <template slot-scope="scope">
                            <el-dropdown v-if="scope.row.status == 2 || scope.row.status == 3 || scope.row.status == 4" trigger="click" @command="handleCommand">
                                <el-button type="primary" size="mini" class="el-dropdown-link">
                                    异常申请<i class="el-icon-arrow-down el-icon--right"></i>
                                </el-button>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item :command="composeValue(1,scope.row)">未打卡</el-dropdown-item>
                                    <el-dropdown-item :command="composeValue(2,scope.row)">出差</el-dropdown-item>
                                    <el-dropdown-item :command="composeValue(3,scope.row)">外出</el-dropdown-item>
                                    <el-dropdown-item :command="composeValue(4,scope.row)">请假</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination class="right"
                               @size-change="handleSizeChange"
                               @current-change="handleCurrentChange"
                               :current-page="query.current"
                               :page-sizes="[10, 20, 50, 100]"
                               :page-size="query.size"
                               layout="total, sizes, prev, pager, next"
                               :total="total">
                </el-pagination>
<!--            </el-col>-->
<!--            <el-col  :xs="{span:24}" :md="{span:8}" :offset="1" style="border: 1px solid #DCDFE6;padding: 30px">-->
<!--                 <div style="color: #000;line-height: 40px">-->
<!--                     <h3>当月小计</h3>-->
<!--                     <p>姓名：{{userStatisticsInfo.userName}}</p>-->
<!--                     <p>正常：{{userStatisticsInfo.normalNum}} 次</p>-->
<!--                     <p>迟到：{{userStatisticsInfo.lateNum}} 次</p>-->
<!--                     <p>早退：{{userStatisticsInfo.earlyNum}} 次</p>-->
<!--                     <p>旷工：{{userStatisticsInfo.absenteeismNum}} 次</p>-->
<!--                     <p>出差：{{userStatisticsInfo.businesstripNum}} 天</p>-->
<!--                     <p>请假：{{userStatisticsInfo.leaveNum}} 小时</p>-->
<!--                     <p>外出：{{userStatisticsInfo.gooutNum}} 小时</p>-->
<!--                 </div>-->
<!--            </el-col>-->
        </el-row>


    </div>
</template>
<script>
    import {getPageList, getStatisticsUserId} from "../../api/checkwork/clock.js";
    import {dateFormat} from "../../utils/date.js";
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                query: {
                    selectMonth: dateFormat(new Date()).substr(0,7),
                    userId: '',
                    current: 1,
                    size: 10
                },
                expireTimeOption: {
                    disabledDate: time => {
                        var date = new Date();
                        var year = date.getFullYear();
                        var month = date.getMonth() + 1;
                        if (month >= 1 && month <= 9) {
                            month = "0" + month;
                        }
                        var currentdate = year.toString() + month.toString();
                        var timeyear = time.getFullYear();
                        var timemonth = time.getMonth() + 1;
                        if (timemonth >= 1 && timemonth <= 9) {
                            timemonth = "0" + timemonth;
                        }
                        var timedate = timeyear.toString() + timemonth.toString();
                        return currentdate < timedate;
                    }
                },
                pages: 0,
                total: 0,
                listLoading: false,
                list: [],
                number:'',
                arr1:[],
                userStatisticsInfo: {
                    userName: ""
                }
            }
        },
        created() {
            this.getClockList();
            this.query.userId = this.userId;
            this.getStatisticsUserId();
        },
        computed: {
            ...mapGetters([
                'permissions', 'userId'
            ])
        },
        mounted() {

        },
        methods:{
            open() {

            },
            setdates(arr) {
                var obj = {},
                    k, arr1 = [];
                for (var i = 0, len = arr.length; i < len; i++) {
                    k = arr[i].day;
                    if (obj[k])
                        obj[k]++;
                    else
                        obj[k] = 1;
                }
                //console.log(obj)
                //保存结果{el-'元素'，count-出现次数}
                for (var o in obj) {
                    for (let i = 0; i < obj[o]; i++) {
                        if (i === 0) {
                            this.arr1.push(obj[o])
                        } else {
                            this.arr1.push(0)
                        }
                    }
                }
                //console.log(this.arr1);
            },
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0) {
                    let _row = this.arr1[rowIndex]
                    let _col = this.arr1[rowIndex] > 0 ? 1 : 0
                    return [_row,_col]
                }
            },

            getClockList(){
                this.listLoading = true;
                getPageList(this.query)
                    .then(response => {
                        this.listLoading = false;
                        this.total = response.data.data.total;
                        this.query.current = response.data.data.current;
                        this.query.size = response.data.data.size;
                        this.list = response.data.data.records;
                        this.setdates(this.list)

                        // this.getStatisticsUserId();
                    })
                    .catch(() => {
                        this.listLoading = false;
                    });
            },
            getStatisticsUserId() {
                getStatisticsUserId(this.query)
                    .then(response => {
                        this.userStatisticsInfo = response.data.data;
                        console.log(this.userStatisticsInfo);
                        var a = this.userStatisticsInfo.normalNum == null? + 0 +' 次' : this.userStatisticsInfo.normalNum +' 次';
                        var b = this.userStatisticsInfo.lateNum == null? + 0 + ' 次' : this.userStatisticsInfo.lateNum +' 次';
                        var c = this.userStatisticsInfo.earlyNum == null? + 0 + ' 次' : this.userStatisticsInfo.earlyNum +' 次';
                        var d = this.userStatisticsInfo.absenteeismNum == null? + 0 + ' 次' : this.userStatisticsInfo.absenteeismNum +' 次';
                        var e = this.userStatisticsInfo.businesstripNum == null? + 0 + ' 天' : this.userStatisticsInfo.businesstripNum +' 天';
                        var f = this.userStatisticsInfo.leaveNum == null? +  0 +' 小时' : this.userStatisticsInfo.leaveNum +' 小时';
                        var g = this.userStatisticsInfo.gooutNum == null? + 0 +' 小时' : this.userStatisticsInfo.gooutNum +' 小时';
                        content = ['姓名：'+this.userStatisticsInfo.userName,
                            '正常：' + a,
                            '迟到：' + b,
                            '早退：' + c,
                            '旷工：' + d,
                            '出差：' + e,
                            '请假：' + f,
                            '外出：' + g,
                        ];
                        console.log(content);
                        let content = content;
                        let newDatas = [];
                        const h = this.$createElement;
                        for(let i in content){
                            newDatas.push(h('p',null,content[i]));
                        };
                        this.$alert(h('div',null,newDatas),'当月小计');
                    })
            },
            formatType: function (row) {
                return row.type == 1 ? '上班' : row.type == 2 ? '下班' : '未知';
            },
            // 单独处理时间的函数
            dealDisabledDate (time) {
                return time.getTime() >= Date.now()
            },
            handleSizeChange(val) {
                this.query.size = val;
                this.getClockList();
            },
            handleCurrentChange(val) {
                this.query.current = val;
                this.getClockList();
            },
            composeValue(item, row) {
                return {
                    'button': item,
                    'row': row
                }
            },
            handleCommand(command) {
                //this.$message('click on item ' + command);
                //console.log(command)
                window.localStorage.setItem("applyClockInfo", JSON.stringify(command.row))
                if (command.button == 1) {
                    this.$router.push({
                        path: "/apply/clock/form"
                    });
                }
                if (command.button == 2) {
                    this.$router.push({
                        path: "/apply/businesstrip/form"
                    });
                }
                if (command.button == 3) {
                    this.$router.push({
                        path: "/apply/goout/form"
                    });
                }
                if (command.button == 4) {
                    this.$router.push({
                        path: "/apply/leave/form"
                    });
                }

            }
        }
    }
</script>
<style type="text/scss" lang="scss">
    .el-dropdown-link {
        cursor: pointer;
        color: #409EFF;
    }
</style>
