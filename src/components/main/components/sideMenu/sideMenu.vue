<template>
    <div class="SideMenu">
        <slot></slot>
        <Menu ref="menu" v-show="!collapsed" :active-name="activeName" :open-names="openedNames" :accordion="accordion" :theme="theme" width="auto" @on-select="handleSelect">
            <template v-for="item in menuList">
                <!-- <template v-if="item.children && item.children.length === 1">
                    <SideMenuItem v-if="showChildren(item)" :key="`menu-${item.name}`" :parentItem="item"></SideMenuItem>
                    <MenuItem v-else :name="getNameOrHref(item, true)" :key="`menu-${item.children[0].name}`">
                        <Icon :type="item.children[0].icon || ''" :size="iconSize"></Icon>
                        <span>{{ ShowTitle(item.children[0]) }}</span>
                    </MenuItem>
                </template>
                <template v-else>
                    <SideMenuItem v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></SideMenuItem>
                    <MenuItem v-else :name="getNameOrHref(item)" :key="`menu-${item.name}`">
                        <Icon :type="item.icon || ''" :size="iconSize"></Icon>
                        <span>{{ ShowTitle(item)}}</span>
                    </MenuItem>
                </template> -->
                <template>
                    <SideMenuItem v-if="showChildren(item)" :key="`menu-${item.name}`" :parent-item="item"></SideMenuItem>
                    <MenuItem v-else :name="getNameOrHref(item)" :key="`menu-${item.name}`">
                        <Icon :type="item.icon || ''" :size="iconSize"></Icon>
                        <span>{{ ShowTitle(item)}}</span>
                    </MenuItem>
                </template>
            </template>
        </Menu>
        <div class="menu-collapsed" v-show="collapsed" :list="menuList">
            <template v-for="item in menuList">
                <!-- <collapsedMenu v-if="item.children && item.children.length > 1" @on-click="handleSelect" hide-title :root-icon-size="rootIconSize" :icon-size="iconSize" :theme="theme" :parentItem="item" :key="`drop-menu-${item.name}`"></collapsedMenu>
                <Tooltip transfer v-else :content="ShowTitle(item.children && item.children[0] ? item.children[0] : item)" placement="right" :key="`drop-menu-${item.name}`">
                    <a @click="handleSelect(getNameOrHref(item, true))" class="drop-menu-a" :style="{textAlign: 'center'}">
                        <Icon :type="item.icon || (item.children && item.children[0].icon)" :size="rootIconSize" color="#ffffff"></Icon>
                    </a>
                </Tooltip> -->
                <collapsedMenu v-if="item.children" @on-click="handleSelect" hide-title :root-icon-size="rootIconSize" :icon-size="iconSize" :theme="theme" :parentItem="item" :key="`drop-menu-${item.name}`"></collapsedMenu>
            </template>
        </div>
    </div>
</template>
<style lang="less">
    .SideMenu{
        user-select: none;
        /******/
       .ivu-menu-dark{
            background: #262e5d;; 
        }
        .menu-item{
            background: #262e5d;;
        }
        .ivu-menu-dark .ivu-menu-item.Radio_MenuItem{
            background: #262e5d;;
        }
        .ivu-menu-dark .ivu-menu-item.Radio_MenuItem.ivu-menu-item-active{
            background: #262e5d;
        }
        .ivu-menu .ivu-menu-item{
            background: #333e82;;
        }
        .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened{
            background: #333e82;;
        }
        .ivu-menu-dark.ivu-menu-vertical .ivu-menu-opened .ivu-menu-submenu-title{
            background: #232b5a;;
        }
        .menu-item span{
            display: inline-block;
            overflow: hidden;
            width: 69px;
            text-overflow: ellipsis;
            white-space: nowrap;
            vertical-align: bottom;
            transition: width .2s ease .2s;
            color: #ffffff;
        }
        .menu-item i{
            transform: translateX(0px);
            transition: font-size .2s ease, transform .2s ease;
            vertical-align: middle;
            font-size: 16px;
        }
        .collapsed-menu span{
            width: 0px;
            transition: width .2s ease;
        }
        .collapsed-menu i{
            transform: translateX(5px);
            transition: font-size .2s ease .2s, transform .2s ease .2s;
            vertical-align: middle;
            font-size: 22px;
        }
        .Mini_menu .ivu-menu-item i{
            margin-right: 0;
            width: 45px;
            text-align: left;
        }
        .Mini_menu .ivu-menu-item{
            text-align: center;
            padding: 14px 18px;
        }
        .Mini_menu .Mini_item{
            color: rgba(255,255,255,.7);
            text-align: center;
            padding: 14px 18px;
            position: relative;
            cursor: pointer;
            z-index: 1;
            transition: all .2s ease-in-out;
            display: block;
            outline: 0;
            list-style: none;
            font-size: 14px;
        }
        .Mini_menu .ivu-poptip i{
            margin-right: 0;
            width: 45px;
            text-align: left;
        }
        .Mini_item_cont .ivu-poptip-body{
            padding: 8px 10px;
        }
        .Mini_item_cont .ivu-poptip-body .ivu-menu-item{
            padding: 14px 5px;
            color: #666666;
        }
        .Mini_item_cont .ivu-poptip-body .ivu-menu-item span{
            font-size: 13px;
            color: #666666;
        }

        .Mini_item_cont .router-link-active .ivu-menu-item{
            background: #ffffff;
            color: #2d8cf0;
        }
        .Mini_item_cont .router-link-active .ivu-menu-item span{
            color: #2d8cf0;
        }

        .ivu-menu-item{
            background: #000c17;
        }
        .router-link-active .ivu-menu-item{
            background: #2d8cf0;
        }
        .router-link-active .ivu-menu-item.Radio_MenuItem{
            background: #000c17;
            color: #2d8cf0;
        }
        .menu-collapsed{
            padding-top: 10px;

            .ivu-dropdown{
                width: 100%;
                margin-bottom: 10px;
            .ivu-dropdown-rel a{
                width: 100%;
            }
            }
            .ivu-tooltip{
                width: 100%;
                margin-bottom: 10px;
            .ivu-tooltip-rel{
                width: 100%;
            }
            .ivu-tooltip-popper .ivu-tooltip-content{
                .ivu-tooltip-arrow{
                border-right-color: #fff;
                }
                .ivu-tooltip-inner{
                background: #fff;
                color: #495060;
                }
            }
            }
             a.drop-menu-a{
                display: inline-block;
                padding: 6px 15px;
                width: 100%;
                text-align: center;
                color: #495060;
            }
        }
        .menu-title{
            padding-left: 6px;
        }
    }
