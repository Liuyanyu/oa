<template>
    <div>
        <div class="">
            <span class="tit">我负责的 / 总数 : {{total}}</span>
            <el-form :inline="true" :model="query">
                <el-form-item class="search">
                    <el-input v-model="query.likeKeyWords" placeholder="关键字"></el-input>
                </el-form-item>
                <el-form-item class="search">
                    <el-select clearable v-model="query.type" placeholder="请选择">
                        <el-option
                            v-for="item in typeOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                            :disabled="item.disabled">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="search">
                    <el-button type="primary" size="medium" v-on:click="getItemAdminVosWithUserIdPage" icon="el-icon-search">搜索</el-button>
                </el-form-item>
                <el-form-item class="search">
                    <el-button type="primary" size="medium" @click="handleModal" v-if="item_btn_add">新增</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="list" stripe border v-loading="listLoading" style="width: 100%;">
            <el-table-column width="50" label="序号">
                <template scope="scope"><span>{{scope.$index+(query.current - 1) * query.size + 1}} </span></template>
            </el-table-column>
            <el-table-column prop="alias" min-width="100" label="类别">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.type == 1" type="success">项目</el-tag>
                    <el-tag v-if="scope.row.type == 2" type="">产品</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="alias" min-width="200" label="名称" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="startDate" min-width="100" label="立项时间"></el-table-column>
            <el-table-column prop="endDate" min-width="100" label="完成时间"></el-table-column>
            <el-table-column prop="status" min-width="100" label="状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 0" type="info">未签</el-tag>
                    <el-tag v-if="scope.row.status == 1" type="warning">已签未付</el-tag>
                    <el-tag v-if="scope.row.status == 11" type="warning">已签已付1</el-tag>
                    <el-tag v-if="scope.row.status == 12" type="warning">已签已付2</el-tag>
                    <el-tag v-if="scope.row.status == 13" type="warning">已签已付3</el-tag>
                    <el-tag v-if="scope.row.status == 14" type="warning">已签已付4</el-tag>
                    <el-tag v-if="scope.row.status == 15" type="warning">已签已付5</el-tag>
                    <el-tag v-if="scope.row.status == 70" type="danger">付清未完成</el-tag>
                    <el-tag v-if="scope.row.status == 71" type="success">付清已完成</el-tag>
                    <el-tag v-if="scope.row.status == 8" type="">旷工</el-tag>
                    <el-tag v-if="scope.row.status == 9" type="success">旷工</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="check" min-width="100" label="状态">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.status == 0" type="info">待审批</el-tag>
                    <el-tag v-if="scope.row.status == 1" type="success">审批通过</el-tag>
                    <el-tag v-if="scope.row.status == 2" type="danger">审批拒绝</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" min-width="220">
                <template slot-scope="scope">
                    <el-button size="mini" type="success" @click="handleModalInfo(scope.row)">查看</el-button>
                    <el-button v-if="item_btn_edit" size="mini" @click="handleModal(scope.row)">编辑</el-button>
                    <el-button v-if="item_btn_del" size="mini" type="danger" @click="handleDel(scope.$index, scope.row)">删除</el-button>
<!--                    <el-button size="mini" type="danger" @click="handleTeam(scope.row)">团队</el-button>-->
                </template>
            </el-table-column>
        </el-table>
        <el-pagination class="right"
                       background
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
    import {getItemAdminVosWithUserIdPage} from "../../api/project/team.js";
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                query: {
                    likeKeyWords: '',
                    type: "",
                    userId: null,
                    current: 1,
                    size: 10
                },
                typeOptions: [
                    {
                        value: "",
                        label: "全部"
                    },
                    {
                        value: "1",
                        label: "项目"
                    },
                    {
                        value: "2",
                        label: "产品"
                    }
                ],
                pages: 0,
                total: 0,
                defaultImg: '',
                deptOptions: [],
                roleList: [
                    {
                        value: "1",
                        label: '管理员'
                    }
                ],
                listLoading: false,
                saving: false,
                list: [],
                item_btn_add: false,
                item_btn_edit: false,
                item_btn_del: false,
                formData:{
                    newData: true,
                    itemId:'',
                    name: ""
                },
                rules: {
                    name: [
                        { required: true, message: '请输入项目名称', trigger: 'blur' }
                    ]
                },
            }
        },
        created() {
            this.getItemAdminVosWithUserIdPage()
            this.query.userId = this.userId;
            this.item_btn_add = this.permissions['dd_item_add']
            this.item_btn_edit = this.permissions['dd_item_edit']
            this.item_btn_del = this.permissions['dd_item_del']
        },
        computed: {
            ...mapGetters([
                'permissions','userId'
            ])
        },
        methods:{
            getItemAdminVosWithUserIdPage(){
                this.listLoading = true;
                getItemAdminVosWithUserIdPage(this.query)
                    .then(response => {
                        this.listLoading = false;
                        console.log(response.data.data)
                        this.total = response.data.data.total
                        this.query.current = response.data.data.current
                        this.query.size = response.data.data.size
                        this.list = response.data.data.records
                    })
                    .catch(() => {
                        this.listLoading = false;
                    });
            },
            handleModal (data) {
                if (data.itemId){
                    window.localStorage.setItem("editProjectInfo", JSON.stringify(data))
                    this.$router.push({
                        path: "/project/itemForm"
                    });
                } else {
                    this.$router.push({
                        path: "/project/itemForm"
                    });
                }
            },
            handleModalInfo (data){
                window.localStorage.setItem("itemInfo", JSON.stringify(data))
                this.$router.push({
                    path: "/project/itemInfo/" + data.itemId
                });
            },
            handleSizeChange(val) {
                this.query.size = val;
                this.getItemList();
            },
            handleCurrentChange(val) {
                this.query.current = val;
                this.getItemList();
            },
            // 删除
            handleDel(index, row) {
                if (row.itemId) {
                    this.$confirm("确认删除 " + row.alias + " 吗?", "提示", {
                        type: "warning"
                    }).then(() => {
                        deleteItem(row.itemId).then(res => {
                            if (res.data.data) {
                                this.getItemList();
                            }
                        })
                    })
                }
            },
            handleTeam(row) {

            }
        },
        mounted() {

        }
    }
</script>
<style type="text/scss" scoped lang="scss">
    .el-input .el-input__count .el-input__count-inner{
        height: 50%;
    }
    @media (min-width: 600px) {
        .zzz {
            display: none;
        }
    }
    .el-image img {
        border-radius: 50%;
    }
</style>
