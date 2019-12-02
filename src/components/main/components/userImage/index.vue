<template>
  <div class="header_user">
    <span class="header_user_menu" @click="Refresh">
      <Icon type="md-refresh" size="18" />&nbsp;刷新页面
    </span>
    <span class="header_user_menu" @click="proposal">
      <Icon type="ios-bulb" size="18" />&nbsp;建议帮助
    </span>
    <span>|</span>
    <span v-on:click="changeLoginIn" class="header_user_menu">
      <Icon type="md-clipboard" size="18" />&nbsp;切换账户
    </span>
    <span>|</span>
    <a>{{userObj.insName}}</a>
    <span></span>
    <Dropdown @on-click="handleClick">
      {{userObj.realName}}
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="userInfo">用户信息</DropdownItem>
        <DropdownItem name="userSecurity">账户安全</DropdownItem>
        <DropdownItem name="logout">安全退出</DropdownItem>
      </DropdownMenu>
    </Dropdown>

    <!--对话框-用户信息-->
    <Modal
      v-model="ModalShow"
      :mask-closable="false"
      class-name="vertical-center-modal"
      footer-hide
    >
      <p slot="header" style="color:#333333;font-size:16px">
        <span>管理员信息</span>
      </p>
      <userInfoEdit
        :obj="userObj"
        v-on:success="accountManagerSuccess"
        v-on:cancel="ModalShow=false;"
      ></userInfoEdit>
    </Modal>
    <!--对话框=账户安全-->
    <Modal
      v-model="userSecurityModal"
      :mask-closable="false"
      class-name="vertical-center-modal"
      footer-hide
    >
      <userSecurity v-on:cancel="userSecurityModal=false" style="height:450px;" :obj="userObj"></userSecurity>
    </Modal>
    <!--对话框-切换账户-->
    <Modal
      v-model="showSwitchAccountModal"
      :mask-closable="false"
      class-name="vertical-center-modal"
      footer-hide
      width="50%"
      loading
    >
      <p slot="header" style="color:#333333;font-size:16px">
        <span>切换账户</span>
      </p>
      <switchAccount v-on:cancel="showSwitchAccountModal=false"></switchAccount>
    </Modal>
  </div>
</template>
<style lang="less">
.change {
  width: 30%;
  margin: 10px 1.6%;
  height: 50px;
  display: inline-block;
  font-size: 9px;
  border: 1px solid #e8eaec;
  border-radius: 2px;
  background: #f7f7f7;
  cursor: pointer;
}
.header_user {
  float: right;
  vertical-align: middle;
  margin-right: 50px;
  font-size: 12px;
  font-weight: bold;
  height: 64px;
  overflow: hidden;
  span {
    padding: 0px 5px;
    font-weight: 500;
    font-size: 13px;
    vertical-align: top;
    cursor: pointer;
    display: inline-block;
  }
  .ivu-icon {
    top: -2px;
    position: relative;
  }
  .header_user_menu:hover {
    color: #57a3f3;
  }
}
// .vertical-center-modal{
//   .ivu-modal{
//       top: 50%;
//       height: 80%;
//       transform: translateY(-50%);
//       overflow: auto;
//   }
// }
</style>
<script>
import { mapActions } from "vuex";
import {
  getUserInfo,
  setAccessToken,
  removeAccessToken,
  removeUserInfo,
  removeUserAccess
} from "@/libs/util";
import { Modal, Message } from "iview";
import userInfoEdit from "@/view/accountSecure/userInfoEdit.vue";
import userSecurity from "@/view/accountSecure/userSecurity.vue";
import switchAccount from "@/view/accountSecure/switchAccount.vue";
import { changeLogin, getLoginList, getLoginMessage } from "@/service/login";
export default {
  components: { userInfoEdit, userSecurity, switchAccount },
  data() {
    return {
      messageUnreadCount: 0,
      curUserInfo: null,
      userList: [],
      ModalShow: false,
      userSecurityModal: false,
      userObj: null,
      loading: false,
      showSwitchAccountModal: false,
      proposalModal: false,
      proposalForm: {
        proposal: ""
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
      this.curUserInfo = this.objs;
      this.userObj = this.objs;
      if (!this.userObj.realName) {
        this.userObj.realName = ''
      }
    }
  },
  created() {
    // let userNew = getUserInfo();
    this.curUserInfo = this.objs
    this.userObj = this.objs
    if (!this.userObj.realName) {
      this.userObj.realName = ''
    }
  },
  methods: {
    ...mapActions(["handleLogOut", "getUserInfo"]),
    handleClick(name) {
      switch (name) {
        case "logout":
          this.logout();
          break;
        case "userInfo":
          this.userInfo();
          break;
        case "userSecurity":
          this.userSecurity();
          break;
      }
    },
    logout() {
      Modal.confirm({
        title: "提示信息",
        content: "确认退出登录？",
        onOk: () => {
          this.handleLogOut().then(() => {
            this.$router.push({
              name: "login"
              // name: "login2"
            });
          });
        }
      });
    },
    userInfo() {
      this.ModalShow = true;
    },
    userSecurity() {
      this.userSecurityModal = true;
    },
    cancel() {
      this.userSecurityModal = false;
    },
    accountManagerSuccess(data) {
      if (data == 1) {
        Message.success("操作成功！");
        this.ModalShow = false;
      } else {
        Message.error(data.msg);
      }
    },
    //  点击切换账号
    changeLoginIn() {
      this.showSwitchAccountModal = true;
    },
    //刷新
    Refresh() {
      window.location.reload();
    },
    //建议
    proposal() {
      this.$router.push({
        name: "proposal_list"
      });
    }
  }
};
</script>

