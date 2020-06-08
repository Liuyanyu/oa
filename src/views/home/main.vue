<template>
    <div id="test" ref="lessonTableImg">
        <el-row :gutter="20">
            <el-col :xs="{span:24}" :md="{span:12}">
                <div class="grid-content bg-purple">
                    <el-row :gutter="12">
                        <el-col :span="8"  v-for="item in navItems">
                            <div class="grid-contentL bg-purpleL">
                                <div class="navHead"  v-on:click="applyPanel($event)" :id="item.id">{{item.title}}</div>
                            </div>
                            <div style="border:2px solid #E6E6E6;padding-top: 10px;padding-bottom: 10px;height:50px">
                                <el-col class="left navBody" :span="8">
                                    <div class="nav1" v-on:click="checkPanel($event)" :id="item.id">
                                        <p class="navTit">审核</p>
                                        <p class="navVal">{{item.check}}</p>
                                    </div>
                                </el-col>
                                <el-col class="left navBody" :span="8">
                                    <div class="nav2" v-on:click="agreePanel($event)" :id="item.id">
                                        <p class="navTit">同意</p>
                                        <p class="navVal">{{item.agree}}</p>
                                    </div>
                                </el-col>
                                <el-col class="navBody" :span="8">
                                    <div class="nav3" v-on:click="disagreePanel($event)" :id="item.id">
                                        <p class="navTit">拒绝</p>
                                        <p class="navVal">{{item.disagree}}</p>
                                    </div>
                                </el-col>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
            <el-col :xs="{span:24}" :md="{span:12}">
                <div class="grid-content bg-purple">
                    <el-row :gutter="12">
                        <el-col :span="8"  v-for="item in navTotal">
                            <div class="grid-contentL bg-purpleR" >
                                <div class="navHead">{{item.title}}</div>
                            </div>
                            <div style="border:2px solid #E6E6E6;padding-top: 10px;padding-bottom: 10px;height:50px">
                                <el-col class="left navBody" :span="8">
                                    <div class="nav1" v-on:click="checkPanelR($event)" :id="item.id">
                                        <p class="navTit">审核</p>
                                        <p class="navVal">{{item.check}}</p>
                                    </div>
                                </el-col>
                                <el-col class="left navBody" :span="8">
                                    <div class="nav2" v-on:click="agreePanelR($event)" :id="item.id">
                                        <p class="navTit">同意</p>
                                        <p class="navVal">{{item.agree}}</p>
                                    </div>
                                </el-col>
                                <el-col class="navBody" :span="8" >
                                    <div class="nav3" v-on:click="disagreePanelR($event)" :id="item.id">
                                        <p class="navTit">拒绝</p>
                                        <p class="navVal">{{item.disagree}}</p>
                                    </div>
                                </el-col>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>

        <el-row :gutter="20">
            <el-col :xs="{span:24}" :md="{span:12}">
                <div class="grid-content bg-purple">
                    <el-row :gutter="12">
                        <el-table :data="tableDataL" border stripe class="tab">
                            <el-table-column prop="name"  label="名称" :span="8"></el-table-column>
                            <el-table-column prop="type" label="类型" :span="8"></el-table-column>
                            <el-table-column prop="project" label="项目" :span="8"></el-table-column>
                            <el-table-column prop="approver" label="审批人" :span="8"></el-table-column>
                            <el-table-column prop="status" label="状态" :span="8"></el-table-column>
                        </el-table>
                    </el-row>
                </div>
            </el-col>
            <el-col :xs="{span:24}" :md="{span:12}" class="tab2">
                <div class="grid-content bg-purple">
                    <el-row :gutter="12">
                        <el-table :data="tableDataR" border stripe class="tab">
                            <el-table-column prop="name"  label="名称" :span="8"></el-table-column>
                            <el-table-column prop="type" label="类型" :span="8"></el-table-column>
                            <el-table-column prop="project" label="项目" :span="8"></el-table-column>
                            <el-table-column prop="approver" label="申请人" :span="8"></el-table-column>
                            <el-table-column prop="status" label="操作" :span="8"></el-table-column>
                        </el-table>
                    </el-row>
                </div>
            </el-col>
        </el-row>

