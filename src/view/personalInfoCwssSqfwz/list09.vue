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
        <FormItem label="单位类型" :label-width="75" style="width:200px">
          <Select v-model="queryPar.branchCategory" @on-change="reload(1)">
            <Option value="-999">所有</Option>
            <Option value="40">村卫生室</Option>
            <Option value="30">社区服务中心</Option>
          </Select>
        </FormItem>
        <FormItem label="所在单位" :label-width="75" style="width:300px">
          <Select v-model="queryPar.branchId" @on-change="reload(1)">
            <Option value="-999">所有</Option>
            <Option
              v-for="(item,index) in curInsBranchs"
              :value="item.id"
              :key="index+'0'"
            >{{item.name}}</Option>
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
          <template slot-scope="{row}" slot="action">
            <div class="action-btn">
              <a @click="onDel(row)">删除</a>
            </div>
          </template>
          <template slot-scope="{row}" slot="comeoutBeforeIdentity">
            <span
              v-if="row.comeoutBeforeIdentity && row.comeoutBeforeIdentity.indexOf('02') == 0"
            >卫生单位在职人员</span>
            <span
              v-else-if="row.comeoutBeforeIdentity && row.comeoutBeforeIdentity.indexOf('03') == 0"
            >在校医学生</span>
            <span
              v-else-if="row.comeoutBeforeIdentity && row.comeoutBeforeIdentity.indexOf('04') == 0"
            >卫生系统退休人员</span>
            <span
              v-else-if="row.comeoutBeforeIdentity && row.comeoutBeforeIdentity.indexOf('05') == 0"
            >其它人员</span>
          </template>
          <template slot-scope="{row}" slot="branchCategory">
            <span v-if="row.branchCategory && row.branchCategory.indexOf('30') == 0">社区服务中心</span>
            <span v-else-if="row.branchCategory && row.branchCategory.indexOf('40') == 0">村卫生室</span>
          </template>
          <template slot-scope="{row}" slot="gender">
            <span v-if="row.gender == 1">男</span>
            <span v-else-if="row.gender == 2">女</span>
          </template>
          <template slot-scope="{row}" slot="comeoutType">
            <span
              v-for="(item,index) in ComeOutMode"
              :key="index"
              v-if="item.itemvalue1==row.comeoutType"
            >{{ item.name }}</span>
          </template>
          <template slot-scope="{row}" slot="idcardType">
            <span
              v-for="(item,index) in idcardTypes"
              :key="index"
              v-if="item.itemvalue1==row.idcardType"
            >{{ item.name }}</span>
          </template>
          <template slot-scope="{row}" slot="birthDate">{{row.birthDate | dateFmt("yyyy-MM-dd")}}</template>
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
import {
  realnameCertificationAudit,
  comeoutVillageHospitalPerson,
  updateUnit,
  villageHospitalPerson,
  del,
  branchsQuery,
  dtls
} from "@/service/villageHospital";
import {
  getAccessToken,
  urlPath,
  getUserInfo,
  dataItemSelectHandle,
  dateFormat
} from "@/libs/util";
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
          width: 120,
          align: "center"
        },
        {
          title: "移除原因",
          width: 150,
          align: "center",
          slot: "comeoutType"
        },
        {
          title: "移除前身份",
          width: 130,
          align: "center",
          slot: "comeoutBeforeIdentity"
        },
        {
          title: "单位类型",
          slot: "branchCategory",
          align: "center",
          width: 110
        },
        {
          title: "所在单位",
          key: "branchName",
          align: "center",
          width: 200
        },
        {
          title: "姓名",
          key: "name",
          align: "center",
          width: 100
        },
        {
          title: "性别",
          slot: "gender",
          width: 80,
          align: "center"
        },
        {
          title: "出生年月",
          slot: "birthDate",
          align: "center"
        },
        {
          title: "证件类型",
          slot: "idcardType",
          align: "center"
        },
        {
          title: "证件号码",
          key: "idcardNo",
          align: "center"
        }
      ],
      data: [],
      total: 0,
      pageIndex: 0,
      pageSize: 15,
      idcardTypes: [],
      ComeOutMode: null,
      curInsBranchs: null,
      //查询参数定义
      queryPar: {
        name: null,
        idcardNo: null,
        chk_status: null,
        branchCategory: null,
        branchId: null
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
    dtls("IdcardType").then(res => {
      this.idcardTypes = res.datas;
    });
    this.pageSizeOps = [15, 30, 50, 100];
    this.reload();
    branchsQuery().then(res => {
      this.curInsBranchs = res.datas;
    });

    //请求数据字典
    dtls("ComeOutMode").then(res => {
      this.ComeOutMode = res.datas;
    });
    //请求下拉框
    branchsQuery().then(res => {
      this.curInsBranchs = res.datas;
    });
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
          orderBy: "hr.create_date"
        },
        ins_id: this.userInfo.ins_id,
        name: this.queryPar.name,
        idcardNo: this.queryPar.idcardNo,
        branchCategory: null,
        branchId: null
      };
      if (this.queryPar.branchId != "-999") {
        params.branchId = this.queryPar.branchId;
      } else {
        this.queryPar.branchCategory = "-999";
      }
      if (this.queryPar.branchCategory != "-999") {
        params.branchCategory = this.queryPar.branchCategory;
      }
      comeoutVillageHospitalPerson(params).then(res => {
        if (res.code == 10000) {
          this.total = res.datas.pageTotals;
          this.data = res.datas;
        } else {
          Message.error(data.msg);
        }
        this.loading = false;
      });
      //加载单位下村卫生室和服务站数据
    },
    onPageChange(num) {
      this.pageIndex = num;
      this.reload();
    },
    onPageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.reload();
    },
    //删除按钮
    onDel(row) {
      Modal.confirm({
        title: "提示信息",
        content: "确认删除？",
        onOk: () => {
          let params = {
            coreId: row.coreId,
            hrId: row.hrId
          };
          del(params).then(res => {
            if (res.datas == 10000) {
              Message.success("删除成功!");
              this.reload();
            }
            Message.error(res.data.msg);
          });
        }
      });
    }
  }
};
</script>

