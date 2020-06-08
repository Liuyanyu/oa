<template>
    <div style="max-width: 800px;">
        <el-button @click="backHistory" class="back">返回</el-button>
        <div class="title" style=" margin-top: -40px;margin-bottom: 20px;">
            <p class="name">开票申请单</p>
            <table border="0" cellspacing="0" cellpadding="0" v-if="receiptInfo">
                <tr>
                    <td style="width: 35%;">项目</td>
                    <td v-if="receiptInfo.alias != null">{{receiptInfo.alias}}</td>
                    <td v-else>与项目无关</td>
                </tr>
                <tr>
                    <td>申请人</td>
                    <td>{{receiptInfo.applyUserName}}</td>
                </tr>
                <tr>
                    <td>开票公司</td>
                    <td v-if="receiptInfo.companyId == 1">北京甲板智慧科技有限公司</td>
                    <td v-if="receiptInfo.companyId == 2">北京甲板数字科技有限公司</td>
                </tr>
                <tr>
                    <td>发票类型</td>
                    <td v-if="receiptInfo.type == 1">专票</td>
                    <td v-if="receiptInfo.type == 2">普票</td>
                </tr>
                <tr>
                    <td>公司名称</td>
                    <td>{{receiptInfo.name}}</td>
                </tr>
                <tr>
                    <td>公司税号</td>
                    <td>{{receiptInfo.dutyParagraph}}</td>
                </tr>
                <tr v-if="receiptInfo.type == 1">
                    <td>公司注册地址</td>
                    <td>{{receiptInfo.address}}</td>
                </tr>
                <tr v-if="receiptInfo.type == 1">
                    <td>公司电话</td>
                    <td>{{receiptInfo.telephone}}</td>
                </tr>
                <tr v-if="receiptInfo.type == 1">
                    <td>开户行名称</td>
                    <td>{{receiptInfo.bankName}}</td>
                </tr>
                <tr v-if="receiptInfo.type == 1">
                    <td>开户行账号</td>
                    <td>{{receiptInfo.bankAccount}}</td>
                </tr>
                <tr>
                    <td>开票百分比</td>
                    <td>{{receiptInfo.proportion}} %</td>
                </tr>
                <tr>
                    <td>开票金额</td>
                    <td>{{receiptInfo.priceYuan}} 元</td>
                </tr>
                <tr>
                    <td>开票内容</td>
                    <td v-if="receiptInfo.content == 11">*研发和技术服务*专业技术服务</td>
                    <td v-if="receiptInfo.content == 12">*研发和技术服务*软件开发</td>
                    <td v-if="receiptInfo.content == 13">*设计服务*专业设计服务</td>
                    <td v-if="receiptInfo.content == 14">*其他咨询服务*其他咨询服务</td>
                    <td v-if="receiptInfo.content == 21">*印刷品*图片、设计图样及照片</td>
                    <td v-if="receiptInfo.content == 22">*软件*系统软件产品</td>
                    <td v-if="receiptInfo.content == 23">*硬件*</td>
                </tr>
                <tr v-if="receiptInfo.content == 23">
                    <td>产品清单</td>
                    <td><a :href="receiptInfo.detailedList">下载</a></td>
                </tr>
                <tr>
                    <td>是否与对方确认</td>
                    <td v-if="receiptInfo.isAffirm == 0"><el-tag type="danger">否</el-tag></td>
                    <td v-if="receiptInfo.isAffirm == 1"><el-tag type="success">是</el-tag></td>
                </tr>
                <tr>
                    <td>状态</td>
                    <td v-if="receiptInfo.status == 0"><el-tag type="warning">审批中</el-tag></td>
                    <td v-if="receiptInfo.status == 1"><el-tag type="success">已同意</el-tag></td>
                    <td v-if="receiptInfo.status == 2"><el-tag type="danger">已拒绝</el-tag></td>
                </tr>
                <tr>
                    <td>申请时间</td>
                    <td>{{receiptInfo.createTime}}</td>
                </tr>
            </table>
        </div>
        <div>
            <p class="name">审批结果</p>
        </div>
        <div class="result" v-for="approver in approverList">
            <el-avatar size="medium" :src="approver.checkUserAvatar" class="avatar"></el-avatar>
            <span class="username" style="color: #65CEA7;">
                {{approver.checkUserName}}
                <i class="el-icon-time" style="color: #000;margin-left: 10px;margin-right: 5px" v-if="approver.check > 0"></i>
                <span style="color: #000" v-if="approver.check > 0">{{approver.updateTime}}</span>
            </span>
            <span style="color: #000000;margin-top: 45px;position: absolute;font-size: 12px">审批意见：{{approver.summary}}</span>
            <div>
                <span v-if="approver.check == 0 && approver.isBeing == 1">
                    <el-tag class="checkSty" type="warning"><i class="el-icon-loading" style="margin-right:5px"></i>审批中</el-tag>
                </span>
                <span v-if="approver.check == 0 && approver.isBeing == 0">
                    <el-tag class="checkSty" type=""><i class="el-icon-loading" style="margin-right:5px"></i>待审批</el-tag>
                </span>
                <span v-if="approver.check == 1">
                    <el-tag class="checkSty" type="success"><i class="el-icon-success" style="margin-right:5px"></i>已同意</el-tag>
                </span>
                <span v-if="approver.check == 2">
                    <el-tag class="checkSty" type="danger"><i class="el-icon-error" style="margin-right:5px"></i>已拒绝</el-tag>
                </span>
            </div>
        </div>
        <div v-if="showCheck">
            <div class="title left">
                <p class="name">审批</p>
            </div>
            <el-alert
                title="审批流程不可逆转"
                type="warning">
            </el-alert>
            <el-form :model="formData" :rules="rules" ref="formData" label-width="100px" class="demo-ruleForm res" style="width: 100%">

                <el-radio-group v-model="formData.check" @change="selectChcek"  style="margin-top: 10px;margin-left: 20px">
                    <el-radio label="1">同意</el-radio>
                    <el-radio label="2">拒绝</el-radio>
                </el-radio-group>
                <el-form-item prop="summary" style="margin-left: -100px;margin-top: 10px">
                    <el-input type="textarea" v-model="formData.summary" placeholder="请填写原因" maxlength="30" show-word-limit></el-input>
                </el-form-item>
                <el-form-item >
                    <el-button type="success" class="submit"  @click="onSubmit" :loading="saving">提交</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import {getReceiptInfo, getReceiptApproverList, updateReceiptApprover} from "../../../api/apply/receipt.js";
    import { mapGetters } from 'vuex'

    export default {
        data() {
            return {
                formData: {
                    approverId: null,
                    checkUserId: null,
                    check: '1',
                    summary: '同意'
                },
                receiptId: null,
                receiptInfo: null,
                listLoading: false,
                list: [],
                approverList:[],
                rules: {
                    summary: [
                        { required: true, message: '请填写批注'}
                    ]
                },
                showCheck: false,
                saving: false,
            };
        },
        computed:{
            ...mapGetters([
                'permissions', 'userId'
            ])
        },
        created() {
            this.receiptId = this.$route.params.receiptId;
            this.formData.checkUserId = this.userId;

            this.getReceiptInfo();
            this.getReceiptApproverList();
        },
        methods: {
            getReceiptInfo() {
                getReceiptInfo(this.receiptId)
                    .then(response => {
                        this.receiptInfo = response.data.data;
                        this.receiptInfo.detailedList = `${window.location.origin}/apply/receipt/` +  this.receiptInfo.detailedList;
                    })
            },
            //
            getReceiptApproverList() {
                getReceiptApproverList(this.receiptId)
                    .then(response => {
                        this.approverList = response.data.data;

                        this.approverList.forEach((item,index) => {
                            if (item.check == 0 && item.isBeing == 1 && item.userId == this.formData.checkUserId) {
                                console.log(item)
                                this.formData.approverId = item.approverId;
                                this.showCheck = true;
                            }
                        })
                    })
            },
            handleClick(tab, event) {
                // console.log(tab, event);
            },
            backHistory() {
                this.$router.go(-1);
            },
            selectChcek() {
                if (this.formData.check == 1){
                    this.formData.summary = "同意";
                }else {
                    this.formData.summary = "";
                }
            },
            onSubmit() {
                updateReceiptApprover(this.formData).then(res => {
                    if (res.data.data) {
                        this.backHistory();
                    }
                }).finally(() => {
                    this.saving = false
                })
            },
        }
    }
