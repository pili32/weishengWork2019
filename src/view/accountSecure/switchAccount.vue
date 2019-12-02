<template>
  <div>
    <span style="font-size:14px;color:red;">提示：点击用户名进行快速切换登录</span>
    <div class="switchAccount">
      <Row :gutter="20">
        <Col span="8" v-for="(data,index) in data" :key="index" style="margin-bottom:10px;">
          <Tag color="primary" v-if="userId==data.id">
            <p style="padding-top:12px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;">账户：{{ data.username }}</p>
            <p style="overflow:hidden;text-overflow:ellipsis;white-space: nowrap;">业务：{{data.serviceMark}}</p>
          </Tag>
          <Tag color="default" @click.native="selectVal(data)" v-else>
            <p style="padding-top:12px;overflow:hidden;text-overflow:ellipsis;white-space: nowrap;">账户：{{ data.username }}</p>
            <p style="overflow:hidden;text-overflow:ellipsis;white-space: nowrap;">业务：{{data.serviceMark}}</p>
          </Tag>
        </Col>
      </Row>
    </div>
    <Loading v-if="spinShow"></Loading>
  </div>
</template>
<style lang="less" scoped>
.switchAccount {
  .ivu-tag {
    width: 100%;
    height: 70px;
    p {
      margin: 0;
    }
  }
}
</style>
<script>
import store from "@/store/index";
import {
  getAccessToken,
  urlPath,
  getUserInfo,
  setUserInfo,
  setAccessToken,
  getUserAccess,
  getServiceCategory
} from "@/libs/util";
import { Modal, Message } from "iview";
import { mapActions, mapMutations } from "vuex";
import Loading from "@/components/base/loading";
import {changeLogin , getLoginList , getLoginMessage} from "@/service/login";
export default {
  data() {
    return {
      userId: "",
      data: [],
      spinShow: false
    };
  },
  components: {
    Loading
  },
  computed:{
    objs(){
      return this.$store.state.user.userInfo
    }
  },
  watch:{
    objs(){
      this.userId = this.objs.id
    }
  },
  created() {
    this.userId = this.objs.id;
    getLoginList().then(res=>{
        var resData = res.datas;
        if(res.datas.length > 0){
          for (let i = 0; i < resData.length; i++) {
            resData[i].serviceMark = getServiceCategory(
              resData[i].serviceMark
            );
          }
          this.data = resData;
        }
      })
    //获取当前账户下关联的账户列表
    // this.getRequest("ins_user/login_list", "").then(res => {
    //   var resData = res.data.data;
    //   if (resData) {
    //     for (let i = 0; i < resData.length; i++) {
    //       resData[i].service_mark = getServiceCategory(
    //         resData[i].service_mark
    //       );
    //     }
    //     this.data = resData;
    //   }
    //   this.loading = false;
    // });
  },
  mounted() {},
  methods: {
    ...mapActions(["getUserInfo"]),
    ...mapMutations(["setTagNavList"]),
    //取消回调事件
    cancel() {
      this.$emit("cancel"); //向父组件传值
    },
    selectVal(data) {
      Modal.confirm({
        title: "提示信息",
        content:
          "确认使用【" +
          data.serviceMark +
          "】【" +
          data.username +
          "】登录？",
        onOk: () => {
          this.spinShow = true;
          let params = {
            username:data.username
          }
          changeLogin(params).then(res=>{
            if(res.datas){
              setAccessToken(res.datas.token);
              // 1
              this.spinShow = false;
              let objs = {
                meta: {
                  hideInMenu: true,
                  title: "首页",
                  notCache: true,
                  icon: "md-home"
                },
                hideInMenu: true,
                icon: "md-home",
                notCache: true,
                title: "首页",
                name: "home",
                params: {},
                query: {}
              };
              this.turnToPage("home");
              window.location.reload();
              this.setTagNavList(objs);
              this.cancel();
              // this.getUserInfo().then(res=>{
              //   this.spinShow = false;
              //   if(res){
              //     let objs = {
              //       meta: {
              //         hideInMenu: true,
              //         title: "首页",
              //         notCache: true,
              //         icon: "md-home"
              //       },
              //       hideInMenu: true,
              //       icon: "md-home",
              //       notCache: true,
              //       title: "首页",
              //       name: "home",
              //       params: {},
              //       query: {}
              //     };
              //     this.turnToPage("home");
              //     window.location.reload();
              //     this.setTagNavList(objs);
              //     this.cancel();
              //   }
              // })
            }
          });
          // this.postRequest("ins_user/switch_login/" + data.id).then(res => {
          //   var data = res.data;
          //   if (data.code == "40000") {
          //     setAccessToken(data.data);
          //     this.getUserInfo().then(res => {
          //       this.spinShow = false;
          //       if (res) {
          //         let objs = {
          //           meta: {
          //             hideInMenu: true,
          //             title: "首页",
          //             notCache: true,
          //             icon: "md-home"
          //           },
          //           hideInMenu: true,
          //           icon: "md-home",
          //           notCache: true,
          //           title: "首页",
          //           name: "home",
          //           params: {},
          //           query: {}
          //         };
          //         this.turnToPage("home");
          //         window.location.reload();
          //         this.setTagNavList(objs);
          //         this.cancel();
          //       }
          //     });
          //   } else {
          //     Message.error(data.msg);
          //   }
          // });
        }
      });
    },
    turnToPage(route) {
      let { name, params, query } = {};
      if (typeof route === "string") name = route;
      else {
        name = route.name;
        params = route.params;
        query = route.query;
      }
      if (name.indexOf("isTurnByHref_") > -1) {
        window.open(name.split("_")[1]);
        return;
      }
      this.$router.push({
        name,
        params,
        query
      });
    }
  }
};
</script>

