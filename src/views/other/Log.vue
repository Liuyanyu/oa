<template>
  <div>
    <div class="titBox">
      <span class="tit">日志管理 / 总数 : {{total}}</span>
    </div>
    <el-table :data="list" stripe border v-loading="listLoading" style="width: 100%;">
      <el-table-column prop="title" min-width="120" label="日志标题"></el-table-column>
      <el-table-column prop="type" min-width="120" label="类型"></el-table-column>
      <el-table-column prop="createBy" min-width="120" label="创建人"></el-table-column>
      <el-table-column prop="remoteAddr" min-width="120" label="操作ip地址"></el-table-column>
      <el-table-column prop="requestUri" min-width="120" label="请求uri"></el-table-column>
      <el-table-column prop="method" min-width="120" label="操作方式"></el-table-column>
      <el-table-column prop="createTime" min-width="160" label="创建时间"></el-table-column>
      <el-table-column prop="time" min-width="120" label="方法执行时间"></el-table-column>
    </el-table>
    <el-pagination
      class="right"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="query.current"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="query.size"
      layout="total, sizes, prev, pager, next"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
import { getList } from "../../api/other/log.js";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      query: {
        site_id: "",
        current: 1,
        size: 10
      },
      pages: 0,
      total: 0,
      listLoading: false,
      list: [],
      number: ""
    };
  },
  created() {
    this.getLoglist();
  },
  computed: {
    ...mapGetters(["permissions"])
  },
  methods: {
    getLoglist() {
      this.loading = true;
      getList(this.query)
        .then(response => {
          this.loading = false;
          this.total = response.data.data.total;
          this.query.current = response.data.data.current;
          this.query.size = response.data.data.size;
          this.list = response.data.data.records;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleSizeChange(val) {
      this.query.size = val;
      this.getLoglist();
    },
    handleCurrentChange(val) {
      this.query.current = val;
      this.getLoglist();
    }
  },
  mounted() {}
};
</script>
<style type="text/scss" lang="scss">
</style>
