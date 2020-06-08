<template>
    <div>
        <div class="">
            <span class="tit">统计</span>
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
                    <el-button type="primary" size="medium" v-on:click="getStatistics()" icon="el-icon-search">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="list" border stripe style="width: 100%">
            <el-table-column label="姓名">
                <template slot-scope="scope">
                    <span>{{scope.row.userName}}</span>
                </template>
            </el-table-column>
            <el-table-column label="正常">
                <template slot-scope="scope">
                    <span>{{scope.row.normalNum}} 次</span>
                </template>
            </el-table-column>
            <el-table-column label="迟到">
                <template slot-scope="scope">
                    <span>{{scope.row.lateNum}} 次</span>
                </template>
            </el-table-column>
            <el-table-column label="早退">
                <template slot-scope="scope">
                    <span>{{scope.row.earlyNum}} 次</span>
                </template>
            </el-table-column>
            <el-table-column label="旷工">
                <template slot-scope="scope">
                    <span>{{scope.row.absenteeismNum}} 次</span>
                </template>
            </el-table-column>
            <el-table-column label="出差">
                <template slot-scope="scope">
                    <span v-if="scope.row.businesstripNum == null">0 天</span>
                    <span v-else>{{scope.row.businesstripNum}} 天</span>
                </template>
            </el-table-column>
            <el-table-column label="请假">
                <template slot-scope="scope">
                    <span v-if="scope.row.leaveNum == null">0 小时</span>
                    <span v-else>{{scope.row.leaveNum}} 小时</span>
                </template>
            </el-table-column>
            <el-table-column label="外出">
                <template slot-scope="scope">
                    <span v-if="scope.row.gooutNum == null">0 小时</span>
                    <span v-else>{{scope.row.gooutNum}} 小时</span>
                </template>
            </el-table-column>
            <el-table-column label="罚款">
                <template slot-scope="scope">
                    <span>{{(scope.row.lateNum * 50) + (scope.row.absenteeismNum * 100)}} 元</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
    import {getStatistics} from "../../api/checkwork/clock.js";
    import {dateFormat} from "../../utils/date.js";
    import { mapGetters } from 'vuex'
    export default {
        data(){
            return{
                query: {
                    selectMonth: dateFormat(new Date()).substr(0,7)
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
                list: [],
                listLoading: false,
            }
        },
        created() {
            this.getStatistics();
        },
        computed: {
            ...mapGetters([
                'permissions', 'userId'
            ])
        },
        methods:{
            getStatistics(){
                this.listLoading = true;
                getStatistics(this.query)
                    .then(response => {
                        console.log(response);
                        this.listLoading = false;
                        this.total = response.data.data.total;
                        this.list = response.data.data;
                    })
                    .catch(() => {
                        this.listLoading = false;
                    });
            },
        }
    }
</script>
