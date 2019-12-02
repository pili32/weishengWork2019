<template>
  <div style="height:100%;position:relative;">
    <div>
      <Form inline :model="queryPar" v-if="queryPar">
        <FormItem label="机构名称" :label-width="75" style="width:300px">
          <Input v-model="queryPar.insName" placeholder="请输入机构名称" @on-enter="reload(1)" />
        </FormItem>
        <FormItem label="机构类别" :label-width="75" style="width:310px">
          <treeselect
            v-model="queryPar.insType"
            @select="onInsCategorySeachChange"
            :options="insCategory"
            :show-count="true"
            clearValueText="清除"
            placeholder="请选择"
            noResultsText="当前没有搜索的内容"
            @input="clearQueryCategoryKey"
            :normalizer="normalizer"
          />
        </FormItem>
        <FormItem label="数据层级" :label-width="75" style="width:200px">
          <Select v-model="queryPar.data_layer" @on-change="reload(1)">
            <Option value="0">直属下级</Option>
            <Option value="1">所有下级</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="reload(1)">搜索</Button>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="RouteToServiceUser">业务账号管理</Button>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="ShowCurrInsCheckCode">单位人员授权码</Button>
        </FormItem>
      </Form>
    </div>
    <div class="form_lists">
      <div style="height:100%;overflow: hidden;" ref="TableHeight">
        <Table
          highlight-row
          ref="currentRowTable"
          @on-current-change="currentTableRow"
          border
          :columns="columns"
          :data="data"
          :loading="loading"
          :height="tableHeight"
        >
          <template slot-scope="{ row }" slot="insName">
            <strong    @click="sessionStoragecategoryKeys(row)">
              <router-link
                :to="{name:'tabCar',params:{id:row.id,categoryKey:row.categoryKey}}"
                style="color:black;text-decoration: underline;"
              >{{ row.insName }}</router-link>
            </strong>
          </template>
          <!-- <template slot-scope="{ row }" slot="organLayerValue">
            <span
              v-for="(item,index) in organLayer"
              :key="index"
              v-if="item.code==row.organLayerValue"
            >{{ item.name }}</span>
          </template> -->
          <template slot-scope="{ row }" slot="enableMark">
            <span v-if="row.enableMark == 100" style="color:green">启用</span>
            <span v-else style="color:red">停用</span>
          </template>
          <template slot-scope="{row}" slot="action">
            <div class="action-btn">
              <a @click="mainEdit(row)">主体编辑</a>
              <a @click="enable(row)">{{row.enableMark == 100? '停用':'启用'}}</a>
              <a @click="del(row.id)">删除</a>
            </div>
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
    <!--主体编辑-->
    <Modal
      v-model="ModalShow"
      :mask-closable="false"
      class-name="vertical-center-modal"
      @on-ok="mainEditSave(editObje)"
    >
      <p slot="header" style="color:#333333;font-size:16px">
        <span>机构主体信息编辑</span>
      </p>
      <Form :model="editObje" v-if="editObje" :label-width="80">
        <FormItem label="主管单位" prop="pname">{{editObje.pname}}</FormItem>
        <FormItem label="单位全称" prop="name">
          <Input v-model="editObje.insName" placeholder="与单位公章一致" />
        </FormItem>
        <FormItem label="机构类别" prop="category">
          <!-- <treeselect
            v-model="editObje.insType"
            :disabled="true"
            :disable-branch-nodes="true"
            :show-count="true"
            :flattenSearchResults="true"
            clearValueText="清除"
            placeholder="输入要搜索的内容"
            noResultsText="当前没有搜索的内容"

          />-->
          <Input v-model="editObje.insType" disabled></Input>
        </FormItem>
        <FormItem label="行政隶属" prop="organLayerValue">
          <Select
            label-in-value
            v-model="editObje.organLayerValue"
            @on-change="onOrganLayerSelectChange"
          >
            <Option
              v-for="(item,index) in organLayer"
              :value="item.code"
              :key="index+'0'"
            >{{item.name}}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <!--删除-->
    <Modal v-model="deleteModal" width="360">
      <p slot="header" style="color:#f60;text-align:left">
        <Icon type="ios-information-circle"></Icon>
        <span>提示信息</span>
      </p>
      <div style="text-align:center;font-weight:bold;">
        <p>确认删除？</p>
      </div>
      <div slot="footer">
        <Button size="large" :loading="modal_loading" @click="deleteModal=false">取消</Button>
        <Button type="error" size="large" :loading="modal_loading" @click="onDeleteClick">删除</Button>
      </div>
    </Modal>
    <Modal
      v-model="CheckCodeModal"
      :mask-closable="false"
      class-name="vertical-center-modal"
      footer-hide
    >
      <p slot="header" style="color:#333333;font-size:16px">
        <span>本单位授权码</span>
      </p>
      <div style="height:300px;margin-left:-30px">
        <checkCode :currInsInfo="this.currInsInfo"></checkCode>
      </div>
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
import store from "@/store/index";
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
import {
  getAccessToken,
  urlPath,
  getUserInfo,
  dataItemSelectHandle,
  dataItemTreeHandle,
  dataItemHandle,
  differencem
} from "@/libs/util";
import { Modal, Message } from "iview";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import checkCode from "@/view/insInfoManage/checkCode.vue";
export default {
  data() {
    return {
      CheckCodeModal: false,
      loading: false,
      organLayerKey: "",
      organLayerValue: "",
      tableHeight: 520,
      categoryKey: "",
      normalizer(node) {
        if (node.list && !node.list.length) {
          delete node.list;
        }
        return {
          id: node.code,
          label: node.name,
          children: node.list
        };
      },
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
          width: 170,
          align: "center"
        },
        {
          title: "机构名称",
          width: 280,
          align: "center",
          slot: "insName"
        },
        {
          title: "主管单位",
          width: 260,
          align: "center",
          key: "pname"
        },
        {
          title: "机构类别",
          key: "insType",
          align: "center",
          width: 180
        },
        {
          title: "行政隶属",
          key: "organLayerValue",
          width: 140,
          align: "center"
        },
        {
          title: "机构标识",
          key: "serialNum",
          width: 140,
          align: "center"
        },
        {
          title: "是否启用",
          slot: "enableMark",
          width: 100,
          align: "center"
        },
        {
          title: "邮编",
          key: "zipCode",
          width: 150,
          align: "center"
        },
        {
          title: "地址",
          key: "address",
          width: 380,
          align: "center"
        }
      ],
      data: [],
      total: 0,
      pageIndex: 1,
      pageSize: 15,
      //主体编辑
      ModalShow: false,
      editObje: {
        id: "",
        insName: "",
        insType: "",
        organLayerValue: "",
        organLayerKey: ""
      },
      insCategory: [],
      organLayer: [],
      //查询参数定义
      queryPar: {
        insName: null, //机构名称
        insType: null, //机构类别
        data_layer: '0'//数据层级
      },
      //删除
      deleteModal: false,
      modal_loading: false,
      deleteInsId: "",
      currInsid: "",
      currInsInfo: {
        currInsid: "",
        Code: "",
        CreateTime: "",
        TimeStr: "",
        OpenStr: ""
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
    //权限校验，必须是三级行政机构
    // if (
    //   !curUserInfo ||
    //   !curUserInfo.ins_insType ||
    //   !curUserInfo.ins_insType.startsWith("0")
    // ) {
    //   Modal.error({
    //     title: "提示信息",
    //     content: "无权操作！",
    //     onOK: () => {
    //       //关闭当前页面
    //     }
    //   });
    // }
    this.pageSizeOps = [15, 30, 50, 100];
    this.reload();
    //机构
    option().then(res => {
      this.insCategory = res.datas;
    });
    //行政隶属
    admOption().then(res => {
      this.organLayer = res.datas;
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
    checkCode
  },
  //方法
  methods: {
    reload(page) {
      if (page != undefined) {
        this.pageIndex = page;
      }
      // this.loading = true;
      //查询相关参数
      let params = {
        page: {
          pageNum: this.pageIndex,
          pageSize: this.pageSize
        },
        insName: this.queryPar.insName,
        dataLayer: this.queryPar.data_layer?this.queryPar.data_layer :0,
        code: this.queryPar.ins_category
      };
      //查询
      queryByCondition(params).then(res => {
        if (res.code == 10000) {
          this.total = res.total;
          let dataList = res.datas;
          this.data =dataList
        } else {
          Message.error(data.msg);
        }
        this.loading = false;
        this.reload;
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
      this.queryPar.ins_category = node.code;
      this.reload();
    },
    //行政隶属选择事件
    onOrganLayerSelectChange(data) {
      this.editObje.editObje = data.value;
      this.editObje.organLayerKey = data.label;
    },
    //存储sesson
    sessionStoragecategoryKeys(row){
      sessionStorage.setItem('categoryKey',row.categoryKey)
    },
    //主体编辑按钮
    mainEdit(row) {
      this.editObje = {
        id: row.id,
        insName: row.insName,
        pname: row.pname,
        insType: row.insType
      };
      this.editObje.organLayerValue = row.organLayerKey;
      this.ModalShow = true;
    },
    //主体编辑弹框保存按钮
    mainEditSave(editObje) {
      let editPar = {
        id: this.editObje.id,
        insName: this.editObje.insName,
        // insType: this.editObje.insType,
        organLayerValue: this.editObje.organLayerKey,
        organLayerKey: this.editObje.organLayerValue
      };
      edit(editPar).then(res => {
        if (res.code == 10000) {
          Message.success("保存成功！");
          this.ModalShow = false;
          this.reload();
        } else {
          Message.error(data.msg);
        }
      });
    },
    //删除按钮
    del(id) {
      Modal.confirm({
        title: "提示信息",
        content: "删除后该机构将注销，请慎重操作。",
        onOk: () => {
          this.deleteInsId = id;
          this.deleteModal = true;
        }
      });
    },
    onDeleteClick() {
      let params = {
        id: this.deleteInsId
      };
      deleteInSub(params).then(res => {
        if (res.code == 10000) {
          var data = res.data;
          Message.success("操作成功！");
          this.deleteModal = false;
          this.reload();
        } else {
          Message.error(data.msg);
        }
      });
    },
    //停用
    enable(row) {
      let title = "";
      if (row.enableMark == 100) {
        title = "停用后机构所有账号将无法登陆，确认停用？";
      } else {
        title = "启用后机构所有账号将恢复登陆，确认启用？";
      }
      Modal.confirm({
        title: "提示信息",
        content: title,
        onOk: () => {
          let params = {
            insId: row.id
          };
          //停用和启用
          insSubUsable(params).then(res => {
            var data = res.data;
            if (res.code == 10000) {
              Message.success("操作成功！");
              this.ModalShow = false;
              this.reload();
            } else {
              Message.error(data.msg);
            }
          });
        }
      });
    },
    clearQueryCategoryKey(value) {
      if (value == undefined) {
        this.queryPar.ins_category = null;
        this.reload();
      }
    },
    clearEditCategoryKey(value) {
      if (value == undefined) {
        this.editObje.insType = null;
        this.editObje.insType = null;
      }
    },
    currentTableRow(currentRow, oldCurrentRow) {
      //选择表中的某行时，把当然选择的机构ID赋值给全局变量
      this.currInsid = currentRow.id;
    },
    RouteToServiceUser() {
      if (this.currInsid) {
        this.$router.push({
          name: "serviceUser",
          params: {
            id: this.currInsid
          }
        });
      } else {
        Message.info("请选择需要操作的行！");
      }
    },
    //本单位校验码相关内容：
    //显示弹窗
    ShowCurrInsCheckCode() {
      if (this.currInsid) {
        //渲染好数据
        this.GetCode(this.currInsid);
        this.CheckCodeModal = true;
      } else {
        Message.info("请选择需要操作的行！");
      }
    },
    //组装好数据
    GetCode() {
      let parames = {
        insId: this.currInsid
      };
      this.currInsInfo.currInsid = this.currInsid;
      queryCheckCode(parames).then(res => {
        var data = res.datas;
         Message.success("授权码"+res.datas.checkCode);
        if (res.code == 10000) {
          this.currInsInfo =res.datas
          this.currInsInfo.Code = res.datas.checkCode;
          this.currInsInfo.CreateTime = res.datas.checkCodeCreateDate;
          this.currInsInfo.TimeStr = res.datas.usedTime;
        }
      });
    }
  }
};
</script>

