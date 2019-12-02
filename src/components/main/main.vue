<template>
  <div class="main">
    <Layout>
      <Sider
        ref="sider"
        hide-trigger
        collapsible
        :collapsed-width="65"
        v-model="collapsed"
        :width="290"
      >
        <SideMenu
          ref="sideMenu"
          :accordion="false"
          :active-name="$route.name"
          :collapsed="collapsed"
          @on-select="turnToPage"
          :menu-list="menuList"
        >
          <!--头部log-->
          <div class="logo-con">
            <span v-show="!collapsed">湖北卫生人力资源信息平台</span>
            <img src="./../../assets/log.png" v-show="collapsed" style="width:100%" />
          </div>
        </SideMenu>
      </Sider>
      <Layout>
        <Header :style="{padding: 0}" class="layout-header-bar">
          <Icon
            @click.native="collapsedSider"
            :class="rotateIcon"
            :style="{margin: '0 25px 0 20px'}"
            type="md-menu"
            size="26"
          ></Icon>
          <Breadcrumb />
          <User />
        </Header>
        <Content class="main-content-con">
          <!-- <router-view /> -->
          <Layout class="main-layout-con">
            <div class="tag-nav-wrapper">
              <TagsNav
                :value="$route"
                @input="handleClick"
                :list="tagNavList"
                @on-close="handleCloseTag"
              />
            </div>
            <Content class="content-wrapper">
              <keep-alive :include="cacheList">
                <router-view />
              </keep-alive>
              <!-- <ABackTop :height="100" :bottom="80" :right="50" container=".content-wrapper"></ABackTop> -->
            </Content>
          </Layout>
        </Content>
      </Layout>
    </Layout>
  </div>
