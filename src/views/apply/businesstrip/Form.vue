<template>
    <div>
        <el-button type="primary" class="invoiceRules" @click="open">出差规范</el-button>
        <el-form label-position="right" ref="formData" :rules="rules" :model="formData"  class="form" :label-position="labelPosition" label-width="100px">
            <el-form-item label="项目：">
                <el-select v-model="formData.itemId" placeholder="请选择" style="width: 230px;">
                    <el-option v-for="(item, index) in itemOptions" :value="item.value" :key="index" :label="item.label">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="目的地：" prop="destinations">
                <el-input type="text" placeholder="请填写出差目的地" v-model="formData.destinations" maxlength="20" show-word-limit class="elInput"></el-input>
            </el-form-item>

            <el-form-item label="出差时间：" required>
                <el-date-picker
                    prop="start"
                    class="pickerStart"
                    v-model="formData.start"
                    :picker-options="pickerOptions1"
                    @change="selectStart"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
                <el-date-picker
                    prop="end"
                    v-model="formData.end"
                    :picker-options="pickerOptions2"
                    @change="selectEnd"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="出差天数：" prop="days">
                <el-input type="text" :disabled="true" placeholder="请填写出差天数" v-model="timeValue" maxlength="10" show-word-limit class="elInput">天</el-input>
            </el-form-item>

            <el-form-item label="出差事由：" prop="reason">
                <el-input type="textarea" placeholder="请填写出差事由" v-model="formData.reason" maxlength="30" show-word-limit></el-input>
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
    import {addObj, editObj} from "../../../api/apply/businesstrip.js";
    import {getApplyUserInfo} from "../../../api/admin/user.js";
    import {getItemVosWithUserId} from "../../../api/project/team.js";
    import {getStandardApplyInfoById} from "../../../api/standard/apply.js";
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                query: {
                    itemId: null,
                    userId: null,
                    deptId: null,
                    type: 3
                },
                labelPosition:'right',
                formData: {
                    newData: true,
                    businesstripId: null,
                    itemId: null,
                    userId: "",
                    destinations: "",
                    start: "",
                    end: "",
                    days: "",
                    reason: "",
                    clockList: "",
                    approverids: "",
                },
                timeValue: "",
                itemOptions: [
                    {
                        value: null,
                        label: '与项目无关'
                    },
                ],
                rules: {
                    destinations: [
                        { required: true, message: '请填写出差目的地', trigger: 'blur' }
                    ],
                    start: [
                        { required: true, message: '请填写开始日期', trigger: 'blur' }
                    ],
                    end: [
                        { required: true, message: '请填写结束日期', trigger: 'blur' }
                    ],
                    days: [
                        { required: true, message: '请填写出差天数', trigger: 'blur' }
                    ],
                    reason: [
                        { required: true, message: '请填写出差事由', trigger: 'blur' },
                    ]
                },
                saving: false,
                applyUserList: [],
                pickerOptions1: {
                    disabledDate: this.disabledDate
                },
                pickerOptions2: {
                    disabledDate: this.disabledDate
                    // disabledDate(time) {
                    //     return time.getTime() < Date.now() - (7 * 24 * 3600 * 1000) || time.getTime() > Date.now() + (7 * 24 * 3600 * 1000);
                    // }
                }
            }
        },
        created() {
            this.getStandardApplyInfo();
            this.getApplyUser(this.userId);
            this.getItemVosWithUserId(this.userId);
            this.formData.userId = this.userId;
            this.query.userId = this.userId

            const editBusinesstripInfo = JSON.parse(window.localStorage.getItem("editBusinesstripInfo"));
            if (editBusinesstripInfo){
                this.formData.newData = false;
                this.formData.businesstripId = editBusinesstripInfo.businesstripId;
                this.formData.itemId = editBusinesstripInfo.itemId;
                this.formData.destinations = editBusinesstripInfo.destinations;
                this.formData.start = editBusinesstripInfo.start;
                this.formData.end = editBusinesstripInfo.end;
                this.formData.days = editBusinesstripInfo.days;
                this.timeValue = editBusinesstripInfo.days + " 天";
                this.formData.reason = editBusinesstripInfo.reason;
            } else {
                this.applyClockInfo = JSON.parse(window.localStorage.getItem("applyClockInfo"));
                if (this.applyClockInfo) {
                    this.formData.start = this.applyClockInfo.day;
                    this.formData.end = this.applyClockInfo.day;
                    this.formData.days = 1;
                    this.timeValue = "1 天"
                    this.formData.clockList = JSON.stringify(this.applyClockInfo);
                }
            }
        },
        computed: {
            ...mapGetters([
                'permissions','userId'
            ])
        },
        methods:{
            getApplyUser() {
                getApplyUserInfo(this.query)
                    .then(response => {
                        const applyUser = response.data.data
                        this.applyUserList.push({userId:applyUser.userId, username:applyUser.username, avatar:applyUser.avatar});
                        this.formData.approverids = applyUser.userId
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
            backHistory() {
                window.localStorage.removeItem("editBusinesstripInfo");
                window.localStorage.removeItem("applyClockInfo");
                this.formData.newData = true;
                this.formData.businesstripId = null;
                this.formData.itemId = null;
                this.formData.destinations = "";
                this.formData.start = "";
                this.formData.end = "";
                this.formData.days = "";
                this.formData.reason = "";
                this.timeValue = "";
                this.$router.go(-1);
            },
            disabledDate(time) {
                if (!this.formData.start && !this.formData.end){
                    return time.getTime() < Date.now() - (8 * 24 * 3600 * 1000)
                        || time.getTime() > Date.now() + (7 * 24 * 3600 * 1000);
                }

                if (this.formData.start && !this.formData.end){
                    return time.getTime() < new Date(this.formData.start) - (1 * 24 * 3600 * 1000)
                        || time.getTime() > Date.now() + (7 * 24 * 3600 * 1000);
                }

                if (!this.formData.start && this.formData.end){
                    return time.getTime() < Date.now() - (7 * 24 * 3600 * 1000)
                        || time.getTime() > new Date(this.formData.end);
                }

                if (this.formData.start && this.formData.end){
                    return time.getTime() < new Date(this.formData.start) - (1 * 24 * 3600 * 1000)
                        || time.getTime() > new Date(this.formData.end);
                }

                // return time.getTime() < !this.formData.start?Date.now() - (7 * 24 * 3600 * 1000):new Date(this.formData.start)
                //     || time.getTime() > Date.now() + (7 * 24 * 3600 * 1000);

            },
            selectStart(val) {
                if (this.formData.start && this.formData.end){
                    const days = this.DateDiff(this.formData.start, this.formData.end);
                    this.formData.days = days + 1;
                    this.timeValue = this.formData.days + " 天"
                }

            },
            selectEnd(val) {
                if (this.formData.start && this.formData.end){
                    const days = this.DateDiff(this.formData.start, this.formData.end);
                    this.formData.days = days + 1;
                    this.timeValue = this.formData.days + " 天"
                }
            },
            DateDiff(sDate1, sDate2){
                var  aDate,  oDate1,  oDate2,  iDays;
                aDate   =  sDate1.split("-");
                oDate1 = new Date(aDate[0] , aDate[1] ,aDate[2]);    //转换为12-18-2006格式
                aDate   =  sDate2.split("-");
                oDate2 = new Date(aDate[0] , aDate[1] , aDate[2]);
                iDays   =  parseInt(Math.abs(oDate2  -  oDate1)  /  1000  /  60  /  60  /24)    //把相差的毫秒数转换为天数
                return  iDays
            },
            onSubmit() {
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        this.saving = true;
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
            selectIsCross(val) {
                if (this.formData.isCross == 1){
                    this.formData.end = "";
                    this.endOptions.start = "00:00";
                    this.endOptions.end = "05:30";
                    this.endOptions.minTime = "";
                }else {
                    this.formData.end = "";
                    this.endOptions.start = "07:00";
                    this.endOptions.end = "23:30";
                    this.endOptions.minTime = this.formData.start;
                }
            },
            getStandardApplyInfo() {
                getStandardApplyInfoById(3)
                    .then(response => {
                        if(response.data.data){
                            const data = response.data.data;
                            this.content = data.content;
                            const businesstripStandardApply = JSON.parse(window.localStorage.getItem("businesstripStandardApply"));
                            if(businesstripStandardApply){
                                if (businesstripStandardApply.version < data.version){
                                    this.open();
                                }
                            }else{
                                this.open();
                            }
                            window.localStorage.setItem("businesstripStandardApply", JSON.stringify(data));
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

                this.$alert(h('div',null, newDatas), '出差规范');
            },
        },
        mounted() {

        }
    }
</script>
<style type="text/scss" lang="scss" scoped>
</style>
