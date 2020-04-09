<template>
  <div class="login">
    <div class="left">
      <div class="title">
        <img src="@/assets/login-title.png" alt />
        <span class="titleName">黑马面面</span>
        <span class="titleLine">|</span>
        <span class="titleName2">用户登录</span>
      </div>
      <!-- 表单 -->
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item prop="phone">
          <el-input placeholder="请输入手机号" prefix-icon="el-icon-user" v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <!-- show-password--是否显示密码，默认是false。。。用v-bind绑定，来把值改为布尔值 -->
          <el-input
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            v-model="form.password"
            :show-password="true"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <!-- 栅格布局 -->
          <el-row>
            <el-col :span="18">
              <el-input
                placeholder="请输入验证码"
                prefix-icon="el-icon-key"
                v-model="form.code"
              ></el-input>
            </el-col>
            <el-col :span="6">
              <img :src="codeUrl" alt="" class="key" @click="changeLoginCode">
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 复选框：协议 -->
        <el-form-item prop="isCheck">
          <el-checkbox v-model="form.isCheck">我已阅读并同意
            <el-link type="primary">用户协议</el-link>和
            <el-link type="primary">隐私条款</el-link>
          </el-checkbox>
        </el-form-item>
        <!-- button按钮 -->
        <el-form-item>
          <el-button type="primary" class="btn" @click="loginClick">登录</el-button>
          <br>
          <el-button type="primary" class="btn" @click="registerClick">注册</el-button>
        </el-form-item>
      </el-form>
      <!-- 栅格系统 elementUI一行有24栏，el-row行；el-col列 -->
    </div>
    <div class="right">
      <img src="@/assets/login_banner_ele.png" alt />
    </div>
    <!-- 注册子组件 -->
    <register ref="register"></register>

  </div>
</template>

<script>
// 导入注册组件
import register from './register.vue'
import {login} from '@/api/login.js'
import {saveToken} from '@/utils/token.js'
export default {
  name: "login",
  components:{
    register,
  },
  data() {
    return {
      // 表单的双向绑定
      form: {
        phone: "", //手机号
        password: "", // 密码
        code:"",   //验证码
        isCheck:'',  //是否同意协议
      },
      codeUrl:process.env.VUE_APP_URL + '/captcha?type=login',   //登录验证码
      rules:{
        phone:[
          { required:true,message:'请输入手机号',trigger:'blur'},
          {validator:(rule,value,callback)=>{
            let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
            if(reg.test(value)){
              callback();
            }else{
              callback('请输入正确的手机号码')
            }
          }}
        ],
        password:[
          { required:true,message:'请输入密码',trigger:'blur'},
          { min:6,max:12,message:'请输入6到12位长度的密码',trigger:'blur'}
        ],
        code:[
          { required:true,message:'请输入验证码',trigger:'blur'},
          { min:4,max:4,message:'请正确输入验证码',trigger:'blur'}
        ],
        isCheck: [
          { required: true, message: "请勾选协议", trigger: "change" },
          {
            validator: (rule, value, callback) => {
              if (value === true) {
                callback();
              } else {
                callback("请勾选协议");
              }
            },
            trigger: "change"
          }
        ],
      }
    };
  },
  methods: {
    // 登录
    loginClick(){
      this.$refs.form.validate(result=>{
        if(result){
          // 调用登录接口
          login(this.form).then(res=>{
            console.log(res);
            this.$message.success('登录成功');
            // 保存token
            saveToken("token",res.data.token);
          })
        }else{
          console.log('err sublit');
          return false;
        }
      })
    },
    // 注册
    registerClick(){
      this.$refs.register.dialogFormVisible = true;
    },
    // 点击验证码切换
    changeLoginCode(){
      this.codeUrl = process.env.VUE_APP_URL + '/captcha?type=login&code=' + Date.now();
    }
  },
};
</script>

<style lang="less">
.login {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  background: linear-gradient(
    225deg,
    rgba(20, 147, 250, 1),
    rgba(1, 198, 250, 1)
  );
  .left {
    width: 478px;
    height: 550px;
    background: rgba(245, 245, 245, 1);
    padding: 42px;

    .title {
      margin-bottom: 20px;
      .titleName {
        font-size: 24px;
        color: rgba(12, 12, 12, 1);
        margin: 0 15px;
      }
      .titleLine {
        font-size: 22px;
        color: #ccc;
      }
      .titleName2 {
        font-size: 22px;
        color: rgba(12, 12, 12, 1);
        margin-left: 15px;
      }
    }
    .key{
      width:100%;
      height:40px;
    }
    .btn{
      width:100%;
    }
    .btn:nth-child(1){
      margin-bottom:30px;
    }
  }
}
</style>