<!--        <p @click="setImage" style="color: #000000">截取</p>-->

        <div id='nodeBox' class="content-body" slot="content">

        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            navItems: [
                { title: "任务发布", check: "0",agree:'1',disagree:"999",id:1 },
                { title: "外出申请", check: "0",agree:'1',disagree:"2",id:2 },
                { title: "出差申请", check: "0",agree:'1',disagree:"2",id:3},
                { title: "请假申请", check: "0",agree:'100',disagree:"2",id:4},
                { title: "未打卡申请", check: "0",agree:'1',disagree:"2",id:5},
                { title: "报销申请", check: "0",agree:'1',disagree:"2",id:6},
                { title: "支出申请", check: "0",agree:'1',disagree:"112",id:7},
                { title: "开票申请", check: "0",agree:'1',disagree:"2",id:8},
            ],
            tableDataL: [
                {name: '报销',type: '人员补助',project: '跟项目无关',approver:'王海清',status:'同意',id:1},
                {name: '报销',type: '人员补助',project: '跟项目无关',approver:'王海清',status:'同意',id:2},
                {name: '报销',type: '人员补助',project: '跟项目无关',approver:'王海清',status:'同意',id:3},
                {name: '报销',type: '人员补助',project: '跟项目无关',approver:'王海清',status:'同意',id:4},
                {name: '报销',type: '人员补助',project: '跟项目无关',approver:'王海清',status:'同意',id:5},
                {name: '报销',type: '人员补助',project: '跟项目无关',approver:'王海清',status:'同意',id:6}
            ],
            navTotal: [
                { title: "任务审批", check: "111",agree:'1',disagree:"2",id:1},
                { title: "外出审批", check: "0",agree:'1',disagree:"2",id:2 },
                { title: "出差审批", check: "0",agree:'1',disagree:"2" ,id:3},
                { title: "请假审批", check: "0",agree:'124',disagree:"2" ,id:4},
                { title: "未打卡审批", check: "0",agree:'1',disagree:"2",id:5 },
                { title: "报销审批", check: "0",agree:'1',disagree:"2" ,id:6},
                { title: "支出审批", check: "0",agree:'1',disagree:"244",id:7 },
                { title: "开票审批", check: "0",agree:'1',disagree:"2" ,id:8},
            ],
            tableDataR: [
                {name: '报销',type: '人员补助',project: '跟项目无关',approver:'王海清',status:'同意',id:1},
                {name: '报销',type: '人员补助',project: '跟项目无关',approver:'王海清',status:'同意',id:2},
                {name: '报销',type: '人员补助',project: '跟项目无关',approver:'王海清',status:'同意',id:3},
                {name: '报销',type: '人员补助',project: '跟项目无关',approver:'王海清',status:'同意',id:4},
                {name: '报销',type: '人员补助',project: '跟项目无关',approver:'王海清',status:'同意',id:5},
                {name: '报销',type: '人员补助',project: '跟项目无关',approver:'王海清',status:'同意',id:6}
            ],
        };
    },
    created(){
        this.tabInfo()
    },
    methods:{
        tabInfo(){
            var that = this;
            for(var i=0;i<that.navItems.length;i++){
                if(that.navItems[i].check>99){
                    that.navItems[i].check = 99
                }else if(that.navItems[i].agree>99){
                    that.navItems[i].agree = 99
                }else if(that.navItems[i].disagree>99){
                    that.navItems[i].disagree = 99
                }
            }
            for(var i=0;i<that.navTotal.length;i++){
                if(that.navTotal[i].check>99){
                    that.navTotal[i].check = 99
                }else if(that.navTotal[i].agree>99){
                    that.navTotal[i].agree = 99
                }else if(that.navTotal[i].disagree>99){
                    that.navTotal[i].disagree = 99
                }
            }
        },
        applyPanel(event){
            // var el = event.currentTarget.innerHTML;
            var id = event.currentTarget.id;
            if(id==1){
                this.$router.push({
                    path: "/project/itemForm"
                });
            }else if(id==2){
                this.$router.push({
                    path: "/apply/goout/form"
                });
            }else if(id==3){
                this.$router.push({
                    path: "/apply/businesstrip/form"
                });
            }else if(id==4){
                this.$router.push({
                    path: "/apply/leave/form"
                });
            }
            else if(id==5){
                this.$router.push({
                    path: "/apply/clock/form"
                });
            }
            else if(id==6){
                this.$router.push({
                    path: "/apply/invoice/form"
                });
            }
            else if(id==7){
                this.$router.push({
                    path: "/apply/expense/form"
                });
            }
            else if(id==8){
                this.$router.push({
                    path: "/apply/receipt/form"
                });
            }
        },
        checkPanel(event){
            var id = event.currentTarget.id;
            console.log(id)
            if(id==1){
                this.$router.push({
                    path: "/project/itemForm?status=0"
                });
            }else if(id==2){
                this.$router.push({
                    path: "/apply/goout?status=0"
                });
            }else if(id==3){
                this.$router.push({
                    path: "/apply/businesstrip?status=0"
                });
            }else if(id==4){
                this.$router.push({
                    path: "/apply/leave?status=0"
                });
            }
            else if(id==5){
                this.$router.push({
                    path: "/apply/clock?status=0"
                });
            }
            else if(id==6){
                this.$router.push({
                    path: "/apply/invoice?status=0"
                });
            }
            else if(id==7){
                this.$router.push({
                    path: "/apply/expense?status=0"
                });
            }
            else if(id==8){
                this.$router.push({
                    path: "/apply/receipt?status=0"
                });
            }
        },
        agreePanel(event){
            var id = event.currentTarget.id;
            if(id==1){
                this.$router.push({
                    path: "/project/itemForm?status=1"
                });
            }else if(id==2){
                this.$router.push({
                    path: "/apply/goout?status=1"
                });
            }else if(id==3){
                this.$router.push({
                    path: "/apply/businesstrip?status=1"
                });
            }else if(id==4){
                this.$router.push({
                    path: "/apply/leave?status=1"
                });
            }
            else if(id==5){
                this.$router.push({
                    path: "/apply/clock?status=1"
                });
            }
            else if(id==6){
                this.$router.push({
                    path: "/apply/invoice?status=1"
                });
            }
            else if(id==7){
                this.$router.push({
                    path: "/apply/expense?status=1"
                });
            }
            else if(id==8){
                this.$router.push({
                    path: "/apply/receipt?status=1"
                });
            }
        },
        disagreePanel(event){
            var id = event.currentTarget.id;
            console.log(id)
            if(id==1){
                this.$router.push({
                    path: "/project/itemForm?status=2"
                });
            }else if(id==2){
                this.$router.push({
                    path: "/apply/goout?status=2"
                });
            }else if(id==3){
                this.$router.push({
                    path: "/apply/businesstrip?status=2"
                });
            }else if(id==4){
                this.$router.push({
                    path: "/apply/leave?status=2"
                });
            }
            else if(id==5){
                this.$router.push({
                    path: "/apply/clock?status=2"
                });
            }
            else if(id==6){
                this.$router.push({
                    path: "/apply/invoice?status=2"
                });
            }
            else if(id==7){
                this.$router.push({
                    path: "/apply/expense?status=2"
                });
            }
            else if(id==8){
                this.$router.push({
                    path: "/apply/receipt?status=2"
                });
            }
        },

        checkPanelR(event){
            var id = event.currentTarget.id;
            console.log(id);
            if(id==1){
                this.$router.push({
                    path: "/project/itemForm?status=0"
                });
            }else if(id==2){
                this.$router.push({
                    path: "/apply/goout/approver?status=0"
                });
            }else if(id==3){
                this.$router.push({
                    path: "/apply/businesstrip/approver?status=0"
                });
            }else if(id==4){
                this.$router.push({
                    path: "/apply/leave/approver?status=0"
                });
            }
            else if(id==5){
                this.$router.push({
                    path: "/apply/clock/approver?status=0"
                });
            }
            else if(id==6){
                this.$router.push({
                    path: "/apply/invoice?status=0"
                });
            }
            else if(id==7){
                this.$router.push({
                    path: "/apply/expense?status=0"
                });
            }
            else if(id==8){
                this.$router.push({
                    path: "/apply/receipt?status=0"
                });
            }
        },
        agreePanelR(event){
            var id = event.currentTarget.id;
            if(id==1){
                this.$router.push({
                    path: "/project/itemForm?status=1"
                });
            }else if(id==2){
                this.$router.push({
                    path: "/apply/goout/approver?status=1"
                });
            }else if(id==3){
                this.$router.push({
                    path: "/apply/businesstrip/approver?status=1"
                });
            }else if(id==4){
                this.$router.push({
                    path: "/apply/leave/approver?status=1"
                });
            }
            else if(id==5){
                this.$router.push({
                    path: "/apply/clock/approver?status=1"
                });
            }
            else if(id==6){
                this.$router.push({
                    path: "/apply/invoice?status=1"
                });
            }
            else if(id==7){
                this.$router.push({
                    path: "/apply/expense?status=1"
                });
            }
            else if(id==8){
                this.$router.push({
                    path: "/apply/receipt?status=1"
                });
            }
        },
        disagreePanelR(event){
            var id = event.currentTarget.id;
            console.log(id)
            if(id==1){
                this.$router.push({
                    path: "/project/itemForm?status=2"
                });
            }else if(id==2){
                this.$router.push({
                    path: "/apply/goout/approver?status=2"
                });
            }else if(id==3){
                this.$router.push({
                    path: "/apply/businesstrip/approver?status=2"
                });
            }else if(id==4){
                this.$router.push({
                    path: "/apply/leave/approver?status=2"
                });
            }
            else if(id==5){
                this.$router.push({
                    path: "/apply/clock/approver?status=2"
                });
            }
            else if(id==6){
                this.$router.push({
                    path: "/apply/invoice?status=2"
                });
            }
            else if(id==7){
                this.$router.push({
                    path: "/apply/expense?status=2"
                });
            }
            else if(id==8){
                this.$router.push({
                    path: "/apply/receipt?status=2"
                });
            }
        },

        //   截取图片
        setImage () {
            let that = this;
            //   event.preventDefault();
            var canvas2 = document.createElement("canvas");
            // let _canvas = document.getElementById('child');
            let _canvas = document.getElementById('nodeBox');
            var w = parseInt(window.getComputedStyle(_canvas).width);
            var h = parseInt(window.getComputedStyle(_canvas).height);
            //将canvas画布放大若干倍，然后盛放在较小的容器内，就显得不模糊了
            canvas2.width = w * 4;
            canvas2.height = h * 4;
            canvas2.style.width = w + "px";
            canvas2.style.height = h + "px";
            //可以按照自己的需求，对context的参数修改,translate指的是偏移量
            //  var context = canvas.getContext("2d");
            //  context.translate(0,0);
            var context = canvas2.getContext("2d");
            context.scale(2, 2);
            // html2canvas(document.getElementById('child'), {
            html2canvas(document.getElementById('nodeBox'), {
                canvas: canvas2
            }).then(function (canvas) {
                var blob = that.getBlob(canvas);
                var oMyForm = new FormData();
                var fileName = "mobile" + '.jpg'
                oMyForm.append("file", blob, fileName);
                //				oMyForm.append("fileName", fileName);　　　　
                oMyForm.append("fileType", 'image');
                oMyForm.append("user_id", that)
            });
        },
        getBlob (canvas) { //获取blob对象
            var data = canvas.toDataURL("image/jpeg", 1);
            this.dataurl=data
            console.log(this.dataurl)
            data = data.split(',')[1];
            data = window.atob(data);
            var ia = new Uint8Array(data.length);
            for (var i = 0; i < data.length; i++) {
                ia[i] = data.charCodeAt(i);
            }
            return new Blob([ia], {
                type: "image/jpeg"
            });
        },
    }
};
</script>

<style scoped>
    .el-row{background-color: #ffffff}
    @media screen and (max-width: 550px) {
        .el-col-8{padding-left: 0 !important;padding-right: 0 !important; width: 30%;margin-right: 3.3%;}
        .tab2{display: none}
    }
    @media screen and (max-width: 350px) {
        .el-col-8{padding-left: 0 !important;padding-right: 0 !important; width: 32%;margin-right: 1%;}
        .tab2{display: none}
    }
    .navTit{font-size: 13px;margin-top: -6px}
    .navVal{margin-top: 2px}
    .bg-purple {background: #F1F3F4;}
    .grid-content {border-radius: 4px;}
    .bg-purpleL {background: #46B8DA;}
    .grid-contentL {margin-top: 15px;border-top-left-radius: 4px;border-top-right-radius: 4px}
    .navHead{text-align: center;padding-top: 6px;padding-bottom: 6px;font-size: 10px;}
    .navBody{background-color: #FFFFFF;}
    .nav1{color: #8B83BB;text-align: center;}
    .nav2{color: #6BB99C;text-align: center}
    .nav3{color: #FC8675;text-align: center}
    .tab{width: 100%;margin-top: 15px;}
    .bg-purpleR{background:#5CB85C }
</style>
