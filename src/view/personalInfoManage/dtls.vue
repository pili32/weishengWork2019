<template>
  <div class="personnel_dtls">
    <div class="personnel_new">
      <Row>
        <Col span="14" class="new_box">
          <div class="personnel_new_title">
            <Row>
              <Col span="12">
                <h4>实名信息</h4>
                <!--  <span class="new_title_state" style="background: #009688;color:#ffffff">已认证</span> -->
              </Col>
              <Col span="12">
                <h4>单位信息</h4>
              </Col>
            </Row>
          </div>
          <div class="personnel_new_cont">
            <Row>
              <Col span="12">
                <p class="personnel_new_cont_txt">姓名：{{CoreInfo.name}}</p>
                <p class="personnel_new_cont_txt">性别：{{CoreInfo.gender=="1"?"男":"女"}}</p>
                <p
                  class="personnel_new_cont_txt"
                >证件类型：{{ GetPersonalIdcardType(CoreInfo.idcardType)}}</p>
                <p class="personnel_new_cont_txt">证件号码：{{CoreInfo.idcardNo}}</p>
                <p class="personnel_new_cont_txt">出生年月：{{getLocalTime(CoreInfo.birthDate)}}</p>
              </Col>
              <Col span="12">
                <p
                  class="personnel_new_cont_txt"
                >身份类型：{{getPersonalCoreIdentityType(CoreInfo.identityType)}}</p>
                <p class="personnel_new_cont_txt">所在单位：{{CoreInfo.insName}}</p>
              </Col>
            </Row>
          </div>
          <div class="personnel_new_title"></div>
        </Col>
        <Col span="10" class="new_box">
          <Row>
            <Col span="12">
              <div class="personnel_new_title" style="text-align: center;">
                <h4>近期自拍照</h4>
              </div>
              <div style="text-align: center;" class="img">
                <img v-if="RecentPhotos" :src="zpurl" />
                <img v-else src="../../assets/image/people.png" alt="">
              </div>
            </Col>
            <Col span="12">
              <div class="personnel_new_title" style="text-align: center;">
                <h4>个人登记照</h4>
              </div>
              <div style="text-align: center;" class="img">
                <img v-if="PersonalPhoto" :src="djurl" />
                <img v-else src="../../assets/image/people.png" alt="">

              </div>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row>
        <Col span="7">
          <div class="personnel_base_info">
            <h4>基础信息</h4>
            <p
              class="personnel_new_cont_txt"
              style="margin-top:20px"
            >民族：{{CoreInfo.basicInfoNation}}</p>
            <p class="personnel_new_cont_txt">
              政治面貌：
              <span
                v-for="item in  Politics"
                v-if="CoreInfo.politicsOutlook==item.sortCode"
              >{{item.name}}</span>
            </p>
            <p class="personnel_new_cont_txt">籍贯：{{CoreInfo.basicInfoNativePlace}}</p>
            <p class="personnel_new_cont_txt">出生地：{{CoreInfo.basicInfoBirthAddress}}</p>
          </div>
        </Col>
        <Col span="7">
          <div class="personnel_base_info">
            <h4>工作日期</h4>
            <p
              class="personnel_new_cont_txt"
              style="margin-top:20px"
            >参加工作时间：{{getLocalTime(CoreInfo.startWorkDate)}}</p>
            <p class="personnel_new_cont_txt">进入本单位时间：{{getLocalTime(CoreInfo.comeinDate)}}</p>
          </div>
        </Col>
        <Col span="5">
          <div class="personnel_base_info">
            <h4>最高学历</h4>
            <p class="personnel_new_cont_txt" style="margin-top:20px">
              最高学历：
              <span
                v-for=" item in EducationType"
                v-if="CoreInfo.eduHighestEducation == item.itemvalue1"
              >{{item.name}}</span>
            </p>
            <p class="personnel_new_cont_txt">毕业学校：{{CoreInfo.eduGraduationSchool}}</p>
            <p class="personnel_new_cont_txt">
              所学专业：
              <span>{{MedicalSpecialtys}}</span>
            </p>
            <p class="personnel_new_cont_txt">毕业时间：{{ getLocalTime(CoreInfo.degGraduationTime)}}</p>
          </div>
        </Col>
        <Col span="5">
          <div class="personnel_base_info">
            <h4>最高学位</h4>
            <p class="personnel_new_cont_txt" style="margin-top:20px">
              最高学位：
              <span
                v-for=" item in HighestDegree"
                v-if="CoreInfo.degHighestdegree == item.itemvalue1"
              >{{item.name}}</span>
            </p>
            <p class="personnel_new_cont_txt">授予学校：{{CoreInfo.eduGraduationSchool}}</p>
            <p class="personnel_new_cont_txt">毕业时间：{{getLocalTime(CoreInfo.eduGraduationTime)}}</p>
          </div>
        </Col>
      </Row>
      <div class="bottom_underline"></div>
      <Row>
        <Col span="7" v-if="gwShow">
          <div class="personnel_base_info">
            <h4>岗位情况</h4>
            <p class="personnel_new_cont_txt">所在科室：{{ExtInfo.JobInfo_DepartmentName}}</p>
            <p class="personnel_new_cont_txt">
              岗位类别：
              <span
                v-for="item in MajorCategory"
                :key="item.itemvalue1"
                v-if="item.itemvalue1==ExtInfo.JobInfo_PhysicianType"
              >{{item.name}}</span>
            </p>
          </div>
        </Col>
        <Col span="7" v-if="zwShow">
          <div class="personnel_base_info">
            <h4 style="padding-buttom:10px">职称职务</h4>
            <p class="personnel_new_cont_txt">
              专业技术资格名称：
              <span
                v-for="(item,index) in QualifiedType"
                :key="index"
                v-if="item.itemvalue1==ExtInfo.PositionTitleInfo_TechnicalQualificationTitle"
              >{{item.name}}</span>
            </p>
            <p class="personnel_new_cont_txt">
              专业技术职务名称：
              <span
                v-for="item in PostTitleType"
                :key="item.itemvalue1"
                v-if="item.itemvalue1==ExtInfo.PositionTitleInfo_TechnicalPostTitle"
              >{{item.name}}</span>
            </p>
            <p class="personnel_new_cont_txt">
              行政/业务管理职务：
              <span
                v-for="(item,index) in ManagePosition"
                :key="index"
                v-if="item.itemvalue1==ExtInfo.PositionTitleInfo_ManagePosition"
              >{{item.name}}</span>
            </p>
            <p class="personnel_new_cont_txt">
              行政职务级别：
              <span
                v-for="(item,index) in ManagePositionLevel"
                :key="index"
                v-if="item.itemvalue1==ExtInfo.PositionTitleInfo_ManagePositionLevel"
              >{{item.name}}</span>
            </p>
            <p class="personnel_new_cont_txt">
              工勤技术等级：
              <span
                v-for="(item,index) in WorkTechnologyLevel"
                :key="index"
                v-if="item.itemvalue1==ExtInfo.PositionTitleInfo_WorkTechnologyLevel"
              >{{item.name}}</span>
            </p>
          </div>
        </Col>
        <Col span="10" v-if="daShow">
          <div class="personnel_base_info">
            <h4>档案编制</h4>
            <p class="personnel_new_cont_txt">
              参公管理事业编制：
              <span
                v-for="(item,index) in CompilingIdentity"
                :key="index"
                v-if="item.itemvalue1==ExtInfo.ArchivesInfo_CompilingArchives1"
              >{{item.name}}</span>
            </p>
            <p class="personnel_new_cont_txt">人事档案存放地：{{ExtInfo.ArchivesInfo_ArchivesAddress}}</p>
          </div>
        </Col>
        <Col span="10" v-if="gwyShow">
          <div class="personnel_base_info">
            <h4>公务员信息</h4>
            <p class="personnel_new_cont_txt">
              现任职称：
              <span
                v-for="(item,index) in OfficialPost"
                :key="index"
                v-if="item.itemvalue1==ExtInfo.CivilServantInfo_CivilServantsJobTitle"
              >{{item.name}}</span>
            </p>
            <p class="personnel_new_cont_txt">现任职位：{{ExtInfo.CivilServantInfo_CivilServantPost}}</p>
            <p class="personnel_new_cont_txt">
              现任职位类型：
              <span
                v-for="(item,index) in OfficialPostType"
                :key="index"
                v-if="item.itemvalue1==ExtInfo.CivilServantInfo_CivilServantPostType"
              >{{item.name}}</span>
            </p>
            <p
              class="personnel_new_cont_txt"
            >现任职务时间：{{getLocalTime(ExtInfo.CivilServantInfo_CivilServantPostTime)}}</p>
            <p
              class="personnel_new_cont_txt"
            >任同级职务时间：{{getLocalTime(ExtInfo.CivilServantInfo_CivilServantPostTime2)}}</p>
            <p class="personnel_new_cont_txt">
              现任职级：
              <span
                v-for="(item,index) in OfficialLevel"
                :key="index"
                v-if="item.itemvalue1==ExtInfo.CivilServantInfo_CivilServanRank"
              >{{item.name}}</span>
            </p>
            <p
              class="personnel_new_cont_txt"
            >任现职级时间：{{getLocalTime(ExtInfo.CivilServantInfo_CivilServantRankTime)}}</p>
          </div>
        </Col>
        <Col span="10" v-if="txShow">
          <div class="personnel_base_info">
            <h4>退休信息</h4>
            <p
              class="personnel_new_cont_txt"
            >退休类型：{{getPersonalRetireInfoType(ExtInfo.RetireInfo_RetireType)}}</p>
            <p class="personnel_new_cont_txt">退休时间：{{getLocalTime(ExtInfo.RetireInfo_RetireTime)}}</p>
            <p class="personnel_new_cont_txt">
              退休费发放部门：
              <span
                v-for="(item,index) in PensionGrantDep"
                :key="index"
                v-if="item.itemvalue1==ExtInfo.RetireInfo_PensionGrantDep"
              >{{item.name}}</span>
            </p>
            <p class="personnel_new_cont_txt">退休费上月发放金额：{{ExtInfo.RetireInfo_Pension}}</p>
          </div>
        </Col>
      </Row>
    </div>
  </div>
