<template>
    <div>
        <el-button type="primary" class="invoiceRules" @click="open">外出规范</el-button>
        <el-form label-position="right" ref="formData" :rules="rules" :model="formData"  class="form" :label-position="labelPosition" label-width="100px">
            <el-form-item label="项目：">
                <el-select v-model="formData.itemId" clearable placeholder="请选择" @change="selectItem">
                    <el-option v-for="(item, index) in itemOptions" :value="item.value" :key="index" :label="item.label">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-row>
                <el-col  :md="{span:8}" :xs="{span:24}">
                    <el-form-item label="外出日期：" prop="day">
                        <el-date-picker
                            v-model="formData.day"
                            :picker-options="pickerOptions1"
                            type="date"
                            placeholder="选择日期"
                            format="yyyy 年 MM 月 dd 日"
                            value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="是否跨天：" prop="isCross">
                <el-radio-group v-model="formData.isCross" @change="selectIsCross">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="0">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="外出时间：" required>
                <el-time-select
                    prop="start"
                    class="pickerStart"
                    v-model="formData.start"
                    @change="selectStartTime"
                    placeholder="选择开始时间"
                    :picker-options="{
                    start: '07:00',
                    step: '00:30',
                    end: '23:30'
                  }">
                </el-time-select>
                <el-time-select
                    prop="end"
                    v-model="formData.end"
                    @change="selectEndTime"
                    placeholder="选择结束时间"
                    :picker-options="endOptions">
                </el-time-select>
            </el-form-item>

            <el-form-item label="外出时长：" prop="time">
                <el-input v-model="timeValue" placeholder="请选择日期" :disabled="true"></el-input>
            </el-form-item>

            <el-form-item label="外出事由：" prop="reason">
                <el-input type="textarea" v-model="formData.reason" maxlength="30" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="审批人：">
                <div class="apply-user-list" v-for="user in applyUserList">
                    <el-avatar :size="60" :src="user.avatar"></el-avatar>
                    <span class="username">{{ user.username }}</span>
                </div>
            </el-form-item>
            <el-form-item class="saveForm">
