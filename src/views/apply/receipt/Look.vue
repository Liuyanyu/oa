<template>
    <div>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm form" style="text-align: left;">
            <el-form-item label="项目" prop="region">
                <el-select v-model="ruleForm.region" placeholder="请选择项目">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="公司" prop="region">
                <el-select v-model="ruleForm.region" placeholder="请选择公司">
                    <el-option label="北京甲板智慧科技有限公司" value="smart"></el-option>
                    <el-option label="北京甲板数字科技有限公司" value="num"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发票" prop="region">
                <el-select v-model="ruleForm.region" placeholder="请选择发票类型">
                    <el-option label="专票" value="smart"></el-option>
                    <el-option label="普票" value="num"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="金额" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="公司名称" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="税号" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="公司地址" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="银行开户行" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="开户行账号" prop="name">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="开票内容" prop="name" placeholder="例:技术咨询，软件开发，技术服务">
                <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
            <el-form-item label="是否与对方确认">
                <el-checkbox-group v-model="ruleForm.name">
                    <el-checkbox label="是否与对方确认" name="type"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item style="text-align: center">
                <el-button size="mini" type="primary" v-if="scope.row.status != 1" @click.native="lookModal(scope.row)">查看</el-button>
                <el-button type="primary" @click="submitForm('ruleForm')">保存</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import {getApplyUserInfo} from "../../../api/admin/user.js";
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                ruleForm: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                rules: {
                    name: [
                        {required: true, message: '请输入活动名称', trigger: 'blur'},
                        {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
                    ],
                    region: [
                        {required: true, message: '请选择活动区域', trigger: 'change'}
                    ],
                }
            }
        },
        created() {

        },
        computed: {
            ...mapGetters([
                'permissions','userId'
            ])
        },
        methods:{
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        alert('submit!');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
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
    @media screen and (min-width: 600px) {
        .form {
            margin-left: 60px;
        }
    }
</style>
