<template>
    <div>
        <el-button type="primary" class="invoiceRules" @click="open">请假规范</el-button>
        <el-form label-position="right" ref="formData" :rules="rules" :model="formData" class="form" :label-position="labelPosition" label-width="100px">

            <el-form-item label="项目：">
                <el-select v-model="formData.itemId" placeholder="请选择未打卡日期">
                    <el-option v-for="(item, index) in itemOptions" :value="item.value" :key="index" :label="item.label">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="请假类型：" prop="type">
                <el-select v-model="formData.type" placeholder="请选择类型" @change="selectLeaveType">
                    <el-option v-for="(item, index) in typeOptions" :value="item.value" :key="index" :label="item.label" :disabled="item.disabled">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="调休日期：" v-if="formData.type=='4'">
                <el-select v-model="formData.rest" multiple placeholder="请选择" @change="selectRest">
                    <el-option v-for="(item, index) in restOptions" :value="item.value" :key="index" :label="item.label">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="调休日期：" v-if="formData.type=='4'">
                <el-date-picker
                    class="pickerStart"
                    v-model="formData.start"
                    :picker-options="pickerOptions7"
                    @change="selectStart"
                    type="date"
                    placeholder="选择开始时间"
                    format="yyyy年MM月dd日"
                    value-format="yyyy-MM-dd"
                >
                </el-date-picker>
                <el-date-picker
                    v-model="formData.end"
                    :picker-options="pickerOptions8"
                    @change="selectEnd"
                    type="date"
                    placeholder="选择结束时间"
                    format="yyyy年MM月dd日"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="请假时间：" v-if="formData.type=='9' || formData.type=='10'">
                <el-date-picker
                    v-model="formData.start"
                    :picker-options="pickerOptions9"
                    @change="chooseSat"
                    type="date"
                    value-format="yyyy-MM-dd"
                    format="yyyy年MM月dd日"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>

            <el-form-item v-if="formData.type == '1'" label="请假时间：" required>
                <el-date-picker
                    prop="start"
                    v-model="formData.start"
                    :picker-options="pickerOptions10"
                    @change="chooseStart"
                    type="datetime"
                    class="pickerStart"
                    placeholder="选择开始时间"
                    default-time="09:30:00"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
                <el-date-picker
                    prop="end"
                    v-model="formData.end"
                    type="datetime"
                    :picker-options="pickerOptions11"
                    @change="chooseEnd"
                    placeholder="选择结束时间"
                    default-time="18:30:00"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
            </el-form-item>

            <el-form-item v-if="formData.type == '2'" label="请假时间：" required>
                <el-date-picker
                    v-model="formData.start"
                    prop="start"
                    :picker-options="pickerOptions1"
                    @change="chooseStart"
                    type="datetime"
                    class="pickerStart"
                    placeholder="选择开始时间"
                    default-time="09:30:00"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
                <el-date-picker
                    v-model="formData.end"
                    prop="end"
                    type="datetime"
                    :picker-options="pickerOptions2"
                    @change="chooseEnd"
                    placeholder="选择结束时间"
                    default-time="18:30:00"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss">
                </el-date-picker>
            </el-form-item>


            <el-form-item v-if="formData.type == '3'" label="请假时间：" required>
                <el-date-picker
                v-model="formData.start"
                :picker-options="pickerOptions5"
                @change="selectStart"
                class="pickerStart"
                type="date"
                placeholder="选择开始时间"
                format="yyyy年MM月dd日"
                value-format="yyyy-MM-dd"
                prop="start"
            >
            </el-date-picker>
                <el-date-picker
                    v-model="formData.end"
                    prop="end"
                    :picker-options="pickerOptions6"
                    @change="selectEnd"
                    type="date"
                    placeholder="选择结束时间"
                    format="yyyy年MM月dd日"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>


            <el-form-item v-if="formData.type == '5'|| formData.type == '6'|| formData.type == '7'|| formData.type == '8'" label="请假时间：" required>
                <el-date-picker
                    prop="start"
                    v-model="formData.start"
                    :picker-options="pickerOptions3"
                    @change="selectStart"
                    class="pickerStart"
                    type="date"
                    placeholder="选择开始时间"
                    format="yyyy年MM月dd日"
                    value-format="yyyy-MM-dd"
                    style="margin-right: 10px"
                 >
            </el-date-picker>
                <el-date-picker
                    prop="end"
                    v-model="formData.end"
                    :picker-options="pickerOptions4"
                    @change="selectEnd"
                    type="date"
                    placeholder="选择结束时间"
                    format="yyyy年MM月dd日"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="请假时长：" prop="time">
                <el-input  type="text" :disabled="true" placeholder="请假时长"  v-model="timeValue" maxlength="10" show-word-limit></el-input>
            </el-form-item>
