<template>
  <div style="height:100%;position:relative;">
    <div>
      <Form inline :model="queryPar" v-if="queryPar">
        <FormItem>
          <Input v-model="queryPar.name" placeholder="请输入用户名称" @on-enter="reload(1)" />
        </FormItem>
        <FormItem label="配置类型" :label-width="75" style="width:200px">
          <Select v-model="queryPar.category" clearable @on-change="reload(1)">
            <Option value="1">机构</Option>
            <Option value="2">个人</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="reload(1)">搜索</Button>
          <Button type="primary" @click="onAdd()">新增</Button>
          <Button type="primary" @click="ManyAgree(1)">批量启用</Button>
          <Button type="primary" @click="ManyAgree(2)">批量不启用</Button>
        </FormItem>
      </Form>
    </div>
    <div class="form_lists">
      <div style="height:100%;overflow: hidden;" ref="TableHeight">
        <Table
          border
          @on-selection-change="selectList"
          :columns="columns"
          :data="data"
          :loading="loading"
          :height="tableHeight"
        >
          <template slot-scope="{ row }" slot="enableMark">
            <span>{{ row.enableMark==0?'不启用':'启用' }}</span>
          </template>
          <template slot-scope="{ row }" slot="userType">
            <span>{{ row.userType==1?'机构':'个人' }}</span>
          </template>
          <template slot-scope="{row}" slot="action">
            <div class="action-btn">
              <a @click="edit(row)">编辑</a>
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
        :mask-closable="false"
        width="500"
        class-name="vertical-center-modal"
        >
      <div slot="header" style="color:#333333;font-size:16px">
        <Icon type="md-hammer"></Icon>
        <span>编辑</span>
      </div>
      <Form :model="editObje" ref="editValidate" :label-width="80" :rules="editValidate">
        <FormItem label="用户名称" prop="userName">
          <Input v-model="editObje.userName" placeholder="请输入用户名称" :maxlength="50" />
        </FormItem>
        <FormItem label="是否启用 " prop="enableMark">
          <RadioGroup v-model="editObje.enableMark">
            <Radio label="0" value="0">不启用</Radio>
            <Radio label="100" value="100">启用</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="用户类型 " prop="userType">
          <RadioGroup v-model="editObje.userType">
            <Radio label="1" value="1">机构</Radio>
            <Radio label="2" value="2">个人</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button size="large" @click="cancleSubmit()">取消</Button>
        <Button type="primary" size="large" @click="createExt('editValidate')">确定</Button>
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
img {
  width: 100%;
  height: 100%;
}
</style>
<script>
import {
  queryList,
  deletes,
  add,
  batchEnableOrNot,
  update
} from "@/service/Whitelisting";

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
      images: "",
      columns: [
        {
          type: "selection",
          width: 60,
          align: "center"
        },
        {
          title: "操作",
          slot: "action",
          width: 130,
          align: "center"
        },
        {
          title: "用户名称",
          key: "userName"
        },
        {
          title: "是否启用",
          slot: "enableMark"
        },
        {
          title: "用户类型",
          slot: "userType"
        }
      ],
      data: [],
      total: 0,
      pageIndex: 0,
      pageSize: 15,
      //主体编辑
      ModalShow: false,
      editObje: {},
      //查询参数定义
      queryPar: {
        name: null
      },
      editValidate: {
        userName: [
          { required: true, message: "请输入用户名称", trigger: "blur" }
        ],
        enableMark: [
          { required: true, message: "是否启用或禁用", trigger: "change" }
        ],
        userType: [{ required: true, message: "请选择机构", trigger: "change" }]
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
      var where = {
        name: this.queryPar.name,
        code: this.queryPar.code
      };
      let params = {
        page: {
          pageNum: this.pageIndex,
          pageSize: this.pageSize
        },
        userName: this.queryPar.name,
        userType: this.queryPar.category
      };
      //页面初次table页渲染
      queryList(params).then(res => {
        if (res.code == 10000) {
          this.total = res.total;
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
    //编辑
    edit(row) {
      this.editObje = {
        id: row.id,
        enableMark: String(row.enableMark),
        userName: row.userName,
        userType: row.userType
      };
      console.log(this.editObje.enableMark);
      console.log(typeof this.editObje.enableMark);

      this.$refs["editValidate"].resetFields();
      this.ModalShow = true;
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
    //新增按钮点击事件
    onAdd() {
      this.$refs["editValidate"].resetFields();
      this.editObje = {};
      this.editObje.enableMark = "0";
      this.editObje.userType = "1";
      this.ModalShow = true;
    },
    cancleSubmit() {
      this.$refs["editValidate"].resetFields();
      this.ModalShow = false;
    },
    //Table选择事件
    selectList(selection, row) {
      //初步设定数组格式
      let arr = [];
      //循环选中的行数添加到一起为数组
      for (var i = 0; i < selection.length; i++) {
        let id = selection[i].id;
        arr.push(id);
        this.chechId = arr;
      }
    },

    //批量启用或禁用
    ManyAgree(num) {
      console.log(num);
      let title = "";
      Modal.confirm({
        title: "提示信息",
        content: num == 1 ? "确认启用吗？" : "确认不启用吗？",
        onOk: () => {
          //这里时判断有没有选中行数，如果没用就else提醒选中
          if (this.chechId) {
            let params = {
              ids: this.chechId,
              enableMark: 100
            };
            //判断传来的值为多少以此来觉得params传入的值
            if (num == 1) {
              this.batch(params);
            } else {
              params.enableMark = 0;
              this.batch(params);
            }
          } else {
            Message.success("请勾选需要更改的内容");
          }
        }
      });
    },
    //批量调用的接口
    batch(params) {
      batchEnableOrNot(params).then(res => {
        if (res.code == 10000) {
          Message.success("成功" + res.datas + "条");
          this.ModalShow = false;
          this.reload();
        } else {
          Message.error(data.msg);
        }
      });
    },

    createExt(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          console.log(this.editObje.id);
          let params = {
            id: this.editObje.id,
            enableMark: this.editObje.enableMark,
            userName: this.editObje.userName,
            userType: this.editObje.userType
          };
          if (this.editObje.id) {
            this.UpData(params);
          } else {
            this.PostData(params);
          }
        }
      });
    },
    UpData(params) {
      //更新数据
      update(params).then(res => {
        if (res.code == 10000) {
          this.ModalShow = false;
          Message.success("保存成功!");
          this.reload();
        } else {
          Message.error(res.data.msg);
        }
      });
    },
    PostData(params) {
      add(params).then(res => {
        if (res.code == 10000) {
          this.ModalShow = false;
          Message.success("保存成功!");
          this.reload();
        } else {
          Message.error(res.data.msg);
        }
      });
    }
  }
};
</script>