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
          <Button type="primary" @click="onAdd()">新增</Button>
        </FormItem>
      </Form>
    </div>
    <div class="form_lists">
      <div style="height:100%;overflow: hidden;" ref="TableHeight">
        <Table border :columns="columns" :data="data" :loading="loading" :height="tableHeight">
          <template slot-scope="{ row }" slot="enableMark">
            <Button
              @click="Start(row)"
              v-if="row.enableMark == 100"
              style="color:green"
              :title="done"
            >启用</Button>
            <Button
              @click="Start(row)"
              v-if="row.enableMark == 0"
              style="color:red"
              :title="show"
            >禁用</Button>
          </template>
          <template slot-scope="{row}" slot="action">
            <div class="action-btn">
              <!-- <a @click="onDtls(row)" :style="{'display': (row.enableMark == 100? 'black':'none')}">编辑</a> -->
              <a @click="onDtls(row)" v-if="row.enableMark == 100">编辑</a>
              <!-- <a @click="Start(row)" v-if="row.enableMark == 0" style="color:green">启动</a> -->

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
        <FormItem label="姓名" prop="name">
          <Input v-model="dtlsObje.name" placeholder="姓名" :maxlength="50" />
        </FormItem>
        <FormItem label="证件号" prop="idcardNo">
          <Input v-model="dtlsObje.idcardNo" placeholder="证件号" :maxlength="18" />
        </FormItem>
        <FormItem label="备注">
          <Input
            v-model="dtlsObje.remarks"
            type="textarea"
            :rows="4"
            placeholder="请输入备注"
            :maxlength="500"
          />
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
import {
  queryList,
  edit,
  add,
  deletes,
  updateEntableMark
} from "@/service/orgUser";
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
      show: "点击启用",
      done: "点击禁用",
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
          title: "姓名",
          key: "name"
        },
        {
          title: "证件号",
          key: "idcardNo"
        },
        {
          title: "是否启用",
          slot: "enableMark"
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
        name: null,
        idcardNo: null
      },
      formValidate: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
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
        //姓名
        name: this.queryPar.name,
        //证件号
        idcardNo: this.queryPar.idcardNo
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
        id: null,
        name: null,
        idcardNo: null,
        remarks: null
      };
      this.ModalTitle = "新增政务账户";
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
        idcardNo: row.idcardNo,
        remarks: row.remarks
      };
      this.ModalTitle = "编辑政务账户";
      this.ModalShow = true;
    },
    //判断显示启用和金庸
    Start(row) {
      if (row.enableMark == 100) {
        let params = {
          enableMark: "0",
          id: row.id
        };
        updateEntableMark(params).then(res => {
          if ((res.code = 10000)) {
            Message.success("启动成功");
            this.reload();
          } else {
            Message.error(data.msg);
          }
        });
      } else {
        let params = {
          enableMark: "100",
          id: row.id
        };
        updateEntableMark(params).then(res => {
          if ((res.code = 10000)) {
            Message.success("禁止成功");
            this.reload();
          } else {
            Message.error(data.msg);
          }
        });
      }
    },
    onDtlsSave() {
      let editPar = {
        id: this.dtlsObje.id,
        name: this.dtlsObje.name,
        idcardNo: this.dtlsObje.idcardNo,
        remarks: this.dtlsObje.remarks
      };
      this.$refs["formValidate"].validate(valid => {
        if (valid) {
          if (!editPar.id) {
            //新增数据
            add(editPar).then(res => {
              if (res.code == 10000) {
                Message.success("操作成功");
                this.ModalShow = false;
                this.reload();
              } else {
                Message.error(data.msg);
              }
            });
          } else {
            //编辑数据
            edit(editPar).then(res => {
              if (res.code == 10000) {
                Message.success("操作成功");
                this.ModalShow = false;
                this.reload();
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
              Message.success("删除成功");
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