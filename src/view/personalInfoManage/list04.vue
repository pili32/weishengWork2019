<template>
  <div style="height:100%;position:relative;">
    <div>
      <Form inline :model="queryPar" v-if="queryPar">
        <FormItem>
          <Input v-model="queryPar.name" placeholder="姓名" @on-enter="reload(1)" />
        </FormItem>
        <FormItem>
          <Input v-model="queryPar.idcardNo" placeholder="证件号" @on-enter="reload(1)" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="reload(1)">搜索</Button>
        </FormItem>
      </Form>
    </div>
    <div class="form_lists">
      <div style="height:100%;overflow: hidden;" ref="TableHeight">
        <Table border :columns="columns" :data="data" :loading="loading" :height="tableHeight">
          <template slot-scope="{row}" slot="action">
            <div class="action-btn">
              <a @click="openDtl(row.hrId,row.coreId)">查看</a>
              <a @click="onModifyName(row)">修改姓名</a>
              <a v-if="row.userLoginId" @click="onTurnOut(row)">转出</a>
              <a v-if="!row.userLoginId" @click="onDel(row)">删除</a>
            </div>
          </template>
          <template slot-scope="{row}" slot="userLoginId">
            <span v-if="row.userLoginId" style="color:green;">已注册</span>
            <span v-else style="color:red;">未注册</span>
          </template>
          <template slot-scope="{row}" slot="gender">
            <span v-if="row.gender == 1">男</span>
            <span v-else-if="row.gender == 2">女</span>
          </template>
          <template slot-scope="{row}" slot="idcardType">
            <span
              v-for="(item,index) in idcardTypes"
              :key="index"
              v-if="item.itemvalue1==row.idcardType"
            >{{ item.name }}</span>
          </template>
          <template slot-scope="{row}" slot="birthDate">{{row.birthDate | dateFmt("yyyy-MM-dd")}}</template>
          <template
            slot-scope="{row}"
            slot="startWorkDate"
          >{{row.startWorkDate | dateFmt("yyyy-MM-dd")}}</template>
          <template slot-scope="{row}" slot="comeinDate">{{row.comeinDate | dateFmt("yyyy-MM-dd")}}</template>
        </Table>
      </div>
    </div>
    <div style="position:absolute;left:0;bottom:0">
      <Page
        show-total
        show-sizer
        show-elevator
        :page-size="pageSize"
        :total="total"
        :page-size-opts="pageSizeOps"
        @on-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
      />
    </div>
    <!--修改姓名-->
    <Modal
      v-model="showModifyNameModal"
      :mask-closable="false"
      class-name="vertical-center-modal"
      footer-hide
      loading
    >
      <p slot="header" style="color:#333333;font-size:16px">
        <span>修改姓名</span>
      </p>
      <modifyName
        :obj="objModifyName"
        v-on:success="modifyNameSuccess"
        v-on:cancel="showModifyNameModal=false"
      ></modifyName>
    </Modal>
    <!--转出操作-->
    <Modal
      v-model="showTurnOutModal"
      :mask-closable="false"
      class-name="vertical-center-modal"
      footer-hide
      loading
    >
      <p slot="header" style="color:#333333;font-size:16px">
        <span>在职人员转出</span>
      </p>
      <turnOut
        :obj="objTurnOut"
        :comeOutType="comeOutType"
        v-on:success="turnOutSuccess"
        v-on:cancel="showTurnOutModal=false"
      ></turnOut>
    </Modal>
  </div>
