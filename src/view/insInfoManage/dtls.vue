<template>
  <Row :gutter="25" style="margin-top: 10px;">
    <Col :md="24" :lg="10" style="margin-bottom: 20px;">
      <Form :model="formTbale" ref="formValidate" :label-width="80" :rules="ruleValidate">
        <FormItem label="类别" prop="category">
          <Select v-model="formTbale.category">
            <Option value="0">别名</Option>
            <Option value="1">曾用名</Option>
          </Select>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model="formTbale.name" />
        </FormItem>
        <FormItem label="年度" prop="year">
          <DatePicker type="year" placeholder="Select year" v-model="formTbale.year" />
        </FormItem>
        <FormItem label="评论" prop="remark">
          <Input
            v-model="formTbale.remark"
            type="textarea"
            :autosize="{minRows: 2,maxRows: 5}"
            placeholder="remark"
          />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
          <Button @click="handleReset('formValidate')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Col>
    <Col :md="24" :lg="14" style="margin-bottom: 20px;">1515115</Col>
  </Row>
</template>
<script>
import { getAccessToken, urlPath } from "@/libs/util";
import { Message } from "iview";
export default {
  data() {
    return {
      formTbale: {
        category: "",
        name: "",
        year: "",
        remark: ""
      },
      ruleValidate: {
        category: [
          {
            required: true,
            message: "Please select the city",
            trigger: "change"
          }
        ],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        year: [
          {
            required: true,
            type: "date",
            message: "请选择年份",
            trigger: "change"
          }
        ],
        remark: [{ required: true, message: "请输入评论", trigger: "blur" }]
      }
    };
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          Message.success("Success!");
          let token = getAccessToken();
          let timeYear = new Date(this.formTbale.year);
          let params = {
            category: parseInt(this.formTbale.category),
            name: this.formTbale.name,
            last_use_year: timeYear.getFullYear(),
            order_index: 0,
            remark: this.formTbale.remark
          };
          this.AddData("ins_names", token, params);
        } else {
          Message.error("验证错误");
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    //添加数据
    AddData(url, token, param) {
      this.postRequest(url + "?" + token, param).then(res => {});
    }
  }
};
</script>

