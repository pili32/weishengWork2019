<template>
  <div class="activation">
    <div class="activation-con">
      <div class="activation-box">
        <div class="activation_log">
          <img src="./../../assets/image/logo-jg.png">
        </div>
        <div class="activation_left"></div>
        <div class="activation_right">
          <div class="header_title">
            <div class="header_tabCar">
              <a>
                <i class="iconfont icon-jihuo"></i>
                <span>账号激活</span>
                <!-- <Button @click="ceshi1" type="primary">-</Button>
                <Button @click="ceshi" type="primary">+</Button> -->
              </a>
            </div>
          </div>
          <div class="activation_step">
            <Steps :current="index">
              <Step title="输入账号"></Step>
              <Step title="完善信息"></Step>
              <Step title="扫码关注"></Step>
              <Step title="绑定微信"></Step>
              <Step title="绑定手机号"></Step>
            </Steps>
          </div>
          <div class="step_Cont">
            <Form
              ref="activationForm"
              :model="activeObj"
              :rules="activationRules"
              class="activation_form"
              v-show="index==0"
              style="margin-top:40px;"
            >
              <FormItem prop="user_name">
                <Input v-model="activeObj.user_name" placeholder="请输入机构账号"/>
              </FormItem>
              <FormItem prop="active_code">
                <Input v-model="activeObj.active_code" placeholder="请输入激活码"/>
              </FormItem>
              <FormItem>
                <Button
                  @click="activationSubmit('activationForm')"
                  type="primary"
                  long
                  style="margin-bottom:10px;"
                >确定激活</Button>
                <Button type="primary" long @click="goBack">返回登录</Button>
              </FormItem>
            </Form>
            <Form
              ref="NewForm"
              :model="activeObj"
              :rules="NewRules"
              class="activation_form"
              v-show="index==1"
            >
              <FormItem prop="real_name">
                <Input v-model="activeObj.real_name" placeholder="请输入姓名"/>
              </FormItem>
              <FormItem prop="department">
                <Input v-model="activeObj.department" placeholder="请输入所在部门"/>
              </FormItem>
              <FormItem prop="office_phone">
                <Input v-model="activeObj.office_phone" placeholder="请输入办公电话"/>
              </FormItem>
              <FormItem prop="email_address">
                <Input v-model="activeObj.email_address" placeholder="请输入邮箱"/>
              </FormItem>
              <FormItem prop="job">
                <Input v-model="activeObj.job" placeholder="请输入职务"/>
              </FormItem>
              <FormItem>
                <Button @click="index = 0;" type="primary" style='width:45%;float:left'>上一步</Button>
                <Button @click="NewSubmit('NewForm')" type="primary" style='width:45%;float:right'>下一步</Button>
              </FormItem>
            </Form>
            <Form class="activation_form" v-show="index==2">
              <div>
                <img src="./../../assets/image/follow.jpg" class="WeChatCode">
              </div>
              <div class="WeChatCode_info">
                <span>请打开微信扫码关注公众号</span>
              </div>
              <FormItem>
                <Button @click="index = 1;" type="primary" style='width:45%;float:left'>上一步</Button>
                <Button @click="WeChatSubmit" type="primary" style='width:45%;float:right'>下一步</Button>
                <!-- <Button @click="goBindPhone" type="primary" style='width:45%;float:right'>下一步</Button> -->
              </FormItem>
            </Form>
            <Form class="activation_form" v-show="index==3">
              <div>
                <qriously :value="codeValue" :size="200" :backgroundAlpha="1" class="WeChatCode"/>
              </div>
              <div class="WeChatCode_info">
                <span>请打开微信扫码绑定帐号</span>
              </div>
              <FormItem>
                <Button @click="index = 2;" type="primary" style='width:45%;float:left'>上一步</Button>
                <Button @click="WeChatbinding" type="primary" style='width:45%;float:right'>下一步</Button>
              </FormItem>
            </Form>
            <Form
              class="activation_form"
              :model="activeObj"
              :rules="completeRules"
              ref="completeForm"
              v-show="index==4"
              style="margin-top:40px;"
            >
              <FormItem prop="phone_number">
                <Input v-model="activeObj.phone_number" placeholder="请输入手机号码"/>
              </FormItem>
              <FormItem prop="phone_code" style="position: relative">
                <Input v-model="activeObj.phone_code" placeholder="请输入验证码" style="width:57%"/>
                <Button
                  type="primary"
                  :loading="isSend"
                  :disabled="codedDsabled"
                  class="sendCode_btn"
                  @click="sendCode"
                >{{codeTxt}}</Button>
              </FormItem>
              <FormItem>
                <!-- <Button @click="index = 2;" type="primary" long>上一步</Button> -->
                <Button @click="completeActivation('completeForm')" type="primary" long>绑定手机</Button>
                <!-- <Button @click="gobackLogin" type="primary" long>返回登录</Button> -->
              </FormItem>
            </Form>
          </div>
        </div>
      </div>
    </div>
    <Loading v-show="isLoading"/>
  </div>
