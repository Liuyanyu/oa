<template>
    <div>
        <div class="">
            <span class="tit">客户 / 总数 : {{total}}</span>
            <el-form :inline="true" :model="query">
                <el-form-item>
                    <el-input v-model="query.likeKeyWords" placeholder="关键字"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="medium" v-on:click="getFirstPartPage()" icon="el-icon-search">搜索</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="medium" @click="handleModal()">添加公司信息</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="list" stripe border v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="name" min-width="200" label="公司名称" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="telephone" min-width="200" label="公司电话" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="dutyParagraph" min-width="200" label="税号" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作" min-width="160">
                <template slot-scope="scope">
                    <el-button size="mini" @click.native="handleModal(scope.row)">编辑</el-button>
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
        <!--编辑界面-->
        <el-dialog :title="dialogTitle"  @click="dialogVisible = true"
                   :visible.sync="dialogVisible" :width="'80%'">
            <el-form label-width="80px" :model="formData" :rules="rules" ref="formData">
                <el-form-item label="公司名称" prop="name">
                    <el-input type="text" placeholder="请输入公司名称" v-model="formData.name" auto-complete="off" maxlength="20"  show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="公司注册地址" prop="address">
                    <el-input type="text" placeholder="请输入公司注册地址" v-model="formData.address" auto-complete="off" maxlength="50" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="公司电话" prop="telephone">
                    <el-input type="text" placeholder="请输入公司电话" v-model="formData.telephone" auto-complete="off" maxlength="20" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="税号" prop="dutyParagraph">
                    <el-input type="text" placeholder="请输入税号" v-model="formData.dutyParagraph" auto-complete="off" maxlength="20" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="开户行名称" prop="bankName">
                    <el-input type="text" placeholder="请输入开户行名称" v-model="formData.bankName" auto-complete="off" maxlength="20" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="开户行账号" prop="bankAccount">
                    <el-input type="text" placeholder="请输入开户行账号" v-model="formData.bankAccount" auto-complete="off" maxlength="20" show-word-limit></el-input>
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
    import {getFirstPartPage, addObj, editObj, deleteObj} from "../../../api/customer/firstparty.js";
    import { mapGetters } from 'vuex'
    export default {
        name: "ItemReceipt",
        data() {
            return {
                query: {
                    itemId: null,
                    likeKeyWords: "",
                    current: 1,
                    size: 10
                },
                formData:{
                    newData: true,
                    firstPartyId:null,
                    itemId: null,
                    name:'',
                    address: "",
                    telephone: '',
                    dutyParagraph: "",
                    bankName: "",
                    bankAccount: ""
                },
                dialogTitle: '',
                dialogVisible: false,
                saving: false,
                rules: {
                    name: [
                        {required: true, message: '请输入公司名称', trigger: 'blur'}
                    ],
                    address: [
                        {required: true, message: '请输入公司注册地址', trigger: 'blur'}
                    ],
                    telephone: [
                        {required: true, message: '请输入公司电话', trigger: 'blur'}
                    ],
                    dutyParagraph: [
                        {required: true, message: '请输入税号', trigger: 'blur'}
                    ],
                    bankName: [
                        {required: true, message: '请输入开户行名称', trigger: 'blur'}
                    ],
                    bankAccount: [
                        {required: true, message: '请输入开户行账号', trigger: 'blur'}
                    ]
                },
                pages: 0,
                total: 0,
                listLoading: false,
                list: [],
            }
        },
        created() {
            const itemId = this.$route.params.itemId;
            this.formData.itemId = itemId;
            this.query.itemId = itemId;
            this.getFirstPartPage();
        },
        computed: {
            ...mapGetters([
                'permissions'
            ])
        },
        methods:{
            getFirstPartPage() {
                this.listLoading = true;
                getFirstPartPage(this.query)
                    .then(response => {
                        this.listLoading = false;
                        this.total = response.data.data.total
                        this.query.current = response.data.data.current
                        this.query.size = response.data.data.size
                        this.list = response.data.data.records
                    })
                    .catch(() => {
                        this.listLoading = false;
                    });
            },
            handleSizeChange(val) {
                this.query.size = val;
                this.getFirstPartPage();
            },
            handleCurrentChange(val) {
                this.query.current = val;
                this.getFirstPartPage();
            },
            handleModal (data) {
                if (data) {
                    this.dialogTitle = '编辑公司 - ' + data.name
                    this.formData.newData = false;
                    this.formData.firstPartyId = data.firstPartyId;
                    this.formData.name = data.name;
                    this.formData.address = data.address;
                    this.formData.telephone = data.telephone;
                    this.formData.dutyParagraph = data.dutyParagraph;
                    this.formData.bankName = data.bankName;
                    this.formData.bankAccount = data.bankAccount;
                } else {
                    this.dialogTitle = '添加公司'
                    this.formData.newData = true;
                    this.formData.firstPartyId = '';
                    this.formData.name = '';
                    this.formData.address = "";
                    this.formData.telephone = '';
                    this.formData.dutyParagraph = '';
                    this.formData.bankName = "";
                    this.formData.bankAccount = '';
                }
                this.dialogVisible = true
            },
            handleSubmit () {
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        this.saving = true
                        if (!this.formData.newData) {
                            console.log(this.formData)
                            editObj(this.formData).then(res => {
                                if (res.data.data) {
                                    this.dialogVisible = false
                                    this.getFirstPartPage();
                                }
                            }).finally(() => {
                                this.saving = false
                            })
                        } else {
                            addObj(this.formData).then(res => {
                                if (res.data.data) {
                                    this.dialogVisible = false
                                    this.getFirstPartPage();
                                }
                            }).finally(() => {
                                this.saving = false
                            })
                        }
                    }
                })
            },
            handleDel(index, row) {
                if (row.companyId) {
                    this.$confirm("确认删除吗?", "提示", {
                        type: "warning"
                    }).then(() => {
                        deleteObj(row.companyId).then(res => {
                            if (res.data.data) {
                                this.getFirstPartPage();
                            }
                        })
                    })
                }
            }
        }
    }
</script>

<style scoped>

</style>
