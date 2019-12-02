import Cookies from 'js-cookie'
import config from '@/config/index.js'
const { title, cookieExpires, useI18n } = config
import { Vuex } from 'vuex'
import store from '../store'

export const forEach = (arr, fn) => {
  if (!arr.length || !fn) return
  let i = -1
  let len = arr.length
  while (++i < len) {
    let item = arr[i]
    fn(item, i, arr)
  }
}
/**
 * @param {Array} routeMetched 当前路由metched
 * @returns {Array}
 */
export const getBreadCrumbList = (route, homeRoute) => {
  let homeItem = { ...homeRoute, icon: homeRoute.meta.icon }
  let routeMetched = route.matched
  if (routeMetched.some(item => item.name === homeRoute.name)) return [homeItem]
  let res = routeMetched.filter(item => {
    return item.meta === undefined || !item.meta.hideInBread
  }).map(item => {
    let meta = { ...item.meta }
    if (meta.title && typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true
      meta.title = meta.title(route)
    }
    let obj = {
      icon: (item.meta && item.meta.icon) || '',
      name: item.name,
      meta: meta
    }
    return obj
  })
  res = res.filter(item => {
    return !item.meta.hideInMenu
  })
  return [{ ...homeItem, to: homeRoute.path }, ...res]
}

/**
* @param {Array} routers 路由列表数组
* @description 用于找到路由列表中name为home的对象
*/
export const getHomeRoute = (routers, homeName = 'home') => {
  let i = -1
  let len = routers.length
  let homeRoute = {}
  while (++i < len) {
    let item = routers[i]
    if (item.children && item.children.length) {
      let res = getHomeRoute(item.children, homeName)
      if (res.name) return res
    } else {
      if (item.name === homeName) homeRoute = item
    }
  }
  return homeRoute
}

/**
 * @param {*} obj1 对象
 * @param {*} obj2 对象
 * @description 判断两个对象是否相等，这两个对象的值只能是数字或字符串
 */
const objEqual = (obj1, obj2) => {
  const keysArr1 = Object.keys(obj1)
  const keysArr2 = Object.keys(obj2)
  if (keysArr1.length !== keysArr2.length) return false
  else if (keysArr1.length === 0 && keysArr2.length === 0) return true
  /* eslint-disable-next-line */
  else return !keysArr1.some(key => obj1[key] != obj2[key])
}

/**
 * @param {Number} times 回调函数需要执行的次数
 * @param {Function} callback 回调函数
 */
export const doCustomTimes = (times, callback) => {
  let i = -1
  while (++i < times) {
    callback(i)
  }
}

/****
 * 
 * 
 */
export const showTitle = (item) => {
  let { title, __titleIsFunction__ } = item.meta
  if (!title) return
  if (useI18n) {
    if (title.includes('{{') && title.includes('}}') && useI18n) title = title.replace(/({{[\s\S]+?}})/, (m, str) => str.replace(/{{([\s\S]*)}}/, (m, _) => vm.$t(_.trim())))
    else if (__titleIsFunction__) title = item.meta.title
    // else title = vm.$t(item.name)
  } else title = (item.meta && item.meta.title) || item.name
  return title
}

/**
 * @returns {Array} 其中的每个元素只包含路由原信息中的name, path, meta三项
 */
export const getTagNavListFromLocalstorage = () => {
  const list = localStorage.tagNaveList
  return list ? JSON.parse(list) : []
}

/**
 * @description 本地存储和获取标签导航列表
 */
export const setTagNavListInLocalstorage = list => {
  localStorage.tagNaveList = JSON.stringify(list)
}

/**
 * @description 根据name/params/query判断两个路由对象是否相等
 * @param {*} route1 路由对象
 * @param {*} route2 路由对象
 */
export const routeEqual = (route1, route2) => {
  const params1 = route1.params || {}
  const params2 = route2.params || {}
  const query1 = route1.query || {}
  const query2 = route2.query || {}
  return (route1.name === route2.name) && objEqual(params1, params2) && objEqual(query1, query2)
}

/**
 * @param {Array} list 标签列表
 * @param {String} name 当前关闭的标签的name
 */
