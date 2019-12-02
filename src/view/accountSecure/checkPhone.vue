<template>
  <div>
    <Form :label-width="80" ref="formDtlsValidate" :model="phoneObj" :rules="phoneRuleValidate">
      <FormItem label="新手机号" prop="new_phoneNumber">
        <Input v-model="phoneObj.new_phoneNumber" placeholder="请输入新手机号" style="width:95%" />
      </FormItem>
      <FormItem label="验证码" prop="phone_code">
        <Input v-model="phoneObj.phone_code" placeholder="请输入验证码" style="width:70%" />&nbsp;&nbsp;&nbsp;
        <Button
          type="primary"
          :loading="isSend"
          :disabled="codedDsabled"
          class="sendCode_btn"
          @click="sendCode"
        >{{codeTxt}}</Button>
      </FormItem>
      <FormItem>
        <Button size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="CheckPhone('formDtlsValidate')">更换</Button>
      </FormItem>
    </Form>
  </div>
</template>
<style>
</style>
<script>
import { repalcePhone, smsCode } from "@/service/insSubManage";
import store from "@/store/index";
import { getAccessToken, urlPath, getUserInfo, setUserInfo } from "@/libs/util";
import { Modal, Message } from "iview";
export default {
  props: ["obj"],
  data() {
    return {
      codeValue: "",
      isLoading: false,
      phoneNumber_show: null,
      phoneObj: {},
      phoneRuleValidate: {
        new_phoneNumber: [
          { required: true, message: "请输入新手机号", trigger: "blur" }
        ],
        phone_code: [
          { required: true, message: "请输入短信验证码", trigger: "blur" }
        ]
      },
      isSend: false,
      codeTxt: "获取验证码",
      codedDsabled: false,
      timer: null
    };
  },
  methods: {
    //取消回调事件
    cancel() {
      this.$refs["formDtlsValidate"].resetFields();
      this.$emit("cancel"); //向父组件传值
    },
    VaildPrams() {
      let newphone = this.phoneObj.new_phoneNumber;
      let zPhone = /^(13|14|15|16|17|18|19)\d{9}$/;
      if (!zPhone.test(newphone)) {
        Message.error("请输入正确的手机号！");
        return false;
      }

      return true;
    },
    //发送验证码
    sendCode() {
      this.codedDsabled = true;
      if (!this.VaildPrams()) return;
      let params = {
        source: "InstitutionService",
        phone: this.phoneObj.new_phoneNumber,
        operation: "InstitutionUserReplacePhoneCode"
      };
      let time = 60;
      smsCode(params).then(res => {
        this.isSend = false;
        if (res.code == 10000) {
          this.codedDsabled = true;
          this.timer = setInterval(() => {
            this.codeTxt = time + "s重新获取";
            if (time*1 == 0) {
              clearInterval(this.timer);
              this.codeTxt = "获取验证码";
              this.codedDsabled = false;
            }
            --time;
          }, 1000);
          Message.success("验证码发送成功！");
        } else {
          Message.error(res.data.msg);
        }
      });
    },
    CheckPhone(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.VaildPrams()) return;
          let params = {
            userId: this.obj.userId,
            oldPhone: this.obj.phoneNumber,
            newPhone: this.phoneObj.new_phoneNumber,
            validCode: this.phoneObj.phone_code
          };
          repalcePhone(params).then(res => {
            this.isLoading = false;
            if (res.code == 10000) {
              Message.success("手机号更换成功")
              this.phoneObj.new_phoneNumber =""
              this.phoneObj.phone_code =''

              this.$emit("success"); //向父组件传值
              
            } else {
              Message.error(res.data.msg);
            }
          });
        }
      });
    }
  }
};
</script>