</style>

<script>
import { mapState , mapMutations} from 'vuex'
import { showTitle,getUnion} from '@/libs/util'
import routers from '@/router/index'
import SideMenuItem from './sideMenuItem'
import collapsedMenu from "./../collapsedMenu/collapsedMenu"
import {getDicList} from '@/service/mark'
export default {
    name: 'SideMenu',
    props:{
        menuList: {
            type: Array,
            default () {
                return []
            }
        },
        collapsed:{
            type: Boolean
        },
        theme: {
            type: String,
            default: 'dark'
        },
        rootIconSize: {
            type: Number,
            default: 22
        },
        iconSize: {
            type: Number,
            default: 22
        },
        accordion: Boolean,
        activeName: {
            type: String,
            default: ''
        },
        OpenNames: {
            type: Array,
            default: () => []
        }
    },
    data(){
        return{
            openedNames: []
        }
    },
    components:{
        SideMenuItem,
        collapsedMenu
    },
    computed:{
        ...mapState({
            data: state => state.app.Menu
        })
    },
    created(){
        //获取用户点击的菜单展开列表
        let openName=sessionStorage.getItem("openName");
        this.openedNames.push(openName);
    },
    methods:{
        //vuex添加路由信息
        ...mapMutations([
            'setBreadCrumb',
            'setHomeRoute',
            'setTagNavList',
            'setMenuList'
        ]),
        //储存当前点击的菜单序号，为了刷新展开选中的菜单
        openName(order){
            sessionStorage.setItem("openName",order);
        },
        //
        closeMenu(){
            this.openNames=[];
        },
        handleSelect (name) {
            this.$emit('on-select', name)
        },

        ShowTitle (item) {
            return showTitle(item)
        },
        showChildren (item) {
            // return item.children && (item.children.length > 1 || (item.meta && item.meta.showAlways))
             return item.children;
        },
        getNameOrHref (item, children0) {
            return item.href ? `isTurnByHref_${item.href}` : (children0 ? item.children[0].name : item.name)
        },
        getOpenedNamesByActiveName (name) {
            return this.$route.matched.map(item => item.name).filter(item => item !== name)
        }
    },
    //监听路由信息
    watch: {
        '$route' (newRoute) {
            const { name, query, params, meta } = newRoute
            // this.addTag({
            //     route: { name, query, params, meta },
            //     type: 'push'
            // })
            this.setBreadCrumb(newRoute)
        },
        activeName (name) {
            if(this.openedNames.length > 1 ) {
                this.openedNames.splice(1,2);
            }
            if (this.accordion) this.openedNames = this.getOpenedNamesByActiveName(name)
            else this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
        },
        openNames (newNames) {
            this.openedNames = newNames
        },
        openedNames () {
            this.$nextTick(() => {
                this.$refs.menu.updateOpened()
            })
        }
    },
    //初始化获取路由信息
    mounted(){
        this.openedNames = getUnion(this.openedNames, this.getOpenedNamesByActiveName(name))
        this.setHomeRoute(routers.options.routes);
        this.setBreadCrumb(this.$route);
    }
}
</script>

