<template>
    <div>
        <el-button type="primary" class="invoiceRules" @click="open">未打卡规范</el-button>
        <el-form label-position="right" :model="formData" :rules="rules" ref="formData" class="form" label-width="135px">
            <el-form-item label="未打卡日期：" prop="day">
                <el-select v-model="formData.day" :disabled="disabledDay" placeholder="请选择未打卡日期" @change="selectClockDay">
                    <el-option v-for="(item, index) in dayOptions" :value="item.value" :key="index" :label="item.label">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="未打卡时间：" prop="time">
                <el-time-select
                    v-model="formData.time"
                    :picker-options="{
                        start: '07:00',
                        step: '00:30',
                        end: '23:30'
                      }"
                    placeholder="选择时间：">
                </el-time-select>
            </el-form-item>

            <el-form-item label="未打卡事由：" prop="reason">
                <el-input type="textarea" v-model="formData.reason" placeholder="请输入未打卡事由" maxlength="30" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="审批人：">
                <div class="apply-user-list" v-for="user in applyUserList">
                    <el-avatar :size="60" :src="user.avatar"></el-avatar>
                    <span class="username">{{ user.username }}</span>
                </div>
            </el-form-item>
            <div style="color: #1f2d3d;margin-left: 30%;padding: 10px 0;" v-if="formData.day">
                你本月还有<span style="color: #a94442"> {{clockNum}} </span>次未打卡申请次数
            </div>
            <el-form-item style="text-align: center" class="save">
                <el-button v-if="clockNum <= 0" type="info" disabled="disabled">保存</el-button>
                <el-button v-else type="primary" @click="onSubmit" :loading="saving">保存</el-button>
                <el-button @click="backHistory">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import {getApplyUserInfo} from "../../../api/admin/user.js";
    import {getAbnormalSeven} from "../../../api/checkwork/clock.js";
    import {addObj,editObj} from "../../../api/apply/clock.js";
    import {getClockNum} from "../../../api/checkwork/month.js";
    import {getStandardApplyInfoById} from "../../../api/standard/apply.js";
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                query: {
                    itemId: null,
                    userId: null,
                    deptId: null,
                    type: 5
                },
                queryClockNum: {
                    userId: null,
                    type: '1',
                    month: ""
                },
                formData: {
                    newData: true,
                    userId: "",
                    day: "",
                    time: "",
                    reason: "",
                    clockList: "",
                    approverids: "",
                },
                dayOptions: [
                    {
                        lable:"2020-01-08",
                        value:"2020-01-08"
                    }
                ],
                saving: false,
                clockNum: 0,
                disabledDay: true,
                rules: {
                    day: [
                        { required: true, message: '请选择未打卡日期', trigger: 'change' }
                    ],
                    time: [
                        { required: true, message: '请选择未打卡时间', trigger: 'change' }
                    ],
                    reason: [
                        { required: true, message: '请填写未打卡事由'},
                    ]
                },
                applyUserList: [],
                applyClockInfo: ""
            }
        },
        created() {
            this.getStandardApplyInfo();
            this.getApplyUser(this.userId);
            this.formData.userId = this.userId;
            this.query.userId= this.userId;
            this.queryClockNum.userId = this.userId;
            this.getAbnormalSeven();

            const editClockInfo = JSON.parse(window.localStorage.getItem("editClockInfo"));
            if (editClockInfo){
                this.formData.newData = false;
                this.formData.clockId = editClockInfo.clockId;
                this.formData.day = editClockInfo.day;
                this.formData.time = editClockInfo.time;
                this.formData.reason = editClockInfo.reason;
                this.clockNum = 1;
            } else {
                this.disabledDay = false;
                this.applyClockInfo = JSON.parse(window.localStorage.getItem("applyClockInfo"));
                if (this.applyClockInfo) {
                    this.formData.day = this.applyClockInfo.day;
                    if (this.applyClockInfo.type == 1){
                        this.formData.time = "09:30"
                    }
                    if (this.applyClockInfo.type == 2){
                        this.formData.time = "18:30"
                    }
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
            getClockNum() {
                if (this.formData.newData){
                    getClockNum(this.queryClockNum)
                        .then(response => {
                            if (response.data.data){
                                this.clockNum = response.data.data.num;
                            }
                        })
                }
            },
            selectClockDay(val) {
                this.queryClockNum.month = val.substring(0,7);
                this.getClockNum()
            },
            getAbnormalSeven() {
                getAbnormalSeven()
                    .then(response => {
                        //console.log(response)
                    })
            },
            getApplyUser() {
                getApplyUserInfo(this.query)
                    .then(response => {
                        const applyUser = response.data.data;
                        this.applyUserList.push({userId:applyUser.userId, username:applyUser.username, avatar:applyUser.avatar});
                        this.formData.approverids = applyUser.userId
                    });
            },
            backHistory() {
                window.localStorage.removeItem("editClockInfo");
                window.localStorage.removeItem("applyClockInfo");
                this.formData.newData = true;
                this.formData.clockId = null;
                this.formData.day = "";
                this.formData.time = "";
                this.formData.reason = "";
                this.clockNum = 0;
                this.$router.go(-1);
            },
            onSubmit() {
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        this.saving = true;
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
            getStandardApplyInfo() {
                getStandardApplyInfoById(5)
                    .then(response => {
                        if(response.data.data){
                            const data = response.data.data;
                            this.content = data.content;
                            const clockStandardApply = JSON.parse(window.localStorage.getItem("clockStandardApply"));
                            if(clockStandardApply){
                                if (clockStandardApply.version < data.version){
                                    this.open();
                                }
                            }else{
                                this.open();
                            }
                            window.localStorage.setItem("clockStandardApply", JSON.stringify(data));
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
                this.$alert(h('div',null, newDatas), '未打卡规范');
            },
        },
        mounted() {

        }
    }
</script>
<style type="text/scss" scoped lang="scss">
    .el-input .el-input__count .el-input__count-inner{
        height: 50%;
    }
    .el-image img {
        border-radius: 50%;
    }
    @media screen and (min-width: 1300px) {

        .el-input{
            width: 300%;
        }
        .el-textarea{
            width: 400% !important;
        }
    }
    @media screen and (max-width: 320px) {
        .el-input{
            width: 85% !important;
        }
        .save{
            margin-left: -45%
        }
    }
</style>
