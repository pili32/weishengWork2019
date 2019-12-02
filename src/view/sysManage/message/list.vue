<template>
  <div style="height:100%;position:relative;">
    <div>
      <Form inline :model="queryPar" v-if="queryPar">
        <FormItem>
          <Input v-model="queryPar.title" placeholder="消息标题" @on-enter="reload(1)" />
        </FormItem>
        <!-- <FormItem>
          <Input v-model="queryPar.type" placeholder="消息类型" @on-enter="reload(1)" />
        </FormItem> -->
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
            <a @click="Start(row)" v-if="row.enableMark == 100" style="color:green":title="done">启用</a>
            <a  v-if="row.enableMark == 0" style="color:red" :title="show">禁用</a>

          </template>
           <template slot-scope="{ row }" slot="revokeMark">
            <span v-if="row.revokeMark == 0" style="color:green">发布</span>
            <span  v-if="row.revokeMark == 1" style="color:red" >撤销</span>
          </template>
           <template slot-scope="{ row }" slot="isLook">
            <span  v-if="row.isLook == 0" style="color:green">未查看</span>
            <span v-if="row.isLook == 1" style="color:red" >已查看</span>
          </template>
          <template slot-scope="{row}" slot="action">
            <div class="action-btn">
              <a @click="revoke(row.id)"  v-if="row.revokeMark == 0" style="color:green">撤销</a>
              <a @click="reloads(row.id)"  v-if="row.revokeMark == 1" style="color:green">发布</a>
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
        :label-width="80"
        :rules="formValidate"
      >
        <FormItem label="标题" prop="title">
          <Input v-model="dtlsObje.title" placeholder="请输入标题" />
        </FormItem>
        <!-- <FormItem label="类型" prop="type">
          <Input v-model="dtlsObje.type" placeholder="类型" :maxlength="18" />
        </FormItem> -->
        <FormItem label="内容" prop="content">
          <Input v-model="dtlsObje.content" type="textarea"  :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入内容" :maxlength="1000" />
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
import {queryList,add,deletes,reloads,revoke} from '@/service/message'
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
      show:'点击启用',
      done:'点击禁用',
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
          title: "消息标题",
          key: "title"
        },
        {
          title: "消息内容",
          key: "content"
        },
        // {
        //   title: "消息类型",
        //   key: "type"
        // },
        // {
        //   title: "发送者姓名",
        //   key: "fromUserName"
        // },
        // {
        //   title: "是否查看",
        //   slot: "isLook"
        // },
          {
          title: "撤销标记",
          key:'revokeMark',
          slot: "revokeMark"
        },
          {
          title: "发布时间",
          key: "createDate"
        },
        {
          title: "创建时间",
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
        title: null,
        idcardNo: null,
        type:null,
      },
      formValidate: {
        title: [{ required: true, message: "请输入消息标题", trigger: "blur" }],
        idcardNo: [{ required: true, message: "请输入证件号", trigger: "blur" }]
      }
    };
  },
  created() {
    this.pageSizeOps = [15, 30, 50, 100];
    // let userNew = getUserInfo();
    // this.userNew = userNew;
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
        //消息标题
        title: this.queryPar.title,
        //消息类型
        // type: this.queryPar.type
      };
      //初步渲染table数据
      queryList(params).then(res => {
        if (res.code == 10000) {
          this.total = res.total;
          this.pageSize = res.pageSize;
          this.data = res.datas;
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
        content: null,
        title: null,
        type: null,
      };
      this.ModalTitle = "新增消息";
      this.ModalShow = true;
    },
    onDtlsSave() {
      let editPar = {
        title: this.dtlsObje.title,
        type: '1',
        content: this.dtlsObje.content,
        // remarks: this.dtlsObje.remarks
      };
      this.$refs["formValidate"].validate(valid => {
        if (valid) {
          if (!editPar.id) {
            //新增数据
            add(editPar).then(res => {
              if ((res.code = 10000)) {
                Message.success("操作成功");
                this.ModalShow = false;
                this.reload();
              } else {
                Message.error(data.msg);
              }
            });
          } else {
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
              Message.success("删除成功");
              this.reload();
            } else {
              Message.error(res.data.msg);
            }
          });
        }
      });
    },
    //点击撤销和未撤销的状态revoke
       reloads(id) {
      let Id = id;
      Modal.confirm({
        title: "发布",
        content: "<p>确定要发布吗？</p>",
        onOk: () => {
          let params = {
            id: Id
          };
          reloads(params).then(res => {
            if (res.code == 10000) {
              Message.success("操作成功");
              this.reload();
            } else {
              Message.error(res.data.msg);
            }
          });
        }
      });
    },
    revoke(id) {
      let Id = id;
      Modal.confirm({
        title: "撤销",
        content: "<p>确定要撤销吗？</p>",
        onOk: () => {
          let params = {
            id: Id
          };
          revoke(params).then(res => {
            if (res.code == 10000) {
              Message.success("操作成功");
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