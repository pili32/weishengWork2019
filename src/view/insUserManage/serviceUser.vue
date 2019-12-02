<template>
  <div class="form_lists" ref="TableHeight">
    <Table border :columns="columns" :data="data" :loading="loading" :max-height="tableHeight">
      <template slot-scope="{ row }" slot="insUser">
        <span v-if="row.userName">{{row.userName}}</span>
        <span v-else>
          <div class="action-btn">
            <a @click="createAccount(row)">点我生成</a>
          </div>
        </span>
      </template>
      <template slot-scope="{ row }" slot="actived">
        <label v-if="row.isActive==0" style="color:red">未激活</label>
        <label v-else-if="row.isActive=1" style="color:green">激活</label>
      </template>
      <template slot-scope="{ row }" slot="used">
        <label v-if="row.enableMark==0" style="color:red">禁用</label>
        <label v-else-if="row.enableMark==100" style="color:green">启用</label>
      </template>
      <template slot-scope="{row}" slot="action">
        <div class="action-btn">
          <a v-if="row.userName" @click="edit(row)">管理</a>
          <a v-if="row.userName" @click="open(row.itemvalue1)">分账号管理</a>
        </div>
      </template>
    </Table>
    <!--对话框-->
    <Modal
      v-model="ModalShow"
      :mask-closable="false"
      class-name="vertical-center-modal"
      footer-hide
    >
      <p slot="header" style="color:#333333;font-size:16px">
        <span>账户管理</span>
      </p>
      <dtls
        :obj="editObject"
        v-on:success="accountManagerSuccess"
        v-on:cancel="ModalShow=false;reload()"
      ></dtls>
    </Modal>
  </div>
</template>
<style lang="less" scoped>
.form_lists {
  height: 100%;
  overflow: hidden;
}
</style>
<script>
import {
  querys,
  queryInsAccountNode,
  bussinessAccountManage
} from "@/service/insSubManage";
import { create } from "@/service/currentUnit";

import store from "@/store/index";
import {
  getAccessToken,
  getUserInfo,
  urlPath,
  dataItemSelectHandle
} from "@/libs/util";
import { Modal, Message } from "iview";
import Cookies from "js-cookie";
import dtls from "./dtls.vue";
export default {
  components: { dtls },
  data() {
    return {
      loading: false,
      tableHeight: 520,
      columns: [
        {
          title: "序号",
          width: 70,
          type: "index",
          align: "center"
        },
        {
          title: "操作",
          slot: "action",
          width: 140,
          align: "center"
        },
        {
          title: "业务编码",
          key: "itemvalue1",
          width: 90,
          align: "center"
        },
        {
          title: "业务名称",
          key: "name",
          width: 200,
          align: "center"
        },
        {
          title: "业务账户",
          slot: "insUser",
          align: "center",
          width: 160
        },
        {
          title: "激活码",
          key: "activeCode",
          width: 100,
          align: "center"
        },
        {
          title: "是否激活",
          slot: "actived",
          width: 100,
          align: "center"
        },
        {
          title: "是否使用",
          slot: "used",
          width: 100,
          align: "center"
        },
        {
          title: "管理员姓名",
          key: "realName",
          width: 100,
          align: "center"
        },
        {
          title: "手机号",
          key: "telPhone",
          width: 120,
          align: "center"
        },
        {
          title: "所在部门",
          key: "department",
          width: 130,
          align: "center"
        },
        {
          title: "办公电话",
          key: "officePhone",
          width: 120,
          align: "center"
        },
        {
          title: "最后登录时间",
          key: "lastLoginDate",
          width: 160,
          align: "center"
        }
      ],
      userInfo: null,
      pageIndex: 1,
      pageSize: 20,
      data: [],
      ModalShow: false,
      editObject: null,
      insId: ""
    };
  },
  computed:{
    objs(){
      return this.$store.state.user.userInfo
    }
  },
  watch:{
    objs(){
      this.userInfo = this.objs;
      this.insId =
        this.$route.params.id == undefined ? "" : this.$route.params.id;
      this.reload();
    }
  },
  created() {
    this.userInfo = this.objs;
    this.insId =
      this.$route.params.id == undefined ? "" : this.$route.params.id;
    this.reload();
    //获取业务列表
  },
  mounted() {
    //计算table的高度
    this.$nextTick(() => {
      let tableHeight = this.$refs.TableHeight.offsetHeight;
      this.tableHeight = tableHeight;
    });
  },
  methods: {
    reload() {
      if (this.insId) {
        let params = {
          page: {
            pageNum: this.pageIndex,
            pageSize: this.pageSize
          },
          insId: this.insId
        };
        bussinessAccountManage(params).then(res => {
          if (res.code == 10000) {
            this.data = res.datas;
            this.total = res.total;
            this.pageSize = res.pageSize;
          } else {
            Message.error(data.msg);
          }
          this.loading = false;
        });
      } else {
        querys().then(res => {
          if (res.code == 10000) {
            this.data = res.datas;
          }
        });
      }
      // this.loading = true;
      //查询相关参数
      // var where = {
      //   account_mark: 0 //分账户
      // };
      // let params = {
      //   insId:this.insId,
      //   page_index: this.pageIndex,
      //   page_size: this.pageSize,
      //   sql_where: JSON.stringify(where)
      // };
    },
    createAccount(row) {
      Modal.confirm({
        title: "生成账号",
        content: "<b>确定生成【" + row.name + "】业务管理账号？</b>",
        onOk: () => {
          let router = "ins_user/service_account";
          let params = {
            // insId: this.insId,
            serviceMark: row.itemvalue1
          };
          // this.postRequest(router, params).then(res => {
          //   if (res.data.data == null) {
          //     Message.success(res.data.msg);
          //   } else {
          //     Message.success("生成成功！");
          //     this.reload();
          //   }
          // });
          create(params).then(res => {
            if (res.code == 10000) {
              Message.success("生成成功！");
              this.reload();
            } else {
              Message.success(res.datas.msg);
            }
          });
        }
      });
    },
    //编辑
    edit(row) {
      this.editObject = row;
      this.ModalShow = true;
    },
    accountManagerSuccess(data) {
      if (data.code == 10000) {
        Message.success("操作成功！");
        this.ModalShow = false;
        this.reload();
      } else {
        Message.error(data.msg);
      }
    },
    //时间选择器
    DatePicker(value, date) {
      this.editObje.year = value;
    },
    open(code) {
      this.$router.push({
        name: "subUser",
        params: {
          id: code
        }
      });
    }
  }
};
</script>

