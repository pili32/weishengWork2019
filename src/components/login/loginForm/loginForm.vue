<template>
  <div>
    <div class="header_title">
      <div class="header_tabCar" :class="{select:selectIndex==1}">
        <a @click="selectTabCar(1)">
          <i class="iconfont icon-weixin" style="color:#0fcd1f"></i>
          <span>扫码登录</span>
        </a>
      </div>
      <div class="header_tabCar" :class="{select:selectIndex==0}">
        <a @click="selectTabCar(0)">
          <i class="iconfont icon-shouji" style="color:#69bff1"></i>
          <span>短信登录</span>
        </a>
      </div>
    </div>
    <div class="login_form">
      <Form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login_form_phone"
        v-if="selectIndex==0"
      >
        <FormItem prop="user">
          <Input v-model="loginForm.user" placeholder="请输入机构账号" />
        </FormItem>
        <FormItem prop="phone">
          <Input v-model="loginForm.phone" placeholder="请输入手机号码" />
        </FormItem>
        <FormItem prop="code" style="position: relative">
          <Input v-model="loginForm.code" placeholder="请输入验证码" style="width:55%" />
          <Button
            type="primary"
            :loading="isSend"
            :disabled="codedDsabled"
            class="sendCode_btn"
            @click="sendCode"
          >{{codeTxt}}</Button>
        </FormItem>
        <FormItem>
          <Button @click="handleSubmit('loginForm')" type="primary" long>登录</Button>
        </FormItem>
      </Form>
      <Form
        ref="loginWeChatForm"
        :model="loginWeChatForm"
        :rules="loginWeChaRules"
        class="login_form_WeChat"
        v-if="selectIndex==1"
      >
        <FormItem prop="mechanism">
          <Input v-model="loginWeChatForm.mechanism" placeholder="请输入机构账号" />
        </FormItem>
        <Button @click="WeChatSubmit('loginWeChatForm')" type="primary" long>登录</Button>
        <div class="WeChat_hint">
          <h4>登录流程</h4>
          <p>1.输入账号，2.点击登录，3.微信扫码。</p>
        </div>
      </Form>
      <div class="activation_link">
        <router-link :to="{name:'activation'}">
          <i class="iconfont icon-wsmp-register"></i>
          <span>账号激活</span>
        </router-link>
        <a style='display:inline-block;margin-left:30px;font-size:14px;cursor:pointer' @click='goRegister'>
          <i class="iconfont icon-wsmp-register"></i>
          <span>机构注册</span>
        </a>
      </div>
    </div>
    <Modal
      v-model="ModalQRCode"
      title="扫码登录"
      width="300"
      style='position:relative'
      :mask-closable="false"
      @on-visible-change="wechatLoginModalChange"
      footer-hide
    >
      <div class="WeChatCode_box">
        <qriously :value="codeValue" :size="200" :backgroundAlpha="1" class="WeChatCode" />
        <p>打开微信扫描二维码后等待页面跳转</p>
        <Button v-if='codeHidden' @click="getNewCode" type="primary" long>更新二维码</Button>
      </div>
      <div v-if='codeHidden' style="position:absolute;left:0;top:80px;width:60%;margin:0 20%;height:172px;backgroundColor:rgba(0,0,0,0.7);color:white;textAlign:center;lineHeight:172px;fontSize:20px">二维码已失效</div>
    </Modal>
  </div>
