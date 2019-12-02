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
      <span style="color:red;" v-if="info_status==0">未完善</span>
      <span style="color:green;" v-else-if="info_status==100">已完善</span>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <Button type="primary" v-if="info_status==0" @click="CheckInfoStatus()">信息完成确认</Button>
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
import { getAccessToken, urlPath, getUserInfo } from "@/libs/util";
import { Modal, Message } from "iview";
import { finishOrgMessage, orgFinishStatus } from "@/service/xzjgAdmin";
export default {
  data() {
    return {
      ModalShow: false,
      content: null,
      selectIndex: 0,
      trialDetailChoose: "trialBaseNews",
      insId: this.$route.params.id,
      info_status: 0,
      list: [
        {
          index: 1,
          show: true,
          name: "基本信息"
        },
        {
          index: 2,
          show: true,
          name: "地址信息"
        },
        {
          index: 3,
          show: true,
          name: "内设机构"
        }
      ]
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
      this.getExtDetail();
    }
  },
  created() {
    // let userNew = getUserInfo();
    this.userNew = this.objs;
    if (!this.insId) {
      this.insId = this.userNew.insId;
    }
    this.getExtDetail();
  },
  components: {
    trialBaseNews: resolve =>
      require(["../insInfoManage/basicInfo/xzdtls.vue"], resolve),
    trialDepartment: resolve =>
      require(["../insInfoManage/depInfo/xzlist.vue"], resolve),
    trialAddress: resolve =>
      require(["../insInfoManage/addressInfo/xzdtls.vue"], resolve)
  },
  methods: {
    setCar(index, indexs) {
      this.selectIndex = indexs;
      switch (index) {
        case 1:
          this.trialDetailChoose = "trialBaseNews";
          break;
        case 2:
          this.trialDetailChoose = "trialAddress";
          break;
        case 3:
          this.trialDetailChoose = "trialDepartment";
          break;
      }
    },
    //  机构信息状态完成状态
    getExtDetail() {
      let params = {
        insId: this.insId
      };
      orgFinishStatus(params).then(res => {
        if (res.code == 10000) {
          this.info_status = res.datas;
        }
      });
    },
    CheckInfoStatus() {
      Modal.confirm({
        title: "确定",
        content: "<p>确定信息已完善？</p>",
        onOk: () => {
          let params = {
            insId: this.insId
          };
          finishOrgMessage(params).then(res => {
            if (res.code == 10000) {
              if (res.datas.code == 100) {
                Message.success("操作成功！");
                // this.info_status = res.datas.code;
                this.getExtDetail();
              } else {
                this.content = res.datas.message;
                this.ModalShow = true;
              }
            }
          });
        }
      });
    },
    onDtlsSave() {
      this.ModalShow = false;
    }
  }
};
</script>