<!--            </div>-->

            <el-form-item label="请假事由：" prop="reason">
                <el-input type="textarea" v-model="formData.reason" placeholder="请填写请假事由" maxlength="100" show-word-limit></el-input>
            </el-form-item>
            <el-form-item label="证明图片：" prop="proveImg" v-if="formData.type == '2'">
                <el-upload
                    :action="uploadUrl"
                    name="file"
                    list-type="picture-card"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :on-success="handSuccess"
                    :before-upload = "beforeAvatarUpload"
                    :auto-upload="true">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </el-form-item>
            <el-form-item label="审批人：">
                <div class="apply-user-list" v-for="user in applyUserList">
                    <el-avatar :size="60" :src="user.avatar"></el-avatar>
                    <span class="username">{{ user.username }}</span>
                </div>
            </el-form-item>
            <el-form-item class="save" style="text-align: center">
                <el-button type="primary" @click="onSubmit">保存</el-button>
                <el-button @click="backHistory">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import {addObj, editObj} from "../../../api/apply/leave.js";
    import {getApplyUserInfo} from "../../../api/admin/user.js";
    import {getItemVosWithUserId} from "../../../api/project/team.js";
    import {getStandardApplyInfoById} from "../../../api/standard/apply.js";
    import {getVacationByUserId} from "../../../api/checkwork/vacation.js";
    import {getRestByUserId} from "../../../api/checkwork/rest.js";
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                query: {
                    itemId: null,
                    userId: null,
                    deptId: null,
                    type: 4
                },
                labelPosition:'right',
                formData: {
                    newData: true,
                    leaveId: null,
                    itemId: null,
                    userId: "",
                    type: "1",
                    start: "",
                    end: "",
                    time: "",
                    reason: "",
                    proveImg: "",
                    restList: "",
                    clockList: "",
                    approverids: "",
                    // sat:""
                },
                timeValue: "",
                uploadUrl: "",
                itemOptions: [
                    {
                        value: null,
                        label: '与项目无关'
                    },
                ],
                timeOptions:[],
                vacationInfo: null,
                restInfo: null,
                restOptions: [],
                typeOptions: [
                    {
                        value: "1",
                        label: '事假'
                    },
                    {
                        value: "2",
                        label: '病假'
                    },
                    {
                        value: "3",
                        label: '年假'
                    },
                    {
                        value: "4",
                        label: '调休'
                    },
                    {
                        value: "5",
                        label: '婚假'
                    },
                    {
                        value: "6",
                        label: '产假'
                    },
                    {
                        value: "7",
                        label: '陪产假'
                    },
                    {
                        value: "8",
                        label: '丧假'
                    },
                    {
                        value: "9",
                        label: '周六妈妈带娃'
                    },
                    {
                        value: "10",
                        label: '周六培训学习'
                    },
                ],
                rules: {
                    type: [
                        { required: true, message: '请选择请假类型', trigger: 'change' }
                    ],
                    start: [
                        { required: true, message: '请选择时间', trigger: 'change' }
                    ],
                    end: [
                        { required: true, message: '请选择时间', trigger: 'change' }
                    ],
                    time: [
                        { required: true, message: '请选择时间'}
                    ],
                    reason: [
                        { required: true, message: '请填写请假事由'},
                    ],
                    proveImg: [
                        { required: true, message: '请上传证明图片', trigger: 'change' },
                    ]
                },
                saving: false,
                applyUserList: [],
                pickerOptions1:{
                    disabledDate: this.disabledDate
                },
                pickerOptions2:{
                    disabledDate: this.disabledDate
                },
                pickerOptions3:{
                    disabledDate: this.disabledDate
                },
                pickerOptions4:{
                    disabledDate: this.disabledDate
                },
                pickerOptions5:{
                    disabledDate: this.disabledDate1
                },
                pickerOptions6:{
                    disabledDate: this.disabledDate1
                },
                pickerOptions7:{
                    disabledDate: this.disabledDate2
                },
                pickerOptions8:{
                    disabledDate: this.disabledDate2
                },
                pickerOptions9:{
                    disabledDate: this.disabledDate3
                },
                pickerOptions10:{
                    disabledDate: this.disabledDate4
                },
                pickerOptions11:{
                    disabledDate: this.disabledDate4
                },


                startDate:'',
                endDate:'',
                dataList:[],
            }
        },
        created() {
            this.getStandardApplyInfo();
            this.getApplyUser(this.userId);
            this.getItemVosWithUserId(this.userId);

            this.getVacationByUserId(this.userId);
            this.getRestByUserId(this.userId);

            this.formData.userId = this.userId;
            this.query.userId= this.userId;

            this.uploadUrl = `${window.location.origin}/apply/leave/upload`;
            const editLeaveInfo = JSON.parse(window.localStorage.getItem("editLeaveInfo"));

            console.log(editLeaveInfo);
            if (editLeaveInfo){
                this.formData.newData = false;
                this.formData.leaveId = editLeaveInfo.leaveId;
                this.formData.itemId = editLeaveInfo.itemId;
                this.formData.type = editLeaveInfo.type;
                this.formData.start = editLeaveInfo.start;
                this.formData.end = editLeaveInfo.end;
                this.formData.time = editLeaveInfo.time;
                this.timeValue = editLeaveInfo.time + " 天";
                this.formData.reason = editLeaveInfo.reason;
            } else {
                this.applyClockInfo = JSON.parse(window.localStorage.getItem("applyClockInfo"));
                if (this.applyClockInfo) {
                    this.formData.type = "1";

                    this.formData.end = this.applyClockInfo.day;
                    if (this.applyClockInfo.type == 1){
                        this.formData.start = this.applyClockInfo.day + " 09:30:00";
                        this.formData.end = this.applyClockInfo.day + " 12:00:00";
                        this.formData.time = 2.5;
                        this.timeValue = "2.5小时";
                    }
                    if (this.applyClockInfo.type == 2){
                        this.formData.start = this.applyClockInfo.day + " 14:00:00";
                        this.formData.end = this.applyClockInfo.day + " 18:30:00";
                        this.formData.time = 4.5;
                        this.timeValue = "4.5小时";
                    }

                    this.formData.clockList = JSON.stringify(this.applyClockInfo);
                }
            }
        //    年假
           this.vacation()
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
            getVacationByUserId(userId) {
                getVacationByUserId(userId)
                    .then(response => {
                        this.vacationInfo = response.data.data;
                        if (this.vacationInfo){
                            this.typeOptions[0].label = "事假（" + this.vacationInfo.thingNum + '小时）';
                            this.typeOptions[2].label = "年假（" + this.vacationInfo.annualNum + '天）';
                        }
                    })
            },
            getRestByUserId(userId) {
                getRestByUserId(userId)
                    .then(response => {
                        console.log(response)
                        this.restInfo = response.data.data;
                        this.restInfo.forEach(element => {
                            this.restOptions.push({value:element.day,label:element.day});
                        });
                        if (this.restInfo.length > 0){
                            this.typeOptions[3].label = "调休（" + this.restInfo.length + '天）';
                        }else {
                            this.typeOptions[3].label = "调休（0天）";
                            this.typeOptions[3].disabled = true;
                        }
                    })
            },
            disabledDate(time) {

                if (!this.formData.start && !this.formData.end){
                    return time.getTime() < Date.now() - (8 * 24 * 3600 * 1000)
                        || time.getTime() > Date.now() + (7 * 24 * 3600 * 1000);
                }
                 if (this.formData.start && !this.formData.end){
                    return time.getTime() < new Date(this.formData.start) - (1 * 24 * 3600 * 1000)
                        || time.getTime() > Date.now() + (this.vacationInfo.annualNum * 24 * 3600 * 1000);
                }

                if (!this.formData.start && this.formData.end){
                    return time.getTime() < Date.now() - (7 * 24 * 3600 * 1000)
                        || time.getTime() > new Date(this.formData.end);
                }

                if (this.formData.start && this.formData.end){
                    return time.getTime() < new Date(this.formData.start) - (1 * 24 * 3600 * 1000)
                        || time.getTime() > new Date(this.formData.end);
                }
            },
          // 年假
            disabledDate1(time) {
                if (!this.formData.start && !this.formData.end){
                    return time.getTime() < Date.now() - (8 * 24 * 3600 * 1000)
                        || time.getTime() > Date.now() + (7 * 24 * 3600 * 1000);
                }
                if (this.formData.start && !this.formData.end){
                    return time.getTime() < new Date(this.formData.start) - (1 * 24 * 3600 * 1000)
                        || time.getTime() > Date.parse(this.formData.start) + ((this.vacationInfo.annualNum-1) * 24 * 3600 * 1000);
                }
                if (!this.formData.start && this.formData.end){
                    return time.getTime() <Date.parse(this.formData.end) - (this.vacationInfo.annualNum * 24 * 3600 * 1000)
                        || time.getTime() > new Date(this.formData.end);
                }
                if (this.formData.start && this.formData.end){
                    return time.getTime() < new Date(this.formData.start) - (1 * 24 * 3600 * 1000)
                        || time.getTime() > new Date(this.formData.end);
                }
            },
            //调休
            disabledDate2(time) {
                if (!this.formData.start && !this.formData.end){
                    return time.getTime() < Date.now() - (8 * 24 * 3600 * 1000)
                        || time.getTime() > Date.now() + (7 * 24 * 3600 * 1000);
                }
                if (this.formData.start && !this.formData.end){
                    return time.getTime() < new Date(this.formData.start) - (1 * 24 * 3600 * 1000)
                        || time.getTime() > Date.parse(this.formData.start) + ((this.formData.time-1) * 24 * 3600 * 1000);
                }
                if (!this.formData.start && this.formData.end){
                    return time.getTime() <Date.parse(this.formData.end) - (this.formData.time * 24 * 3600 * 1000)
                        || time.getTime() > new Date(this.formData.end);
                }
                if (this.formData.start && this.formData.end){
                    return time.getTime() < new Date(this.formData.start) - (1 * 24 * 3600 * 1000)
                        || time.getTime() > new Date(this.formData.end);
                }
            },
            //周六
            disabledDate3(time) {
                switch (new Date().getDay()) {
                    case 0:
                        return  time.getTime() < Date.now() - ((0+7) * 24 * 3600 * 1000)
                            || time.getTime() > Date.now() - ((0+6) * 24 * 3600 * 1000)
                            && time.getTime() < Date.now() + ((0+7) * 24 * 3600 * 1000)
                            || time.getTime() > Date.now() + ((0+8) * 24 * 3600 * 1000);
                        break;
                    case 1:
                        return  time.getTime() < Date.now() - ((1+6) * 24 * 3600 * 1000)
                            || time.getTime() > Date.now() - ((1+5) * 24 * 3600 * 1000)
                            && time.getTime() < Date.now() + ((1+6) * 24 * 3600 * 1000)
                            || time.getTime() > Date.now() + ((1+7) * 24 * 3600 * 1000);
                        break;
                    case 2:
                        return  time.getTime() < Date.now() - ((2+5) * 24 * 3600 * 1000)
                            || time.getTime() > Date.now() - ((2+4) * 24 * 3600 * 1000)
                            && time.getTime() < Date.now() + ((2+5) * 24 * 3600 * 1000)
                            || time.getTime() > Date.now() + ((2+6) * 24 * 3600 * 1000);
                        break;
                    case 3:
                        return  time.getTime() < Date.now() - ((3+4) * 24 * 3600 * 1000)
                            || time.getTime() > Date.now() - ((3+3) * 24 * 3600 * 1000)
                            && time.getTime() < Date.now() + ((3+4) * 24 * 3600 * 1000)
                            || time.getTime() > Date.now() + ((3+5) * 24 * 3600 * 1000);
                        break;
                    case 4:
                        return  time.getTime() < Date.now() - ((4+3) * 24 * 3600 * 1000)
                            || time.getTime() > Date.now() - ((4+2) * 24 * 3600 * 1000)
                            && time.getTime() < Date.now() + ((4+3) * 24 * 3600 * 1000)
                            || time.getTime() > Date.now() + ((4+4) * 24 * 3600 * 1000);
                        break;
                    case 5:
                        return  time.getTime() < Date.now() - ((5+2) * 24 * 3600 * 1000)
                            || time.getTime() > Date.now() - ((5+1) * 24 * 3600 * 1000)
                            && time.getTime() < Date.now() + ((5+2) * 24 * 3600 * 1000)
                            || time.getTime() > Date.now() + ((5+3) * 24 * 3600 * 1000);
                        break;
                    case 6:
                        return time.getTime() < Date.now() - ((6+1) * 24 * 3600 * 1000)
                            || time.getTime() > Date.now() - ((6+0) * 24 * 3600 * 1000)
                            && time.getTime() < Date.now() + ((6+1) * 24 * 3600 * 1000)
                            || time.getTime() > Date.now() + ((6+2) * 24 * 3600 * 1000);

                }
            },

            //事假
            disabledDate4(time) {
                 var day = Math.ceil(this.vacationInfo.thingNum/9);
                if (!this.formData.start && !this.formData.end){
                    return time.getTime() < Date.now() - (8 * 24 * 3600 * 1000)
                        || time.getTime() > Date.now() + (7 * 24 * 3600 * 1000);
                }
                if (this.formData.start && !this.formData.end){
                    return time.getTime() < new Date(this.formData.start) - (1 * 24 * 3600 * 1000)
                        || time.getTime() > Date.parse(this.formData.start) + ((day-1) * 24 * 3600 * 1000);
                }
                if (!this.formData.start && this.formData.end){
                    return time.getTime() <Date.parse(this.formData.end) - (day * 24 * 3600 * 1000)
                        || time.getTime() > new Date(this.formData.end);
                }
                if (this.formData.start && this.formData.end){
                    return time.getTime() < new Date(this.formData.start) - (1 * 24 * 3600 * 1000)
                        || time.getTime() > new Date(this.formData.end);
                }
            },

            chooseSat(){
                this.formData.time = 1;
                this.timeValue = this.formData.time + " 天";
            },
            selectStart(val) {
                if (this.formData.start && this.formData.end){
                    const days = this.DateDiff(this.formData.start, this.formData.end);
                    console.log(days)
                    this.formData.time = days + 1 ;
                    this.timeValue = this.formData.time + " 天";
                }

            },
            selectEnd(val) {
                console.log(val);
                if (this.formData.start && this.formData.end){
                    const days = this.DateDiff(this.formData.start, this.formData.end);
                    console.log(days)
                    this.formData.time = days + 1 ;
                    this.timeValue = this.formData.time + " 天";
                }
            },
            DateDiff(sDate1, sDate2){
                var  aDate,  oDate1,  oDate2,  iDays;
                aDate   =  sDate1.split("-");
                oDate1 = new Date(aDate[0] , aDate[1] ,aDate[2]);//转换为12-18-2006格式
                aDate   =  sDate2.split("-");
                oDate2 = new Date(aDate[0] , aDate[1] , aDate[2]);
                iDays   =  parseInt(Math.abs(oDate2  -  oDate1)  /  1000  /  60  /  60  /24);   //把相差的毫秒数转换为天数
                return  iDays
            },
            chooseStart(val){
                console.log(val);
                if (this.formData.start && this.formData.end){
                    const hours = this.chooseDiff(this.formData.start, this.formData.end);
                    this.formData.time = hours;
                    this.timeValue = this.formData.time + " 小时";
                    console.log(hours);
                    console.log(this.formData.time)
                }
            },
            chooseEnd(val){
                console.log(val);
                if (this.formData.start && this.formData.end){
                    const hours = this.chooseDiff(this.formData.start, this.formData.end);
                    this.formData.time = hours;
                    this.timeValue = this.formData.time + " 小时";
                    console.log(hours);
                    console.log(this.formData.time)
                }
            },
            chooseDiff(sDate1, sDate2){
                if(sDate1 == sDate2 == true){
                    var date =  Date.parse(sDate2) - Date.parse(sDate1);
                    var iHours = Math.floor(date/(3600*1000));
                    return iHours;
                    console.log(hours)
                }else if(sDate1 == sDate2 == false) {
                    var date =  Date.parse(sDate2) - Date.parse(sDate1);
                    var day = Math.floor(date/3600/1000/24);

                    var iHours = Math.floor(date/(3600*1000));
                    var iHours = iHours - 15*day;
                    return iHours;
                    console.log(hours)
                }
            },
            selectLeaveType(val) {
                this.formData.start = "";
                this.formData.end = "";
                this.formData.time = "";
                this.timeValue = "";
            },

            selectRest(val) {
                //console.log(val)
                this.formData.restList = "";
                val.forEach(element => {
                    this.formData.restList = element + ","
                });
                this.formData.time = val.length;
                this.timeValue = val.length + " 天";
            },
            vacation(){

            },
            backHistory() {
                window.localStorage.removeItem("editLeaveInfo");
                window.localStorage.removeItem("applyClockInfo");
                this.formData.newData = true;
                this.formData.leaveId = null;
                this.formData.itemId = null;
                this.formData.start = "";
                this.formData.end = "";
                this.formData.day = "";
                this.formData.time = "";
                this.timeValue = "";
                this.formData.reason = "";
                this.$router.go(-1);
            },
            onSubmit() {
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
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
            beforeAvatarUpload:function(file){
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isPG = (isJPG || isPNG)
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isPG) {
                    this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
                }
                if (!isLt5M) {
                    this.$message.error('上传图片大小不能超过 5MB!');
                }
                return isPG && isLt5M
            },
            handleRemove(data) {
                const imgInfo = data.response.data;
                const imgUrl = imgInfo.bucketName + "-" + imgInfo.fileName;
                this.formData.proveImg = this.formData.proveImg.replace(imgUrl +"," , "");
                console.log(this.formData.proveImg)
            },
            handlePreview(file) {
                console.log(file);
            },
            handSuccess(data) {
                const imgInfo = data.data;
                const imgUrl = imgInfo.bucketName + "-" + imgInfo.fileName;
                this.formData.proveImg += imgUrl + ","
            },
            getStandardApplyInfo() {
                getStandardApplyInfoById(4)
                    .then(response => {
                        if(response.data.data){
                            const data = response.data.data;
                            this.content = data.content;
                            const leaveStandardApply = JSON.parse(window.localStorage.getItem("leaveStandardApply"));
                            if(leaveStandardApply){
                                if (leaveStandardApply.version < data.version){
                                    this.open();
                                }
                            }else{
                                this.open();
                            }
                            window.localStorage.setItem("leaveStandardApply", JSON.stringify(data));
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
                this.$alert(h('div',null, newDatas), '请假规范');
            },
        },
        mounted() {

        }
    }
</script>
<style type="text/scss" scoped lang="scss">
</style>