</template>
<style lang="less">
.ivu-form-item{
  margin-bottom:20px;
}
.activation {
  width: 100%;
  height: 100%;
  background-image: url("./../../assets/image/bj-jg.jpg");
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  .activation-con {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateY(-41%);
    width: 750px;
    height: 490px;
    margin-left: -375px;
    background: #ffffff;
    .activation-box {
      width: 100%;
      height: 100%;
      position: relative;
      .activation_log {
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
    .activation_left {
      float: left;
      height: 100%;
      width: 50%;
      background-image: url("./../../assets/image/bj2-jg.jpg");
      background-size: cover;
      background-position: center;
    }
    .activation_right {
      float: left;
      height: 100%;
      width: 50%;
      .header_title {
        display: flex;
        height: 55px;
        .header_tabCar {
          flex: 1;
          height: 55px;
          line-height: 55px;
          border-bottom: 1px solid #eeeeee;
          text-indent: 15px;
          a {
            color: #333333;
            .iconfont {
              font-size: 22px;
            }
            span {
              font-size: 13px;
              font-weight: 600;
            }
          }
        }
      }
      .activation_step {
        margin: 15px 0;
        padding: 0 10px;
        box-sizing: border-box;
        .ivu-steps .ivu-steps-tail {
          left: 15px;
        }
        .ivu-steps-item {
          text-align: center;
        }
        .ivu-steps .ivu-steps-title {
          font-size: 10px;
          margin-top: 7px;
        }
      }
      .step_Cont {
        .activation_form {
          padding: 0 25px;
          box-sizing: border-box;
          .sendCode_btn {
            position: absolute;
            right: 0;
            top: 0;
            width: 40%;
            padding: 5px 10px 6px;
          }
        }
        .WeChatCode {
          display: block;
          width: 200px;
          height: 200px;
          margin: 0 auto;
        }
        .WeChatCode_info {
          text-align: center;
          padding: 15px 0;
          span {
            padding: 0 25px;
            height: 30px;
            background: #f2f2f2;
            color: #333333;
            border-radius: 20px;
            display: inline-block;
            line-height: 32px;
          }
        }
      }
    }
  }
}
</style>
<script>
import { Message } from "iview";
import { urlPath , setAccessToken , changeURLArg , removeAccessToken} from "@/libs/util.js";
import Loading from "@/components/base/loading";
import { bindPhone , getCode , bindWeChat ,acCode , messageAdd ,wxLogin ,wxIsLogin} from '@/service/login';
export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      let zPhone = /^(13|14|15|16|17|18|19)\d{9}$/;
      if (value === "") {
        callback(new Error("请输入手机号！"));
      } else {
        if (!zPhone.test(value)) {
          callback(new Error("请输入正确的手机号！"));
        } else {
          callback();
        }
      }
    };
    const validateUser = (rule, value, callback) => {
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
    const validateEmail = (rule, value, callback) => {
      var pattern = /^([A-Za-z0-9_\-\.])+\@(163.com|vip.163.com|qq.com|42du.cn|sina.com|189.cn|sina.cn)$/;
      if (value === "") {
        callback(new Error("请输入邮箱"));
      } else {
        if (!pattern.test(value)) {
          callback(new Error("输入的邮箱有误！"));
        } else {
          callback();
        }
      }
    };
    return {
      codeValue: "",
      isLoading: false,
      index: 0,
      uid: "",
      activationRules: {
        user_name: [{ validator: validateUser, trigger: "blur" }],
        active_code: [
          { required: true, message: "请输入激活码", trigger: "blur" }
        ]
      },
      activeObj: {
        user_name: "",
        active_code: "",
        real_name: "",
        office_phone: "",
        department: "",
        job: "",
        email_address: "",
        phone_number: "",
        phone_code: "",
        auth_type: "WeChat",
        open_id: "",
        open_token: "",
        union_id: "",
        nick_name: "",
        sex: 0,
        province: "",
        city: "",
        country: ""
      },
      NewRules: {
        real_name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        department: [
          { required: true, message: "请输入部门", trigger: "blur" }
        ],
        office_phone: [
          { required: true, message: "请输入办公电话", trigger: "blur" }
        ],
        email_address: [{ validator: validateEmail, trigger: "blur" }],
        job: [{ required: true, message: "请输入相关职务", trigger: "blur" }]
      },
      completeRules: {
        phone_number: [{ validator: validatePhone, trigger: "blur" }],
        phone_code: [
          { required: true, message: "请输入验证码", trigger: "blur" }
        ]
      },
      isSend: false,
      codeTxt: "获取验证码",
      codedDsabled: false,
      timer: null,
      id:'',
      uuid:''
    };
  },
  components: {
    Loading
  },
  methods: {
    //输入账号流程--确认激活
    activationSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.isLoading = true;
          let params = {
            activeCode:this.activeObj.active_code,
            userName:this.activeObj.user_name
          };
          acCode(params).then(res=>{
            this.isLoading = false;
            if(res.datas){
              setAccessToken(res.datas.token);
              this.id = res.datas.userId;
              this.index = 1;
            }
          })
        }
      });
    },
    //返回登录
    goBack() {
      this.$router.push({
        name: "login"
      });
    },
    //完善信息下一步
    NewSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let params = {
            realName:this.activeObj.real_name,
            department:this.activeObj.department,
            officePhone:this.activeObj.office_phone,
            email:this.activeObj.email_address,
            job:this.activeObj.job,
            id:this.id
          };
          messageAdd(params).then(res=>{
            if(res.datas == 1){
              this.index = 2;
            }
          })
        }
      });
    },
    nextStep(){
      this.index = 3;
    },
    //扫码关注下一步
    WeChatSubmit() {
      this.index = 3;
      this.isLoading = true;
      let params = {
        type:1,
        userName:this.activeObj.user_name
      };
      wxLogin(params).then(res=>{
        this.isLoading = false;
        if(res.code == 10000) {
          let url1 = 'http://center.hbwsrc.cn/m/#/pages/login/oauthPlateInit?return_url='
          // let url = 'http%3a%2f%2fcenter.hbwsrc.cn%2f%23%2fpages%2flogin%2foauthPlateInit%3freturn_url%3d';
          let url = encodeURIComponent(url1)
          let reg = new RegExp('redirectUri','g')
          let newUrl = (res.datas.redirectUri).replace(reg,url)
          this.codeValue =changeURLArg(newUrl,'state',this.activeObj.user_name)
        }
      })
    },
    //微信扫码绑定下一步
    WeChatbinding() {
      this.index = 4;
    },
    //最终完成激活确认按钮
    completeActivation(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let params = {
            phoneNumber:this.activeObj.phone_number,
            validCode:this.activeObj.phone_code
          };
          bindPhone(params).then(res=>{
            if(res.datas == 1){
              // this.WeChatSubmit();
              Message.success("绑定成功！返回登录页面！");
              removeAccessToken();
              this.$router.push({
                name: "login"
              });
            }
          })
        }
      });
    },
    gobackLogin(){
      this.$router.push({
        name: "login"
      });
    },
    //发送验证码
    sendCode() {
      let phone = this.activeObj.phone_number;
      let zPhone = /^(13|14|15|16|17|18|19)\d{9}$/;
      let time = 60;
      if (!zPhone.test(phone)) {
        Message.error("请输入正确的手机号！");
        return;
      }
      let params = {
        phone:phone
      }
      this.isSend = true;
      this.codedDsabled = true;
      getCode(params).then(res=>{
        this.isSend = false;
        if(res.code == 10000 ){
          this.timer = setInterval(() => {
            this.codeTxt = time + "s重新获取";
            if (time == 0) {
              clearInterval(this.timer);
              this.codeTxt = "获取验证码";
              this.codedDsabled = false;
            }
            --time;
          }, 1000);
          Message.success('验证码发送成功，当天剩余获取次数为' + res.datas.surplus +'次！');
        } else {
          this.codedDsabled = false;
        }
      }).catch(()=>{
        this.isSend = false;
        this.codedDsabled = false;
      })
    },
    ceshi(){
      if(this.index == 3) {
        this.index = 0 ;
      } else {
        this.index ++ ;
      }
    },
    ceshi1(){
      if(this.index == 0){
        this.index = 3;
      } else {
        this.index --;
      }
    },
    goBindPhone(){
      this.index = 3;
    }
  }
};
</script>


