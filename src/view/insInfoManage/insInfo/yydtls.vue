<template>
  <Form :model="formItemIns" ref="formItemIns" :label-width="230" :rules="ruleValidate">
    <Row :gutter="25">
      <Col :md="12" :lg="10">
        <FormItem label="医院级别：" prop="fileid1">
          <Select v-model="formItemIns.fileid1" @on-change="insLevelChange" label-in-value>
            <Option v-for="item in insLevel" :value="item.code" :key="item.name">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="编制床位数：" prop="fileid5">
          <Input type="number" v-model="formItemIns.fileid5" placeholder="请输入编制床位数" />
        </FormItem>
      </Col>
      <Col :md="12" :lg="10">
        <FormItem label="医院等次：" prop="fileid3">
          <Select v-model="formItemIns.fileid3" @on-change="insGradeChange" label-in-value>
            <Option v-for="item in insGrade" :value="item.code" :key="item.name">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="实有床位数：" prop="fileid6">
          <Input type="number" v-model="formItemIns.fileid6" placeholder="请输入实有床位数" />
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="25">
      <Col :md="24" :lg="10">
        <FormItem label="是否120急救网络覆盖医院：" prop="fileid7">
          <RadioGroup v-model="formItemIns.fileid7">
            <Radio label="1" value="1">是</Radio>
            <Radio label="0" value="0">否</Radio>
          </RadioGroup>
        </FormItem>
      </Col>
    </Row>
    <Row :gutter="25">
      <Col :md="6" :lg="6">
        <FormItem label="本单位设置急救中心/急救站情况：" prop="fileid8">
          <RadioGroup v-model="formItemIns.fileid8" @on-change="radioChange">
            <Radio label="1" value="1">设有</Radio>
            <Radio label="0" value="0">未设</Radio>
          </RadioGroup>
        </FormItem>
      </Col>
      <Col :md="5" :lg="3" v-show="fileShow" style="padding-right:5px">
        <Select v-model="formItemIns.firstVal01">
          <Option value="急救中心">急救中心</Option>
          <Option value="急救站">急救站</Option>
        </Select>
      </Col>
      <Col :md="5" :lg="3" v-show="fileShow" style="padding-right:5px">
        <Select v-model="formItemIns.firstVal02">
          <Option value="与急诊科一体">与急诊科一体</Option>
          <Option value="独立科室">独立科室</Option>
        </Select>
      </Col>
      <Col :md="5" :lg="3" v-show="fileShow" style="padding-right:5px">
        <Select v-model="formItemIns.firstVal03">
          <Option value="独立核算">独立核算</Option>
          <Option value="统一管理">统一管理</Option>
        </Select>
      </Col>
      <Col :md="4" :lg="4" v-show="fileShow" style="padding-right:5px">
        <FormItem label="急救床位数：" :label-width="100">
          <Input type="number" v-model="formItemIns.fileid10" placeholder="急救床位数" />
        </FormItem>
      </Col>
    </Row>
    <FormItem>
      <Row style="margin-top: 10px;">
        <Col :md="24" :lg="14" style="text-align:center;">
          <Button type="primary" @click="handleSubmit('formItemIns')">保存</Button>
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
      fileShow: true,
      formItemIns: {},
      ruleValidate: {
        fileid1: [
          { required: true, message: "医院级别不能为空！", trigger: "change" }
        ],
        fileid3: [
          { required: true, message: "医院等次不能为空！", trigger: "change" }
        ],
        fileid5: [
          { required: true, message: "编制床位数不能为空！", trigger: "blur" }
        ],
        fileid6: [
          { required: true, message: "实有床位数不能为空！", trigger: "blur" }
        ],
        fileid7: [
          {
            required: true,
            message: "是否120急救网络覆盖医院！",
            trigger: "change"
          }
        ],
        fileid8: [
          {
            required: true,
            message: "本单位设置急救中心/急救站情况必选！",
            trigger: "change"
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
      this.userNew = this.objs;

      if (!this.insId) this.insId = this.userNew.insId;
      let params = {
        insId: this.insId
      };
      queryInsInfo(params).then(res => {
        if (res.code == 10000) {
          this.formItemIns = res.datas;
          this.formItemIns.fileid1 = res.datas.fileid1;
          this.formItemIns.fileid3 = res.datas.fileid3;
          this.formItemIns.fileid5 = res.datas.fileid5;
          this.formItemIns.fileid6 = res.datas.fileid6;
          let formItemIns = res.datas.fileid9.split(",");
          this.formItemIns.firstVal01 = formItemIns[0];
          this.formItemIns.firstVal02 = formItemIns[1];
          this.formItemIns.firstVal03 = formItemIns[2];
          this.formItemIns.fileid8 = res.datas.fileid8;

          }
        
      });
    }
  },
  created() {
    // let userNew = getUserInfo();
    this.userNew = this.objs;
    console.log( this.userNew )

    insInfoOption().then(res => {
      if (res.code == 10000) {
        this.insLevel = res.datas.hospitalLevel;
        this.insGrade = res.datas.hospitalGrade;
      }
    });
    if (!this.insId) this.insId = this.userNew.insId;
    let params = {
      insId: this.insId
    };
    queryInsInfo(params).then(res => {
      if (res.code == 10000) {
        this.formItemIns = res.datas;
        this.formItemIns.fileid1 = res.datas.fileid1;
        this.formItemIns.fileid3 = res.datas.fileid3;
        this.formItemIns.fileid5 = res.datas.fileid5;
        this.formItemIns.fileid6 = res.datas.fileid6;
  
        this.formItemIns.fileid8 = res.datas.fileid8;
           if (res.datas.fileid8 == "1"){
             this.fileShow = true;
          let formItemIns = res.datas.fileid9.split(",");
        this.formItemIns.firstVal01 = formItemIns[0];
        this.formItemIns.firstVal02 = formItemIns[1];
        this.formItemIns.firstVal03 = formItemIns[2];
           } else{
            this.fileShow = false;
           }

        
      }
    });
    // this.getMainFrom("ins_ext");
    // this.getDetaItemInsLevel("InstitutionLevel");
    // this.getDetaItemInsGrade("InstitutionGrade");
  },
  methods: {
    // getMainFrom(url){
    //     this.getRequest(url,urlPath({ins_id:this.insId})).then((res)=>{
    //         if(res.data.data){
    //             this.formItemIns=res.data.data;
    //             if(!this.formItemIns.fileid7) this.formItemIns.fileid7="0";
    //             if(!this.formItemIns.fileid8) this.formItemIns.fileid8="1";
    //             if(!this.formItemIns.fileid1) this.formItemIns.fileid1="";
    //             if(!this.formItemIns.fileid3) this.formItemIns.fileid3="";
    //             if(this.formItemIns.fileid8=="1"){ //this.formItemIns.fileid9 &&
    //                 if(this.formItemIns.fileid9){
    //                     let array=res.data.data.fileid9.split(',');
    //                     this.formItemIns.firstVal01=array[0];
    //                     this.formItemIns.firstVal02=array[1];
    //                     this.formItemIns.firstVal03=array[2];
    //                 }
    //             }else{
    //                 this.fileShow=false;
    //             }
    //         }
    //     });
    // },
    // getDetaItemInsLevel(code){
    //     this.getDictionaries(code).then((res)=>{
    //         if(res.data.code==40000){
    //            this.insLevel=dataItemHandle(res);
    //         }
    //     });
    // },
    // getDetaItemInsGrade(code){
    //      this.getDictionaries(code).then((res)=>{
    //         if(res.data.code==40000){
    //            this.insGrade=dataItemHandle(res);
    //         }
    //     });
    // },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let firstDetails = "";
          if (this.formItemIns.fileid8 == "1") {
            if (
              !this.formItemIns.firstVal01 ||
              !this.formItemIns.firstVal02 ||
              !this.formItemIns.firstVal03 ||
              !this.formItemIns.fileid10
            ) {
              Message.error("设有急救站时，急救站情况必选！");
              return false;
            }
            firstDetails =
              this.formItemIns.firstVal01 +
              "," +
              this.formItemIns.firstVal02 +
              "," +
              this.formItemIns.firstVal03;
          }
        
          for(var i=0;i<this.insLevel.length;i++){
            if( this.formItemIns.fileid1 ==this.insLevel[i].code ){
              this.formItemIns.fileid2 = this.insLevel[i].name
            }
          }
           for(var i=0;i<this.insGrade.length;i++){
            if( this.formItemIns.fileid3 ==this.insGrade[i].code ){
             this.formItemIns.fileid4 = this.insGrade[i].name
            }
          }
          if(this.fileShow==false){
            this.formItemIns.fileid10==''
          }
          let params = {
            insId: this.insId,
            fileid1: this.formItemIns.fileid1,
            fileid2: this.formItemIns.fileid2,
            fileid3: this.formItemIns.fileid3,
            fileid4: this.formItemIns.fileid4,
            fileid5: this.formItemIns.fileid5,
            fileid6: this.formItemIns.fileid6,
            fileid7: this.formItemIns.fileid7,
            fileid8: this.formItemIns.fileid8,
            fileid9: firstDetails,
            fileid10: this.formItemIns.fileid10,
            fillType: 2
          };
           if(this.fileShow==false){
            params.fileid10==''
          }
          this.UpData(params);
        } else {
          Message.error("验证错误");
        }
      });
    },
    //更新数据
    UpData(params) {
      editInsInfo(params).then(res => {
        if (res.code == 10000) {
          Message.success("保存成功!");
        } else {
          Message.error(res.data.msg);
        }
      });
    },
    radioChange(res) {
      if (res == "1") this.fileShow = true;
      else this.fileShow = false;
    },
    insLevelChange(res) {
      this.formItemIns.fileid2 = res.label;
      this.formItemIns.fileid1 = res.value;
    },
    insGradeChange(res) {
      this.formItemIns.fileid4 = res.label;
      this.formItemIns.fileid3 = res.value;
    }
  }
};
</script>