<template>
  <!-- 对话框 -->
  <el-dialog :visible.sync="dialogFormVisible" width="600px" class="addSubject">
    <div slot="title" class="title">{{mode=="add"?'新增学科':'编辑学科'}}</div>

    <el-form label-width="100px" :model="form" :rules="rules" ref="form">
      <el-form-item label="学科编号" prop="rid">
        <el-input v-model="form.rid"></el-input>
      </el-form-item>
      <el-form-item label="学科名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="学科简称" prop="short_name">
        <el-input v-model="form.short_name"></el-input>
      </el-form-item>
      <el-form-item label="学科简介" prop="intro">
        <el-input v-model="form.intro"></el-input>
      </el-form-item>
      <el-form-item label="学科备注" prop="remark">
        <el-input v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="footer">
      <el-button @click="dialogFormVisible=false">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { addSubjectData, editSubjectData } from "@/api/subject.js";
export default {
  data() {
    return {
      dialogFormVisible: false, //设置弹窗是否显示
      form: {
        rid: "", //学科编号
        name: "", //学科名称
        short_name: "", //学科简称
        intro: "", //学科简介
        remark: "" //学科备注
      },
      // 表单规则
      rules: {
        rid: [{ required: true, message: "请填写学科编号", trigger: "change" }],
        name: [{ required: true, message: "请填写学科名称", trigger: "change" }]
      },
    };
  },

  props: {
        mode: {
          type: String,
          default: "add"    //默认
        }
      },

  methods: {
    //   全局验证
    submit() {
      this.$refs.form.validate(result => {
        console.log(result);
        if (result) {
          if (this.mode == "add") {
            // 代表新增成功
            addSubjectData(this.form).then(() => {
              this.$message.success("新增成功");
              // 关闭弹窗
              this.dialogFormVisible = false;
              // 刷新table数据
              this.$emit("add")
            });
          }else{
            // 编辑
            editSubjectData(this.form).then(()=>{
              this.$message.success('编辑成功');
              this.dialogFormVisible = false;
              this.$parent.searchSubject();
            })
          }
        }
      });
    }
  },

  // 侦听器
  watch: {
    dialogFormVisible(newValue) {
      if (newValue == false) {
        //   清空表单
        // 需要清空的项要 加上prop属性
        this.$refs.form.resetFields();
      }
    },

    'mode'(){
      // 当第一次打开时form表单不存在，所以无法调用clearValidate
      // $nextTick是 setTimeout的高级版本，它会在页面渲染完成后进行调用，它计算好了最近的页面渲染所需时间
      // $nextTick计算好了渲染form所需时间后进行调用
      this.$nextTick(()=>{
        // 清空验证规则
        this.$refs.form.clearValidate();
      })
    }
  }
};
</script>

<style lang="less">
.addSubject {
  .el-dialog__header {
    padding: 0;
  }
  .title {
    height: 53px;
    line-height: 53px;
    text-align: center;
    color: #fff;
    background: linear-gradient(to right, #00c6f7, #1396fb);
  }
  .el-icon-close {
    color: #fff;
  }
  .footer {
    text-align: center;
  }
}
</style>