</script>

<style scoped>
    table{
        margin-top: 20px;
        color: #1f2d3d;
        width: 100%;
        border-right:1px solid #c8cbce;
        border-bottom:1px solid #c8cbce
    }
    table td{
        padding: 10px 0;
        border-left:1px solid #c8cbce;
        border-top:1px solid #c8cbce
    }
    .el-tag {
        line-height: 16px;
        height: auto;
    }
    .back{
        margin-top: 10px;
    }
    .title{
        text-align: center;
    }
    .name{
        font-size: 21px;
        color: #1f2d3d;
        padding: 10px 0 5px 0;
    }
    .time{
        font-size: 16px;
        color: #9d9e61;
        padding: 10px 0;
    }
    .result{
        max-width: 800px;
        height: 100px;
        border: 1px solid #F1F3F4;
        margin-bottom: 10px;
    }
    .avatar{
        margin-top: 20px;
        margin-left: 20px;
        margin-right: 20px;
        height: 45px;
        width: 45px;
    }
    .username {
        margin-top: 22px;
        position: absolute;
    }
    .res{
        max-width: 800px;
        height: 200px;
        border: 1px solid #F1F3F4;
        padding: 10px;
    }
    .submit{
        float: right;
        margin-top: -10px;
    }
    .checkSty{
        float: right;
        right: 10px;
        margin-top: -60px;
        position: relative;
        line-height: 32px;
        height: 32px;
    }
</style>
