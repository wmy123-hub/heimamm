<template>
  <div class="question">
    <el-card>
      <el-form :model="form" label-width="100px" ref="form">
        <!-- 栅格布局 -->
        <el-row>
          <el-col :span="5">
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
          </el-col>
          <el-col :span="5">
            <el-form-item label="阶段" prop="step">
              <el-select placeholder="请选择阶段" v-model="form.step">
                <el-option
                  v-for="(item,key, index) in stepObj"
                  :key="index"
                  :value="+key"
                  :label="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
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
          </el-col>
          <el-col :span="5">
            <el-form-item label="题型" prop="type">
              <el-select placeholder="请选择题型" v-model="form.type">
                <el-option
                  v-for="(item,key, index) in typeObj"
                  :key="index"
                  :value="+key"
                  :label="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="5">
            <el-form-item label="难度" prop="difficulty">
              <el-select placeholder="请选择难度" v-model="form.difficulty">
                <el-option
                  v-for="(item,key, index) in difficultyObj"
                  :key="index"
                  :value="+key"
                  :label="item"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="作者" prop="username">
              <el-input v-model="form.username"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态" prop="status">
              <el-select placeholder="请选择状态" v-model="form.status">
                <el-option :value="1" label="启用"></el-option>
                <el-option :value="0" label="禁用"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="日期" prop="create_date">
              <el-date-picker v-model="form.create_date" type="date" placeholder="请选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="10">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label-width="30px">
              <el-button type="primary" @click="searchQuestion">搜索</el-button>
              <el-button @click="reset">清除</el-button>
              <el-button type="primary" @click="addClick">+新增试题</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <el-card class="card2">
      <el-table :data="tableData" :border="true">
        <el-table-column label="序号" width="80px">
          <template
            slot-scope="scope"
          >{{(pagination.currentPage-1)*pagination.pageSize+scope.$index+1}}</template>
        </el-table-column>
        <el-table-column label="题目">
          <template slot-scope="scope">
            <span v-html="scope.row.title"></span>
          </template>
        </el-table-column>
        <el-table-column label="学科.阶段" prop="subject" width="100px">
          <!-- 对象.值  点语法有一个规定，后面的值要符合变量命名规范，不是数字开头，不能是中文等
          解决：对象[]语法，它没有变量命名的限制规则-->
          <template slot-scope="scope">{{scope.row.subject_name+'.'+stepObj[scope.row.step]}}</template>
        </el-table-column>
        <el-table-column label="题型" width="150px">
          <template slot-scope="scope">{{typeObj[scope.row.type]}}</template>
        </el-table-column>
        <el-table-column label="企业" prop="enterprise_name" width="150px"></el-table-column>
        <el-table-column label="创建者" prop="username" width="150px"></el-table-column>
        <el-table-column label="状态" width="120px">
          <template slot-scope="scope">{{scope.row.status==1?'启用':'禁用'}}</template>
        </el-table-column>
        <el-table-column label="访问量" prop="reads" width="120px"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)">编辑</el-button>
            <el-button @click="setStatus(scope.row.id)">{{scope.row.status==0?'启用':'禁用'}}</el-button>
            <el-button type="danger" @click="del(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        class="pagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="[1,10,20,30]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
      ></el-pagination>
    </el-card>

    <addQuestion
      ref="addQuestion"
      :subjectData="subjectData"
      :stepObj="stepObj"
      :businessData="businessData"
      :typeObj="typeObj"
      :difficultyObj="difficultyObj"
      :mode="mode"
    ></addQuestion>
  </div>
</template>

<script>
import addQuestion from "./addQuestion.vue";
import { getSubjectData } from "@/api/subject.js";
import { getBusinessData } from "@/api/business.js";
import {
  getQuestionData,
  setQuestionStatus,
  delQuestionData
} from "@/api/question.js";
export default {
  components: {
    addQuestion
  },
  data() {
    return {
      mode: "add",
      form: {
        title: "",
        subject: "",
        enterprise: "",
        type: "",
        step: "",
        username: "",
        status: "",
        difficulty: "",
        create_date: ""
      },
      stepObj: {
        1: "初级",
        2: "中级",
        3: "高级"
      },
      typeObj: {
        1: "单选",
        2: "多选",
        3: "简答"
      },
      difficultyObj: {
        1: "简单",
        2: "一般",
        3: "困难"
      },

      subjectData: [],
      businessData: [],
      tableData: [],
      pagination: {
        currentPage: 1,
        pageSize: 1,
        total: 10
      }
    };
  },

  created() {
    //   获取学科列表
    getSubjectData({ limit: 1000 }).then(res => {
      console.log("学科数据", res);
      this.subjectData = res.data.items;
    });
    // 获取企业数据
    getBusinessData({ limit: 1000 }).then(res => {
      console.log("企业数据", res);
      this.businessData = res.data.items;
    });

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

    // 获取题库列表数据
    getData() {
      let _params = {
        page: this.pagination.currentPage,
        limit: this.pagination.pageSize,
        ...this.form
      };
      getQuestionData(_params).then(res => {
        console.log("题库列表", res);
        this.tableData = res.data.items;
        this.pagination.total = res.data.pagination.total;
        // forEach数组的循环遍历
        /* 
        数组.forEach((item,index)=>{
          它可以循环处理数组内全部数据，能改变源数组，但是它的循环根本停不下来，它没有返回值
        })
         */
        // 接口城市是字符串类型，要转为数组
        // 多选答案也是需要转成数组
        this.tableData.forEach(item => {
          item.city = item.city.split(",");
          item.multiple_select_answer = item.multiple_select_answer.split(",");
        });
      });
    },
    // 搜索
    searchQuestion() {
      this.pagination.currentPage = 1;
      this.getData();
    },
    // 清除
    reset() {
      this.$refs.form.resetFields();
      this.searchQuestion();
    },
    // 状态
    setStatus(id) {
      setQuestionStatus({ id }).then(() => {
        this.$message.success("状态修改成功");
        this.getData();
      });
    },
    // 新增
    addClick() {
      this.mode = "add";
      this.$refs.addQuestion.form = {
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
      };
      this.$refs.addQuestion.dialogFormVisible = true;
    },
    // 删除
    del(id) {
      this.$confirm("此操作将永久删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delQuestionData({ id }).then(() => {
            this.$message.success("删除成功");
            this.searchQuestion();
          });
        })
        .catch(() => {});
    },
    // 编辑
    edit(row) {
      console.log("题库列表整行数据", row);
      this.mode = "edit";
      // 将整行数据传给表单(深拷贝)
      this.$refs.addQuestion.form = JSON.parse(JSON.stringify(row));
      this.$refs.addQuestion.dialogFormVisible = true;
    }
  }
};
</script>

<style lang="less">
.question {
  .card2 {
    margin-top: 30px;
  }

  .pagination {
    text-align: center;
    margin-top: 30px;
  }
}
</style>