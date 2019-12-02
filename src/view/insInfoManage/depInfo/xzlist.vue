<template>
  <div>
    <div class="topcontent">
      <h3>内设机构</h3>
      <span>有无内设机构：</span>
      <Select v-model="selIns" style="width:150px" @on-change="InsSelChange">
        <Option value="1">有</Option>
        <Option value="0">无</Option>
      </Select>
    </div>
    <div class="footcontent">
      <Button type="primary" icon="ios-refresh" @click="refresh">刷新</Button>
      <Button type="primary" icon="md-add" @click="addPage('editValidate')">添加</Button>
      <div class="form_list" style="padding: 15px 0;">
        <Table border :columns="columns" :data="data" :loading="loading">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{row}" slot="action">
            <div class="action-btn">
              <a @click="edit(row)">编辑</a>
              <a @click="deletes(row.id)">删除</a>
            </div>
          </template>
        </Table>
      </div>
      <!--对话框-->
      <Modal v-model="ModalShow" :mask-closable="false" class-name="vertical-center-modal">
        <p slot="header" style="color:#333333;font-size:16px">
          <Icon type="md-hammer"></Icon>
          <span>{{Title}}</span>
        </p>
        <Form
          :model="editObje"
          ref="editValidate"
          :label-width="120"
          :rules="editValidate"
          width="800"
        >
          <FormItem label="内设机构全称：" prop="name">
            <Input v-model="editObje.name" />
          </FormItem>
          <FormItem label="对应国家司局1：" prop="standard_name_key">
            <treeselect
              v-model="editObje.standard_name_key"
              @select="onStandardNameSelectChange"
              :options="StandardNameList"
              :disable-branch-nodes="true"
              :show-count="true"
              clearValueText="清除"
              placeholder="输入要搜索的内容"
              noResultsText="当前没有搜索的内容"
              @input="clearVal"
              :normalizer="normalizer"
            />
            <!-- <Select v-model="editObje.standard_name_key">
                <Option
                  v-for="(item,index) in this.StandardNameList"
                  :value="item.code"
                  :key="index+'0'"
                >{{item.name}}</Option>
            </Select>-->
          </FormItem>
          <FormItem label="对应国家司局2：">
            <treeselect
              v-model="editObje.standard_name2_key"
              @select="onStandardName2SelectChange"
              :options="StandardNameList"
              :disable-branch-nodes="true"
              :show-count="true"
              clearValueText="清除"
              placeholder="输入要搜索的内容"
              noResultsText="当前没有搜索的内容"
              @input="clearVal1"
              :normalizer="normalizer"
            />
            <!-- <Select v-model="editObje.standard_name2_key">
                <Option
                  v-for="(item,index) in this.StandardNameList"
                  :value="item.code"
                  :key="index+'0'"
                >{{item.name}}</Option>
            </Select>-->
          </FormItem>
          <FormItem label="排序：" prop="order_index">
            <Input number v-model="editObje.order_index" />
          </FormItem>
          <FormItem label="备注：" prop="remark">
            <Input v-model="editObje.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" />
          </FormItem>
        </Form>
        <div slot="footer">
          <Button size="large" @click="cancleSubmit()">取消</Button>
          <Button type="primary" size="large" @click="createExt('editValidate')">确定</Button>
        </div>
      </Modal>
    </div>
  </div>
</template>
<style scoped>
.topcontent {
  margin: 10px;
}
.footcontent {
  margin: 10px;
}
</style>

<script>
import {
  getUserInfo,
  urlPath,
  validateSequence,
  dataItemHandle,
  dataItemTreeHandle,
  convertKey
} from "@/libs/util";
import { Modal, Message } from "iview";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  searchOrgList,
  newAdd,
  list,
  changeOrg,
  setOrg,
  deleteOrg
} from "@/service/xzjgAdmin";

