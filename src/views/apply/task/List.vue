<template>
    <div>
        <div class="">
            <span class="tit">任务 / 总数 : {{total}}</span>
            <el-form :inline="true" :model="query">
                <el-form-item>
                    <el-select clearable v-model="query.status" placeholder="请选择">
                        <el-option
                            v-for="item in statusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="medium" icon="el-icon-search">搜索</el-button>
                </el-form-item>
<!--                <el-form-item>-->
<!--                    <router-link to="/apply/goout/form">-->
<!--                        <el-button type="primary" size="medium">添加申请</el-button>-->
<!--                    </router-link>-->
<!--                </el-form-item>-->
            </el-form>
        </div>
        <el-table :span-method="objectSpanMethod" :data="list" stripe border v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="clockDay" min-width="100" label="项目"></el-table-column>
            <el-table-column prop="clockTime" min-width="100" label="申请人"></el-table-column>
            <el-table-column prop="time" min-width="100" label="外出日期"></el-table-column>
            <el-table-column prop="reason" min-width="120" label="事由"></el-table-column>
            <el-table-column prop="reason" min-width="120" label="审批人"></el-table-column>
            <el-table-column prop="status" min-width="100" label="审批状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 0" type="warning">审批中</el-tag>
                    <el-tag v-if="scope.row.status == 1" type="success">同意</el-tag>
                    <el-tag v-if="scope.row.status == 2" type="danger">拒绝</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="220">
                <template slot-scope="scope">
                    <el-button size="mini" v-if="scope.row.status != 1" @click.native="handleModal(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click.native="handleDel(scope.$index, scope.row)">删除</el-button>
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
    </div>
</template>
<script>
    //import {getApplyList} from "../../../api/apply/clock.js";
    // import {getUserInfo} from "../../../api/admin/user.js";
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                query: {
                    status: "",
                    current: 1,
                    size: 10
                },
                statusOptions: [
                    {
                        value: "",
                        label: "全部"
                    },
                    {
                        value: "0",
                        label: "审批中"
                    },
                    {
                        value: "1",
                        label: "同意"
                    },
                    {
                        value: "2",
                        label: "拒绝"
                    }
                ],
                pages: 0,
                total: 0,
                listLoading: false,
                list: [],
                number:''
            }
        },
        created() {
            //this.getApplyList();
        },
        computed: {
            ...mapGetters([
                'permissions'
            ])
        },
        methods:{
            objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (columnIndex === 0) {
                    if (rowIndex % 2 === 0) {
                        return {
                            rowspan: 2,
                            colspan: 1
                        };
                    } else {
                        return {
                            rowspan: 0,
                            colspan: 0
                        };
                    }
                }
            },
            getApplyList(){
                this.loading = true;
                getApplyList(this.query)
                    .then(response => {
                        this.loading = false;
                        this.total = response.data.data.total
                        this.query.current = response.data.data.current
                        this.query.size = response.data.data.size
                        this.list = response.data.data.records;
                        this.list.forEach((item,index) => {
                            const clockInfo =  JSON.parse(item.clockList);
                            console.log(clockInfo.status)
                            this.list[index].clockDay = clockInfo.day;
                            this.list[index].clockTime = clockInfo.time;
                            this.list[index].clockStatus = clockInfo.status;
                        })

                    })
                    .catch(() => {
                        this.loading = false;
                    });
            },
            handleSizeChange(val) {
                this.query.size = val;
                this.getLoglist();
            },
            handleCurrentChange(val) {
                this.query.current = val;
                this.getLoglist();
            },
            handleModal (data) {
                window.localStorage.setItem("editClockInfo", JSON.stringify(data))
                this.$router.push({
                    path: "/apply/clock/form"
                });
            },
            handleDel(index, row) {
                if (row.clockId) {
                    this.$confirm("确认删除吗?", "提示", {
                        type: "warning"
                    }).then(() => {
                        // deleteUser(row.userId).then(res => {
                        //     if (res.data.data) {
                        //         this.getUserList();
                        //     }
                        // })
                    })
                }
            }
        },
        mounted() {

        }
    }
</script>
<style type="text/scss" lang="scss" >

</style>
