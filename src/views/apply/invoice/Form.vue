<template>
    <div>
        <el-button type="primary" class="invoiceRules" @click="open">报销规范</el-button>
        <el-form ref="formData" :rules="rules" :model="formData" class="form" :label-position="labelPosition" label-width="150px">
            <el-form-item label="公司：" prop="companyId">
                <el-select v-model="formData.companyId" placeholder="请选择">
                    <el-option v-for="(item, index) in companyOptions" :value="item.value" :key="index" :label="item.label">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="总分类：" prop="classify">
                <el-radio-group v-model="formData.classify">
                    <el-radio label="7">办公用品</el-radio>
                    <el-radio label="8">固定资产</el-radio>
                    <el-radio label="9">管理费用</el-radio>
                    <el-radio label="10">人员补助</el-radio>
                    <el-radio label="11">项目报销</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="项目：" prop="itemId" v-if="formData.classify == 11" >
                <el-select v-model="formData.itemId" placeholder="请选择" @change="selectItem">
                    <el-option v-for="(item, index) in itemOptions" :value="item.value" :key="index" :label="item.label">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="明细分类：" prop="type">
                <el-radio-group v-model="formData.type">
                    <el-radio v-if="formData.classify == 7" label="1">办公文具</el-radio>
                    <el-radio v-if="formData.classify == 7" label="2">办公耗材</el-radio>
                    <el-radio v-if="formData.classify == 7" label="3">日杂百货</el-radio>
                    <el-radio v-if="formData.classify == 7" label="4">财务用品</el-radio>
                    <el-radio v-if="formData.classify == 7" label="5">电子设备及工具</el-radio>

                    <el-radio v-if="formData.classify == 8" label="1">办公设备</el-radio>
                    <el-radio v-if="formData.classify == 8" label="2">办公家具</el-radio>

                    <el-radio v-if="formData.classify == 9" label="1">市内交通</el-radio>
                    <el-radio v-if="formData.classify == 9" label="2">办公费用</el-radio>
                    <el-radio v-if="formData.classify == 9" label="3">运输</el-radio>
                    <el-radio v-if="formData.classify == 9" label="4">业务招待费</el-radio>
                    <el-radio v-if="formData.classify == 9" label="5">会议费</el-radio>
                    <el-radio v-if="formData.classify == 9" label="6">差旅费</el-radio>
                    <el-radio v-if="formData.classify == 9" label="7">福利费</el-radio>

                    <el-radio v-if="formData.classify == 10" label="1">住房补助</el-radio>

                    <el-radio v-if="formData.classify == 11" label="1">差旅费</el-radio>
                    <el-radio v-if="formData.classify == 11" label="2">业务招待费</el-radio>
                    <el-radio v-if="formData.classify == 11" label="3">外协</el-radio>
                    <el-radio v-if="formData.classify == 11" label="4">设备采购</el-radio>
                    <el-radio v-if="formData.classify == 11" label="5">办公费</el-radio>
                    <el-radio v-if="formData.classify == 11" label="6">市内交通</el-radio>
                    <el-radio v-if="formData.classify == 11" label="7">会议费</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否找的票：" prop="isFull">
                <el-radio-group v-model="formData.isFull">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="发票类型：" prop="invoiceType">
                <el-radio-group v-model="formData.invoiceType">
                    <el-radio label="1">专票</el-radio>
                    <el-radio label="2">普票</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="真实报销描述：" prop="payDesc">
                <el-input type="text" v-model="formData.payDesc" placeholder="请详细说明支付实际描述。例：因xx项目，xx时间xx地点和谁xx发生了xx报销" maxlength="50" show-word-limit></el-input>
            </el-form-item>
            <div v-if="formData.isFull == 1">
                <div style="">
                    <el-form-item label="支付时间：" prop="payTime" style="margin-right:20px;float: left">
                        <el-date-picker
                            v-model="formData.payTime"
                            type="date"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="支付金额：" prop="payPriceYuan" style="margin-right:20px;float: left">
                        <el-input type="text" placeholder="请输入支付金额" v-model="formData.payPriceYuan" show-word-limit></el-input>
                    </el-form-item>
                    <el-form-item label="支付图片张数：" prop="payImgNum" style="margin-right:20px;float: left">
                        <el-input type="text" placeholder="请输入支付图片张数" v-model="formData.payImgNum" show-word-limit ></el-input>
                    </el-form-item>
                    <div style="clear: both"></div>
                </div>
                <el-form-item label="支付截图：" prop="payImg">
                    <el-upload
                        class="upload-demo"
                        :action="uploadUrl"
                        name="file"
                        :on-preview="handlePreview1"
                        :on-remove="handleRemove1"
                        :on-success="handSuccess1"
                        :file-list="fileList1"
                        :before-upload = "beforeAvatarUpload"
                        list-type="picture">
                        <el-button size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5MB</div>
                    </el-upload>
                    <!-- <input type="file" name="pic" id="pic" accept="image/gif, image/jpeg" />-->
                </el-form-item>
            </div>

            <el-form-item label="发票上内容的描述：" prop="invoiceDesc">
                <el-input type="text" v-model="formData.invoiceDesc" placeholder="请填写发票上的信息或描述" maxlength="50" show-word-limit></el-input>
            </el-form-item>

            <div style="">
                <el-form-item label="发票时间：" prop="invoiceTime" style="margin-right:20px;float: left">
