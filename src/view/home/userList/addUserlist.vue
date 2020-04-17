<template>
  <el-dialog class="addUserlist" :visible.sync="dialogFormVisible" width="477px">
    <div slot="title" class="title">{{mode=="add"?'新增用户':'编辑用户'}}</div>

    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
      <el-form-item label="电话" prop="phone">
        <el-input v-model="form.phone"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="role_id">
        <el-select v-model="form.role_id" placeholder="请选择角色">
          <!-- :value="+key"   将key转为数值类型 -->
          <el-option v-for="(item,key, index) in $store.state.roleObj" :key="index" :value="+key" :label="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="form.status" placeholder="请选择状态">
          <el-option label="禁用" :value="0"></el-option>
          <el-option label="启用" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="用户备注" prop="remark">
        <el-input v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addUserData, editUserData } from "@/api/userList.js";
export default {
  props: {
    mode: String
  },
  data() {
    return {
      dialogFormVisible: false, //是否显示弹窗

      form: {
        username: "", //用户名
        email: "", //邮箱
        phone: "", //手机号
        role_id: "", //角色
        status: "", //状态
        remark: "" //备注
      },
      rules: {
        username: [
          { required: true, message: "请填写用户名", trigger: "change" }
        ],
        email: [
          { required: true, message: "请填写邮箱", trigger: "change" },
          {
            validator: (rule, value, callback) => {
              let _reg = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
              if (_reg.test(value)) {
                callback();
              } else {
                callback("请正确输入你的邮箱地址");
              }
            },
            trigger: "change"
          }
        ],
        phone: [
          { required: true, message: "请填写手机号哈", trigger: "change" },
          {
            validator: (rule, value, callback) => {
              let _reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/;
              if (_reg.test(value)) {
                callback();
              } else {
                callback("请正确输入你的手机号码");
              }
            },
            trigger: "change"
          }
        ],
        role_id: [
          { required: true, message: "请选择一个角色", trigger: "change" }
        ]
      }
    };
  },

  methods: {
    submit() {
      // 全局验证
      this.$refs.form.validate(result => {
        if (result) {
          if (this.mode == "add") {
            // 调用新增接口
            addUserData(this.form).then(() => {
              this.$message.success("新增用户成功");
              this.dialogFormVisible = false;
              this.$parent.searchUserlist();
            });
          } else {
            // 调用编辑接口
            editUserData(this.form).then(() => {
              this.$message.success("编辑用户成功");
              this.dialogFormVisible = false;
              this.$parent.getData();
            });
          }
        }
      });
    }
  },

  watch: {
    dialogFormVisible(newValue) {
      if (newValue == false) {
        this.$refs.form.resetFields();
      }else{
        // 打开弹窗时，form表单还没有渲染出来，所以要做延时处理---$nextTick
          this.$nextTick(()=>{
            this.$refs.form.clearValidate();
        })
      }
    },
  }
};
</script>

<style lang="less">
.addUserlist {
  .el-dialog__header {
    padding: 0;
  }
  .title {
    height: 54px;
    line-height: 54px;
    text-align: center;
    color: #fff;
    background: linear-gradient(to right, #00c6f9, #1495fc);
  }
  .footer {
    text-align: center;
  }
}
</style>