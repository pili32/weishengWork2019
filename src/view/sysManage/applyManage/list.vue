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
<template>
  <div style="height:100%;position:relative;">
    <div>
      <Form inline :model="queryPar" v-if="queryPar">
        <FormItem label="申报人电话" :label-width="75" style="width:200px">
          <Input v-model="queryPar.applyTel" placeholder="请输入手机号" @on-enter="reload(1)" />
        </FormItem>
        <FormItem label="申请时间" :label-width="75" style="width:200px">
          <DatePicker v-model="queryPar.applyDate" format="yyyy-MM-dd" type="date" placeholder="选择日期" @on-change="setApplyDate"></DatePicker>
        </FormItem>
        <FormItem label="审批状态" :label-width="75" style="width:200px">
          <Select v-model="queryPar.type" clearable @on-change="reload(1)">
            <Option value="0">待审核</Option>
            <Option value="1">退回</Option>
            <Option value="2">通过</Option>
            <Option value="3">不通过</Option>
          </Select>
        </FormItem>
        <FormItem label="机构名称" :label-width="75" style="width:200px">
          <Input v-model="queryPar.insName" placeholder="请输入机构名称" @on-enter="reload(1)" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="reload(1)">搜索</Button>
        </FormItem>
      </Form>
    </div>
    <div class="form_lists">
      <div style="height:100%;overflow: hidden;" ref="TableHeight">
        <Table border :columns="columns" :data="data" :loading="loading" :height="tableHeight">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{row}" slot="action">
            <div class="action-btn">
              <a v-if="row.auditStatus!='待审核'" @click="view(row.id,'view')">查看</a>
              <a v-else @click="view(row.id,'apply')">审核</a>
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
    <!-- <Modal
      v-model="ModalShow"
      :mask-closable="false"
      :footer-hide="true"
      width="900"
      class-name="vertical-center-modal"
    >
      
    </Modal>-->
  </div>
</template>

<script>
import { queryList } from "@/service/applyManage";
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
          title: "操作",
          slot: "action",
          width: 130,
          align: "center"
        },
        {
          type: 'index',
          width: 90,
          title:'编号',
          align: 'center'
        },
        {
          title: "申请人电话",
          key: "applyTel"
        },
        {
          title: "申报单位名称",
          key: "insName"
        },
        {
          title: "单位账号",
          key: "insAccount"
        },
         {
          title: "激活码",
          key: "activeCode"
        }, {
          title: "申请时间",
          key: "registeDate"
        },
        {
          title: "审核状态",
          key: "auditStatus"
        },
      ],
      data: [],
      total: 0,
      pageIndex: 0,
      pageSize: 15,
      //主体编辑
      ModalShow: false,
      mainInfo: {},
      //查询参数定义
      queryPar: {
        type: '0',
        insName: "",
        applyDate:'',
        applyTel:'',
      }
      // editValidate: {
      //   name: [{ required: true, message: "请输入配置名称", trigger: "blur" }],
      //   category: [
      //     { required: true, message: "请输入配置类型", trigger: "change" }
      //   ],
      //   imgPoint: [
      //     { required: true, message: "请输入图片指向", trigger: "blur" }
      //   ],
      //   showType: [
      //     { required: true, message: "请选择显示类型", trigger: "change" }
      //   ]
      // }
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
    setApplyDate(formatDate,date){
      this.queryPar.applyDate=formatDate;
      this.reload(1)
    },
    view(id, type) {
      this.$router.push({
        name: "applyManageInfo",
        params: { id: id, type: type }
      });
    },
    reload(page) {
      if (page != undefined) {
        this.pageIndex = page;
      }
      this.loading = true;
      // //查询相关参数
      // var where = {
      //   name: this.queryPar.name,
      //   code: this.queryPar.code,
      //   category: null
      // };
      // if (this.queryPar.dataItemCategory != "-999") {
      //   where.category = this.queryPar.dataItemCategory;
      // }

      let params = {
        page: {
          pageNum: this.pageIndex,
          pageSize: this.pageSize
        },
        type: this.queryPar.type === "" ? null : parseInt(this.queryPar.type),
        insName: this.queryPar.insName,
        applyDate:this.queryPar.applyDate,
        applyTel:this.queryPar.applyTel
      };

      //页面初次table页渲染
      queryList(params).then(res => {
        if (res.code == 10000) {
          var newList = [];
          for (let m of res.datas) {
            //if( (type==null||type==m.auditStatus) && (insName==null||m.insName.indexOf(insName)!=-1) ){
            newList.push({
              //草稿状态无auditStatus 已剔除
              auditStatus:
                m.auditStatus == 0
                  ? "待审核"
                  : m.auditStatus == 1
                  ? "退回"
                  :  m.auditStatus == 2
                  ? "通过"
                  : "不通过",
              id: m.id,
              insName: m.insName,
              registeDate: m.registeDate,
              registedBy: m.registedBy,
              applyTel:m.applyTel,
              insAccount:m.insAccount,
              activeCode:m.activeCode
            });
            //}
          }
          this.data = newList;
          this.total = res.total;
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

    cancleSubmit() {
      this.$refs["editValidate"].resetFields();
      this.ModalShow = false;
    },
    //文件超出指定大小限制时的钩子，返回字段为 file, fileList
    handleMaxSize1(file) {
      Message.error("File  " + file.name + " is too large, no more than 2M.");
    }
  }
};
</script>