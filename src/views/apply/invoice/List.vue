<template>
    <div>
        <div class="">
            <span class="tit">报销 / 总数 : {{total}}</span>
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
                    <el-button type="primary" size="medium" v-on:click="getInvoicePage()" icon="el-icon-search">搜索</el-button>
                </el-form-item>
                <el-form-item class="search">
                    <router-link to="/apply/invoice/form" >
                        <el-button type="primary" size="medium" @change="clearCon">添加申请</el-button>
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
            <el-table-column min-width="200" label="项目" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span v-if="scope.row.alias == null || scope.row.alias == ''">与项目无关</span>
                    <span v-else>{{scope.row.alias}}</span>
                </template>
            </el-table-column>
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
            <el-table-column min-width="100" label="总分类">
                <template slot-scope="scope">
                    <span v-if="scope.row.classify == 7">办公用品</span>
                    <span v-if="scope.row.classify == 8">固定资产</span>
                    <span v-if="scope.row.classify == 9">管理费用</span>
                    <span v-if="scope.row.classify == 10">人员补助</span>
                    <span v-if="scope.row.classify == 11">项目报销</span>
                </template>
            </el-table-column>
            <el-table-column min-width="100" label="明细分类">
                <template slot-scope="scope">
                    <span v-if="scope.row.classify == 7 && scope.row.type == 1">办公文具</span>
                    <span v-if="scope.row.classify == 7 && scope.row.type == 2">办公耗材</span>
                    <span v-if="scope.row.classify == 7 && scope.row.type == 3">日杂百货</span>
                    <span v-if="scope.row.classify == 7 && scope.row.type == 4">财务用品v</span>
                    <span v-if="scope.row.classify == 7 && scope.row.type == 5">电子设备及工具</span>

                    <span v-if="scope.row.classify == 8 && scope.row.type == 1">办公设备</span>
                    <span v-if="scope.row.classify == 8 && scope.row.type == 2">办公家具</span>

                    <span v-if="scope.row.classify == 9 && scope.row.type == 1">市内交通</span>
                    <span v-if="scope.row.classify == 9 && scope.row.type == 2">办公费用</span>
                    <span v-if="scope.row.classify == 9 && scope.row.type == 3">运输</span>
                    <span v-if="scope.row.classify == 9 && scope.row.type == 4">业务招待费</span>
                    <span v-if="scope.row.classify == 9 && scope.row.type == 5">会议费</span>
                    <span v-if="scope.row.classify == 9 && scope.row.type == 6">差旅费</span>
                    <span v-if="scope.row.classify == 9 && scope.row.type == 7">福利费</span>

                    <span v-if="scope.row.classify == 10 && scope.row.type == 1">住房补助</span>

                    <span v-if="scope.row.classify == 11 && scope.row.type == 1">差旅费</span>
                    <span v-if="scope.row.classify == 11 && scope.row.type == 2">业务招待费</span>
                    <span v-if="scope.row.classify == 11 && scope.row.type == 3">外协</span>
                    <span v-if="scope.row.classify == 11 && scope.row.type == 4">设备采购</span>
                    <span v-if="scope.row.classify == 11 && scope.row.type == 5">办公费</span>
                    <span v-if="scope.row.classify == 11 && scope.row.type == 6">市内交通</span>
                    <span v-if="scope.row.classify == 11 && scope.row.type == 7">会议费</span>

                </template>
            </el-table-column>
            <el-table-column min-width="80" label="是否找票">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.isFull == 0" type="danger">否</el-tag>
                    <el-tag v-if="scope.row.isFull == 1" type="success">是</el-tag>
                </template>
            </el-table-column>
            <el-table-column min-width="80" label="是否确认">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.isAffirm == 0" type="danger">否</el-tag>
                    <el-tag v-if="scope.row.isAffirm == 1" type="success">是</el-tag>
                </template>
            </el-table-column>
            <el-table-column min-width="120" label="发票金额(元)">
                <template slot-scope="scope">
                    <span>{{scope.row.invoicePriceYuan}} 元</span>
                </template>
            </el-table-column>
            <el-table-column min-width="120" label="支付金额(元)">
                <template slot-scope="scope">
                    <span>{{scope.row.payPriceYuan}} 元</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" min-width="100" label="审批状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 0" type="warning">审批中</el-tag>
                    <el-tag v-if="scope.row.status == 1" type="success">同意</el-tag>
                    <el-tag v-if="scope.row.status == 2" type="danger">拒绝</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="220">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click.native="lookModal(scope.row)">查看</el-button>
                    <el-button size="mini" v-if="scope.row.status != 1" @click.native="handleModal(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click.native="handleDel(scope.$index, scope.row)">删除</el-button>
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
    import {getInvoicePage, deleteObj} from "../../../api/apply/invoice.js";
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
            this.getInvoicePage();
            this.query.userId = this.userId;
        },
        computed: {
            ...mapGetters([
                'permissions', 'userId'
            ])
        },
        methods:{
            openList(val) {
                if (val == 2){
                    this.$router.push({
                        path: "/apply/invoice/approver"
                    });
                }
            },
            getInvoicePage(){
                this.listLoading = true;
                getInvoicePage(this.query)
                    .then(response => {

                        console.log(response);

                        this.listLoading = false;
                        this.total = response.data.data.total;
                        this.query.current = response.data.data.current;
                        this.query.size = response.data.data.size;
                        this.list = response.data.data.records;
                        this.list.forEach((item,index) => {
                            const invoiceInfo =  JSON.parse(item.clockList);
                            console.log(invoiceInfo.status);
                            this.list[index].clockDay = invoiceInfo.day;
                            this.list[index].clockTime = invoiceInfo.time;
                            this.list[index].clockStatus = invoiceInfo.status;
                        })

                    })
                    .catch(() => {
                        this.listLoading = false;
                    });
            },
            handleSizeChange(val) {
                this.query.size = val;
                this.getInvoicePage();
            },
            handleCurrentChange(val) {
                this.query.current = val;
                this.getInvoicePage();
            },
            handleModal (data) {
                window.localStorage.setItem("editInvoiceInfo", JSON.stringify(data));
                this.$router.push({
                    path: "/apply/invoice/form"
                });
            },
            lookModal(data){
                // window.localStorage.setItem("editClockInfo", JSON.stringify(data));
                console.log(data);
                console.log(data.invoiceId);
                this.$router.push({
                    path: "/apply/invoice/info/"+data.invoiceId
                });
            },
            handleDel(index, row) {
                if (row.invoiceId) {
                    this.$confirm("确认删除吗?", "提示", {
                        type: "warning"
                    }).then(() => {
                        deleteObj(row.invoiceId).then(res => {
                            if (res.data.data) {
                                this.getInvoicePage();
                            }
                        })
                    })
                }
            },
            clearCon(){

            }
        },
        mounted() {

        }
    }
</script>
<style type="text/scss" lang="scss">

</style>