<!--                <el-button type="primary" @click="open">外出规范</el-button>-->
                <el-button type="primary" @click="onSubmit" :loading="saving">保存</el-button>
                <el-button @click="backHistory">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import {addObj, editObj} from "../../../api/apply/goout.js";
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
                    type: 2
                },
                labelPosition:'right',
                startTime:'',
                endTime:'',
                formData: {
                    newData: true,
                    gooutId: null,
                    itemId: null,
                    userId: "",
                    day: "",
                    isCross: "0",
                    start: "",
                    end: "",
                    time: null,
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
                endOptions: {
                    start: '07:00',
                    step: '00:30',
                    end: '23:30',
                    minTime: ''
                },
                rules: {
                    destinations: [
                        { required: true, message: '请填写出差目的地', trigger: 'blur' }
                    ],
                    day: [
                        { required: true, message: '请选择日期', trigger: 'blur' }
                    ],
                    isCross: [
                        { required: true, message: '请选择', trigger: 'blur' }
                    ],
                    start: [
                        { required: true, message: '请填写开始时间', trigger: 'blur' }
                    ],
                    end: [
                        { required: true, message: '请填写回来时间', trigger: 'blur' }
                    ],
                    time: [
                        { required: true, message: '请填写时长', trigger: 'blur' }
                    ],
                    reason: [
                        { required: true, message: '请填写外出事由', trigger: 'blur' },
                    ]
                },
                saving: false,
                applyUserList: [],
                pickerOptions1:{
                    disabledDate(time) {
                        return time.getTime() < new Date().getTime() - (3600 * 1000 * 24 * 8) || time.getTime() > new Date().getTime() + (3600 * 1000 * 24 * 7);
                    },
                },
            }
        },
        created() {
            this.getStandardApplyInfo();
            this.getApplyUser(this.userId);
            this.getItemVosWithUserId(this.userId);
            this.formData.userId = this.userId;
            this.query.userId= this.userId;

            const editGooutInfo = JSON.parse(window.localStorage.getItem("editGooutInfo"));
            if (editGooutInfo){
                this.formData.newData = false;
                this.formData.gooutId = editGooutInfo.gooutId;
                this.formData.itemId = editGooutInfo.itemId == ''||editGooutInfo.itemId == null || editGooutInfo.itemId == undefined ? null : editGooutInfo.itemId;
                this.formData.day = editGooutInfo.day;
                this.formData.isCross = editGooutInfo.isCross;
                this.formData.start = editGooutInfo.start;
                this.formData.end = editGooutInfo.end;
                this.formData.time = editGooutInfo.time;
                this.formData.reason = editGooutInfo.reason;

            } else {
                this.applyClockInfo = JSON.parse(window.localStorage.getItem("applyClockInfo"));
                if (this.applyClockInfo) {
                    this.formData.day = this.applyClockInfo.day;
                    if (this.applyClockInfo.type == 1){
                        this.formData.start = "09:30";
                        this.formData.end = "12:00";
                        this.formData.time = 2.5;
                        this.timeValue = "2.5 小时";
                    }
                    if (this.applyClockInfo.type == 2){
                        this.formData.start = "14:00";
                        this.formData.end = "18:30";
                        this.formData.time = 4.5;
                        this.timeValue = "4.5 小时";
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
                        const applyUser = response.data.data;
                        this.applyUserList = [];
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
                window.localStorage.removeItem("editGooutInfo");
                window.localStorage.removeItem("applyClockInfo")
                this.formData.newData = true;
                this.formData.gooutId = null;
                this.formData.itemId = null;
                this.formData.start = "";
                this.formData.end = "";
                this.formData.time = "";
                this.timeValue = "";
                this.formData.reason = "";
                this.$router.go(-1);
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
            selectStartTime(val) {
                this.formData.end = "";
                this.formData.time = null;
                this.timeValue = "";
                if (this.formData.isCross == 0){
                    this.endOptions.minTime = val;
                }
            },
            selectEndTime(val) {
                const startHour = this.formData.start.split(":");
                const endHour = this.formData.end.split(":");
                const end = ('24:00').split(":");
                const end1 = ('00:00').split(":");

                if (this.formData.isCross == 0){
                    const startMin = ((24-parseInt(startHour[0])) * 60) + parseInt(startHour[1]);
                    const endMin = ((24-parseInt(endHour[0])) * 60) - parseInt(endHour[1]);
                    //console.log(endMin)
                    const mins = startMin - endMin;
                    // console.log(mins/60)
                    // console.log(mins)
                    if(startHour[1] == 30){
                        this.formData.time = mins/60 - 1;
                        this.timeValue = mins/60 - 1 + " 小时"
                    }else {
                        this.formData.time = mins/60;
                        this.timeValue = mins/60 + " 小时"
                    }
                }
                else if(this.formData.isCross == 1){
                     const hoursTime1 = ((24-parseInt(startHour[0])) * 60) + parseInt(startHour[1]);
                     const hoursTime11 = ((24-parseInt(end[0])) * 60) - parseInt(end[1]);
                     const hoursTime111 = (hoursTime1 - hoursTime11)/60;

                     const hoursTime2 = ((24-parseInt(end1[0])) * 60) + parseInt(end1[1]);
                     const hoursTime22 = ((24-parseInt(endHour[0])) * 60) - parseInt(endHour[1]);
                     const hoursTime222 = (hoursTime2 - hoursTime22)/60;

                     if(startHour[1] == 30){
                         this.timeValue = hoursTime111 - 1 + hoursTime222 +"小时";
                     }else {
                         this.timeValue = hoursTime111 + hoursTime222 +"小时";
                     }
                }
            },
            getStandardApplyInfo() {
                getStandardApplyInfoById(2)
                    .then(response => {
                       if(response.data.data){
                           console.log(response);
                           const data = response.data.data;
                           this.content = data.content;
                           const gootStandardApply = JSON.parse(window.localStorage.getItem("gooutStandardApply"));
                           // console.log(gootStandardApply);
                           if(gootStandardApply){
                               if (gootStandardApply.version < data.version){
                                   this.open();
                               }
                           }else{
                               this.open();
                           }
                           window.localStorage.setItem("gooutStandardApply", JSON.stringify(data));
                       }
                    });
            },
            open() {
                console.log(this.content);
                let content = this.content.split('\n\n');
                let newDatas = [];
                const h = this.$createElement;
                for(let i in content){
                    newDatas.push(h('p',null,content[i]));
                };
                this.$alert(h('div',null,newDatas),'外出规范');
            },
        },
        mounted() {

        }
    }
</script>
<style type="text/scss" scoped lang="scss">

</style>
