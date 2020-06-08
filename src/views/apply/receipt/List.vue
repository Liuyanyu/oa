<template>
    <div>
        <div class="">
            <span class="tit">开票 / 总数 : {{total}}</span>
            <el-form :inline="true" :model="query">
                <el-form-item class="search">
                    <el-select clearable v-model="query.status" placeholder="请选择">
                        <el-option
                            v-for="item in statusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="search">
                    <el-button type="primary" size="medium" v-on:click="getReceiptPage()" icon="el-icon-search">搜索</el-button>
                </el-form-item>
                <el-form-item class="search">
                    <router-link to="/apply/receipt/form">
                        <el-button type="primary" size="medium">添加申请</el-button>
                    </router-link>
                </el-form-item>
            </el-form>
            <el-radio-group v-model="listType" style="float: right;" @change="openList" class="switch">
                <el-radio-button label="1">我申请的</el-radio-button>
                <el-radio-button label="2">我审批的</el-radio-button>
            </el-radio-group>
        </div>
        <el-table :data="list" stripe border v-loading="listLoading" style="width: 100%;">
            <el-table-column width="50" label="序号">
                <template scope="scope"><span>{{scope.$index+(query.current - 1) * query.size + 1}} </span></template>
            </el-table-column>
            <el-table-column prop="alias" min-width="200" label="项目" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column min-width="220" label="审批人">
                <template slot-scope="scope">
                    <div class="tag-group" v-for="item in scope.row.checkUserList">
                        <p>{{ item.checkUserName }}</p>
                        <el-tag v-if="item.check == 0 && item.isBeing == 1" size="mini" type="">审批中</el-tag>
                        <el-tag v-if="item.check == 0 && item.isBeing == 0" size="mini" type="warning">待审批</el-tag>
                        <el-tag v-if="item.check == 1" size="mini" type="success">已同意</el-tag>
                        <el-tag v-if="item.check == 2" size="mini" type="danger">已拒绝</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="proportion" min-width="80" label="开票比例"></el-table-column>
            <el-table-column min-width="80" label="开票金额">
                <template slot-scope="scope">
                    <span>{{scope.row.priceYuan}} 元</span>
                </template>
            </el-table-column>
            <el-table-column prop="type" min-width="80" label="开票类型">
                <template slot-scope="scope">
                    <span v-if="scope.row.type == 1">专票</span>
                    <span v-if="scope.row.type == 2">普票</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" min-width="200" label="开票公司名称" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column min-width="120" label="开票内容" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span v-if="scope.row.content == 11">*研发和技术服务*专业技术服务</span>
                    <span v-if="scope.row.content == 12">*研发和技术服务*软件开发</span>
                    <span v-if="scope.row.content == 13">*设计服务*专业设计服务</span>
                    <span v-if="scope.row.content == 14">*其他咨询服务*其他咨询服务</span>
                    <span v-if="scope.row.content == 21">*印刷品*图片、设计图样及照片</span>
                    <span v-if="scope.row.content == 22">*软件*系统软件产品</span>
                    <span v-if="scope.row.content == 23">*硬件*</span>
                </template>
            </el-table-column>
            <el-table-column min-width="100" label="审批状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 0" type="warning">审批中</el-tag>
                    <el-tag v-if="scope.row.status == 1" type="success">同意</el-tag>
                    <el-tag v-if="scope.row.status == 2" type="danger">拒绝</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="220">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click.native="handleInfo(scope.row)">查看</el-button>
                    <el-button size="mini" v-if="scope.row.status != 1" @click.native="handleModal(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click.native="handleDel(scope.$index,scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="right"
                       @size-change="handleSizeChange"
                       @current-change="handleCurrentChange"
                       :current-page="query.current"
                       :page-sizes="[10, 20, 50, 100]"
                       :page-size="query.size"
                       layout="total, sizes, prev, pager, next"
                       :total="total">
        </el-pagination>
    </div>
</template>
<script>
    import {getReceiptPage, deleteObj} from "../../../api/apply/receipt.js";
    // import {getUserInfo} from "../../../api/admin/user.js";
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                query: {
                    userId: null,
                    status: "",
                    current: 1,
                    size: 10
                },
                statusOptions: [
                    {
                        value: "",
                        label: "全部"
                    },
                    {
                        value: "0",
                        label: "审批中"
                    },
                    {
                        value: "1",
                        label: "同意"
                    },
                    {
                        value: "2",
                        label: "拒绝"
                    }
                ],
                pages: 0,
                total: 0,
                listLoading: false,
                list: [],
                number:'',
                listType:'1'
            }
        },
        created() {
            this.getReceiptPage();
            this.query.userId = this.userId;
        },
        computed: {
            ...mapGetters([
                'permissions', 'userId'
            ])
        },
        methods:{
            getReceiptPage(){
                this.listLoading = true;
                getReceiptPage(this.query)
                    .then(response => {
                        this.listLoading = false;
                        this.total = response.data.data.total;
                        this.query.current = response.data.data.current;
                        this.query.size = response.data.data.size;
                        this.list = response.data.data.records;
                        console.log(this.list)
                    })
                    .catch(() => {
                        this.listLoading = false;
                    });
            },
            handleSizeChange(val) {
                this.query.size = val;
                this.getReceiptPage();
            },
            handleCurrentChange(val) {
                this.query.current = val;
                this.getReceiptPage();
            },
            handleModal (data) {
                window.localStorage.setItem("editReceiptInfo", JSON.stringify(data));
                this.$router.push({
                    path: "/apply/receipt/form"
                });
            },
            handleInfo(data){
                window.localStorage.setItem("editReceiptInfo", JSON.stringify(data));
                console.log(data);
                this.$router.push({
                    path: "/apply/receipt/info/"+data.receiptId
                });
            },
            handleDel(index, row) {
                console.log(row);
                if (row.receiptId) {debugger;
                    this.$confirm("确认删除吗?", "提示", {
                        type: "warning"
                    }).then(() => {
                        deleteObj(row.receiptId).then(res => {
                            if (res.data.data) {
                                console.log(res);
                                this.getReceiptPage();
                            }
                        })
                    })
                }
            },
            openList(val) {
                if (val == 2){
                    this.$router.push({
                        path: "/apply/receipt/approver"
                    });
                }
            },
        },
        mounted() {

        }
    }
</script>
<style type="text/scss" lang="scss" scope>
    .tag-group{
        display: inline-block;
        text-align: center;
        padding: 0 5px;
    }
</style>
