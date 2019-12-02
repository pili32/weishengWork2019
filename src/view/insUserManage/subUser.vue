<template>
  <div style="height:100%;position:relative;">
    <div>
      <Form ref="searchBox" :model="AddObject" inline>
        <FormItem>
          <Select
            v-model="AddObject.businessList"
            :value="code"
            ref="newText"
            :clearable="this.select"
            style="width:200px"
            @on-change="onDataItemCategorySelectChange"
          >
            <Option value="-999">所有</Option>
            <Option v-for="item in businessList" :value="item.code" :key="item.code">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" icon="ios-search" @click="reload(1)">搜索</Button>
        </FormItem>
        <FormItem>
          <Button type="primary" icon="ios-add" @click="Add()">新增</Button>
        </FormItem>
      </Form>
    </div>
    <div class="form_lists">
      <div style="height:100%;overflow: hidden;" ref="TableHeight">
        <Table border :columns="columns" :data="data" :loading="loading" :height="tableHeight">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row }" slot="actived">
            <label v-if="row.isActive==0" style="color:red">未激活</label>
            <label v-else style="color:green">激活</label>
          </template>
          <template slot-scope="{ row }" slot="enableMark">
            <a v-if="row.enableMark==0" style="color:red">禁用</a>
            <label v-else style="color:green">启用</label>
          </template>
          <template slot-scope="{row}" slot="action">
            <div class="action-btn">
              <a @click="edit(row)">管理</a>
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
        :page-size="pageSize"
        :total="total"
        :page-size-opts="pageSizeOps"
        @on-change="onPageChange"
        @on-page-size-change="onPageSizeChange"
      />
    </div>

    <!--对话框-添加-->
    <Modal v-model="AddShow" :mask-closable="false" class-name="vertical-center-modal" footer-hide>
      <p slot="header" style="color:#333333;font-size:16px">
        <span>添加业务分账户</span>
      </p>
      <Form
        :model="AddObject"
        :value="code"
        :label-width="80"
        ref="formDtlsValidate"
        :rules="ruleAddValidate"
      >
        <FormItem label="所属业务" prop="businessList">
          <Select
            v-model="AddObject.businessList"
            label-in-value
            style="width:200px"
            placeholder="请选择业务项目"
            @on-change="AddObjectBusinessList"
          >
            <Option
              v-for="(item,index) in businessList"
              :value="item.code"
              :key="index.code"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="业务编码" prop="businessList1">
          <!-- <span text=""  v-model="AddObject.businessList1"></span> -->
          <Input v-model="AddObject.businessList1" readonly />
        </FormItem>
        <FormItem label="账号" prop="userName">
          <Input v-model="AddObject.userName" placeholder="请输入6-12位数字、字母" :maxlength="12" />
        </FormItem>
        <FormItem>
          <Button @click="AddShow=false">取消</Button>
          <Button type="primary" @click="submit('formDtlsValidate')">保存</Button>
        </FormItem>
      </Form>
    </Modal>
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
  height: calc(100% - 60px);
  overflow: hidden;
  padding-bottom: 38px;
  box-sizing: border-box;
}
</style>
<script>
import {
  deleteInsAccountNode,
  addInsNodeAccount,
  queryNodeAccountOption,
  query,
  creates
} from "@/service/insSubManage";
import store from "@/store/index";
import {
  getAccessToken,
  getUserInfo,
  urlPath,
  filterArray,
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
      select: true,
      code: "",
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
          title: "业务编码",
          key: "itemvalue1",
          width: 90,
          align: "center"
        },
        {
          title: "业务名称",
          key: "name",
          width: 170,
          align: "center"
        },
        {
          title: "分账号",
          key: "userName",
          align: "center",
          width: 180
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
          slot: "enableMark",
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
          key: "phoneNumber",
          width: 120,
          align: "center"
        },
        {
          title: "所在部门",
          key: "department",
          width: 220,
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
      ins_id: "",
      hide_realName: false,
      data: [],
      userInfo: null,
      pageIndex: 1,
      pageSize: 15,
      total: 0,
      pageSizeOps: [15, 30, 50, 100],
      //查询参数定义
      queryPar: {},
      businessList: [],
      AddShow: false,
      AddObject: {
        userName: "",
        businessList: "",
        businessType_value: "",
        businessList1: ""
      },
      ruleAddValidate: {
        businessList: [
          { required: true, message: "请选择所属业务", trigger: "blur" }
        ],
        userName: [{ required: true, message: "请输入账号", trigger: "blur" }]
      },
      ModalShow: false,
      Title: "编辑",
      editObject: null
    };
  },
  created() {
    // this.userInfo = getUserInfo();
    this.AddObject.businessList =
      this.$route.params.id == undefined ? "" : this.$route.params.id;
    // this.getDictionaries("ServiceCategory").then(res => {
    //   let dataItem_dtls = res.data.data.data_item_dtls;
    //   dataItem_dtls = dataItem_dtls.filter(function(e) {
    //     return e.itemvalue1.indexOf("0") != 0;
    //   });
    //   this.businessList = dataItemSelectHandle(dataItem_dtls);
    // });
    //获取数据字典类型
    queryNodeAccountOption().then(res => {
      if (res.code == 10000) {
        let data = res.datas;
        this.businessList = data;
      }
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
          pageSize: this.pageSize
        },
        accountMark: "1",
        serviceMark: this.AddObject.businessList
      };
      //初始化渲染页面
      query(params).then(res => {
        if (res.code == 10000) {
          this.total = res.total;
          this.pageSize = res.pageSize;

          this.data = res.datas;
          // for (let i=0;i<res.datas.length;i++){
          //   for(let j=0;j<this.businessList.length;j++){
          //     if(this.data[i].code =this.businessList[j].code){
          //         this.data[i].name = this.businessList[j].name;
          //     }
          //   }
          // }
        } else {
          Message.error(data.msg);
        }
        this.loading = false;
      });
    },
    AddObjectBusinessList(node) {
      this.AddObject.businessList1 = node.value;
    },
    //\更换数据字典刷新页面
    onDataItemCategorySelectChange(code) {
      this.AddObject.businessList1 = code;
      this.AddObject.businessList = code;
      // this.AddObject.businessList = this.$refs.newText.query
      this.reload(1);
    },
    onPageChange(index) {
      this.pageIndex = index;
      this.reload();
    },
    onPageSizeChange(size) {
      this.pageSize = size;
      this.reload();
    },
    //新增
    Add() {
      this.AddShow = true;
    },
    //点击保存按钮
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            userName: this.AddObject.userName,
            //业务编码
            serviceMark: this.AddObject.businessList1
          };
          //新增保存
          creates(params).then(res => {
            if (res.code == 10000) {
              Message.success("保存成功");
              this.AddShow = false;
              this.AddObject.userName = null;
              this.AddObject.businessList1 = null;
              this.reload();
            } else {
              Message.success(data.msg);
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
    //管理按钮点击确定，关闭弹框
    accountManagerSuccess(data) {
      if (data.code == 10000) {
        Message.success("操作成功！");
        // this.ModalShow = false;
      this.ModalShow = false;       
        this.reload();
      }
    },
    //删除
    del(id) {
      Modal.confirm({
        title: "删除",
        content: "<p>确定要删除？</p>",
        onOk: () => {
          let params = {
            insUserId: id
          };
          deleteInsAccountNode(params).then(res => {
            if (res.code == 10000) {
              Message.success("删除成功!");
              this.reload();
            }
          });
        }
      });
    },
    //时间选择器
    DatePicker(value, date) {
      this.editObje.year = value;
    }
  }
};
</script>

