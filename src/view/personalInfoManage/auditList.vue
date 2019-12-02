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
        <!-- <FormItem label="身份类型" :label-width="75" style="width:180px">
          <Select v-model="queryPar.identityType" @on-change="reload(1)">
            <Option value="-999">所有</Option>
            <Option value="02">在职人员</Option>
            <Option value="04">退休人员</Option>
          </Select>
        </FormItem> -->
        <FormItem>
          <Button type="primary" @click="reload(1)">搜索</Button>
        </FormItem>
      </Form>
    </div>
    <div class="form_lists">
      <div style="height:100%;overflow: hidden;" ref="TableHeight">
        <Table border :columns="columns" :data="data" :loading="loading" :height="tableHeight">
          <template slot-scope="{row}" slot="action">
            <div class="action-btn">
              <a @click="onPass(row)">通过</a>
              <a @click="dtls(row)">编辑</a>
              <a @click="onReturn(row)">退回</a>
            </div>
          </template>
          <template slot-scope="{row}" slot="identityType">
            <span v-if="row.identityType.indexOf('02') == 0">在职人员</span>
            <span v-if="row.identityType.indexOf('03') == 0">在校医学生</span>
            <span v-else-if="row.identityType.indexOf('04') == 0">退休人员</span>
          </template>
          <template slot-scope="{row}" slot="gender">
            <span v-if="row.gender == 1">男</span>
            <span v-else-if="row.gender == 2">女</span>
          </template>
          <template slot-scope="{row}" slot="idcardType">
            <span
              v-for="(item,index) in idcardTypes"
              :key="index"
              v-if="item.itemvalue1==row.idcardType"
            >{{ item.name }}</span>
          </template>
          <template
            slot-scope="{row}"
            slot="createDate"
          >{{ row.createDate | dateFmt("yyyy-MM-dd") }}</template>
            <template
            slot-scope="{row}"
            slot="birthDate"
          >{{ row.birthDate | dateFmt("yyyy-MM-dd") }}</template>
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
    <Modal v-model="ModalShow" :mask-closable="false" footer-hide loading>
      <p slot="header" style="color:#333333;font-size:16px">
        <span>{{ModalTitle}}</span>
      </p>
      <Form
        :model="dtlsObje"
        v-if="dtlsObje"
        ref="formDtlsValidate"
        :rules="ruleDtlsValidate"
        :label-width="80"
      >
        <FormItem label="姓名" prop="name">
          <Input v-model="dtlsObje.name" placeholder="姓名" />
        </FormItem>
        <FormItem label="证件号码">{{dtlsObje.idcardNo}}</FormItem>
        <FormItem>
          <Button size="large" @click="ModalShow = false">取消</Button>
          <Button type="primary" size="large" @click="dtlsSave('formDtlsValidate')">确定</Button>
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
import { list, pass, editOn, goback, dtls } from "@/service/realNameManage";
import { getAccessToken, urlPath, getUserInfo, dateFormat } from "@/libs/util";
import { Modal, Message } from "iview";
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
          title: "身份类型",
          width: 160,
          slot: "identityType"
        },
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "性别",
          slot: "gender"
        },
        {
          title: "出生年月",
          slot: "birthDate"
        },
        {
          title: "证件类型",
          slot: "idcardType"
        },
        {
          title: "证件号码",
          key: "idcardNo"
        },
        {
          title: "提交时间",
          key: "createDate"
        }
      ],
      data: [],
      total: 0,
      pageIndex: 0,
      pageSize: 15,
      //主体编辑
      ModalShow: false,
      ModalTitle: "",
      dtlsObje: null,
      idcardTypes: [],
      ruleDtlsValidate: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      //查询参数定义
      queryPar: {
        name: null,
        idcardNo: null,
        identityType: null
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
      this.userInfo = this.objs;
      this.reload();
    }
  },
  //初始化
  created() {
    // let curUserInfo = getUserInfo();
    this.userInfo = this.objs;
    this.pageSizeOps = [15, 30, 50, 100];
    dtls("IdcardType").then(res => {
      this.idcardTypes = res.datas;
    });
    this.reload();
  },
  mounted() {
    //计算table的高度
    this.$nextTick(() => {
      let tableHeight = this.$refs.TableHeight.offsetHeight;
      this.tableHeight = tableHeight;
    });
  },
  //数据过滤
  filters: {
    dateFmt(d, fmt) {
      if (d && fmt) {
        return dateFormat(fmt, new Date(d));
      }
      return "";
    }
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
          pageSize: this.pageSize,
          orderBy: "h.create_date desc"
        },
        idcardNo: this.queryPar.idcardNo,
        identityType: null,
        name: this.queryPar.name
      };
      if (this.queryPar.identityType != "-999") {
        params.identityType = this.queryPar.identityType;
      }
      list(params).then(res => {
        if (res.code == 10000) {
          this.total = res.total;
          let arr = res.datas;
          this.data = arr;
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
    dtls(row) {
      let r = row;
      this.dtlsObje = r;
      this.ModalTitle = "编辑人员信息";
      this.ModalShow = true;
      // this.$refs["formDtlsValidate"].resetFields();
    },
    dtlsSave(formName) {
      let params = {
        coreId: this.dtlsObje.coreId,
        // hrId: this.dtlsObje.hrId,
        name: this.dtlsObje.name
        // is_pass: true,
        // chk_userid: this.userInfo.id,
        // chk_username: this.userInfo.user_name,
        // chk_user_realname: this.userInfo.real_name
      };
      this.$refs[formName].validate(valid => {
        if (valid) {
          editOn(params).then(res => {
            var data = res.data;
            if (res.code == 10000) {
              Message.success("操作成功！");
              this.ModalShow = false;
              this.reload();
            } else {
              Message.error(data.msg);
            }
          });
        }
      });
    },
    onPass(row) {
      this.dtlsObje = row;
      let params = {
        coreId: this.dtlsObje.coreId,
        hrId: this.dtlsObje.hrId
      };
      this.onAudit(params);
    },
    onReturn(row) {
      this.dtlsObje = row;
      let params = {
        hrId: this.dtlsObje.hrId
      };
      this.onAudit(params);
    },
    onAudit(params) {
      let title = "";
      if (params.coreId) {
        title = "确认通过？";
      } else {
        title = "确认退回？";
      }
      Modal.confirm({
        title: "提示信息",
        content: title,
        onOk: () => {
          if (title == "确认通过？") {
            let coreId = params.coreId;
            pass(coreId).then(res => {
              if (res.code == 10000) {
                Message.success("通过成功！");
                this.ModalShow = false;
                this.reload();
              } else {
                Message.error(data.msg);
              }
            });
          } else {
            title = "确认退回？";
            let hrId = params.hrId;
            let data = {
              id: hrId
            };
            goback(data).then(res => {
              if (res.code == 10000) {
                Message.success("退回成功！");
                this.ModalShow = false;
                this.reload();
              } else {
                Message.error(data.msg);
              }
            });
          }
        }
      });
    }
  }
};
</script>

