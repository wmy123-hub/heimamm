<template>
  <div class="userList">
    <el-card>
      <el-form :model="form" :inline="true" ref="form">
        <el-form-item label="用户名称" prop="username" class="margin">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="用户邮箱" prop="email" class="margin">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="role_id" class="margin">
          <el-select placeholder="请选择状态" v-model="form.role_id">
            <el-option v-for="(item,key, index) in $store.state.roleObj" :key="index" :label="item" :value="key"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="margin">
          <el-button type="primary" @click="searchUserlist">搜索</el-button>
          <el-button @click="reset">清除</el-button>
          <el-button type="primary" @click="addClick">+新增用户</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-table :data="tableData" :border="true">
        <el-table-column label="序号" width="100px">
          <template
            slot-scope="scope"
          >{{(pagination.currentPage-1)*pagination.pageSize+scope.$index+1}}</template>
        </el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="电话" prop="phone"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="角色">
          <template slot-scope="scope">
            <span v-if="scope.row.role_id==1">超级管理员</span>
            <span v-else-if="scope.row.role_id==2">管理员</span>
            <span v-else-if="scope.row.role_id==3">老师</span>
            <span v-else>学生</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" prop="remark"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <span :class="{red:scope.row.status==0}">{{scope.row.status==1?'启用':'禁用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <!-- 编辑的是整行的数据 -->
            <el-button @click="editClick(scope.row)">编辑</el-button>
            <el-button @click="setStatus(scope.row.id)">{{scope.row.status==0?'启用':'禁用'}}</el-button>
            <el-button type="danger" @click="delClick(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="[3, 10,20, 30]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
      ></el-pagination>
    </el-card>

    <addUserlist ref="addUserlist" :mode="modeFather"></addUserlist>
  </div>
</template>

<script>
import addUserlist from "./addUserlist.vue";
import { getUserData, setUserStatus, delUserData } from "@/api/userList.js";
export default {
  components: {
    addUserlist
  },
  data() {
    return {
      modeFather: "add", //新增状态
      form: {
        username: "", //昵称
        email: "", //邮箱
        role_id: "" //角色
      },

      tableData: [], //表格数据
      // 分页
      pagination: {
        currentPage: 1,
        pageSize: 3,
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
      //   跳转到第一页
      this.pagination.currentPage = 1;
      this.getData();
    },
    handleCurrentChange(page) {
      this.pagination.currentPage = page;
      this.getData();
    },

    getData() {
      let _params = {
        page: this.pagination.currentPage,
        limit: this.pagination.pageSize,
        ...this.form
      };
      getUserData(_params).then(res => {
        console.log("用户列表",res);
        this.tableData = res.data.items;
        this.pagination.total = res.data.pagination.total;
      });
    },

    // 搜索按钮
    searchUserlist() {
      this.pagination.currentPage = 1;
      this.getData();
    },

    // 清除
    reset() {
      this.$refs.form.resetFields();
      this.searchUserlist();
    },

    // 状态
    setStatus(id) {
      setUserStatus({ id }).then(() => {
        this.$message.success("状态设置成功");
        this.getData();
      });
    },

    // 删除
    delClick(id) {
      // 弹出提示框
      this.$confirm("你确定要删除此用户数据", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 确认按钮
          delUserData({ id }).then(() => {
            this.$message.success("删除成功");
            this.searchUserlist();
          });
        })
        .catch(() => {});
    },

    // 新增
    addClick() {
      this.modeFather = "add";
      this.$refs.addUserlist.form = {
        username: "", //用户名
        email: "", //邮箱
        phone: "", //手机号
        role_id: "", //角色
        status: "", //状态
        remark: "" //备注
      };
      this.$refs.addUserlist.dialogFormVisible = true;
    },

    // 编辑
    editClick(row) {
      this.modeFather = "edit";
      // 弹窗
      this.$refs.addUserlist.dialogFormVisible = true;
      // 把整行的数据渲染过来(深拷贝)
      this.$refs.addUserlist.form = JSON.parse(JSON.stringify(row));
    }
  }
};
</script>

<style lang="less">
.userList {
  .margin {
    margin: 30px;
  }
  .red {
    color: #f00;
  }
  .pagination {
    text-align: center;
    margin-top: 40px;
  }
}
</style>