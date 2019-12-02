
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
        <FormItem label="单位类型" :label-width="75" style="width:200px">
          <Select v-model="queryPar.branchCategory" @on-change="reload(1)">
            <Option value="-999">所有</Option>
            <Option value="40">村卫生室</Option>
            <Option value="30">社区服务中心</Option>
          </Select>
        </FormItem>
        <FormItem label="所在单位" :label-width="75" style="width:300px">
          <Select v-model="queryPar.branchId" @on-change="reload(1)">
            <Option value="-999">所有</Option>
            <Option
              v-for="(item,index) in curInsBranchs"
              :value="item.id"
              :key="index+'0'"
            >{{item.name}}</Option>
          </Select>
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
              <a @click="onModifyName(row)">修改姓名</a>
              <a v-if="row.userLoginId" @click="onTurnOut(row)">转出</a>
              <a @click="onModifyBranch(row)">更换单位</a>
              <a @click="onDel(row)">删除</a>
            </div>
          </template>
          <template slot-scope="{row}" slot="userLoginId">
            <span v-if="row.userLoginId" style="color:green;">已注册</span>
            <span v-else style="color:red;">未注册</span>
          </template>
          <template slot-scope="{row}" slot="branchCategory">
            <span v-if="row.branchCategory && row.branchCategory.indexOf('30') == 0">社区服务中心</span>
            <span v-else-if="row.branchCategory && row.branchCategory.indexOf('40') == 0">村卫生室</span>
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
          <template slot-scope="{row}" slot="birthDate">{{ row.birthDate | dateFmt("yyyy-MM-dd") }}</template>
          <template
            slot-scope="{row}"
            slot="startWorkDate"
          >{{row.startWorkDate | dateFmt("yyyy-MM-dd") }}</template>
          <template slot-scope="{row}" slot="comeinDate">{{row.comeinDate | dateFmt("yyyy-MM-dd") }}</template>
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
        <span>在岗人员转出</span>
      </p>
      <turnOut
        :obj="objTurnOut"
        :comeOutType="comeOutType"
        v-on:success="turnOutSuccess"
        v-on:cancel="showTurnOutModal=false"
      ></turnOut>
    </Modal>
    <!--更换单位操作-->
    <Modal
      v-model="showModifyBranchModal"
      :mask-closable="false"
      class-name="vertical-center-modal"
      footer-hide
      loading
    >
      <p slot="header" style="color:#333333;font-size:16px">
        <span>更换单位</span>
      </p>
      <Form
        :model="objModifyBranch"
        v-if="objModifyBranch"
        ref="formModifyBranchValidate"
        :rules="ruleModifyBranchValidate"
        :label-width="110"
      >
        <FormItem label="姓名">{{objModifyBranch.name}}</FormItem>
        <FormItem label="性别">{{objModifyBranch.gender == 1 ? '男':'女'}}</FormItem>
        <FormItem label="证件号码">{{objModifyBranch.idcardNo}}</FormItem>
        <FormItem label="单位" prop="branchInfo">
          <Select v-model="objModifyBranch.branchInfo" label-in-value>
            <Option
              v-for="(item,index) in curInsBranchs"
              :value="item.id + '_'+item.name+ '_' + item.category_key"
              :key="index+'0'"
            >{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button size="large" @click="showModifyBranchModal=false">取消</Button>
          <Button type="primary" size="large" @click="onModifyBranchSave()">确定</Button>
        </FormItem>
      </Form>
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
import {
  realnameCertificationAudit,
  comeoutVillageHospitalPerson,
  updateUnit,
  villageHospitalPerson,
  branchsQuery,
  dtls
} from "@/service/villageHospital";

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
import modifyName from "@/view/personalInfoManage/modifyName.vue";
import turnOut from "@/view/personalInfoManage/turnOut.vue";
export default {
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
          width: 220,
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
          title: "单位类型",
          slot: "branchCategory",
          width: 110
        },
        {
          title: "所在单位",
          key: "branchName",
          width: 200
        },
        {
          title: "姓名",
          key: "name",
          width: 100
        },
        {
          title: "性别",
          slot: "gender",
          width: 80
        },
        {
          title: "出生年月",
          slot: "birthDate",
          width: 120
        },
        {
          title: "证件类型",
          slot: "idcardType",
          width: 100
        },
        {
          title: "证件号码",
          key: "idcardNo",
          width: 180
        },
        {
          title: "参加工作日期",
          slot: "startWorkDate"
        },
        {
          title: "进本单位时间",
          slot: "comeinDate"
        }
      ],
      data: [],
      total: 0,
      pageIndex: 0,
      pageSize: 15,
      //修改姓名是否弹出
      showModifyNameModal: false,
      objModifyName: null,
      idcardTypes: [],
      //转出操作是否弹出
      showTurnOutModal: false,
      objTurnOut: null,
      comeOutType: "0902",
      //退休操作是否弹出
      showModifyBranchModal: false,
      objModifyBranch: null,
      ruleModifyBranchValidate: {
        branchInfo: [{ required: true, message: "请选择单位", trigger: "blur" }]
      },
      curInsBranchs: null,
      //查询参数定义
      queryPar: {
        name: null,
        idcardNo: null,
        branchCategory: null,
        branchId: null
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
      this.reload();
    }
  },
  //初始化
  created() {
    // let curUserInfo = getUserInfo();
    this.userInfo = this.objs;
    dtls("IdcardType").then(res => {
      this.idcardTypes = res.datas;
    });
    branchsQuery().then(res => {
      this.curInsBranchs = res.datas;
    });
    this.pageSizeOps = [15, 30, 50, 100];
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
          orderBy: "hr.create_date"
        },
        ins_id: this.userInfo.ins_id,
        name: this.queryPar.name,
        idcardNo: this.queryPar.idcardNo,
        branchCategory: null,
        branchId: null
      };
      if (this.queryPar.branchId != "-999") {
        params.branchId = this.queryPar.branchId;
      } else {
        this.queryPar.branchCategory = "-999";
      }
      if (this.queryPar.branchCategory != "-999") {
        params.branchCategory = this.queryPar.branchCategory;
      }
      villageHospitalPerson(params).then(res => {
        if (res.code == 10000) {
          this.total = res.datas.total;
          this.data = res.datas;
        } else {
          Message.error(datas.msg);
        }
        this.loading = false;
      });
      //加载单位下村卫生室和服务站数据
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
    //更换单位
    onModifyBranch(row) {
      if (this.$refs["formModifyBranchValidate"] != undefined) {
        this.$refs["formModifyBranchValidate"].resetFields();
      }
      this.objModifyBranch = {
        name: row.name,
        gender: row.gender,
        idcardNo: row.idcardNo,
        ins_id: this.userInfo.ins_id,
        coreId: row.coreId,
        hrId: row.hrId,
        branchInfo:
          row.branchId + "_" + row.branchName + "_" + row.branchCategory,
        branchId: null,
        branchName: null,
        branchCategory: null
      };
      this.showModifyBranchModal = true;
    },
    onModifyBranchClearVal(value) {
      if (value == undefined) {
        this.objModifyBranch.branchId = null;
        this.objModifyBranch.branchName = null;
        this.objModifyBranch.branchCategory = null;
      }
    },
    onModifyBranchSave() {
      this.$refs["formModifyBranchValidate"].validate(valid => {
        if (valid) {
          var info = this.objModifyBranch.branchInfo.split("_");
          if (info.length != 3) {
            Message.error("参数错误！");
            return;
          }
          this.objModifyBranch.branchId = info[0];
          this.objModifyBranch.branchName = info[1];
          this.objModifyBranch.branchCategory = info[2];
          let params = {
            coreId: this.objModifyBranch.coreId,
            hrId: this.objModifyBranch.hrId,
            branchId: this.objModifyBranch.branchId,
            branchName: this.objModifyBranch.branchName,
            branchCategory: this.objModifyBranch.branchCategory
          };
          // this.postPersonalApiRequest(
          //   "servingOfficer/updateBranchByPersonalCoreId",
          //   params
          // ).then(res => {
          //   var data = res.data;
          //   if (data.code == "40000") {
          //     Message.success("操作成功！");
          //     this.showModifyBranchModal = false;
          //     this.reload();
          //   } else {
          //     Message.error(data.msg);
          //   }
          // });
          updateUnit(params).then(res => {
            if (res.code == 10000) {
              Message.success("操作成功！");
              this.showModifyBranchModal = false;
              this.reload();
            } else {
              Message.error(data.msg);
            }
          });
        }
      });
    },
    //删除按钮
    onDel(id) {
      Modal.confirm({
        title: "提示信息",
        content: "确认删除？",
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
    }
  }
};
</script>

