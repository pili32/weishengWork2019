<template>
  <Form :model="formItemIns" ref="formItemIns" :label-width="200" :rules="ruleValidate">
    <div>
      <div class="border_line" style="margin-bottom:20px;">
        <span class="border_line_txt">一. 主体信息</span>
        <Row :gutter="25">
          <Col :md="12" :lg="10">
            <FormItem label="单位名称：" style="padding-top:25px">
              <span>{{ins_name}}</span>
            </FormItem>
            <FormItem label="机构类别：">
              <span>{{ins_category_value}}</span>
            </FormItem>
            <!-- <FormItem label="是否民族自治地区：">
                            <span></span>
            </FormItem>-->
          </Col>
          <Col :md="12" :lg="10">
            <FormItem label="主管单位：" style="padding-top:25px">
              <span>{{ins_prant_value}}</span>
            </FormItem>
            <FormItem label="行政隶属：">
              <span>{{ins_organ_lvevl_value}}</span>
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="border_line">
        <span class="border_line_txt">二. 基本信息</span>
        <Row :gutter="25" style="margin-top: 10px;">
          <Col :md="24" :lg="13" style="padding-top:10px">
            <FormItem label="电话区号：">
              <Input type="number" v-model="formItemIns.areaCode" placeholder="请输入电话区号" />
            </FormItem>
            <FormItem label="办公电话：" prop="fileid2">
              <Input type="tel" v-model="formItemIns.officePhone" placeholder="请输入办公电话" />
            </FormItem>
            <FormItem label="办公传真：" prop="fileid3">
              <Input type="tel" v-model="formItemIns.officeFax" placeholder="请输入办公传真" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col :md="23" :lg="12">
            <FormItem label="辖区面积：" prop="area">
              <Input number :maxlength="10" v-model="formItemIns.area" placeholder="请输入辖区面积" />
            </FormItem>
          </Col>
          <Col :md="2">
            <p class="unit">平方公里</p>
          </Col>
        </Row>
        <Row>
          <Col :md="23" :lg="12">
            <FormItem label="辖区常住人口数：">
              <Input type="number" v-model="formItemIns.population" placeholder="请输入辖区常住人口数" />
            </FormItem>
          </Col>
          <Col :md="2">
            <p class="unit">万人</p>
          </Col>
        </Row>
      </div>
    </div>
    <FormItem>
      <Row style="margin-top: 10px;">
        <Col :md="24" :lg="14" style="text-align:center;">
          <Button type="primary" @click="handleSubmit('formItemIns')">保存</Button>
        </Col>
      </Row>
    </FormItem>
  </Form>
</template>
<style scoped>
.border_line {
  width: 100%;
  border: 1px solid #dddddd;
  position: relative;
  margin-top: 10px;
}
.border_line_txt {
  position: absolute;
  left: 10px;
  top: -12px;
  height: 25px;
  line-height: 25px;
  padding: 0 7px;
  background: #f5f7f9;
  font-size: 12px;
  color: #000000;
}
.btnhandleAdd {
  width: 100px;
  font-size: 14px;
  color: #464c5b;
}
.unit {
  margin-top: 8px;
  margin-left: 10px;
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
import {
  administrationMessage,
  administrationMessageChange
} from "@/service/xzjgAdmin";
export default {
  data() {
    const validatenumber = (rule, value, callback) => {
      if (value && !/0\d{2,4}(-|[0-9])[0-9]+$/.test(value)) {
        return callback(new Error("请正确输入电话"));
      } else {
        callback();
      }
    };
    const isEmpty = (rule, value, callback) => {
      if (value == null || value == undefined || value == "") {
        callback(new Error("辖区面积不能为空！"));
      } else {
        callback();
      }
    };
    return {
      insId: this.$route.params.id,
      ins_name: "",
      ins_prant_value: "",
      ins_category_value: "",
      ins_organ_lvevl_value: "",
      formItemIns: {},
      ruleValidate: {
        area: [
          {
            required: true,
            message: "辖区面积不能为空！",
            trigger: "blur",
            validator: isEmpty
          }
        ]
        // fileid2:[
        //     { required:true,message: '办公电话输入有误', trigger:'blur', validator: validatenumber}
        // ],
        // fileid3:[
        //      { required:true,message: '办公传真输入有误', trigger:'blur', validator: validatenumber}
        // ]
      },
      userNew: null
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
      if (!this.insId) {
        this.insId = this.userNew.insId;
      }
      this.getMessage();
    }
  },
  created() {
    // let userNew = getUserInfo();
    this.userNew = this.objs;
    if (!this.insId) {
      this.insId = this.userNew.insId;
    }
    this.getMessage();
  },
  methods: {
    getMessage() {
      let params = {
        insMainId: this.insId
      };
      administrationMessage(params).then(res => {
        if (res.code == 10000) {
          this.ins_name = res.datas.admDepartmentRespDto.departmentName;
          this.ins_prant_value = res.datas.admDepartmentRespDto.leader;
          this.ins_category_value = res.datas.admDepartmentRespDto.organType;
          this.ins_organ_lvevl_value = res.datas.admDepartmentRespDto.admType;
          this.formItemIns = res.datas.admBasicRespDto;
        } else {
          Message.error(res.msg);
        }
      });
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let params = {
            insMainId: this.insId,
            areaCode: this.formItemIns.areaCode,
            officePhone: this.formItemIns.officePhone,
            officeFax: this.formItemIns.officeFax,
            area: this.formItemIns.area,
            population: this.formItemIns.population
          };
          this.UpData(params);
        } else {
          Message.error("信息验证失败!");
        }
      });
    },
    UpData(params) {
      administrationMessageChange(params).then(res => {
        if (res.code == 10000) {
          Message.success("保存成功！");
          this.getMessage();
        }
      });
    }
  }
};
</script>