<template>
    <div class="login-container">
        <el-form class="card-box login-form" autoComplete="on" :model="ruleForm" :rules="rules" ref="ruleForm"
                 label-position="left">
            <h3 class="title">系统登录</h3>
            <el-form-item prop="username" class="item" style="height: 40px">
                <el-input
                    placeholder="姓名或手机号"
                    name="username"
                    autoComplete="on"
                    v-model="ruleForm.username">
                    <i slot="prefix" class="el-input__icon"><icon-svg icon-class="user"/></i>
                </el-input>
            </el-form-item>
            <el-form-item prop="password" class="item" style="height: 40px">
                <el-input
                    placeholder="密码"
                    name="pwd" :type="isShowPwd ? 'text' : 'password'"
                    @keyup.enter.native="handleLogin"
                    v-model="ruleForm.password"
                    autoComplete="on">
                    <i slot="prefix" class="el-input__icon"><icon-svg icon-class="pwd"/></i>
                    <i slot="suffix" class="el-input__icon" @click='isShowPwd = !isShowPwd'><icon-svg icon-class="eye"/></i>
                </el-input>
            </el-form-item>
            <el-form-item prop="code" style="height: 40px">
                <el-row :span="24">
                    <el-col :span="16">
                        <el-input
                            :maxlength="code.len"
                            v-model="ruleForm.code"
                            size="small"
                            auto-complete="off"
                            placeholder="请输入验证码">
                            <i slot="prefix" class="el-input__icon"><icon-svg icon-class="pwd"/></i>
                        </el-input>
                    </el-col>
                    <el-col :span="8">
                        <div class="login-code">
                            <span v-if="code.type == 'text'" class="login-code-img" @click="refreshCode">{{ code.value }}</span>
                            <img v-else :src="code.src" class="login-code-img" @click="refreshCode" >
                        </div>
                    </el-col>
                </el-row>
            </el-form-item>
            <div>
                <el-button type="primary" style="width:100%;margin-bottom:25px;" :loading="loading"
                           @click.native="handleLogin()">登录
                </el-button>
            </div>
            <div>
                <img src="../../assets/image/wx.png" style="width: 18%;margin-left: 20%"/>
                <img src="../../assets/image/qq.png" style="width: 18%;float: right;right: 0;margin-right: 20%"/>
                <!--                <el-button type="primary" style="width:100%;margin-bottom:30px;"-->
                <!--                           @click='showDialog = true'>-->
                <!--                    第三方登录-->
                <!--                </el-button>-->
            </div>
        </el-form>

        <el-dialog title="第三方验证" :visible.sync="showDialog">
            邮箱登录成功,请选择第三方验证<br/>
        </el-dialog>

    </div>
</template>

<script>
    import { randomLenNum } from '@/utils/utils'
    import { codeUrl }  from '@/config/app'
    export default {
        name: 'login',
        data() {
            return {
                ruleForm: {
                    username: "栗学魁", //用户名
                    password: "123456",
                    code: '',
                    randomStr: ''
                },
                checked: true,
                code: {
                    src: '/code',
                    value: '',
                    len: 4,
                    type: 'text'
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, message: '密码长度最少为6位', trigger: 'blur' }
                    ],
                    code: [
                        { required: true, message: '请输入验证码', trigger: 'blur' },
                        { min: 4, max: 4, message: '验证码长度为4位', trigger: 'blur' }
                    ]
                },
                isShowPwd: false, // 是否显示密码
                loading: false, // 登录loading
                showDialog: false, // 显示dialog
                redirect: null, // 回调地址
                codeUrl:codeUrl
            };
        },
        created() {
            // 将参数拷贝进查询对象
            let query = this.$route.query;
            if (query.redirect) {
                // URL Encode
                this.redirect = decodeURIComponent(query.redirect);
            }
            this.refreshCode()
        },
        methods: {
            refreshCode() {

                this.ruleForm.code = '';
                this.ruleForm.randomStr = randomLenNum(this.code.len, true);
                this.code.type === 'text'
                    ? (this.code.value = randomLenNum(this.code.len))
                    : (this.code.src = `${this.codeUrl}?randomStr=${this.ruleForm.randomStr}`)
                this.ruleForm.code = this.code.value;
            },
            handleLogin() {
                this.$refs["ruleForm"].validate(valid => {
                    if (valid) {
                        this.loading = true;
                        this.$store
                            .dispatch("loginName", this.ruleForm)
                            .then(response => {
                                this.loading = false;
                                // if (response.code) {
                                //     this.$message.error(response.message);
                                //     return;
                                // }
                                let path = "/";
                                // if (this.redirect) {
                                //     path = this.redirect;
                                // }
                                this.$router.push({
                                    path: path
                                });
                                //console.log(path)
                                //window.location.replace(path);
                                // this.showDialog = true
                            })
                            .catch(() => {
                                this.loading = false;
                            });
                    } else {
                        return false;
                    }
                });
            }
        }
    };
</script>

<style type="text/scss" lang="scss">
    @import "../../styles/mixin";

    $bg: #2d3a4b;
    $dark_gray: #889aa4;
    $light_gray: #eee;
    .login-container {
        @include relative;
        height: 100%;
        background-color: $bg;
        input:-webkit-autofill {
            -webkit-box-shadow: 0 0 0 1000px #293444 inset !important;
            -webkit-text-fill-color: #fff !important;
        }
        .item {
            .el-form-item__content {
                display: flex;
                flex-flow: row;
            }
        }
        input {
            background: transparent;
            border: 0;
            -webkit-appearance: none;
            border-radius: 0;
            padding: 0.46rem 0.0666rem 0.16rem 0.2rem;
            color: $light_gray;
            height: 100%;
        }
        .el-input {
            display: inline-block;
        }
        .tips {
            font-size: 14px;
            color: #fff;
            margin-bottom: 0.13333rem;
        }
        .svg-container {
            padding: 0.08rem 0.0666rem 0.08rem 0.2rem;
            color: $dark_gray;
            vertical-align: middle;
            display: inline-block;
            &_login {
                font-size: 20px;
            }
        }
        .title {
            font-size: 26px;
            color: $light_gray;
            margin: 0 auto 0.5333rem auto;
            text-align: center;
            font-weight: bold;
            letter-spacing: 5px;
        }
        .login-form {
            @include fxied-center;
            top: 40%;
            width: 22em;
            padding: 1.4666rem 1.4666rem 1.2rem 1.4666rem;
            box-shadow: 0px 0px 5px 3px #888888;
            border-radius: 10px;
        }
        .el-form-item {
            border: 1px solid rgba(255, 255, 255, 0.1);
            background: rgba(0, 0, 0, 0.1);
            border-radius: 0.0666rem;
            color: #454545;
        }
        .show-pwd {
            position: absolute;
            right: 0.1333rem;
            top: 0.09333rem;
            font-size: 16px;
            color: $dark_gray;
            cursor: pointer;
        }
        .thirdparty-button {
            /*position: absolute;*/
            /*right: .4666rem;*/
            /*bottom: .37333rem;*/
        }
        .login-code-img{
            width: 70px;
            margin-top: 5px;
            margin-left: 15%
        }
    }
</style>
