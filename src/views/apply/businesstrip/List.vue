<template>
    <div>
        <div class="">
            <span class="tit">出差 / 总数 : {{total}}</span>
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
                    <el-button type="primary" size="medium" v-on:click="getApplyList()" icon="el-icon-search">搜索</el-button>
                </el-form-item>
                <el-form-item class="search">
                    <router-link to="/apply/businesstrip/form">
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
            <el-table-column min-width="200" label="项目" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                    <span v-if="scope.row.alias == null || scope.row.alias == ''">与项目无关</span>
                    <span v-else>{{scope.row.alias}}</span>
                </template>
            </el-table-column>
            <el-table-column min-width="100" label="审批人">
                <template slot-scope="scope">
                    <div class="tag-group" v-for="item in scope.row.checkUserList">
                        <p>{{ item.checkUserName }}</p>
                        <el-tag v-if="item.check == 0" size="mini" type="warning">待审批</el-tag>
                        <el-tag v-if="item.check == 1" size="mini" type="success">已同意</el-tag>
                        <el-tag v-if="item.check == 2" size="mini" type="danger">已拒绝</el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="destinations" min-width="100" label="目的地"></el-table-column>
            <el-table-column prop="reason" min-width="150" label="事由" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="start" min-width="100" label="出发日期"></el-table-column>
            <el-table-column prop="end" min-width="100" label="回来日期"></el-table-column>
            <el-table-column min-width="80" label="出差时长">
                <template slot-scope="scope">
                    <span>{{scope.row.days}} 天</span>
                </template>
            </el-table-column>
            <el-table-column prop="status" min-width="80" label="审批状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 0" type="warning">审批中</el-tag>
                    <el-tag v-if="scope.row.status == 1" type="success">同意</el-tag>
                    <el-tag v-if="scope.row.status == 2" type="danger">拒绝</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="220">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click.native="handInfo(scope.row)">查看</el-button>
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
    import {getBussinesstripList, deleteObj} from "../../../api/apply/businesstrip.js";
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
                listType: "1"
            }
        },
        created() {
            this.getBussinesstripList();
            this.query.userId = this.userId;
        },
        computed: {
            ...mapGetters([
                'permissions','userId'
            ])
        },
        methods:{
            getBussinesstripList(){
                this.listLoading = true;
                getBussinesstripList(this.query)
                    .then(response => {
                        this.listLoading = false;
                        this.total = response.data.data.total;
                        this.query.current = response.data.data.current;
                        this.query.size = response.data.data.size;
                        this.list = response.data.data.records;
                        console.log(this.list);

                        this.list.forEach((item,index) => {
                            const clockInfo =  JSON.parse(item.clockList);
                            console.log(clockInfo.status);
                            this.list[index].clockDay = clockInfo.day;
                            this.list[index].clockTime = clockInfo.time;
                            this.list[index].clockStatus = clockInfo.status;
                        })
                    })
                    .catch(() => {
                        this.listLoading = false;
                    });
            },
            handleSizeChange(val) {
                this.query.size = val;
                this.getLoglist();
            },
            handleCurrentChange(val) {
                this.query.current = val;
                this.getLoglist();
            },
            handInfo(data){
              this.$router.push({
                  path:"/apply/businesstrip/info/"+data.businesstripId
              })
            },
            handleModal (data) {
                window.localStorage.setItem("editBusinesstripInfo",JSON.stringify(data))
                this.$router.push({
                    path: "/apply/businesstrip/form"
                });
            },
            handleDel(index, row) {
                if (row.businesstripId) {
                    this.$confirm("确认删除吗?", "提示", {
                        type: "warning"
                    }).then(() => {
                        deleteObj(row.businesstripId).then(res => {
                            if (res.data.data) {
                                this.getBussinesstripList();
                            }
                        })
                    })
                }
            },
            openList(val) {
                if (val == 2){
                    this.$router.push({
                        path: "/apply/businesstrip/approver"
                    });
                }
            },
        },
        mounted() {

        }
    }
</script>
<style type="text/scss" lang="scss" scope>

</style>