export default {
  data() {
    const isEmpty = (rule, value, callback) => {
      if (isNaN(value * 1)) {
        callback(new Error("请输入数字！"));
      } else if (value.length == 11) {
        callback(new Error("请输入11位以内的数字！") + value.length);
      } else {
        callback(value.length);
      }
    };
    return {
      loading: false,
      insId: this.$route.params.id, //接收参数
      branch_id: "",
      selIns: "",
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.code,
          label: node.name,
          children: node.list
        };
      },
      columns: [
        {
          title: "操作",
          slot: "action",
          width: 150,
          align: "center"
        },
        {
          title: "内设机构名称",
          key: "innerInsName"
        },
        {
          title: "对应国家司局1",
          key: "standardNameValue1"
        },
        {
          title: "对应国家司局2",
          key: "standardNameValue2"
        },
        {
          title: "排序",
          key: "orderIndex"
        }
      ],
      data: [],
      ModalShow: false,
      Title: "编辑",
      StandardNameList: [],
      editObje: {},
      editValidate: {
        name: [
          { required: true, message: "内设机构全称不能为空", trigger: "blur" },
          {
            type: "string",
            max: 40,
            message: "不能超过40个字符",
            trigger: "blur"
          }
        ],
        standard_name_key: [
          { required: true, message: "对应国家司局不能为空", trigger: "blur" }
        ],
        order_index: [
          {
            required: true,
            trigger: "change",
            message: "排序码不能为空",
            type: "number"
          },
          {
            type: "number",
            max: 9999999999,
            message: "不能超过10位数字",
            trigger: "change"
          }
        ],
        remark: [
          {
            required: false,
            type: "string",
            max: 50,
            message: "不能超过50个字符",
            trigger: "blur"
          }
        ]
      },
      userNew: null
    };
  },
  components: {
    Treeselect
  },
  computed:{
    objs(){
      return this.$store.state.user.userInfo
    }
  },
  watch:{
    objs(){
      this.userNew = this.objs;
      if (!this.insId) {
        this.insId = this.userNew.insId;
      }
      this.getTableList();
      this.getList();
    }
  },
  created() {
    // let userNew = getUserInfo();
    this.userNew = this.objs;
    if (!this.insId) {
      this.insId = this.userNew.insId;
    }
    this.getTableList();
    this.getList();
  },
  methods: {
    getList() {
      searchOrgList().then(res => {
        if (res.code == 10000) {
          this.StandardNameList = res.datas;
        }
      });
    },
    getTableList() {
      this.loading = true;
      let params = {
        page: {
          pageNum: 1,
          pageSize: 9999,
          orderBy: ""
        },
        id: this.insId
      };
      list(params).then(res => {
        this.loading = false;
        if (res.code == 10000) {
          if (res.datas.length > 0) {
            this.selIns = "1";
            this.data = res.datas;
          } else {
            this.selIns = "0";
            this.data = [];
          }
        } else {
          Message.error(res.msg);
        }
      });
    },
    edit(row) {
      //编辑
      this.$refs["editValidate"].resetFields();
      this.Title = row.innerInsName + "内设机构信息编辑";
      this.editObje = {
        id: row.id,
        ins_id: row.insId,
        ins_name: row.ins_name,
        branch_id: row.branch_id,
        branch_name: row.branch_name,
        name: row.innerInsName,
        standard_name_key: row.standardNameKey1,
        standard_name_value: row.standardNameValue1,
        standard_name2_key: row.standardNameKey2,
        standard_name2_value: row.standardNameValue2,
        order_index: row.orderIndex * 1,
        remark: row.remark
      };
      this.ModalShow = true;
      this.$refs["editValidate"].resetFields();
    },
    deletes(id) {
      //删除
      Modal.confirm({
        title: "删除",
        content: "<p>确定要删除？</p>",
        onOk: () => {
          let params = {
            depId: id
          };
          deleteOrg(params).then(res => {
            if (res.datas == 1) {
              Message.success("删除成功!");
              this.getTableList();
            }
          });
        }
      });
    },
    addPage(name) {
      //新增按钮点击事件
      this.$refs["editValidate"].resetFields();
      this.Title = "新增内设机构信息";
      this.editObje = {};
      this.editObje.order_index = "";
      this.ModalShow = true;
    },
    InsSelChange(index) {
      if (index == 0) {
        Modal.confirm({
          title: "提示信息",
          content: "无内设机构时，将清除已设置内设机构，是否继续？",
          onOk: () => {
            //删除分院区信息
            let params = {
              isHasBranches: 0,
              insId: this.insId
            };
            setOrg(params).then(res => {
              if (res.datas == 1) {
                Message.success("清除内设机构成功！");
                this.getTableList();
              } else {
                Message.error("清除内设机构失败！");
              }
            });
          },
          onCancel: () => {
            this.selIns = "1";
          }
        });
      }
    },
    cancleSubmit(name) {
      this.ModalShow = false;
    },
    //  新建内设机构
    createExt(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (this.editObje.id) {
            // this.UpData("ins_dep", params);
            // 编辑内部机构
            let params = {
              id: this.editObje.id,
              bureauOneKey: this.editObje.standard_name_key,
              bureauOneValue: this.editObje.standard_name_value,
              bureauTwoKey: this.editObje.standard_name2_key,
              bureauTwoValue: this.editObje.standard_name2_value,
              name: this.editObje.name,
              orderIndex: this.editObje.order_index,
              remark: this.editObje.remark
            };
            changeOrg(params).then(res => {
              this.ModalShow = false;
              if (res.datas == 1 ) {
                this.getTableList();
                Message.success("修改内设机构成功！");
              } else {
                Message.error(res.msg);
              }
            });
          } else {
            // this.PostData("ins_dep", params);
            let params = {
              id: this.insId,
              bureauOneKey: this.editObje.standard_name_key,
              bureauOneValue: this.editObje.standard_name_value,
              bureauTwoKey: this.editObje.standard_name2_key,
              bureauTwoValue: this.editObje.standard_name2_value,
              name: this.editObje.name,
              orderIndex: this.editObje.order_index,
              remark: this.editObje.remark
            };
            newAdd(params).then(res => {
              this.ModalShow = false;
              if (res.datas == 1) {
                this.getTableList();
                Message.success("添加内设机构成功！");
              }
            });
          }
        }
      });
    },
    UpData(url, param) {
      //更新数据
      this.putRequest(url, param).then(res => {
        if (res.data.code == 40000) {
          this.ModalShow = false;
          Message.success("保存成功!");
          this.getTableList();
        } else {
          Message.error(res.data.msg);
        }
      });
    },
    PostData(url, param) {
      //写入数据
      this.postRequest(url, param).then(res => {
        if (res.data.code == 40000) {
          this.ModalShow = false;
          Message.success("保存成功!");
          this.getTableList();
        } else {
          Message.error(res.data.msg);
        }
      });
    },
    onStandardNameSelectChange(node) {
      this.editObje.standard_name_key = node.code;
      this.editObje.standard_name_value = node.name;
    },
    onStandardName2SelectChange(node) {
      this.editObje.standard_name2_key = node.code;
      this.editObje.standard_name2_value = node.name;
    },
    clearVal(value) {
      if (value == undefined) {
        this.editObje.standard_name_key = null;
        this.editObje.standard_name_value = null;
      }
    },
    clearVal1(value) {
      if (value == undefined) {
        this.editObje.standard_name2_key = null;
        this.editObje.standard_name2_value = null;
      }
    },
    refresh() {
      this.getTableList();
    }
  }
};
</script>