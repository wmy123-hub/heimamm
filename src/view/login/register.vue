<template>
    <el-dialog :visible.sync="dialogFormVisible" class="register" width="600px" :show-close="false">
        <!-- 弹窗（对话框） -->
        <!-- slot重写title标题 -->
        <div slot="title" class="title">用户注册</div>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            dialogFormVisible:false
        }
    },
}
</script>

<style lang="less">
.register{
    .title{
        height:53px;
        line-height:53px;
        text-align: center;
        background-color: #1299f8;
        color:#fff;
    }
    .el-dialog__header{
        padding:0;
    }
}
</style>