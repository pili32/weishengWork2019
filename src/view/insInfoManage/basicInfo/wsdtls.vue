
<template>
  <Form :model="formItemIns" ref="formItemIns" :label-width="200" :rules="ruleValidate">
    <div>
      <div class="border_line">
        <span class="border_line_txt">一. 主体信息</span>
        <Row :gutter="25" style="margin-top: 10px;">
          <Col :md="12" :lg="10">
            <FormItem label="单位名称：">
              <span>{{insName}}</span>
            </FormItem>
            <FormItem label="机构类别：">
              <span>{{insType}}</span>
            </FormItem>
          </Col>
          <Col :md="12" :lg="10">
            <FormItem label="主管单位：">
              <span>{{pname}}</span>
            </FormItem>
            <FormItem label="行政隶属：">
              <span>{{organLayer}}</span>
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="border_line">
        <span class="border_line_txt">二. 基本信息</span>
        <Row :gutter="25" style="margin-top: 10px;">
          <Col :md="12" :lg="10" style="margin-bottom: 20px;">
            <FormItem label="统一社会信用代码：">
              <Input v-model="formItemIns.creditCode" placeholder="请输入统一社会信用代码" :maxlength="18" />
            </FormItem>
            <FormItem label="成立年份：" prop="foundedYear">
              <DatePicker type="year" placeholder="如：2018" v-model="formItemIns.foundedYear" />
            </FormItem>
            <FormItem label="设置/主办单位名称：">
              <Select v-model="formItemIns.hostUnitType" @on-change="CategoryChange" label-in-value>
                <Option
                  v-for="item in category"
                  :value="item.itemvalue1"
                  :key="item.name"
                >{{ item.name}}</Option>
              </Select>
            </FormItem>
            <FormItem label="登记注册/经济类型：">
              <Select v-model="formItemIns.register" @on-change="CategoryRegister" label-in-value>
                <Option
                  v-for="item in register"
                  :value="item.itemvalue1"
                  :key="item.name"
                >{{ item.name}}</Option>
              </Select>
            </FormItem>
            <FormItem label="单位行政级别：">
              <Select
                v-model="formItemIns.unitAdmTypeCode"
                @on-change="OrganLvevlChange"
                label-in-value
              >
                <Option
                  v-for="item in organ_lvevl"
                  :value="item.code"
                  :key="item.name"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="单位事业性质：">
              <Select v-model="formItemIns.unitGov" @on-change="PropertChange" label-in-value>
                <Option
                  v-for="item in properties"
                  :value="item.code"
                  :key="item.name"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col :md="12" :lg="10" style="margin-bottom: 20px;">
            <FormItem label="医疗机构执业许可证：" prop="medicalLicenceCode">
              <Input
                v-model="formItemIns.medicalLicenceCode"
                placeholder="请输入医疗机构执业许可证"
                :maxlength="50"
              />
            </FormItem>
            <FormItem label="法人代表（负责人）：" prop="legalPerson">
              <Input v-model="formItemIns.legalPerson" placeholder="请输入法人代表（负责人）" />
            </FormItem>
            <FormItem label="网站域名：" prop="domain">
              <Input v-model="formItemIns.domain" placeholder="请输入网站域名" />
            </FormItem>
            <FormItem label="总编制数：" prop="organNum">
              <Input type="number" v-model="formItemIns.organNum" placeholder="总编制数" />
            </FormItem>
            <FormItem label="是否达到建设标准：" prop="buildStandard">
              <RadioGroup v-model="formItemIns.buildStandard">
                <Radio :label="1" value="1">是</Radio>
                <Radio :label="0" value="0">否</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="机构分类管理类型：" v-if="this.userName =='administrator'">
              <Select v-model="formItemIns.getType" @on-change="CategoryGetType" label-in-value>
                <Option
                  v-for="item in getType"
                  :value="item.itemvalue1"
                  :key="item.name"
                >{{ item.name}}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="border_line">
        <span class="border_line_txt">三. 其它名称</span>
        <Row :gutter="25" style="margin-top: 10px;">
          <Col :md="24" :lg="20">
            <FormItem>
              <Checkbox v-model="checked">无其它名称</Checkbox>
              <p
                style="color:red;"
              >填报说明：其他名称为单位正在对外使用的其他有效名称。例如：湖北省中医院（湖北省中医药研究院、湖北中医药大学附属医院），洪山区中医医院（珞南街社区卫生服务中心）。</p>
            </FormItem>
          </Col>
        </Row>
        <div class="alias" v-if="!checked">
          <FormItem
            v-for="(item, index) in bmList"
            :key="index.name"
            :label="'第 ' + (index+1) +'名称'"
          >
            <!-- :prop="name"
            :rules="{required: true, message: '名称不能为空', trigger: 'blur'}"-->
            <Row>
              <Col span="18">
                <Input
                  type="text"
                  v-model="item.name"
                  placeholder="请输入名称"
                  @on-blur="changeName(item.name,index)"
                />
              </Col>
              <Col span="4" offset="1">
                <Button @click="handleRemove(index,item.insNamesId)">删除</Button>
              </Col>
            </Row>
          </FormItem>
          <FormItem>
            <Row>
              <Col span="12">
                <Button
                  type="dashed"
                  long
                  @click="handleAdd"
                  icon="md-add"
                  class="btnhandleAdd"
                >继续添加</Button>
              </Col>
            </Row>
          </FormItem>
        </div>
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
</style>
<script>
import {
  editSubInsBasic,
  queryInsBaseInfo,
  deleteInsName,
  dtls
} from "@/service/insSubManageDtl";
import {
  getAccessToken,
  urlPath,
  getUserInfo,
  dataItemHandle,
  validateSequence
} from "@/libs/util";
import { Message } from "iview";
export default {
  data() {
    return {
      insId: this.$route.params.id,
      index: 1,
      insName: "",
      pname: "",
      isExsit: "",
      insType: "",
      organLayer: "",
      category: [],
      properties: [],
      getType: [],
      register: [],
      organ_lvevl: [],
      checked: true,
      formItemIns: {},
      index: 1,
      userName: "",
      num: 1,
      bmList: [
        {
          name: "",
          insNamesId: "",
          // index: 1,
          orderIndex: 1
        }
      ],
      nameList: [
        {
          insNamesId: "",
          name: "",
          orderIndex: ""
        }
      ],
      ruleValidate: {
        legalPerson: [
          {
            required: true,
            message: "法人代表（负责人）不能为空！",
            trigger: "blur"
          }
        ],
        organNum: [
          {
            required: true,
            message: "总编制数不能为空",
            trigger: "blur",
            validator: validateSequence
          }
        ],
        buildStandard: [
          {
            type: "number",
            required: true,
            message: "是否达到建设标准！",
            trigger: "change"
          }
        ]
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
      this.userName = this.objs.username;
      this.userNew = this.objs;
      if (!this.insId) {
        this.insId = this.userNew.insId;
      }
      
      if(this.insId){

        this.getMainFrom();
      }
      // this.getDetaItemCategory();

      // this.getDetaItemLevel();
      // this.getDetaItemProperties();
    }
  },
  created() {
    // let userNew = getUserInfo();
    this.userName = this.objs.username;
    this.userNew = this.objs;
    if (!this.insId) {
      this.insId = this.userNew.insId;
    }
    if( this.insId){

      this.getMainFrom();
    }
    this.getDetaItemCategory();


    this.getDetaItemLevel();
    this.getDetaItemProperties();
  },
  methods: {
  
    getMainFrom() {
      let params = {
        insId: this.insId
      };
      //主体信息列表渲染
      queryInsBaseInfo(params).then(res => {
        if (res.code == 10000) {
          //单位事业性质
          (this.properties = res.datas.govOptionList),
            //单位行政类别
            (this.organ_lvevl = res.datas.admUnitOptionList),
            //主板单位类别
            // this.category = res.datas.hostUnitOptionList;
            //  let category  = this.category
            (this.formItemIns = res.datas.baseInfo);
          let dataList = res.datas.mainInfo;
          this.insName = dataList.insName;
          this.pname = dataList.pname;
          this.insType = dataList.insType;
          this.organLayer = dataList.organLayer;
          (this.formItemIns.buildStandard = this.formItemIns.buildStandard),
            (this.formItemIns.register = this.formItemIns.registrationCode);

          this.formItemIns.hostUnitType = this.formItemIns.hostUnitTypeCode;
          this.formItemIns.getType = this.formItemIns.insManagementCode;

          this.formItemIns.unitAdmTypeCode = this.formItemIns.unitAdmTypeCode;
          this.formItemIns.unitGov = this.formItemIns.unitGovCode;
          let isExsit = res.datas.nameInfo.isExsit;
          if (isExsit == "0") {
            this.checked = false;
          }
          if (res.datas.nameInfo.nameList) {
            this.bmList = res.datas.nameInfo.nameList;
          }
        }
      });
    },
    checkout(node) {},
    //设置/主办单位名称
    getDetaItemCategory() {
      dtls("OrganizerName").then(res => {
        this.category = res.datas;
      });
    },
    //登记注册/经济类型
    getDetaItemLevel(code) {
      dtls("EconomicType").then(res => {
        this.register = res.datas;
      });
    },
    getDetaItemProperties(code) {
      dtls("Classification").then(res => {
        this.getType = res.datas;
      });
    },
    changeName(item, index) {
      this.nameList[index].name = item;
      this.nameList[index].orderIndex = index;
    },
    handleSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let params = {
            insId: this.insId,
            creditCode: this.formItemIns.creditCode,
            foundedYear: new Date(this.formItemIns.foundedYear)
              .getFullYear()
              .toString(),
            insManagementValue: this.formItemIns.insManagementValue,
            insManagementCode: this.formItemIns.insManagementCode,

            registrationValue: this.formItemIns.registrationValue,
            registrationCode: this.formItemIns.registrationCode,

            insManagementValue: this.formItemIns.insManagementValue,
            insManagementCode: this.formItemIns.insManagementCode,
            
            hostUnitTypeCode: this.formItemIns.hostUnitType,
            hostUnitTypeValue: this.formItemIns.hostUnitTypeValue,

            unitAdmTypeCode: this.formItemIns.unitAdmTypeCode,
            unitAdmTypeValue: this.formItemIns.unitAdmTypeValue,

            unitGovCode: this.formItemIns.unitGov,
            unitGovValue: this.formItemIns.unitGovValue,

            medicalLicenceCode: this.formItemIns.medicalLicenceCode,
            legalPerson: this.formItemIns.legalPerson,
            domain: this.formItemIns.domain,
            // organNum: parseInt(this.formItemIns.organ_count),
            buildStandard: this.formItemIns.buildStandard,
            organNum: this.formItemIns.organNum,
            nameList: this.bmList
          };
          //判断如果没勾选就进入
          if (!this.checked) {
            let nameArr = params.nameList;
            var nameArrList = [];
            if (params.nameList.length > 0) {
              for (var i = 0; i < nameArr.length; i++) {
                nameArrList = nameArr[i];
              }
              if (nameArrList.name.length > 0 && nameArrList.name) {
                this.UpData(params);
              } else {
                Message.error("信息填写未完成,名称不可为空");
              }
            } else {
              params.nameList = [];
              this.UpData(params);
            }
          } else {
            //判断如果勾选就进入，初始化 params.nameList=[];
            params.nameList = [];
            this.UpData(params);
          }
        } else {
          Message.error("信息验证失败!");
        }
      });
    },
    CategoryChange(res) {
      this.formItemIns.hostUnitTypeValue = res.label;
      this.formItemIns.hostUnitTypeCode = res.value;
    },
    CategoryRegister(res) {
      this.formItemIns.registrationValue = res.label;
      this.formItemIns.registrationCode = res.value;
    },
    CategoryGetType(res) {
      this.formItemIns.insManagementValue = res.label;
      this.formItemIns.insManagementCode = res.value;
    },
    OrganLvevlChange(res) {
      this.formItemIns.unitAdmTypeValue = res.label;
      // this.formItemIns.unitAdmTypeCode = res.label;
    },
    PropertChange(res) {
      this.formItemIns.unitGovValue = res.label;
      // this.formItemIns.unitGovCode = res.value;
    },
    handleAdd() {
      this.num++;
      // this.index = this.bmList.length;
      this.index++;
      this.bmList.push({
        name: "",
        insNamesId: "",
        orderIndex: this.index
      });
      this.nameList.push({
        name: "",
        insNamesId: "",
        orderIndex: this.index
        // status: 1
      });
    },
    //删除
    handleRemove(index, item) {
      this.num--;
      this.bmList.splice(index, 1);
      for (var i = 0; i < this.bmList.length; i++) {
        if (this.bmList[i].index > index) {
          this.bmList[i].index--;
        }
      }
      for (let i = 0; i < this.nameList.length; i++) {
        if (this.nameList[i].orderIndex > index) {
          this.nameList[i].orderIndex--;
        }
      }
      if (item) {
        let params = {
          insNamesId: item
        };
        deleteInsName(params).then(res => {
          if (res.code == 10000) {
            Message.success("删除成功!");
          } else {
            Message.error(res.msg);
          }
        });
      }
    },
    //保存
    UpData(param) {
      editSubInsBasic(param).then(res => {
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