<template>
    <div>
        <div class="deptBox">
            <span class="dept">部门管理 / 总数 : {{number}}</span>
            <el-button type="primary" class="right" @click="handleModal()"  v-if="dept_btn_add">+ 添加新部门</el-button>
        </div>
        <el-table :data="list" stripe border v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="deptName" min-width="120" label="名称"></el-table-column>
            <el-table-column prop="userName" min-width="120" label="负责人"></el-table-column>
            <el-table-column prop="sort" min-width="120" label="排序" class="hidden-phone hidden-xs"> </el-table-column>
            <el-table-column label="操作" min-width="160">
                <template slot-scope="scope">
                    <el-button v-if="dept_btn_edit" size="mini" @click.native="handleModal(scope.row)">编辑</el-button>
                    <el-button v-if="dept_btn_del" size="mini" type="danger" @click.native="handleDel(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :width="'80%'">
            <el-form :model="formData" :rules="rules" ref="formData" label-width="80px">
                <el-form-item label="名称" prop="deptName">
                    <el-input v-model="formData.deptName"></el-input>
                </el-form-item>
                <el-form-item label="负责人" prop="userId">
                    <el-select v-model="formData.userId" placeholder="请选择">
                        <el-option
                            v-for="item in userOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input v-model="formData.sort"></el-input>
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
    import {getList, addDept, updateDept, deleteDept} from "../../api/admin/dept.js";
    import {getUserList} from "../../api/admin/user.js";
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                dialogTitle: '',
                listLoading: false,
                dialogVisible: false,
                saving: false,
                list: [],
                formData: {
                    deptId: '',
                    deptName: '',
                    userId: '',
                    userName: '',
                    sort: '',
                },
                userOptions: [],
                dept_btn_add: false,
                dept_btn_edit: false,
                dept_btn_del: false,
                number:'',
                width:{
                   type:String,
                   default:'80%'
                },
                rules: {
                    deptName: [
                        { required: true, message: '请输入名称', trigger: 'blur' }
                    ],
                    userId: [
                        { required: true, message: '请选择负责人', trigger: 'change' }
                    ],
                    sort: [
                        { required: true, message: '请输入排序', trigger: 'blur' },
                    ]
                },
            }
        },
        created() {
            this.getUserList()
            this.getDepartList()
            this.dept_btn_add = this.permissions['sys_dept_add']
            this.dept_btn_edit = this.permissions['sys_dept_edit']
            this.dept_btn_del = this.permissions['sys_dept_del']
            console.log(this.dept_btn_add)
        },
        computed: {
            ...mapGetters([
                'permissions'
            ])
        },
        methods:{
            getUserList(){
                getUserList()
                    .then(response => {
                        response.data.data.forEach(element => {
                            //console.log(element)
                            this.userOptions.push({value:element.userId,label:element.username});

                        })
                    });
            },
            getDepartList(){
                this.loading = true;
                getList(null)
                    .then(response => {
                        this.loading = false;
                        this.list = response.data.data;
                        this.number = this.list.length
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            },

            handleModal (data) {
                if (data) {
                    this.dialogTitle = '编辑部门 - ' + data.deptName
                    this.formData.newData = false;
                    this.formData.deptId = data.deptId;
                    this.formData.deptName = data.deptName;
                    this.formData.userId = data.userId;
                    this.formData.userName = data.userName;
                    this.formData.sort = data.sort;
                } else {
                    this.dialogTitle = '添加部门'
                    this.formData.newData = true;
                    this.formData.userId = '';
                    this.formData.deptName = '';
                    this.formData.userId = '';
                    this.formData.userName = '';
                    this.formData.sort = '';
                }
                this.dialogVisible = true
            },
            handleSubmit () {
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        this.saving = true
                        if (!this.formData.newData) {
                            updateDept(this.formData).then(res => {
                                if (res.data.data) {
                                    this.dialogVisible = false
                                    this.getDepartList();
                                }
                            }).finally(() => {
                                this.saving = false
                            })
                        } else {
                            addDept(this.formData).then(res => {
                                if (res.data.data) {
                                    this.dialogVisible = false
                                    this.getDepartList();
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
                if (row.deptId) {
                    this.$confirm("确认删除 " + row.deptName + " 吗?", "提示", {
                        type: "warning"
                    }).then(() => {
                        deleteDept(row.deptId).then(res => {
                            if (res.data.data) {
                                this.getDepartList();
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

<style type="text/scss" lang="scss">
    /*>>>.el-form-item__label{*/
    /*    width: 60px;*/
    /*}*/
</style>