</template>
<style lang="less" scoped>
.form_lists {
  height: calc(100% - 60px);
  overflow: hidden;
  padding-bottom: 38px;
  box-sizing: border-box;
}
</style>
<script>
import { retirePerson, del, dtls } from "@/service/unitPersonalManagement";
import {
  getAccessToken,
  urlPath,
  getUserInfo,
  dataItemTreeHandle,
  dateFormat
} from "@/libs/util";
import { Modal, Message } from "iview";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import modifyName from "./modifyName.vue";
import turnOut from "./turnOut.vue";
export default {
  data() {
    return {
      loading: false,
      tableHeight: 520,
      columns: [
        {
          title: "序号",
          width: 90,
          type: "index"
        },
        {
          title: "操作",
          slot: "action",
          width: 140,
          align: "center"
        },
        {
          title: "实名认证",
          slot: "userLoginId",
          width: 90
        },
        // {
        //   title: "个人信息",
        //   key: "complete_rate",
        //   width: 120
        // },
        // {
        //   title: "审核进度",
        //   key: "auth_rate",
        //   width: 120
        // },
        {
          title: "姓名",
          key: "name",
          width: 120
        },
        {
          title: "性别",
          slot: "gender",
          width: 90
        },
        {
          title: "出生年月",
          slot: "birthDate",
          width: 120
        },
        {
          title: "证件类型",
          slot: "idcardType"
        },
        {
          title: "证件号码",
          key: "idcardNo"
        },
        {
          title: "参加工作日期",
          slot: "startWorkDate",
          width: 120
        },
        {
          title: "进本单位时间",
          slot: "comeinDate",
          width: 120
        }
      ],
      data: [],
      total: 0,
      pageIndex: 0,
      idcardTypes: [],
      pageSize: 15,
      //修改姓名是否弹出
      showModifyNameModal: false,
      objModifyName: null,
      //转出操作是否弹出
      showTurnOutModal: false,
      objTurnOut: null,
      comeOutType: "0904",
      //查询参数定义
      queryPar: {
        name: null,
        idcardNo: null
      }
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
    }
  },
  //初始化
  created() {
    // let curUserInfo = getUserInfo();
    this.userInfo = this.objs;
    this.pageSizeOps = [15, 30, 50, 100];
    dtls("IdcardType").then(res => {
      this.idcardTypes = res.datas;
    });
    this.reload();
  },
  mounted() {
    //计算table的高度
    this.$nextTick(() => {
      let tableHeight = this.$refs.TableHeight.offsetHeight;
      this.tableHeight = tableHeight;
    });
  },
  components: {
    Treeselect,
    modifyName,
    turnOut
  },
  //数据过滤
  filters: {
    dateFmt(d, fmt) {
      if (d && fmt) {
        return dateFormat(fmt, new Date(d));
      }
      return "";
    }
  },
  //方法
  methods: {
    reload(page) {
      if (page != undefined) {
        this.pageIndex = page;
      }
      this.loading = true;
      //查询相关参数
      let params = {
        page: {
          pageNum: this.pageIndex,
          pageSize: this.pageSize,
          orderBy: "hr.chk_date desc"
        },
        name: this.queryPar.name,
        idcardNo: this.queryPar.idcardNo
      };
      //初次列表渲染
      retirePerson(params).then(res => {
        if (res.code == 10000) {
          this.total = res.total;
          let arr = res.datas;
            this.data = arr;
        } else {
          Message.error(data.msg);
        }
      });
      this.loading = false;
    },
    onPageChange(num) {
      this.pageIndex = num;
      this.reload();
    },
    onPageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.reload();
    },
    onModifyName(row) {
      this.objModifyName = {
        id: row.id,
        name: row.name,
        gender: row.gender,
        new_name: "",
        idcardNo: row.idcardNo,
        ins_id: this.userInfo.ins_id,
        coreId: row.coreId,
        hrId: row.hrId
      };
      this.showModifyNameModal = true;
    },
    //修改姓名
    modifyNameSuccess(data) {
      if (data.code == 10000) {
        Message.success("保存成功！");
        this.showModifyNameModal = false;
        this.reload();
      } else {
        Message.error(data.msg);
      }
    },
    //转出
    onTurnOut(row) {
      this.objTurnOut = {
        id: row.id,
        name: row.name,
        gender: row.gender,
        idcardNo: row.idcardNo,
        ins_id: this.userInfo.ins_id,
        coreId: row.coreId,
        hrId: row.hrId
      };
      this.showTurnOutModal = true;
    },
    turnOutSuccess(data) {
      if (data.code == 10000) {
        Message.success("操作成功！");
        this.showTurnOutModal = false;
        this.reload();
      } else {
        Message.error(data.msg);
      }
    },
    //删除按钮
    onDel(row) {
      Modal.confirm({
        title: "删除",
        content: "<p>确定要删除？</p>",
        onOk: () => {
          let params = {
            coreId: row.coreId,
            hrId: row.hrId
          };
          del(params).then(res => {
            if (res.datas == 10000) {
              Message.success("删除成功!");
              this.reload();
            }
            Message.error(res.data.msg);
          });
        }
      });
    },
    openDtl(id,coreId) {
      this.$router.push({
        name: "personaldtls",
        params: {
          id: id,
          coreId:coreId
        }
      });
    }
  }
};
</script>

