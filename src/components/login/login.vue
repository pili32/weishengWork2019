<template>
  <div class="login">
    <div class="login-con">
      <div class="login-box">
        <div class="login_log">
          <img src="./../../assets/image/logo-jg.png">
        </div>
        <div class="login_left"></div>
        <div class="login_right">
          <LoginForm @on-success-valid="handleSubmit"></LoginForm>
        </div>
      </div>
    </div>
    <Spin fix v-if="spinShow"></Spin>
  </div>
</template>
<style lang="less">
.login {
  width: 100%;
  height: 100%;
  background-image: url("./../../assets/image/bj-jg.jpg");
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  .login-con {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateY(-40%);
    width: 650px;
    height: 400px;
    margin-left: -325px;
    background: #ffffff;
    .login-box {
      width: 100%;
      height: 100%;
      position: relative;
      .login_log {
        position: absolute;
        left: 0;
        top: -130px;
        width: 100%;
        img {
          display: block;
          width: 100%;
          margin: 0 auto;
        }
      }
    }
    .login_left {
      float: left;
      height: 100%;
      width: 50%;
      background-image: url("./../../assets/image/bj2-jg.jpg");
      background-size: cover;
      background-position: center;
    }
    .login_right {
      float: left;
      height: 100%;
      width: 50%;
    }
    .header_title {
      display: flex;
      height: 55px;
      .header_tabCar {
        flex: 1;
        height: 55px;
        text-align: center;
        line-height: 55px;
        border-bottom: 1px solid #eeeeee;
        a {
          color: #bbbbbb;
          .iconfont {
            font-size: 22px;
          }
          span {
            font-size: 13px;
            font-weight: 600;
          }
        }
      }
      .header_tabCar.select {
        border-bottom: 2px solid #4596c2;
        box-sizing: border-box;
      }
      .header_tabCar.select a {
        color: #4596c2;
      }
    }
    .login_form {
      height: 345px;
      position: relative;
      .activation_link {
        position: absolute;
        left: 0;
        bottom: 10px;
        width: 100%;
        height: 30px;
        text-align: center;
        line-height: 30px;
        font-size: 14px;
        a {
          color: #333333;
          .iconfont {
            font-size: 18px;
          }
        }
      }
      .login_form_phone {
        position: absolute;
        left: 0;
        top: 40px;
        width: 100%;
        padding: 0 40px;
        box-sizing: border-box;
        .sendCode_btn {
          position: absolute;
          right: 0;
          top: 0;
          width: 42%;
          padding: 5px 10px 6px;
        }
      }
      .login_form_WeChat {
        position: absolute;
        left: 0;
        top: 30px;
        width: 100%;
        padding: 0 40px;
        box-sizing: border-box;
        .WeChat_hint {
          margin-top: 45px;
          h4 {
            text-align: center;
            margin-bottom: 10px;
            color: #57a3f3;
          }
          p {
            text-align: center;
          }
        }
      }
    }
  }
}
.WeChatCode_box {
  margin-bottom: 10px;
  .WeChatCode {
    display: block;
    width: 200px;
    height: 200px;
    margin: 0 auto;
  }
  p {
    text-align: center;
    font-size: 12px;
    color: #333333;
    padding: 10px 0;
  }
}
</style>
<script>
import {
  removeAccessToken,
  removeUserInfo,
  removeUserAccess,
  setAccessToken,
  dateFormat1,
  getUserInfo
} from "@/libs/util";
import LoginForm from "./loginForm/loginForm";
import { mapActions } from "vuex";
import { getLoginMessage } from "@/service/login"
import md5 from 'js-md5'
export default {
  data() {
    return {
      spinShow: false
    };
  },
  components: {
    LoginForm
  },
  created() {
    removeAccessToken();
    removeUserInfo();
    removeUserAccess();
  },
  methods: {
    ...mapActions(["handleLogin", "getUserInfo"]),
    handleSubmit(token) {
      this.spinShow = true;
      this.$store.commit("setAccessToken", token);
      setAccessToken(token);
      if(this.$route.query.return_url != undefined) {
        getLoginMessage().then(res1=>{
          if(res1.datas.id2){
            let url = this.$route.query.return_url;
            let data = new Date();
            let timestamp = dateFormat1(data);
            let extid = res1.datas.id2;
            let user_type = 2;
            let hash = md5(`${extid}${user_type}${timestamp}`);
            let newUrl = `${url}?extid=${extid}&user_type=${user_type}&timestamp=${timestamp}&hash=${hash}`;
            if(newUrl.indexOf('http') > -1){
                window.open(newUrl,'_blank')
            } else{
                window.open("http://" + newUrl,'_blank')
            }
          }
        })
      } else {
        this.$router.push({
          name: "home"
        })
      }
      // this.getUserInfo().then(res => {
      //   if (res) {
      //     this.spinShow = false;
      //     if(this.$route.query.return_url != undefined) {
      //       getLoginMessage().then(res1=>{
      //         if(res1.datas.id2){
      //           let url = this.$route.query.return_url;
      //           let data = new Date();
      //           let timestamp = dateFormat1(data);
      //           let extid = res1.datas.id2;
      //           let user_type = 2;
      //           let hash = md5(`${extid}${user_type}${timestamp}`);
      //           let newUrl = `${url}?extid=${extid}&user_type=${user_type}&timestamp=${timestamp}&hash=${hash}`;
      //           if(newUrl.indexOf('http') > -1){
      //               window.open(newUrl,'_blank')
      //           } else{
      //               window.open("http://" + newUrl,'_blank')
      //           }
      //         }
      //       })
      //     } else {
      //       this.$router.push({
      //         name: "home"
      //       });
      //     }
      //   }
      // });
    }
  }
};
</script>
