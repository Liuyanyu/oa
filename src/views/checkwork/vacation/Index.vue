<template>
    <div>
        <div class="">
            <span class="tit">节假日管理 / 总数 : {{total}}</span>
            <el-form :inline="true" :model="query">
<!--                <el-form-item>-->
<!--                    <el-input clearable v-model="query.likeKeyWords" placeholder="关键字"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item>-->
<!--                    <el-button type="primary" size="medium" v-on:click="getVacationList()" icon="el-icon-search">搜索</el-button>-->
<!--                </el-form-item>-->
                <el-form-item>
                    <el-button type="success" size="medium" @click="handleModal()" v-if="vacation_btn_init">初始化</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="list" stripe border v-loading="listLoading" style="width: 100%;">
            <el-table-column width="50" label="序号">
                <template scope="scope">
                    <span>{{scope.$index+(query.current - 1) * query.size + 1}} </span>
                </template>
            </el-table-column>
            <el-table-column prop="userName" min-width="120" label="姓名"></el-table-column>
            <el-table-column prop="year" min-width="120" label="年份"></el-table-column>
            <el-table-column min-width="120" label="事假">
                <template scope="scope">
                    <span>{{scope.row.thingNum}} 小时</span>
                </template>
            </el-table-column>
            <el-table-column min-width="120" label="年假">
                <template scope="scope">
                    <span>{{scope.row.annualNum}} 天</span>
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
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
            <el-form :model="formData" :rules="rules" ref="formData" label-width="80px">
                <el-form-item label="名称" prop="name">
                    <el-input type="text" placeholder="请输入名称" v-model="formData.name" auto-complete="off" maxlength="20" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="日期" prop="day">
                    <el-date-picker
                        v-model="formData.day"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="选择日期"
                        style="width: 100%">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="类型" prop="type">
                    <el-radio-group v-model="formData.type">
                        <el-radio label="1">上班</el-radio>
                        <el-radio label="2">休息</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleSubmit" :loading="saving">提 交</el-button>
                <el-button @click="dialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {fetchList, initNum, addObj, putObj, delObj} from "../../../api/checkwork/vacation.js";
    import {dateFormat} from "../../../utils/date.js";
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                query: {
                    likeKeyWords: "",
                    current: 1,
                    size: 10
                },
                total: 0,
                dialogTitle: '',
                listLoading: false,
                dialogVisible: false,
                saving: false,
                list: [],
                pickerOptions: {
                    disabledDate: (time) => {
                        return this.dealDisabledDate(time)
                    }
                },
                formData: {
                    id: '',
                    name: '',
                    day: '',
                    type: '2'
                },
                vacation_btn_init: false,
                vacation_btn_add: false,
                vacation_btn_edit: false,
                vacation_btn_del: false,
                rules: {
                    name: [
                        { required: true, message: '请输入名称' }
                    ],
                    day: [
                        { required: true, message: '请选择日期', trigger: 'change' }
                    ],
                    type: [
                        { required: true, message: '请选择类型', trigger: 'change' },
                    ]
                },
            }
        },
        created() {
            this.getVacationList();
            this.vacation_btn_init = this.permissions['dd_vacation_init'];
            this.vacation_btn_add = this.permissions['dd_vacation_add'];
            this.vacation_btn_edit = this.permissions['dd_vacation_edit'];
            this.vacation_btn_del = this.permissions['dd_vacation_del'];
        },
        computed: {
            ...mapGetters([
                'permissions'
            ])
        },
        methods:{
            getVacationList(){
                this.listLoading = true;
                fetchList(this.query)
                    .then(response => {
                        this.loading = false;
                        this.listLoading = false;
                        this.total = response.data.data.total
                        this.query.current = response.data.data.current
                        this.query.size = response.data.data.size
                        this.list = response.data.data.records;
                    })
                    .catch(() => {
                        this.listLoading = false;
                    });
            },

            handleModal (data) {
                if (data) {
                    this.dialogTitle = '编辑假期 - ' + data.day
                    this.formData.newData = false;
                    this.formData.id = data.id;
                    this.formData.name = data.name;
                    this.formData.day = data.day;
                    this.formData.type = data.type;
                    this.dialogVisible = true;
                } else {
                    var year = dateFormat(new Date()).substr(0,4);
                    this.$confirm('确定要初始化 '+ year +' 年吗？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        const data = {
                            year: year
                        }
                        initNum(data).then(res => {
                            if (res.data.data) {
                                this.$message({
                                    type: 'success',
                                    message: '初始化成功!'
                                });
                                this.getVacationList();
                            }
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    });
                }

            },
            handleSubmit () {
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        this.saving = true
                        if (!this.formData.newData) {
                            putObj(this.formData).then(res => {
                                if (res.data.data) {
                                    this.dialogVisible = false
                                    this.getVacationList();
                                }
                            }).finally(() => {
                                this.saving = false
                            })
                        } else {
                            addObj(this.formData).then(res => {
                                if (res.data.data) {
                                    this.dialogVisible = false
                                    this.getVacationList();
                                }
                            }).finally(() => {
                                this.saving = false
                            })
                        }
                    }
                })
            },
            // 删除
            handleDel(index, row) {
                if (row.id) {
                    this.$confirm("确认删除 " + row.day + " 吗?", "提示", {
                        type: "warning"
                    }).then(() => {
                        delObj(row.id).then(res => {
                            if (res.data.data) {
                                this.getVacationList();
                            }
                        })
                    })
                }
            },
            // 单独处理时间的函数
            dealDisabledDate (time) {
                return time.getTime() <= Date.now()
            },
            handleSizeChange(val) {
                this.query.size = val;
                this.getVacationList();
            },
            handleCurrentChange(val) {
                this.query.current = val;
                this.getVacationList();
            }

        },
        mounted() {

        }
    }

</script>

<style type="text/scss" lang="scss" scoped>
    .el-form{
        width: -webkit-fill-available;
    }
</style>
