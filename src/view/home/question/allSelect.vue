<template>
  <!-- 单选 -->
  <div class="allSelect">
      <!-- 单选 -->
    <div v-if="form.type==1">
      <div v-for="(item, index) in form.select_options" :key="index" class="items">
        <el-radio v-model="form.single_select_answer" :label="item.label" @change="selectChange">{{item.label}}</el-radio>
        <el-input v-model="item.text"></el-input>
        <div>
          <uploadFile v-model="item.image"></uploadFile>
        </div>
      </div>
    </div>
      <!-- 多选 -->
    <div v-else-if="form.type==2">
      <div v-for="(item, index) in form.select_options" :key="index" class="items">
        <el-checkbox v-model="form.multiple_select_answer" :label="item.label" @change="selectChange">{{item.label}}</el-checkbox>
        <el-input v-model="item.text"></el-input>
        <div>
          <uploadFile v-model="item.image"></uploadFile>
        </div>
      </div>
    </div>
    <!-- 简答 -->
    <div v-else>
        <el-input type="textarea" v-model="form.short_answer" rows="8" @change="selectChange"></el-input>
    </div>
  </div>
</template>

<script>
import uploadFile from "./uploadFile.vue";
export default {
  components: {
    uploadFile
  },
  props: ["form"],
  methods: {
    selectChange(){
      // 选中选项时触发父组件change验证事件
      this.$emit('change');
    }
  }
};
</script>

<style lang="less">
.allSelect {
  .items {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-input {
    padding-right: 20px;
  }
}
</style>