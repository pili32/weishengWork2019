// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import 'es6-promise/auto'
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import md5 from 'js-md5'
import router from './router'
import store from './store/index.js'
import 'iview/dist/styles/iview.css';
import BaiduMap from 'vue-baidu-map'
import VueQriously from 'vue-qriously'
Vue.use(VueQriously)
import VXETable from 'vxe-table'
import 'vxe-table/lib/index.css'
Vue.use(VXETable)
import {
  Content,
  Row,
  Col,
  Button, 
  ButtonGroup, 
  Table, 
  Icon, 
  Layout, 
  Sider, 
  Menu, 
  MenuItem, 
  Submenu, 
  Tooltip, 
  Poptip, 
  Breadcrumb, 
  BreadcrumbItem, 
  Dropdown, Badge, 
  Avatar, 
  DropdownMenu, 
  DropdownItem, 
  Tag,
  Card,
  Form,
  FormItem,
  Input,
  Spin,
  Page,
  Select,
  Option,
  DatePicker,
  Modal,
  RadioGroup,
  Radio,
  CheckboxGroup,
  Checkbox,
  Tabs,
  TabPane,
  Upload,
  Steps,
  Step,
  Collapse,
  Panel,
  Cascader
} from 'iview';
Vue.component("Cascader",Cascader);
Vue.component("Content",Content);
Vue.component('Row', Row);
Vue.component('Col', Col);
Vue.component('Button', Button);
Vue.component('ButtonGroup', ButtonGroup);
Vue.component('Table', Table);
Vue.component('Icon', Icon);
Vue.component('Layout', Layout);
Vue.component('Sider', Sider);
Vue.component('Menu', Menu);
Vue.component('MenuItem', MenuItem);
Vue.component('Submenu', Submenu);
Vue.component('Tooltip', Tooltip);
Vue.component('Poptip', Poptip);
Vue.component('Breadcrumb', Breadcrumb);
Vue.component('BreadcrumbItem', BreadcrumbItem);
Vue.component('Dropdown', Dropdown);

Vue.component('Badge', Badge);
Vue.component('Avatar', Avatar);
Vue.component('DropdownMenu', DropdownMenu);
Vue.component('DropdownItem', DropdownItem);
Vue.component('Tag', Tag);
Vue.component('Card', Card);
Vue.component('Form', Form);
Vue.component('FormItem', FormItem);
Vue.component('Input', Input);
Vue.component('Spin', Spin);
Vue.component('Page', Page);
Vue.component('Select', Select);
Vue.component('Option', Option);
Vue.component('DatePicker', DatePicker);
Vue.component('Modal', Modal);
Vue.component('RadioGroup', RadioGroup);
Vue.component('Radio', Radio);
Vue.component('CheckboxGroup', CheckboxGroup);
Vue.component('Checkbox', Checkbox);
Vue.component('Tabs', Tabs);
Vue.component('TabPane',TabPane);
Vue.component('Upload',Upload);
Vue.component('Steps',Steps);
Vue.component('Step',Step);
Vue.component('Collapse',Collapse);
Vue.component('Panel',Panel);
Vue.prototype.$Modal = Modal;
Vue.use(BaiduMap, {
  // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
  ak: 'F8GGZGTAevRPL7BwLtTjQvEzdAlpzqTt'
})
Vue.config.productionTip = false

import { getRequest,postRequest,deleteRequest,putRequest,getDictionaries } from '@/api/api.js'

import { getCommonApiRequest,postCommonApiRequest,deleteCommonApiRequest,putCommonApiRequest } from '@/api/api.js'

import { getPersonalApiRequest,postPersonalApiRequest,deletePersonalApiRequest,putPersonalApiRequest } from '@/api/api.js'

// 上传地址
Vue.prototype.UPLOAD_API_HOST= process.env.baseUrl + process.env.COMMON_API_HOST + 'pub/upload';
Vue.prototype.FILE_URL=process.env.fileUrl;

// 将axios挂载到prototype上，在组件中可以直接使用this.axios访问
Vue.prototype.getRequest = getRequest;
Vue.prototype.getDictionaries = getDictionaries;
Vue.prototype.postRequest = postRequest;
Vue.prototype.deleteRequest = deleteRequest;
Vue.prototype.putRequest = putRequest;

Vue.prototype.getCommonApiRequest = getCommonApiRequest;
Vue.prototype.postCommonApiRequest = postCommonApiRequest;
Vue.prototype.deleteCommonApiRequest = deleteCommonApiRequest;
Vue.prototype.putCommonApiRequest = putCommonApiRequest;

Vue.prototype.getPersonalApiRequest = getPersonalApiRequest;
Vue.prototype.postPersonalApiRequest = postPersonalApiRequest;
Vue.prototype.deletePersonalApiRequest = deletePersonalApiRequest;
Vue.prototype.putPersonalApiRequest = putPersonalApiRequest;

import '@/assets/css/Reset.css'
//兼容dataset,ie10及以下不支持dataset导致的
if (window.HTMLElement) {
  if (Object.getOwnPropertyNames(HTMLElement.prototype).indexOf('dataset') === -1) {
      Object.defineProperty(HTMLElement.prototype, 'dataset', {
          get: function () {
              var attributes = this.attributes; // 获取节点的所有属性
              var name = [];
              var value = []; // 定义两个数组保存属性名和属性值
              var obj = {}; // 定义一个空对象
              for (var i = 0; i < attributes.length; i++) { // 遍历节点的所有属性
                  if (attributes[i].nodeName.slice(0, 5) === 'data-') { // 如果属性名的前面5个字符符合"data-"
                      // 取出属性名的"data-"的后面的字符串放入name数组中
                      name.push(attributes[i].nodeName.slice(5));
                      // 取出对应的属性值放入value数组中
                      value.push(attributes[i].nodeValue);
                  }
              }
              for (var j = 0; j < name.length; j++) { // 遍历name和value数组
                  obj[name[j]] = value[j]; // 将属性名和属性值保存到obj中
              }
              return obj; // 返回对象
          },
      });
  }
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
}) 
