<template>
  <el-dialog :visible.sync="dialogFormVisible" class="addBusiness" width="600px">
      <div slot="title" class="title">{{mode=='add'?'新增企业':'编辑企业'}}</div>
      <el-form :model="form" :rules="rules" label-width="100px" ref="form">
          <el-form-item label="企业编号" prop="eid">
              <el-input v-model="form.eid"></el-input>
          </el-form-item>
          <el-form-item label="企业名称" prop="name">
              <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item label="企业简称" prop="short_name">
              <el-input v-model="form.short_name"></el-input>
          </el-form-item>
          <el-form-item label="企业简介" prop="intro">
              <el-input v-model="form.intro"></el-input>
          </el-form-item>
          <el-form-item label="企业备注" prop="remark">
              <el-input v-model="form.remark"></el-input>
          </el-form-item>
      </el-form>
    <div slot="footer" class="footer">
      <el-button @click="dialogFormVisible = false">取消</el-button>
      <el-button type="primary" @click="submitClick">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import {addBusinessData,editBusinessData} from '@/api/business.js'
export default {
    props:{
        mode:{
            type:String,
            default:'add',   //默认
        }
    },
  data() {
    return {
      dialogFormVisible: false,   //是否弹窗
      form:{
          eid:'',     //企业编号
          name:'',    //企业名称
          short_name:'',   //企业简称
          intro:'',       //企业简介
          remark:'',     //备注
      },
    //   规则
    rules:{
        eid:[
            {required:true,message:'请填写企业编号',trigger:'change'},
        ],
        name:[
            {required:true,message:'请填写企业名称',trigger:'change'},
        ],
        short_name:[
            {required:true,message:'请填写企业简称',trigger:'change'},
        ],
        intro:[
            {required:true,message:'请填写企业简介',trigger:'change'},
        ],
    }
    };
  },

  methods: {
    //   全局验证
      submitClick(){
          this.$refs.form.validate(result=>{
              if(result){
                //   验证成功
                // 调用接口
                if(this.mode == 'add'){
                    addBusinessData(this.form).then(()=>{
                    this.$message.success('新增成功');
                    this.dialogFormVisible = false;
                    this.$parent.searchBusiness();
                })
                }else{
                    editBusinessData(this.form).then(()=>{
                        this.$message.success('编辑成功');
                        this.dialogFormVisible = false;
                        this.$parent.searchBusiness();
                    })
                }
                
              }
          })
      }
  },

  watch: {
      'dialogFormVisible'(newValue){
          if(newValue == false){
              this.$refs.form.resetFields();
          }
      },

      'mode'(){
          this.$nextTick(()=>{
            //   清除验证
              this.$refs.form.clearValidate();
          })
      }
  },
};
</script>

<style lang="less">
.addBusiness{
    .el-dialog__header{
        padding: 0;
    }
    .title{
        height:53px;
        line-height:53px;
        text-align: center;
        background:linear-gradient(to right,#02c4f9,#1396fb);
        color: #fff;
    }
    .el-icon-close{
        color: #fff;
    }
    .footer{
        text-align: center;
    }
}
</style>