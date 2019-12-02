<template>
  <div style="height:100%;position:relative;">
    <div class="search_tables">
      <Form line :model="queryPar">
        <Row>
          <Col span="24">
            <Row :gutter="20">
              <Col span="9">
                <FormItem label="机构层级" :label-width="75">
                  <treeselect
                    v-model="comeoutType"
                    :options="insCategory"
                    :disable-branch-nodes="true"
                    :show-count="true"
                    clearValueText="清除"
                    placeholder="请选择"
                    noResultsText="当前没有搜索的内容"
                    :normalizer="normalizer"
                    @select="onInsCategorySeachChange"
                    @input="onTurnOutClearVal"
                  />
                </FormItem>
              </Col>
              <Col span="7">
                <FormItem label="数据层级" :label-width="75">
                  <Select v-model="queryPar.dataLevel" @on-change="reload(true)">
                    <Option value="0">直属下级</Option>
                    <Option value="1">所有下级</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem>
                  <Input v-model="queryPar.insName" placeholder="请输入机构名称" @on-enter="reload(true)" />
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col span="24">
            <Row :gutter="20">
              <Col span="9">
                <FormItem label="机构账户" :label-width="75">
                  <Input
                    v-model="queryPar.insAccountName"
                    placeholder="请输入账户名称"
                    @on-enter="reload(true)"
                  />
                </FormItem>
              </Col>
              <Col span="7">
                <FormItem label="管理员姓名" :label-width="75">
                  <Input
                    v-model="queryPar.realName"
                    placeholder="请输入管理员姓名"
                    @on-enter="reload(true)"
                  />
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem>
                  <Input
                    v-model="queryPar.phoneNumber"
                    placeholder="请输入手机号码"
                    @on-enter="reload(true)"
                  />
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
        <div class="search_box">
          <Button type="primary" @click="reload(true)">搜索</Button>
        </div>
      </Form>
    </div>
    <div class="form_lists">
      <div ref="TableHeight" style="height:100%">
        <Table border :columns="columns" :data="data" :loading="loading" :max-height="tableHeight">
          <template slot-scope="{ row }" slot="action">
            <div class="action-btn">
              <a v-if="row.actived == 0 && row.insAccount " @click="active(row)">激活</a>
              <a v-if="row.insAccount" @click="modifyPassword(row)">修改密码</a>
              <a v-if="row.insAccount" @click="edit(row)">管理</a>
            </div>
          </template>
          <template slot-scope="{ row }" slot="insName">
            <strong>{{ row.insName }}</strong>
          </template>
          <template slot-scope="{ row }" slot="insAccountName">
            <span v-if="row.insAccount">{{row.insAccount}}</span>
            <span v-else>
              <div class="action-btn">
                <a @click="createAccount(row)">点我生成</a>
              </div>
            </span>
          </template>
          <template slot-scope="{ row }" slot="actived">
            <!-- <span v-if="row.insAccount"> -->
            <span v-if="row.actived == 1" style="color:green">激活</span>
            <span v-else-if="row.actived == 0" style="color:red">未激活</span>
            <!-- </span> -->
          </template>
          <template slot-scope="{ row }" slot="usable">
            <!-- <span v-if="row.insAccountName"> -->
            <span v-if="row.usable == 100" style="color:green">启用</span>
            <span v-else-if="row.usable==0" style="color:red">禁用</span>
            <!-- </span> -->
          </template>
        </Table>
      </div>
    </div>

    <div style="position:absolute;left:0;bottom:0">
      <Page
        show-total
        show-sizer
        show-elevator
        :current="pageIndex"
        :page-size="pageSize"
        :total="total"
        :page-size-opts="pageSizeOps"
        @on-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
      />
    </div>
    <!--对话框-->
    <Modal
      v-model="ModalShow"
      :mask-closable="false"
      class-name="vertical-center-modal"
      footer-hide
    >
      <p slot="header" style="color:#333333;font-size:16px">
        <span>重置密码</span>
      </p>
      <modifyPassword
        :obj="editObject"
        v-on:success="accountManagerSuccess"
        v-on:cancel="ModalShow=false;reload(true)"
      ></modifyPassword>
    </Modal>
    <Modal
      v-model="editModalShow"
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
        v-on:cancel="editModalShow=false;reload(true)"
      ></dtls>
    </Modal>
  </div>
</template>
<style lang="less" scoped>
.search_tables {
  position: relative;
  .search_box {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-60%);
  }
}
.form_lists {
  height: calc(100% - 116px);
  overflow: hidden;
  padding-bottom: 38px;
  box-sizing: border-box;
}
</style>

