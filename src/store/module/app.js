import {
    getBreadCrumbList,
    getHomeRoute,
    getTagNavListFromLocalstorage,
    setTagNavListInLocalstorage,
    routeEqual,
    getNextRoute,
    getRouteTitleHandled,
    routeHasExist,
    getMenuByRouter,
} from '@/libs/util.js'
import config from '@/config/index'
const { homeName } = config
import router from '@/router/index'
import { stringify } from 'querystring'

const closePage = (state, route) => {
    const nextRoute = getNextRoute(state.tagNavList, route)
    state.tagNavList = state.tagNavList.filter(item => {
      return !routeEqual(item, route)
    })
    router.push(nextRoute)
}

export default {
    state :{
        breadCrumbList: [],
        homeRoute: {},
        tagNavList: [],
        list:[],
        arr:[]
    },
    getters: {
        menuList: (state, getters, rootState) => getMenuByRouter(router.options.routes,rootState.user.access,state.list),
    },
    mutations:{
        setBreadCrumb(state, route){
            state.breadCrumbList = getBreadCrumbList(route, state.homeRoute);
        },
        setHomeRoute (state, routes) {
            state.homeRoute = getHomeRoute(routes, homeName)
        },
        setTagNavList (state, list) {
            let tagList = []
            if (list) {
                tagList = [...list]
            } else tagList = getTagNavListFromLocalstorage() || []
            if (tagList[0] && tagList[0].name !== homeName) tagList.shift()
            let homeTagIndex = tagList.findIndex(item => item.name === homeName)
            if (homeTagIndex > 0) {
                let homeTag = tagList.splice(homeTagIndex, 1)[0]
                tagList.unshift(homeTag)
            }
            state.tagNavList = tagList;
            setTagNavListInLocalstorage([...tagList]);
        },
        closeTag (state, route) {
            let tag = state.tagNavList.filter(item => routeEqual(item, route))
            route = tag[0] ? tag[0] : null
            if (!route) return
            closePage(state, route)
        },
        setMenuList (state, list) {
            let arr = router.options.routes;
            for(let i = 0 ; i < arr.length ; i ++) {
                if(arr[i].name === 'serviceMark'){
                    if(list.length > 0) {
                        arr[i].children = list;
                    } else {
                        arr[i].children = []
                    }
                }
            }
            state.list = arr;
        },
        addTag (state, { route, type = 'unshift' }) {
            let router = getRouteTitleHandled(route)
            if (!routeHasExist(state.tagNavList, router)) {
                if (type === 'push') state.tagNavList.push(router)
                else {
                if (router.name === homeName) state.tagNavList.unshift(router)
                else state.tagNavList.splice(1, 0, router)
                }
                setTagNavListInLocalstorage([...state.tagNavList])
            }
        }
    }
}