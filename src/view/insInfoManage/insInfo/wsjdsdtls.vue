<template>
  <Row :gutter="25" style="margin-top: 10px;">
    <Col :md="24" :lg="15" style="margin-bottom: 20px;">
      <Form :model="formItemView" ref="formValidate" :label-width="180" :rules="ruleValidate">
        <FormItem label="下设派出机构数：" prop="fileid1">
          <Input type="number" v-model="formItemView.fileid1" placeholder="请输入下设派出机构数" />
        </FormItem>
        <FormItem label="机构性质：">
          <Select v-model="formItemView.fileid2">
            <Option value="按照公务员管理">按照公务员管理</Option>
            <Option value="参照公务员管理">参照公务员管理</Option>
            <Option value="事业单位">事业单位</Option>
          </Select>
        </FormItem>
        <FormItem label="是否独立核算单位：">
          <RadioGroup v-model="formItemView.fileid3">
            <Radio label="1" value="1">是</Radio>
            <Radio label="0" value="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="非独立核算挂靠单位">
          <Select v-model="formItemView.fileid4">
            <Option value="卫生局">卫生局</Option>
            <Option value="疾病预防控制中心">疾病预防控制中心</Option>
            <Option value="其他">其他</Option>
          </Select>
        </FormItem>
        <FormItem style="text-align:center;">
          <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
        </FormItem>
      </Form>
    </Col>
  </Row>
</template>
<script>
import {
  editInsInfo,
  insInfoOption,
  queryInsInfo
} from "@/service/insSubManageDtl";
import { getAccessToken, urlPath, getUserInfo } from "@/libs/util";
import { Message } from "iview";
export default {
  data() {
    return {
      insId: this.$route.params.id,
      formItemView: {
        fileid1: "",
        fileid2: "",
        fileid3: "0",
        fileid4: ""
      },
      ruleValidate: {
        fileid1: [
          { required: true, message: "请填写下设派出机构数", trigger: "blur" }
        ]
      }
    };
  },
  computed:{
    objs(){
      return this.$store.state.user.userInfo
    }
  },
  watch:{
    objs(){
      if (!this.insId) this.insId = this.userNew.insId;
      // this.getMainFrom("ins_ext");
      let params = {
        insId: this.insId
      };
      queryInsInfo(params).then(res => {
        if (res.code == 10000) {
          this.formItemView = res.datas;
          this.formItemView.fileid2 = res.datas.fileid2;
          this.formItemView.fileid3 = res.datas.fileid3;
        }
      });
    }
  },
  created() {
    // let userNew = getUserInfo();
    this.userNew = this.objs;
    if (!this.insId) this.insId = this.userNew.insId;
    // this.getMainFrom("ins_ext");
    let params = {
      insId: this.insId
    };
    queryInsInfo(params).then(res => {
      if (res.code == 10000) {
        this.formItemView = res.datas;
        this.formItemView.fileid2 = res.datas.fileid2;
        this.formItemView.fileid3 = res.datas.fileid3;
      }
    });
  },
  methods: {
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let params = {
            insId: this.insId,
            fileid1: this.formItemView.fileid1,
            fileid2: this.formItemView.fileid2,
            fileid3: this.formItemView.fileid3,
            fileid4: this.formItemView.fileid4,
            fillType: 2
          };
          this.UpData(params);
        } else {
          Message.error("验证错误");
        }
      });
    },
    //添加数据
    UpData(param) {
      editInsInfo(param).then(res => {
        if (res.code == 10000) {
          Message.success("保存成功!");
        } else {
          Message.error(res.data.msg);
        }
      });
    }
  }
};
</script>