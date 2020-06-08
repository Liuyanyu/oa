<template>
    <div style="max-width: 800px;">
        <el-button @click="backHistory" class="back">返回</el-button>
        <div class="title" style="margin-top: -40px;margin-bottom:20px;">
            <p class="name">支出申请单</p>
            <table border="0" cellspacing="0" cellpadding="0" v-if="expenseInfo">
                <tr>
                    <td style="width: 35%;">项目</td>
                    <td v-if="expenseInfo.alias != null">{{expenseInfo.alias}}</td>
                    <td v-else>与项目无关</td>
                </tr>
                <tr>
                    <td>申请人</td>
                    <td>{{expenseInfo.applyUserName}}</td>
                </tr>
                <tr>
                    <td>是否对外</td>
                    <td v-if="expenseInfo.isPublic == 0"><el-tag type="danger">否</el-tag></td>
                    <td v-if="expenseInfo.isPublic == 1"><el-tag type="success">是</el-tag></td>
                </tr>
                <tr>
                    <td>发票信息</td>
                    <td v-if="expenseInfo.isTackInvoice == 1">供应商已开票未收到纸质发票</td>
                    <td v-if="expenseInfo.isTackInvoice == 2">供应商未开票</td>
                    <td v-if="expenseInfo.isTackInvoice == 3">供应商已开票收到纸质发票</td>
                </tr>
                <tr>
                    <td>发票类型</td>
                    <td v-if="expenseInfo.invoiceType == 1">专票</td>
                    <td v-if="expenseInfo.invoiceType == 2">普票</td>
                </tr>
                <tr>
                    <td>名称</td>
                    <td>{{expenseInfo.name}}</td>
                </tr>
                <tr>
                    <td>银行名称</td>
                    <td>{{expenseInfo.bankName}}</td>
                </tr>
                <tr>
                    <td>银行账号</td>
                    <td>{{expenseInfo.bankAccount}}</td>
                </tr>
                <tr>
                    <td>支出金额</td>
                    <td>{{expenseInfo.priceYuan}} 元</td>
                </tr>
                <tr>
                    <td>备注信息</td>
                    <td>{{expenseInfo.remark}}</td>
                </tr>
                <tr>
                    <td>发票张数</td>
                    <td>{{expenseInfo.invoiceNum}} 张</td>
                </tr>
                <tr>
                    <td>用途及明细</td>
                    <td>{{expenseInfo.detailed}}</td>
                </tr>
                <tr>
                    <td>发票图片</td>
                    <td v-if="expenseInfo.invoiceImg">
                        <el-image v-for="(url, index) in urls1" :key="url" :src="url" lazy @click="onPreview1(index)"></el-image>
                        <el-image-viewer v-if="showViewer"
                                         :on-close="closeViewer"
                                         :url-list="[url]">
                        </el-image-viewer>
                    </td>
                    <td v-else>无</td>
                </tr>
                <tr>
                    <td>合同及附件图片</td>
                    <td v-if="expenseInfo.contract">
                        <el-image v-for="(url, index) in urls2" :key="url" :src="url" lazy @click="onPreview2(index)"></el-image>
                        <el-image-viewer v-if="showViewer"
                                         :on-close="closeViewer"
                                         :url-list="[url]">
                        </el-image-viewer>
                    </td>
                    <td v-else>无</td>
                </tr>
                <tr>
                    <td>状态</td>
                    <td v-if="expenseInfo.status == 0"><el-tag type="warning">审批中</el-tag></td>
                    <td v-if="expenseInfo.status == 1"><el-tag type="success">已同意</el-tag></td>
                    <td v-if="expenseInfo.status == 2"><el-tag type="danger">已拒绝</el-tag></td>
                </tr>
                <tr>
                    <td>申请时间</td>
                    <td>{{expenseInfo.createTime}}</td>
                </tr>

            </table>
        </div>
        <div>
            <p class="name">审批结果</p>
        </div>
        <div class="result"  v-for="approver in approverList">
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
    import {getExpenseInfo, getExpenseApproverList, updateExpenseApprover} from "../../../api/apply/expense.js";
    import { mapGetters } from 'vuex'
    import ElImageViewer from "element-ui/packages/image/src/image-viewer";
    export default {
        components: {ElImageViewer},
        data() {
            return {
                formData: {
                    approverId: null,
                    checkUserId: null,
                    check: '1',
                    summary: '同意'
                },
                expenseId: null,
                expenseInfo: null,
                listLoading: false,
                list: [],
                approverList: [],
                ruleForm: {
                    check: '1',
                    desc: '同意'
                },
                rules: {
                    desc: [
                        { required: true, message: '请填写批注', trigger: 'blur' }
                    ]
                },
                showViewer: false, // 显示查看器
                url:'',
                urls1: [],
                urls2: [],
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
            this.expenseId = this.$route.params.expenseId;
            this.formData.userId = this.userId;
            this.getExpenseInfo();
            this.getExpenseApproverList();
        },
        methods: {
            getExpenseInfo() {
                getExpenseInfo(this.expenseId)
                    .then(response => {
                        this.expenseInfo = response.data.data;
                        this.expenseInfo.invoiceImg.split(",").forEach((item, index) =>{
                            if (item){
                                this.urls1.push(`${window.location.origin}/apply/expense/` + item)
                            }
                        })
                        this.expenseInfo.contract.split(",").forEach((item, index) =>{
                            if (item){
                                this.urls2.push(`${window.location.origin}/apply/expense/` + item)
                            }
                        })
                    })
            },
            getExpenseApproverList() {
                getExpenseApproverList(this.expenseId)
                    .then(response => {
                        this.approverList = response.data.data;
                        this.approverList.forEach((item,index) => {
                            if (item.check == 0 && item.isBeing == 1 && item.userId == this.formData.checkUserId) {
                                this.formData.approverId = item.approverId;
                                this.showCheck = true;
                            }
                        })
                    })
            },
            backHistory() {
                this.$router.go(-1);
            },
            onPreview1(val){
                this.url = this.urls1[val];
                this.showViewer = true;
            },
            onPreview2(val){
                this.url = this.urls2[val];
                this.showViewer = true;
            },
            closeViewer() {
                this.showViewer = false;
                this.url = "";
            },
            selectChcek() {
                if (this.formData.check == 1){
                    this.formData.summary = "同意";
                }else {
                    this.formData.summary = "";
                }
            },
            onSubmit() {
                updateExpenseApprover(this.formData).then(res => {
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
    .el-image{
        width: 100px;
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
    /*.result:first-child{*/
    /*    margin-top: 50px;*/
    /*}*/
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
