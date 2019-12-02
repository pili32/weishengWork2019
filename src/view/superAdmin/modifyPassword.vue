<template>
  <div>
    <Form :model="obj" v-if="obj" ref="formDtlsValidate" :rules="ruleValidate" :label-width="90">
      <FormItem label="用户名：" prop="admName">
        <p>{{obj.realName}}</p>
      </FormItem>
      <FormItem label="输入密码*：" prop="password">
        <Input type="password" v-model="obj.password" />
      </FormItem>
      <FormItem label="确认密码*：" prop="password_again">
        <Input type="password" v-model="obj.password_again" />
      </FormItem>
      <FormItem>
        <Button size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="submit('formDtlsValidate')">确定</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import { resetPsd } from "@/service/insAccountManage";
import store from "@/store/index";
import { getAccessToken, urlPath } from "@/libs/util";
import { Modal, Message } from "iview";
export default {
  props: ["obj"],
  data() {
    return {
      ruleValidate: {
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        password_again: [
          { required: true, message: "请输入确认密码", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    //取消回调事件
    cancel() {
      this.$refs["formDtlsValidate"].resetFields();
      this.$emit("cancel");
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.obj.password && this.obj.password_again !== "") {
            if (this.obj.password == this.obj.password_again) {
              let params = {
                id: this.obj.insAccountId,
                password: this.obj.password
                // password_again: this.obj.password_again
              };
              resetPsd(params).then(res => {
                if (res.code == 10000) {
                  var data = res.data;
                  Message.success("修改成功");
                  this.editModalShow = false;
                  this.$emit("success", data);
                } else {
                  Message.error(res.data.msg);
                }
              });
            } else {
              alert("两次输入密码不一致");
            }
          } else {
            alert("请输入密码");
          }
        }
      });
    }
  }
};
</script>

