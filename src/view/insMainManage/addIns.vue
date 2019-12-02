<template>
  <Row :gutter="25" style="margin: 10px auto;">
    <Col :span="24">
      <Form
        :model="formTbale"
        ref="formValidate"
        :label-width="90"
        :rules="ruleValidate"
        class="addFrom"
      >
        <FormItem label="主管单位">
          <strong v-model="formTbale.name">{{formTbale.name}}</strong>
        </FormItem>
        <FormItem label="单位全称" prop="pname">
          <Input v-model="formTbale.pname" placeholder="与单位公章一致" />
        </FormItem>
        <FormItem label="机构类别" prop="categoryKey">
          <treeselect
            v-model="formTbale.categoryKey"
            @select="onInsCategorySelectChange"
            :options="insCategory"
            :disable-branch-nodes="true"
            :show-count="true"
            clearValueText="清除"
            placeholder="输入要搜索的内容"
            noResultsText="当前没有搜索的内容"
            :normalizer="normalizer"
          />
        </FormItem>
        <FormItem label="行政隶属" prop="organLayerKey">
          <Select
            v-model="formTbale.organLayerKey"
            label-in-value
            @on-change="onOrganLayerSelectChange"
          >
            <Option
              v-for="(item,index) in organLayer"
              :value="item.code"
              :key="index+'0'"
            >{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="机构代码" prop="ins_key2">
          <Row>
            <Col span="6">
              <span v-model="formTbale.ins_key1">{{formTbale.ins_key1}}</span>
            </Col>
            <Col span="9">
              <Input type="text" v-model="formTbale.ins_key2" :maxlength="3" />
            </Col>
            <Col span="9">
              <span style="margin-left:10px;color:red;">*录入后不可变更</span>
            </Col>
          </Row>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('formValidate')">保存</Button>
        </FormItem>
      </Form>
    </Col>
  </Row>
</template>
<style lang="less" scoped>
.addFrom {
  width: 40%;
  margin: 0 auto;
}
</style>
<script>
import {
  addSubIns,
  admOption,
  option,
  queryUpperIns
} from "@/service/insSubManage";
import {
  getAccessToken,
  urlPath,
  getUserInfo,
  dataItemSelectHandle,
  dataItemTreeHandle,
  dataItemHandle
} from "@/libs/util";
import { Modal, Message } from "iview";
import axios from "axios";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  data() {
    insName: "";
    //校验机构代码流水号
    const validateInsKey2 = (rule, value, callback) => {
      var reg = /^\d{3}/;
      if (value === "") {
        callback(new Error("请输入三位流水号！"));
      } else if (!reg.test(value)) {
        callback(new Error("机构代码流水号输入有误！"));
      } else {
        callback();
      }
    };
    return {
      TreeselectValue: 0,
      isRefresh: true,
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
      formTbale: {
        name: null,
        categoryKey: null,
        categoryValue: null,
        organLayerKey: null,
        organLayerValue: null,
        ins_key2: ""
      },
      ruleValidate: {
        pname: [{ required: true, message: "请输入机构全称", trigger: "blur" }],
        categoryKey: [
          { required: true, message: "请选择机构类别", trigger: "blur" }
        ],
        organLayerKey: [
          { required: true, message: "请选择行政隶属", trigger: "blur" }
        ],
        ins_key2: [
          {
            required: true,
            validator: validateInsKey2,
            trigger: "blur"
          }
        ]
      },
      insCategory: [],
      organLayer: [],
      userInfo: null,
      ins_key1: "WS420000"
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
    this.getCategoryKey();
    //权限校验，必须是三级行政机构
    // if (
    //   !curUserInfo ||
    //   !curUserInfo.ins_categoryKey ||
    //   !curUserInfo.ins_categoryKey.startsWith("0")
    // ) {
    //   Modal.error({
    //     title: "提示信息",
    //     content: "无权操作！",
    //     onOK: () => {
    //       //关闭当前页面
    //     }
    //   });
    // }
    //机构类别
    option(params).then(res => {
      if (res.code == 10000) {
        this.insCategory = res.datas;
      }
    });

    //行政隶属
    // admOption().then(res=>{
    //   this.organLayer =res.datas
    // })

    //行政隶属
    admOption(params).then(res => {
      if (res.code == 10000) {
        this.organLayer = res.datas;
      }
    });
    let params = {
      ins_category: ""
    };
  },
  components: {
    Treeselect
  },
  methods: {
    getCategoryKey(categoryKey) {
      //主管单位和唯一标识
      let params = {
        categoryKey: categoryKey
      };
      queryUpperIns(params).then(res => {
        if (res.code == 10000) {
          this.formTbale.name = res.datas.insName;
          let datas = res.datas.insCode;
          this.formTbale.ins_key1 = datas.substring(0, datas.length - 3);
          this.formTbale.ins_key2 = datas.substring(
            datas.length - 3,
            datas.length
          );
        }
      });
    },
    handleSubmit(FormName) {
      this.$refs[FormName].validate(valid => {
        if (valid) {
          let params = {
            name: this.formTbale.pname,
            categoryKey: this.formTbale.categorycode,
            categoryValue: this.formTbale.categoryValue,
            organLayerKey: this.formTbale.organLayerKey,
            organLayerValue: this.formTbale.organLayerValue,
            serialNum: this.formTbale.ins_key1 + this.formTbale.ins_key2 //流水号
          };
          //保存
          addSubIns(params).then(res => {
            if (res.code == 10000) {
              Modal.success({
                title: "提示信息",
                content: "操作成功",
                onOK: () => {
                  this.formTbale = {
                    name: null,
                    categoryKey: null,
                    categoryValue: null,
                    organLayerKey: null,
                    organLayerValue: null
                  };
                  location.reload();
                }
              });
            } else {
              Modal.error({
                title: "提示信息",
                content: res.datas.msg
              });
            }
          });
        }
      });
    },
    handleReset(name) {
      this.$refs[name].resetFields();
    },
    //机构类别选择事件
    onInsCategorySelectChange(node) {
      this.formTbale.categoryKey = node.code;
      let categoryKey = node.code;
      this.formTbale.categorycode = node.code;
      this.formTbale.categoryValue = node.name;
      this.getCategoryKey(categoryKey);

      //获取机构类别
      // option().then(res => {
      //   if (res.code == 10000) {
      //   }
      // });
    },
    //行政隶属选择事件
    onOrganLayerSelectChange(data) {
      this.formTbale.organLayerKey = data.value;
      this.formTbale.organLayerValue = data.label;
    },
    clearVal(value) {
      if (value == undefined) {
        this.formTbale.categoryKey = null;
        this.formTbale.categoryValue = null;
      }
    }
  }
};
</script>

