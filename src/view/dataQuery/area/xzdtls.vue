<template>
  <Form :model="obj" v-if="obj" :label-width="200">
    <div class="content">
      <Row>
        <Col span="24">
          <FormItem label="单位名称:">{{obj.ins_name}}</FormItem>
        </Col>
        <Col span="24">
          <FormItem label="机构类别:">{{obj.ins_category_value}}</FormItem>
        </Col>
        <Col span="24">
          <FormItem label="主管单位:">{{obj.ins_prant_value}}</FormItem>
        </Col>
        <Col span="24">
          <FormItem label="行政隶属:">{{obj.ins_organ_lvevl_value}}</FormItem>
        </Col>
        <Col span="24">
          <FormItem label="电话区号:">{{obj.fileid1}}</FormItem>
        </Col>
        <Col span="24">
          <FormItem label="办公电话:">{{obj.fileid2}}</FormItem>
        </Col>
        <Col span="24">
          <FormItem label="办公传真:">{{obj.fileid3}}</FormItem>
        </Col>
        <Col span="24">
          <FormItem label="辖区面积:">{{obj.fileid4}} 平方公里</FormItem>
        </Col>
        <Col span="24">
          <FormItem label="辖区常住人口数:">{{obj.fileid5}} 万人</FormItem>
        </Col>
      </Row>
    </div>
  </Form>
</template>
<style scoped>
.content {
  margin-left: -20px;
}
</style>
<script>
import {
  getAccessToken,
  urlPath,
  getUserInfo,
  validateSequence
} from "@/libs/util";
import { Message } from "iview";
export default {
  props: ["obj"],
  data() {
    return {
      insId: "",
      ins_name: "",
      ins_prant_value: "",
      ins_category_value: "",
      ins_organ_lvevl_value: "",
      formItemIns: {},
      ruleValidate: {
        fileid4: [
          { required: true, message: "辖区面积不能为空！", trigger: "blur" }
        ]
      },
      userNew: null
    };
  },
  methods: {
  }
};
</script>