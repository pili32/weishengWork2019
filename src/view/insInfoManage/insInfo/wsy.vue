<template>
  <Form :model="formItemIns" ref="formDtlsValidate" :label-width="230" :rules="ruleValidate">
    <Row :gutter="25">
      <Col :md="12" :lg="10">
        <FormItem label="医院级别：" prop="fileid1">
          <Select v-model="formItemIns.fileid1" label-in-value>
            <Option v-for="item in insLevel" :value="item.code" :key="item.name">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="编制床位数：" prop="fileid5">
          <Input v-model="formItemIns.fileid5" placeholder="请输入编制床位数" />
        </FormItem>
      </Col>
      <Col :md="12" :lg="10">
        <FormItem label="医院等次：" prop="fileid3">
          <Select v-model="formItemIns.fileid3" @on-change="insGradeChange" label-in-value>
            <Option v-for="item in insGrade" :value="item.code" :key="item.name">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="实有床位数：" prop="fileid6">
          <Input v-model="formItemIns.fileid6" placeholder="请输入实有床位数"  />
        </FormItem>
      </Col>
    </Row>
    <FormItem>
      <Row style="margin-top: 10px;">
        <Col :md="24" :lg="14" style="text-align:center;">
          <Button type="primary" @click="handleSubmit('formDtlsValidate')">保存</Button>
        </Col>
      </Row>
    </FormItem>
  </Form>
</template>
<script>
import {
  editInsInfo,
  insInfoOption,
  queryInsInfo
} from "@/service/insSubManageDtl";
import {
  getAccessToken,
  urlPath,
  dataItemHandle,
  getUserInfo
} from "@/libs/util";
import { Message } from "iview";
export default {
  data() {
    return {
      insId: this.$route.params.id,
      insLevel: [],
      insGrade: [],
      formItemIns: {
        fileid1:null,
        fileid5:null,
        fileid3:null,
        fileid6:null
      },
      ruleValidate: {
        fileid1: [
          {
            required: true,
            message: "医院级别不能为空！",
            trigger: "change"
          }
        ],
        fileid3: [
          {
            required: true,
            message: "医院等次不能为空！",
            trigger: "change"
          }
        ],
        fileid5: [
          {
            required: true,
            message: "编制床位数不能为空！",
            trigger: "blur"
          }
        ],
        fileid6: [
          {
            required: true,
            message: "实有床位数不能为空！",
            trigger: "blur",
          }
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
      if (!this.insId) this.insId = this.objs.insId;
      let params = {
        insId: this.insId
      };
      queryInsInfo(params).then(res => {
        this.formItemIns.fileid1 = res.datas.fileid1 ? res.datas.fileid1:null
        this.formItemIns.fileid3 = res.datas.fileid3 ? res.datas.fileid3:null
        this.formItemIns.fileid5 = res.datas.fileid5 ? res.datas.fileid5:null
        this.formItemIns.fileid6 = res.datas.fileid6 ? res.datas.fileid6:null
      });
    }
  },
  created() {
    // this.userNew = getUserInfo();
    if (!this.insId) this.insId = this.objs.insId;
    insInfoOption().then(res => {
      if (res.code == 10000) {
        this.insLevel = res.datas.hospitalLevel;
        this.insGrade = res.datas.hospitalGrade;
      }
    });
    let params = {
      insId: this.insId
    };
    queryInsInfo(params).then(res => {
      this.formItemIns.fileid1 = res.datas.fileid1 ? res.datas.fileid1:null
      this.formItemIns.fileid3 = res.datas.fileid3 ? res.datas.fileid3:null
      this.formItemIns.fileid5 = res.datas.fileid5 ? res.datas.fileid5:null
      this.formItemIns.fileid6 = res.datas.fileid6 ? res.datas.fileid6:null
    });
  },
  methods: {
    getDetaItemInsLevel(code) {
      this.getDictionaries(code).then(res => {
        if (res.data.code == 40000) {
          this.insLevel = dataItemHandle(res);
        }
      });
   },
    handleSubmit(name) {
          this.$refs[name].validate(valid => {
            if (valid) {
              for(var i=0;i< this.insLevel.length;i++){
                if( this.formItemIns.fileid1 ==  this.insLevel[i].code)
                      this.formItemIns.fileid2 = this.insLevel[i].name
              }
                    for(var i=0;i< this.insGrade.length;i++){
                if( this.formItemIns.fileid3 ==  this.insGrade[i].code)
                      this.formItemIns.fileid4 = this.insGrade[i].name
              }
              this.formItemIns.fillType = 2
              this.formItemIns.insId = this.insId
              // let params = {
              //   insId: this.insId,
              //   fileid1: this.formItemIns.fileid1,
              //   fileid2: this.formItemIns.fileid2,
              //   fileid3: this.formItemIns.fileid3,
              //   fileid4: this.formItemIns.fileid4,
              //   fileid5: this.formItemIns.fileid5,
              //   fileid6: this.formItemIns.fileid6,
              //   fillType: 2
              // };
              this.UpData(this.formItemIns);
            } else {
              Message.error("验证错误");
            }
          });
        },
 UpData(params) {
      editInsInfo(params).then(res => {
        if (res.code == 10000) {
          Message.success("保存成功!");
        } else {
          Message.error(res.data.msg);
        }
      });
    },
    insLevelChange(res) {
      this.formItemIns.fileid2 = res.label;
    },
    insGradeChange(res) {
      this.formItemIns.fileid4 = res.label;
    }
  }
};
</script>