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
    </el-form>
    <!-- footer -->
    <div slot="footer">
      <el-button>取消</el-button>
      <el-button type="primary" @click="submitClick">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialogFormVisible: false,
      form: {
        avatar: "" //将注册接口的头像地址保存
      },
      baseUrl: process.env.VUE_APP_URL, //基地址
      imageUrl: "",
      // 注册规则
      rules:{
        avatar:[
          // trigger  只会在组件中有双向绑定v-model才会触发
          { required:true,message:'请上传头像',trigger:'blur'},
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
}
</style>