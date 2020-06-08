<template>
    <div>
        <div class="">
            <span class="tit">审批规范 / 总数 : {{total}}</span>
            <el-form :inline="true" :model="query">
                <el-form-item>
                    <el-input v-model="query.likeKeyWords" placeholder="关键字"></el-input>
                </el-form-item>
                <el-form-item class="stand">
                    <el-button type="primary" size="medium" v-on:click="getStandardApplyPage()" icon="el-icon-search">搜索</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="list" stripe border v-loading="listLoading" style="width: 100%;">
            <el-table-column prop="type" width="100" label="类型">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.type == 1" type="info">任务</el-tag>
                    <el-tag v-if="scope.row.type == 2" type="success">外出</el-tag>
                    <el-tag v-if="scope.row.type == 3" type="success">出差</el-tag>
                    <el-tag v-if="scope.row.type == 4" type="success">请假</el-tag>
                    <el-tag v-if="scope.row.type == 5" type="success">未打卡</el-tag>
                    <el-tag v-if="scope.row.type == 6" type="danger">报销</el-tag>
                    <el-tag v-if="scope.row.type == 7" type="danger">支出</el-tag>
                    <el-tag v-if="scope.row.type == 8" type="danger">开票</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="content" min-width="200" label="内容" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column prop="createTime" min-width="100" label="创建时间" :show-overflow-tooltip="true"></el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button size="mini" @click.native="handleModal(scope.row)">编辑</el-button>
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
        <!--编辑界面-->
        <el-dialog title="编辑"  @click="dialogVisible = true"
                   :visible.sync="dialogVisible">
            <el-form label-width="120px" :model="formData" :rules="rules" ref="formData">
                <el-form-item label="类型" prop="type">
                    <el-select disabled v-model="formData.type" placeholder="请选择">
                        <el-option v-for="(item, index) in typeOptions" :value="item.value" :key="index" :label="item.label">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="内容" prop="content">
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 6, maxRows: 1}"
                        placeholder="请输入内容"
                        v-model="formData.content">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit" :loading="saving">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {getStandardApplyPage, putObj} from "../../../api/standard/apply.js";
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                query: {
                    type: null,
                    likeKeyWords: "",
                    current: 1,
                    size: 10
                },
                formData: {
                    id: '',
                    type: '',
                    content: "",
                    version: 1,
                },
                rules: {
                    type: [
                        { required: true, message: '请选择类型',trigger: 'change'}
                    ],
                    content: [
                        { required: true, message: '请输入'}
                    ]
                },
                typeOptions: [
                    {
                        value: "1",
                        label: "任务"
                    },
                    {
                        value: "2",
                        label: "外出"
                    },
                    {
                        value: "3",
                        label: "出差"
                    },
                    {
                        value: "4",
                        label: "请假"
                    },
                    {
                        value: "5",
                        label: "未打卡"
                    },
                    {
                        value: "6",
                        label: "报销"
                    },
                    {
                        value: "7",
                        label: "支出"
                    },
                    {
                        value: "8",
                        label: "开票"
                    }
                ],
                pages: 0,
                total: 0,
                listLoading: false,
                list: [],
                dialogVisible: false,
                saving: false,
            }
        },
        created() {
            this.getStandardApplyPage();
        },
        computed: {
            ...mapGetters([
                'permissions'
            ])
        },
        methods:{
            getStandardApplyPage() {
                this.listLoading = true;
                getStandardApplyPage(this.query)
                    .then(response => {
                        this.listLoading = false;
                        this.total = response.data.data.total
                        this.query.current = response.data.data.current
                        this.query.size = response.data.data.size
                        this.list = response.data.data.records
                    })
                    .catch(() => {
                        this.listLoading = false;
                    });
            },
            handleSizeChange(val) {
                this.query.size = val;
                this.getSupplierPage();
            },
            handleCurrentChange(val) {
                this.query.current = val;
                this.getSupplierPage();
            },
            handleModal (data) {
                this.formData.id = data.id;
                this.formData.type = data.type;
                this.formData.content = data.content;
                this.formData.version = data.version

                this.dialogVisible = true
            },
            handleSubmit () {
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        this.saving = true
                        putObj(this.formData).then(res => {
                            if (res.data.data) {
                                this.dialogVisible = false
                                this.getStandardApplyPage();
                            }
                        }).finally(() => {
                            this.saving = false
                        })
                    }
                })
            },
        }
    }
</script>

<style scoped>
    .el-form{
        width: -webkit-fill-available;
    }
    @media screen and (max-width: 320px) {
        .stand{
            float: right;
            margin-top: -63px;
        }
    }


</style>
