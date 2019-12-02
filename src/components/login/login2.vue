<template>
  <div class="login2">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <LoginForm @on-success-valid="handleSubmit"></LoginForm>
        </div>
      </Card>
    </div>
    <Loading v-if="spinShow"></Loading>
  </div>
</template>
<style lang="less">
.login2 {
  width: 100%;
  height: 100%;
  background-image: url("./../../assets/image/bj-jg.jpg");
  background-size: cover;
  background-position: center;
  position: relative;
  .login-con {
    position: absolute;
    right: 160px;
    top: 50%;
    transform: translateY(-60%);
    width: 300px;
    &-header {
      font-size: 16px;
      font-weight: 300;
      text-align: center;
      padding: 30px 0;
    }
    .form-con {
      padding: 10px 0 0;
    }
    .login-tip {
      font-size: 10px;
      text-align: center;
      color: #c3c3c3;
    }
  }
}
</style>
<script>
import {
  removeAccessToken,
  removeUserInfo,
  removeUserAccess
} from "@/libs/util";
import LoginForm from "./loginForm/loginForm2";
import { mapActions } from "vuex";
import Loading from "@/components/base/loading";
export default {
  data() {
    return {
      spinShow: false
    };
  },
  components: {
    LoginForm,
    Loading
  },
  created() {
    removeAccessToken();
    removeUserInfo();
    removeUserAccess();
  },
  methods: {
    ...mapActions(["handleLogin", "getUserInfo"]),
    handleSubmit({ userName, password }) {
      this.spinShow = true;
      this.handleLogin({ userName, password }).then(data => {
        this.spinShow = false
        if (data == "error") {
          return
        } else {
          this.$router.push({
            name: "home"
          })
        }
        // if (data == "error") {
        //   this.spinShow = false;
        //   return;
        // }
        // this.getUserInfo().then(res => {
        //   this.spinShow = false;
        //   if (res) {
        //     this.$router.push({
        //       name: "home"
        //     });
        //   }
        // });
      });
    }
  }
};
</script>
