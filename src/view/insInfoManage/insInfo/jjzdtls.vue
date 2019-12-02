<template>
  <Form ref="formItemIns" :model="formItemIns" :label-width="240" :rules="ruleValidate">
    <div>
      <Row :gutter="25">
        <Col :md="12" :lg="10">
          <FormItem label="是否独立法人：">
            <RadioGroup v-model="formItemIns.fileid1">
              <Radio label="1" value="1">是</Radio>
              <Radio label="0" value="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="非独立法人挂靠单位名称：">
            <Input type="text" v-model="formItemIns.fileid3" placeholder="请输入名称" />
          </FormItem>
        </Col>
        <Col :md="12" :lg="10">
          <FormItem label="是否独立核算：">
            <RadioGroup v-model="formItemIns.fileid2">
              <Radio label="1" value="1">是</Radio>
              <Radio label="0" value="0">否</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="与医院关系：">
            <!-- <Select v-model="formItemIns.fileid4">
                            <Option value="与急诊科一体">与急诊科一体</Option>
                            <Option value="独立科室">独立科室</Option>
            </Select>-->
            <Select v-model="formItemIns.fileid4">
              <Option
                v-for="item in RelationshipBetweenHospital"
                :value="item.itemvalue1"
                :key="item.itemvalue1"
              >{{ item.name }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row :gutter="25">
        <Col :md="24" :lg="10">
          <!-- <FormItem label="急救床位：" prop="fileid5">
                        <Input type="number" v-model="formItemIns.fileid5" placeholder="请输入急救床位"/>
          </FormItem>-->
          <FormItem label="急救床位：" prop="fileid5">
            <Input v-model="formItemIns.fileid5" placeholder="请输入急救床位" />
          </FormItem>
        </Col>
      </Row>
      <div class="border_line">
        <span class="border_line_txt">急救网络情况</span>
        <Row :gutter="25" style="margin-top: 10px;">
          <Col :md="24" :lg="20">
            <FormItem label="急救中心模式：">
              <!-- <Select v-model="formItemIns.fileid6">
                                <Option value="院前急救型-京沪模式">院前急救型-京沪模式</Option>
                                <Option value="指挥调度型-广州模式">指挥调度型-广州模式</Option>
                                <Option value="依托型-重庆模式">依托型-重庆模式</Option>
                                <Option value="医警统一型-南宁模式">医警统一型-南宁模式</Option>
                                <Option value="其他">其他</Option>
              </Select>-->
              <Select v-model="formItemIns.fileid6">
                <Option
                  v-for="item in CenterModel"
                  :value="item.itemvalue1"
                  :key="item.itemvalue1"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="25">
          <Col :md="12" :lg="10">
            <FormItem label="急救网络覆盖分站数：">
              <Input type="number" v-model="formItemIns.fileid7" placeholder="请输入急救网络覆盖分站数" />
            </FormItem>
          </Col>
          <Col :md="12" :lg="10">
            <FormItem label="其中：直属分站数：">
              <Input type="number" v-model="formItemIns.fileid8" placeholder="请输入直属分站数" />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="25">
          <Col :md="24" :lg="20">
            <FormItem label="急救网络覆盖医院数：">
              <Input type="number" v-model="formItemIns.fileid9" placeholder="请输入急救网络覆盖医院数" />
            </FormItem>
            <FormItem label="是否设立以下科室：">
              <!-- <Select v-model="formItemIns.fileid10" multiple>
                                <Option value="院前急救科">院前急救科</Option>
                                <Option value="通讯调度科">通讯调度科</Option>
                                <Option value="车管科">车管科</Option>
              </Select>-->
              <Select v-model="formItemIns.fileid10" multiple>
                <Option
                  v-for="item in department"
                  :value="item.itemvalue1"
                  :key="item.itemvalue1"
                >{{ item.name }}</Option>
              </Select>
              <!-- <Select v-model="searchBox.mechanismType" style="width:200px">
                        <Option v-for="item in mechanismList" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>-->
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="border_line">
        <span class="border_line_txt">通讯调度情况</span>
        <Row :gutter="25" style="margin-top: 10px;">
          <Col :md="24" :lg="20">
            <FormItem label="是否拥有以下通讯系统：">
              <!-- <Select v-model="formItemIns.fileid11" multiple>
                                <Option value="有线">有线</Option>
                                <Option value="无线">无线</Option>
              </Select>-->
              <Select v-model="formItemIns.fileid11" multiple>
                <Option
                  v-for="item in system"
                  :value="item.itemvalue1"
                  :key="item.itemvalue1"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="是否拥有120呼救系统：">
              <RadioGroup v-model="formItemIns.fileid12">
                <Radio label="1" value="1">是</Radio>
                <Radio label="0" value="0">否</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="120呼救系统是否具备以下功能：">
              <!-- <Select v-model="formItemIns.fileid13" multiple > -->
              <!-- <Option value="提供主叫用户电话号码">提供主叫用户电话号码</Option>
                                <Option value="提供机主姓名">提供机主姓名</Option>
                                <Option value="提供装机地址">提供装机地址</Option>
                                <Option value="呼救电话自动排队能力">呼救电话自动排队能力</Option>
              <Option value="电话录音设备">电话录音设备</Option>-->
              <Select v-model="formItemIns.fileid13" multiple>
                <Option
                  v-for="item in Function"
                  :value="item.itemvalue1"
                  :key="item.itemvalue1"
                >{{ item.name }}</Option>
              </Select>
              <!-- </Select> -->
            </FormItem>
            <FormItem label="120是否具备以下电话汇集与受理方式：">
              <!-- <Select v-model="formItemIns.fileid14" multiple >
                                <Option value="地级市汇集各自受理">地级市汇集各自受理</Option>
                                <Option value="全省汇集转当地受理">全省汇集转当地受理</Option>
                                <Option value="全省汇集集中受理">全省汇集集中受理</Option>
              </Select>-->
              <Select v-model="formItemIns.fileid14" multiple>
                <Option
                  v-for="item in way"
                  :value="item.itemvalue1"
                  :key="item.itemvalue1"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </div>
      <Row :gutter="25" style="margin-top: 10px;">
        <Col :md="24" :lg="20" style="text-align:center;">
          <Button type="primary" @click="handleSubmit('formItemIns')">保存</Button>
        </Col>
      </Row>
    </div>
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
</style>
<script>
import {
  editInsInfo,
  insInfoOption,
  queryInsInfo,
  dtls
} from "@/service/insSubManageDtl";
import { getAccessToken, urlPath, getUserInfo } from "@/libs/util";
import { Message } from "iview";
export default {
  data() {
    return {
      //医院关系
      RelationshipBetweenHospital: [],
      //中心模式
      CenterModel: [],
      //科室
      department: [],
      //系统
      system: [],
      //功能
      Function: [],
      //方式
      way: [],

      insId: this.$route.params.id,
      formItemIns: {
        fileid1: "0",
        fileid2: "0",
        fileid5: "",
        fileid12: "0"
      },
      ruleValidate: {
        fileid5: [
          {
            validator: (rule, value, callback) => {
              callback();
            },
            trigger: "blur"
          },
          { required: true, message: "急救床位数不能为空！", trigger: "blur" }
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
          this.formItemIns.fileid1 = res.datas.fileid1;
          this.formItemIns.fileid2 = res.datas.fileid2;
          this.formItemIns.fileid3 = res.datas.fileid3;
          this.formItemIns.fileid4 = res.datas.fileid4;
          this.formItemIns.fileid5 = res.datas.fileid5;
          this.formItemIns.fileid6 = res.datas.fileid6;
          this.formItemIns.fileid7 = res.datas.fileid7;
          this.formItemIns.fileid8 = res.datas.fileid8;
          this.formItemIns.fileid9 = res.datas.fileid9;
          this.formItemIns.fileid12 = res.datas.fileid12;
          // if(res.datas.fileid10){
          //     let fileid10 = res.datas.fileid10.split(",");
          //     this.formItemIns.fileid10 = fileid10;
          //   }
          //   if(res.datas.fileid11){
          //     let fileid11 = res.datas.fileid11.split(",");
          //     this.formItemIns.fileid11 = fileid11;
          //   }
          //   if(res.datas.fileid13){
          //     console.log(  this.formItemIns.fileid11 )
          //     let fileid13 = res.datas.fileid13.split(",");
          // this.formItemIns.fileid13 = fileid13;
          //   }
          //   if(res.datas.fileid14){
          //     let fileid14 = res.datas.fileid14.split(",");
          //     this.formItemIns.fileid14 = fileid14;
          //   }
          if(res.datas.fileid10||res.datas.fileid11||res.datas.fileid13||res.datas.fileid14){
              let fileid10 = res.datas.fileid10.split(",");
              this.formItemIns.fileid10 = fileid10;
              let fileid11 = res.datas.fileid11.split(",");
              this.formItemIns.fileid11 = fileid11;
              let fileid13 = res.datas.fileid13.split(",");
              this.formItemIns.fileid13 = fileid13;
              let fileid14 = res.datas.fileid14.split(",");
              this.formItemIns.fileid14 = fileid14;
          }
        }
      });
    }
  },
  created() {
    // let userNew = getUserInfo();
    this.userNew = this.objs;
    this.getRelationshipBetweenHospital("HospitalRelation");
    this.getCenterModel("EmergencyCentreModel");
    this.getdepartment("HasDeps");
    this.getsystem("CommunicationSystem");
    this.getFunction("120CallFunction");
    this.getway("120CallSolution");
    if (!this.insId) this.insId = this.userNew.insId;
    // this.getMainFrom("ins_ext");
    let params = {
      insId: this.insId
    };
    queryInsInfo(params).then(res => {
      if (res.code == 10000) {
        this.formItemView = res.datas;
        this.formItemIns.fileid1 = res.datas.fileid1;
        this.formItemIns.fileid2 = res.datas.fileid2;
        this.formItemIns.fileid3 = res.datas.fileid3;
        this.formItemIns.fileid4 = res.datas.fileid4;
        this.formItemIns.fileid5 = res.datas.fileid5;
        this.formItemIns.fileid6 = res.datas.fileid6;
        this.formItemIns.fileid7 = res.datas.fileid7;
        this.formItemIns.fileid8 = res.datas.fileid8;
        this.formItemIns.fileid9 = res.datas.fileid9;
        this.formItemIns.fileid12 = res.datas.fileid12;
        // if(res.datas.fileid10){
        //     let fileid10 = res.datas.fileid10.split(",");
        //     this.formItemIns.fileid10 = fileid10;
        //   }
        //   if(res.datas.fileid11){
        //     let fileid11 = res.datas.fileid11.split(",");
        //     this.formItemIns.fileid11 = fileid11;
        //   }
        //   if(res.datas.fileid13){
        //     console.log(  this.formItemIns.fileid11 )
        //     let fileid13 = res.datas.fileid13.split(",");
        // this.formItemIns.fileid13 = fileid13;
        //   }
        //   if(res.datas.fileid14){
        //     let fileid14 = res.datas.fileid14.split(",");
        //     this.formItemIns.fileid14 = fileid14;
        //   }
        if(res.datas.fileid10||res.datas.fileid11||res.datas.fileid13||res.datas.fileid14){
            let fileid10 = res.datas.fileid10.split(",");
            this.formItemIns.fileid10 = fileid10;
            let fileid11 = res.datas.fileid11.split(",");
            this.formItemIns.fileid11 = fileid11;
            let fileid13 = res.datas.fileid13.split(",");
            this.formItemIns.fileid13 = fileid13;
            let fileid14 = res.datas.fileid14.split(",");
            this.formItemIns.fileid14 = fileid14;
        }
      }
    });
  },
  methods: {
    // getMainFrom(url){
    //     this.getRequest(url,urlPath({ins_id:this.insId})).then((res)=>{
    //         if(res.data.data){
    //             this.formItemIns=res.data.data;
    //         }
    //     });
    // },
    handleSubmit(name) {
      // this.$refs[name].validate((valid) => {
      //     if (valid) {
      let Isfileid10 = "";
      let Isfileid11 = "";
      let Isfileid13 = "";
      let Isfileid14 = "";
      if (this.formItemIns.fileid10)
        Isfileid10 = this.formItemIns.fileid10.join(",");
      if (this.formItemIns.fileid11)
        Isfileid11 = this.formItemIns.fileid11.join(",");
      if (this.formItemIns.fileid13)
        Isfileid13 = this.formItemIns.fileid13.join(",");
      if (this.formItemIns.fileid14)
        Isfileid14 = this.formItemIns.fileid14.join(",");
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
        fileid9: this.formItemIns.fileid9,
        fileid10: Isfileid10,
        fileid11: Isfileid11,
        fileid12: this.formItemIns.fileid12,
        fileid13: Isfileid13,
        fileid14: Isfileid14,
        fillType: 2
      };
      this.UpData(params);
      //     } else {
      //         Message.error('验证错误！');
      //     }
      // })
    },
    getRelationshipBetweenHospital(list) {
      dtls(list).then(res => {
        this.RelationshipBetweenHospital = res.datas;
      });
    },
    getCenterModel(list) {
      dtls(list).then(res => {
        this.CenterModel = res.datas;
      });
    },
    getdepartment(list) {
      dtls(list).then(res => {
        this.department = res.datas;
      });
    },
    getsystem(list) {
      dtls(list).then(res => {
        this.system = res.datas;
      });
    },
    getFunction(list) {
      dtls(list).then(res => {
        this.Function = res.datas;
      });
    },
    getway(list) {
      dtls(list).then(res => {
        this.way = res.datas;
      });
    },
    //更新数据
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