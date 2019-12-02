import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import iView from 'iview'
import store from '@/store/index'
import Main from './../components/main/main'
import parentView from '@/components/parent-view'
import {
  getAccessToken,
  setTitle,
  canTurnTo
} from '@/libs/util'
/**
 * meta除了原生参数外可配置的参数:
 * meta: {
 *  title: { String|Number|Function }
 *         显示在侧边栏、面包屑和标签栏的文字
 *         使用'{{ 多语言字段 }}'形式结合多语言使用，例子看多语言的路由配置;
 *         可以传入一个回调函数，参数是当前路由对象，例子看动态路由和带参路由
 *  hideInBread: (false) 设为true后此级路由将不会出现在面包屑中，示例看QQ群路由配置
 *  hideInMenu: (false) 设为true后在左侧菜单不会显示该页面选项
 *  notCache: (false) 设为true后页面在切换标签后不会缓存，如果需要缓存，无需设置这个字段，而且需要设置页面组件name属性和路由配置的name一致
 *  access: (null) 可访问该页面的权限数组，当前路由设置的权限会影响子路由
 *  icon: (-) 该页面在左侧菜单、面包屑和标签导航处显示的图标，如果是自定义图标，需要在图标名称前加下划线'_'
 *  beforeCloseName: (-) 设置该字段，则在关闭当前tab页时会去'@/router/before-close.js'里寻找该字段名对应的方法，作为关闭前的钩子函数
 * }
 */
const LOGIN_PAGE_NAME = 'login';
const HOME_NAME = 'home';

