import { setAccessToken, removeAccessToken, setUserInfo, removeUserInfo, setUserAccess, getUserAccess, removeUserAccess } from '@/libs/util'
import Cookies from 'js-cookie'
import { postRequest, getRequest } from '@/api/api.js'
import { IsCSCOrTHospital,IsZXInstitution } from '@/libs/util.js'
import { Message } from "iview"
import { login , getLoginMessage} from "@/service/login"
import router from '@/router/index'
export default {
    state: {
        access: '',
        userInfo: {}
    },
    mutations: {
        setAccess(state, access) {
            state.access = access
        },
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo
        },
    },
    actions: {
        // 登录
        handleLogin({ commit }, { userName, password }) {
            userName = userName.trim()
            return new Promise((resolve, reject) => {
                // postRequest("ins_account/login?user_name=" + userName + "&password=" + password, {}).then((res) => {
                //     this.spinShow = false;
                //     if (res.data.code == 40000) {
                //         setAccessToken(res.data.data);
                //         resolve(res.data.data);
                //     } else {
                //         Message.error(res.data.msg);
                //         resolve("error");
                //     }
                // });
                login({username:userName,password}).then(res=>{
                    this.spinShow = false;
                    if(res.code == 10000) {
                        setAccessToken(res.datas.token);
                        resolve(res.datas);
                    } else {
                        Message.error(res.msg);
                        resolve("error");
                    }
                })
            })
        },
        // 退出登录
        handleLogOut({ state, commit }) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    removeAccessToken();
                    removeUserInfo();
                    removeUserAccess();
                    commit('setAccess', [])
                    localStorage.removeItem("tagNaveList")
                    resolve()
                }, 500);
            })
        },
        // 获取用户相关信息
        getUserInfo({ state, commit }) {
            return new Promise((resolve, reject) => {
                try {
                    // getRequest("ins_user", "").then((res) => {
                        getLoginMessage().then((res)=>{
                        // if (res.data.code == 40000) {
                            console.log(res)
                        if (res.code == 10000) {
                            let objs = res.datas;
                            setUserInfo(objs);
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
                                    if(objs.serviceMark == '40') {
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
                                    if(objs.serviceMark == '40') {
                                        roles.push("YWAccount1"); //业务账号显示在校生管理
                                    } else {
                                       roles.push("YWAccount");//业务账号
                                    }
                                }
                            }
                            commit('setAccess', roles);
                            setUserAccess(roles);
                            resolve(true)
                        } else {
                            Message.error(res.msg);
                            resolve(false)
                        }
                    });
                } catch (error) {
                    reject(error)
                }
            })
        }
    }
}