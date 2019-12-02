<template>
  <Form :model="obj" v-if="obj" :label-width="200">
    <div class="border_line">
      <Row :gutter="25">
        <Col :md="12" :lg="10">
          <FormItem label="机构名称:">{{obj.name}}</FormItem>
          <FormItem label="主管单位:">{{obj.pname}}</FormItem>
        </Col>
        <Col :md="12" :lg="10">
          <FormItem label="机构类别:">{{obj.categoryValue}}</FormItem>
          <FormItem label="行政隶属:">{{obj.organLayerValue}}</FormItem>
        </Col>
        <Col :md="12" :lg="10">
        <FormItem label="统一社会信用代码:">{{obj.fileid1}}</FormItem>
        <FormItem label="医疗机构执业许可证:">{{obj.fileid2}}</FormItem>
        </Col>
        <Col :md="12" :lg="10">
        <FormItem label="成立年份:">{{obj.create_year}}</FormItem>
        <FormItem label="法人代表（负责人）:">{{obj.legal_person}}</FormItem>
        </Col>
        <Col :md="12" :lg="10">
        <FormItem label="主办单位类别:">{{obj.host_unit_category_value}}</FormItem>
        <FormItem label="网站域名:">{{obj.domain_name}}</FormItem>
        </Col>
        <Col :md="12" :lg="10">
        <FormItem label="单位行政级别:">{{obj.organ_lvevl_value}}</FormItem>
        <FormItem label="总编制数:">{{obj.organ_count}}</FormItem>
        </Col>
        <Col :md="12" :lg="10">
        <FormItem label="单位事业性质:">{{obj.properties_value}}</FormItem>
        <FormItem label="邮编:">{{obj.zip_code}}</FormItem>        
        </Col>
        <Col :md="12" :lg="10">
        <FormItem label="地址:">{{obj.address}}</FormItem>
        <FormItem label="地理位置:">{{obj.baidu_address}}</FormItem>
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
  methods: {}
};
</script>