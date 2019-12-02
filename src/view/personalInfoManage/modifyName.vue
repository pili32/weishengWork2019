<template>
  <div>
    <Form
      :model="obj"
      v-if="obj"
      :label-width="80"
      ref="formModifyNameValidate"
      :rules="ruleModifyNameValidate"
    >
      <FormItem label="原姓名">{{obj.name}}</FormItem>
      <FormItem label="性别">{{obj.gender == 1 ? '男':'女' }}</FormItem>
      <FormItem label="证件号码">{{obj.idcardNo}}</FormItem>
      <FormItem label="修改姓名" prop="new_name">
        <Input v-model="obj.new_name" placeholder="请输入修改后姓名"/>
      </FormItem>
      <FormItem>
        <Button size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="submit('formModifyNameValidate')">确定</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import {updateName} from '@/service/unitPersonalManagement'
import { getAccessToken, urlPath } from "@/libs/util";
import { Modal, Message } from "iview";
export default {
  props: ["obj"],
  data() {
    return {
      ComeOutMode: null,
      ruleModifyNameValidate: {
        new_name: [
          { required: true, message: "请输入修改后姓名", trigger: "blur" }
        ]
      }
    };
  },
  created() {},
  mounted() {},
  methods: {
    //取消回调事件
    cancel() {
      this.$refs["formModifyNameValidate"].resetFields();
      this.$emit("cancel"); //向父组件传值
    },
    //提交回调事件
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            coreId: this.obj.coreId,
            hrId: this.obj.hrId,
            ins_id: this.obj.ins_id,
            name: this.obj.new_name
          };
        updateName(params).then(res=>{
            var data = res
       this.$emit("success", data); //向父组件传值

        })
      
          // this.postPersonalApiRequest("online/updateNameById", params).then(
          //   res => {
          //     var data = res.data;
          //     this.$emit("success", data); //向父组件传值
          //   }
          // );
        }
      });
    }
  }
};
</script>

