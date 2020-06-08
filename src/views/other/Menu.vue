<template>
    <div>
        <div class="titBox">
            <span class="tit">菜单管理</span>
        </div>
        <el-table :data="list"
                  stripe
                  border
                  v-loading="listLoading"
                  style="width: 100%;"
                  row-key="id"
                  :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column prop="id" min-width="120" label="菜单id"></el-table-column>
            <el-table-column prop="name" min-width="100" label="菜单名称"></el-table-column>
            <el-table-column prop="code" min-width="120" label="菜单权限标识"></el-table-column>
            <el-table-column prop="parentId" min-width="80" label="菜单父id"></el-table-column>
            <el-table-column prop="icon" min-width="120" label="菜单图标"></el-table-column>
            <el-table-column prop="path" min-width="150" label="前端路由标识路径"></el-table-column>
            <el-table-column prop="sort" min-width="50" label="排序"></el-table-column>
            <el-table-column min-width="100" label="菜单类型">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.type == 0" type="success">菜单</el-tag>
                    <el-tag v-if="scope.row.type == 1" effect="dark" type="">按钮</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="180">
                <template slot-scope="scope">
                    <el-button v-if="role_btn_add && scope.row.type == 0" size="mini" @click.native="handleModalAdd(scope.row)" icon="el-icon-plus"></el-button>
                    <el-button v-if="role_btn_edit" size="mini" type="primary" @click.native="handleModalEdit(scope.row)" icon="el-icon-edit"></el-button>
                    <el-button v-if="role_btn_del" size="mini" type="danger" @click.native="handleDel(scope.$index, scope.row)" icon="el-icon-delete"></el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--编辑界面-->
        <el-dialog :title="dialogTitle"  @click="dialogVisible = true"
                   :visible.sync="dialogVisible">
            <el-form label-width="80px" :model="formData" :rules="rules" ref="formData">
                <el-form-item label="父级节点">
                    <el-input type="text" placeholder="请输入父级节点" :disabled="true" v-model="formData.parentId" auto-complete="off" maxlength="50"  show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="节点ID" prop="menuId">
                    <el-input type="text" placeholder="请输入节点ID" v-model="formData.menuId" auto-complete="off" maxlength="50" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="标题" prop="name">
                    <el-input type="text" placeholder="请输入标题" v-model="formData.name" auto-complete="off" maxlength="50" show-word-limit></el-input>
                </el-form-item>
                <el-form-item
                    label="类型"
                    prop="type">
                    <el-radio v-model="formData.type" label="0">菜单</el-radio>
                    <el-radio v-model="formData.type" label="1">按钮</el-radio>
                </el-form-item>
                <el-form-item label="地址" v-if="formData.type === '0'">
                    <el-input type="text" placeholder="请输入地址" v-model="formData.path" auto-complete="off" maxlength="20" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="图标" v-if="formData.type === '0'">
                    <el-input type="text" placeholder="请输入图标" v-model="formData.icon" auto-complete="off" maxlength="20" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="排序" v-if="formData.type === '0'">
                    <el-input type="text" placeholder="请输入排序" v-model="formData.sort" auto-complete="off" maxlength="10" show-word-limit></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit" :loading="saving">提交</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {fetchMenuTree, addObj, updateObj, deleteObj} from "../../api/other/menu.js";
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                dialogTitle: '',
                listLoading: false,
                dialogVisible: false,
                saving: false,
                list: [],
                role_btn_add: false,
                role_btn_edit: false,
                role_btn_del: false,
                formData:{
                    newData: true,
                    parentId:'',
                    menuId:'',
                    name: "",
                    type: "",
                    path: "",
                    icon: "",
                    sort: ""
                },
                rules: {
                    menuId: [
                        { required: true, message: '请输入节点ID', trigger: 'blur' }
                    ],
                    name: [
                        { required: true, message: '请输入标题', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请选择类型', trigger: 'blur' },
                    ]
                },
            }
        },
        created() {
            this.getRoleList()
            this.role_btn_add = this.permissions['sys_role_add']
            this.role_btn_edit = this.permissions['sys_role_edit']
            this.role_btn_del = this.permissions['sys_role_del']
        },
        computed: {
            ...mapGetters([
                'permissions'
            ])
        },
        methods:{
            getRoleList(){
                this.loading = true;
                fetchMenuTree()
                    .then(response => {
                        this.loading = false;
                        this.list = response.data.data
                        console.log(this.list)
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            },
            handleModalAdd (data){
                this.dialogTitle = '添加菜单'
                this.formData.newData = true;
                this.formData.parentId = data.id;
                this.formData.menuId = "";
                this.formData.name = "";
                this.formData.type = "";
                this.formData.path = "";
                this.formData.icon = "";
                this.formData.sort = "";
                this.dialogVisible = true
            },
            handleModalEdit (data) {
                this.dialogTitle = '编辑菜单 - ' + data.name
                this.formData.newData = false;
                this.formData.parentId = data.parentId;
                this.formData.menuId = data.id;
                this.formData.name = data.name;
                this.formData.type = data.type;
                this.formData.path = data.path;
                this.formData.icon = data.icon;
                this.formData.sort = data.sort;
                this.dialogVisible = true
            },
            handleSizeChange(val) {
                this.query.size = val;
                this.getPageList();
            },
            handleCurrentChange(val) {
                this.query.current = val;
                this.getPageList();
            },
            handleSubmit () {
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        this.saving = true
                        if (!this.formData.newData) {
                            updateObj(this.formData).then(res => {
                                if (res.data.data) {
                                    this.dialogVisible = false
                                    this.getRoleList();
                                }
                            }).finally(() => {
                                this.saving = false
                            })
                        } else {
                            addObj(this.formData).then(res => {
                                if (res.data.data) {
                                    this.dialogVisible = false
                                    this.getRoleList();
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
                console.log(row)
                if (row.id) {
                    this.$confirm("确认删除 " + row.name + " 吗?", "提示", {
                        type: "warning"
                    }).then(() => {
                        deleteObj(row.id).then(res => {
                            if (res.data.data) {
                                this.getRoleList();
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
</style>
