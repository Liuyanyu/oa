<template>
    <div>
        <div>
            <span class="tit">员工管理 / 总数 : {{total}}</span>
            <el-form :inline="true" :model="query">
                <el-form-item class="search">
                    <el-input clearable v-model="query.username" placeholder="关键字"></el-input>
                </el-form-item>
                <el-form-item class="search">
                    <el-select clearable v-model="query.deptId" placeholder="请选择">
                        <el-option
                            v-for="item in deptOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="search sear">
                    <el-button type="primary" size="medium" v-on:click="getUserList()" icon="el-icon-search">搜索</el-button>
                </el-form-item>
                <el-form-item class="search add">
                    <el-button type="primary" size="medium" @click="handleModal()" v-if="user_btn_add">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="list" stripe border v-loading="listLoading" style="width: 100%;">
            <el-table-column scope="scope" min-width="120" label="头像" class="hidden-phone hidden-xs">
                <template slot-scope="scope">
                    <el-image :src="scope.row.avatar" style="width: 3rem;"/>
                </template>
            </el-table-column>
            <el-table-column prop="username" min-width="120" label="姓名"></el-table-column>
            <el-table-column prop="companyId" min-width="120" label="公司">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.companyId == '' || scope.row.companyId == null" type="warning">未转正</el-tag>
                    <el-tag v-if="scope.row.companyId == 1" type="success">智慧</el-tag>
                    <el-tag v-if="scope.row.companyId == 2" type="">甲板</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="deptName" min-width="120" label="部门" class="hidden-phone"></el-table-column>
            <el-table-column min-width="120" label="角色" class="hidden-phone">
                <template slot-scope="scope">
                    <el-tag
                        v-for="item in scope.row.roleList"
                        :key="item.label"
                        :type="item.type">
                        {{ item.roleName }}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="sex" min-width="120" label="性别" :formatter="formatSex" class="hidden-phone hidden-xs"></el-table-column>
            <el-table-column prop="phone" min-width="120" label="手机号"></el-table-column>
            <el-table-column label="操作" min-width="160">
                <template slot-scope="scope">
                    <el-button v-if="user_btn_edit" size="mini" @click.native="handleModal(scope.row)">编辑</el-button>
                    <el-button v-if="user_btn_del" size="mini" type="danger" @click.native="handleDel(scope.$index, scope.row)">删除</el-button>
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
                   :visible.sync="dialogVisible" :width="'80%'">
            <el-form label-width="80px" :model="formData" :rules="rules" ref="formData">
                <el-form-item label="姓名" prop="username">
                    <el-input type="text" placeholder="请输入姓名" v-model="formData.username" auto-complete="off" maxlength="5"  show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="公司" prop="companyId">
                    <el-radio-group v-model="formData.companyId">
                        <el-radio :label="null">未转正</el-radio>
                        <el-radio :label="1">甲板智慧</el-radio>
                        <el-radio :label="2">甲板数字</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="手机号" prop="phone">
                    <el-input type="text" placeholder="请输入手机号" v-model="formData.phone" auto-complete="off" maxlength="20" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input type="text" placeholder="请输入密码" v-model="formData.password" auto-complete="off" maxlength="11" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sex">
                    <el-radio-group v-model="formData.sex">
                        <el-radio :label="0">男</el-radio>
                        <el-radio :label="1">女</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="部门" prop="deptId">
                    <el-select v-model="formData.deptId" placeholder="请选择">
                        <el-option
                            v-for="item in deptOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="权限" prop="role">
                    <el-select v-model="formData.role" multiple placeholder="请选择">
                        <el-option
                            v-for="item in rolesOptions"
                            :key="item.roleId"
                            :label="item.roleName"
                            :value="item.roleId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="入职日期" prop="joinedTime" class="data">
                    <el-date-picker
                        v-model="formData.joinedTime"
                        :picker-options="pickerOptions"
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="选择日期"
                    style="width: 100%">
                    </el-date-picker>
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
    import {getPageList, addUser, updateUser, deleteUser} from "../../api/admin/user.js";
    import {getList} from "../../api/admin/dept.js";
    import {deptRoleList} from "../../api/other/role.js";
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                circleUrl: "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png",
                query: {
                    username: "",
                    deptId: "",
                    current: 1,
                    size: 10
                },
                pages: 0,
                total: 0,
                defaultImg: '',
                deptOptions: [],
                rolesOptions: [],
                pickerOptions: {
                    disabledDate: (time) => {
                        return this.dealDisabledDate(time)
                    }
                },
                dialogTitle: '',
                listLoading: false,
                dialogVisible: false,
                saving: false,
                list: [],
                user_btn_add: false,
                user_btn_edit: false,
                user_btn_del: false,
                formData:{
                    newData: true,
                    userId:'',
                    companyId:'',
                    username: "",
                    password: '',
                    deptId: "",
                    sex: 0,
                    phone: "",
                    role: "",
                    joinedTime: ""
                },
                rules: {
                    username: [
                        { required: true, message: '请输入姓名', trigger: 'blur' }
                    ],
                    deptId: [
                        { required: true, message: '请选择部门', trigger: 'change' }
                    ],
                    sex: [
                        { required: true, message: '请选择性别', trigger: 'blur' },
                    ],
                    phone: [
                        { required: true, message: '请输入手机号', trigger: 'blur' },
                    ],
                    role: [
                        { required: true, message: '请选择角色', trigger: 'change' }
                    ],
                    joinedTime: [
                        { required: true, message: '请选择入职日期', trigger: 'blur' },
                    ]
                },
            }
        },
        created() {
            this.getDeptList()
            this.getRolelist()
            this.getUserList()
            this.user_btn_add = this.permissions['sys_user_add']
            this.user_btn_edit = this.permissions['sys_user_edit']
            this.user_btn_del = this.permissions['sys_user_del']
        },
        computed: {
            ...mapGetters([
                'permissions'
            ])
        },
        methods:{
            getDeptList(){
                getList()
                    .then(response => {
                        response.data.data.forEach(element => {
                            //console.log(element)
                            this.deptOptions.push({value:element.deptId,label:element.deptName});
                        })
                    });
            },
            getRolelist(){
                deptRoleList().then(response => {
                    this.rolesOptions = response.data.data
                })
            },
            getUserList(){
                this.loading = true;
                getPageList(this.query)
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
                if (this.formData.phone.indexOf('*') > 0) {
                    this.formData.phone = undefined
                }
                if (data) {
                    this.dialogTitle = '编辑员工 - ' + data.username
                    this.formData.newData = false;
                    this.formData.userId = data.userId;
                    this.formData.username = data.username;
                    this.formData.password = '';
                    this.formData.deptId = data.deptId;
                    this.formData.sex = Number(data.sex);
                    this.formData.phone = data.phone;
                    this.formData.role = []
                    for (var i = 0; i < data.roleList.length; i++) {
                        this.formData.role[i] = data.roleList[i].roleId
                    }
                    this.formData.joinedTime = data.joinedTime;
                } else {
                    this.dialogTitle = '添加员工'
                    this.formData.newData = true;
                    this.formData.userId = '';
                    this.formData.username = '';
                    this.formData.password = '';
                    this.formData.deptId = '';
                    this.formData.sex = 0;
                    this.formData.phone = '';
                    this.formData.role = [];
                    this.formData.joinedTime = '2019-12-01';
                }
                this.dialogVisible = true
            },
            // 单独处理时间的函数
            dealDisabledDate (time) {
                return time.getTime() >= Date.now()
            },
            handleSizeChange(val) {
                this.query.size = val;
                this.getUserList();
            },
            handleCurrentChange(val) {
                this.query.current = val;
                this.getUserList();
            },
            formatSex: function (row) {
                return row.sex == 0 ? '男' : row.sex == 1 ? '女' : '未知';
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            handleSubmit () {
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        this.saving = true
                        if (!this.formData.newData) {
                            console.log(this.formData)
                            updateUser(this.formData).then(res => {
                                if (res.data.data) {
                                    this.dialogVisible = false
                                    this.getUserList();
                                }
                            }).finally(() => {
                                this.saving = false
                            })
                        } else {
                            addUser(this.formData).then(res => {
                                if (res.data.data) {
                                    this.dialogVisible = false
                                    this.getUserList();
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
                if (row.userId) {
                    this.$confirm("确认删除 " + row.username + " 吗?", "提示", {
                        type: "warning"
                    }).then(() => {
                        deleteUser(row.userId).then(res => {
                            if (res.data.data) {
                                this.getUserList();
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
    @media screen and (min-width: 330px) and (max-width: 450px) {
        .sear {
             margin-top: -45px;
         }
        .add{
            float: right;
            margin-right: 35px !important;
            margin-top: -45px;
        }
    }
    .el-image img {
        border-radius: 50%;
    }
</style>
