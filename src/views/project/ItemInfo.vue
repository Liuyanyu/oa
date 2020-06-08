<template>
    <el-tabs v-model="activeName" @tab-click="handleClick" >
<!--        <el-tab-pane label="项目详情" name="info">-->
<!--            <div>-->
<!--                <span>青春是一个短暂的美梦, 当你醒来时, 它早已消失无踪</span>-->
<!--                <el-divider></el-divider>-->
<!--                <span>少量的邪恶足以抵消全部高贵的品质, 害得人声名狼藉</span>-->
<!--            </div>-->
<!--        </el-tab-pane>-->
        <el-tab-pane label="考勤统计" name="checkwork">
            <ItemInvoice/>
        </el-tab-pane>
        <el-tab-pane label="报销管理" name="invoice">

        </el-tab-pane>
        <el-tab-pane label="支出管理" name="expense">
<!--            <ItemExpense/>-->
        </el-tab-pane>
        <el-tab-pane label="开票管理" name="receipt">
<!--            <ItemReceipt/>-->
        </el-tab-pane>
    </el-tabs>
</template>

<script>
    import ItemInvoice from './ItemInvoice'
    import ItemExpense from './ItemExpense'
    import ItemReceipt from './ItemReceipt'
    export default {
        components: {
            ItemInvoice,
            ItemExpense,
            ItemReceipt
        },
        data() {
            return {
                activeName: 'checkwork'
            };
        },
        created() {
            console.log(this.$route.params.itemId)
        },
        methods: {
            handleClick(tab, event) {
                // console.log(tab, event);
            }
        }
    }
</script>

<style scoped>

</style>
