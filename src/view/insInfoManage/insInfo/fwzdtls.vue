
<template>
  <!--  机构信息 -->
  <Row :gutter="25" style="margin-top: 10px;">
    <Col :md="24" :lg="15" style="margin-bottom: 20px;">
      <Form :model="formItemView" ref="formValidate" :label-width="300" :rules="ruleValidate">
        <FormItem label="房屋建筑面积：" prop="fileid1">
          <Input type="number" v-model="formItemView.fileid1" placeholder="请输入房屋建筑面积：" />
        </FormItem>
        <FormItem label="是否为卫生监督机构（一个机构两块牌子）：">
          <RadioGroup v-model="formItemView.fileid2">
            <Radio label="1" value="1">是</Radio>
            <Radio label="0" value="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否取得母婴保健技术服务职业许可证：">
          <RadioGroup v-model="formItemView.fileid3">
            <Radio label="1" value="1">是</Radio>
            <Radio label="0" value="0">否</Radio>
          </RadioGroup>
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
        fileid2: "0",
        fileid3: "0"
      },
      ruleValidate: {
        fileid1: [
          { required: true, message: "请填写房屋建筑面积", trigger: "blur" }
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
      this.userNew = this.objs;

      if (!this.insId) this.insId = this.userNew.insId;
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
    console.log( this.userNew )

    if (!this.insId) this.insId = this.userNew.insId;
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
            fillType: 1
          };
          this.UpData(params);
        } else {
          Message.error("验证错误");
        }
      });
    },
    //添加数据
    UpData(params) {
      editInsInfo(params).then(res => {
        if (res.code == 10000) {
          Message.success("保存成功!");
        } else {
          Message.error(res.msg);
        }
      });
    }
  }
};
</script>