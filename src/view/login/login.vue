<template>
  <div class="login">
    <div class="left"></div>
    <div class="right">
        <img src="@/assets/login_banner_ele.png" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: "login"
};
</script>

<style lang="less">
.login {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100%;
    background:linear-gradient(225deg,rgba(20,147,250,1),rgba(1,198,250,1));
  .left {
    width: 478px;
    height: 550px;
    background: rgba(245, 245, 245, 1);
  }
}
</style>