<!--                    <el-input type="text" placeholder="请输入发票日期" v-model="formData.invoiceData" show-word-limit></el-input>-->
                    <el-date-picker
                        v-model="formData.invoiceTime"
                        type="date"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="发票金额：" prop="invoicePriceYuan" style="margin-right:20px;float: left">
                    <el-input type="text" placeholder="请输入发票金额" v-model="formData.invoicePriceYuan" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="发票张数：" prop="invoiceImgNum" style="margin-right:20px;float: left">
                    <el-input type="text" placeholder="请输入发票图片张数" v-model="formData.invoiceImgNum" show-word-limit ></el-input>
                </el-form-item>
                <div style="clear: both"></div>
            </div>

            <el-form-item label="发票图片：" prop="invoiceImg">
                <el-upload
                    class="upload-demo"
                    :action="uploadUrl"
                    name="file"
                    :on-preview="handlePreview2"
                    :on-remove="handleRemove2"
                    :on-success="handSuccess2"
                    :before-upload = "beforeAvatarUpload"
                    :file-list="fileList2"
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
            <el-form-item v-if="isSave" style="text-align: center" class="save">
                <el-button type="primary" @click="onSubmit" :loading="saving">保存</el-button>
                <el-button @click="backHistory">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import {addObj,editObj} from "../../../api/apply/invoice.js";
    import {getApplyUserInfo} from "../../../api/admin/user.js";
    import {getItemVosWithUserId} from "../../../api/project/team.js";
    import {getStandardApplyInfoById} from "../../../api/standard/apply.js";
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                query: {
                    companyId: null,
                    userId: null,
                    deptId: null,
                    type: 6
                },
                labelPosition:'right',
                fileList1: [],
                fileList2: [],
                formData: {
                    newData: true,
                    invoiceId: null,
                    companyId: null,
                    itemId: null,
                    userId: null,
                    classify: "7",
                    type: "1",
                    isFull : "0",
                    invoiceType : "2",
                    invoiceDesc : "",
                    invoiceTime : "",
                    invoicePriceYuan : null,
                    invoiceImg : "",
                    invoiceImgNum : null,
                    payDesc : "",
                    payTime : "",
                    payPriceYuan : null,
                    payImg : "",
                    payImgNum : null,
                    approverids : ""

                },
                isSave: true,
                uploadUrl: "",
                companyOptions: [
                    {
                        value: null,
                        label: '未转正不可提交'
                    },
                    {
                        value: 1,
                        label: '北京甲板智慧科技有限公司'
                    },
                    {
                        value: 2,
                        label: '北京甲板数字科技有限公司'
                    },
                ],
                itemOptions: [],
                rules: {
                    companyId: [
                        { required: true, message: '请选择公司', trigger: 'change' }
                    ],
                    itemId: [
                        { required: true, message: '请选择项目', trigger: 'change' }
                    ],
                    classify: [
                        { required: true, message: '请选择总分类', trigger: 'change' }
                    ],
                    type: [
                        { required: true, message: '请选择明细分类', trigger: 'change' }
                    ],
                    isFull: [
                        { required: true, message: '请选择是否找的票', trigger: 'change' }
                    ],
                    invoiceType: [
                        { required: true, message: '请选择发票类型', trigger: 'change' }
                    ],
                    payDesc: [
                        { required: true, message: '请填写支付描述'}
                    ],
                    payTime: [
                        { required: true, message: '请选择支付时间', trigger: 'change' }
                    ],
                    payPriceYuan: [
                        { required: true, message: '请填写支付金额'}
                    ],
                    payImg: [
                        { required: true, message: '请上传支付图片', trigger: 'change'}
                    ],
                    payImgNum: [
                        { required: true, message: '请填写支付图片数量'}
                    ],
                    invoiceDesc: [
                        { required: true, message: '请填写发票描述'}
                    ],
                    invoiceTime: [
                        { required: true, message: '请选择发票时间', trigger: 'change' }
                    ],
                    invoicePriceYuan: [
                        { required: true, message: '请填写发票金额'}
                    ],
                    invoiceImg: [
                        { required: true, message: '请上传发票图片', trigger: 'change'}
                    ],
                    invoiceImgNum: [
                        { required: true, message: '请填写发票图片数量'}
                    ],
                },
                saving: false,
                applyUserList: [],
            }
        },
        created() {

            this.getItemVosWithUserId(this.userId);

            if(!this.companyId){
                this.isSave = false;
            }else {
                this.formData.companyId = this.companyId;
            }
            this.getStandardApplyInfo();
            this.getApplyUser(this.userId);
            this.formData.userId = this.userId;
            this.query.userId = this.userId;
            this.uploadUrl=  `${window.location.origin}/apply/invoice/upload`;
            //this.open()

            const editInvoiceInfo = JSON.parse(window.localStorage.getItem("editInvoiceInfo"));
            if(editInvoiceInfo){
                this.formData.newData = false;
                this.formData.invoiceId = editInvoiceInfo.invoiceId;
                this.formData.companyId = editInvoiceInfo.companyId;
                this.formData.itemId = editInvoiceInfo.itemId;
                this.formData.classify = editInvoiceInfo.classify;
                this.formData.type = editInvoiceInfo.type;
                this.formData.isFull = editInvoiceInfo.isFull;
                this.formData.invoiceType = editInvoiceInfo.invoiceType;
                this.formData.invoiceDesc = editInvoiceInfo.invoiceDesc;
                this.formData.invoiceTime = editInvoiceInfo.invoiceTime;
                this.formData.invoicePriceYuan = editInvoiceInfo.invoicePriceYuan;
                this.formData.invoiceImgNum = editInvoiceInfo.invoiceImgNum;
                this.formData.payDesc = editInvoiceInfo.payDesc;
                this.formData.payTime = editInvoiceInfo.payTime;
                this.formData.payPriceYuan = editInvoiceInfo.payPriceYuan;
                this.formData.payImgNum = editInvoiceInfo.payImgNum;
            }
        },
        computed: {
            ...mapGetters([
                'permissions','userId','companyId'
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
            getItemVosWithUserId(userId) {
                getItemVosWithUserId(userId)
                    .then(response => {
                        response.data.data.forEach(element => {
                            this.itemOptions.push({value:element.itemId,label:element.alias});
                        })
                    })
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
            backHistory() {
                window.localStorage.removeItem("editInvoiceInfo");
                this.formData.newData = true;
                this.formData.invoiceId = null;
                this.formData.companyId = null;
                this.formData.itemId = null;
                this.formData.userId = null;
                this.formData.classify = "7";
                this.formData.type = "1";
                this.formData.isFull = "0";
                this.formData.invoiceType = "2";
                this.formData.invoiceDesc = "";
                this.formData.invoiceTime = "";
                this.formData.invoicePrice = null;
                this.formData.invoiceImgNum = null;

                this.formData.payDesc = "";
                this.formData.payTime = "";
                this.formData.payPrice = null;
                this.formData.payImgNum = null;

                this.$router.go(-1);
            },
            onSubmit() {
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        this.saving = true;
                        console.log(this.formData.newData);
                        if(!this.formData.newData){
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
                this.formData.payImg = this.formData.payImg.replace(imgUrl +"," , "")
                console.log(this.formData.payImg)
            },
            handlePreview1(file) {
                console.log(file);
            },
            handSuccess1(data) {
                const imgInfo = data.data;
                const imgUrl = imgInfo.bucketName + "-" + imgInfo.fileName;
                this.formData.payImg += imgUrl + ","
                console.log(this.formData.payImg)
            },
            handleRemove2(data) {
                const imgInfo = data.response.data;
                const imgUrl = imgInfo.bucketName + "-" + imgInfo.fileName;
                this.formData.invoiceImg = this.formData.invoiceImg.replace(imgUrl +"," , "")
                console.log(this.formData.invoiceImg)
            },
            handlePreview2(file) {
                console.log(file);
            },
            handSuccess2(data) {
                const imgInfo = data.data;
                const imgUrl = imgInfo.bucketName + "-" + imgInfo.fileName;
                this.formData.invoiceImg += imgUrl + ","
                console.log(this.formData.invoiceImg)
            },
            getStandardApplyInfo() {
                getStandardApplyInfoById(6)
                    .then(response => {
                        if(response.data.data){
                            const data = response.data.data;
                            this.content = data.content;
                            const invoiceStandardApply = JSON.parse(window.localStorage.getItem("invoiceStandardApply"));
                            if(invoiceStandardApply){
                                if (invoiceStandardApply.version < data.version){
                                    this.open();
                                }
                            }else{
                                this.open();
                            }
                            window.localStorage.setItem("invoiceStandardApply", JSON.stringify(data));
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
                this.$alert(h('div',null,newDatas),'报销规范');
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

</style>
