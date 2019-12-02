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
        <Table border :columns="columns" :data="dataList" :loading="loading" :height="tableHeight">
          <template slot-scope="{row}" slot="action">
            <div class="action-btn">
              <a @click="openDtl(row.hrId,row.coreId)">查看</a>
              <a @click="onModifyName(row)">修改姓名</a>
              <a v-if="row.userLoginId" @click="onTurnOut(row)">转出</a>
              <a @click="onRetire(row)">退休</a>
              <a v-if="!row.userLoginId" @click="onDel(row)">删除</a>
              <a @click="onVip(row)">vip权限</a>
            </div>
          </template>
          <!-- <template slot-scope="{row}" slot="permission">
            <span v-if="row.permission=='none'">无 </span>
            <span v-if="row.permission==''">未设置</span>
            <span v-else-if="row.permission == 'director'">厅局长 </span>
            <span v-else-if="row.permission == 'dean'">院长 </span>
            <span v-else-if="row.permission == 'commissioner'">人事处长</span>
          </template>-->
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
    <!--设置vip权限-->
    <Modal
      v-model="showVip"
      :mask-closable="false"
      class-name="vertical-center-modal"
      footer-hide
      loading
    >
      <p slot="header" style="color:#333333;font-size:16px">
        <span>设置权限</span>
      </p>
      <vip :obj="objModifyName" v-on:success="modifyVipSuccess" v-on:cancel="showVip=false"></vip>
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
    <!--退休操作-->
    `
    <Modal
      v-model="showRetireModal"
      :mask-closable="false"
      class-name="vertical-center-modal"
      footer-hide
      loading
    >
      <p slot="header" style="color:#333333;font-size:16px">
        <span>退休操作</span>
      </p>
      <Form
        :model="objRetire"
        v-if="objRetire"
        ref="formRetireValidate"
        :rules="ruleRetireValidate"
        :label-width="110"
      >
        <FormItem label="姓名">{{objRetire.name}}</FormItem>
        <FormItem label="性别">{{objRetire.gender == 1 ? '男' : '女'}}</FormItem>
        <FormItem label="证件号码">{{objRetire.idcardNo}}</FormItem>
        <FormItem label="退休时间" prop="retire_time">
          <DatePicker type="month" placeholder="请选择退休时间" v-model="objRetire.retire_time"></DatePicker>
        </FormItem>
        <FormItem label="退休类型" prop="identityType">
          <Select v-model="objRetire.identityType" label-in-value @on-change="selectChange">
            <Option
              v-for="(item,index) in identityTypes"
              :value="item.itemvalue1"
              :key="index+'0'"
            >{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="退休前岗位类别" prop="before_retire_identity">
          <treeselect
            v-model="objRetire.before_retire_identity"
            :options="TXJobCategory"
            :disable-branch-nodes="true"
            :show-count="true"
            clearValueText="清除"
            placeholder="输入要搜索的内容"
            noResultsText="当前没有搜索的内容"
            @input="onRetireClearVal"
          />
        </FormItem>
        <FormItem>
          <Button size="large" @click="showRetireModal=false">取消</Button>
          <Button type="primary" size="large" @click="onRetireSave()">确定</Button>
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
  servingOfficer,
  del,
  comeout,
  dtls,
  retire
} from "@/service/unitPersonalManagement";
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
import vip from "./vip.vue";
export default {
  data() {
    return {
      loading: false,
      tableHeight: 520,
      vipList: [],
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
          width: 250,
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
          title: "vip权限",
          key: "permission",
          width: 100
        },
        {
          title: "证件号码",
          key: "idcardNo",
          width: 180
        },
        {
          title: "参加工作日期",
          slot: "startWorkDate",
          width: 200
        },
        {
          title: "进本单位时间",
          slot: "comeinDate"
        }
      ],
      dataList: [],
      total: 0,
      pageIndex: 0,
      pageSize: 15,
      //修改姓名是否弹出
      showModifyNameModal: false,
      showVip: false,
      objModifyName: null,
      //转出操作是否弹出
      showTurnOutModal: false,
      objTurnOut: null,
      comeOutType: "0902",
      IdCardType: [],
      //退休操作是否弹出
      showRetireModal: false,
      TXJobCategory: null,
      objRetire: null,
      permission: [],
      idcardTypes: [],
      ruleRetireValidate: {
        retire_time: [
          {
            required: true,
            type: "date",
            message: "请选择退休时间",
            trigger: "change"
          }
        ],
        identityType: [
          { required: true, message: "请选择退休类型", trigger: "blur" }
        ],
        before_retire_identity: [
          { required: true, message: "请选择退休前岗位类别", trigger: "blur" }
        ]
      },
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
    //证件类型
    dtls("IdCardType").then(res => {
      this.idcardTypes = res.datas;
    });
    dtls("IdentityType").then(res => {
      let code = "04";
      for (var i = 0; i < res.datas.length; i++) {
        let type = res.datas[i];
        if (type.itemvalue1 == code) {
          this.identityTypes = type.children;
        }
      }
    });
    dtls("PersonalPermission").then(res => {
      this.vipList = res.datas;
    });
    this.reload();
    dtls("TXJobCategory").then(res => {
      this.TXJobCategory = dataItemTreeHandle(res.datas);
    });
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
    turnOut,
    vip
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
  //方法idcardNowa
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
        branchCategory: "",
        branchId: "",
        name: this.queryPar.name,
        idcardNo: this.queryPar.idcardNo
      };
      //查询
      servingOfficer(params).then(res => {
        if (res.code == 10000) {
          this.total = res.total;
          let arr = res.datas;
          this.dataList = arr;
          //循环遍历权限，放入table里面动态生成
          for (var i = 0; i < arr.length; i++) {
            if (arr[i].permission) {
              let type = arr[i].permission;
              for (var j = 0; j < this.vipList.length; j++) {
                let value = this.vipList[j];
                if (type == value.itemvalue1) {
                  arr[i].permission = value.name;
                }
              }
            } else {
              arr[i].permission = "暂无设置";
            }
          }

          //  this.dataList=arr
        } else {
          Message.error(datas.msg);
        }
        this.loading = false;
      });
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
    onVip(row) {
      this.showVip = true;
      for (var i = 0; i < this.vipList.length; i++) {
        let vipList = this.vipList[i];
        if (row.permission == vipList.name) {
          this.permissions = vipList.itemvalue1;
          this.objModifyName = {
            hrId: row.hrId,
            permission: this.permissions
          };
        } else {
          this.objModifyName = {
            hrId: row.hrId,
            permission: this.permissions
          };
        }
      }
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
    //设置权限
    modifyVipSuccess(data) {
      if (data.code == 10000) {
        Message.success("保存成功！");
        this.showVip = false;
        this.reload();
      } else {
        Message.error(data.msg);
      }
    },
    //退休操作
    selectChange(data) {
      this.objRetire.identityType = data.value;
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
    //退休
    onRetire(row) {
      if (this.$refs["formRetireValidate"] != undefined) {
        this.$refs["formRetireValidate"].resetFields();
      }
      this.objRetire = {
        id: row.id,
        name: row.name,
        gender: row.gender,
        idcardNo: row.idcardNo,
        ins_id: this.userInfo.ins_id,
        coreId: row.coreId,
        hrId: row.hrId,
        retire_time: null,
        identityType: null,
        before_retire_identity: null
      };
      this.showRetireModal = true;
    },
    onRetireClearVal(value) {
      if (value == undefined) {
        this.objRetire.before_retire_identity = null;
      }
    },
    //退休
    onRetireSave() {
      this.$refs["formRetireValidate"].validate(valid => {
        if (valid) {
          let params = {
            coreId: this.objRetire.coreId,
            hrId: this.objRetire.hrId,
            ins_id: this.userInfo.ins_id,
            retireInfoRetireTime: this.objRetire.retire_time,
            retireInfoRetireType: this.objRetire.identityType,
            retireInfoBeforeRetireIdentity: this.objRetire
              .before_retire_identity
          };

          params.retireInfoRetireTime = dateFormat(
            "yyyy-MM",
            new Date(this.objRetire.retire_time)
          );
          retire(params).then(res => {
            if (res.code == 10000) {
              Message.success("操作成功！");
              this.showRetireModal = false;
              this.reload();
            } else {
              Message.error(res.msg);
            }
          });
        }
      });
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

