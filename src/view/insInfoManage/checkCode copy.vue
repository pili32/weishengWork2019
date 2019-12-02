<template>
  <div v-bind:class="{ content,popupContent }">
    <p>本单位校验码</p>
    <p>
       <b class="code">{{this.currInsInfo==null?Code:this.currInsInfo.Code}}</b>
      <Button
        class="copy"  
        :data-clipboard-text="code"
        type="primary"
        @click="Copy()"
        v-if="OpenStr=='更换'"
      >复制</Button>
    </p>
    <p>启用时间：{{CreateTime}}</p>
    <p>
      已使用：
      <label id="time">{{TimeStr}}</label>
  </p>
    <p class="tip">提示信息：本单位校验码为个人选择单位时填写，请定期更换。</p>
    <P>
      <Button v-if='this.UserInfo.serviceMark == "01" || this.UserInfo.username == "administrator"'  type="primary" @click="SaveCode()">{{OpenStr}}</Button>
    </P>
  </div>
</template>
<style scoped>
/* 页面样式 */
.content {
  display: inline-block;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}
/* 外部引用当前页面时所用样式 */
.popupContent {
  display: inline-block;
  position: relative;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-70%);
}
p {
  margin-top: 20px;
}
.tip {
  color: red;
}
.code {
  font-size: 24px;
}
.copy {
  margin-top: -20px;
  margin-left: 100px;
}
</style>
<script>
import {
  queryByCondition,
  checkCodes,
  edit,
  deleteInSub,
  insSubUsable,
  option,
  admOption,
  queryCheckCode
} from "@/service/insSubManage";
import { creates, query } from "@/service/currentUnit";
import { getAccessToken, getUserInfo, urlPath, difference } from "@/libs/util";
import { Modal, Message } from "iview";
import Cookies from "js-cookie";
import Clipboard from "clipboard";
export default {
  props: ["currInsInfo"],
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true,
      content: this.currInsInfo == null ? true : false,
      popupContent: this.currInsInfo == null ? false : true,
      data: [],
      UserInfo: "",
      Code: "暂无校验码",
      CreateTime: "",
      TimeStr: "",
      OpenStr: "更换"
    };
    currInsInfo: {
      TimeStr: "";
      CreateTime: "";
      code: "";
    }
  },
  computed:{
    objs(){
      return this.$store.state.user.userInfo
    }
  },
  watch:{
    objs(){
      this.UserInfo = this.objs;
      this.reload();
    }
  },
  created() {
    this.UserInfo = this.objs;
    this.reload();
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      //查询
      query().then(res => {
        if (res.code == 10000) {
          if (this.currInsInfo) {
            this.currInsInfo.Code = res.datas.checkCode;
          } else {
            this.Code = res.datas.checkCode;
          }
          this.code = res.datas.checkCode;
          this.CreateTime = res.datas.checkCodeCreateDate;
          this.TimeStr = res.datas.useTimeLength;
          this.isRouterAlive = false;
        } else {
          this.OpenStr = "生成";
        }
      });
    },
    SaveCode() {
      if (this.currInsInfo) {
        //如果是组件传值就重新赋值一下机构id
        this.UserInfo.ins_id = this.currInsInfo.currInsid;
      }
      Modal.confirm({
        title: "提示信息",
        content: "<p>确认更换本单位校验码？</p>",
        onOk: () => {
          let params = {
            insId: this.UserInfo.insId
          };
          checkCodes(params).then(res => {
            if (res.code == 10000) {
              if (this.currInsInfo) {
                this.currInsInfo.Code = res.datas.checkCode;
                // this.Code = res.datas.checkCode;
                this.CreateTime = res.datas.checkCodeCreateDate;
                this.TimeStr = res.datas.usedTime;
              } else {
                this.Code = res.datas.checkCode;
                // this.Code = res.datas.checkCode;
                this.CreateTime = res.datas.checkCodeCreateDate;
                this.TimeStr = res.datas.usedTime;
              }
              Message.success(this.OpenStr + "成功!");
              this.reload();
            } else {
              Message.error(this.OpenStr + "失败!");
            }
          });
        }
      });
    },
    // 复制
    Copy() {
      var clipboard = new Clipboard(".copy");  //获取到名称copy的标签
      clipboard.on("success", function(e) {   //引入clipboard.js 拷贝插件
        Message.success("已复制到粘贴板！");    //
        clipboard.destroy();
      });
      clipboard.on("error", function(e) {
        Message.success("Sorry,您的浏览器不支持此功能，请使用其他浏览器尝试！");
        clipboard.destroy();
      });
    }
  }
};
</script>

