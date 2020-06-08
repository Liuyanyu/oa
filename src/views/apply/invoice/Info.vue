<template>
    <div>
        <el-button @click="backHistory" class="back">返回</el-button>

        <el-row :gutter="20">
            <el-col :xs="{span:24}" :md="{span:12}">
                <div class="title" style="margin-bottom:20px;">
                    <p class="name">报销申请单</p>
                    <table border="0" cellpadding="0" cellspacing="0" v-if="invoiceInfo">
                        <tr>
                            <td>姓名</td>
                            <td colspan="3">{{invoiceInfo.applyUserName}}</td>
                        </tr>
                        <tr>
                            <td>项目名称</td>
                            <td colspan="3" v-if="invoiceInfo.alias !=null">{{invoiceInfo.alias}}</td>
                            <td colspan="3" v-else>与项目无关</td>
                        </tr>
                        <tr>
                            <td width="100">总分类</td>
                            <td v-if="invoiceInfo.classify == 7">办公用品</td>
                            <td v-if="invoiceInfo.classify == 8">固定资产</td>
                            <td v-if="invoiceInfo.classify == 9">管理费用</td>
                            <td v-if="invoiceInfo.classify == 10">人员补助</td>
                            <td v-if="invoiceInfo.classify == 11">项目报销</td>
                            <td width="100">明细分类</td>
                            <td v-if="invoiceInfo.classify == 7 && invoiceInfo.type == 1">办公文具</td>
                            <td v-if="invoiceInfo.classify == 7 && invoiceInfo.type == 2">办公耗材</td>
                            <td v-if="invoiceInfo.classify == 7 && invoiceInfo.type == 3">日杂百货</td>
                            <td v-if="invoiceInfo.classify == 7 && invoiceInfo.type == 4">财务用品</td>
                            <td v-if="invoiceInfo.classify == 7 && invoiceInfo.type == 5">电子设备及工具</td>

                            <td v-if="invoiceInfo.classify == 8 && invoiceInfo.type == 1">办公设备</td>
                            <td v-if="invoiceInfo.classify == 8 && invoiceInfo.type == 2">办公家具</td>

                            <td v-if="invoiceInfo.classify == 9 && invoiceInfo.type == 1">市内交通</td>
                            <td v-if="invoiceInfo.classify == 9 && invoiceInfo.type == 2">办公费用</td>
                            <td v-if="invoiceInfo.classify == 9 && invoiceInfo.type == 3">运输</td>
                            <td v-if="invoiceInfo.classify == 9 && invoiceInfo.type == 4">业务招待费</td>
                            <td v-if="invoiceInfo.classify == 9 && invoiceInfo.type == 5">会议费</td>
                            <td v-if="invoiceInfo.classify == 9 && invoiceInfo.type == 6">差旅费</td>
                            <td v-if="invoiceInfo.classify == 9 && invoiceInfo.type == 7">福利费</td>

                            <td v-if="invoiceInfo.classify == 10 && invoiceInfo.type == 1">住房补助</td>

                            <td v-if="invoiceInfo.classify == 11 && invoiceInfo.type == 1">差旅费</td>
                            <td v-if="invoiceInfo.classify == 11 && invoiceInfo.type == 2">业务招待费</td>
                            <td v-if="invoiceInfo.classify == 11 && invoiceInfo.type == 3">外协</td>
                            <td v-if="invoiceInfo.classify == 11 && invoiceInfo.type == 4">设备采购</td>
                            <td v-if="invoiceInfo.classify == 11 && invoiceInfo.type == 5">办公费</td>
                            <td v-if="invoiceInfo.classify == 11 && invoiceInfo.type == 6">市内交通</td>
                            <td v-if="invoiceInfo.classify == 11 && invoiceInfo.type == 7">会议费</td>
                        </tr>
                        <tr>
                            <td>是否找票</td>
                            <td colspan="3" v-if="invoiceInfo.isFull == 0">否</td>
                            <td colspan="3" v-else-if="invoiceInfo.isFull == 1">是</td>
                        </tr>
                        <tr>
                            <td>报销支付描述</td>
                            <td colspan="3">{{invoiceInfo.payDesc}}</td>
                        </tr>
                        <tr v-if="invoiceInfo.isFull == 1">
                            <td>支付时间</td>
                            <td colspan="3">{{invoiceInfo.payTimeCh}}</td>
                        </tr>
                        <tr v-if="invoiceInfo.isFull == 1">
                            <td>支付金额</td>
                            <td>{{invoiceInfo.payPriceYuan}} 元</td>
                            <td>支付截图数量</td>
                            <td v-if="invoiceInfo.payImgNum != null">{{invoiceInfo.payImgNum}} 张</td>
                            <td v-else>无</td>
                        </tr>
                        <tr v-if="invoiceInfo.isFull == 1">
                            <td>支付截图</td>
                            <td colspan="3" v-if="invoiceInfo.payImg">
                                <el-image v-for="(url, index) in urls1" :key="url" :src="url" lazy @click="onPreview1(index)"></el-image>
                                <el-image-viewer v-if="showViewer"
                                                 :on-close="closeViewer"
                                                 :url-list="[url]">
                                </el-image-viewer>
                            </td>
                            <td colspan="3" v-else>无</td>
                        </tr>
                        <tr>
                            <td>发票描述</td>
                            <td colspan="3">{{invoiceInfo.userId}}</td>
                        </tr>
                        <tr>
                            <td>发票时间</td>
                            <td colspan="3">{{invoiceInfo.invoiceTimeCh}}</td>
                        </tr>
                        <tr>
                            <td>发票金额</td>
                            <td>{{invoiceInfo.invoicePriceYuan}} 元</td>
                            <td>发票数量</td>
                            <td>{{invoiceInfo.invoiceImgNum}} 张</td>
                        </tr>
                        <tr>
                            <td>发票图片</td>
                            <td colspan="3" v-if="invoiceInfo.invoiceImg">
                                <el-image v-for="(url, index) in urls2" :key="url" :src="url" lazy @click="onPreview2(index)"></el-image>
                                <el-image-viewer v-if="showViewer"
                                                 :on-close="closeViewer"
                                                 :url-list="[url]">
                                </el-image-viewer>
                            </td>
                            <td colspan="3" v-else>无</td>
                        </tr>
                        <tr>
                            <td>状态</td>
                            <td colspan="3" v-if="invoiceInfo.status == 0"><el-tag type="warning">审批中</el-tag></td>
                            <td colspan="3" v-if="invoiceInfo.status == 1"><el-tag type="success">已同意</el-tag></td>
                            <td colspan="3" v-if="invoiceInfo.status == 2"><el-tag type="danger">已拒绝</el-tag></td>
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
            </el-col>
            <el-col :xs="{span:24}" :md="{span:12}">
                <el-button class="print" style="" @click="print"
                           v-if="invoiceInfo.status == 1 && formData.checkUserId == invoiceInfo.userId">打印</el-button>
                <div class="title" id="printContent" ref="print">
                    <p class="name">费用报销单</p>
                    <div style="width: 90%;margin-left:3%;">
                        <span style="color: #1f2d3d;display: inline-block;padding: 10px 10px;float: left; width: 33.33%;">
                            单位：北京甲板智慧科技有限公司
                        </span>
                            <span style="color: #1f2d3d;display: inline-block;padding: 10px 0;float: left; width: 33.33%;">
                            {{invoiceInfo.invoiceTimeCh}}
                        </span>
                        <span style="color: #1f2d3d;display: inline-block;padding: 10px 10px;float: right;text-align: right; margin-right: -3%;width: 33.33%;">
                            第
                            <span v-if="invoiceInfo.classify == 10" style="padding: 0 2px;">2</span>
                            <span v-else style="padding: 0 2px;">1</span>
                            号
                        </span>
                    </div>
                     <table border="0" cellspacing="0" cellpadding="0" v-if="invoiceInfo" style="width: 90%;margin-left: 5%;">
                         <tr style="height: 110px;text-align: center">
                             <td width="200">摘要</td>
                             <td colspan="3" style="text-align: left; padding: 0 10px;">{{invoiceInfo.payDesc}}</td>
                         </tr>
                         <tr style="height: 110px;text-align: center">
                             <td width="200">金额</td>
                             <td colspan="3" style="padding: 0 10px;">
                                 <span style="float: left;margin-top: 30px;">
                                     人民币(大写) : <u>{{invoiceInfo.invoicePriceChYuan}}</u>
                                 </span>
                                 <div style="float: right;margin-top: 60px;margin-right: 10px;">
                                     ￥<u>{{invoiceInfo.invoicePriceYuan}}</u>
                                 </div>
                             </td>
                         </tr>
                         <tr style="height: 110px;text-align: center">
                             <td width="200">附单据张数</td>
                             <td width="400" style="text-align: left; padding: 0 10px;">{{invoiceInfo.invoiceImgNum}}</td>
                             <td width="200">领款人签章</td>
                             <td width="400" style="text-align: left; padding: 0 10px;">{{applyUser}}</td>
                         </tr>
                     </table>
                    <div style="display: flex;color: #000000;text-align:left;line-height: 60px;margin-left: 5%;">
                        <span style="flex:1;">审批人：{{checkUser1}}</span>
                        <span style="flex:1;">审核：{{checkUser2}}</span>
                        <span style="flex:1;">证明或验收：{{checkUser3}}</span>
                        <span style="flex:1;">经手：{{applyUser}}</span>
                    </div>
                    <div style="height: 1px;border-top: 1px dotted #000000;width: 90%;margin: 5%;display: none" id="line"></div>
                    <div style="height: 500px;border: 1px solid #000000;width: 90%;margin: 5%;display: none" id="cont">
                        <h2 style="line-height: 500px;color: #000000;letter-spacing: 30px;text-align: center;">发票粘贴处</h2>
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
    import {getInvoiceInfo, getInvoiceApproverList, updateInvoiceApprover} from "../../../api/apply/invoice.js";
    import { mapGetters } from 'vuex'

    import ElImageViewer from "element-ui/packages/image/src/image-viewer";
    import moment from 'moment'
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
                invoiceInfo:{
                    applyUserName: "",
                    invoiceTime: ""
                },
                invoiceId: null,
                createTime: null,
                listLoading: false,
                list: [],
                approverList: [],
                rules: {
                    summary: [
                        { required: true, message: '请填写原因'}
                    ]
                },
                previewTime:'',
                previewList:[],
                checkUser1:'',
                checkUser2:'',
                checkUser3:'',
                applyUser:'',
                showCheck: false,
                saving: false,
                url:'',
                urls1: [],
                urls2:[],
                showViewer: false, // 显示查看器
            };
        },
        computed:{
            ...mapGetters([
                'permissions', 'userId'
            ])
        },
        created() {
            this.invoiceId = this.$route.params.invoiceId;
            this.formData.checkUserId = this.userId;
            this.getInvoiceInfo();
            // window.addEventListener('beforeunload', e => this.beforeunloadFn(e))
        },
        methods: {
            getInvoiceInfo() {
                getInvoiceInfo(this.invoiceId)
                    .then(response => {
                        this.invoiceInfo = response.data.data;
                        this.invoiceInfo.invoiceTimeCh = moment(this.invoiceInfo.invoiceTime).format("YYYY年MM月DD日");
                        this.invoiceInfo.payTimeCh = moment(this.invoiceInfo.payTime).format("YYYY年MM月DD日");
                        if (this.invoiceInfo.payImg){
                            this.invoiceInfo.payImg.split(",").forEach((item, index) =>{
                                if (item){
                                    this.urls1.push(`${window.location.origin}/apply/invoice/` + item)
                                }
                            })
                        }
                        if (this.invoiceInfo.invoiceImg) {
                            this.invoiceInfo.invoiceImg.split(",").forEach((item, index) =>{
                                if (item){
                                    this.urls2.push(`${window.location.origin}/apply/invoice/` + item)
                                }
                            })
                        }

                        if (this.invoiceInfo.classify == 10){
                            this.checkUser1 = "王铮";
                            this.checkUser3 = "王海清";
                            this.applyUser = "李长霖";
                        }else {
                            this.applyUser = this.invoiceInfo.applyUserName;
                        }

                        this.getInvoiceApproverList();
                    })
            },
            getInvoiceApproverList() {
                getInvoiceApproverList(this.invoiceId)
                    .then(response => {
                        this.approverList = response.data.data;
                        this.approverList.forEach((item,index) => {
                            if (item.check == 0 && item.isBeing == 1 && item.userId == this.formData.checkUserId) {
                                this.formData.approverId = item.approverId;
                                this.showCheck = true;
                            }
                        })
                        if (this.invoiceInfo.status == 1){
                            if (this.approverList.length == 2){
                                this.checkUser1 = this.approverList[0].checkUserName;
                                this.checkUser3 = this.approverList[1].checkUserName;
                            }
                            if (this.approverList.length == 3){
                                this.checkUser1 = this.approverList[0].checkUserName;
                                this.checkUser2 = this.approverList[1].checkUserName;
                                this.checkUser3 = this.approverList[2].checkUserName;
                            }
                        }
                    })
            },
            selectChcek() {
                if (this.formData.check == 1){
                    this.formData.summary = "同意";
                }else {
                    this.formData.summary = "";
                }
            },
            onSubmit() {
                updateInvoiceApprover(this.formData).then(res => {
                    if (res.data.data) {
                        this.backHistory();
                    }
                }).finally(() => {
                    this.saving = false
                })
            },
            backHistory() {
                this.$router.go(-1);
            },
            onPreview1(val){
                this.url = this.urls1[val];
                this.showViewer = true;
            },
            closeViewer() {
                this.showViewer = false;
                this.url = "";
            },
            onPreview2(val){
                this.url = this.urls2[val];
                this.showViewer = true;
            },
            print(e){
                this.remove();
                let subOutputRankPrint = document.getElementById('printContent');
                let newContent =subOutputRankPrint.innerHTML;
                let oldContent = document.body.innerHTML;
                document.body.innerHTML = newContent;
                window.print();
                // window.location.reload();
                document.body.innerHTML = oldContent;
                return false;
            },
            remove() {
                document.getElementById('line').style.display = 'block'
                document.getElementById('cont').style.display = 'block'
                var hkey_path;
                hkey_path = "HKEY_CURRENT_USER\\Software\\Microsoft\\Internet Explorer\\PageSetup\\";
                try {
                    var RegWsh = new ActiveXObject("WScript.Shell");
                    RegWsh.RegWrite(hkey_path + "header", "");
                    RegWsh.RegWrite(hkey_path + "footer", "");
                } catch (e) {
                }
            },
        },
        // mounted:{
            // window.addEventListener('beforeunload', e => this.beforeunloadFn(e))
        // }
    }
</script>

<style scoped>
    .paste{
        display: none;
    }
    .line{
        display: none;
    }
    @page{
        size:  auto;   /* auto is the initial value */
        margin: 0mm;  /* this affects the margin in the printer settings */
    }
    html{
        background-color: #FFFFFF;
        margin: 0px;  /* this affects the margin on the html before sending to printer */
    }
    body {
        border: solid 1px blue;
        margin: 10mm 15mm 10mm 15mm; /* margin you want for the content */
    }
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
    .submit{
        float: right;
        margin-top: -10px;
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
        text-align: center;
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
    .print{
        float: right;background-color: #65CEA7;color: #ffffff; position: absolute; right: 3%;
    }
</style>
