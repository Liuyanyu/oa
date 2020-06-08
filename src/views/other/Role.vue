<template>
    <div>
        <div class="deptBox">
            <span class="dept">角色管理 / 总数 : {{total}}</span>
            <el-button type="primary" class="right" @click="handleModal()" v-if="role_btn_add">+ 添加新角色</el-button>
        </div>
        <el-table :data="list" stripe border v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="roleName" min-width="150" label="角色名称"></el-table-column>
            <el-table-column prop="roleCode" min-width="150" label="角色标识"></el-table-column>
            <el-table-column prop="roleDesc" min-width="150" label="角色描述"></el-table-column>
            <el-table-column prop="createTime" min-width="180" label="创建时间"></el-table-column>
            <el-table-column label="操作" min-width="240">
                <template slot-scope="scope">
                    <el-button v-if="role_btn_edit" size="mini" @click.native="handleModal(scope.row)">编辑</el-button>
                    <el-button v-if="role_btn_del" size="mini" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                    <el-button v-if="role_btn_perm" size="mini" type="success" @click="handlePermission(scope.$index, scope.row)">权限</el-button>
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
                <el-form-item label="角色名称" prop="roleName">
                    <el-input type="text" placeholder="请输入角色名称" v-model="formData.roleName" auto-complete="off" maxlength="10"  show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="角色标识" prop="roleCode">
                    <el-input type="text" placeholder="请输入角色标识" v-model="formData.roleCode" auto-complete="off" maxlength="20" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input type="text" placeholder="请输入角色描述" v-model="formData.roleDesc" auto-complete="off" maxlength="50" show-word-limit></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit" :loading="saving">提交</el-button>
            </div>
        </el-dialog>

        <el-dialog
            :visible.sync="dialogPermissionVisible"
            :close-on-click-modal="false"
            title="分配权限">
            <div class="dialog-main-tree">
                <el-tree
                    ref="menuTree"
                    :data="treeData"
                    :default-checked-keys="checkedKeys"
                    :check-strictly="false"
                    :props="defaultProps"
                    :filter-node-method="filterNode"
                    class="filter-tree"
                    node-key="id"
                    highlight-current
                    show-checkbox
                    default-expand-all/>
            </div>
            <div slot="footer"
                 class="dialog-footer">
                <el-button
                    type="primary"
                    size="small"
                    @click="updatePermession(roleId)">更 新
                </el-button>
                <el-button
                    type="default"
                    size="small"
                    @click="cancal()">取消</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    import {getPageList, addRole, updateRole, deleteRole, permissionUpd, fetchRoleTree} from "../../api/other/role.js";
    import {fetchMenuTree} from "../../api/other/menu.js";
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                query: {
                    current: 1,
                    size: 10
                },
                pages: 0,
                total: 0,
                defaultImg: '',
                deptOptions: [],
                roleList: [
                    {
                        value: "1",
                        label: '管理员'
                    }
                ],
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
                role_btn_add: false,
                role_btn_edit: false,
                role_btn_del: false,
                role_btn_perm: false,
                formData:{
                    newData: true,
                    roleId:'',
                    roleName: "",
                    roleCode: "",
                    roleDesc: "",
                    dsType: 2
                },
                treeData: [],
                checkedKeys: [],
                checkedDsScope: [],
                defaultProps: {
                    label: 'name',
                    value: 'id'
                },
                roleId: undefined,
                roleCode: undefined,
                rolesOptions: undefined,
                dialogPermissionVisible: false,
                rules: {
                    roleName: [
                        { required: true, message: '请输入角色名称', trigger: 'blur' }
                    ],
                    roleCode: [
                        { required: true, message: '请输入角色标识', trigger: 'blur' }
                    ],
                    roleDesc: [
                        { required: true, message: '请输入角色描述', trigger: 'blur' },
                    ]
                },
            }
        },
        created() {
            this.getRoleList()
            this.role_btn_add = this.permissions['sys_role_add']
            this.role_btn_edit = this.permissions['sys_role_edit']
            this.role_btn_del = this.permissions['sys_role_del']
            this.role_btn_perm = this.permissions['sys_role_perm']
        },
        computed: {
            ...mapGetters([
                'permissions'
            ])
        },
        methods:{
            getRoleList(){
                this.loading = true;
                getPageList(this.query)
                    .then(response => {
                        this.loading = false;
                        //console.log(response.data.data.records)
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
                    this.dialogTitle = '编辑角色 - ' + data.roleName
                    this.formData.newData = false;
                    this.formData.roleId = data.roleId;
                    this.formData.roleName = data.roleName;
                    this.formData.roleCode = data.roleCode;
                    this.formData.roleDesc = data.roleDesc;
                } else {
                    this.dialogTitle = '添加角色'
                    this.formData.newData = true;
                    this.formData.roleId = '';
                    this.formData.roleName = '';
                    this.formData.roleCode = '';
                    this.formData.roleDesc = '';
                }
                this.dialogVisible = true
            },
            // 单独处理时间的函数
            dealDisabledDate (time) {
                return time.getTime() >= Date.now()
            },
            handleSizeChange(val) {
                this.query.size = val;
                this.getRoleList();
            },
            handleCurrentChange(val) {
                this.query.current = val;
                this.getRoleList();
            },
            selsChange: function (sels) {
                this.sels = sels;
            },
            handleSubmit () {
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        this.saving = true
                        if (!this.formData.newData) {
                            updateRole(this.formData).then(res => {
                                if (res.data.data) {
                                    this.dialogVisible = false
                                    this.getRoleList();
                                }
                            }).finally(() => {
                                this.saving = false
                            })
                        } else {
                            addRole(this.formData).then(res => {
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
                if (row.roleId) {
                    this.$confirm("确认删除 " + row.roleName + " 吗?", "提示", {
                        type: "warning"
                    }).then(() => {
                        deleteRole(row.roleId).then(res => {
                            if (res.data.data) {
                                this.getRoleList();
                            }
                        })
                    })
                }
            },
            handlePermission(index, row){
                if (row.roleId) {
                    fetchRoleTree(row.roleId)
                        .then(response => {
                        this.checkedKeys = response.data.data
                        return fetchMenuTree()
                        })
                        .then(response => {
                            this.treeData = response.data.data
                            //console.log(this.treeData)
                            // 解析出所有的太监节点
                            this.checkedKeys = this.resolveAllEunuchNodeId(this.treeData, this.checkedKeys, [])
                            this.dialogPermissionVisible = true
                            this.roleId = row.roleId
                            this.roleCode = row.roleCode
                        })
                }
            },
            /**
             * 解析出所有的太监节点id
             * @param json 待解析的json串
             * @param idArr 原始节点数组
             * @param temp 临时存放节点id的数组
             * @return 太监节点id数组
             */
            resolveAllEunuchNodeId(json, idArr, temp) {
                for (let i = 0; i < json.length; i++) {
                    const item = json[i]
                    // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
                    if (item.children && item.children.length !== 0) {
                        this.resolveAllEunuchNodeId(item.children, idArr, temp)
                    } else {
                        temp.push(idArr.filter(id => id === item.id))
                    }
                }
                return temp
            },
            filterNode(value, data) {
                if (!value) return true
                return data.label.indexOf(value) !== -1
            },
            getNodeData(data, done) {
                done()
            },
            cancal () {
                this.dialogPermissionVisible = false;
            },
            updatePermession (roleId) {
                this.menuIds = ''
                this.menuIds = this.$refs.menuTree.getCheckedKeys().join(',').concat(',').concat(this.$refs.menuTree.getHalfCheckedKeys().join(','))
                permissionUpd(roleId, this.menuIds).then(() => {
                    this.dialogPermissionVisible = false
                    //this.$store.dispatch('GetMenu', false)
                    this.$notify.success('修改成功')
                })
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
