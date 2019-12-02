<template>
  <!-- 内设机构 -->
  <div>
    <div class="SideMenu">
      <h3>院区分类</h3>
      <ul>
        <li
          :class="{isSelect:index==selectIndex}"
          v-for="(item,index) in depList"
          :key="index"
          :value="index"
          @click="branameclick(index)"
        >
          <span>{{index+1}} {{item.branchName}}</span>
        </li>
      </ul>
    </div>
    <div class="OffsideCenten">
      <div class="topcontent">
        <h3>内设机构</h3>
        <span>有无内设机构：</span>
        <Select v-model="selIns" style="width:150px" @on-change="InsSelChange">
          <Option :value="1">有</Option>
          <Option :value="-1">无</Option>
        </Select>
      </div>
      <div class="footcontent">
        <Button type="primary" icon="ios-refresh" @click="refresh">刷新</Button>|
        <Button type="primary" icon="md-add" @click="addPage('editValidate')">添加</Button>
        <div class="form_list" style="padding: 15px 0;">
          <Table border :columns="columns" :data="data1" :loading="loading">
            <template slot-scope="{ row }" slot="depName">
              <strong>{{ row.depName }}</strong>
            </template>
            <template slot-scope="{row}" slot="action">
              <div class="action-btn">
                <a @click="edit(row)">编辑</a>
                <a @click="deletes(row.depId)">删除</a>
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
            <FormItem label="对应标准分类：" prop="standard_name_key">
              <treeselect
                v-model="editObje.standard_name_key"
                @select="onInsCategorySelectChange"
                :options="insCategory"
                :disable-branch-nodes="true"
                :show-count="true"
                clearValueText="清除"
                @input="clearVal"
                placeholder="输入要搜索的内容"
                noResultsText="当前没有搜索的内容"
                :normalizer="normalizer"
              />
            </FormItem>
            <FormItem label="排序：" prop="orderIndex">
              <Input type="number" v-model="editObje.orderIndex" />
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
  </div>
</template>
<style scoped>
.SideMenu {
  display: block;
  border: 1px solid #d7dde4;
  width: 20%;
  height: auto;
  /* padding: 12px; */
  float: left;
  margin-left: 15px;
}
.SideMenu h3 {
  height: 40px;
  line-height: 40px;
  background: #f5f5f5;
  text-indent: 15px;
  border-bottom: 1px solid #eeeeee;
}
.SideMenu ul li {
  list-style-type: none;
  padding: 10px 0;
  text-indent: 15px;
  cursor: pointer;
  border-bottom: 1px solid #eeeeee;
}
.SideMenu ul li span {
  font-size: 14px;
}
.SideMenu ul li.isSelect span {
  color: #2d8cf0;
}
.OffsideCenten {
  display: block;
  border: 1px solid #d7dde4;
  width: 70%;
  float: left;
  margin-left: 20px;
}
.topcontent {
  margin: 10px;
}
.footcontent {
  margin: 10px;
}
</style>