export const getNextRoute = (list, route) => {
  let res = {}
  if (list.length === 2) {
    res = getHomeRoute(list)
  } else {
    const index = list.findIndex(item => routeEqual(item, route))
    if (index === list.length - 1) res = list[list.length - 2]
    else res = list[index + 1]
  }
  return res
}

/***
 * 
 */
export const getRouteTitleHandled = (route) => {
  let router = { ...route }
  let meta = { ...route.meta }
  let title = ''
  if (meta.title) {
    if (typeof meta.title === 'function') {
      meta.__titleIsFunction__ = true
      title = meta.title(router)
    } else title = meta.title
  }
  meta.title = title
  router.meta = meta
  return router
}

/**
 * 判断打开的标签列表里是否已存在这个新添加的路由对象
 */
export const routeHasExist = (tagNavList, routeItem) => {
  let len = tagNavList.length
  let res = false
  doCustomTimes(len, (index) => {
    if (routeEqual(tagNavList[index], routeItem)) res = true
  })
  return res
}

/**
 * @param {*} list 现有标签导航列表
 * @param {*} newRoute 新添加的路由原信息对象
 * @description 如果该newRoute已经存在则不再添加
 */
export const getNewTagList = (list, newRoute) => {
  const { name, path, meta } = newRoute
  let newList = [...list]
  if (newList.findIndex(item => item.name === name) >= 0) return newList
  else newList.push({ name, path, meta })
  return newList
}




export const hasChild = (item) => {
  return item.children && item.children.length !== 0
}


const showThisMenuEle = (item, access) => {
  if (item.meta && item.meta.access && item.meta.access.length) {
    if (hasOneOf(item.meta.access, access)) return true
    else return false
  } else return true
}
/**
 * @param {Array} list 通过路由列表得到菜单列表
 * @returns {Array}
 */
export const getMenuByRouter = (list, access , newList) => {
  let res = []
  forEach(list, item => {
    if (!item.meta || (item.meta && !item.meta.hideInMenu)) {
      let obj = {
        icon: (item.meta && item.meta.icon) || '',
        name: item.name,
        meta: item.meta,
      }
      if (item.flag) {
        obj.flag = item.flag;
      }
      if (item.url) {
        obj.url = item.url;
      }
      if ((hasChild(item) || (item.meta && item.meta.showAlways)) && showThisMenuEle(item, access)) {
        obj.children = getMenuByRouter(item.children, access)
      }
      if (item.meta && item.meta.href) obj.href = item.meta.href
      if (showThisMenuEle(item, access)) res.push(obj)
    }
  })
  return res
}


export const findNodeUpperByClasses = (ele, classes) => {
  let parentNode = ele.parentNode
  if (parentNode) {
    let classList = parentNode.classList
    if (classList && classes.every(className => classList.contains(className))) {
      return parentNode
    } else {
      return findNodeUpperByClasses(parentNode, classes)
    }
  }
}

export const ACCESSTOKEN_KEY = 'access_token';
//设置access_token
export const setAccessToken = (token) => {
  Cookies.set(ACCESSTOKEN_KEY, token, { expires: cookieExpires || 1 })
}
//获取access_token
export const getAccessToken = () => {
  const token = Cookies.get(ACCESSTOKEN_KEY)
  if (token) return token
  else return false
}
//移除access_token
export const removeAccessToken = () => {
  Cookies.remove(ACCESSTOKEN_KEY);
}


export const UserInfo_KEY = 'user_info';
//储存当前用户机构登录信息用户信息
export const setUserInfo = (value) => {
  Cookies.set(UserInfo_KEY, value , { expires: cookieExpires || 1 })
}
//获取当前用户机构登录信息
export const getUserInfo = () => {
  // const UserNew = Cookies.get(UserInfo_KEY);
  // if (UserNew) return JSON.parse(UserNew);
  // else return false
  console.log(store)
  return store.state.user.userInfo
}
//移除UserInfo
export const removeUserInfo = () => {
  Cookies.remove(UserInfo_KEY);
}


export const UserAccess_KEY = 'user_access';
//设置用户权限
export const setUserAccess = (value) => {
  Cookies.set(UserAccess_KEY, value, { expires: cookieExpires || 1 })
}
//获取用户权限
export const getUserAccess = () => {
  const userAccess = Cookies.get(UserAccess_KEY);
  if (userAccess) return JSON.parse(userAccess);
  else return false
}
//移除UserAccess
export const removeUserAccess = () => {
  Cookies.remove(UserAccess_KEY);
}


