  <template>
    <el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
        <el-row>
            <el-col :span="6">
                <el-table-column prop="name" label="编号"></el-table-column>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6">
                <el-table-column prop="description" label="名称"></el-table-column>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6">
                <el-table-column prop="money" label="金额"></el-table-column>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="6">
                <el-table-column prop="edit" label="编辑"></el-table-column>
            </el-col>
        </el-row>
    </el-table>
</template>
<script>
    export default {
        data() {
            return {
                users: [
                    {
                        name:'1',
                        description:'申恩',
                        money:'100000',
                        edit:'编辑',
                    },

                ]
            }
        },
        methods:{

        },
        mounted() {

        },
        created() {
        }
    }
</script>
