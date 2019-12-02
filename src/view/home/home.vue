<template>
  <div class="home">
    <!-- <div class="home_top">
      <Row :gutter="20" class="home_row">
        <Col :md="6" :lg="8" :xl="6" class="home_Col">
          <div class="home_title_box">
            <div class="home_title">
              <span class="line"></span>
              <h3>机构信息</h3>
            </div>
          </div>
          <Row :gutter="5" style="height:77%">
            <Col :span="12" class="home_top_newItem">
              <div class="home_top_cont">
                <h4 v-if="insCategoryData">{{insCategoryData.xz}}</h4>
                <p>行政机构</p>
                <span class="iconfont icon-xiangmushenbao" style="color:#d81e06"></span>
              </div>
            </Col>
            <Col :span="12" class="home_top_newItem">
              <div class="home_top_cont">
                <h4 v-if="insCategoryData">{{insCategoryData.ws}}</h4>
                <p>卫生单位</p>
                <span class="iconfont icon-danwei" style="color:#1afa29"></span>
              </div>
            </Col>
            <Col :span="12" class="home_top_newItem">
              <div class="home_top_cont">
                <h4 v-if="insCategoryData">{{insCategoryData.sqwsfuz}}</h4>
                <p>卫生服务站</p>
                <span class="iconfont icon-yiyuan" style="color:#1296db"></span>
              </div>
            </Col>
            <Col :span="12" class="home_top_newItem">
              <div class="home_top_cont">
                <h4 v-if="insCategoryData">{{insCategoryData.cwss}}</h4>
                <p>村卫生室</p>
                <span class="iconfont icon-shigongdanwei" style="color:#d4237a"></span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col :md="18" :lg="16" :xl="18" class="home_Col">
          <div class="home_title_box">
            <div class="home_title">
              <span class="line"></span>
              <h3>机构类型构成</h3>
            </div>
          </div>
          <Row :gutter="5" style="height:77%">
            <Col :span="7" style="height:100%" v-if="pieData">
              <pieChart style="height: 100%;background:#ffffff;" :value="pieData" text="机构类型构成" />
            </Col>
            <Col :span="17" style="height:100%">
              <ul class="pie_hint">
                <li v-for="(item,index) in pieData" :key="index" style="width:50%;float:left">
                  <p>
                    <span class="pie_hint_color" :style="{background:pieColor[index]}"></span>
                    <strong>{{item.name}}</strong>
                    &nbsp; | &nbsp;
                    <span>{{piePercentage[index]+'%'}}</span>
                  </p>
                </li>
              </ul>
            </Col>
          </Row>
        </Col>
      </Row>
    </div> -->
    <!-- <div class="home_center">
      <Row :gutter="20" class="home_row">
        <Col :md="6" :lg="8" :xl="6" class="home_Col">
          <div class="home_title_box">
            <div class="home_title">
              <span class="line"></span>
              <h3>人员信息</h3>
            </div>
          </div>
          <Row :gutter="5" style="height:77%">
            <Col :span="24" class="home_top_newItem">
              <div class="home_top_cont">
                <h4
                  style="left: 50%;top: 50%;transform: translateY(-50%) translateX(-50%)"
                >{{this.person.allAmount}}</h4>
                <p>总人数</p>
                <span class="iconfont icon-qunliao" style="color:#d81e06"></span>
              </div>
            </Col>
            <Col :span="12" class="home_top_newItem">
              <div class="home_top_cont">
                <h4>{{this.person.registerAmount}}</h4>
                <p>注册用户</p>
                <span class="iconfont icon-tianjiayonghu" style="color:#1296db"></span>
              </div>
            </Col>
            <Col :span="12" class="home_top_newItem">
              <div class="home_top_cont">
                <h4>{{this.person.checkedAmount}}</h4>
                <p>实名认证</p>
                <span class="iconfont icon-kefujingli-" style="color:#d4237a"></span>
              </div>
            </Col>
          </Row>
        </Col>
        <Col :md="18" :lg="16" :xl="18" class="home_Col">
          <div class="home_title_box">
            <div class="home_title">
              <div class="home_tabCar" :class="{select:selectIndex==0}" @click="selectTabCar(0)">
                <h4>每月注册人员</h4>
              </div> -->
              <!-- <div class="home_tabCar" :class="{select:selectIndex==1}" @click="selectTabCar(1)">
                <h4>每月访问数量</h4>
              </div>-->
            <!-- </div>
          </div>
          <Row :gutter="5" style="height:77%">
            <barChart style="height: 100%;background: #fafafa;" :value="barData" />
          </Row>
        </Col>
      </Row>
    </div> -->
    <div class="home_bottom">
      <Row :gutter="20" class="home_row">
        <Col :md="6" :lg="8" :xl="13" class="home_Col">
          <div class="home_title_box" style="padding:0;height:15%">
            <div class="home_title">
              <span class="line"></span>
              <h3>通知公告</h3>
              <a class="more" href="https://www.hbwsrc.cn/" target="_bank">更多>></a>
            </div>
          </div>
          <ul class="home_NoticeList">
            <li v-for="(item,index) in noticeList" :key="index">
              <p class="home_NoticeList_item">
                <a
                  :href="(item.sourceAddress).indexOf('http') == '-1'? 'http://'+item.sourceAddress : item.sourceAddress"
                  target="_bank"
                >{{item.title}}</a>
              </p>
              <span class="home_NoticeList_item_time">{{(item.createDate).substring(5,10)}}</span>
            </li>
            <!-- <li>
              <p class="home_NoticeList_item">
                <a href="https://www.hbwsrc.cn/" target="_bank">我省2019年住院规范化培训和助理全科医师培训专业理论结业考核巡礼完成</a>
              </p>
              <span class="home_NoticeList_item_time">05-15</span>
            </li>
            <li>
              <p class="home_NoticeList_item">
                <a href="https://www.hbwsrc.cn/" target="_bank">2019年度湖北省健康管理师准考证打印（时间2019年4月27日）</a>
              </p>
              <span class="home_NoticeList_item_time">04-16</span>
            </li>
            <li>
              <p class="home_NoticeList_item">
                <a href="https://www.hbwsrc.cn/" target="_bank">2019年度湖北省卫生技术高级职务评审水平能力测试准考证打印</a>
              </p>
              <span class="home_NoticeList_item_time">04-16</span>
            </li>
            <li>
              <p class="home_NoticeList_item">
                <a href="https://www.hbwsrc.cn/" target="_bank">关于发放2018年度卫生专业技术资格考试合格（职称证书）</a>
              </p>
              <span class="home_NoticeList_item_time">03-21</span>
            </li>
            <li>
              <p class="home_NoticeList_item">
                <a href="https://www.hbwsrc.cn/" target="_bank">湖北省2019年3月补办卫生资格证书领取通知</a>
              </p>
              <span class="home_NoticeList_item_time">03-21</span>
            </li>-->
          </ul>
        </Col>
        <Col :md="18" :lg="16" :xl="11" class="home_Col">
          <div class="home_title_box" style="padding:0;height:15%">
            <div class="home_title">
              <span class="line"></span>
              <h3>文件列表</h3>
              <a class="more">更多>></a>
            </div>
          </div>
          <ul class="home_fileList">
            <li v-if='file1'>
              <p class="home_fileList_item">
                <a @click='watchPdf'>湖北卫生人力资源信息平台操作手册（卫生计生行政部门）.pdf</a>
              </p>
              <span class="home_fileList_item_time">11-05</span>
              <Icon @click='download' type="md-cloud-download" class="home_fileList_item_uplod" size="24" />
            </li>
            <li v-if='file2'>
              <p class="home_fileList_item">
                <a @click='watchPdf1'>湖北卫生人力资源信息平台操作手册（医疗卫生计生机构）.pdf</a>
              </p>
              <span class="home_fileList_item_time">11-05</span>
              <Icon @click='download1' type="md-cloud-download" class="home_fileList_item_uplod" size="24" />
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  </div>
</template>
<style lang="less">
.home {
  height: 100%;
  .home_title_box {
    height: 23%;
    width: 100%;
    padding-bottom: 5px;
    box-sizing: border-box;
    .home_title {
      height: 100%;
      width: 100%;
      position: relative;
      background: #fafafa;
      .line {
        position: absolute;
        left: 15px;
        top: 50%;
        width: 3px;
        height: 12px;
        transform: translateY(-50%);
        background: #2727ff;
      }
      h3 {
        position: absolute;
        left: 25px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 13px;
      }
      .more {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-weight: bold;
        color: #333333;
        font-size: 13px;
      }
      .home_tabCar {
        float: left;
        height: 100%;
        padding: 0 10px;
        margin-right: 10px;
        cursor: pointer;
        box-sizing: border-box;
        h4 {
          position: relative;
          top: 50%;
          transform: translateY(-50%);
        }
      }
      .home_tabCar.select {
        border-bottom: 2px solid #3da1ff;
        color: #3da1ff;
      }
    }
  }
  .home_row {
    height: 100%;
    .home_Col {
      height: 100%;
    }
  }
  .home_top_newItem {
    height: 50%;
    padding-bottom: 5px;
    box-sizing: border-box;
    .home_top_cont {
      height: 100%;
      background: #fafafa;
      position: relative;
      h4 {
        position: absolute;
        left: 15px;
        top: 10%;
        font-size: 20px;
      }
      p {
        position: absolute;
        left: 15px;
        bottom: 10%;
        font-size: 12px;
      }
      .iconfont {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        font-size: 38px;
      }
    }
  }
  .pie_hint {
    // display: flex;
    height: 100%;
    flex-direction: column;
    li {
      list-style: none;
      width: 50%;
      height: 25px;
      float: left;
      // flex: 1;
      p {
        position: relative;
        top: 50%;
        transform: translateY(-50%);
        strong {
          width: 200px;
          display: inline-block;
          padding-left: 10px;
        }
      }
      .pie_hint_color {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
      }
    }
  }
  .home_top {
    width: 100%;
    height: 32%;
    padding-bottom: 10px;
    box-sizing: border-box;
  }
  .home_center {
    width: 100%;
    height: 32%;
    padding-bottom: 10px;
    box-sizing: border-box;
  }
  .home_bottom {
    width: 100%;
    height: 36%;
    .home_NoticeList {
      height: 85%;
      background: #fafafa;
      li {
        height: 16.5%;
        list-style: none;
        position: relative;
        .home_NoticeList_item {
          position: relative;
          top: 50%;
          transform: translateY(-50%);
          font-size: 13px;
          color: #333333;
          padding: 0 150px 0 15px;
          box-sizing: border-box;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          a {
            color: #333333;
          }
        }
        .home_NoticeList_item a:hover {
          color: #3ba1ff;
        }
        .home_NoticeList_item_time {
          position: absolute;
          right: 30px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 13px;
        }
      }
    }
    .home_fileList {
      height: 85%;
      background: #fafafa;
      li {
        height: 16.5%;
        list-style: none;
        position: relative;
        .home_fileList_item {
          position: relative;
          top: 50%;
          transform: translateY(-50%);
          font-size: 13px;
          color: #333333;
          padding: 0 200px 0 15px;
          box-sizing: border-box;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          a {
            color: #333333;
          }
        }
        .home_fileList_item a:hover {
          color: #3ba1ff;
        }
        .home_fileList_item_time {
          position: absolute;
          right: 150px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 13px;
        }
        .home_fileList_item_uplod {
          position: absolute;
          right: 50px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
        }
      }
    }
  }
}
</style>
<script>
import pieChart from "./charts/pie";
import barChart from "./charts/bar";
import echartsData from "./charts/data.json";
import { Modal, Message } from "iview";
import { getPercentWithPrecision , getUserInfo} from "@/libs/util.js";
import { mapState } from 'vuex'
import {
  searchUnitReport,
  searchPerson,
  registerPerson,
  adList
} from "@/service/home";
export default {
  data() {
    return {
      //机构类别源数据
      insCategoryData: null,
      pieData: null,
      person: {
        allAmount: "",
        checkedAmount: "",
        registerAmount: ""
      },
      noticeList: [],
      pieNumber: null,
      pieColor: [],
      piePercentage: [],
      //访问量
      barData: [],
      barData1: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      selectIndex: 0,
      file1:true,
      file2:true,
      userMsg:null
    };
  },
  components: {
    pieChart,
    barChart
  },
  computed:{
    objs(){
      return this.$store.state.user.userInfo
    }
  },
  watch:{
    objs(){
      this.getAdList()
    }
  },
  created() {
    // this.reload();
    this.searchUnitReport();
    this.searchPerson();
    this.registerPerson();
    // this.getAdList()
    this.pieColor = echartsData.color
    // let objs = getUserInfo()
  },
  methods: {
    //获取广告列表
    getAdList(){
      if (this.objs.categoryKey.startsWith("0")) {
        this.file2 = false;
        let params = {
          page: {
            pageNum: 1,
            pageSize: 6,
            orderBy: ""
          },
          newsType: "XZIns",
          title: ""
        };
        adList(params).then(res => {
          if (res.datas.length > 0 ) {
            this.noticeList = res.datas;
          } else {
            this.noticeList = [];
          }
        });
      } else if (!this.objs.categoryKey.startsWith("0")) {
        this.file1 = false;
        let params = {
          page: {
            pageNum: 1,
            pageSize: 6,
            orderBy: ""
          },
          newsType: "WSIns",
          title: ""
        };
        adList(params).then(res => {
          if (res.datas.length > 0 ) {
            this.noticeList = res.datas;
          } else {
            this.noticeList = [];
          }
        });
      } else if (this.objs.username == "administrator") {
        let params = {
          page: {
            pageNum: 1,
            pageSize: 6,
            orderBy: ""
          },
          newsType: "WSIns,XZIns",
          title: ""
        };
        adList(params).then(res => {
          if (res.datas.length > 0 ) {
            this.noticeList = res.datas;
          } else {
            this.noticeList = [];
          }
        });
      }
    },
    // 查询机构信息以及机构类别构成
    searchUnitReport() {
      searchUnitReport().then(res => {
        if (res.datas) {
          this.insCategoryData = res.datas;
          this.pieData = [
            {
              value: this.insCategoryData.a,
              name: "医院"
            },
            {
              value: this.insCategoryData.b,
              name: "社区卫生服务中心（站）"
            },
            {
              value: this.insCategoryData.c,
              name: "卫生院"
            },
            {
              value: this.insCategoryData.d,
              name: "门诊部、诊所、医务室、村卫生室"
            },
            {
              value: this.insCategoryData.e,
              name: "急救中心（站）"
            },
            {
              value: this.insCategoryData.f,
              name: "采供血机构"
            },
            {
              value: this.insCategoryData.g,
              name: "妇幼保健院(所、站)"
            },
            {
              value: this.insCategoryData.h,
              name: "专科疾病防治院(所、站)"
            },
            {
              value: this.insCategoryData.j,
              name: "疾病预防控制中心(防疫站)"
            },
            {
              value: this.insCategoryData.k,
              name: "卫生监督所(局)"
            },
            {
              value: this.insCategoryData.l,
              name: "卫生监督检验(监测、检测)所(站)"
            },
            {
              value: this.insCategoryData.o,
              name: "健康教育所(站、中心)"
            },
            {
              value: this.insCategoryData.q,
              name: "卫生社会团体"
            },
            {
              value: this.insCategoryData.m,
              name: "医学科学研究机构"
            },
            {
              value: this.insCategoryData.n,
              name: "医学教育机构"
            },
            {
              value: this.insCategoryData.p,
              name: "其他卫生机构"
            }
          ];
          this.pieNumber = [
            this.insCategoryData.a,
            this.insCategoryData.b,
            this.insCategoryData.c,
            this.insCategoryData.d,
            this.insCategoryData.e,
            this.insCategoryData.f,
            this.insCategoryData.g,
            this.insCategoryData.h,
            this.insCategoryData.j,
            this.insCategoryData.k,
            this.insCategoryData.l,
            this.insCategoryData.o,
            this.insCategoryData.q,
            this.insCategoryData.m,
            this.insCategoryData.n,
            this.insCategoryData.p
          ];

          for (let index = 0; index < this.pieData.length; index++) {
            let Percentage = getPercentWithPrecision(this.pieNumber, index, 1);
            this.piePercentage.push(Percentage);
          }
        }
      });
    },
    //  查询人员构成
    searchPerson() {
      searchPerson().then(res => {
        if (res.datas) {
          this.person = res.datas;
        }
      });
    },
    //  查询人员注册
    registerPerson() {
      registerPerson().then(res => {
        if (res.datas) {
          for (let i = 0; i < res.datas.length; i++) {
            let value = res.datas[i];
            this.barData1[value.month - 1] = value.register;
          }
          this.barData = this.barData1;
        }
      });
    },
    reload() {
      this.getRequest("data_statistical/category", "").then(res => {
        let data = res.data;
        if (data.code == 40000) {
          this.insCategoryData = data.data;
          this.pieData = [
            {
              value: this.insCategoryData.a,
              name: "医院"
            },
            {
              value: this.insCategoryData.b,
              name: "社区卫生服务中心（站）"
            },
            {
              value: this.insCategoryData.c,
              name: "卫生院"
            },
            {
              value: this.insCategoryData.d,
              name: "门诊部、诊所、医务室、村卫生室"
            },
            {
              value: this.insCategoryData.e,
              name: "急救中心（站）"
            },
            {
              value: this.insCategoryData.f,
              name: "采供血机构"
            },
            {
              value: this.insCategoryData.g,
              name: "妇幼保健院(所、站)"
            },
            {
              value: this.insCategoryData.h,
              name: "专科疾病防治院(所、站)"
            },
            {
              value: this.insCategoryData.j,
              name: "疾病预防控制中心(防疫站)"
            },
            {
              value: this.insCategoryData.k,
              name: "卫生监督所(局)"
            },
            {
              value: this.insCategoryData.l,
              name: "卫生监督检验(监测、检测)所(站)"
            },
            {
              value: this.insCategoryData.o,
              name: "健康教育所(站、中心)"
            },
            {
              value: this.insCategoryData.q,
              name: "卫生社会团体"
            },
            {
              value: this.insCategoryData.m,
              name: "医学科学研究机构"
            },
            {
              value: this.insCategoryData.n,
              name: "医学教育机构"
            },
            {
              value: this.insCategoryData.p,
              name: "其他卫生机构"
            }
          ];
          this.pieNumber = [
            this.insCategoryData.a,
            this.insCategoryData.b,
            this.insCategoryData.c,
            this.insCategoryData.d,
            this.insCategoryData.e,
            this.insCategoryData.f,
            this.insCategoryData.g,
            this.insCategoryData.h,
            this.insCategoryData.j,
            this.insCategoryData.k,
            this.insCategoryData.l,
            this.insCategoryData.o,
            this.insCategoryData.q,
            this.insCategoryData.m,
            this.insCategoryData.n,
            this.insCategoryData.p
          ];

          for (let index = 0; index < this.pieData.length; index++) {
            let Percentage = getPercentWithPrecision(this.pieNumber, index, 1);
            this.piePercentage.push(Percentage);
          }
        } else {
          Message.error(data.msg);
        }
        this.loading = false;
      });
    },
    selectTabCar(index) {
      this.selectIndex = index;
      if (index == 0) {
        this.barData = [
          3253,
          4235,
          6321,
          2340,
          4643,
          1322,
          1324,
          1235,
          1423,
          1562,
          2456,
          2100
        ];
      } else {
        this.barData = [
          2563,
          1256,
          5426,
          2691,
          3412,
          2456,
          2156,
          2753,
          2681,
          3819,
          4123,
          4012
        ];
      }
    },
    adList() {
      let params = {
        page: {
          pageNum: 1,
          pageSize: 6,
          orderBy: ""
        },
        keyworks: "",
        newsType: "",
        title: ""
      };
      adList(params).then(res => {
        if (res.datas) {
          this.noticeList = res.datas;
        }
      });
    },
    download(){
      Modal.confirm({
        title: "提示信息",
        content: "确认下载【湖北卫生人力资源信息平台操作手册（卫生计生行政部门）】？",
        onOk: () => {
          let fileUrl = "../../../static/files/湖北卫生人力资源信息平台操作手册（卫生计生行政部门）.pdf"; // 文件地址
          let downName = "湖北卫生人力资源信息平台操作手册（卫生计生行政部门）.pdf"; // 文件下载名称
          let aTag = document.createElement("a"); //获取到a标签
          aTag.download = downName; //a标签下载的地址
          aTag.href = fileUrl; //a标签的跳转地址
          aTag.click(); //点击
          URL.revokeObjectURL(aTag.href);
        }
      });
    },
    download1(){
      Modal.confirm({
        title: "提示信息",
        content: "确认下载【湖北卫生人力资源信息平台操作手册（医疗卫生计生机构）】？",
        onOk: () => {
          let fileUrl = "../../../static/files/湖北卫生人力资源信息平台操作手册（医疗卫生计生机构）.pdf"; // 文件地址
          let downName = "湖北卫生人力资源信息平台操作手册（医疗卫生计生机构）.pdf"; // 文件下载名称
          let aTag = document.createElement("a"); //获取到a标签
          aTag.download = downName; //a标签下载的地址
          aTag.href = fileUrl; //a标签的跳转地址
          aTag.click(); //点击
          URL.revokeObjectURL(aTag.href);
        }
      });
    },
    watchPdf(){
      window.open('../../../static/files/湖北卫生人力资源信息平台操作手册（卫生计生行政部门）.pdf','_blank');
    },
    watchPdf1(){
      window.open('../../../static/files/湖北卫生人力资源信息平台操作手册（医疗卫生计生机构）.pdf','_blank');
    }
  }
};
</script>


