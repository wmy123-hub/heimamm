<template>
  <el-dialog :visible.sync="dialogFormVisible" class="register" width="600px" :show-close="false">
    <!-- 弹窗（对话框） -->
    <!-- slot重写title标题 -->
    <div slot="title" class="title">用户注册</div>

    <el-form :model="form" label-width="80px" ref="form" :rules="rules">
      <el-form-item label="头像" prop="avatar">
        <!-- 文件上传 -->
        <el-upload
          class="avatar-uploader"
          :action="baseUrl+'/uploads'"
          name="image"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <!-- 昵称 -->
      <el-form-item label="昵称" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <!-- 邮箱 -->
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <!-- 手机号 -->
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <!-- 密码 -->
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" show-password></el-input>
      </el-form-item>
      <!-- 图形码 -->
      <el-form-item label="图形码" prop="code">
        <!-- 栅格系统 -->
        <el-row>
          <el-col :span="16">
            <el-input v-model="form.code"></el-input>
          </el-col>
          <!-- offset 是 栅格左侧的间隔格数 -->
          <el-col :span="7" :offset="1">
            <img :src="codeUrl" alt="" class="code" @click="changeCodeUrl">
          </el-col>
        </el-row>
      </el-form-item>
      <!-- 短信验证码 -->
      <el-form-item label="验证码" prop="rcode">
        <el-row>
          <el-col :span="16">
            <el-input v-model="form.rcode"></el-input>
          </el-col>
          <el-col :span="7" :offset="1">
            <el-button @click="getRcode">获取用户验证码</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
    <!-- footer -->
    <div slot="footer">
      <el-button>取消</el-button>
      <el-button type="primary" @click="submitClick">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import getPhoneCode from '@/api/register.js';
export default {
  data() {
    return {
      dialogFormVisible: false,
      form: {
        avatar: "", //将注册接口的头像地址保存
        username:'',  //昵称
        email:'',    //邮箱
        phone:'',    //手机号
        password:'',  //密码
        code:'',    //图形码
        rcode:'',   //短信验证码
      },
      baseUrl: process.env.VUE_APP_URL, //基地址
      imageUrl: "",   //只是展示给用户看的图片地址
      codeUrl:process.env.VUE_APP_URL+'/captcha?type=sendsms',   //生成图片验证码的路径
      // 注册规则
      rules:{
        avatar:[
          // trigger  只会在组件中有双向绑定v-model才会触发
          { required:true,message:'请上传头像',trigger:'change'},
        ],
        username:[
          { required:true,message:'请输入昵称',trigger:'change'}
        ],
        email:[
          { required:true,message:'请输入你的邮箱地址',trigger:'change'},
          { validator:(rule,value,callback)=>{
            let reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
            if(reg.test(value)){
              // 符合正则要求，则正确（正则，test方法调用，返回值是一个布尔值，通过是true，不通过则是false）
              callback();
            }else{
              // 提示错误消息
              callback('请正确输入邮箱地址');
            }
          }}
        ],
        phone:[
          { required:true,message:'请输入你的手机号',trigger:'change'},
          { validator:(rule,value,callback)=>{
            let reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
            if(reg.test(value)){
              // 符合正则要求，则正确（正则，test方法调用，返回值是一个布尔值，通过是true，不通过则是false）
              callback();
            }else{
              // 提示错误消息
              callback('请正确输入手机号');
            }
          }}
        ],
        password:[
          { required:true,message:'请输入密码',trigger:'change'},
          { min:6,max:12,message:'请输入6-12位字符的密码',trigger:'change'}
        ],
        code:[
          { required:true,message:'请输入右侧图形码',trigger:'change'},
          { min:4,max:4,message:'请输入4位字符的图形字符',trigger:'change'}
        ],
        rcode:[
          { required:true,message:'请输入短信验证码',trigger:'change'},
        ]
      }
    };
  },
  methods: {
    //   文件上传之前
    beforeAvatarUpload(file) {
      // 支持的图片格式
      const isJPG =
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/gif";
      // 图片大小是根据字节单位（bytes）
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片支持是 JPG/PNG/GIF 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    // 文件上传成功
    handleAvatarSuccess(res) {
      // console.log(res);
      this.imageUrl = this.baseUrl + "/" + res.data.file_path;
      this.form.avatar = res.data.file_path;

      // 文件上传成功，主动触发trigger
      this.$refs.form.validateField('avatar');
    },

    // 确定按钮的全局验证
    submitClick() {
      this.$refs.form.validate(result => {
        if (result) {
          alert("注册成功");
        } else {
          console.log("error submit");
          return false;
        }
      });
    },
    // 点击切换图片验证码
    changeCodeUrl(){
      //  Date.now()  时间戳---从1970年到现在的毫秒数
      this.codeUrl = process.env.VUE_APP_URL+'/captcha?type=sendsms&code='+Date.now();
    },
    // 点击获取手机验证码
    getRcode(){
      /* 
      访问el-form上的validateField该方法
      参数1：要验证的项，（string/array）
      参数2：回调函数。是验证是的错误信息返回，当返回是空时，则表示没有错误；否则，返回错误信息
      需求：code和phone都满足才行
       */
      let _pass = true;
      this.$refs.form.validateField(["code","phone"],err=>{
        if(err != ''){
          // err不为空，则是有错误
          _pass = false;
        }
      });
      if(_pass === false){
        // 如果是错误的，则不再往下执行
        return
      }else{
        // 调用接口，获取手机验证码
        // axios({
        //   url: process.env.VUE_APP_URL + '/sendsms',
        //   method:'post',
        //   data: {
        //     code:this.form.code,
        //     phone:this.form.phone,

        //     withCredentials:true   //跨域照样携带cookie
        //   },
        // })
        
        getPhoneCode({
          code:this.form.code,
          phone:this.form.phone
        }).then(res=>{
          //成功回调
          // console.log(res);
          this.$message.success('获取的验证码：'+res.data.data.captcha);
        });
      }
    }
  }
};
</script>

<style lang="less">
.register {
  .title {
    height: 53px;
    line-height: 53px;
    text-align: center;
    background-color: #1299f8;
    color: #fff;
  }
  .el-dialog__header {
    padding: 0;
  }
  .avatar-uploader {
    width: 178px;
    margin: 0 auto;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .code{
    width:100%;
    height:40px;
    border:1px dashed #ccc;
  }
}
</style>