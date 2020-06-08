<template>
    <div style="max-width: 800px;">
        <el-button @click="backHistory" class="back">返回</el-button>
        <div class="title" style="margin-top: -40px;">
            <p class="name">请假单</p>
            <table border="0" cellspacing="0" cellpadding="0" v-if="leaveInfo">
                <tr>
                    <td>项目</td>
                    <td v-if="leaveInfo.alias != null">{{leaveInfo.alias}}</td>
                    <td v-else>与项目无关</td>
                </tr>
                <tr>
                    <td>申请人</td>
                    <td>{{leaveInfo.applyUserName}}</td>
                </tr>
                <tr>
                    <td>请假类型</td>
                    <td>
                        <span v-if="leaveInfo.type == 1">事假</span>
                        <span v-if="leaveInfo.type == 2">病假</span>
                        <span v-if="leaveInfo.type == 3">年假</span>
                        <span v-if="leaveInfo.type == 4">调休</span>
                        <span v-if="leaveInfo.type == 5">婚假</span>
                        <span v-if="leaveInfo.type == 6">产假</span>
                        <span v-if="leaveInfo.type == 7">陪产假</span>
                        <span v-if="leaveInfo.type == 8">丧假</span>
                        <span v-if="leaveInfo.type == 9">周六妈妈带娃</span>
                        <span v-if="leaveInfo.type == 10">周六培训学习</span>
                    </td>
                </tr>
                <tr>
                    <td>请假时间</td>
                    <td>{{leaveInfo.start}} 至 {{leaveInfo.end}}</td>
                </tr>
                <tr>
                    <td>请假时长</td>
                    <td>
                        <span v-if="leaveInfo.type == 1 || leaveInfo.type == 2">{{leaveInfo.time}} 小时</span>
                        <span v-else>{{leaveInfo.time}} 天</span>
                    </td>
                </tr>
                <tr>
                    <td>请假事由</td>
                    <td>{{leaveInfo.reason}}</td>
                </tr>
                <tr>
                    <td>证明图片</td>
                    <td v-if="leaveInfo.proveImg">
                        <el-image v-for="(url, index) in urls" :key="url" :src="url" lazy @click="onPreview(index)"></el-image>
                        <el-image-viewer v-if="showViewer"
                                         :on-close="closeViewer"
                                         :url-list="[url]">
                        </el-image-viewer>
                    </td>
                    <td v-else>无</td>
                </tr>
                <tr>
                    <td>状态</td>
                    <td v-if="leaveInfo.status == 0"><el-tag type="warning">审批中</el-tag></td>
                    <td v-if="leaveInfo.status == 1"><el-tag type="success">已同意</el-tag></td>
                    <td v-if="leaveInfo.status == 2"><el-tag type="danger">已拒绝</el-tag></td>
                </tr>
                <tr>
                    <td>申请时间</td>
                    <td>{{leaveInfo.createTime}}</td>
                </tr>
            </table>
        </div>
        <div class="title left">
            <p class="name">审批结果</p>
        </div>
        <div class="result" v-for="approver in approverList">
            <el-avatar size="medium" :src="approver.checkUserAvatar" class="avatar"></el-avatar>
            <span class="username" style="color: #65CEA7;">
                {{approver.checkUserName}}
                <i class="el-icon-time" style="color: #000;margin-left: 10px;margin-right: 5px" v-if="approver.check > 0"></i>
                <span style="color: #000" v-if="approver.check > 0">{{approver.updateTime}}</span>
            </span>
            <span style="color: #000000;margin-top: 45px;position: absolute;font-size: 12px">审批意见{{approver.summary}}</span>
            <div>
               <span v-if="approver.check == 1">
                    <el-tag class="checkSty" type="success">已同意</el-tag>
                </span>
                <span v-if="approver.check == 2">
                    <el-tag class="checkSty" type="danger">已拒绝</el-tag>
                </span>
                <span v-if="approver.check == 0">
                    <el-tag class="checkSty" type="warning">审批中</el-tag>
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
    import {getLeaveInfo, getLeaveApproverList, updateLeaveApprover} from "../../../api/apply/leave.js";
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
                leaveId: null,
                leaveInfo: null,
                listLoading: false,
                list: [],
                approverList: [],
                rules: {
                    summary: [
                        { required: true, message: '请填写原因'}
                    ]
                },
                showViewer: false, // 显示查看器
                url:'',
                urls: [],
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
            this.leaveId = this.$route.params.leaveId;
            this.formData.checkUserId = this.userId;
            this.getLeaveInfo();
            this.getLeaveApproverList();
        },
        methods: {
            getLeaveInfo() {
                getLeaveInfo(this.leaveId)
                    .then(response => {
                        this.leaveInfo = response.data.data;
                        this.leaveInfo.proveImg.split(",").forEach((item, index) =>{
                            if (item){
                                this.urls.push(`${window.location.origin}/apply/leave/` + item)
                            }
                        })
                    })
            },
            getLeaveApproverList() {
                getLeaveApproverList(this.leaveId)
                    .then(response => {
                        this.approverList = response.data.data;
                        this.approverList.forEach((item,index) => {
                            if (item.check == 0 && item.userId == this.formData.checkUserId) {
                                this.formData.approverId = item.approverId;
                                this.showCheck = true;
                            }
                        })
                    })
            },
            backHistory() {
                this.$router.go(-1);
            },
            onPreview(val){
                this.url = this.urls[val];
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
                updateLeaveApprover(this.formData).then(res => {
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
        padding: 0 5px;
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
        margin-top: 50px;
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
