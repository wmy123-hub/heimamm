<template>
  <div class="subject">
    <el-card>
      <el-form label-width="80px" :inline="true" :model="form" ref="form">
        <el-form-item label="学科编号" prop="rid">
          <el-input v-model="form.rid"></el-input>
        </el-form-item>
        <el-form-item label="学科名称" prop="name">
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
          <el-button type="primary" @click="searchSubject">搜索</el-button>
          <el-button @click="reset">清除</el-button>
          <el-button type="primary" @click="add" v-if="$store.state.role != '学生'">+新增学科</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <!-- 表格 -->
      <el-table :data="tableData">
        <el-table-column label="序号" width="100px">
          <!-- 真实序号=（当前页-1）*每页条数+当前序号（从0开始）+1 -->
          <template
            slot-scope="scope"
          >{{(pagination.currentPage-1)*pagination.pageSize+scope.$index+1}}</template>
        </el-table-column>
        <el-table-column label="学科编号" prop="rid"></el-table-column>
        <el-table-column label="学科名称" prop="name"></el-table-column>
        <el-table-column label="简称" prop="short_name"></el-table-column>
        <el-table-column label="创建者" prop="username"></el-table-column>
        <el-table-column label="创建日期" prop="create_time"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">{{scope.row.status==0?'禁用':'启用'}}</template>
        </el-table-column>
        <el-table-column label="操作" v-if="$store.state.role != '学生'">
          <template slot-scope="scope">
            <el-button @click="editClick(scope.row)" type="text" size="small">编辑</el-button>
            <el-button
              type="text"
              size="small"
              @click="setStatus(scope.row.id)"
            >{{scope.row.status==1?'禁用':'启用'}}</el-button>
            <el-button type="danger" size="small" @click="deleteData(scope.row.id)" v-if="$store.state.role.includes('管理员')">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="[3, 20, 30, 40]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
      ></el-pagination>
    </el-card>

    <addSubject ref="addSubject" :mode="mode" @add="searchSubject"></addSubject>
  </div>
</template>

<script>
// 导入学科列表数据的接口
import {
  getSubjectData,
  setSubjectStatus,
  delSubjectData
} from "@/api/subject.js";

import addSubject from "./addSubject.vue";
export default {
  components: {
    addSubject
  },
  data() {
    return {
      form: {
        rid: "", //学科编号
        name: "", //学科名称
        username: "", //创建者
        status: ""
      },

      tableData: [], //学科列表数据

      pagination: {
        currentPage: 1, //当前页
        pageSize: 3, //每页条数
        total: 40 //总页数
      },

      mode: "add" //新增   edit编辑
    };
  },

  created() {
    this.getData();
  },

  methods: {
    handleSizeChange(size) {
      // 每页条数改变时 回调
      this.pagination.pageSize = size;
      this.pagination.currentPage = 1;
      this.getData();
    },
    handleCurrentChange(page) {
      this.pagination.currentPage = page;
      this.getData();
    },

    getData() {
      let _params = {
        page: this.pagination.currentPage, //当前页
        limit: this.pagination.pageSize, //页容量
        // 加入相应的表单数据
        ...this.form
      };
      getSubjectData(_params).then(res => {
        // console.log(res);
        this.tableData = res.data.items;
        this.pagination.total = res.data.pagination.total;
      });
    },

    // 点击搜索按钮
    searchSubject() {
      this.pagination.currentPage = 1;
      this.getData();
    },
    // 清除按钮
    reset() {
      // 调用resetFields方法：1.是每个表单验证参数都有绑定prop属性；2.el-form有ref属性
      this.$refs.form.resetFields();
      this.searchSubject();
    },

    // 设置状态
    setStatus(id) {
      setSubjectStatus({ id }).then(() => {
        this.$message.success("设置状态成功");
        // 刷新table数据
        this.searchSubject();
      });
    },

    // 删除数据
    deleteData(id) {
      // 弹出提示框
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 确定按钮的操作
          delSubjectData({ id: id }).then(() => {
            this.$message.success("删除成功");
            // 更新table数据
            this.searchSubject();
          });
        })
        .catch(() => {});
    },

    // 新增按钮点击事件
    add() {
      this.mode = "add";
      // 重置form表单
      this.$refs.addSubject.form = {
        rid: "", //学科编号
        name: "", //学科名称
        short_name: "", //学科简称
        intro: "", //学科简介
        remark: "" //学科备注
      };
      this.$refs.addSubject.dialogFormVisible = true;
    },

    // 编辑按钮点击事件
    editClick(row) {
      this.mode = "edit";
      // 将form表单的数据传入
      // this.$refs.addSubject.form = row;
      // 要将整行数据深度拷贝
      this.$refs.addSubject.form = JSON.parse(JSON.stringify(row));
      // 打开弹窗
      this.$refs.addSubject.dialogFormVisible = true;
    }
  }
};
</script>

<style lang="less">
.subject {
  .pagination {
    text-align: center;
    margin-top: 50px;
  }
}
</style>