<template>
  <div>
    <Form :model="obj" v-if="obj" ref="formDtlsValidate" :rules="ruleValidate" :label-width="85">
      <FormItem label="管理员姓名" prop="realName">
        <Input v-model="obj.realName" />
      </FormItem>
      <FormItem label="单位/部门" prop="categoryValue">
        <Input v-model="obj.categoryValue" />
      </FormItem>
      <FormItem label="职务" prop="job">
        <Input v-model="obj.job" />
      </FormItem>
      <FormItem label="办公电话" prop="officePhone">
        <Input v-model="obj.officePhone" />
      </FormItem>
      <FormItem label="邮箱" prop="emailAddress">
        <Input v-model="obj.emailAddress" />
      </FormItem>
      <FormItem>
        <Button size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="submit('formDtlsValidate')">确定</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import store from "@/store/index";
import { setUserInfo } from "@/libs/util";
import { Modal, Message } from "iview";
import { messageAdd } from "@/service/login";
export default {
  props: ["obj"],
  data() {
    return {
      ruleValidate: {
        realName: [
          { required: true, message: "请输入管理员姓名", trigger: "change" }
        ],
        categoryValue: [
          { required: true, message: "请输入单位/部门", trigger: "change" }
        ],
        job: [{ required: true, message: "请输入职务", trigger: "change" }],
        officePhone: [
          { required: true, message: "请输入办公电话", trigger: "change" }
        ],
        emailAddress: [
          { required: true, message: "请输入邮箱", trigger: "change" }
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
             var pattern = /^([A-Za-z0-9_\-\.])+\@(163.com|vip.163.com|qq.com|42du.cn|sina.com|189.cn|sina.cn)$/;
             let email = false;  
              if (pattern.test(this.obj.emailAddress)) { email = true; }
              if(email==true){

                let params = {
                  realName: this.obj.realName,
                  department: this.obj.categoryValue,
                  officePhone: this.obj.officePhone,
                  email: this.obj.emailAddress,
                  job: this.obj.job,
                  id: this.obj.id
                };
                messageAdd(params).then(res => {
                  if (res.datas == 1) {
                    this.$emit("success", res.datas); //向父组件传值
                    setUserInfo(this.obj);
                  }
                });
              }else{
                Message.error("请输入正确的手机号")
              }
          // this.putRequest("ins_user", params).then(res => {
          //   var data = res.data;
          //   this.$emit("success", data); //向父组件传值
          //   setUserInfo(this.obj);
          // });
        }else{
          Message.error("验证错误");

        }
      });
    }
  }
};
</script>