</template>
<script>
import { Message } from "iview";
import { urlPath, setAccessToken, dateFormat1 } from "@/libs/util.js";
import {
  wxLogin,
  wxIsLogin,
  weChatLogin,
  getCode,
  smsLogin
} from "@/service/login";
import { setInterval, clearInterval } from "timers";
export default {
  name: "LoginForm",
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [{ required: true, message: "账号不能为空", trigger: "blur" }];
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            type: "string",
            min: 6,
            message: "密码长度不能小于6位",
            trigger: "blur"
          }
        ];
      }
    }
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入手机号"));
      } else {
        if (!/^1[3456789]\d{9}$/.test(this.loginForm.phone)) {
          callback(new Error("手机号码不合法，请重新输入"));
        } else {
          callback();
        }
      }
    };
    const validateMechanism = (rule, value, callback) => {
      var reg = /^((XZ|WS|YX|ST|QY|TT|ZX)([0-9]{6})-([0-9]{3}))|(\d{17}([0-9]|X|x))-([0-9]{2})$/;
      if (value === "") {
        callback(new Error("请输入机构账号"));
      } else {
        if (!reg.test(value)) {
          callback(new Error("输入的机构账号有误！"));
        } else {
          callback();
        }
      }
    };
    return {
      codeValue: "",
      codeHidden:false,
      ModalQRCode: false,
      selectIndex: 1,
      loginForm: {
        //XZ420000-001-01
        user: "",
        phone: "",
        code: ""
      },
      isSend: false,
      codeTxt: "获取验证码",
      codedDsabled: false,
      timer: null,
      loginRules: {
        user: [{ required: true, message: "请输入机构账号", trigger: "blur" }],
        phone: [{ validator: validatePhone, trigger: "blur" }],
        code: [{ required: true, message: "请输入验证码", trigger: "blur" }]
      },
      isSend: false,
      codeTxt: "获取验证码",
      codedDsabled: false,
      timer: null,
      weChatTimer: null,
      loginWeChatForm: {
        mechanism: ""
      },
      loginWeChaRules: {
        mechanism: [{ validator: validateMechanism, trigger: "blur" }]
      }
    };
  },
  destroyed() {
    clearInterval(this.timer);
  },
  methods: {
    selectTabCar(index) {
      this.selectIndex = index;
      this.reSet("loginForm");
      this.reSet("loginWeChatForm");
    },
    reSet(formName) {
      if (this.$refs[formName] != undefined) {
        this.$refs[formName].resetFields();
      }
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let params = {
            username: this.loginForm.user,
            phoneNumber: this.loginForm.phone,
            validCode: this.loginForm.code
          };
          smsLogin(params).then(res => {
            if (res.datas.token) {
              Message.success("登录成功！");
              this.$emit("on-success-valid", res.datas.token);
            } else {
              Message.error(res.msg);
            }
          });
          // this.postRequest(router, params).then(res => {
          //   if (res.data.data == null) {
          //     Message.error(res.data.msg);
          //   } else {
          //     Message.success("登录成功！");
          //     this.$emit("on-success-valid", res.data.data);
          //   }
          // });
        }
      });
    },
    WeChatSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // let params = {
          //   options: "InstitutionUser",
          //   guid: this.loginWeChatForm.mechanism,
          //   callback_url: "https://www.baidu.com"
          // };
          let params = {
            type:0,
            userName: this.loginWeChatForm.mechanism
          };
          wxLogin(params).then(res => {
            if (res.code == 10000) {
              // let url =
              //   "http%3a%2f%2fcenter.hbwsrc.cn%2f%23%2fpages%2flogin%2foauthPlate%3freturn_url%3d";
              let url1 = 'http://center.hbwsrc.cn/m/#/pages/login/oauthPlate?return_url='
              let url = encodeURIComponent(url1)
              let reg = new RegExp("redirectUri", "g")
              this.codeValue = res.datas.redirectUri.replace(reg, url)
              this.ModalQRCode = true;
              //  开启轮询检测
              this.getWeChatAuthUserInfo(res.datas.uuid);
            } else {
              Message.error(res.msg);
            }
          });
          // this.getCommonApiRequest("wechat/auth_url", urlPath(params)).then(
          //   res => {
          //     if (res.data.code == 40000) {
          //       this.codeValue = res.data.data;
          //       this.ModalQRCode = true;
          //       //开启轮询检测
          //       let key = params.options + ":" + params.guid;
          //       this.getWeChatAuthUserInfo(key);
          //     } else {
          //       Message.error(res.data.msg);
          //     }
          //   }
          // );
        }
      });
    },
    getWeChatAuthUserInfo(uuid) {
      this.weChatTimer = setInterval(() => {
        let params = {
          uuid: uuid
        };
        wxIsLogin(params).then(res => {
          if (res.code == 10000) {
            let info = res.datas;
            if (info && info.status == 1) {
              clearInterval(this.weChatTimer);
              // setAccessToken(info.token);
              this.$emit("on-success-valid", res.datas.token);
            }
          } else {
            clearInterval(this.weChatTimer);
            this.codeHidden = true;
          }
        });
      }, 2000);
    },
    getNewCode(){
      this.codeHidden = false;
      this.WeChatSubmit('loginWeChatForm');
    },
    wechatLoginModalChange(data) {
      //关闭弹框时 停止轮询
      if (!data) {
        clearInterval(this.weChatTimer);
      }
    },
    //发送验证码
    sendCode() {
      let phone = this.loginForm.phone;
      let zPhone = /^1[3456789]\d{9}$/;
      if (zPhone.test(phone)) {
        //发送验证码之前校验账号和手机号是否匹配
        // let params = {
        //   userName: this.loginForm.user,
        //   phone: this.loginForm.phone
        // };
        // this.getRequest("ins_account/vaild_phone", urlPath(params)).then(
        //   res => {
        //     if (res.data.code == 40000) {
        //       this.Execute(params.phone);
        //     } else {
        //       Message.error(res.data.msg);
        //     }
        //   }
        // );
        this.Execute(phone);
        //发送验证码
      } else {
        Message.error("手机号码不合法，请重新输入");
      }
    },
    Execute(phone) {
      let time = 60;
      let params = {
        // source: "InstitutionService",
        // operation: "InstitutionPhoneLoginCode",
        phone: phone
      };
      this.codedDsabled = true;
      getCode(params).then(res => {
        this.isSend = false;
        if (res.code == 10000) {
          this.timer = setInterval(() => {
            this.codeTxt = time + "s重新获取";
            if (time == 0) {
              clearInterval(this.timer);
              this.codeTxt = "获取验证码";
              this.codedDsabled = false;
            }
            --time;
          }, 1000);
          Message.success(
            "验证码发送成功，当天剩余获取次数为" + res.datas.surplus + "次！"
          );
        }
      });
      // this.postCommonApiRequest("service/send_phonecode", params).then(res => {
      //   this.isSend = false;
      //   if (res.data.code == 40000) {
      //     this.codedDsabled = true;
      //     this.timer = setInterval(() => {
      //       this.codeTxt = time + "s重新获取";
      //       if (time == 0) {
      //         clearInterval(this.timer);
      //         this.codeTxt = "获取验证码";
      //         this.codedDsabled = false;
      //       }
      //       --time;
      //     }, 1000);
      //     Message.success("验证码发送成功！");
      //   } else {
      //     Message.error(res.data.msg);
      //   }
      // });
    },
    goRegister(){
      // window.location.href = "http://119.96.188.213:8083";
      window.open("http://insreg.hbwsrc.cn","_blank")
    }
  }
};
</script>
