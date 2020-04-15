<template>
  <div class="business">
    <el-card>
      <el-form :model="form" :inline="true" ref="form">
        <el-form-item label="企业编号" prop="eid">
          <el-input v-model="form.eid"></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="创建者" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select placeholder="请选择状态" v-model="form.status">
            <el-option label="启用" value="1"></el-option>
            <el-option label="禁用" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchBusiness">搜索</el-button>
          <el-button @click="reset">清除</el-button>
          <el-button type="primary" @click="addClick">+新增企业</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData">
        <el-table-column label="序号" width="100px">
          <template
            slot-scope="scope"
          >{{(pagination.currentPage - 1) * pagination.pageSize + scope.$index+1}}</template>
        </el-table-column>
        <el-table-column prop="eid" label="企业编号" width="150px"></el-table-column>
        <el-table-column prop="name" label="企业名称"></el-table-column>
        <el-table-column prop="username" label="创建者"></el-table-column>
        <el-table-column prop="create_time" label="创建日期"></el-table-column>
        <el-table-column label="状态" width="150px">
          <template slot-scope="scope">
            <span :class="{redStyle:scope.row.status==0}">{{scope.row.status==1?'启用':'禁用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" @click="editClick(scope.row)">编辑</el-button>
            <el-button
              @click="setStatus(scope.row.id)"
              :type="scope.row.status==1?'info':'success'"
            >{{scope.row.status==0?'启用':'禁用'}}</el-button>
            <el-button type="danger" @click="deleteBtn(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="[2,10,20,30]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
      ></el-pagination>
    </el-card>

    <addBusiness ref="addBusiness" :mode="modeFather"></addBusiness>
  </div>
</template>

<script>
import {
  getBusinessData,
  setBusinessStatus,
  delBusinessData
} from "@/api/business.js";
// 导入addBusiness.vue文件
import addBusiness from "./addBusiness.vue";
export default {
  components: {
    addBusiness
  },
  data() {
    return {
      modeFather: "add", //新增操作
      // 表单数据
      form: {
        eid: "", //企业编号
        name: "", //企业名称
        username: "", //创建者
        status: "" //状态
      },

      tableData: [], //列表数据

      //   分页
      pagination: {
        currentPage: 1,
        pageSize: 2,
        total: 10
      }
    };
  },

  created() {
    this.getData();
  },

  methods: {
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      this.pagination.currentPage = 1;
      this.getData();
    },
    handleCurrentChange(page) {
      this.pagination.currentPage = page;
      this.getData();
    },

    //   获取分页数据
    getData() {
      let _params = {
        limit: this.pagination.pageSize,
        page: this.pagination.currentPage,
        ...this.form
      };
      getBusinessData(_params).then(res => {
        console.log(res);
        this.tableData = res.data.items;
        this.pagination.total = res.data.pagination.total;
      });
    },

    // 点击搜索按钮
    searchBusiness() {
      this.pagination.currentPage = 1;
      this.getData();
    },

    // 状态
    setStatus(id) {
      setBusinessStatus({ id }).then(() => {
        this.$message.success("状态设置成功");
        this.getData();
      });
    },

    // 清除
    reset() {
      // 清空表单
      this.$refs.form.resetFields();
      // 刷新页面
      this.searchBusiness();
    },

    // 点击删除按钮
    deleteBtn(id) {
      this.$confirm("此操作将永久删除该企业数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delBusinessData({ id }).then(() => {
            this.$message.success("删除成功");
            this.searchBusiness();
          });
        })
        .catch(() => {});
    },

    // 新增按钮
    addClick() {
      this.modeFather = "add";
      this.$refs.addBusiness.form = {
        eid: "", //企业编号
        name: "", //企业名称
        short_name: "", //企业简称
        intro: "", //企业简介
        remark: "" //备注
      };
      this.$refs.addBusiness.dialogFormVisible = true;
    },

    // 编辑按钮
    editClick(row) {
      this.modeFather = "edit";
      // 将整行数据都传过去（深拷贝）
      this.$refs.addBusiness.form = JSON.parse(JSON.stringify(row));
      // 打开弹窗
      this.$refs.addBusiness.dialogFormVisible = true;
    }
  }
};
</script>

<style lang="less">
.business {
  .pagination {
    text-align: center;
    margin-top: 30px;
  }
  .redStyle {
    color: #f00;
  }
}
</style>