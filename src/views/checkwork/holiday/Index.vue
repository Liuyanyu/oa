<template>
    <div>
        <div class="">
            <span class="tit">节假日管理 / 总数 : {{total}}</span>
            <el-form :inline="true" :model="query">
                <el-form-item>
                    <el-input clearable v-model="query.likeKeyWords" placeholder="关键字"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="medium" v-on:click="getHolidayList()" icon="el-icon-search">搜索</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="medium" @click="handleModal()" v-if="holiday_btn_add">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="list" stripe border v-loading="listLoading" style="width: 100%;">
            <el-table-column width="50" label="序号">
                <template scope="scope"><span>{{scope.$index+(query.current - 1) * query.size + 1}} </span></template>
            </el-table-column>
            <el-table-column prop="name" min-width="120" label="名称"></el-table-column>
            <el-table-column prop="day" min-width="120" label="日期"></el-table-column>
            <el-table-column min-width="120" label="类型">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.type == '1'" type="success">上班</el-tag>
                    <el-tag v-if="scope.row.type == '2'" type="danger">休息</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="160">
                <template slot-scope="scope">
                    <el-button v-if="holiday_btn_del" size="mini" type="danger" @click.native="handleDel(scope.$index, scope.row)">删除</el-button>
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
    import {fetchList, addObj, putObj, delObj} from "../../../api/checkwork/holiday.js";
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
                holiday_btn_add: false,
                holiday_btn_edit: false,
                holiday_btn_del: false,
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
            this.getHolidayList();
            this.holiday_btn_add = this.permissions['dd_holiday_add'];
            this.holiday_btn_edit = this.permissions['dd_holiday_edit'];
            this.holiday_btn_del = this.permissions['dd_holiday_del'];
        },
        computed: {
            ...mapGetters([
                'permissions'
            ])
        },
        methods:{
            getHolidayList(){
                this.listLoading = true;
                fetchList(this.query)
                    .then(response => {
                        this.loading = false;
                        this.listLoading = false;
                        this.total = response.data.data.total;
                        this.query.current = response.data.data.current;
                        this.query.size = response.data.data.size;
                        this.list = response.data.data.records;
                    })
                    .catch(() => {
                        this.listLoading = false;
                    });
            },

            handleModal (data) {
                if (data) {
                    this.dialogTitle = '编辑节假日 - ' + data.day;
                    this.formData.newData = false;
                    this.formData.id = data.id;
                    this.formData.name = data.name;
                    this.formData.day = data.day;
                    this.formData.type = data.type;
                } else {
                    this.dialogTitle = '添加节假日';
                    this.formData.newData = true;
                    this.formData.id = '';
                    this.formData.name = '';
                    this.formData.day = '';
                    this.formData.type = '2';
                }
                this.dialogVisible = true
            },
            handleSubmit () {
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        this.saving = true
                        if (!this.formData.newData) {
                            putObj(this.formData).then(res => {
                                if (res.data.data) {
                                    this.dialogVisible = false;
                                    this.getHolidayList();
                                }
                            }).finally(() => {
                                this.saving = false
                            })
                        } else {
                            addObj(this.formData).then(res => {
                                if (res.data.data) {
                                    this.dialogVisible = false;
                                    this.getHolidayList();
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
                                this.getHolidayList();
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
                this.getHolidayList();
            },
            handleCurrentChange(val) {
                this.query.current = val;
                this.getHolidayList();
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