<script>
import {
  innerDepList,
  addDep,
  deleteDep,
  depOption,
  editDep,
  deleteDepPiece
} from "@/service/insSubManageDtl";
import {
  getAccessToken,
  urlPath,
  validateSequence,
  dataItemHandle,
  dataItemTreeHandle,
  getUserInfo
} from "@/libs/util";
import { Modal, Message } from "iview";
import axios from "axios";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      loading: false,
      isRouterAlive: true,
      standard_name_key: null,
      selectIndex: 0,
      dataList: [],
      depList: [], //循环绑定院区名称
      loading: false,
      branchId: "",
      branchName: "",
      insId: this.$route.params.id, //接收参数
      selIns: "1",
      insCategory: [],
      normalizer(node) {
        if (node.nodeList && !node.nodeList.length) {
          delete node.nodeList;
        }
        return {
          label: node.name,
          children: node.nodeList,
          id: node.code
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
          title: "院区分类",
          key: "branchName"
        },
        {
          title: "内设机构名称",
          key: "depName"
        },
        {
          title: "对应标准",
          key: "depStandard"
        },
        {
          title: "排序",
          key: "orderIndex"
        }
      ],
      data1: [],
      ModalShow: false,
      Title: "编辑",
      editObje: {
        standard_name_key: null,
        name:'',
        orderIndex:"",
      },
      editValidate: {
        name: [
          { required: true, message: "内设机构全称不能为空", trigger: "blur" }
        ],
        standard_name_key: [
          { required: true, message: "对应标准分类不能为空", trigger: "blur" }
        ],
        orderIndex: [
          {
            required: true,
            message: "排序不能为空",
            trigger: "blur",
            validator: validateSequence
          }
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
      this.userNew = this.objs;
      if (!this.insId) this.insId = this.userNew.insId;
      this.getBranchs(0);
      //对应便准分类
      depOption().then(res => {
        this.insCategory = res.datas;
      });
    }
  },
  created() {
    // let userNew = getUserInfo();
    this.userNew = this.objs;
    // this.reload()
    if (!this.insId) this.insId = this.userNew.insId;
    this.getBranchs(0);
    //对应便准分类
    depOption().then(res => {
      this.insCategory = res.datas;
    });
  },
  components: {
    Treeselect
  },
  methods: {
    getBranchs(index) {
      this.loading = true;
      let params = {
        insId: this.insId
      };
      //列表渲染
      innerDepList(params).then(res => {
        if (res.code == 10000) {
          this.dataList = res.datas;
          this.depList = res.datas;
          this.branameclick(index);
          this.data1 = res.datas[0].depList;
        }
        this.loading = false;
      });
    },
    branameclick(index) {
      this.data1 = this.dataList[index].depList;
      this.selectIndex = index;
      this.selIns = this.dataList[index].hasDeps;
      let depModel = this.dataList[index];
      this.branchId = depModel.branchId;
      this.branchName = depModel.branchName;
      if (depModel.deps) this.data = depModel.deps;
      else this.data = [];
    },
    onInsCategorySelectChange(node) {
      this.editObje.standard_name_key = node.code;
      this.editObje.depType = node.name;
    },
    edit(row) {
      if (this.editObje.standard_name_key) {
        this.editObje = {
          standard_name_key: null
        };
      }
      this.editObje.name = row.depName;
      this.editObje.orderIndex = row.orderIndex;
      this.editObje.standard_name_key = row.depType;
      this.editObje.depId = row.depId;
      this.editObje.remark = row.remark;
      this.ModalShow = true;
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
          deleteDepPiece(params).then(res => {
            if (res.code == 10000) {
              Message.success("删除成功!");
              let index = 0;
              this.getBranchs(index);
            } else {
              Message.error(res.data.msg);
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
      this.editObje.orderIndex = 0;
      this.ModalShow = true;
    },
    InsSelChange(index) {
      if (index == -1) {
        Modal.confirm({
          title: "提示信息",
          content: "无内设机构时，将清除已设置内设机构，是否继续？",
          onOk: () => {
            //删除分院区信息
            let params = {
              branchId: this.branchId
            };
            if (this.branchId) {
              //删除
              deleteDep(params).then(res => {
                if (res.code == 10000) {
                  Message.success("删除成功!");
                  this.getBranchs(this.selectIndex);
                } else {
                  Message.error(res.msg);
                }
              });
            }
          }
        });
      }
    },
    cancleSubmit(name) {
      this.ModalShow = false;
    },
    createExt(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let params = {
            branchId: this.branchId,
            depId: this.editObje.depId,
            branchName: this.branchName,
            depName: this.editObje.name,
            name: this.editObje.depType,
            orderIndex: this.editObje.orderIndex,
            remark: this.editObje.remark,
            code: this.editObje.standard_name_key
          };
          if (params.depId) {
            editDep(params).then(res => {
              if (res.code == 10000) {
                Message.success("保存成功!");
                // this.getBranchs(this.selectIndex);
                let index = 0;
                this.getBranchs(index);
              } else {
                Message.error(res.data.msg);
              }
            });
            this.ModalShow = false;
          } else {
            //新增
            addDep(params).then(res => {
              if (res.code == 10000) {
                Message.success("保存成功!");
                let index = 0;
                this.getBranchs(index);
              } else {
                Message.error(res.data.msg);
              }
            });
          }
          this.ModalShow = false;
        }
      });
    },
    UpData(url, param) {
      //更新数据
      this.putRequest(url, param).then(res => {
        if (res.data.code == 40000) {
          Message.success("保存成功!");
          this.getBranchs(this.selectIndex);
        } else {
          Message.error(res.data.msg);
        }
      });
    },
    PostData(url, param) {
      //写入数据
      this.postRequest(url, param).then(res => {
        if (res.data.code == 40000) {
          Message.success("保存成功!");
          this.getBranchs(this.selectIndex);
        } else {
          Message.error(res.data.msg);
        }
      });
    },
    refresh() {
      this.getBranchs(0);
      this.getBranchs(this.selectIndex);
      this.selectIndex = 0;
    },
    clearVal(value) {
      if (value == undefined) {
        this.editObje.standard_name_key = null;
        this.editObje.depType = null;
      }
    }
  }
};
</script>