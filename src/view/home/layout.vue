<template>
  <el-container class="layout">
    <el-header class="header">
      <div class="left">
        <i class="el-icon-s-fold setheight" @click="collapse=!collapse"></i>
        <img class="marginlr" src="@/assets/login-title.png" alt />
        <span class="title">黑马面面</span>
      </div>
      <div class="right">
        <img class="avatar" :src="userInfo.avatar" alt />
        <span class="name">{{userInfo.username}}，您好</span>
        <el-button type="primary" @click="exit">退出</el-button>
      </div>
    </el-header>
    <el-container>
      <!-- 注意点：我们得设置el-aside的宽度为auto，不能写死，不然就没有适配效果 -->
      <el-aside width="auto" class="aside">
        <!-- $route.fullPath--获取当前页面路径 -->
        <el-menu :default-active="$route.fullPath" :collapse='collapse' class="menuTransition" :router="true">
          <!-- collapse控制菜单是否折叠
          加上它，它就会在el-menu上产生一个class  el-menu--collapse
          然后为了实现动画效果，我们得给一个初始宽度，因为默认是没设置宽度的
           -->
          <el-menu-item index="/home/chart">
            <i class="el-icon-pie-chart"></i>
            <span slot="title">数据概览</span>
          </el-menu-item>
          <el-menu-item index="/home/userList">
            <i class="el-icon-user-solid"></i>
            <span slot="title">用户列表</span>
          </el-menu-item>
          <el-menu-item index="/home/question">
            <i class="el-icon-edit-outline"></i>
            <span slot="title">题库列表</span>
          </el-menu-item>
          <el-menu-item index="/home/business">
            <i class="el-icon-office-building"></i>
            <span slot="title">企业列表</span>
          </el-menu-item>
          <el-menu-item index="/home/subject">
            <i class="el-icon-notebook-2"></i>
            <span slot="title">学科列表</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { getUserInfo, logout } from "@/api/home.js";
import { removeToken,getToken } from "@/utils/token.js";
export default {
  data() {
    return {
      userInfo: "",
      collapse:false,   //控制菜单是否折叠
    };
  },

  created() {
    // console.log(this.$route);
    // 进行token判断
    // 如果没有token，则跳至登录页
    if(!getToken()){
      this.$router.push('/');
    }
    getUserInfo().then(res => {
      // console.log(res);
      this.userInfo = res.data;
      this.userInfo.avatar = process.env.VUE_APP_URL + "/" + res.data.avatar;
    });
  },
  methods: {
    // 退出按钮点击事件
    exit() {
      this.$confirm("您确定要退出当前账号吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        // 点击确认
        // 调用退出接口
        logout().then(() => {
          // 删除token
          removeToken();
          // 跳转至登录页
          this.$router.push("/");
        });
      });
    }
  }
};
</script>

<style lang="less">
.layout {
  height: 100%;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    height: 60px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 5px 0px rgba(63, 63, 63, 0.35);

    .left {
      .setheight {
        font-size: 20px;
      }
      .marginlr {
        margin: 0 20px;
      }
      .title {
        font-size: 22px;
        font-family: Microsoft YaHei;
        font-weight: bold;
        color: rgba(73, 161, 255, 1);
      }
    }
    .right {
      display: flex;
      align-items: center;
      .avatar {
        width: 43px;
        height: 43px;
      }
      .name {
        margin: 0 20px;
      }
    }
  }
  .aside {
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 5px 0px rgba(63, 63, 63, 0.35);

    .menuTransition:not(.el-menu--collapse){
      width:160px;
    }
  }
}
</style>