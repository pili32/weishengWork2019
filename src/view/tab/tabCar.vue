<template>
  <div>
    <ul class="tabCar">
      <li
        v-for="(item,index) in list"
        :key="index"
        @click="setCar(item.index,index)"
        v-if="item.show"
        :class="{isSelect:index==selectIndex}"
      >
        <a>{{item.name}}</a>
      </li>
    </ul>
    <div class="insStatus">
      机构信息状态：
      <span style="color:red;" v-if="status==0">未完善</span>
      <span style="color:green;" v-else-if="status==100">已完善</span>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <Button type="primary" v-if="status==0" @click="CheckInfoStatus()">信息完成确认</Button>
    </div>
    <div class="tabCarCont">
      <component :is="trialDetailChoose"></component>
    </div>

    <Modal v-model="ModalShow" :mask-closable="false" class-name="vertical-center-modal" loading>
      <p slot="header" style="color:#333333;font-size:16px">
        <span>错误信息</span>
      </p>
      <p v-html="content"></p>
      <p slot="footer">
        <Button type="primary" size="large" @click="onDtlsSave()">确定</Button>
      </p>
    </Modal>
  </div>
</template>
<style lang="less">
.ivu-tabs .ivu-tabs-content-animated {
  height: calc(100% - 45px);
}
.tabCar {
  list-style: none;
  height: 45px;
  border-bottom: 1px solid #eeeeee;
  li {
    display: inline-block;
    margin: 0 10px;
    height: 45px;
    line-height: 45px;
    a {
      color: #333333;
    }
  }
  li.isSelect {
    border-bottom: 2px solid #2d8cf0;
    box-sizing: border-box;
    a {
      color: #2d8cf0;
    }
  }
}
.tabCarCont {
  padding: 30px 0;
}
.insStatus {
  float: right;
  margin-right: 60px;
  margin-top: -35px;
}
</style>
<script>
import {
  queryFilled,
  fullyFilled,
  queryInsBaseInfo
} from "@/service/insSubManageDtl";
import {
  getAccessToken,
  urlPath,
  getUserInfo,
  IsCSCOrTHospital,
  IsMedicalInstitution,
  IsFirstAidInstitution,
  IsMedicalSupervise,
  
} from "@/libs/util";
import { Modal, Message } from "iview";
export default {
  data() {
    return {
      ModalShow: false,
      content: null,
      selectIndex: 0,
      insId: this.$route.params.id,
      category: "",
      trialDetailChoose: "trialBaseNews",
      categoryKey:'',
      status: 0,
      categoryKey: this.$route.params.categoryKey,
      user:'',
      list: [
        {
          index: 1,
          show: true,
          name: "基本信息"
        },
        {
          index: 2,
          show: true,
          name: "机构信息"
        },
        {
          index: 3,
          show: true,
          name: "地址信息"
        },
        {
          index: 4,
          show: true,
          name: "内设机构"
        },
        {
          index: 5,
          show: false,
          name: "村卫生室设置"
        },
        {
          index: 6,
          show: false,
          name: "社区服务站设置"
        }
      ]
    };
  },
  components: {
    trialBaseNews: resolve =>
      //基本信息
      require(["../insInfoManage/basicInfo/wsdtls.vue"], resolve),
    trialHospital: resolve =>
      require(["../insInfoManage/insInfo/yydtls.vue"], resolve),
    trialAddress: resolve =>
      //地址信息
      require(["../insInfoManage/addressInfo/dtls.vue"], resolve),
    trialfwzdtls: resolve =>
      //机构信息
      require(["../insInfoManage/insInfo/fwzdtls.vue"], resolve),
    trialjjzdtls: resolve =>
      require(["../insInfoManage/insInfo/jjzdtls.vue"], resolve),
    trialwsjdsdtls: resolve =>
      require(["../insInfoManage/insInfo/wsjdsdtls.vue"], resolve),
    trialwsydtls: resolve =>
      require(["../insInfoManage/insInfo/wsy.vue"], resolve),
    trialdepartment: resolve =>
      //内设机构
      require(["../insInfoManage/depInfo/wslist.vue"], resolve),
    trialCWSS: resolve =>
      require(["../insInfoManage/insInfo/cwss.vue"], resolve),
    trialSQFWZ: resolve =>
      require(["../insInfoManage/insInfo/sqfwz.vue"], resolve)
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
    if(this.objs.categoryKey){

      this.categoryKey = this.objs.categoryKey
    }
      console.log(  this.objs.categoryKey )

      // this.getStatus();
    }
  },
  created() {
    // let userNew = getUserInfo(); 
    // this.categoryKey = this.objs.categoryKey
    this.userNew = this.objs;
      if (!this.insId) {
      this.insId = this.userNew.insId;
    }
    if(this.objs.categoryKey){

      this.categoryKey = this.objs.categoryKey
    }
      console.log(  this.objs.categoryKey )


    // console.log(  this.objs.categoryKey )

    // this.categoryKey = this.objs.categoryKey

      // sessionStorage.setItem('categoryKey', this.objs.categoryKey)


    this.getMainDetail("ins_main");
    // this.getExtDetail("ins_ext/get_status");
    // this.getStatus();
  },
  methods: {
    
    setCar(index, indexs) {
      this.selectIndex = indexs;
      switch (index) {
        case 1:
          this.trialDetailChoose = "trialBaseNews";
          break;
        case 2:
          this.trialDetailChoose = this.ReturnUrl();
          break;
        case 3:
          this.trialDetailChoose = "trialAddress";
          break;
        case 4:
          this.trialDetailChoose = "trialdepartment";
          break;
        case 5:
          this.trialDetailChoose = "trialCWSS"; //村卫生室
          break;
        case 6:
          this.trialDetailChoose = "trialSQFWZ"; //社区服务站
          break;
      }
    },
    getMainDetail(url) {
      if (IsCSCOrTHospital(this.categoryKey)) {
        this.list[4].show = true;
        this.list[5].show = true;
      }
    },
    getExtDetail() {
      //完善和为完善状态
      let params = {
        insId: this.insId
      };
      queryFilled(params).then(res => {
        if (res.code == 10000) {
          if (res.datas) {
            this.status = res.datas;
          }
        }
      });
    },
    getStatus() {
      let params = {
        insId: this.insId
      };
      queryInsBaseInfo(params).then(res => {
        this.status = res.datas.infoStatus;
      });
    },
    ReturnUrl() {
      console.log(this.categoryKey)
      console.log( sessionStorage.getItem('categoryKey'))

      let categoryKeys = ''
        if(this.categoryKey=="01" ||this.categoryKey ==undefined ){
          categoryKeys  = sessionStorage.getItem('categoryKey')

        }else{
          categoryKeys = this.categoryKey

        }
      console.log(categoryKeys)
      
      // console.log(this.categoryKey)
      //  let    categoryKeys  = sessionStorage.getItem('categoryKey')
      //  console.log(categoryKeys)

       
       
      if (IsMedicalInstitution(categoryKeys)) {
        return "trialHospital";
      } else if (IsFirstAidInstitution(categoryKeys)) {
        return "trialjjzdtls";
      } else if (IsMedicalSupervise(categoryKeys)) {
        return "trialwsjdsdtls";
      } else if (IsCSCOrTHospital(categoryKeys)) {
        return "trialwsydtls";
      } else {
        return "trialfwzdtls";
      }
    },
    CheckInfoStatus() {
      Modal.confirm({
        title: "确定",
        content: "<p>确定信息已完善？</p>",
        onOk: () => {
          setTimeout(() => {
            let params = {
              insId: this.insId
            };
            fullyFilled(params).then(res => {
              if (res.code == 10000) {
                if (res.datas.status == 0) {
                  Modal.error({
                    title: "错误",
                    content: res.datas.message
                  });
                } else {
                  this.getExtDetail();
                  Message.success("操作成功!");
                }
              } else {
                Modal.error({
                  title: "错误",
                  content: res.datas.message
                });
              }
            });
            
          }, 500);
          // let params = {
          //   insId: this.insId
          // };
          // fullyFilled(params).then(res => {
          //   if (res.code == 10000) {
          //     Message.success("操作成功!");
          //   } else {
          //     this.content = res.datas.message;
          //     this.ModalShow = true;
          //   }
          // });
        }
      });
    },
    onDtlsSave() {
      this.ModalShow = false;
    }
  }
};
</script>