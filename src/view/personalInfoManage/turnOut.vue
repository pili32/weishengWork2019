<template>
  <div>
    <Form
      :model="obj"
      v-if="obj"
      :label-width="80"
      ref="formTurnOutValidate"
      :rules="ruleTurnOutValidate"
    >
      <FormItem label="姓名">{{obj.name}}</FormItem>
      <FormItem label="性别">{{obj.gender == 1 ? '男':'女' }}</FormItem>
      <FormItem label="证件号码">{{obj.idcardNo}}</FormItem>
      <FormItem label="转出原因" prop="comeoutType"  >
        <treeselect
          v-model="obj.comeoutType"
          :options="ComeOutMode"
          :disable-branch-nodes="true"
          :show-count="true"
          clearValueText="清除"
          placeholder="输入要搜索的内容"
          noResultsText="当前没有搜索的内容"
          @input="onTurnOutClearVal"
          :normalizer='normalizer'
          :value='itemvalue1'
          @select="selectNode"
        />
      </FormItem>
      <FormItem label="转出时间" prop="comeoutDate">
        <DatePicker type="month" placeholder="请选择转出时间" :editable="false" v-model="obj.comeoutDate"></DatePicker>
      </FormItem>
      <FormItem label="转出说明" prop="comeoutRemarks">
        <Input
          v-model="obj.comeoutRemarks"
          type="textarea"
          :autosize="{minRows: 3,maxRows: 5}"
          placeholder="请输入转出说明"
        />
      </FormItem>
      <FormItem>
        <Button size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="submit('formTurnOutValidate')">确定</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import {comeout,dtls} from '@/service/unitPersonalManagement'

import {
  getAccessToken,
  urlPath,
  dataItemTreeHandle,
  dateFormat
} from "@/libs/util";
import { Modal, Message } from "iview";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
  props: ["obj", "comeOutType"],
  data() {
    return {
      itemvalue1:'',
      ComeOutMode: null,
      normalizer(node){
        if(node.children && !node.children.length){
          delete node.children
        }
        return{
          id:node.id,
          label:node.name,
          children:node.children,
          value:node.itemvalue1
        }
      },
      ruleTurnOutValidate: {
        comeoutRemarks:{required: true, message: "请输入转出说明", trigger: "blur"},
        comeoutType: [
          { required: true, message: "请选择转出原因", trigger: "blur" }
        ],
        comeoutDate: [
          {
            required: true,
            type: "date",
            message: "请选择转出时间",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    let type = this.comeOutType;
    let code='ComeOutMode'

    dtls('ComeOutMode').then(res=>{
        // this.ComeOutMode=res.datas
      this.ComeOutMode =res.datas
    })
  },
  mounted() {},
  components: {
    Treeselect
  },
  methods: {
    onTurnOutClearVal(value) {
      if (value == undefined) {
        this.obj.comeoutType = null;
      }
    },
    selectNode(node){
      this.obj.value1 =node.itemvalue1
    },
    //取消回调事件
    cancel() {
      this.$refs["formTurnOutValidate"].resetFields();
      this.$emit("cancel"); //向父组件传值
    },
    //提交回调事件
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            coreId: this.obj.coreId,
            hrId: this.obj.hrId,
            comeoutType: this.obj.value1,
            comeoutDate: "",
            comeoutRemarks: this.obj.comeoutRemarks
          };
          params.comeoutDate = dateFormat(
            "yyyy-MM",
            new Date(this.obj.comeoutDate)
          );
          comeout(params).then(res=>{
            var data = res;
            this.$emit("success", data); //向父组件传值

          })
        }
      });
    }
  }
};
</script>