/**
 * @description 根据当前跳转的路由设置显示在浏览器标签的title
 * @param {Object} routeItem 路由对象
 * @param {Object} vm Vue实例
 */
export const setTitle = (routeItem, vm) => {
  const handledRoute = getRouteTitleHandled(routeItem)
  const pageTitle = showTitle(handledRoute)
  const resTitle = pageTitle ? `${title} - ${pageTitle}` : title
  window.document.title = resTitle
}


/**
 * @description 绑定事件 on(element, event, handler)
 */
export const on = (function () {
  if (document.addEventListener) {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.addEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event && handler) {
        element.attachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * @description 解绑事件 off(element, event, handler)
 */
export const off = (function () {
  if (document.removeEventListener) {
    return function (element, event, handler) {
      if (element && event) {
        element.removeEventListener(event, handler, false)
      }
    }
  } else {
    return function (element, event, handler) {
      if (element && event) {
        element.detachEvent('on' + event, handler)
      }
    }
  }
})()

/**
 * @description 解析url地址拼接
 */
export const urlPath = (obj) => {
  if (obj) {
    let pathStr = "";
    let ObjLe = Object.keys(obj).length;
    Object.keys(obj).forEach(function (key, index) {
      if (index == ObjLe - 1) {
        pathStr += key + "=" + obj[key]
      } else {
        pathStr += key + "=" + obj[key] + "&"
      }
    });
    return pathStr;
  } else {
    return "";
  }
}
//  替换数据里的key值
export const convertKey = (arr, key) => {
  let newArr = [];
  arr.forEach((item, index) => {
    let newObj = {};
    for (var i = 0; i < key.length; i++) {
      newObj[key[i]] = item[Object.keys(item)[i]];
    }
    newArr.push(newObj);
  })
  return newArr;
}


//获取数据字典树形数据
export const getDataItemTreeData = (data, parent) => {
  if (!data) {
    return [];
  }
  let tree = [];
  let temp;
  for (var i = 0; i < data.length; i++) {
    if (data[i].pid == parent) {
      let objData = [];
      objData.id = data[i].itemvalue1;
      objData.label = data[i].name;
      var obj = objData;
      temp = getDataItemTreeData(data, data[i].id);
      if (temp.length > 0) {
        let objdatas = temp;
        objdatas.id = temp.itemvalue1;
        objdatas.label = temp.name;
        obj.children = objdatas;
      }
      tree.push(obj);
    }
  }
  return tree;
}

//获取树形表格数据
export const getTableTreeData = (data, parent) => {
  if (!data) {
    return [];
  }
  let tree = [];
  let temp;
  for (var i = 0; i < data.length; i++) {
    if (data[i].pid == parent) {
      var obj = data[i];
      temp = getTableTreeData(data, data[i].id);
      if (temp.length > 0) {
        let objdatas = temp;
        obj.children = objdatas;
      }
      tree.push(obj);
    }
  }
  return tree;
}


/**
 * 下拉数据字典返回数据处理，只传入字典详情数据
 * add by xs in 2019-05-07
 */
export const dataItemSelectHandle = (data) => {
  let res_data = []; if (!data) return res_data;

  for (let i = 0; i < data.length; i++) {
    let obj = {
      itemvalue1: data[i].itemvalue1,
      name: data[i].name,
    }
    res_data.push(obj);
  }
  return res_data;
}

/**
 * 树形数据字典返回数据处理，只传入字典详情数据
 * add by xs in 2019-05-07
 */
export const dataItemTreeHandle = (data) => {
  let res_data = [];
  if (!data) {
    return res_data;
  } else {
    return getDataItemTreeData(data, null);
  }
}


/**
 * 常规数据字典返回数据处理，传入接口返回完整字典数据
 * add by xs in 2019-05-07
 */
export const dataItemHandle = (data) => {
  let res_data = []; if (!data) return res_data;

  // let data_item = data.data.data.data_item;
  let data_item = data.datas;
  // let dataitem_dtls = data.data.data.data_item_dtls;
  // if (!data_item || !dataitem_dtls) {
  //   return res_data;
  // }
  if (data_item.is_tree == 1) {//返回处理树形
    return dataItemTreeHandle(dataitem_dtls);
  } else {
    // return dataItemSelectHandle(dataitem_dtls);
    return dataItemSelectHandle(data_item);
  }
}

/**
 * @param {Array} arr1
 * @param {Array} arr2
 * @description 得到两个数组的并集, 两个数组的元素为数值或字符串
 */
export const getUnion = (arr1, arr2) => {
  return Array.from(new Set([...arr1, ...arr2]))
}
/**
 * 根据机构类型判断是否为社区服务中心或乡镇卫生院
 */
export const IsCSCOrTHospital = (InsCategory) => {
  if (!InsCategory) return false;
  let array = ["B", "C"];
  let isret = false;
  array.forEach(v => {
    if (InsCategory.indexOf(v) == 0) isret = true;
  })
  return isret;
}

/**
 * 
 * 是否卫生监督机构
 */
export const IsMedicalSupervise = (InsCategory) => {
  if (!InsCategory) return false;
  let array = ["K"];
  let isret = false;
  array.forEach(v => {
    if (InsCategory.indexOf(v) == 0) isret = true;
  })
  return isret;
}

/**
 * 
 * 是否急救机构
 */
export const IsFirstAidInstitution = (InsCategory) => {
  if (!InsCategory) return false;
  let array = ["E"];
  let isret = false;
  array.forEach(v => {
    if (InsCategory.indexOf(v) == 0) isret = true;
  })
  return isret;
}

/**
 * 
 * 是否在校生管理机构
 */
export const IsZXInstitution = (InsCategory) => {
  if (!InsCategory) return false;
  let array = ["N"];
  let isret = false;
  array.forEach(v => {
    if (InsCategory.indexOf(v) == 0) isret = true;
  })
  return isret;
}
/**
 * 
 * 根据机构类型判断是否为医疗机构
 */
export const IsMedicalInstitution = (InsCategory) => {
  if (!InsCategory) return false;
  let array = ["A", "G", "H", "P1"];
  let isret = false;
  array.forEach(v => {
    if (InsCategory.indexOf(v) == 0) isret = true;
  })
  return isret;
}
/**
 * 正整数验证，解决页面无法同时验证不为空以及为整数
 * @param {*} rule
 * @param {*} value
 * @param {*} callback
 */
export const validateSequence = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('不能为空'));
  } else if (!Number.isInteger(+value)) {
    callback(new Error('输入正整数'));
  } else {
    callback();
  }
};

