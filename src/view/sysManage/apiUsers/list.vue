<template>
  <div style="height:100%;position:relative;">
    <div>
      <Form inline :model="queryPar" v-if="queryPar">
        <FormItem>
          <Input v-model="queryPar.name" placeholder="名称" @on-enter="reload(1)" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="reload(1)">搜索</Button>
          <Button type="primary" @click="onAdd()">新增</Button>
        </FormItem>
      </Form>
    </div>
    <div class="form_lists">
      <div style="height:100%;overflow: hidden;" ref="TableHeight">
        <Table border :columns="columns" :data="data" :loading="loading" :height="tableHeight">
          <template slot-scope="{ row }" slot="enableMark">
            <span v-if="row.enableMark == 100" style="color:green">启用</span>
            <span v-else-if="row.enableMark==0" style="color:red">禁用</span>
          </template>
          <template slot-scope="{row}" slot="action">
            <div class="action-btn">
              <a @click="onDtls(row)">编辑</a>
              <a @click="deletes(row.id)">删除</a>
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

    <!--对话框-->
    <Modal
      v-model="ModalShow"
      footer-hide
      :mask-closable="false"
      class-name="vertical-center-modal"
    >
      <p slot="header" style="color:#333333;font-size:16px">
        <span>{{ModalTitle}}</span>
      </p>
      <Form
        :model="dtlsObje"
        v-if="dtlsObje"
        ref="formValidate"
        :label-width="100"
        :rules="formValidate"
      >
        <FormItem label="名称" prop="name">
          <Input v-model="dtlsObje.name" placeholder="名称" />
        </FormItem>
        <FormItem label="appid" prop="appid">
          <Input v-model="dtlsObje.appid" placeholder="appid" :maxlength="18" />
        </FormItem>
        <FormItem label="appsecret" prop="appsecret">
          <Input v-model="dtlsObje.appsecret" placeholder="appsecret" :maxlength="18" />
        </FormItem>
        <!-- <FormItem label="登录回调地址" prop="address">
          <Input v-model="dtlsObje.address" placeholder="请输入登录回调地址" :maxlength="18" />
        </FormItem> -->
        <FormItem label="是否启用" prop="enableMark">
          <RadioGroup v-model="dtlsObje.enableMark">
            <Radio label="100">启用</Radio>
            <Radio label="0">禁用</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="每日请求次数" prop="reqCount">
          <Input
            type="number"
            v-model="dtlsObje.reqCount"
            placeholder="请输入每日限制请求次数"
            :maxlength="6"
          />
        </FormItem>
        <FormItem label="白名单">
          <Input
            v-model="dtlsObje.whiteList"
            type="textarea"
            :rows="4"
            placeholder="请输入白名单,多个ip以逗号分隔"
          />
        </FormItem>
        <FormItem label="说明">
          <Input v-model="dtlsObje.remarks" type="textarea" :rows="4" placeholder="请输入说明" />
        </FormItem>
        <FormItem>
          <Button size="large" @click="ModalShow=false">取消</Button>
          <Button type="primary" size="large" @click="onDtlsSave()">确定</Button>
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
import { list, update, deletes, add } from "@/service/openapoUser";
import {
  getAccessToken,
  urlPath,
  validateSequence,
  getUserInfo
} from "@/libs/util";
import { Modal, Message } from "iview";
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
          width: 130,
          align: "center"
        },
        {
          title: "名称",
          key: "name"
        },
        {
          title: "appid",
          key: "appid"
        },
        // {
        //   title: "登录回调地址",
        //   key: "loginReturnUrl"
        // },
        {
          title: "是否启用",
          slot: "enableMark"
        },
        {
          title: "每日限制请求次数",
          key: "reqCount"
        },
        {
          title: "添加时间",
          key: "createDate"
        }
      ],
      data: [],
      total: 0,
      pageIndex: 0,
      pageSize: 15,
      ModalTitle: null,
      //主体编辑
      ModalShow: false,
      dtlsObje: null,
      //查询参数定义
      queryPar: {
        name: null
      },
      formValidate: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        appid: [{ required: true, message: "请输入appid", trigger: "blur" }],
        appsecret: [
          { required: true, message: "请输入appsecret", trigger: "blur" }
        ],
        // address: [
        //   { required: true, message: "请输入回调地址", trigger: "blur" }
        // ],
        enableMark: [
          { required: true, message: "请选择是否启用", trigger: "blur" }
        ]
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
      this.userNew = this.objs
      this.reload()
    }
  },
  created() {
    this.pageSizeOps = [15, 30, 50, 100];
    // let userNew = getUserInfo();
    this.userNew = this.objs;
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
      var where = {
        name: this.queryPar.name
      };
      let params = {
        page: {
          pageNum: this.pageIndex,
          pageSize: this.pageSize,
          orderBy: "u.create_date desc"
        },
        name: this.queryPar.name
      };
      list(params).then(res => {
        if (res.code == 10000) {
          this.total = res.total;
          (this.pageSize = res.pageSize), (this.data = res.datas);
        } else {
          Message.error(data.msg);
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
    //新增按钮点击事件
    onAdd() {
      if (this.$refs["formValidate"] != undefined) {
        this.$refs["formValidate"].resetFields();
      }
      this.dtlsObje = {
        id: null,
        name: null,
        appid: null,
        appsecret: null,
        reqCount: 0,
        enableMark: 100 + "",
        remarks: null
      };
      this.ModalTitle = "新增api请求账户";
      this.ModalShow = true;
    },
    //编辑
    onDtls(row) {
      if (this.$refs["formValidate"] != undefined) {
        this.$refs["formValidate"].resetFields();
      }
      this.dtlsObje = {
        id: row.id,
        name: row.name,
        appid: row.appid,
        appsecret: row.appsecret,
        reqCount: row.reqCount,
        enableMark: row.enableMark + "",
        remarks: row.remarks,
        address:row.loginReturnUrl,
        whiteList:row.whiteList
      };
      this.ModalTitle = "编辑api请求账户";
      this.ModalShow = true;
    },
    onDtlsSave() {
      let editPar = {
        id: this.dtlsObje.id,
        name: this.dtlsObje.name,
        appid: this.dtlsObje.appid,
        appsecret: this.dtlsObje.appsecret,
        // loginReturnUrl: this.dtlsObje.address,
        enableMark: this.dtlsObje.enableMark,
        remarks: this.dtlsObje.remarks,
        whiteList: this.dtlsObje.whiteList,
        reqCount: this.dtlsObje.reqCount
      };
      this.$refs["formValidate"].validate(valid => {
        if (valid) {
          if (!editPar.id) {
            //编辑
            add(editPar).then(res => {
              if ((res.code == 10000)) {
                Message.success("操作成功！");
                this.ModalShow = false;
                this.reload();
                this.ModalShow = false;
              } else {
                Message.error(data.msg);
              }
            });
          } else {
            // this.putCommonApiRequest("openapi_users", editPar).then(res => {
            //   var data = res.data;
            //   if (data.code == "40000") {
            //     Message.success("操作成功！");
            //     this.ModalShow = false;
            //     this.reload();
            //   } else {
            //     Message.error(data.msg);
            //   }
            // });
            //编辑
            update(editPar).then(res => {
              if ((res.code == 10000)) {
                Message.success("操作成功！");
                this.ModalShow = false;
                this.reload();
                this.ModalShow = false;
              } else {
                Message.error(data.msg);
              }
            });
          }
        }
      });
    },
    //删除
    deletes(id) {
      let Id = id;
      Modal.confirm({
        title: "删除",
        content: "<p>确定要删除？</p>",
        onOk: () => {
          let params = {
            id: Id
          };
          deletes(params).then(res => {
            if (res.code == 10000) {
              Message.success("删除成功!");
              this.reload();
            } else {
              Message.error(res.data.msg);
            }
          });
        }
      });
    }
  }
};
</script>