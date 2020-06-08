<template>
    <div>
        <div>
            <span class="tit">任务管理 / 总数 : {{total}}</span>
            <el-form :inline="true" :model="query">
                <el-form-item class="search">
                    <el-input clearable v-model="query.username" placeholder="关键字"></el-input>
                </el-form-item>
                <el-form-item class="search">
                    <el-select clearable v-model="query.jobType" placeholder="请选择">
                        <el-option
                            v-for="item in jobTypeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="search">
                    <el-button type="primary" size="medium" v-on:click="getUserList()" icon="el-icon-search">搜索</el-button>
                </el-form-item>
                <el-form-item class="search">
                    <el-button type="primary" size="medium" @click="handleModal()" v-if="job_btn_add">新增</el-button>
                </el-form-item>
                <el-form-item class="search">
                    <el-button type="primary" size="medium" @click="handleModalShutDown()" v-if="job_btn_shutdown">暂停全部任务</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="list" stripe border v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="username" min-width="120" label="姓名"></el-table-column>
            <el-table-column prop="deptName" min-width="120" label="部门" class="hidden-phone"></el-table-column>
            <el-table-column prop="phone" min-width="120" label="手机号"></el-table-column>
            <el-table-column label="操作" min-width="160">
                <template slot-scope="scope">
                    <el-button v-if="job_btn_edit" size="mini" @click.native="handleModal(scope.row)">编辑</el-button>
                    <el-button v-if="job_btn_del" size="mini" type="danger" @click.native="handleDel(scope.$index, scope.row)">删除</el-button>
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

        <!--编辑界面-->
        <el-dialog :title="dialogTitle"  @click="dialogVisible = true"
                   :visible.sync="dialogVisible">
            <el-form label-width="120px" :model="formData" :rules="rules" ref="formData">
                <el-form-item label="任务名称" prop="jobName">
                    <el-input type="text" placeholder="请输入任务名称" v-model="formData.jobName" auto-complete="off" maxlength="5"  show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="任务组名" prop="jobGroup">
                    <el-input type="text" placeholder="请输入任务组名" v-model="formData.jobGroup" auto-complete="off" maxlength="5"  show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="类型" prop="jobType">
                    <el-select v-model="formData.jobType" placeholder="请选择">
                        <el-option v-for="(item, index) in jobTypeOptions" :value="item.value" :key="index" :label="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="执行路径">
                    <el-input type="text" placeholder="请输入执行路径" v-model="formData.executePath" auto-complete="off" maxlength="5"  show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="执行文件">
                    <el-input type="text" placeholder="请输入执行文件" v-model="formData.className" auto-complete="off" maxlength="5"  show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="执行方法">
                    <el-input type="text" placeholder="请输入执行方法" v-model="formData.methodName" auto-complete="off" maxlength="5"  show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="执行参数值">
                    <el-input type="text" placeholder="请输入执行参数值" v-model="formData.methodParamsValue" auto-complete="off" maxlength="5"  show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="cron表达式" prop="cronExpression">
                    <el-input type="text" placeholder="请输入cron表达式" v-model="formData.cronExpression" auto-complete="off" maxlength="5"  show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="错失执行策略" prop="misfirePolicy">
                    <el-select v-model="formData.misfirePolicy" placeholder="请选择">
                        <el-option v-for="(item, index) in misfirePolicyOptions" :value="item.value" :key="index" :label="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注信息">
                    <el-input type="text" placeholder="请输入备注信息" v-model="formData.remark" auto-complete="off" maxlength="5"  show-word-limit></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit" :loading="saving">提交</el-button>
            </div>
        </el-dialog>
        <!--        <el-avatar :size="size" :src="circleUrl"></el-avatar>-->

    </div>