//格式化日期
export const dateFormat = (fmt, date) => {
  var o = {
    "M+": date.getMonth() + 1,                 //月份   
    "d+": date.getDate(),                    //日   
    "h+": date.getHours(),                   //小时   
    "m+": date.getMinutes(),                 //分   
    "s+": date.getSeconds(),                 //秒   
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
    "S": date.getMilliseconds()             //毫秒   
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}


/**
 * @param {Array} target 目标数组
 * @param {Array} arr 需要查询的数组
 * @description 判断要查询的数组是否至少有一个元素包含在目标数组中
 */
export const hasOneOf = (targetarr, arr) => {
  return targetarr.some(_ => arr.indexOf(_) > -1)
}

/**
 * @param {String|Number} value 要验证的字符串或数值
 * @param {*} validList 用来验证的列表
 */
export function oneOf (value, validList) {
  for (let i = 0; i < validList.length; i++) {
    if (value === validList[i]) {
      return true
    }
  }
  return false
}


/**
 * @param {*} access 用户权限数组，如 ['super_admin', 'admin']
 * @param {*} route 路由列表
 */
const hasAccess = (access, route) => {
  if (route.meta && route.meta.access) return hasOneOf(access, route.meta.access)
  else return true
}


/**
 * 权鉴
 * @param {*} name 即将跳转的路由name
 * @param {*} access 用户权限数组
 * @param {*} routes 路由列表
 * @description 用户是否可跳转到该页
 */
export const canTurnTo = (name, access, routes) => {
  const routePermissionJudge = (list) => {
    return list.some(item => {
      if (item.children && item.children.length) {
        return routePermissionJudge(item.children)
      } else if (item.name === name) {
        return hasAccess(access, item)
      }
    })
  }

  return routePermissionJudge(routes)
}


//获取行政机构
export const getXZdataItem = (data, parent) => {
  if (!data) {
    return [];
  }
  var tree = [];
  var temp;
  for (var i = 0; i < data.length; i++) {
    if (data[i].pid == parent) {
      let objData = [];
      objData.id = data[i].id;
      objData.label = data[i].name;
      var obj = objData;
      temp = getXZdataItem(data, data[i].id);
      if (temp.length > 0) {
        let objdatas = temp;
        objdatas.id = temp.id;
        objdatas.label = temp.name;
        obj.children = objdatas;
      }
      tree.push(obj);
    }
  }
  return tree;
}

export const xzdataItem = (data) => {
  if (!data) {
    return [];
  } else {
    return getXZdataItem(data, "null");
  }
}




/**
 * 根据业务编码获取业务类别
 * @param {*} key 
 */
export const getServiceCategory = (key) => {
  let res = "";
  switch (key) {
    case "01":
      res = "人事管理业务";
      break;
    case "10":
      res = "考试报名资格审核业务";
      break;
    case "11":
      res = "卫生专业技术资格考试";
      break;
    case "12":
      res = "护士执业资格考试";
      break;
    case "13":
      res = "卫生高级职称水平能力测试";
      break;
    case "14":
      res = "卫生高级职称评审";
      break;
    case "15":
      res = "卫生健康行业职业技能鉴定";
      break;
    case "20":
      res = "规范化培训业务";
      break;
    case "21":
      res = "助理全科医师规范化培训";
      break;
    case "22":
      res = "住院医师规范化培训";
      break;
    case "30":
      res = "继续医学教育";
      break;
  }
  return res;
}


/**
 *
 * 给定一个精度值，计算某一项在一串数据中占据的百分比，确保百分比总和是1（100%）
 * 使用最大余额法
 * Get a data of given precision, assuring the sum of percentages
 * in valueList is 1.
 * The largest remainer method is used.
 * https://en.wikipedia.org/wiki/Largest_remainder_method
 *
 * @param {Array.<number>} valueList a list of all data 一列数据
 * @param {number} idx index of the data to be processed in valueList 索引值（数组下标）
 * @param {number} precision integer number showing digits of precision 精度值
 * @return {number} percent ranging from 0 to 100 返回百分比从0到100
 */
export const getPercentWithPrecision =(valueList, idx, precision)=>{
  if (!valueList[idx]) {
    return 0
  }

  var sum = valueList.reduce(function (acc, val) {
    return acc + (isNaN(val) ? 0 : val)
  }, 0)
  if (sum === 0) {
    return 0
  }
  // console.log('sum', sum)
  // sum 9
  var digits = Math.pow(10, precision) // digits 100
  // console.log('digits', digits)
  var votesPerQuota = valueList.map(function (val) {
    return (isNaN(val) ? 0 : val) / sum * digits * 100 // 扩大比例，这样可以确保整数部分是已经确定的议席配额，小数部分是余额
  })
  // console.log('votesPerQuota', votesPerQuota)
  // votesPerQuota [ 2222.222222222222, 4444.444444444444, 3333.333333333333 ] 每一个项获得的议席配额，整数部分是已经确定的议席配额，小数部分是余额
  var targetSeats = digits * 100 // targetSeats 10000 全部的议席
  // console.log('targetSeats', targetSeats)
  var seats = votesPerQuota.map(function (votes) {
    // Assign automatic seats.
    return Math.floor(votes)
  })
  // console.log('seats', seats)
  // seats [ 2222, 4444, 3333 ] 获取配额的整数部分
  var currentSum = seats.reduce(function (acc, val) {
    return acc + val
  }, 0)
  // console.log('currentSum', currentSum)
  // 9999 表示已经配额了9999个议席，还剩下一个议席
  var remainder = votesPerQuota.map(function (votes, idx) {
    return votes - seats[idx]
  })
  // console.log('remainder', remainder)
  // [ 0.2222222222221717, 0.4444444444443434, 0.33333333333303017 ]得到每一项的余额
  // Has remainding votes. 如果还有剩余的坐席就继续分配
  while (currentSum < targetSeats) {
    // Find next largest remainder. 找到下一个最大的余额
    var max = Number.NEGATIVE_INFINITY
    var maxId = null
    for (var i = 0, len = remainder.length; i < len; ++i) {
      if (remainder[i] > max) {
        max = remainder[i]
        maxId = i
      }
    }
    // max: 0.4444444444443434, maxId 1
    // Add a vote to max remainder.
    ++seats[maxId] // 第二项，即4的占比的坐席增加1
    remainder[maxId] = 0
    ++currentSum // 总的已分配的坐席数也加1
  }

  return seats[idx] / digits

}

export const getTreeTbDataItem = (data, parent) => {
  if (!data) {
    return [];
  }
  var tree = [];
  var temp;
  for (var i = 0; i < data.length; i++) {
    if (data[i].pid == parent) {
      let objData = data[i];
      var obj = objData;
      temp = getTreeTbDataItem(data, data[i].id);
      if (temp.length > 0) {
        obj.children = temp;
      }
      tree.push(obj);
    }
  }
  return tree;
}

export const treeTbDataItem = (data) => {
  if (!data) {
    return [];
  } else {
    return getTreeTbDataItem(data, -1);
  }
}

export const treeTbDataItembyPid = (data,pid) => {
  if (!data) {
    return [];
  } else {
    return getTreeTbDataItem(data, pid);
  }
}

export const difference = (beginTime, endTime) => {
  var dateBegin = new Date(beginTime);
  var dateEnd = new Date(endTime);
  var dateDiff = dateEnd.getTime() - dateBegin.getTime(); //时间差的毫秒数
  var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000)); //计算出相差天数
  var leave1 = dateDiff % (24 * 3600 * 1000); //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000)); //计算出小时数
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000); //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000)); //计算相差分钟数
  //计算相差秒数
  var leave3 = leave2 % (60 * 1000); //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000);
  return "" + dayDiff + "天" + hours + "小时" + minutes + "分钟";
}


