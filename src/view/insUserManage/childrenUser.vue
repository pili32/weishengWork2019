<template>
  <div style="height:100%;position:relative;">
    <div>
      <Form inline :model="queryPar">
        <FormItem label="机构账户" :label-width="75">
          <Input v-model="queryPar.userName" placeholder="请输入机构账户" @on-enter="reload(1)"/>
        </FormItem>
          <FormItem label="机构名称" :label-width="75">
          <Input v-model="queryPar.insName" placeholder="请输入机构账户" @on-enter="reload(1)"/>
        </FormItem>
        <FormItem label="管理员姓名" :label-width="75">
          <Input v-model="queryPar.realName" placeholder="请输入管理员姓名" @on-enter="reload(1)"/>
        </FormItem>
        <FormItem label="数据层级" :label-width="75">
          <Select v-model="queryPar.dataLayer" @on-change="reload(1)" style="width:170px">
            <Option value="0">直属下级</Option>
            <Option value="1">所有下级</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="reload(1)">搜索</Button>
        </FormItem>
      </Form>
    </div>
    <div class="form_lists">
      <div style="height:100%;overflow: hidden;" ref="TableHeight">
        <Table border :columns="columns" :data="data" :loading="loading" :height="tableHeight">
          <template slot-scope="{ row }" slot="action">
            <div class="action-btn">
              <a v-if="row.userName" @click="edit(row)">管理</a>
              <a  @click="editPhone(row)">修改手机号</a>
            </div>
          </template>
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row }" slot="userName">
            <span v-if="row.userName">{{row.userName}}</span>
            <span v-else>
              <div class="action-btn">
                <a @click="createAccount(row)">点我生成</a>
              </div>
            </span>
          </template>
          <template slot-scope="{ row }" slot="isActive">
            <span v-if="row.userName">
              <span v-if="row.isActive" style="color:green">激活</span>
              <span v-else style="color:red">未激活</span>
            </span>
          </template>
          <template slot-scope="{ row }" slot="enableMark">
            <span v-if="row.userName">
              <span v-if="row.enableMark == 100" style="color:green">启用</span>
              <span v-else-if="row.enableMark==0" style="color:red">禁用</span>
            </span>
          </template>
        </Table>
      </div>
    </div>
    <div style="position:absolute;left:0;bottom:0">
      <Page
        show-total
        show-sizer
        show-elevator
        :current="pageIndex"
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
      class-name="vertical-center-modal"
      footer-hide>
      <p slot="header" style="color:#333333;font-size:16px">
        <span>账户管理</span>
      </p>
      <dtls
        :obj="this.editObject"
        v-on:success="accountManagerSuccess"
        v-on:cancel="ModalShow=false;reload()"
      ></dtls>
    </Modal>

    <Modal
      v-model="PhoneModalShow"
      :mask-closable="false"
      class-name="vertical-center-modal"
      footer-hide>
      <p slot="header" style="color:#333333;font-size:16px">
        <span>修改手机号</span>
      </p>
      <checkPhone
        :obj="editObject"
        v-on:success="PhoneModalShow=false;reload()"
        v-on:cancel="PhoneModalShow=false;reload()"
      ></checkPhone>
    </Modal>
  </div>
</template>
<style lang="less" scoped>
  .form_lists{
    height:calc(100% - 60px);
    overflow: hidden;
    padding-bottom: 38px;
    box-sizing: border-box;
  }
