<template>
  <div>
    <Tabs>
      <TabPane label="安全手机" name="tabPhone">
        <Form :label-width="80" :model="phoneObj" ref="formDtlsValidate" :rules="phoneRuleValidate">
          <FormItem label="新手机号" prop="phone_number">
            <Input v-model="phoneObj.phone_number" placeholder="请输入新手机号" style="width:95%" />
          </FormItem>
          <FormItem label="验证码" prop="phone_code">
            <Input v-model="phoneObj.phone_code" placeholder="请输入验证码" style="width:70%" />&nbsp;&nbsp;&nbsp;
            <Button
              type="primary"
              :loading="isSend"
              :disabled="codedDsabled"
              class="sendCode_btn"
              @click="sendCode('formDtlsValidate')"
            >{{codeTxt}}</Button>
          </FormItem>
          <FormItem>
            <Button size="large" @click="cancel">取消</Button>
            <Button type="primary" size="large" @click="CheckPhone('formDtlsValidate')">更换</Button>
          </FormItem>
        </Form>
      </TabPane>
      <TabPane label="微信关联" name="tabWeChat">
        <Form :label-width="80">
          <!-- <FormItem label="姓名" prop="id_number">
            <label>{{curUserInfo.realName}}</label>
          </FormItem> -->
          <FormItem label="微信二维码" prop="id_number">
            <div>
              <qriously :value="codeValue" :size="200" :backgroundAlpha="1" class="WeChatCode" />
            </div>
            <span style="color:red">更换绑定微信成功后需要重新登录获取最新的个人信息</span>
          </FormItem>
          <FormItem>
            <Button size="large" @click="cancel" style='margin-right:20px'>取消</Button>
            <Button type="primary" size="large" @click="WeChatbinding()">重新登录</Button>
          </FormItem>
        </Form>
      </TabPane>
    </Tabs>
  </div>
</template>
<style>
</style>
<script>
import store from "@/store/index";
import {
  getAccessToken,
  urlPath,
  getUserInfo,
  setUserInfo,
  changeURLArg,
  removeAccessToken
} from "@/libs/util";
import { Modal, Message } from "iview";
import {
  changePhoneNumber,
  getCode,
  wxLogin,
  wxIsLogin,
  changeBindPhone
} from "@/service/login";
import { clearInterval } from "timers";
import { searchPhone, replacePhone } from "@/service/replacePhone";
export default {
  props: ["obj"],
  data() {
    return {
      codeValue: "",
      isLoading: false,
      curUserInfo: null,
      phone_number_show: null,
      phoneObj: {},
      phoneRuleValidate: {
        phone_number: [
          { required: true, message: "请输入新手机号", trigger: "blur" }
        ],
        phone_code: [
          { required: true, message: "请输入短信验证码", trigger: "blur" }
        ]
      },
      isSend: false,
      codeTxt: "获取验证码",
      codedDsabled: false,
      timer: null,
      phone: null,
      uuid: ""
    };
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  computed:{
    objs(){
      return this.$store.state.user.userInfo
    }
  },
  watch:{
    objs(){
      this.curUserInfo = this.objs
      this.LoadWeChat()
    }
  },
  created() {
    // let userNew = getUserInfo();
    this.curUserInfo = this.objs;
    // this.LoadWeChat()
  },
  methods: {
    //取消回调事件
    cancel() {
      this.$refs["formDtlsValidate"].resetFields();
      this.$emit("cancel"); //向父组件传值
    },
    VaildPrams() {
      let newphone = this.phoneObj.phone_number;
      let zPhone = /^(13|14|15|16|17|18|19)\d{9}$/;
      let time = 60;
      if (!zPhone.test(newphone)) {
        Message.error("请输入正确的手机号！");
        return false;
      }
      return true;
    },
    //发送验证码
    sendCode(formName) {
      // this.$refs[formName].validate(valid => {
      // if (valid) {
      // if (!this.VaildPrams()) return;
      // let params = {
      //   source: "InstitutionService",
      //   phone: this.phoneObj.phone_number,
      //   operation: "InstitutionUserReplacePhoneCode"
      // };
      if (this.phoneObj.phone_number) {
        let params = {
          phone: this.phoneObj.phone_number
        };
        this.isSend = true;
        this.codedDsabled = true;
        getCode(params).then(res => {
          this.isSend = false;
          if (res.code == 10000) {
            let time = 60;
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
          } else {
            this.codedDsabled = false;
          }
        }).catch(()=>{
          this.isSend = false;
          this.codedDsabled = false;
        })
      } else {
        Message.error("请先输入新手机号！");
      }
    },
    CheckPhone(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.VaildPrams()) return;
          // let params = {
          //   newPhoneNumber:this.phoneObj.phone_number,
          //   originPhoneNumber:this.phoneObj.old_phone_number,
          //   identiCode:this.phoneObj.phone_code,
          // }
          // replacePhone(params).then(res=>{
          //   this.isLoading = false;
          //   if(res.datas){
          //     Message.success("更换成功！");
          //     //更新cookie里的用户对象，然后重新保存
          //     this.curUserInfo.phoneNumber = params.newPhoneNumber;
          //     setUserInfo(this.curUserInfo);
          //   }
          // })
          let params = {
            newPhone: this.phoneObj.phone_number,
            userId: this.curUserInfo.id,
            validCode: this.phoneObj.phone_code
          };
          changeBindPhone(params).then(res => {
            this.isLoading = false;
            if (res.datas == 1) {
              Message.success("更换成功！");
              this.curUserInfo.phoneNumber = params.newPhone;
              setUserInfo(this.curUserInfo);
            }
          });
        }
      });
    },
    LoadWeChat() {
      this.isLoading = true;
      let params = {
        userName: this.curUserInfo.username
      };
      wxLogin(params).then(res => {
        if (res.code == 10000) {
          this.isLoading = false;
          // let url =
          //   "http%3a%2f%2fcenter.hbwsrc.cn%2f%23%2fpages%2flogin%2foauthPlateBind%3freturn_url%3d";
          let url1 = 'http://center.hbwsrc.cn/m/#/pages/login/oauthPlateBind?return_url='
          let url = encodeURIComponent(url1)
          let reg = new RegExp("redirectUri", "g");
          let newUrl = res.datas.redirectUri.replace(reg, url);
          this.codeValue = changeURLArg(newUrl, "state", this.curUserInfo.id);
          console.log(this.codeValue)
          // this.uuid = res.datas.uuid;
        } else {
          Message.error(res.msg);
        }
      });
    },
    //获取微信绑定结果
    WeChatbinding() {
      removeAccessToken()
      this.$router.push({
        name: "login"
      });
    },
    //更新微信绑定
    UpdateWeChatBind(info) {
      this.getCommonApiRequest("wechat/Post", urlPath(info)).then(res => {
        if (res.date.date.code == "40000") {
          message.success("绑定成功！");
        } else {
          message.error("绑定失败，请联系系统管理员！");
        }
      });
    }
  }
};
</script>

