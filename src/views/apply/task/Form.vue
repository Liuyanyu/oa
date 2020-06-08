<template>
    <div>
        <el-form label-position="right" ref="form" :model="form" style="min-width: 320px;max-width: 600px;" class="form">
            <!--            <el-form-item label="类别：">-->
            <!--                <el-radio-group v-model="form.resource">-->
            <!--                    <el-radio label="七天内"></el-radio>-->
            <!--                    <el-radio label="超过七天"></el-radio>-->
            <!--                </el-radio-group>-->
            <!--            </el-form-item>-->

            <el-form-item label="外出日期：" >
                <el-date-picker
                    v-model="form.resource"
                    type="date"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="跨天：">
                <el-radio-group v-model="form.resource">
                    <el-radio label="是"></el-radio>
                    <el-radio label="否"></el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="外出时间：">
                <el-time-select
                    placeholder="起始时间"
                    v-model="startTime"
                    :picker-options="{
                      start: '07:00',
                      step: '00:15',
                      end: '23:30',
                      maxTime: endTime
                    }">
                </el-time-select>
                <el-time-select
                    class="selTime"
                    placeholder="结束时间"
                    v-model="endTime"
                    :picker-options="{
                      start: '07:00',
                      step: '00:15',
                      end: '23:30',
                      minTime: startTime
                    }">
                </el-time-select>
            </el-form-item>

            <el-form-item label="外出事由：">
                <el-input type="textarea" v-model="form.desc"></el-input>
            </el-form-item>
            <el-form-item label="审批人：">
                <div class="apply-user-list" v-for="fit in fits" :key="fit">
                    <el-avatar :size="60" :fit="fit" :src="url"></el-avatar>
                    <span class="username">{{ fit }}</span>
                </div>
            </el-form-item>
            <el-form-item style="text-align: center" class="save">
                <el-button type="primary" @click="onSubmit">保存</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                startTime: '',
                endTime: '',
                form: {
                    name: '',
                    region: '',
                    date1: '',
                    date2: '',
                    delivery: false,
                    type: [],
                    resource: '',
                    desc: ''
                },
                fits: ['栗学魁', '李长霖', '陈铮'],
                url: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
            }
        },
        created() {

        },
        computed: {
            ...mapGetters([
                'permissions'
            ])
        },
        methods:{
            onSubmit() {
                console.log('submit!');
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
    @media screen and (max-width: 360px) {
        .save{
            margin-left: -40%
        }
    }
    @media (min-width: 600px) {
        .zzz {
            display: none;
        }
    }
    .el-image img {
        border-radius: 50%;
    }
    @media screen and (min-width: 1300px) {
        .el-textarea{
            width: 200% !important;
        }
        .el-input{
            width: 300%;
        }
    }
</style>
