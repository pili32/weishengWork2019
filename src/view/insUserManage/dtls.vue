<template>
  <div>
    <Form :label-width="85" v-if="obj" style="margin-bottom: 20px;">
      <Row>
        <Col span="12">
          <FormItem label="业务名称">{{obj.name }}</FormItem>
          
        </Col>
        <Col span="12">
          <FormItem label="业务代码">{{obj.code }}</FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="业务账号">{{obj.insUser || obj.userName}}</FormItem>
        </Col>
        <Col span="12">
          <FormItem label="激活码">{{obj.activeCode}}</FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12">
          <FormItem label="是否激活">
            <span v-if="obj.isActive=='1'" style="color:green">激活</span>
            <span v-else style="color:red">未激活</span>
          </FormItem>
        </Col>
        <Col span="12">
          <FormItem label="使用状态">
            <span v-if="obj.enableMark == 100" style="color:green">启用</span>
            <span v-if="obj.enableMark== 0" style="color:red">禁用</span>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="12" style="text-align: center">
          <Button type="primary" @click="enable()">{{obj.enableMark==0?"启用":"禁用"}}</Button>
        </Col>
        <Col span="12" style="text-align: center">
          <Button type="primary" @click="recycle(obj)">回收</Button>
        </Col>
      </Row>
    </Form>
    <Form :model="obj" v-if="obj" ref="formDtlsValidate" :rules="ruleValidate" :label-width="85">
      <FormItem label="管理员姓名" prop="realName">
        <Input v-model="obj.realName" :maxlength="50" />
      </FormItem>
      <FormItem label="单位/部门" prop="department">
        <Input v-model="obj.department" :maxlength="20" />
      </FormItem>
      <FormItem label="职务" prop="job">
        <Input v-model="obj.job" :maxlength="50" />
      </FormItem>
      <FormItem label="办公电话" prop="officePhone">
        <Input v-model="obj.officePhone" :maxlength="20" />
      </FormItem>
      <FormItem label="邮箱" prop="email">
        <Input v-model="obj.email" :maxlength="200" />
      </FormItem>
      <FormItem>
        <Button size="large" @click="cancel">取消</Button>
        <Button type="primary" size="large" @click="submit('formDtlsValidate')">确定</Button>
      </FormItem>
    </Form>
  </div>
</template>
<script>
import {
  edit,
  prohibit,
  recycle,
  queryBussinessAccount
} from "@/service/insAccountManage";
import store from "@/store/index";
import { getAccessToken, urlPath } from "@/libs/util";
import { Modal, Message } from "iview";
export default {
  props: ["obj"],
  provide() {
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true,

      ruleValidate: {
        realName: [
          { required: true, message: "请输入管理员姓名", trigger: "blur" }
        ],
        department: [
          { required: true, message: "请输入单位/部门", trigger: "blur" }
        ],
        job: [{ required: true, message: "请输入职务", trigger: "blur" }],
        officePhone: [
          { required: true, message: "请输入办公电话", trigger: "blur" }
        ],
        email: [{ required: true, message: "请输入邮箱", trigger: "blur" }]
      }
    };
  },
  created() { },
  mounted() {
    // this.enableMark = this.obj.enableMark == 0 ? "启用" : "禁用";
  },
  // inject:['reload'],
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(function() {
        this.isRouterAlive = true;
      });
    
    },
    //取消回调事件
    cancel() {
      this.$refs["formDtlsValidate"].resetFields();
      this.$emit("cancel");
    },
    submit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var pattern = /^([A-Za-z0-9_\-\.])+\@(163.com|vip.163.com|qq.com|42du.cn|sina.com|189.cn|sina.cn)$/;
          let email = false;
          if (pattern.test(this.obj.email)) {
            email = true;
          }
          if (email == true) {
            let params = {
              id: this.obj.id || this.obj.userId,
              realName: this.obj.realName,
              officePhone: this.obj.officePhone,
              department: this.obj.department,
              job: this.obj.job,
              phone_number: this.obj.phone_number,
              email: this.obj.email
            };
            //修该，保存
            edit(params).then(res => {
              if (res.code == 10000) {
                var data = res;
                this.$emit("success", data); //向父组件传值
              } else {
                Message.error(res.datas.msg);
              }
            });
          } else {
            Message.error("请输入正确的邮箱");
          }
        }
      });
    },

    // list() {
    //   console.log( this.obj)
    //   let params = {
    //     insUserId: this.obj.user_id
    //   };
    //   queryBussinessAccount(params).then(res => {
    //     if (res.code == 10000) {

    //     }
    //   });
    // },
    //禁用，启用账号
    enable() {
      let title = "";
      if (this.obj.enableMark == 100) {
        title = "确认禁用该账户？";
      } else {
        title = "确认启用该账户？";
      }
      let params = {
        insAccountId: this.obj.userId || this.obj.id
      };
      Modal.confirm({
        title: "提示信息",
        content: title,
        onOk: () => {
          prohibit(params).then(res => {
            if (res.code == 10000) {
              Message.success("操作成功！");
              this.obj.enableMark == 0
                ? (this.obj.enableMark = 100)
                : (this.obj.enableMark = 0);
            }
          });
        }
      });
    },
    //回收账号
    recycle(list) {
      Modal.confirm({
        title: "提示信息",
        content: "确认回收该账户？",
        onOk: () => {
          let params = {
            insAccountId: this.obj.id || this.obj.userId
          };
          recycle(params).then(res => {
            if (res.code == 10000) {
              // Message.success("操作成功！");
              let data = res;
              this.$emit("success", data); //向父组件传值
            } else {
              Message.error(data.msg);
            }
          });
        }
      });
    }
  }
};
</script>