<script>
import {
  searchIns,
  layerOption,
  active,
  accountManange,
  createInsAccountName,
  createSubInsAccount
} from "@/service/insAccountManage";
import store from "@/store/index";
import { insOptionList } from "@/service/adminSearch";
import {
  getAccessToken,
  urlPath,
  filterArray,
  getUserInfo,
  xzdataItem
} from "@/libs/util";
import { Modal, Message } from "iview";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import modifyPassword from "./modifyPassword.vue";
import dtls from "@/view/insUserManage/dtls.vue";
// import { getAccountList , activeAccount} from "@/service/jgzhAdmin"
export default {
  components: {
    Treeselect,
    modifyPassword,
    dtls
  },
  watch: {
    currTreeVal(val, oldVal) {
      if (val == undefined) {
        this.reload(true);
      }
    }
  },
  data() {
    return {
      loading: false,
      comeoutType: null,
      tableHeight: 520,
      objList: {
        officePhone: "",
        email: "",
        department: ""
      },
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.id,
          label: node.name,
          children: node.list
        };
      },
      columns: [
        {
          title: "操作",
          slot: "action",
          width: 160,
          align: "center"
        },
        {
          title: "机构名称",
          width: 260,
          slot: "insName"
        },
        {
          title: "机构账户",
          slot: "insAccountName",
          width: 160,
          align: "center"
        },
        {
          title: "激活码",
          key: "activeCode",
          align: "center",
          width: 80
        },
        {
          title: "是否激活",
          slot: "actived",
          align: "center",
          width: 90
        },
        {
          title: "是否启用",
          slot: "usable",
          align: "center",
          width: 90
        },
        {
          title: "管理员姓名",
          key: "realName",
          width: 100,
          align: "center"
        },
        {
          title: "手机号",
          key: "phoneNumber",
          width: 120,
          align: "center"
        },
        {
          title: "办公电话",
          key: "officePhone",
          width: 120,
          align: "center"
        },
        {
          title: "所在部门",
          key: "department",
          width: 150,
          align: "center"
        },
        {
          title: "职务",
          key: "job",
          width: 120,
          align: "center"
        },
        {
          title: "邮箱",
          key: "email",
          width: 170,
          align: "center"
        },
        {
          title: "最后登录时间",
          key: "lastLoginTime",
          width: 180
        }
      ],
      insCategory: [],
      ModalShow: false,
      editModalShow: false,
      Title: "编辑",
      editObject: {
        insId: "",
        realName: "",
        office_phone: "",
        department: "",
        job: "",
        phoneNumber: "",
        email_address: "",
        enableMark: "",
        officePhone: "",
        email: "",
        department: "",
        code:""
      },
      data: [],
      total: 0,
      pageIndex: 1,
      pageSize: 15,
      //查询参数定义
      queryPar: {}
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
    this.pageSizeOps = [15, 30, 50, 100];
    this.reload();
    // this.getRequest("data_query/xz_ins", "").then(res => {
    //   this.insCategory = xzdataItem(res.data.data);
    // });
    let dataCode = [];
    insOptionList().then(res => {
      if (res.code == 10000) {
        this.insCategory = res.datas;
      }
    });
  },
  mounted() {
    //计算table的高度
    this.$nextTick(() => {
      let tableHeight = this.$refs.TableHeight.offsetHeight;
      this.tableHeight = tableHeight;
    });
  },
  //方法
  methods: {
    reload(flag) {
      //  if (!this.currTreeVal) {
      //   this.currTreeVal = this.userInfo.insId;
      // }
      //搜索时从第1页开始搜索
      if (flag) {
        this.pageIndex = 1;
      }
      this.loading = true;
      //查询相关参数
      let params = {
        page: {
          pageNum: this.pageIndex,
          pageSize: this.pageSize
        },
        insName: this.queryPar.insName,
        realName: this.queryPar.realName,
        phoneNumber: this.queryPar.phoneNumber,
        insAccountName: this.queryPar.insAccountName,
        dataLevel: this.queryPar.dataLevel,
        insId: this.comeoutType
      };
      searchIns(params).then(res => {
        if (res.code == 10000) {
          this.total = res.total;
          this.data = res.datas;
        } else {
          Message.error(res.msg);
        }
        this.loading = false;
      });
    },
    onTurnOutClearVal(value) {
      if (value == undefined) {
        this.comeoutType = null;
      }
    },
    //点我生成
    createAccount(row) {
      let params = {
        insId: row.insId
      };
      createSubInsAccount(params).then(res => {
        if (res.code == 10000) {
          Message.success("操作成功！");
          this.reload();
        } else {
          Message.error(res.msg);
        }
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
    onInsCategorySeachChange(node) {
      this.queryPar.ins_id = node.id;
      this.currTreeVal = node.id;
      this.reload(true);
    },
    //管理
    edit(row) {
      let params = {
        insUserId: row.userId
      };
      accountManange(params).then(res => {
        if (res.code == 10000) {
          let rows = res.datas;
          //机构Id
          this.editObject.id = rows.insUserId;
          //机构名称
          this.editObject.name = rows.name;
          //业务代码
          this.editObject.code = rows.code ||rows.serviceMark;
          //业务账号
          this.editObject.insUser = rows.insUser;
          //是否激活
          this.editObject.isActive = rows.actived;
          //启用状态
          this.editObject.usable = rows.usable;
          //激活码
          this.editObject.activeCode = rows.activeCode;
          //是否启用/禁用
          this.editObject.enableMark = rows.enableMark;
          //职务
          this.editObject.job = rows.job;
          this.editObject.email = rows.email;
          this.editObject.officePhone = rows.officePhone;
          this.editObject.realName = rows.realName;
          this.editObject.department = rows.department;
        }
      });
      this.editModalShow = true;
    },
    accountManagerSuccess(data) {
      if (data.code == 10000) {
        Message.success("操作成功！");
        // this.ModalShow = false;
        this.editModalShow = false;
        this.reload();
      }
    },
    active(row) {
      Modal.confirm({
        title: "提示信息",
        content: "确认激活该账户？",
        onOk: () => {
          let params = {
            insAccountId: row.userId
          };
          active(params).then(res => {
            if (res.code == 10000) {
              Message.success("激活成功！");
              this.reload();
            } else {
              Message.error(res.msg);
            }
          });
        }
      });
    },
    modifyPassword(row) {
      this.editObject = row;
      this.ModalShow = true;
    }
  }
};
</script>

