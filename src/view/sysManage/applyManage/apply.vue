<style lang="less">
.topForm{
  height:190px;
}
.head{ 
  height:35px;
  padding: 10px;
  margin-bottom:10px;
  background: #F2F2F2;
  .before{
    float: left;
    width: 3px;
    height:14px;
    background: blue;
  }
  .title{
    float: left;
    font-size: 14px;
    color: gray;
    margin-left:10px;
    height: 14px;
    line-height: 14px;
  }
}
.item1{
  width:80%;
  height:50px;
  margin-left:10%;
  padding: 10px;
}
.my-input{
  float:left;
  width:45%;
  height:50px;
}
.imgs{
  width:45%;
  height:80px;
  text-align: center;
  float:left;
  //padding: 10px;
  div{
    float: left;
    width:170px;
    height:100%;
    img{
      width:100px;
      height:60px;
    }
    div{
      width:180px;
      height: 20px;
    }
  }
}
.imageControl{
  width:100%;
  height: 30px;
  line-height: 30px;
  div{
    width: 25%;
    float: left;
    text-align: center;
  }
}
.searchDiv{
  width:50%;
  margin-left:20px;
  height:100%;
  float: left;
  .tableHead{
    margin-top: 10px;
    height:40px;
    background: #F2F2F2;
    display: flex;
    align-items: center;
    .title{
      float: left;
      font-size: 14px;
      font-weight: bold;
      margin-left:10px;
    }
    .input{
      width:40%;
      margin-left:30%;
    }
    .but{
      margin-left:5px;
    }
    
  }
}
.historyDiv{
  width:52%;
  margin-left:10px;
  height:200px;
  float: left;
  padding:10px; 
  .title{
    height: 30px;
    
  }
}
.row{
  width: 90%;
}
.halfRow{
  float: left;
  width: 45%;
  margin-left: 10px;
}
.modalMkStyle{
  height:700px;
}
</style>
<template>
  <div style='min-width:825px'>
    <div style="height:500px">
    <div style="height:100%;width:45%;float:left">
      <div class="head" style="margin-top:10px;">
        <div class="before"></div>
        <div class="title">主体信息</div> 
      </div>
      <Form :model="mainInfo" ref="mainInfo" :rules="mainInfoValidate" label-position="top" class='topForm' >
        <FormItem label="单位全称（第一名称）" prop="insName" class="my-input">
          <Input v-if="type=='apply'" v-model="mainInfo.insName" :maxlength="50"/>
          <span v-else>{{mainInfo.insName}}</span>
        </FormItem>
        <FormItem label="统一社会信用代码" prop="identityNo" class="my-input" style="margin-left:10px">
          <Input v-if="type=='apply'" v-model="mainInfo.identityNo" :maxlength="18"/>
          <span v-else>{{mainInfo.identityNo}}</span>
        </FormItem>
        <FormItem label="医疗机构执业许可证登记号" prop="medicalPracticeNo" class="my-input">
          <Input v-if="type=='apply'" v-model="mainInfo.medicalPracticeNo" :maxlength="50"/>
          <span v-else>{{mainInfo.medicalPracticeNo}}</span>
        </FormItem>
        <FormItem label="单位地址"  class="my-input" style="margin-left:10px">
          <span >{{mainInfo.address}}</span>
        </FormItem>
        <FormItem label="使用信息平台单位人事管理员" class="my-input">
          <span >{{mainInfo.adminName}}</span>
        </FormItem>
        <FormItem label="手机"  class="my-input" style="margin-left:10px">
          <span >{{mainInfo.phoneNumber}}</span>
        </FormItem>
        <FormItem label="单位业务主管部门" prop="pinsName" class="my-input" style="width:92%">
          <div v-if="type=='apply'">
            <Select v-model="pinsOne" label-in-value @on-change="pinsOneSelect" style="float:left;width:32%">
              <Option v-for="item in pinsOneList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
            <Select v-model="pinsTwo" label-in-value  @on-change="pinsTwoSelect" style="float:left;width:32%;margin-left:10px">
              <Option value="null" >无</Option>
              <Option v-for="item in pinsTwoList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
            <Select v-model="pinsThree" label-in-value  @on-change="pinsThreeSelect" style="float:left;width:32%;margin-left:10px">
              <Option value="null" >无</Option>
              <Option v-for="item in pinsThreeList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
          </div>
          <span v-else>{{mainInfo.pinsName}}</span>
        </FormItem>
      </Form>
      <Form :model="formTbale" ref="formTbale" :rules="formTbaleValidate_now" label-position="top" class='topForm' >
        <FormItem label="机构类别" prop="categoryKey" class="my-input" >
          <treeselect
            v-if="type=='apply'"
            v-model="formTbale.categoryKey"
            @select="onInsCategorySelectChange"
            :options="insCategory"
            :disable-branch-nodes="true"
            :show-count="true"
            clearValueText="清除"
            placeholder="输入要搜索的内容"
            noResultsText="当前没有搜索的内容"
            :normalizer="normalizer"
          />
           <span v-else>{{categoryValue}}</span>
        </FormItem>
        <FormItem label="行政隶属" prop="organLayerKey"  class="my-input" style="margin-left:10px">
          <Select
            v-if="type=='apply'"
            v-model="formTbale.organLayerKey"
            label-in-value
            @on-change="onOrganLayerSelectChange"
          >
            <Option
              v-for="(item,index) in organLayer"
              :value="item.code"
              :key="index+'0'"
            >{{item.name}}</Option>
          </Select>
           <span v-else>{{organLayerValue}}</span>
        </FormItem>
        <FormItem label="机构代码" prop="ins_key2"  class="my-input" style="width:70%;margin-top:10px">
          <span  v-if="type=='apply'" style="float:left;width:30%">{{formTbale.ins_key1}}</span>
          <Input v-if="type=='apply'" style="float:left;width:60%" type="text" v-model="formTbale.ins_key2" :maxlength="3" />
          <span v-else>{{serialNum}}</span>
        </FormItem>
      </Form>
    </div>
    <div class="searchDiv" >
      <div class="tableHead">
        <div class="title">民科企业库查询</div>
        <Input class="input" placeholder="企业名称 或 医疗机构执业许可证号" v-model="searchParam1"/>
        <Button class="but" @click="getSearchTableDate1">搜索</Button>
      </div>
      <Table  :columns="columns" :data="data1"  height="180">
        <template slot-scope="{row}" slot="action">
          <div class="action-btn">
            <a v-if="row.auditStatus!='待审核'" @click="viewMk(row)">详情</a>
          </div>
        </template>
      </Table>
      <div class="tableHead">
        <div class="title">系统内机构查询</div>
        <Input class="input" placeholder="企业名称 或 医疗机构执业许可证号" v-model="searchParam2" />
        <Button class="but" @click="getSearchTableDate2">搜索</Button>
      </div>
      <Table :columns="columns1" :data="data2" height="180"></Table>
    </div>
    </div>
    <div class="head" style="margin-top:10px">
      <div class="before"></div>
      <div class="title">附件信息</div> 
    </div>
    <div style="margin-top:10px;height:200px">
      <div class="imgs">
        <div >
          <div>单位用户注册申请表(盖章)</div>
          <a @click="viewImg(mainInfo.applyForm)"><img :src="mainInfo.applyForm" /></a>
        </div>
        <div style="margin-left:10px">
          <div>统一社会信用代码证</div>
          <a @click="viewImg(mainInfo.identityNoCertificate)"><img :src="mainInfo.identityNoCertificate" /></a>
        </div>
        <div style="margin-left:10px">
          <div>医疗登记许可证</div>
          <a @click="viewImg(mainInfo.medicalPracticeNoCertificate)"><img :src="mainInfo.medicalPracticeNoCertificate" /></a>
        </div>
      </div>
      <div class="historyDiv">
        <div class="title">该账户已申请机构记录</div>
        <Table :columns="columns2" :data="data3" height="150" >
        </Table>
      </div> 
    </div>
    <div class="head" style="margin-top:10px">
      <div class="before"></div>
      <div class="title">审批意见</div> 
    </div>
    <RadioGroup v-if="type=='apply'" v-model="auditStatus" @on-change="setFormRules">
      <Radio label=2 >审批通过</Radio>
      <Radio label=3 >审批不通过</Radio>
      <Radio label=1 >退回</Radio>
    </RadioGroup>
    <div style="font-weight:bold;" v-else>{{auditStatus==1?'退回':auditStatus==2?'通过':'不通过'}}</div>

    <div class="" style="margin-top:10px">相关备注</div>
    <Input v-model="remarks" :disabled="type=='view'" type="textarea" style="width: 70%;" :autosize="{minRows: 2,maxRows: 5}" />
    <div style="margin-top:10px;display: flex;align-items: flex-end;width: 70%;">
      <span style="float:left;width:30%">审批人：{{mainInfo.auditBy}}</span>
      <span style="float:left;width:30%;margin-left:50px">审核时间：{{mainInfo.auditDate}}</span>
      <div v-if="type=='view'" style="margin-left:45%;margin-top:10px;">
        <Button type="default" @click="back()" >返回</Button>
      </div>
      <Button v-else type="primary" style="float:left;margin-left:35%" @click="handleSubmit">提交</Button>
    </div>

    <!-- 查看大图 -->
    <Modal
      v-model="imgModalShow"
      :footer-hide="true"
      width="630"
      :styles="{ padding: ''}"
    >
      <img :src="viewImgUrl" :style="{width:'600px',height:'600px',transform:'rotate('+imgDeg+'deg)'}" />
      <div class="imageControl" >
        <div>
          <Icon type="ios-arrow-back" size="28" @click="previousOrNextImg('previous')"/>
        </div>
        <div>
          90°<Icon type="ios-undo" size="24" @click="rotateImg('left')"/>
        </div>
        <div>
          <Icon type="ios-share-alt" size="24"  @click="rotateImg('right')"/>90°
        </div>
        <div>
          <Icon type="ios-arrow-forward" size="28" @click="previousOrNextImg('next')"/>
        </div>
      </div>
    </Modal>
    <!--民科详情-->
    <Modal
      v-model="showModalMk"
      :mask-closable="false"
      :footer-hide="true"
      width="750"
      class-name=""
    >
      <p slot="header" style="color:#333333;font-size:16px">
        <span>民科信息详情</span>
      </p>
      <Form :model="mkForm" label-position="left" :label-width="120" style="height:500px;overflow-y: auto;">
        <div class="">
            <FormItem class="halfRow" label="当前状态：" prop="pname">{{mkForm.STATUS}}</FormItem>
            <FormItem class="halfRow" label="机构名称：" prop="name">{{mkForm.insName}}</FormItem>
        </div>
        <div>
          <FormItem class="halfRow" label="登记号：" prop="category">{{mkForm.registerNumber}}</FormItem>
          <FormItem class="halfRow" label="全国唯一识别码：" prop="organ_layer">{{mkForm.discernNumber}}</FormItem>
        </div>
        <div>
          <FormItem class="halfRow" label="机构第二名称：" prop="category">{{mkForm.insSecondName}}</FormItem>
          <FormItem class="halfRow" label="机构地址：" prop="organ_layer">{{mkForm.insAddress}}</FormItem>
        </div>
        <div>
          <FormItem class="halfRow" label="电话号码：" prop="category">{{mkForm.phoneNumber}}</FormItem>
          <FormItem class="halfRow" label="邮政编码：" prop="organ_layer">{{mkForm.postalCode}}</FormItem>
        </div>
        <div>
          <FormItem class="halfRow" label="法人姓名：" prop="category">{{mkForm.legalPersonName}}</FormItem>
          <FormItem class="halfRow" label="法人证件号：" prop="organ_layer">{{mkForm.legalPersonNumber}}</FormItem>
        </div>
        <div>
          <FormItem class="halfRow" label="负责人姓名：" prop="category">{{mkForm.leadingCadreName}}</FormItem>
          <FormItem class="halfRow" label="负责人证件号：" prop="organ_layer">{{mkForm.leadingCadreNumber}}</FormItem>
        </div>
        <div>
          <FormItem class="halfRow" label="申请日期：" prop="category">{{mkForm.applicationDate}}</FormItem>
          <FormItem class="halfRow" label="批准日期：" prop="organ_layer">{{mkForm.approvalDate}}</FormItem>
        </div>
        <div>
          <FormItem class="halfRow" label="批准文号：" prop="category">{{mkForm.approvalSymbol}}</FormItem>
          <FormItem class="halfRow" label="有效期开始日期：" prop="organ_layer">{{mkForm.validityStartDate}}</FormItem>
        </div>
        <div>
          <FormItem class="halfRow" label="有效期截止日期：" prop="category">{{mkForm.validityEndDate}}</FormItem>
          <FormItem class="halfRow" label="登记发证机关：" prop="organ_layer">{{mkForm.licensingAuthority}}</FormItem>
        </div>
        <div>
          <FormItem class="halfRow" label="行政区划：" prop="category">{{mkForm.administrativeDivision}}</FormItem>
          <FormItem class="halfRow" label="街道：" prop="organ_layer">{{mkForm.street}}</FormItem>
        </div>
        <div>
          <FormItem class="halfRow" label="所有制形式：" prop="category">{{mkForm.ownershipForm}}</FormItem>
          <FormItem class="halfRow" label="隶属关系：" prop="organ_layer">{{mkForm.subordination}}</FormItem>
        </div>
        <div>
          <FormItem class="halfRow" label="服务对象：" prop="category">{{mkForm.client}}</FormItem>
          <FormItem class="halfRow" label="机构类别：" prop="organ_layer">{{mkForm.insCategories}}</FormItem>
        </div>
        <div>
          <FormItem class="halfRow" label="机构级别：" prop="category">{{mkForm.insLevel}}</FormItem>
          <FormItem class="halfRow" label="机构等次：" prop="organ_layer">{{mkForm.insGradation}}</FormItem>
        </div>
        <div>
          <FormItem class="halfRow" label="经营性质：" prop="category">{{mkForm.manageNature}}</FormItem>
          <FormItem class="halfRow" label="床位数：" prop="organ_layer">{{mkForm.bedNum}}</FormItem>
        </div>
        <div>
          <FormItem class="halfRow" label="牙椅数：" prop="category">{{mkForm.dentalChairNum}}</FormItem>
          <FormItem class="halfRow" label="开业日期：" prop="organ_layer">{{mkForm.openingDate}}</FormItem>
        </div>
        <div>
          <FormItem class="halfRow" label="注册资金：" prop="category">{{mkForm.registeredFunds}}</FormItem>
          <FormItem class="halfRow" label="下一校验日期：" prop="organ_layer">{{mkForm.nextCheckDate}}</FormItem>
        </div>
        <div>
          <FormItem class="halfRow" label="诊疗科目名称：" prop="category">{{mkForm.practiceSpecialtyName}}</FormItem>
          <FormItem class="halfRow" label="诊疗科目代码：" prop="organ_layer">{{mkForm.practiceSpecialtyCode}}</FormItem>
        </div>
        <div>
          <FormItem class="halfRow" label="备注一：" prop="category">{{mkForm.note1}}</FormItem>
          <FormItem class="halfRow" label="备注二：" prop="organ_layer">{{mkForm.note2}}</FormItem>
        </div>
        <div>
          <FormItem class="halfRow" label="服务方式：" prop="category">{{mkForm.serviceMode}}</FormItem>
        </div>
      </Form>
      <div slot="footer" style="">
        <Button @click="showModalMk=false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
