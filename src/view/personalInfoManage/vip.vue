<template>
  <div>
    <Form
      :model="obj"
      v-if="obj"
      :label-width="80"
      ref="formModifyVipValidate"
      :rules="ruleModifyVip"
    >
      <FormItem label="权限选择" prop="permission"  >
        <Select v-model="obj.permission" @on-change="permission">
          <Option v-for="item in vipList" :value="item.itemvalue1" :key="item.itemvalue1">{{ item.name }}</Option>
      </Select>  
      </FormItem>
      <FormItem>
        <Button size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="submit('formModifyVipValidate')">确定</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import {
dtls
} from "@/service/insSubManageDtl";
import {updateName,setPermission} from '@/service/unitPersonalManagement'
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import Treeselect from "@riophae/vue-treeselect";
import { getAccessToken, urlPath } from "@/libs/util";
import { Modal, Message } from "iview";
export default {
  props: ["obj"],
  data() {
    return {
      ComeOutMode: null,
      vipList:[],
      ruleModifyVip: {
        permission: [
          { required: true, message: "设置权限", trigger: "blur" }
        ]
      }
    };
  },
  created() {
   dtls("PersonalPermission").then(res=>{
     this.vipList =res.datas
   })
  },
  components:{
    Treeselect
  },
  mounted() {},
  methods: {
    //取消回调事件
    cancel() {
      this.$refs["formModifyVipValidate"].resetFields();
      this.$emit("cancel"); //向父组件传值
    },
    onTurnOutClearVal(node){

    },
    permission(node){
    },
    //提交回调事件
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            hrId: this.obj.hrId,
            permission:this.obj.permission
          };
          setPermission(params).then(res=>{
            var data = res
           this.$emit("success", data); //向父组件传值
          })
      //   updateName(params).then(res=>{
      //       var data = res
      //  this.$emit("success", data); //向父组件传值

      //   })
      
          // this.postPersonalApiRequest("online/updateNameById", params).then(
          //   res => {
          //     var data = res.data;
          //     this.$emit("success", data); //向父组件传值
          //   }
          // );
        }
      });
    }
  }
};
</script>

