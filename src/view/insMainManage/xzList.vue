<template>
  <div style="height:100%;position:relative;">
    <div>
      <Form inline :model="queryPar" v-if="queryPar">
        <FormItem label="机构名称" :label-width="75" style="width:260px">
          <Input v-model="queryPar.ins_name" placeholder="请输入机构名称" @on-enter="reload(1)" />
        </FormItem>
        <FormItem label="机构类别" :label-width="75" style="width:350px">
          <treeselect
            v-model="queryPar.category_key"
            @select="onInsCategorySeachChange"
            :options="insCategory"
            :show-count="true"
            clearValueText="清除"
            placeholder="请选择"
            noResultsText="当前没有搜索的内容"
            @input="clearQueryCategoryKey"
            noChildrenText="当前选项已经没有下级菜单了"
            :normalizer="normalizer"
          />
        </FormItem>
        <FormItem label="数据层级" :label-width="75" style="width:180px">
          <Select v-model="queryPar.data_layer" @on-change="reload(1)">
            <Option value="0">直属下级</Option>
            <Option value="1">所有下级</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="reload(1)">搜索</Button>
        </FormItem>
      </Form>
    </div>
    <div class="form_lists">
      <div style="height:100%" ref="TableHeight">
        <Table border :columns="columns" :data="data" :loading="loading" :max-height="tableHeight">
          <template slot-scope="{row}" slot="action">
            <div class="action-btn">
              <a @click="mainEdit(row)">编辑</a>
              <a @click="del(row)">删除</a>
            </div>
          </template>
          <template slot-scope="{ row }" slot="name">
            <strong>
              <router-link
                :to="{name:'tabCarXz',params:{id:row.insMainId}}"
                style="color:black;text-decoration: underline;"
              >{{ row.admName }}</router-link>
            </strong>
          </template>
          <!-- <template slot-scope="{ row }" slot="origin_layer_value">
            <span
              v-for="(item,index) in organLayer"
              :key="index"
              v-if="item.itemvalue1==row.admType"
            >{{ item.name }}</span>
          </template>-->
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
      @on-ok="mainEditSave"
      loading
    >
      <p slot="header" style="color:#333333;font-size:16px">
        <span>行政机构信息编辑</span>
      </p>
      <Form :model="editObje" v-if="editObje" :label-width="90">
        <FormItem label="主管单位" prop="pname">{{editObje.pname}}</FormItem>
        <FormItem label="机构全称" prop="name">
          <Input v-model="editObje.name" placeholder="与单位公章一致" />
        </FormItem>
        <FormItem label="机构类别" prop="category">
          <treeselect
            v-model="editObje.category_key"
            @select="onInsCategorySelectChange"
            :options="insCategory"
            :disabled="true"
            :disable-branch-nodes="true"
            :show-count="true"
            :flattenSearchResults="true"
            clearValueText="清除"
            placeholder
            noResultsText="当前没有搜索的内容"
            @input="clearEditCategoryKey"
            :normalizer="normalizer"
          />
        </FormItem>
        <FormItem label="行政机构类别" prop="organ_layer">
          <Select
            label-in-value
            v-model="editObje.organ_layer_key"
            @on-change="onOrganLayerSelectChange"
          >
            <Option
              v-for="(item,index) in organLayer"
              :value="item.organLayerKey"
              :key="index+'0'"
            >{{item.organLayerValue}}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <!--删除-->
    <Modal v-model="deleteModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>提示信息</span>
      </p>
      <div style="text-align:center">
        <p>确认删除？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long :loading="modal_loading" @click="onDeleteClick">删除</Button>
      </div>
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
  height: calc(100% - 60px);
  overflow: hidden;
  padding-bottom: 38px;
  box-sizing: border-box;
}
</style>
<script>
import {
  getAccessToken,
  urlPath,
  getUserInfo,
  dataItemSelectHandle,
  dataItemTreeHandle1,
  dataItemHandle,
  convertKey
} from "@/libs/util";
import { Modal, Message } from "iview";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  administrationAdminList,
  administrationAdminType,
  administrationAdminDelete,
  conditionSearch,
  conditionType,
  conditionMessageChange,
  dic
} from "@/service/xzjgAdmin";
export default {
  data() {
    return {
      loading: false,
      tableHeight: 520,
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.id,
          label: node.label,
          children: node.children
        };
      },
      deleteId: "",
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
          width: 100,
          align: "center"
        },
        {
          title: "机构名称",
          slot: "name",
          align: "center"
        },
        {
          title: "机构类别",
          key: "organType",
          width: 200,
          align: "center"
        },
        {
          title: "主管单位",
          key: "leader",
          align: "center"
        },
        {
          title: "行政机构类别",
          // slot: "origin_layer_value",
          width: 160,
          align: "center",
          key: "admType"
        },
        {
          title: "行政代码",
          key: "admCode",
          width: 110,
          align: "center"
        }
      ],
      data: [],
      total: 0,
      pageIndex: 1,
      pageSize: 15,
      selectLv: "",
      //主体编辑
      ModalShow: false,
      editObje: null,
      insCategory: [],
      organLayer: [],
      //查询参数定义
      queryPar: {
        ins_name: null, //机构名称
        category_key: null, //机构类别
        data_layer: null //数据层级
      },
      //删除
      deleteModal: false,
      modal_loading: false,
      searchKey: "",
      prType:[]
    };
  },
  //初始化
  created() {
    // let curUserInfo = getUserInfo();
    // this.userInfo = curUserInfo;
    //权限校验，必须是三级行政机构
    // if (
    //   !curUserInfo ||
    //   !curUserInfo.ins_category_key ||
    //   curUserInfo.ins_category_key != "01"
    // ) {
    //   Modal.error({
    //     title: "提示信息",
    //     content: "无权操作！",
    //     onOK: () => {
    //       //返回首页
    //       this.$router.push({
    //         name: "home"
    //       });
    //     }
    //   });
    // }
    this.pageSizeOps = [15, 30, 50, 100];
    this.reload();
    //  机构类别
    conditionType().then(res => {
      if (res.code == 10000) {
        this.insCategory = res.datas;
      } else {
        Message.error(res.msg);
      }
    });
    //  行政机构类别
    administrationAdminType().then(res => {
      this.organLayer = res.datas;
    });
    // 
    let key = "InstitutionOrganCategory";
    dic(key).then(res=>{
      this.prType = res.datas;
    })
  },
  mounted() {
    //计算table的高度
    this.$nextTick(() => {
      let tableHeight = this.$refs.TableHeight.offsetHeight;
      this.tableHeight = tableHeight;
    });
    var _this = this;
    window.onresize = function() {
      // 定义窗口大小变更通知事件
      let tableHeight = _this.$refs.TableHeight.offsetHeight;
      _this.tableHeight = tableHeight;
    };
  },
  beforeDestroy() {
    window.onresize = null;
  },
  components: {
    Treeselect
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
          orderBy: ""
        },
        admName: this.queryPar.ins_name,
        code: this.queryPar.ins_category,
        dataLayer: this.queryPar.data_layer
      };
      conditionSearch(params).then(res => {
        this.loading = false;
        if (res.code == 10000) {
          this.total = res.total;
          for(let i = 0 ; i < res.datas.length ; i ++) {
            res.datas[i].admType = this.getName(res.datas[i].admTypeKey);
          }
          this.data = res.datas;
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
      this.queryPar.ins_category = node.id;
      this.reload();
    },
    //机构类别选择事件
    onInsCategorySelectChange(node) {
      this.editObje.category_key = node.id;
      this.editObje.category_value = node.label;
    },
    //行政机构类别选择事件
    onOrganLayerSelectChange(data) {
      this.editObje.organ_layer_key = data.value;
      this.editObje.organ_layer_value = data.label;
    },
    //主体编辑按钮
    mainEdit(row) {
      switch (row.admType) {
        case "国家级":
          this.selectLv = "1";
          break;
        case "市（州）级":
          this.selectLv = "3";
          break;
        case "县（市、区）级":
          this.selectLv = "4";
          break;
        case "乡镇（街道）级":
          this.selectLv = "5";
          break;
        case "省（直辖市、自治区）级":
          this.selectLv = "2";
          break;
        case "省直管市（林区）级":
          this.selectLv = "3.5";
          break;
        default:
          this.selectLv = "";
          break;
      }
      this.editObje = {
        id: row.insMainId,
        name: row.admName,
        pname: row.leader,
        category_key: row.organTypeKey,
        category_value: row.organType,
        organ_layer_key: this.selectLv,
        organ_layer_value: row.admType
      };
      this.ModalShow = true;
    },
    //主体编辑弹框保存按钮
    mainEditSave() {
      let editPar = {
        id: this.editObje.id,
        name: this.editObje.name,
        category_key: this.editObje.category_key,
        category_value: this.editObje.category_value,
        organ_layer_key: this.editObje.organ_layer_key,
        organ_layer_value: this.editObje.organ_layer_value
      };
      let params = {
        admName: editPar.name,
        insMainId: editPar.id,
        organLayerKey: editPar.organ_layer_key,
        organLayerValue: editPar.organ_layer_value
      };
      conditionMessageChange(params).then(res => {
        this.ModalShow = false;
        if (res.code == 10000) {
          Message.success("操作成功！");
          this.reload();
        } else {
          Message.error(res.msg);
        }
      });
    },
    //删除按钮
    del(row) {
      Modal.confirm({
        title: "提示信息",
        content: "删除后该机构将注销，请务必慎重操作。",
        onOk: () => {
          this.deleteId = row.insMainId;
          this.deleteModal = true;
        }
      });
    },
    //  删除重复确认弹窗
    onDeleteClick() {
      let params = {
        insMainId: this.deleteId
      };
      administrationAdminDelete(params).then(res => {
        if (res.code == 10000) {
          Message.success("该机构已被删除");
          this.reload();
        } else {
          Message.error(res.msg);
        }
      });
      this.deleteModal = false;
    },
    clearQueryCategoryKey(value) {
      if (value == undefined) {
        this.queryPar.ins_category = null;
        this.reload();
      }
    },
    clearEditCategoryKey(value) {
      if (value == undefined) {
        this.editObje.category_key = null;
        this.editObje.category_value = null;
      }
    },
    getName(key){
      for(let i = 0 ; i < this.prType.length ; i ++) {
        if(this.prType[i].itemvalue1 == key) {
          return this.prType[i].name;
        }
      }
    }
  }
};
</script>

 