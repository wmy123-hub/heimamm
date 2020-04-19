<template>
  <!-- fullscreen是否全屏显示 默认是false -->
  <el-dialog class="addQuestion" :visible.sync="dialogFormVisible" :fullscreen="true">
    <div slot="title" class="title">新增题库测试</div>

    <el-form :model="form" ref="form" class="form" label-width="100px" :rules="rules">
      <el-form-item label="学科" prop="subject">
        <el-select placeholder="请选择学科" v-model="form.subject">
          <el-option
            v-for="(item, index) in subjectData"
            :key="index"
            :value="item.id"
            :label="item.name"
            v-show="item.status==1"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="阶段" prop="step">
        <el-select placeholder="请选择阶段" v-model="form.step">
          <el-option v-for="(item,key, index) in stepObj" :key="index" :value="+key" :label="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="企业" prop="enterprise">
        <el-select placeholder="请选择企业" v-model="form.enterprise">
          <el-option
            v-for="(item, index) in businessData"
            :key="index"
            :value="item.id"
            :label="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="城市" prop="city">
        <!-- :props="{value:'label'}" 将value值也改为可看到的label值 -->
        <!-- {{form.city}} -->
        <el-cascader v-model="form.city" :options="option" :props="{value:'label'}"></el-cascader>
      </el-form-item>
      <el-form-item label="题型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio v-for="(value,key,index) in typeObj" :key="index" :label="+key">{{value}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="难度" prop="difficulty">
        <el-radio-group v-model="form.difficulty">
          <el-radio v-for="(value,key,index) in difficultyObj" :key="index" :label="+key">{{value}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <hr />
      <el-form-item label="试题标题" prop="title" class="marginStyle">
        <!-- @change事件  一改变就会调用这个事件 -->
        <quillEditor
          v-model="form.title"
          :options="{placeholder:'请在这里输入...'}"
          @change="editChange('title')"
        ></quillEditor>
      </el-form-item>
      <el-form-item
        :label="typeObj[form.type]"
        :prop="{1:'single_select_answer',2:'multiple_select_answer',3:'short_answer'}[form.type]"
      >
        <allSelect :form="form" class="allSelect" @change="allSelectChange"></allSelect>
      </el-form-item>
      <hr />
      <br />
      <el-form-item label="解析视频" prop="video">
        <uploadFile v-model="form.video" type="video"></uploadFile>
      </el-form-item>
      <hr />
      <br />
      <el-form-item label="答案解析" prop="answer_analyze" class="answer">
        <quillEditor
          v-model="form.answer_analyze"
          :options="{placeholder:'请在这里输入...'}"
          @change="editChange('answer_analyze')"
        ></quillEditor>
      </el-form-item>
      <br />
      <hr />
      <br />
      <el-form-item label="试题备注" prop="remark">
        <el-input v-model="form.remark" class="remark"></el-input>
      </el-form-item>
    </el-form>

    <div slot="footer" class="footer">
      <el-button @click="dialogFormVisible=false">取消</el-button>
      <el-button type="primary" @click="submit">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { regionData } from "element-china-area-data";
// 导入富文本组件 及其 样式
import { quillEditor } from "vue-quill-editor";
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";

import allSelect from "./allSelect.vue";
import uploadFile from "./uploadFile.vue";

import { addQuestionData, editQuestionData } from "@/api/question.js";

export default {
  components: {
    quillEditor,
    allSelect,
    uploadFile
  },
  props: {
    subjectData: Array,
    stepObj: Object,
    businessData: Array,
    typeObj: Object,
    difficultyObj: Object,
    mode: String
  },
  data() {
    return {
      option: regionData,
      dialogFormVisible: false,
      form: {
        subject: "",
        step: "",
        enterprise: "",
        city: [],
        type: 1,
        difficulty: 1,
        title: "",
        select_options: [
          {
            label: "A",
            text: "狗不理",
            image: ""
          },
          {
            label: "B",
            text: "猫不理",
            image: ""
          },
          {
            label: "C",
            text: "麻花",
            image: ""
          },
          {
            label: "D",
            text: "炸酱面",
            image: ""
          }
        ],
        single_select_answer: "", //单选答案
        multiple_select_answer: [], // 多选
        short_answer: "", // 简答
        video: "", //视频
        answer_analyze: "", //答案解析
        remark: "" //备注
      },
      // 验证规则
      rules: {
        subject: [{ required: true, message: "请选择学科", trigger: "change" }],
        step: [{ required: true, message: "请选择阶段", trigger: "change" }],
        enterprise: [
          { required: true, message: "请选择企业", trigger: "change" }
        ],
        city: [{ required: true, message: "请选择城市", trigger: "change" }],
        type: [
          { required: true, message: "请选择题目类型", trigger: "change" }
        ],
        difficulty: [
          { required: true, message: "请选择题目难度", trigger: "change" }
        ],
        title: [{ required: true, message: "请填写题目", trigger: "change" }],
        single_select_answer: [
          { required: true, message: "请选择单选答案", trigger: "change" }
        ], //单选答案
        multiple_select_answer: [
          { required: true, message: "请选择多选答案", trigger: "change" }
        ], // 多选
        short_answer: [
          { required: true, message: "请填写简答答案", trigger: "change" }
        ], // 简答
        answer_analyze: [
          { required: true, message: "请填写答案解析", trigger: "change" }
        ], //答案解析
        remark: [
          { required: true, message: "请填写答案备注", trigger: "change" }
        ] //备注
      }
    };
  },
  methods: {
    // 确认按钮表单全局验证
    submit() {
      this.$refs.form.validate(result => {
        if (result) {
          if (this.mode == "add") {
            addQuestionData(this.form).then(() => {
              this.$message.success("新增成功");
              this.dialogFormVisible = false;
              this.$parent.searchQuestion();
            });
          } else {
            // 编辑接口需要的城市是字符串类型。所以要将数组转为字符串
            let _query = JSON.parse(JSON.stringify(this.form));
            _query.city = _query.city.join(',');
            editQuestionData(_query).then(() => {
              this.$message.success("编辑成功");
              this.dialogFormVisible = false;
              this.$parent.searchQuestion();
            });
          }
        }
      });
    },
    // 富文本验证
    editChange(str) {
      this.$refs.form.validateField(str);
    },
    // 题型选择验证
    allSelectChange() {
      this.$refs.form.validateField([
        "single_select_answer",
        "multiple_select_answer",
        "short_answer"
      ]);
    }
  },

  watch: {
    'dialogFormVisible'(val){
      if(val == true){
        this.$nextTick(()=>{
          this.$refs.form.clearValidate();
        })
      }
    }
  },
};
</script>

<style lang="less">
.addQuestion {
  .el-dialog__header {
    padding: 0;
  }
  .form {
    width: 832px;
    margin: 0 auto;
  }
  .title {
    height: 54px;
    line-height: 54px;
    padding-left: 30px;
    color: #fff;
    background: linear-gradient(to right, #01c4fa, #1395fa);
  }
  .el-icon-close {
    color: #fff;
  }
  .el-form-item__label {
    text-align: left;
  }
  .marginStyle {
    margin-top: 20px;
    .el-form-item__content {
      margin-left: 0px !important;
      margin-top: 50px;
      line-height: 0px;
    }
  }
  .answer {
    .el-form-item__content {
      margin-left: 0px !important;
      margin-top: 50px;
      line-height: 0px;
    }
  }
  .remark {
    margin-top: 40px;
    margin-left: -40px;
  }
  .allSelect {
    .el-input__inner {
      border-color: #dcdfe6;
    }
  }
  .footer {
    text-align: center;
  }
}
</style>