export const  convertTree =  (tree, map) =>{
  const result = [];
    tree.forEach((item) => {
        // 读取 map 的键值映射
        let value = item[ map.value ];
        let label = item[ map.label ];
        let children = item[ map.children ];
        // 如果有子节点，递归
        if (children) {
            children = convertTree(children, map);
        }
        result.push({ value, label, children });
    })
    return result
}

export const changeTree = (data)=>{
  for(let i = 0 ; i <data.length ; i++){
    if(data[i].children == undefined){
      delete data[i].children;
    } else {
      changeTree(data[i].children)
    }
  }
  return data;
}

//  树形字典转换为普通数组
export const transform=(data,array)=>{
  data.forEach((item,index)=>{
    let node = {};
    node.name = item.label;
    node.value = item.value;
    array.push(node);
    if(item.children){
      transform(item.children,array);
    }
  })
return array;
}
//  树形字典转换为普通数组
export const comeOutTypes=(data,array)=>{
  data.forEach((item,index)=>{
    let node = {};
    node.name = item.label;
    node.value = item.value;
    array.push(node);
    if(item.children){
      comeOutTypes(item.children,array);
    }
  })
return array;
}

/* 
* url 目标url 
* arg 需要替换的参数名称 
* arg_val 替换后的参数的值 
* return url 参数替换后的url 
*/ 
export const changeURLArg  = (url,arg,arg_val) => { 
  var pattern=arg+'=([^&]*)'; 
  var replaceText=arg+'='+arg_val; 
  if(url.match(pattern)){ 
      var tmp='/('+ arg+'=)([^&]*)/gi'; 
      tmp=url.replace(eval(tmp),replaceText); 
      return tmp; 
  }else{ 
      if(url.match('[\?]')){ 
          return url+'&'+replaceText; 
      }else{ 
          return url+'?'+replaceText; 
      } 
  } 
  return url+'\n'+arg+'\n'+arg_val; 
}

// 日期转时间戳
export const dateFormat1 = (date) => {
  let y = date.getFullYear();
  let M = date.getMonth() + 1;
  let d = date.getDate();
  let h = date.getHours();
  let m = date.getMinutes();
  let s = date.getSeconds();
  return `${y}${M}${d}${h}${m}${s}`;
}