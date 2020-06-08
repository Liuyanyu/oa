<template>
    <div>
        <el-button type="primary" class="invoiceRules" @click="open">支出规范</el-button>
        <el-form ref="formData" :rules="rules" :model="formData" class="form" label-width="135px">
            <el-form-item label="项目：">
                <el-select v-model="formData.itemId" placeholder="请选择" @change="selectItem">
                    <el-option v-for="(item, index) in itemOptions" :value="item.value" :key="index" :label="item.label">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否对公：" prop="isPublic">
                <el-radio-group v-model="formData.isPublic" class="box">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="选项：" prop="isTackInvoice">
                <el-radio-group v-model="formData.isTackInvoice" class="box">
                    <el-radio label="1">供应商已开票未收到纸质发票</el-radio>
                    <el-radio label="2">供应商未开票</el-radio>
                    <el-radio label="3">供应商已开票收到纸质发票</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="发票类型：" prop="invoiceType">
                <el-radio-group v-model="formData.invoiceType" class="box">
                    <el-radio label="1">专票</el-radio>
                    <el-radio label="2">普票</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="供应商：" prop="supplierId">
                <el-select clearable v-model="formData.supplierId" placeholder="请选择" @change="selectSupplier">
                    <el-option v-for="(item, index) in supplierOptions" :value="item.supplierId" :key="index" :label="item.name">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="公司名称：" prop="name">
                <el-input v-model="formData.name" placeholder="请填写公司名称" maxlength="20" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="开户行名称：" prop="bankName">
                <el-input v-model="formData.bankName" placeholder="请填写开户行名称" maxlength="30" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="开户行账号：" prop="bankAccount">
                <el-input v-model="formData.bankAccount" placeholder="请填写开户行账号" maxlength="30" show-word-limit></el-input>
            </el-form-item>

            <el-form-item label="支出金额：" prop="priceYuan">
                <el-input type="number" placeholder="请填写支出金额" v-model="formData.priceYuan" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="备注信息：" prop="remark">
                <el-input v-model="formData.remark" placeholder="请填写备注信息" maxlength="20" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="发票张数：" prop="invoiceNum">
                <el-input type="text" placeholder="请填写发票张数" v-model="formData.invoiceNum" maxlength="10" show-word-limit></el-input>
            </el-form-item>

            <el-form-item label="用途及明细：" prop="detailed">
                <el-input type="textarea" placeholder="请填写用途及明细" v-model="formData.detailed" maxlength="30" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="发票图片：" prop="invoiceImg">
                <el-upload
                    class="upload-demo box"
                    :action="uploadUrl"
                    name="file"
                    :on-preview="handlePreview1"
                    :on-remove="handleRemove1"
                    :on-success="handSuccess1"
                    :file-list="fileList1"
                    :auto-upload="true"
                    :before-upload = "beforeAvatarUpload"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
            </el-form-item>
            <el-form-item label="合同及附件图片：">
                <el-upload
                    class="upload-demo box"
                    :action="uploadUrl"
                    name="file"
                    :on-preview="handlePreview2"
                    :on-remove="handleRemove2"
                    :on-success="handSuccess2"
                    :file-list="fileList2"
                    :before-upload = "beforeAvatarUpload"
                    :auto-upload="true"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5MB</div>
                </el-upload>
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
    import {addObj, editObj} from "../../../api/apply/expense.js";
    import {getApplyUserInfo} from "../../../api/admin/user.js";
    import {getItemVosWithUserId} from "../../../api/project/team.js";
    import {getSupplierAll} from "../../../api/customer/supplier.js";
    import {getStandardApplyInfoById} from "../../../api/standard/apply.js";
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                query: {
                    itemId: null,
                    userId: null,
                    deptId: null,
                    type: 7
                },
                fileList1: [],
                fileList2: [],
                formData: {
                    newData: true,
                    expenseId: null,
                    itemId: null,
                    userId: "",
                    isPublic: "1",
                    isTackInvoice: "1",
                    invoiceType: "2",
                    supplierId: null,
                    name: "",
                    bankName: "",
                    bankAccount: "",
                    priceYuan: "",
                    remark: "",
                    invoiceNum: 1,
                    detailed: "",
                    invoiceImg: "",
                    contract: "",
                    approverids: null
                },
                uploadUrl: "",
                itemOptions: [],
                supplierList: [],
                supplierOptions: [],
                rules: {
                    isPublic: [
                        { required: true, message: '请选择是否对公', trigger: 'change' }
                    ],
                    isTackInvoice: [
                        { required: true, message: '请选择供应商发票信息', trigger: 'change' }
                    ],
                    invoiceType: [
                        { required: true, message: '请选择发票类型', trigger: 'change' }
                    ],
                    // supplierId: [
                    //     { required: true, message: '请选择供应商', trigger: 'blur' }
                    // ],
                    name: [
                        {required: true, message: '请填写公司名称'}
                    ],
                    bankName: [
                        {required: true, message: '请填写开户行名称'}
                    ],
                    bankAccount: [
                        {required: true, message: '请填写开户行账号'}
                    ],
                    priceYuan: [
                        { required: true, message: '请填写支出金额'}
                    ],
                    remark: [
                        {required: true, message: '请填写备注信息'}
                    ],
                    invoiceNum: [
                        { required: true, message: '请填写发票张数', trigger: 'blur' }
                    ],
                    detailed: [
                        { required: true, message: '请填写用途及明细', trigger: 'blur' },
                    ]
                },
            saving: false,
            applyUserList: [],
            }
        },
        created() {
            this.getStandardApplyInfo();
            this.getApplyUser(this.userId);
            this.getItemVosWithUserId(this.userId);
            this.getSupplierAll();
            this.formData.userId = this.userId;
            this.query.userId= this.userId;
            this.uploadUrl = `${window.location.origin}/apply/expense/upload`

            const editExpenseInfo = JSON.parse(window.localStorage.getItem("editExpenseInfo"));
            if (editExpenseInfo){
                this.formData.newData = false;
                this.formData.expenseId = editExpenseInfo.expenseId;
                this.formData.itemId = editExpenseInfo.itemId;
                this.formData.isPublic = editExpenseInfo.isPublic;
                this.formData.isTackInvoice = editExpenseInfo.isTackInvoice;
                this.formData.invoiceType = editExpenseInfo.invoiceType;
                this.formData.supplierId = editExpenseInfo.supplierId;
                this.formData.name = editExpenseInfo.name;
                this.formData.bankName = editExpenseInfo.bankName;
                this.formData.bankAccount = editExpenseInfo.bankAccount;
                this.formData.priceYuan = editExpenseInfo.priceYuan;
                this.formData.remark = editExpenseInfo.remark;
                this.formData.invoiceNum = editExpenseInfo.invoiceNum;
                this.formData.detailed = editExpenseInfo.detailed;
                this.formData.invoiceImg = editExpenseInfo.invoiceImg;
                this.formData.contract = editExpenseInfo.contract;

                editExpenseInfo.invoiceImg.split(",").forEach((item, index) =>{
                    if (item){
                        this.fileList1.push({url:`${window.location.origin}/apply/expense/` + item})
                    }
                });
                editExpenseInfo.contract.split(",").forEach((item, index) =>{
                    if (item){
                        this.fileList2.push({url:`${window.location.origin}/apply/expense/` + item})
                    }
                });
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
            getSupplierAll() {
                getSupplierAll()
                    .then(response => {
                        this.supplierList = response.data.data;
                        response.data.data.forEach(element => {
                            this.supplierOptions.push({supplierId:element.supplierId,name:element.name});
                        })
                    })
            },
            selectSupplier(val) {
                console.log(val)
                if (val != null && val != ''){
                    var that = this;
                    this.supplierList.forEach(element => {
                        if (element.supplierId == val){
                            that.formData.name = element.name;
                            that.formData.bankName = element.bankName;
                            that.formData.bankAccount = element.bankAccount;
                        }
                    });
                }else {
                    this.formData.name = "";
                    this.formData.bankName = "";
                    this.formData.bankAccount = "";
                }


            },
            backHistory() {
                window.localStorage.removeItem("editExpenseInfo");
                this.formData.newData = true;
                this.formData.expenseId = null;
                this.formData.itemId = null;
                this.formData.isPublic = "1";
                this.formData.isTackInvoice = "1";
                this.formData.invoiceType = "2";
                this.formData.supplierId = null;
                this.formData.name = "";
                this.formData.bankName = "";
                this.formData.bankAccount = "";
                this.formData.priceYuan = "";
                this.formData.invoiceNum = 1;
                this.formData.detailed = "";
                this.formData.invoiceImg = "";
                this.formData.contract = "";
                this.$router.go(-1);
            },
            onSubmit() {
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        //console.log(this.formData)
                        // this.fileData = new FormData();
                        // this.$refs.upload2.submit();
                        this.saving = true
                        if (!this.formData.newData) {
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
            handleRemove1(data) {
                const imgInfo = data.response.data;
                const imgUrl = imgInfo.bucketName + "-" + imgInfo.fileName;
                this.formData.invoiceImg = this.formData.invoiceImg.replace(imgUrl +"," , "")
                console.log(this.formData.invoiceImg)
            },
            handlePreview1(file) {
                console.log(file);
            },
            handSuccess1(data) {
                const imgInfo = data.data;
                const imgUrl = imgInfo.bucketName + "-" + imgInfo.fileName;
                this.formData.invoiceImg += imgUrl + ","
                console.log(this.formData.invoiceImg)
            },
            handleRemove2(data) {
                const imgInfo = data.response.data;
                const imgUrl = imgInfo.bucketName + "-" + imgInfo.fileName;
                this.formData.content = this.formData.contract.replace(imgUrl +"," , "")
                console.log(this.formData.contract)
            },
            handlePreview2(file) {
                console.log(file);
            },
            handSuccess2(data) {
                const imgInfo = data.data;
                const imgUrl = imgInfo.bucketName + "-" + imgInfo.fileName;
                this.formData.contract += imgUrl + ","
                console.log(this.formData.contract)
            },
            getStandardApplyInfo() {
                getStandardApplyInfoById(7)
                    .then(response => {
                        if(response.data.data){
                            const data = response.data.data;
                            this.content = data.content;
                            const expenseStandardApply = JSON.parse(window.localStorage.getItem("expenseStandardApply"));
                            if(expenseStandardApply){
                                if (expenseStandardApply.version < data.version){
                                    this.open();
                                }
                            }else{
                                this.open();
                            }
                            window.localStorage.setItem("expenseStandardApply", JSON.stringify(data));
                        }
                    });
            },
            open() {
                console.log(this.content)
                let content = this.content.split('\n\n');
                let newDatas = [];
                const h = this.$createElement;
                for(let i in content){
                    newDatas.push(h('p',null,content[i]));
                };
                this.$alert(h('div',null,newDatas),'支出规范');
            },
            beforeAvatarUpload:function(file){
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isPG = (isJPG || isPNG)                                       //限制图片格式为jpg / png
                const isLt5M = file.size / 1024 / 1024 < 5;                         //限制图片大小
                if (!isPG) {
                    this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
                }
                if (!isLt5M) {
                    this.$message.error('上传头像图片大小不能超过 5MB!');
                }
                return isPG && isLt5M
            }
        },
        mounted() {

        }
    }
</script>
<style type="text/scss" scoped lang="scss">
    .el-select{
        width: 100%;
    }
</style>