</template>
<style lang="less">
.personnel_dtls {
  .new_title_state {
    display: inline-block;
    width: 50px;
    height: 20px;
    line-height: 22px;
    font-size: 10px;
    margin-left: 15px;
    text-align: center;
  }
  .personnel_new_cont_txt {
    height: 30px;
    line-height: 30px;
    // text-indent: 30px;
    font-size: 13px;
  }
  .personnel_new {
    border: 1px solid #dcdee2;
    margin-bottom: 20px;
    padding: 10px 0;
    .new_box {
      padding-left: 20px;
      .personnel_new_title {
        padding-top: 10px;
        // border-bottom:1px solid #eeeeee;
        h4 {
          height: 35px;
          line-height: 35px;
          overflow: hidden;
        }
      }
      .personnel_new_cont {
        padding-top: 20px;
      }
    }
  }
  .ivu-collapse {
    background: transparent;
    border: 0;
    .ivu-collapse-item {
      margin-bottom: 20px;
      border: 1px solid #dcdee2;
      .ivu-collapse-header {
        background: #f7f7f7;
      }
    }
  }
}
.img {
  margin: 10px auto;
  width: 159px;
  height: 150px;
  img {
    width: 100%;
    height: 100%;
    // border-radius:50%
  }
}
.personnel_base_info {
  padding-top: 20px;
  padding-left: 20px;
}
.bottom_underline {
  width: 98%;
  margin: 0 auto;
  padding-top: 10px;
}
</style>
<script>
import { View, dtls } from "@/service/unitPersonalManagement";
import {
  getAccessToken,
  urlPath,
  getUserInfo,
  dateFormat,
  dataItemHandle
} from "@/libs/util";
import { Modal, Message } from "iview";
export default {
  data() {
    return {
      id: this.$route.params.id,
      coreId:this.$route.params.coreId,
      gwShow: false,
      daShow: false,
      gwyShow: false,
      zwShow: false,
      txShow: false,
      zpurl: "",
      djurl: "",
      RecentPhotos:'',
      PersonalPhoto:'',

      Politics: [],
      ManagePosition: [],
      ManagePositionLevel: [],
      WorkTechnologyLevel: [],
      PostTitleType: [],
      QualifiedType: [],
      CompilingIdentity: [],
      OfficialPost: [],
      OfficialPostType: [],
      OfficialLevel: [],
      PensionGrantDep: [],
      HighestDegree: [],
      MedicalSpecialtys: "",
      MedicalSpecialty: [],
      EducationType: [],
      MajorCategory: [],
      HrInfo: {
        hr_chk_status: "",
        identityType: "",
        insName: ""
      },
      ExtInfo: {
        basicInfoNation: "",
        basicInfoNativePlace: "",
        basicInfoBirthAddress: "",
        BasicInfo_PoliticsOutlook: "",
        JobInfo_DepartmentName: "",
        JobInfo_PhysicianType: "",
        PositionTitleInfo_TechnicalQualificationTitle: "",
        PositionTitleInfo_TechnicalPostTitle: "",
        PositionTitleInfo_ManagePosition: "",
        PositionTitleInfo_ManagePositionLevel: "",
        PositionTitleInfo_WorkTechnologyLevel: "",
        ArchivesInfo_CompilingArchives1: "",
        ArchivesInfo_ArchivesAddress: "",
        CivilServantInfo_CivilServantsJobTitle: "",
        CivilServantInfo_CivilServantPost: "",
        CivilServantInfo_CivilServantPostType: "",
        CivilServantInfo_CivilServantPostTime: "",
        CivilServantInfo_CivilServantPostTime2: "",
        CivilServantInfo_CivilServanRank: "",
        CivilServantInfo_CivilServantRankTime: "",
        RetireInfo_RetireType: "",
        RetireInfo_RetireTime: "",
        RetireInfo_PensionGrantDep: "",
        RetireInfo_Pension: ""
      },
      CoreInfo: {
        //出生地
        basicInfoBirthAddress: "",
        //民族
        basicInfoNation: "",
        //籍贯
        basicInfoNativePlace: "",
        //政治面貌
        basicInfoPoliticsOutlook: "",
        //出生日期
        birthDate: "",
        //进入本单位时间
        comeinDate: "",
        //授予学校
        eduGraduationSchool: "",
        //毕业时间
        degGraduationTim: "",
        //最高学位
        degHighestdegree: "",
        //毕业学校
        eduGraduationSchool: "",
        //毕业时间
        eduGraduationTime: "",
        //最高学历
        eduHighestEducation: "",
        //所学专业
        eduMajor: "",
        //性别
        gender: "",
        //证件号码
        idcardNo: "",
        //证件类型
        identityType: "",
        //所在单位
        insName: "",
        //姓名
        name: "",
        //参加工作时间
        startWorkDate: "",
        //学生所在院系
        stuDepartment: "",
        //学生入学时间
        stuEnrolmentTime: "",
        //学生所在学校
        stuGraduationSchool: "",
        //学生预毕业时间
        stuGraduationTime: "",
        //学生学历
        stuHighestEducation: "",
        //学生专业
        stuMajor: ""
      },
      WorkInfo: {
        startWorkDate: "",
        comeinDate: ""
      },
      EduInfo: {
        Mark: "",
        GraduationSchool: "",
        Major: "",
        GraduationTime: ""
      },
      MajorInfo: {
        Mark: "",
        GraduationSchool: "",
        GraduationTime: ""
      }
    };
  },
  mounted(){
      this.coreId=this.$route.params.coreId
      
  },
  created() {
    this.reload();
    //政治面貌
    dtls("Politics").then(res => {
      this.Politics = res.datas;
    });
    //最高学历
    dtls("EducationType").then(res => {
      this.EducationType = res.datas;
    });
    // //所学专业
    // dtls("MedicalSpecialty").then(res=>{
    //   this.MedicalSpecialty = res.datas

    // });
    //最高学位
    dtls("HighestDegree").then(res => {
      this.HighestDegree = res.datas;
    });
    //     dtls("ManagePosition").then(res=>{
    //   this.ManagePosition = res.datas
    // });
    //     dtls("ManagePositionLevel").then(res=>{
    //   this.ManagePositionLevel = res.datas
    // });
    //     dtls("WorkTechnologyLevel").then(res=>{
    //   this.WorkTechnologyLevel = res.datas
    // });
    //   dtls("PostTitleType").then(res=>{
    //   this.PostTitleType = res.datas
    // });
    //  dtls("QualifiedType").then(res=>{
    //   this.QualifiedType = res.datas
    // });
    // dtls("CompilingIdentity").then(res=>{
    //   this.CompilingIdentity = res.datas
    // });
    //   dtls("OfficialPost").then(res=>{
    //   this.OfficialPost = res.datas
    // });
    //  dtls("OfficialPostType").then(res=>{
    //   this.OfficialPostType = res.datas
    // });
    //   dtls("OfficialLevel").then(res=>{
    //   this.OfficialLevel = res.datas
    // });
    //  dtls("PensionGrantDep").then(res=>{
    //   this.PensionGrantDep = res.datas
    // });
    //  dtls("MajorCategory").then(res=>{
    //   this.MajorCategory = res.datas
    // });
  },
  methods: {
    reload() {
      let params={
        hrId:this.id,
        personalCoreId: this.coreId
      }
      View(params).then(res => {
        if (res.code == 10000) {
          this.CoreInfo = res.datas;
          this.zpurl = process.env.fileUrl + res.datas.zfileUrl;
          this.RecentPhotos = res.datas.zfileUrl

          this.MedicalSpecialtys = res.datas.eduMajor;
          this.djurl = process.env.fileUrl + res.datas.dfileUrl;
          this.PersonalPhoto = res.datas.dfileUrl

          this.getMedicalSpecialty();
        }
      });

      //实名信息
      // this.getPersonalApiRequest(
      //     "InformationManagement/selectCoreByCoreId"
      // ,urlPath({
      //     hrId: this.hrId
      // })).then(res => {
      //     let data = res.data;
      //     // if (data.code == "40000") {
      //     //     if(data.data)
      //     //         this.CoreInfo = data.data;
      //     // }
      // });
      //查询单位身份
      // this.getPersonalApiRequest(
      //     "InformationManagement/selectHrByCoreId"
      // ,urlPath({
      //     hrId: this.hrId
      // })
      // ).then(res => {
      //     let data = res.data;
      //     if (data.code == "40000") {
      //         if(data.data)
      //             this.HrInfo = data.data;
      //         this.identityType(data.data.identityType);
      //     }
      // });
      //自拍照
      // this.getPersonalApiRequest(
      //     "InformationManagement/getFileurl"
      // ,urlPath({
      //     personal_coreid: this.hrId,
      //     ptype:"24z"
      // })
      // ).then(res => {
      //     let data = res.data;
      //     if (data.code == "40000") {
      //         this.zpurl=data.data["24z"];
      //     }
      // });
      //登记照
      // this.getPersonalApiRequest(
      //     "InformationManagement/getFileurl"
      // ,urlPath({
      //     personal_coreid: this.hrId,
      //     ptype:"24d"
      // })
      // ).then(res => {
      //     let data = res.data;
      //     if (data.code == "40000") {
      //         this.djurl=data.data["24d"];
      //     }
      // });
      //工作时间
      // this.getPersonalApiRequest(
      //     "InformationManagement/selectWorkingDateByCoreId"
      // ,urlPath({
      //     hrId: this.hrId
      // })
      // ).then(res => {
      //     let data = res.data;
      //     if (data.code == "40000") {
      //         if(data.data)
      //             this.WorkInfo = data.data;
      //     }
      // });
      //查询基础信息 岗位情况 档案编制 职务职称 公务员
      // this.getPersonalApiRequest(
      //     "InformationManagement/selectPersonalExtendByCoreId"
      // ,urlPath({
      //     hrId: this.hrId
      // })
      // ).then(res => {
      //     let data = res.data;
      //     if (data.code == "40000") {
      //         if(data.data)
      //             this.ExtInfo = data.data;
      //     }
      // });
      // 查询学历
      //  this.getPersonalApiRequest(
      //     "InformationManagement/selectHighestEducationByCoreId"
      // ,urlPath({
      //     hrId: this.hrId
      // })
      // ).then(res => {
      //     let data = res.data;
      //     if (data.code == "40000") {
      //         if(data.data)
      //             this.EduInfo = data.data;
      //     }
      // });

      // 查询学位
      // this.getPersonalApiRequest(
      //     "InformationManagement/selectHighestEducationMajorByCoreId"
      // ,urlPath({
      //     hrId: this.hrId
      // })
      // ).then(res => {
      //     let data = res.data;
      //     if (data.code == "40000") {
      //         if(data.data)
      //             this.MajorInfo = data.data;
      //     }
      // });
    },
    //所学专业
    getMedicalSpecialty() {
      dtls("MedicalSpecialty").then(res => {
        let item1 = res.datas;
        let type = this.MedicalSpecialtys;
        for (var i = 0; i < item1.length; i++) {
            let value =item1[i]
            if(type ==value.itemvalue1){
                 this.MedicalSpecialtys = value.name
            }else{
               if(value.children){
                   for(let j=0;j<value.children.length;j++){
                       if(value.children[j].itemvalue1 == type){
                           this.MedicalSpecialtys =value.children[j].name
                       }
                   }
               }
            }
        }

      });
    },
    getPersonalCoreIdentityType(value) {
      let res = "";
      if (value == "0299") {
        res = "卫生行政公务员";
      } else if (value.indexOf("02") == 0) {
        res = "卫生单位在职人员";
      } else if (value.indexOf("03") == 0) {
        res = "在校医学生";
      } else if (value.indexOf("04") == 0) {
        res = "卫生系统退休人员";
      } else if (value.indexOf("05") == 0) {
        res = "其它人员";
      } else if (value.indexOf("06") == 0) {
        res = "企业公司等从业人员";
      }
      return res;
    },
    getPersonalRetireInfoType(value) {
      let res = "";
      if (value == "0401") {
        res = "退休";
      } else if (value == "0402") {
        res = "病退";
      } else if (value == "0403") {
        res = "退职";
      } else if (value == "0404") {
        res = "离休";
      }
      return res;
    },
    GetPersonalIdcardType(value) {
      let res = "";
      if (value == 1) {
        res = "身份证";
      } else if (value == 2) {
        res = "军官证";
      } else if (value == 3) {
        res = "港澳台居民通行证";
      } else if (value == 4) {
        res = "护照";
      }
      return res;
    },
    getLocalTime(nS) {
      if (!nS) return "";
      let date = new Date(nS);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      month = month < 10 ? "0" + month : month;
      day = day < 10 ? "0" + day : day;
      date = year + "-" + month + "-" + day;
      return date;
    },
    identityType(type) {
      if (type == "0299") {
        //公务员
        this.gwShow = true;
        this.daShow = true;
        this.gwyShow = true;
        this.zwShow = false;
        this.txShow = false;
      } else if (type.indexOf("02") == 0) {
        //在职
        this.gwShow = true;
        this.daShow = true;
        this.gwyShow = false;
        this.zwShow = true;
        this.txShow = false;
      } else if (type.indexOf("04") == 0) {
        //退休
        this.gwShow = false;
        this.daShow = false;
        this.gwyShow = false;
        this.zwShow = false;
        this.txShow = true;
      }
    }
  }
};
</script>