const routers = new Router({
  mode: 'hash',
  routes: [{
      path: '/login',
      name: 'login',
      meta: {
        title: '登录',
        hideInMenu: true
      },
      component: () => import('@/components/login/login.vue')
    },
    {
      path: '/login2',
      name: 'login2',
      meta: {
        title: '登录2',
        hideInMenu: true
      },
      component: () => import('@/components/login/login2.vue')
    },
    {
      path: '/activation',
      name: 'activation',
      meta: {
        title: '激活',
        hideInMenu: true
      },
      component: () => import('@/components/login/activation.vue')
    },
    {
      path: '/numberManage',
      name: 'numberManage',
      component: Main,
      meta: {
        hideInBread: true,
        hideInMenu: true
      },
      children: [{
        path: 'numberManage_page',
        name: 'numberManage_page',
        meta: {
          icon: 'md-notifications',
          title: '分账号管理'
        },
        component: () => import('@/view/insUserManage/subUser.vue')
      }]
    },
    {
      path: '/',
      name: '_home',
      redirect: '/home',
      component: Main,
      meta: {
        hideInMenu: true,
        notCache: true
      },
      children: [{
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: true,
          title: '首页',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('@/view/home/home')
      }]
    },
    //意见和建议
    {
      path: '/proposal',
      name: 'proposal',
      component: Main,
      meta: {
        hideInBread: true,
        hideInMenu: true
      },
      children: [{
        path: 'proposal_list',
        name: 'proposal_list',
        meta: {
          icon: 'md-notifications',
          title: '意见'
        },
        component: () => import('@/view/proposal/proposal.vue')
      }]
    },
    //系统管理
    {
      path: "/systemManage",
      name: "systemManage",
      component: Main,
      meta: {
        icon: 'md-settings',
        title: '系统管理',
        // access: ['Administrator']   
        access: ['Administrator','XZHRAdmin01']
      },
      children: [{
          path: 'xzInsManage',
          name: 'xzInsManage',
          meta: {
            title: '行政机构管理',
            access: ['Administrator', 'XZHRAdmin01']
          },
          component: () => import('@/view/insMainManage/xzList.vue')
        },
        {
          path: 'insUserManage',
          name: 'insUserManage',
          meta: {
            title: '机构账号管理',
            access: ['Administrator', 'XZHRAdmin01']
          },
          component: () => import('@/view/superAdmin/userList.vue')
        },
        // {
        //   path: 'orgUserManage',
        //   name: 'orgUserManage',
        //   meta: {
        //     title: '政务账号管理',
        //     access: ['Administrator', 'XZHRAdmin01']
        //   },
        //   component: () => import('@/view/sysManage/orgUsers/list.vue')
        // },
        {
          path: 'serviceProject',
          name: 'serviceProject',
          meta: {
            title: '业务项目管理',
            access: ['Administrator', 'XZHRAdmin01']
          },
          component: () => import('@/view/sysManage/serviceProject/list.vue')
        },
        {
          path: 'apiUserManage',
          name: 'apiUserManage',
          meta: {
            title: '接口账号管理',
            access: ['Administrator']
          },
          component: () => import('@/view/sysManage/apiUsers/list.vue')
        },
        {
          path: 'dataItem',
          name: 'dataItem',
          meta: {
            title: '数据字典管理',
            access: ['Administrator']  
            // access: ['Administrator','XZHRAdmin01']
          },
          component: () => import('@/view/sysManage/dataItem/main.vue')
        },
        // {
        //   path: 'projectManage',
        //   name: 'projectManage',
        //   meta: {
        //     /* hideInMenu: true, */
        //     title: '项目申报管理',
        //     //href: 'http://192.168.10.98:8084/#/login?token=' + getAccessToken(),
        //     href: 'http://119.96.173.225:8086/#/login?token=' + getAccessToken(),
        //     access: ['Administrator', 'XZHRAdmin01']
        //   }
        // },
        {
          path: 'personalCore',
          name: 'personalCore',
          meta: {
            title: '个人核心信息',
            access: ['Administrator', 'XZHRAdmin01']
          },
          component: () => import('@/view/sysManage/personalCore/list.vue')
        },
        {
          path: 'newsManage',
          name: 'newsManage',
          meta: {
            title: '通知公告管理',
            access: ['Administrator', 'XZHRAdmin01']
          },
          component: () => import('@/view/sysManage/news/list.vue')
        },
        {
          path: 'adviceManage',
          name: 'adviceManage',
          meta: {
            title: '建议意见管理',
            access: ['Administrator', 'XZHRAdmin01']
          },
          component: () => import('@/view/sysManage/advice/list.vue')
        },
        {
          path: 'message',
          name: 'message',
          meta: {
            title: '消息管理',
            access: ['Administrator', 'XZHRAdmin01']
          },
          component: () => import('@/view/sysManage/message/list.vue')
        },
        {
          path: 'cfgManage',
          name: 'cfgManage',
          meta: {
            title: '个人首页配置',
            access: ['Administrator', 'XZHRAdmin01']
          },
          component: () => import('@/view/sysManage/personalCfg/list.vue')
        },
        {
          path: 'Whitelisting',
          name: 'Whitelisting',
          meta: {
            title: '白名单',
            access: ['Administrator', 'XZHRAdmin01']
          },
          component: () => import('@/view/sysManage/Whitelisting/list.vue')
        },
        {
          path: 'applyManage',
          name: 'applyManage',
          meta: {
            title: '机构申请管理',
            access: ['Administrator', 'XZHRAdmin01']
          },
          component: () => import('@/view/sysManage/applyManage/list.vue')
        },
        {
          path: 'applyManageInfo/:id/:type',
          name: 'applyManageInfo',
          meta: {
            icon: 'ios-cube',
            hideInMenu: true,
            title: '机构申请详细信息',
            access: ["Administrator", "XZHRAdmin"]
          },
          component: () => import('@/view/sysManage/applyManage/apply.vue')
        },
        {
          path: 'dataSync',
          name: 'dataSync',
          meta: {
            title: '数据同步',
            access: ['Administrator', 'XZHRAdmin01']
          },
          component: () => import('@/view/sysManage/dataSync/list.vue')
        },
        {
          path: 'dataSyncInfo/:type/:status/:version/:typeText',
          name: 'dataSyncInfo',
          meta: {
            icon: 'ios-cube',
            hideInMenu: true,
            title: '数据同步详细信息',
            access: ["Administrator", "XZHRAdmin"]
          },
          component: () => import('@/view/sysManage/dataSync/sync.vue')
        },
      ]
    },
    //本单位基本管理
    {
      path: "/curInsInfo",
      name: "curInsInfo",
      component: Main,
      meta: {
        icon: 'md-albums',
        title: '本单位基本管理',
        access: ["Administrator", "XZHRAdmin", "WSHRAdmin", "YWAccount",'YWAccount1']
      },
      children: [{
          path: 'basicInfo',
          name: 'basicInfo',
          meta: {
            title: '单位信息维护',
            access: ["Administrator", "XZHRAdmin"]
          },
          component: () => import('@/view/tab/tabCarXz.vue')
        },
        {
          path: 'wsbasicInfo',
          name: 'wsbasicInfo',
          meta: {
            title: '单位信息维护',
            access: ["WSHRAdmin"]
          },
          component: () => import('@/view/tab/tabCar.vue')
        },
        {
          path: 'serviceUser',
          name: 'serviceUser',
          meta: {
            title: '业务账号管理',
            access: ["Administrator", "XZHRAdmin", "WSHRAdmin"]
          },
          component: () => import('@/view/insUserManage/serviceUser.vue')
        },
        {
          path: 'subUser',
          name: 'subUser',
          meta: {
            title: '分账号管理',
            access: ["Administrator", "XZHRAdmin", "WSHRAdmin"]  //  权限添加
          },
          component: () => import('@/view/insUserManage/subUser.vue')
        },
        {
          path: 'checkCode',
          name: 'checkCode',
          meta: {
            title: '本单位校验码',
            access: ["Administrator", "XZHRAdmin", "WSHRAdmin", "YWAccount",'YWAccount1']
          },
          component: () => import('@/view/insInfoManage/checkCode.vue')
        }
      ]
    },
    //下级机构管理
    {
      path: "/childrenInsManage",
      name: "childrenInsManage",
      component: Main,
      meta: {
        icon: 'md-briefcase',
        title: '下级机构管理',
        access: ["Administrator", "XZHRAdmin01", "XZHRAdmin"]
      },
      children: [{
          path: 'addIns',
          name: 'addIns',
          meta: {
            title: '新增机构',
            access: ["Administrator", "XZHRAdmin01"]
          },
          component: () => import('@/view/insMainManage/addIns.vue')
        },
        {
          path: 'insMainManage',
          name: 'insMainManage',
          meta: {
            title: '机构管理',
            access: ["Administrator", "XZHRAdmin"]
          },
          component: () => import('@/view/insMainManage/list.vue')
        },
        {
          path: 'userManage',
          name: 'userManage',
          meta: {
            title: '账号管理',
            access: ["Administrator", "XZHRAdmin"]
          },
          component: () => import('@/view/insUserManage/childrenUser.vue')
        },
        {
          path: 'tabCar/:id',
          name: 'tabCar',
          meta: {
            icon: 'ios-cube',
            hideInMenu: true,
            title: '机构详细信息',
            access: ["Administrator", "XZHRAdmin"]
          },
          component: () => import('@/view/tab/tabCar.vue')
        },
        {
          path: 'tabCarXz/:id',
          name: 'tabCarXz',
          meta: {
            icon: 'ios-cube',
            hideInMenu: true,
            title: '机构详细信息',
            access: ["Administrator"]
          },
          component: () => import('@/view/tab/tabCarXz.vue')
        }
      ]
    },
    //本单位实名管理
    {
      path: "/personalCoreManage",
      name: "personalCoreManage",
      component: Main,
      meta: {
        icon: 'md-medal',
        title: '本单位实名管理',
        access: ["Administrator", "XZHRAdmin", "WSHRAdmin"]
      },
      children: [{
          path: 'auditList',
          name: 'auditList',
          meta: {
            title: '实名认证审核',
            access: ["Administrator", "XZHRAdmin", "WSHRAdmin"]
          },
          component: () => import('@/view/personalInfoManage/auditList.vue')
        },
        {
          path: 'rosterList08',
          name: 'rosterList08',
          meta: {
            title: '转出申请审批',
            access: ["Administrator", "XZHRAdmin", "WSHRAdmin"]
          },
          component: () => import('@/view/personalInfoManage/list08.vue')
        },
        {
          path: 'rosterList02',
          name: 'rosterList02',
          meta: {
            title: '预传在职名单',
            access: ["Administrator", "XZHRAdmin", "WSHRAdmin"]
          },
          component: () => import('@/view/personalRosterManage/list02.vue')
        },
        {
          path: 'rosterList04',
          name: 'rosterList04',
          meta: {
            title: '预传退休名单',
            access: ["Administrator", "XZHRAdmin", "WSHRAdmin"]
          },
          component: () => import('@/view/personalRosterManage/list04.vue')
        }
      ]
    },
    //本单位人员花名册
    {
      path: "/personalInfoManage",
      name: "personalInfoManage",
      component: Main,
      meta: {
        icon: 'md-contacts',
        title: '本单位人员花名册',
        access: ["Administrator", "XZHRAdmin", "WSHRAdmin"]
      },
      children: [{
          path: 'infoList02',
          name: 'infoList02',
          meta: {
            title: '在职人员管理',
            access: ["Administrator", "XZHRAdmin", "WSHRAdmin"]
          },
          component: () => import('@/view/personalInfoManage/list02.vue')
        },
        {
          path: 'infoList04',
          name: 'infoList04',
          meta: {
            title: '退休人员管理',
            access: ["Administrator", "XZHRAdmin", "WSHRAdmin"]
          },
          component: () => import('@/view/personalInfoManage/list04.vue')
        },
        {
          path: 'infoList09',
          name: 'infoList09',
          meta: {
            title: '移除人员管理',
            access: ["Administrator", "XZHRAdmin", "WSHRAdmin"]
          },
          component: () => import('@/view/personalInfoManage/list09.vue')
        },
        {
          path: 'personaldtls/:id/:coreId',
          name: 'personaldtls',
          meta: {
            hideInMenu: true,
            icon: 'ios-cube',
            title: '人员详情',
            access: ["Administrator", "XZHRAdmin", "WSHRAdmin"]
          },
          component: () => import('@/view/personalInfoManage/dtls.vue')
        }
      ]
    },
    //村卫生室（服务站）人员管理
    {
      path: "/personalInfoCwssSqfwz",
      name: "personalInfoCwssSqfwz",
      component: Main,
      meta: {
        icon: 'md-medkit',
        title: '村卫生室（服务站）人员管理',
        access: ["Administrator", "CWSSFWZHRAdmin"]
      },
      children: [{
          path: 'auditListCwssSqfwz',
          name: 'auditListCwssSqfwz',
          meta: {
            title: '实名认证审核',
            access: ["Administrator", "CWSSFWZHRAdmin"]
          },
          component: () => import('@/view/personalInfoCwssSqfwz/auditList.vue')
        },
        {
          path: 'infoList02CwssSqfwz',
          name: 'infoList02CwssSqfwz',
          meta: {
            title: '在岗人员名册',
            access: ["Administrator", "CWSSFWZHRAdmin"]
          },
          component: () => import('@/view/personalInfoCwssSqfwz/list02.vue')
        },
        {
          path: 'infoList09CwssSqfwz',
          name: 'infoList09CwssSqfwz',
          meta: {
            title: '移除人员管理',
            access: ["Administrator", "CWSSFWZHRAdmin"]
          },
          component: () => import('@/view/personalInfoCwssSqfwz/list09.vue')
        }
      ]
    },
    //在校生管理
    {
      path: "/personalSchool",
      name: "personalSchool",
      component: Main,
      meta: {
        icon: 'logo-buffer',
        title: '在校生管理',
        access: ["Administrator",'YWAccount1']
      },
      children: [{
          path: 'rosterSchool',
          name: 'rosterSchool',
          meta: {
            title: '预传在校生名单',
            access: ["Administrator",'YWAccount1']
          },
          component: () => import('@/view/personalRosterManage/list03.vue')
        },
        {
          path: 'auditListSchool',
          name: 'auditListSchool',
          meta: {
            title: '实名认证审核',
            access: ["Administrator",'YWAccount1']
          },
          component: () => import('@/view/personalSchool/auditList.vue')
        },
        {
          path: 'infoListSchool',
          name: 'infoListSchool',
          meta: {
            title: '在校生名册',
            access: ["Administrator",'YWAccount1']
          },
          component: () => import('@/view/personalSchool/list03.vue')
        },
        {
          path: 'infoList09School',
          name: 'infoList09School',
          meta: {
            title: '移除学员名册',
            access: ["Administrator",'YWAccount1']
          },
          component: () => import('@/view/personalSchool/list09.vue')
        }
      ]
    },
    //本单位统计查询
    {
      path: "/curUnitsDataQuery",
      name: "curUnitsDataQuery",
      component: Main,
      meta: {
        icon: 'md-pie',
        title: '本单位统计查询',
        access: ["Administrator", "XZHRAdmin", "WSHRAdmin"]
      },
      children: [{
          path: 'personalxz02',
          name: 'personalxz02',
          meta: {
            title: '行政在职人员统计',
            access: ["Administrator", "XZHRAdmin"]
          },
          component: () => import('@/view/dataStatistical/xzlist02.vue')
        },
        {
          path: 'personalxz04',
          name: 'personalxz04',
          meta: {
            title: '行政退休人员统计',
            access: ["Administrator", "XZHRAdmin"]
          },
          component: () => import('@/view/dataStatistical/xzlist04.vue')
        },
        {
          path: 'personalws02',
          name: 'personalws02',
          meta: {
            title: '卫生在职人员统计',
            access: ["WSHRAdmin"]
            // access: ["WSHRAdmin","XZHRAdmin"]
          },
          component: () => import('@/view/dataStatistical/wslist02.vue')
        },
        {
          path: 'personalws04',
          name: 'personalws04',
          meta: {
            title: '卫生退休人员统计',
            access: ["WSHRAdmin"]
            // access: ["WSHRAdmin","XZHRAdmin"]
          },
          component: () => import('@/view/dataStatistical/wslist04.vue')
        },
        {
          path: 'personalQuery',
          name: 'personalQuery',
          meta: {
            title: '人员查询',
            access: ["Administrator", "XZHRAdmin", "WSHRAdmin"]
          },
          component: () => import('@/view/dataQuery/units/personalQuery.vue')
        }
      ]
    },
    //本地区统计查询
    {
      path: '/currAreaDataQuery',
      name: 'currAreaDataQuery',
      meta: {
        icon: 'md-compass',
        title: '本地区统计查询',
        access: ["Administrator", "XZHRAdmin"]
      },
      component: Main,
      children: [{
          path: 'insDataQuery',
          name: 'insDataQuery',
          meta: {
            icon: 'md-menu',
            showAlways: true,
            title: '机构统计查询',
            access: ["Administrator", "XZHRAdmin"]
          },
          component: parentView,
          children: [
            // {
            //   path: 'xzCount',
            //   name: 'xzCount',
            //   meta: {
            //     icon: 'ios-cube',
            //     hideInMenu: true,
            //     access: ["Administrator", "XZHRAdmin"],
            //     title: '卫生行政部门统计'
            //   },
            //   component: () => import('@/view/dataQuery/area/xzIns.vue')
            // },
            {
              path: 'xzQuery',
              name: 'xzQuery',
              meta: {
                access: ["Administrator", "XZHRAdmin"],
                title: '卫生行政部门查询'
              },
              component: () => import('@/view/dataQuery/area/xzIns.vue')
            },
            {
              path: 'xzCount',
              name: 'xzCount',
              meta: {
                // icon: 'ios-cube',
                // hideInMenu: true,
                access: ["Administrator", "XZHRAdmin"],
                title: '卫生行政部门统计'
              },
              component: () => import('@/view/dataQuery/area/xzInsCount.vue')
            },
            {
              path: 'wsInsCount',
              name: 'wsInsCount',
              meta: {
                access: ["Administrator", "XZHRAdmin"],
                title: '医疗卫生单位统计'
              },
              component: () => import('@/view/dataQuery/area/wsInsCount.vue')
            },
            {
              path: 'wsQuery',
              name: 'wsQuery',
              meta: {
                title: '医疗卫生单位查询',
                access: ["Administrator", "XZHRAdmin"]
              },
              component: () => import('@/view/dataQuery/area/wsIns.vue')
            }
          ]
        },
        {
          path: 'managerQuery',
          name: 'managerQuery',
          meta: {
            icon: 'md-menu',
            showAlways: true,
            title: '管理员查询',
            access: ["Administrator", "XZHRAdmin"]
          },
          component: parentView,
          children: [{
              path: 'xzManager',
              name: 'xzManager',
              meta: {
                title: '卫生行政部门',
                access: ["Administrator", "XZHRAdmin"]
              },
              component: () => import('@/view/dataQuery/area/xzUser.vue')
            },
            {
              path: 'wsManager',
              name: 'wsManager',
              meta: {
                title: '医疗卫生单位',
                access: ["Administrator", "XZHRAdmin"]
              },
              component: () => import('@/view/dataQuery/area/wsUser.vue')
            }
          ]
        },
      ]
    },
    // 业务平台
    {
      path: "/serviceMark",
      name: "serviceMark",
      component: Main,
      meta: {
        icon: 'md-medal',
        title: '业务管理平台',
        access: ["Administrator", "YWAccount",'YWAccount1']
      },
    }
  ]
});

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routers)) next() // 有权限，可访问
  else next({
    replace: true,
    name: 'error_401'
  }) // 无权限，重定向到401页面
}

routers.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  const token = getAccessToken()
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    if (to.name == "activation" || to.name == "login2" || to.name == 'login') {
      next();
    } else {
      // 未登录且要跳转的页面是登录页
      next({
        name: LOGIN_PAGE_NAME // 跳转到登录页
      })
    }

  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if (token && to.name === LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    next({
      name: HOME_NAME // 跳转到homeName页
    })
  } else {
    if (store.state.user.hasGetInfo) {
      next();
      // turnTo(to, store.state.user.access, next)
    } else {
      next();
      // store.dispatch('getUserInfo').then(user => {
      //   // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
      //   turnTo(to, user.access, next)
      // }).catch(() => {
      //   setAccessToken('')
      //   next({
      //     name: 'login'
      //   })
      // })
    }
  }
})
routers.afterEach(to => {
  setTitle(to, routers.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})
export default routers;