</template>
<script>
    import {fetchList, addObj, putObj, delObj, shutdownJobsRa} from "../../api/other/quartz.js";
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                query: {
                    jobType: "",
                    current: 1,
                    size: 10
                },
                pages: 0,
                total: 0,
                dialogTitle: '',
                listLoading: false,
                dialogVisible: false,
                saving: false,
                list: [],
                user_btn_add: false,
                user_btn_edit: false,
                user_btn_del: false,
                jobTypeOptions: [
                    {
                        value: "1",
                        label: "java类"
                    },
                    {
                        value: "2",
                        label: "spring bean名称"
                    },
                    {
                        value: "3",
                        label: "rest调用"
                    },
                    {
                        value: "4",
                        label: "jar调用"
                    },
                    {
                        value: "9",
                        label: "其他"
                    }
                ],
                misfirePolicyOptions: [
                    {
                        value: "1",
                        label: "错失周期立即执行"
                    },
                    {
                        value: "2",
                        label: "错失周期执行一次"
                    },
                    {
                        value: "3",
                        label: "下周期执行"
                    }
                ],
                formData:{
                    newData: true,
                    jobId:'',
                    jobName:'',
                    jobGroup: "",
                    jobType: "",
                    executePath: "",
                    className: "",
                    methodName: "",
                    methodParamsValue: "",
                    cronExpression: "",
                    misfirePolicy: "",
                    remark: "",

                },
                rules: {
                    jobName: [
                        { required: true, message: '请输入任务名称'}
                    ],
                    jobGroup: [
                        { required: true, message: '请输入任务组名'}
                    ],
                    jobType: [
                        { required: true, message: '请选择类型',trigger: 'change'}
                    ],
                    cronExpression: [
                        { required: true, message: '请输入cron表达式'}
                    ],
                    misfirePolicy: [
                        { required: true, message: '请选择错失执行策略',trigger: 'change'}
                    ]
                },
            }
        },
        created() {
            this.getJobList()
            this.job_btn_add = this.permissions['job_sys_job_add']
            this.job_btn_edit = this.permissions['job_sys_job_edit']
            this.job_btn_del = this.permissions['job_sys_job_del']
            this.job_btn_shutdown = this.permissions['job_sys_job_shutdown_job']
            this.job_btn_start = this.permissions['job_sys_job_start_job']
            this.job_btn_refresh = this.permissions['job_sys_job_refresh_job']
            this.job_btn_run = this.permissions['job_sys_job_run_job']
        },
        computed: {
            ...mapGetters([
                'permissions'
            ])
        },
        methods:{
            getJobList(){
                this.loading = true;
                fetchList(this.query)
                    .then(response => {
                        this.loading = false;
                        //console.log(response.data.data)
                        this.total = response.data.data.total
                        this.query.current = response.data.data.current
                        this.query.size = response.data.data.size
                        this.list = response.data.data.records
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            },
            handleModal (data) {
                if (data) {
                    this.dialogTitle = '编辑任务 - ' + data.jobName
                    this.formData.newData = false;
                    this.formData.jobId = data.jobId;
                    this.formData.jobName = data.jobName;
                    this.formData.jobGroup = data.jobGroup;
                    this.formData.jobType = data.jobType;
                    this.formData.executePath = data.executePath;
                    this.formData.className = data.className;
                    this.formData.methodName = data.methodName;
                    this.formData.methodParamsValue = data.methodParamsValue;
                    this.formData.cronExpression = data.cronExpression;
                    this.formData.misfirePolicy = data.misfirePolicy;
                    this.formData.remark = data.remark;

                } else {
                    this.dialogTitle = '添加任务'
                    this.formData.newData = true;
                    this.formData.jobId = '';
                    this.formData.jobName = '';
                    this.formData.jobGroup = '';
                    this.formData.jobType = '';
                    this.formData.executePath = "";
                    this.formData.className = "";
                    this.formData.methodName = "";
                    this.formData.methodParamsValue = "";
                    this.formData.cronExpression = "";
                    this.formData.misfirePolicy = "";
                    this.formData.remark = "";
                }
                this.dialogVisible = true
            },
            handleModalShutDown() {
                shutdownJobsRa().then(res => {
                    if (res.data.data) {
                        this.getJobList();
                    }
                }).finally(() => {
                    this.saving = false
                })
            },
            handleSizeChange(val) {
                this.query.size = val;
                this.getJobList();
            },
            handleCurrentChange(val) {
                this.query.current = val;
                this.getJobList();
            },
            handleSubmit () {
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        this.saving = true
                        if (!this.formData.newData) {
                            console.log(this.formData)
                            putObj(this.formData).then(res => {
                                if (res.data.data) {
                                    this.dialogVisible = false
                                    this.getJobList();
                                }
                            }).finally(() => {
                                this.saving = false
                            })
                        } else {
                            addObj(this.formData).then(res => {
                                if (res.data.data) {
                                    this.dialogVisible = false
                                    this.getJobList();
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
                if (row.jobId) {
                    this.$confirm("确认删除 " + row.jobName + " 吗?", "提示", {
                        type: "warning"
                    }).then(() => {
                        delObj(row.jobId).then(res => {
                            if (res.data.data) {
                                this.getJobList();
                            }
                        })
                    })
                }
            }
        },
        mounted() {

        }
    }
</script>
<style type="text/scss" lang="scss" scoped>
    .el-input .el-input__count .el-input__count-inner{
        height: 50%;
    }
    @media (min-width: 600px) {
        .zzz {
            display: none;
        }
    }
    .el-image img {
        border-radius: 50%;
    }
    .el-form{
        width: -webkit-fill-available;
    }
</style>
