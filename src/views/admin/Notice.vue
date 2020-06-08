<template>
    <div>
        <el-button type="primary" class="right" @click="dialogFormVisible = true">+ 添加新公告</el-button>
        <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
            <el-col :span="5">
                <el-table-column prop="name" label="名称"></el-table-column>
            </el-col>
            <el-col :span="9">
                <el-table-column prop="description" label="描述"></el-table-column>
            </el-col>
            <el-col :span="5">
                <el-table-column prop="status" label="状态" :span="5"></el-table-column>
            </el-col>
            <el-col :span="5">
                <el-table-column prop="operation" label="操作" :span="5"></el-table-column>
            </el-col>

<!--            <el-dropdown>-->
<!--                <el-button type="primary">-->
<!--                    操作<i class="el-icon-arrow-down el-icon&#45;&#45;right"></i>-->
<!--                </el-button>-->
<!--                <el-dropdown-menu slot="dropdown">-->
<!--                    <el-dropdown-item>编辑</el-dropdown-item>-->
<!--                    <el-dropdown-item>正常</el-dropdown-item>-->
<!--                    <el-dropdown-item>删除</el-dropdown-item>-->
<!--                </el-dropdown-menu>-->
<!--            </el-dropdown>-->
        </el-table>
        <el-dialog title="添加"  :visible.sync="dialogFormVisible">
            <el-form ref="form" :model="form" label-width="80px">
                <el-form-item label="名称">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="描述">
                    <el-input v-model="form.description"></el-input>
                </el-form-item>
                <el-form-item label="状态">
                    <el-input v-model="form.status"></el-input>
                </el-form-item>
                <el-form-item label="操作">
                    <el-input v-model="form.operation"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submit">提 交</el-button>
                <el-button @click="dialogFormVisible = false">取 消</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                dialogFormVisible: false,
                users: [
                    {
                        name:'端五节放假通知！',
                        description:'详细内见邮件通知详细内见邮件通知详细内见邮件通知详细内见邮件通知详细内见邮件通知详细内见邮件通知详细内见邮件通知',
                        status:'正常',
                        operation:'招商银行',
                    },

                ],
                form: {
                        name: '',
                        description: '',
                        status: '',
                        operation: '',
                      }
            }
        },
        methods:{
            submit(){
                var that = this
                that.dialogFormVisible = false
                that.users.push({
                    ...that.form
                })
            }
        },
        mounted() {

        },
        created() {
        }
    }
</script>