</style>
<script>
import {userList,repalcePhone,queryBussinessAccount,createSubInsAccount,createInsAccountName} from '@/service/insSubManage'
import store from "@/store/index";
import { getAccessToken, urlPath, filterArray, getUserInfo } from "@/libs/util";
import { Modal, Message } from "iview";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import dtls from "./dtls.vue";
import checkPhone from "@/view/accountSecure/checkPhone.vue";
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
          width: 140,
          align: "center"
        },
        {
          title: "机构名称",
          width: 280,
          key: "name",

        },

        {
          title: "机构账户",
          slot: "userName",
          width: 160,
          align: "center"
        },
        {
          title: "激活码",
          key: "activeCode",
          align: "center",
          width: 100
        },
        {
          title: "是否激活",
          slot: "isActive",
          align: "center",
          width: 100
        },
        {
          title: "是否启用",
          slot: "enableMark",
          align: "center",
          width: 90
        },
        {
          title: "管理员姓名",
          key: "realName",
          align: "center",
          width: 100
        },
        {
          title: "手机号码",
          key: "phoneNumber",
          align: "center",
          width: 120
        },
        {
          title: "办公电话",
          key: "officePhone",
          align: "center",
          width: 130
        },
        {
          title: "所在部门",
          key: "department",
          align: "center",
          width: 170
        },
        {
          title: "职务",
          key: "job",
          align: "center",
          width: 120
        },
        {
          title: "邮箱",
          key: "email",
          align: "center",
          width: 180
        },
        {
          title: "最后登录时间",
          key: "last_login_date",
          align: "center",
          width: 160
        }
      ],
      ModalShow: false,
      PhoneModalShow: false,
      Title: "编辑",
      editObject: {
        id: "",
        realName: "",
        officePhone: "",
        department: "",
        job: "",
        phoneNumber: "",
        user_id: "",
        email:''
      },
      data: [],
      total: 0,
      pageIndex: 1,
      pageSize: 15,
      //查询参数定义
      queryPar: {
        userName:"",
        realName:"",
        dataLayer:"0",
        insName:'',
      }
    };
  },
  //初始化
  created() {
    // let curUserInfo = getUserInfo();
    // this.userInfo = curUserInfo;
    //权限校验，必须是三级行政机构
    // if (!curUserInfo ||!curUserInfo.ins_category_key ||!curUserInfo.ins_category_key.startsWith("0")) {
    //   Modal.error({
    //     title: "提示信息",
    //     content: "无权操作！",
    //     onOK: () => {
    //       //关闭当前页面
    //     }
    //   });
    // }
    this.pageSizeOps = [15, 30, 50, 100];
    this.reload();
  },
  mounted() {
    //计算table的高度
    this.$nextTick(() => {
      let tableHeight = this.$refs.TableHeight.offsetHeight;
      this.tableHeight = tableHeight;
    });
  },
  components: {
    Treeselect,
    dtls,
    checkPhone
  },
  //方法
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
        accountMark:0,
        dataLayer:this.queryPar.dataLayer,
        realName:this.queryPar.realName,
        serviceMark:'01',
        userName:this.queryPar.userName,
        insName:this.queryPar.insName
      };
      userList(params).then(res=>{
        if(res.code==10000){
          this.total = res.total;
          this.data = res.datas;
          this.loading =false
        }else{
            Message.error(data.msg);
        }
      })
    },
    onPageChange(num) {
      this.pageIndex = num;
      this.reload();
    },
    onPageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.reload();
    },
    //管理
    edit(row) {
      this.editObject = row;
      this.editObject.id = row.user_id;
      this.editObject.service_mark_name = row.name;
      this.ModalShow = true;
    },
    editPhone(row) {
      this.editObject = row;
      this.editObject.id = row.user_id;
      this.editObject.phoneNumber = row.phoneNumber;
      this.PhoneModalShow = true;
    },

    accountManagerSuccess(data) {
        Message.success("更换成功！");
        this.ModalShow = false;
        this.reload();
    },
    //生成人事账户
    createAccount(row) {
      Modal.confirm({
        title: "提示信息",
        content:
          "<b>请确保机构类别正确，生成账户后无法变更<br/>确认为【" +
          row.name +
          "】生成人事管理账户？</b>",
        onOk: () => {
          let params={
            insId : row.insId
          }
          createSubInsAccount(params).then(res=>{
            if(res.code==10000){
              Message.success("生成成功！");
              this.reload()
            }
            Message.error(res.datas.msg);
          })
        }
      });
    }
  }
};
</script>