</template>
<style lang="less">
.main {
  height: 100%;
  .logo-con {
    text-align: center;
    color: #fff;
    font-family: "微软雅黑";
    font-size: 18px;
    text-decoration: none;
    line-height: 60px;
  }
  .ivu-layout {
    height: 100%;
  }
  .ivu-layout-sider {
    overflow: hidden;
    background: #262e5d;
  }
  .ivu-layout-sider-children {
    overflow-y: scroll;
    height: 100%;
    margin-right: -18px;
  }
  .layout-header-bar {
    height: 64px;
    line-height: 64px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.1);
  }
  .layout-header-bar .menu-icon {
    transition: all 0.3s;
  }
  .rotate-icon {
    transform: rotate(-90deg);
  }
  /*****/
  .main-content-con {
    height: calc(100% - 60px);
    overflow: hidden;
    .main-layout-con {
      height: 100%;
      overflow: hidden;
      .tag-nav-wrapper {
        padding: 0;
        height: 40px;
        background: #f0f0f0;
      }
    }
  }
  .ivu-menu-item > i {
    margin-right: 12px !important;
  }
  .ivu-menu-submenu > .ivu-menu > .ivu-menu-item > i {
    margin-right: 8px !important;
  }
  .collased-menu-dropdown {
    width: 100%;
    margin: 0;
    line-height: normal;
    padding: 7px 0 6px 16px;
    clear: both;
    font-size: 12px !important;
    white-space: nowrap;
    list-style: none;
    cursor: pointer;
    transition: background 0.2s ease-in-out;
    .collased-menu-dropdown:hover {
      background: rgba(100, 100, 100, 0.1);
    }
    .collased-menu-dropdown * {
      color: #515a6e;
    }
    .ivu-menu-item > i {
      margin-right: 12px !important;
    }
    .ivu-menu-submenu > .ivu-menu > .ivu-menu-item > i {
      margin-right: 8px !important;
    }
  }
  .ivu-select-dropdown.ivu-dropdown-transfer {
    max-height: 400px;
  }

  .content-wrapper {
    padding: 15px 18px 10px;
    height: calc(100% - 50px);
    overflow: auto;
    background: #ffffff;
  }
}
</style>
<script>
import SideMenu from "./components/sideMenu/sideMenu";
import Breadcrumb from "./components/Breadcrumb/index";
import User from "./components/userImage/index";
import TagsNav from "./components/tags-nav/index";
import routers from "@/router/index";
import { mapMutations } from "vuex";
import { getLoginMessage } from "@/service/login"
import { setUserInfo , setUserAccess} from '@/libs/util'
import { IsCSCOrTHospital,IsZXInstitution } from '@/libs/util.js'
import Vue from "vue";
import {
  getNewTagList,
  routeEqual,
  getUserAccess,
  getUserInfo
} from "@/libs/util";
import { getDicList } from "@/service/mark";
export default {
  data() {
    return {
      collapsed: false
    };
  },
  components: {
    SideMenu,
    Breadcrumb,
    User,
    TagsNav
  },
  computed: {
    rotateIcon() {
      return ["menu-icon", this.collapsed ? "rotate-icon" : ""];
    },
    menuitemClasses() {
      return ["menu-item", this.collapsed ? "collapsed-menu" : ""];
    },
    tagNavList() {
      return this.$store.state.app.tagNavList;
    },
    tagRouter() {
      return this.$store.state.app.tagRouter;
    },
    cacheList() {
      const list = [
        "ParentView",
        ...(this.tagNavList.length
          ? this.tagNavList
              .filter(item => !(item.meta && item.meta.notCache))
              .map(item => item.name)
          : [])
      ];
      return list;
    },
    menuList() {
      return this.$store.getters.menuList;
    }
  },
  created() {
    getLoginMessage().then((res)=>{
      // if (res.data.code == 40000) {
      if (res.code == 10000) {
          let objs = res.datas;
          // setUserInfo(objs);
          this.$store.commit('setUserInfo', objs);
          //角色配置 add by xs in 2019-05-30
          var roles = new Array();
          //超级管理
          if (objs.username == "administrator" || objs.username == "administrator1") {
              roles.push("Administrator");//超管角色
          }
          //行政机构
          else if (objs.categoryKey.startsWith("0")) {
              if (objs.serviceMark == "01")//人事管理
              {
                  if (objs.accountMark == 0) //主账户
                  {
                      roles.push("XZHRAdmin");//行政人事管理角色
                      if(objs.categoryKey == "01")
                      {
                          roles.push("XZHRAdmin01");//行政人事管理角色
                      }
                  }
              } else {
                  if(objs.serviceMark == '40' || objs.serviceMark == '41' || objs.serviceMark == '42' || objs.serviceMark == '43') {
                      roles.push("YWAccount1"); //业务账号显示在校生管理
                  } else {
                      roles.push("YWAccount");//业务账号
                  }
              }
          }
          //卫生机构
          else if (!objs.categoryKey.startsWith("0")) {
              if (objs.serviceMark == "01")//人事管理
              {
                  if (objs.accountMark == 0) //主账户
                  {
                      roles.push("WSHRAdmin");//卫生人事管理角色
                      if(IsCSCOrTHospital(objs.categoryKey))
                      {
                          roles.push("CWSSFWZHRAdmin");//村卫生室（服务站人员管理）
                      }
                      if(IsZXInstitution(objs.categoryKey))
                      {
                          roles.push("ZXHRAdmin");//在校生管理
                      }
                  }
              } else {
                  if(objs.serviceMark == '40' || objs.serviceMark == '41' || objs.serviceMark == '42' || objs.serviceMark == '43') {
                      roles.push("YWAccount1"); //业务账号显示在校生管理
                  } else {
                      roles.push("YWAccount");//业务账号
                  }
              }
          }
          this.$store.commit('setAccess', roles);
          // setUserAccess(roles);
          // resolve(true)
          this.getNewMenuList();
      } else {
          Message.error(res.msg);
          // resolve(false)
      }
  });
  },
  watch: {
    $route(newRoute) {
      const { name, query, params, meta } = newRoute;
      this.addTag({
        route: { name, query, params, meta },
        type: "push"
      });
      this.setTagNavList(getNewTagList(this.tagNavList, newRoute));
    }
  },
  mounted() {
    this.setTagNavList();
    const { name, params, query, meta } = this.$route;
    this.addTag({
      route: { name, params, query, meta }
    });
    // 如果当前打开页面不在标签栏中，跳到homeName页
    if (!this.tagNavList.find(item => item.name === this.$route.name)) {
      this.$router.push({
        name: "home"
      });
    }
  },
  methods: {
    ...mapMutations(["setTagNavList", "addTag", "closeTag", "setMenuList"]),
    collapsedSider() {
      this.$refs.sider.toggleCollapse();
    },
    getNewMenuList() {
      let params = {
        page: {
          pageSize: 99,
          pageNum: 1,
          orderBy: ""
        },
        type: 0
      };
      getDicList(params).then(res => {
        if (res.datas.length > 0) {
          let arr = [];
          for (let i = 0; i < res.datas.length; i++) {
            let obj = {};
            obj.name = res.datas[i].name;
            obj.url = res.datas[i].manageUrl;
            obj.flag = `thirdProject${i}`;
            let obj1 = {};
            obj1.title = res.datas[i].name;
            obj1.access = ["Administrator", "YWAccount", "YWAccount1"];
            obj.meta = obj1;
            if ( obj.url ) {
              arr.push(obj)
            }
          }
          this.setMenuList(arr)
        } else {
          let newArr = []
          this.setMenuList(newArr)
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
        // window.open(name.split("_")[1]);
        window.open(name.substring(13))
        return;
      }
      // this.$router.push({
      //   name,
      //   params,
      //   query
      // });
      //  业务项目菜单跳转
      if (route.flag && route.flag.indexOf("thirdProject") > -1) {
        if (route.url.indexOf("http") > -1) {
          window.open(route.url, "_blank");
        } else {
          window.open("http://" + route.url, "_blank");
        }
        return;
      } else {
        this.$router.push({
          name,
          params,
          query
        });
      }
    },
    handleClick(item) {
      this.turnToPage(item);
    },
    handleCloseTag(res, type, route) {
      if (type !== "others") {
        if (type === "all") {
          this.turnToPage("home");
        } else {
          if (routeEqual(this.$route, route)) {
            this.closeTag(route);
          }
        }
      }
      this.setTagNavList(res);
    }
  }
};
</script>

