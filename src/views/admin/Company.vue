<template>
    <div>
        <div class="titBox">
            <span class="tit">公司管理 / 总数 : {{number}}</span>
<!--            <el-button type="primary" class="right" @click="dialogFormVisible = true" v-if="company_btn_add">+ 添加新公司</el-button>-->
        </div>
        <el-table :data="list" stripe border v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="name" label="名称"></el-table-column>
            <el-table-column prop="address" label="注册地址" class="hidden-phone hidden-xs"></el-table-column>
            <el-table-column prop="dutyParagraph" label="税号"></el-table-column>
            <el-table-column prop="bankName" label="开户行名称" class="hidden-phone hidden-xs"></el-table-column>
            <el-table-column prop="bankAccount" label="开户行账号" class="hidden-phone hidden-xs"></el-table-column>
        </el-table>
        <el-dialog title="添加"  :visible.sync="dialogFormVisible" :width="'80%'">
            <el-form ref="form" :model="form" label-width="100px">
                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="注册地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="税号">
                    <el-input v-model="form.duty"></el-input>
                </el-form-item>
                <el-form-item label="开户行名称">
                    <el-input v-model="form.bankName"></el-input>
                </el-form-item>
                <el-form-item label="开户行账号">
                    <el-input v-model="form.bankNumber"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit">提 交</el-button>
                <el-button @click="dialogFormVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {getList} from "../../api/admin/company.js";
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                listLoading: false,
                dialogFormVisible: false,
                list: [],
                form: {
                    name: '',
                    address: '',
                    duty: '',
                    bankName: '',
                    bankNumber:''
                },
                company_btn_add: false,
                number:'',
                width:{
                    type:String,
                    default:'80%'
                }
            }
        },
        created() {
            this.getCompanyList()
            this.company_btn_add = this.permissions['sys_company_add']
        },
        computed: {
            ...mapGetters([
                'permissions'
            ])
        },
        methods:{
            getCompanyList(){
                this.loading = true;
                getList(null)
                    .then(response => {
                        this.loading = false;
                        this.list = response.data.data;
                        console.log(this.list)
                        this.number = this.list.length
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            },
            submit(){
                var that = this
                that.dialogFormVisible = false
                that.users.push({
                    ...that.form
                })
            }
        },
        mounted() {

        }
    }
</script>
<style type="text/scss" lang="scss">

</style>
