<template>
    <div>
        <el-button type="primary" class="invoiceRules" @click="open">开票规范</el-button>
        <el-form ref="formData" :rules="rules" :model="formData" label-width="160px" class="demo-ruleForm form" style="text-align: left;">
            <el-form-item label="开票项目：" prop="itemId">
                <el-select v-model="formData.itemId" placeholder="请选择" @change="selectItem">
                    <el-option v-for="(item, index) in itemOptions" :value="item.value" :key="index" :label="item.label">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开票公司：" prop="companyId">
                <el-select v-model="formData.companyId" placeholder="请选择公司">
                    <el-option v-for="(item, index) in companyOptions" :value="item.value" :key="index" :label="item.label">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开票类型：" prop="type">
                <el-radio-group v-model="formData.type">
                    <el-radio label="1">专票</el-radio>
                    <el-radio label="2">普票</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="甲方信息：">
                <el-select v-model="formData.firstPartyId" placeholder="请选择" @change="selectFirstParty">
                    <el-option v-for="(item, index) in firstPartyOptions" :value="item.firstPartyId" :key="index" :label="item.name">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="公司名称：" prop="name">
                <el-input v-model="formData.name" placeholder="请填写公司名称" maxlength="20" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="公司税号：" prop="dutyParagraph">
                <el-input v-model="formData.dutyParagraph" placeholder="请填写税号" maxlength="30" show-word-limit></el-input>
            </el-form-item>
            <div v-if="formData.type == 1">
                <el-form-item label="公司注册地址：" prop="address">
                    <el-input v-model="formData.address" placeholder="请填写公司地址" maxlength="30" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="公司电话：" prop="telephone">
                    <el-input v-model="formData.telephone" placeholder="请填写电话" maxlength="12" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="开户行名称：" prop="bankName">
                    <el-input v-model="formData.bankName" placeholder="请填写开户行名称" maxlength="20" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="开户行账号：" prop="bankAccount">
                    <el-input v-model="formData.bankAccount" placeholder="请填写开户行账号" maxlength="30" show-word-limit></el-input>
                </el-form-item>
            </div>

            <el-form-item label="开票百分比（%）：" prop="proportion">
                <el-input v-model="formData.proportion" placeholder="请填写开票百分比"  maxlength="3" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="开票金额（元）：" prop="priceYuan">
                <el-input type="number" v-model="formData.priceYuan" placeholder="请填写开票金额"></el-input>
            </el-form-item>
            <el-form-item label="开票内容：" prop="content">
                <el-select v-model="formData.content" placeholder="请选择">
                    <el-option label="*研发和技术服务*专业技术服务" value="11"></el-option>
                    <el-option label="*研发和技术服务*软件开发" value="12"></el-option>
                    <el-option label="*设计服务*专业设计服务" value="13"></el-option>
                    <el-option label="*其他咨询服务*其他咨询服务" value="14"></el-option>
                    <el-option label="*印刷品*图片、设计图样及照片" value="21"></el-option>
                    <el-option label="*软件*系统软件产品" value="22"></el-option>
                    <el-option label="*硬件*" value="23"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="产品清单：" prop="detailedList" v-if="formData.content == 23">
                <el-upload
                    ref="upload"
                    :action="uploadUrl"
                    name="file"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="handSuccess"
                    accept=".xls,.xlsx"
                    :auto-upload="true">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="templateDownload">模板下载</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传xls文件，且不超过500kb</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="是否与对方确认：" prop="isAffirm">
                <el-radio-group v-model="formData.isAffirm">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="2">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="审批人：">
                <div class="apply-user-list" v-for="user in applyUserList">
                    <el-avatar :size="60" :src="user.avatar"></el-avatar>
                    <span class="username">{{ user.username }}</span>
                </div>
            </el-form-item>
            <el-form-item style="text-align: center" class="save">
                <el-button type="primary" @click="onSubmit" :loading="saving">保存</el-button>
                <el-button @click="backHistory">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import {addObj, editObj} from "../../../api/apply/receipt.js";
    import {getApplyUserInfo} from "../../../api/admin/user.js";
    import {getItemVosWithUserId} from "../../../api/project/team.js";
    import {getFirstpartyAll} from "../../../api/customer/firstparty.js";
    import {getStandardApplyInfoById} from "../../../api/standard/apply.js";
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                query: {
                    itemId: null,
                    userId: null,
                    deptId: null,
                    type: 8
                },
                formData: {
                    newData: true,
                    receiptId: null,
                    itemId: null,
                    companyId: null,
                    userId: null,
                    type: "2",
                    firstPartyId: null,
                    name: "",
                    dutyParagraph: "",
                    address: "",
                    telephone: "",
                    bankName: "",
                    bankAccount: "",
                    proportion: "",
                    priceYuan: "",
                    content: "11",
                    detailedList: "",
                    isAffirm: "1"
                },
                uploadUrl: "",
                rules: {
                    itemId: [
                        {required: true, message: '请选择开票项目', trigger: 'change'}
                    ],
                    companyId: [
                        {required: true, message: '请选择开票公司', trigger: 'change'}
                    ],
                    type: [
                        {required: true, message: '请选择开票类型', trigger: 'change'}
                    ],
                    name: [
                        {required: true, message: '请填写公司名称'}
                    ],
                    dutyParagraph: [
                        {required: true, message: '请填写公司税号'}
                    ],
                    address: [
                        {required: true, message: '请填写公司注册地址'}
                    ],
                    telephone: [
                        {required: true, message: '请填写公司电话'}
                    ],
                    bankName: [
                        {required: true, message: '请填写开户行名称'}
                    ],
                    bankAccount: [
                        {required: true, message: '请填写开户行账号'}
                    ],
                    proportion: [
                        {required: true, message: '请填写开票百分比'}
                    ],
                    priceYuan: [
                        { required: true, message: '请填写开票金额'}
                    ],
                    content: [
                        {required: true, message: '请选择开票内容', trigger: 'blur'}
                    ],
                    detailedList: [
                        {required: true, message: '请上传产品清单', trigger: 'blur'}
                    ],
                    isAffirm: [
                        {required: true, message: '请选择是否与对方确认', trigger: 'blur'}
                    ],
                },
                type1Visible: false,
                itemOptions: [],
                companyOptions: [
                    {
                        label: "北京甲板智慧科技有限公司",
                        value: 1,
                    },
                    {
                        label: "北京甲板数字科技有限公司",
                        value: 2,
                    }
                ],
                firstPartyList: [],
                firstPartyOptions: [],
                saving: false,
                applyUserList: [],
            }
        },
        created() {
            this.getStandardApplyInfo();
            this.getApplyUser(this.userId);
            this.getItemVosWithUserId(this.userId);
            this.getFirstpartyAll();

            this.formData.userId = this.userId;
            this.query.userId= this.userId;

            this.uploadUrl = `${window.location.origin}/apply/receipt/upload`

            const editReceiptInfo = JSON.parse(window.localStorage.getItem("editReceiptInfo"));
            if (editReceiptInfo){
                console.log(editReceiptInfo)
                this.formData.newData = false;
                this.formData.receiptId = editReceiptInfo.receiptId;
                this.formData.itemId = editReceiptInfo.itemId;
                if (this.formData.itemId){
                    this.selectItem(this.formData.itemId);
                }
                this.formData.companyId = editReceiptInfo.companyId;
                this.formData.type = editReceiptInfo.type;
                this.formData.firstPartyId = editReceiptInfo.firstPartyId;
                this.formData.name = editReceiptInfo.name;
                this.formData.dutyParagraph = editReceiptInfo.dutyParagraph;
                this.formData.address = editReceiptInfo.address;
                this.formData.telephone = editReceiptInfo.telephone;
                this.formData.bankName = editReceiptInfo.bankName;
                this.formData.bankAccount = editReceiptInfo.bankAccount;
                this.formData.proportion = editReceiptInfo.proportion;
                this.formData.priceYuan = editReceiptInfo.priceYuan;
                this.formData.content = editReceiptInfo.content;
                //this.formData.detailedList = editReceiptInfo.detailedList;
                this.formData.isAffirm = editReceiptInfo.isAffirm;

            }
        },
        computed: {
            ...mapGetters([
                'permissions','userId'
            ])
        },
        methods:{
            selectItem(val) {
                if (val == null || val == ""){
                    this.query.itemId = null;
                    this.formData.itemId = null;
                    this.getApplyUser();
                }else {
                    this.query.itemId = val;
                    this.formData.itemId = val;
                    this.getApplyUser();
                }
            },
            getApplyUser() {
                getApplyUserInfo(this.query)
                    .then(response => {
                        this.applyUserList = [];
                        this.formData.approverids = null;
                        response.data.data.forEach(element => {
                            this.applyUserList.push({userId:element.userId, username:element.username, avatar:element.avatar});
                            if (this.formData.approverids == null){
                                this.formData.approverids += element.userId;
                            }else {
                                this.formData.approverids += "," + element.userId;
                            }

                        })
                    });
            },
            getItemVosWithUserId(userId) {
                getItemVosWithUserId(userId)
                    .then(response => {
                        response.data.data.forEach(element => {
                            this.itemOptions.push({value:element.itemId,label:element.alias});
                        })
                    })
            },
            getFirstpartyAll() {
                getFirstpartyAll()
                    .then(response => {
                        this.firstPartyList = response.data.data;
                        response.data.data.forEach(element => {
                            this.firstPartyOptions.push(
                                {
                                    firstPartyId:element.firstPartyId,
                                    name:element.name
                                });
                        })
                    })
            },
            selectFirstParty(val){
                var that = this;
                this.firstPartyList.forEach(element => {
                    if (element.firstPartyId == val){
                        that.formData.name = element.name;
                        that.formData.dutyParagraph = element.dutyParagraph;
                        that.formData.address = element.address;
                        that.formData.telephone = element.telephone;
                        that.formData.bankName = element.bankName;
                        that.formData.bankAccount = element.bankAccount;
                    }
                });
            },
            backHistory() {
                window.localStorage.removeItem("editReceiptInfo");
                this.formData.newData = true;
                this.formData.receiptId = null;
                this.formData.itemId = null;
                this.formData.companyId = null;
                this.formData.userId = null;
                this.formData.type = "2";
                this.formData.firstPartyId = null;
                this.formData.name = "";
                this.formData.dutyParagraph = "";
                this.formData.address = "";
                this.formData.telephone = "";
                this.formData.bankName = "";
                this.formData.bankAccount = "";
                this.formData.proportion = "";
                this.formData.priceYuan = "";
                this.formData.content = "11";
                this.formData.detailedList = "";
                this.formData.isAffirm = "1";

                this.$router.go(-1);
            },
            onSubmit() {
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        this.saving = true;
                        if (!this.formData.newData) {
                            this.formData.status = 0;
                            editObj(this.formData).then(res => {
                                if (res.data.data) {
                                    this.backHistory();
                                }
                            }).finally(() => {
                                this.saving = false
                            })
                        }else {
                            addObj(this.formData).then(res => {
                                if (res.data.data) {
                                    this.backHistory();
                                }
                            }).finally(() => {
                                this.saving = false
                            })
                        }

                    }
                })
            },
            getStandardApplyInfo() {
                getStandardApplyInfoById(8)
                    .then(response => {
                        if(response.data.data){
                            const data = response.data.data;
                            this.content = data.content;
                            const receiptStandardApply = JSON.parse(window.localStorage.getItem("receiptStandardApply"));
                            if(receiptStandardApply){
                                if (receiptStandardApply.version < data.version){
                                    this.open();
                                }
                            }else{
                                this.open();
                            }
                            window.localStorage.setItem("receiptStandardApply", JSON.stringify(data));
                        }
                    });
            },
            open() {
                let content = this.content.split('\n\n');
                let newDatas = [];
                const h = this.$createElement;
                for(let i in content){
                    newDatas.push(h('p',null,content[i]));
                };
                this.$alert(h('div',null,newDatas),'开票规范');
            },
            /**
             * 产品清单模板下载
             */
            templateDownload() {
                //this.$refs.upload.submit();
                window.location.href = "http://192.168.1.88/receipt-temp.xlsx"
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
                this.formData.detailedList = "";
            },
            handlePreview(file) {
                console.log(file);
            },
            handSuccess(data){
                const fileInfo = data.data;
                const fileUrl = fileInfo.bucketName + "-" + fileInfo.fileName;
                console.log(fileUrl);
                this.formData.detailedList = fileUrl;
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
    @media screen and (max-width: 360px) {
        .save{
            margin-left: -45%
        }
    }
    @media screen and (min-width: 600px) {
        .form {
            margin-left: 60px;
        }
    }
    @media screen and (min-width: 1300px) {
        .el-input{
            width: 400%;
        }
        .el-select{
            width: 400%;
        }
    }
</style>