import {
  addSubIns,
  admOption,
  option,
  queryUpperIns
} from "@/service/insSubManage";
import { queryList, queryDetail,edit,cancel,queryInsList,querySyncIns,insOptionList} from "@/service/applyManage";
import {
  getAccessToken,
  urlPath,
  getUserInfo,
  IsCSCOrTHospital,
  IsMedicalInstitution,
  IsFirstAidInstitution,
  IsMedicalSupervise
} from "@/libs/util";
import { Modal, Message } from "iview";
import axios from "axios";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  data() {
    insName: "";
    //校验机构代码流水号
    const validateInsKey2 = (rule, value, callback) => {
      var reg = /^\d{3}/;
      if (value === "") {
        callback(new Error("请输入三位流水号！"));
      } else if (!reg.test(value)) {
        callback(new Error("机构代码流水号输入有误！"));
      } else {
        callback();
      }
    };
    return {
      noPng:require('@/assets/image/noPng.png'),
      ModalShow:false,
      content:null,
      selectIndex: 0,
      category: "",
      trialDetailChoose: "trialBaseNews",
      info_status:0,
    
      applyId: this.$route.params.id,
      type:this.$route.params.type,// view 查看 apply 审核
      viewImgUrl:'',
      imgDeg:0,//旋转角度
      imgUrls:[],
      imgModalShow:false,
      showModalMk:false,//显示民科弹框
      mkForm:{},
     
      TreeselectValue: 0,
      isRefresh: true,
       normalizer(node){
        if(node.list && !node.list.length){
          delete node.list
        }
        return{
          id:node.code,
          label:node.name,
          children:node.list,
        }
      },
      mainInfo:{},

      pinsOne:'',//三级主管部门
      pinsTwo:'null',
      pinsThree:'null',
      pinsOneName:'',
      pinsTwoName:'',
      pinsThreeName:'',
      pinsOneList:[],
      pinsTwoList:[],
      pinsThreeList:[],

      formTbale: {
        categoryKey: null,
        categoryValue: null,
        organLayerKey: null,
        organLayerValue: null,
        ins_key2: ""
      },
      mainInfoValidate: {
        insName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        identityNo: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        pinsName: [
            { 
              required: true, 
              message: "请选择主管部门", 
              trigger: "blur,change",
              validator:(rule,value,callback)=>{
                  if(this.pinsOne!==''&&this.pinsTwo!==''&&this.pinsThree!==''){
                      callback()
                  }else{
                      callback(new Error());
                  }
              } 
            }
        ],
      },
      formTbaleValidate:{
        categoryKey: [
          { required: true, message: "请选择机构类别", trigger: "blur" }
        ],
        organLayerKey: [
          { required: true, message: "请选择行政隶属", trigger: "blur" }
        ],
        ins_key2: [
          {
            required: true,
            validator: validateInsKey2,
            trigger: "blur"
          }
        ]
      },
      formTbaleValidate_now:{},
      insCategory: [],
      organLayer: [],
      userInfo: null,
      ins_key1: "WS420000",

      auditStatus:null,// 1.通过 2.不通过 3.退回
      remarks:'',

      searchParam1:'',
      searchParam2:'',
      data1:[],//民科企业查询表格
      data2:[],//系统内机构查询表格
      data3:[],//申请记录查询表格
      auditBy:'',
      auditDate:'',


      columns: [
        {
          title: "操作",
          slot: "action",
          width: 90,
          align: "center"
        },
        {
          title: "企业名称",
          key: "insName",
          minWidth:90
        },
        {
          title: "统一社会信用代码",
          key: "identityNo",
          minWidth:140
        },
        {
          title: "医疗机构执业许可证号",
          key: "medicalPracticeNo",
          minWidth:160
        },
        {
          title: "机构类别",
          key: "categoryKey",
          minWidth:90
        },
        {
          title: "行政隶属",
          key: "organLayerValue",
          minWidth:90
        },
        {
          title: "业务主管部门",
          key: "pname",
          minWidth:140
        }
      ],
      columns1: [
        {
          title: "企业名称",
          key: "insName",
          minWidth:90
        },
        {
          title: "统一社会信用代码",
          key: "identityNo",
          minWidth:140
        },
        {
          title: "医疗机构执业许可证号",
          key: "medicalPracticeNo",
          minWidth:160
        },
        {
          title: "机构类别",
          key: "categoryKey",
          minWidth:90
        },
        {
          title: "行政隶属",
          key: "organLayerValue",
          minWidth:90
        },
        {
          title: "业务主管部门",
          key: "pname",
          minWidth:140
        }
      ],
      columns2: [
        {
          title: "企业名称",
          key: "insName",
          //width:90
        },
        {
          title: "统一社会信用代码",
          key: "identityNo",
          //width:140
        },
        {
          title: "医疗机构执业许可证号",
          key: "medicalPracticeNo",
          //width:160
        },
      ],
      //审核通过后的
      categoryValue:null,//机构类别
      organLayerValue:null,//行政隶属
      serialNum:null//机构账号
    };
  },
  components: {
    Treeselect
  },
  created() {
    // let curUserInfo = getUserInfo();
    // this.userInfo = curUserInfo;
    this.getCategoryKey()
  
        //机构类别
    option(params).then(res => {
      if (res.code == 10000) {
       this.insCategory = res.datas;
      }
    });

    //行政隶属
      // admOption().then(res=>{
      //   this.organLayer =res.datas
      // })

      //行政隶属
      admOption(params).then(res => {
        if (res.code == 10000) {
          this.organLayer = res.datas;
        }
      });
    let params = {
      ins_category: ""
    };
    if(this.type=='view'){
      this.mainInfoValidate={};
      this.formTbaleValidate_now={};
    }
  },
  mounted(){
    insOptionList().then(res=>{//主管单位枚举
      if(res.datas){
        this.pinsOneList = res.datas;

        queryDetail({id:this.applyId}).then(res => {
          if (res.code == 10000) {
            this.total = res.total;
            this.mainInfo = res.datas;
            let identityNoCertificate=res.datas.identityNoCertificate
            let medicalPracticeNoCertificate=res.datas.medicalPracticeNoCertificate
            let applyForm=res.datas.applyForm
            let fileUrl=process.env.fileUrl;
            this.mainInfo.identityNoCertificate=identityNoCertificate=="undefined"||!identityNoCertificate?this.noPng:fileUrl+identityNoCertificate
            this.mainInfo.medicalPracticeNoCertificate=medicalPracticeNoCertificate=="undefined"||!medicalPracticeNoCertificate?this.noPng:fileUrl+medicalPracticeNoCertificate
            this.mainInfo.applyForm=applyForm=="undefined"||!applyForm?this.noPng:fileUrl+applyForm
            this.imgUrls=[
              this.mainInfo.identityNoCertificate,
              this.mainInfo.medicalPracticeNoCertificate,
              this.mainInfo.applyForm
            ]
            
            this.auditStatus=res.datas.auditStatus;
            this.remarks=res.datas.remarks;
            this.data3=this.mainInfo.applyHistory;

            this.searchParam1=this.mainInfo.insName;
            this.searchParam2=this.mainInfo.insName;
            this.getSearchTableDate1()
            this.getSearchTableDate2()
            //获得 机构类别，行政隶属，机构账号 value
            option({ins_category: ""}).then(res2 => {
              if (res2.code == 10000) {
                this.getInsCategory(res.datas.categoryKey,res2.datas)
              }
            });
            for(let i of  this.organLayer){
              if(i.code==res.datas.organLayerKey){
                this.organLayerValue=i.name
              }
            }
            this.serialNum=res.datas.uniqueIdentity;

            //三级主管单位回显
            let pinsId=this.mainInfo.pinsId
            for(let i of this.pinsOneList){
              if(i.id==pinsId){
                this.pinsOne=i.id;
                this.pinsOneName=i.name;
                this.pinsTwoList=i.list
                break;
              }
              for(let j of i.list){
                if(j.id==pinsId){
                  this.pinsTwoList=i.list;;
                  this.pinsThreeList=j.list;
                  this.pinsOne=i.id
                  this.pinsOneName=i.name;
                  this.pinsTwo=j.id;
                  this.pinsTwoName=j.name;
                  break;
                }
                for(let k of j.list){
                  if(k.id==pinsId){
                    this.pinsTwoList=i.list;
                    this.pinsThreeList=j.list;
                    this.pinsOne=i.id
                    this.pinsOneName=i.name;
                    this.pinsTwo=j.id;
                    this.pinsTwoName=j.name;
                    this.pinsThree=k.id;
                    this.pinsThreeName=k.name;
                    break;
                  }
                }
              }
            }
          } else {
            Message.error(data.msg);
          }
        });
      }
    });
    //表单样式  height: 50px;line-height: 25px;

      setTimeout(()=>{
        Array.from(document.getElementsByClassName('my-input')).forEach((m)=>{
          let div=m.getElementsByTagName('div')[0]
          div.style.height='32px'
          div.style.lineHeight='32px'
          //div.style.wordBreak='break-all';
        })
        document.getElementsByClassName('ivu-select-selection')[0].style.height='34px'
      },1000)
    
    //this.getValueByCodeAndId("InstitutionCategory","A1")
  },
  methods: {
    viewMk(row){//查看民科详情
      this.showModalMk=true;
      this.mkForm=JSON.parse(row.json);
    },
    setFormRules(value){//1.退回 2.通过 3.不通过
      if(value==2){
        this.formTbaleValidate_now=this.formTbaleValidate;
   
      }else{
        this.formTbaleValidate_now={}
        this.$refs['formTbale'].resetFields();
      }
    },
    getValueByCodeAndId(code,value){//查字典 
      dtls("InstitutionCategory").then(res => {
        if (res.code == 10000) {
          var list = res.datas;

        }
      });
    },
    getSearchTableDate1(){//民科企业库
      let params = {
        page: {
          pageNum: 1,
          pageSize: 999
        },
        insInfo:this.searchParam1
      }
      querySyncIns(params).then(res => {
        if (res.code == 10000) {
          this.data1 = res.datas;
        }
      });
    },
    getSearchTableDate2(){//系统内机构
      let params = {
        page: {
          pageNum: 1,
          pageSize: 999
        },
        insInfo:this.searchParam2
      }
      queryInsList(params).then(res => {
        if (res.code == 10000) {
          this.data2 = res.datas;
        }
      });
    },

    //图片控制
    previousOrNextImg(type){
      var index=0;
      for(let i in this.imgUrls){
        if(this.imgUrls[i]==this.viewImgUrl){
          index=Number(i)
        }
      }
      
      if(type=='previous'){
        if(index!=0){
          this.imgDeg=0;
          this.viewImgUrl=this.imgUrls[index-1]
        }
      }else{
        if(index!=2){
          this.imgDeg=0;
          this.viewImgUrl=this.imgUrls[index+1]
        }
      }
        
      
    },
    rotateImg(type){
      if(Math.abs(this.imgDeg)==360){
        this.imgDeg=0
      }
      if(type=='left'){
        this.imgDeg=this.imgDeg-90
      }else{
        this.imgDeg=this.imgDeg+90
      }
      
    },
   

    getInsCategory(code,list){//获得机构类别
      for(let i of list){
        if(i.code==code){
          this.categoryValue=i.name;
          break;
        }else{
          if(i.list&&i.list.length>0){
            this.getInsCategory(code,i.list)
          }
        }
      }
    },
    back(){
      document.getElementsByClassName('ivu-tag-primary')[0].getElementsByTagName('i')[0].click()
      this.$router.push({name:'applyManage'})
    },
    viewImg(url){
      for(let i of this.imgUrls){
        if(i==url){
          this.viewImgUrl=i
        }
      }
      this.imgModalShow=true;
    },
    // setCar(index, indexs) {
    //   this.selectIndex = indexs;
    //   switch (index) {
    //     case 1:
    //       this.trialDetailChoose = "trialBaseNews";
    //       break;
    //     case 2:
    //       this.trialDetailChoose = this.ReturnUrl();
    //       break;
    //     case 3:
    //       this.trialDetailChoose = "trialAddress";
    //       break;
    //     case 4:
    //       this.trialDetailChoose = "trialdepartment";
    //       break;
    //     case 5:
    //       this.trialDetailChoose = "trialCWSS"; //村卫生室
    //       break;
    //     case 6:
    //       this.trialDetailChoose = "trialSQFWZ"; //社区服务站
    //       break;
    //   }
    // },
    // ReturnUrl() {
    //   let categoryKeys = this.categoryKey;
    //   if (IsMedicalInstitution(categoryKeys)) {
    //     return "trialHospital";
    //   } else if (IsFirstAidInstitution(categoryKeys)) {
    //     return "trialjjzdtls";
    //   } else if (IsMedicalSupervise(categoryKeys)) {
    //     return "trialwsjdsdtls";
    //   } else if (IsCSCOrTHospital(categoryKeys)) {
    //     return "trialwsydtls";
    //   } else {
    //     return "trialfwzdtls";
    //   }
    // },
    getCategoryKey(categoryKey){
      //主管单位和唯一标识
      let params={
        categoryKey:categoryKey
      }
      queryUpperIns(params).then(res => {
        if (res.code == 10000) {
          this.formTbale.name = res.datas.insName;
          let datas = res.datas.insCode
            this.formTbale.ins_key1 =datas.substring(0,datas.length-3);
            this.formTbale.ins_key2 =datas.substring(datas.length-3,datas.length )
        }
      })
    },
    handleSubmit() {
      var auditStatus=this.auditStatus;
      var validate=true;
      this.$refs['mainInfo'].validate(valid => {
        if (!valid){
          validate=false;
        }
      });
      if(!validate){
        return;
      }
      if(!auditStatus){
        Message.warning('请选择审批意见！');
        return;
      }
      if((this.remarks==''||this.remarks==undefined)&&auditStatus!=2){
        Message.warning('请填写备注！');
        return;
      }
      this.$refs['formTbale'].validate(valid => {
        if (valid||(!valid&&auditStatus!=2)) {
          let params = {
            id: this.applyId,
            categoryKey: this.formTbale.categorycode,
            categoryValue: this.formTbale.categoryValue,
            organLayerKey: this.formTbale.organLayerKey,
            organLayerValue: this.formTbale.organLayerValue,
            serialNum: this.formTbale.ins_key1+this.formTbale.ins_key2, //流水号
            insName: this.mainInfo.insName,
            identityNo: this.mainInfo.identityNo,
            medicalPracticeNo: this.mainInfo.medicalPracticeNo,
            remarks:this.remarks,
            pinsId:this.mainInfo.pinsId,
            pinsName:this.mainInfo.pinsName
          };
          var text='';
          if(auditStatus==2){
            params.auditStatus=auditStatus;
            Modal.confirm({
              title: "审核",
              content: "<p>确认通过吗？</p>",
              closable:true,
              onOk: () => {
                edit(params).then(res => {
                  if (res.code == 10000) {
                    Message.success("审核成功");
                    //debugger
                    //关闭当前tag
                    document.getElementsByClassName('ivu-tag-primary')[0].getElementsByTagName('i')[0].click()
                  } else {
                    //Message.error(res.msg);
                  }
                }).catch();
              }
            });
          }else{
            var p={
              id:this.applyId,
              remarks:this.remarks,
              auditStatus:auditStatus
            }
            var tag=auditStatus==3?'不通过':'退回'
            Modal.confirm({
              title: "审核",
              content: "<p>确认"+tag+"吗？</p>",
              closable:true,
              onOk: () => {
                cancel(p).then(res => {//传值1.退回 3.不通过
                  if (res.code == 10000) {
                    Message.success("审核成功");
                    //debugger
                    //关闭当前tag
                    document.getElementsByClassName('ivu-tag-primary')[0].getElementsByTagName('i')[0].click()
                  } else {
                    //Message.error(res.msg);
                  }
                }).catch();
              }
            });
          }
          
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    //机构类别选择事件
    onInsCategorySelectChange(node) {
      this.formTbale.categoryKey = node.code;
      let categoryKey =node.code
      this.formTbale.categorycode = node.code
      this.formTbale.categoryValue = node.name;
      this.getCategoryKey(categoryKey)
      //获取机构类别
      // option().then(res => {
      //   if (res.code == 10000) {
      //   }
      // });
    },
    //行政隶属选择事件
    onOrganLayerSelectChange(data) {
      this.formTbale.organLayerKey = data.value;
      this.formTbale.organLayerValue = data.label;
    },
    clearVal(value) {
      if (value == undefined) {
        this.formTbale.categoryKey = null;
        this.formTbale.categoryValue = null;
      }
    },
    //主管单位三级联动
    pinsOneSelect(node){
      this.mainInfo.pinsId = node.value;
      this.mainInfo.pinsName = node.label;
      this.pinsOneName=node.label;
      for(let i of this.pinsOneList){
        if(i.id==this.pinsOne){
          this.pinsTwoList= i.list
        }
      }
    },
    pinsTwoSelect(node){
      if(node&&node.value!='null'){
        this.mainInfo.pinsId = node.value;
        this.mainInfo.pinsName = node.label;
        this.pinsTwoName=node.label;
        for(let i of this.pinsTwoList){
          if(i.id==this.pinsTwo){
            this.pinsThreeList= i.list
          }
        }
      }else{//选择‘无’
          this.pinsThreeList=[];
          this.mainInfo.pinsId = this.pinsOne;
          this.mainInfo.pinsName = this.pinsOneName;
      
      }
      this.pinsThree='null';
    },
    pinsThreeSelect(node){
      if(node&&node.value!='null'){
        this.mainInfo.pinsId = node.value;
        this.mainInfo.pinsName = node.label;
      }else{
        // if(this.pinsTwo!='null'){
        //   this.form.pinsId = this.pinsTwo;
        //   this.form.pinsName = this.pinsTwoName;
        // }
        
      }
    },

  }
};
</script>