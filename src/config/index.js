export default {
    /**
     * @description 配置显示在浏览器标签的title
     */
    title: '湖北卫生人力资源信息平台',
    /**
     * @description token在Cookie中存储的天数，默认1天
     */
    cookieExpires: 1,
    /**
     * @description api请求基础路径
     */
    baseUrl: {
      dev: 'https://www.easy-mock.com/mock/5add9213ce4d0e69998a6f51/iview-admin/',//开发环境
      pro: 'https://produce.com'//测试环境
    },
    /**
     * @description 默认打开的首页的路由name值，默认为home
     */
    homeName: 'home',

    useI18n:true
  }
  