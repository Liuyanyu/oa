<template>
  <div style="max-width: 800px;">
    <el-button @click="backHistory" class="back">返回</el-button>
    <div class="title" style="margin-top: -40px">
      <p class="name">外出单</p>
      <table border="0" cellspacing="0" cellpadding="0" v-if="gooutInfo">
        <tr>
          <td>项目</td>
          <td v-if="gooutInfo.alias != null">{{gooutInfo.alias}}</td>
          <td v-else>与项目无关</td>
        </tr>
        <tr>
          <td>申请人</td>
          <td>{{gooutInfo.applyUserName}}</td>
        </tr>
        <tr>
          <td>外出日期</td>
          <td>{{gooutInfo.day}}</td>
        </tr>
        <tr>
          <td>是否跨天</td>
          <td v-if="gooutInfo.isCross == 0">
            <el-tag type="danger">否</el-tag>
          </td>
          <td v-if="gooutInfo.isCross == 1">
            <el-tag type="success">是</el-tag>
          </td>
        </tr>
        <tr>
          <td>外出时间</td>
          <td>{{gooutInfo.start}} 至 {{gooutInfo.end}}</td>
        </tr>
        <tr>
          <td>外出时长</td>
          <td>{{gooutInfo.time}} 小时</td>
        </tr>
        <tr>
          <td>外出事由</td>
          <td>{{gooutInfo.reason}}</td>
        </tr>
        <tr>
          <td>状态</td>
          <td v-if="gooutInfo.status == 0">
            <el-tag type="warning">审批中</el-tag>
          </td>
          <td v-if="gooutInfo.status == 1">
            <el-tag type="success">已同意</el-tag>
          </td>
          <td v-if="gooutInfo.status == 2">
            <el-tag type="danger">已拒绝</el-tag>
          </td>
        </tr>
        <tr>
          <td>申请时间</td>
          <td>{{gooutInfo.createTime}}</td>
        </tr>
      </table>
    </div>
    <div class="title left">
      <p class="name">审批结果</p>
    </div>
    <div class="result" v-for="approver in approverList">
      <el-avatar size="medium" :src="approver.checkUserAvatar" class="avatar"></el-avatar>
      <span class="username" style="color: #65CEA7;">
        {{approver.checkUserName}}
        <i
          class="el-icon-time"
          style="color: #000;margin-left: 10px;margin-right: 5px"
          v-if="approver.check > 0"
        ></i>
        <span style="color: #000" v-if="approver.check > 0">{{approver.createTime}}</span>
      </span>
      <span
        style="color: #000000;margin-top: 45px;position: absolute;font-size: 12px"
      >审批意见：{{approver.summary}}</span>
      <div>
        <span v-if="approver.check == 1">
          <el-tag class="checkSty" type="success">已同意</el-tag>
        </span>
        <span v-if="approver.check == 2">
          <el-tag class="checkSty" type="danger">已拒绝</el-tag>
        </span>
        <span v-if="approver.check == 0">
          <el-tag class="checkSty" type="warning">审批中</el-tag>
        </span>
      </div>
    </div>

    <div v-if="showCheck">
      <div class="title left">
        <p class="name">审批</p>
      </div>
      <el-alert title="审批流程不可逆转" type="warning"></el-alert>
      <el-form
        :model="formData"
        :rules="rules"
        ref="formData"
        label-width="100px"
        class="demo-ruleForm res"
        style="width: 100%"
      >
        <el-radio-group
          v-model="formData.check"
          @change="selectChcek"
          style="margin-top: 10px;margin-left: 20px"
        >
          <el-radio label="1">同意</el-radio>
          <el-radio label="2">拒绝</el-radio>
        </el-radio-group>
        <el-form-item prop="summary" style="margin-left: -100px;margin-top: 10px">
          <el-input
            type="textarea"
            v-model="formData.summary"
            placeholder="请填写原因"
            maxlength="30"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" class="submit" @click="onSubmit" :loading="saving">提交</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import {
  getGooutInfo,
  getGooutApproverList,
  updateGooutApprover
} from "../../../api/apply/goout.js";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      formData: {
        approverId: null,
        checkUserId: null,
        check: "1",
        summary: "同意"
      },
      gooutId: null,
      gooutInfo: null,
      listLoading: false,
      list: [],
      approverList: [],
      rules: {
        summary: [{ required: true, message: "请填写原因" }]
      },
      showCheck: false,
      saving: false
    };
  },
  created() {
    this.gooutId = this.$route.params.gooutId;
    this.formData.checkUserId = this.userId;
    this.getGooutInfo();
    this.getGooutApproverList();
  },
  computed: {
    ...mapGetters(["permissions", "userId"])
  },
  methods: {
    getGooutInfo() {
      getGooutInfo(this.gooutId).then(response => {
        this.gooutInfo = response.data.data;
      });
    },
    getGooutApproverList() {
      getGooutApproverList(this.gooutId).then(response => {
        this.approverList = response.data.data;
        this.approverList.forEach((item, index) => {
          console.log(item);
          if (item.check == 0 && item.userId == this.formData.checkUserId) {
            this.formData.approverId = item.approverId;
            this.showCheck = true;
          }
        });
      });
    },
    backHistory() {
      this.$router.go(-1);
    },
    selectChcek() {
      if (this.formData.check == 1) {
        this.formData.summary = "同意";
      } else {
        this.formData.summary = "";
      }
    },
    onSubmit() {
      updateGooutApprover(this.formData)
        .then(res => {
          if (res.data.data) {
            this.backHistory();
          }
        })
        .finally(() => {
          this.saving = false;
        });
    }
  }
};
</script>

<style scoped>
table {
  margin-top: 20px;
  color: #1f2d3d;
  width: 100%;
  border-right: 1px solid #c8cbce;
  border-bottom: 1px solid #c8cbce;
}
table td {
  padding: 10px 0;
  border-left: 1px solid #c8cbce;
  border-top: 1px solid #c8cbce;
}
.el-tag {
  line-height: 16px;
  height: auto;
}
.submit {
  float: right;
  margin-top: -10px;
}
.back {
  margin-top: 10px;
}
.title {
  text-align: center;
}
.name {
  font-size: 21px;
  color: #1f2d3d;
  padding: 10px 0 5px 0;
}
.result {
  max-width: 800px;
  height: 100px;
  border: 1px solid #f1f3f4;
  margin-top: 50px;
}
.avatar {
  margin-top: 20px;
  margin-left: 20px;
  margin-right: 20px;
  height: 45px;
  width: 45px;
}
.username {
  margin-top: 22px;
  position: absolute;
}
.res {
  max-width: 800px;
  height: 200px;
  border: 1px solid #f1f3f4;
  padding: 10px;
}
.commit {
  float: right;
  margin-top: -20px;
  right: 10px;
  position: relative;
  border: 0;
  padding: 5px 8px;
  border-radius: 10%;
  color: #ffffff;
}
.checkSty {
  float: right;
  right: 10px;
  margin-top: -60px;
  position: relative;
  line-height: 32px;
  height: 32px;
}
</style>
