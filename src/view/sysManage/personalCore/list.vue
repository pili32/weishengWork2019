<template>
  <div style="height:100%;position:relative;">
    <div>
      <Form inline :model="queryPar" v-if="queryPar">
        <FormItem>
          <Input v-model="queryPar.name" placeholder="姓名" @on-enter="reload(1)" />
        </FormItem>
        <FormItem>
          <Input v-model="queryPar.certificateNo" placeholder="证件号码" @on-enter="reload(1)" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="reload(1)">搜索</Button>
        </FormItem>
      </Form>
    </div>
    <div class="form_lists">
      <div style="height:100%" ref="TableHeight">
        <Table border :columns="columns" :data="data" :loading="loading" :height="tableHeight">
          <template slot-scope="{row}" slot="action">
            <div class="action-btn">
              <a @click="deletes(row)">删除</a>
            </div>
          </template>
          <template slot-scope="{row}" slot="user_loginid">
            <span v-if="row.user_loginid" style="color:green;">已注册</span>
            <span v-else style="color:red;">未注册</span>
          </template>
          <template slot-scope="{row}" slot="gender">
            <span v-if="row.gender == 1">男</span>
            <span v-else-if="row.gender == 2">女</span>
          </template>
          <template slot-scope="{row}" slot="certificateType">
            <span
              v-for="(item,index) in idcardTypes"
              :key="index"
              v-if="item.itemvalue1==row.certificateType"
            >{{ item.name }}</span>
          </template>
          <template
            slot-scope="{row}"
            slot="birthDate"
          >{{ row.birthDate | dateFmt("yyyy-MM-dd") }}</template>
          <template
            slot-scope="{row}"
            slot="start_work_date"
          >{{row.start_work_date | dateFmt("yyyy-MM-dd") }}</template>
          <template
            slot-scope="{row}"
            slot="comein_date"
          >{{row.comein_date | dateFmt("yyyy-MM-dd") }}</template>
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
import {query,deletes,dtls} from "@/service/personalUser";
import {
  getAccessToken,
  urlPath,
  validateSequence,
  dateFormat,
  getUserInfo
} from "@/libs/util";
import { Modal, Message } from "iview";
export default {
  data() {
    return {
      loading: false,
      tableHeight: 520,
      columns: [
        {
          title: "操作",
          slot: "action",
          width: 70,
          align: "center"
        },
        {
          title: "手机号",
          key: "telPhone",
          width: 120,
          align: "center"
        },
        {
          title: "姓名",
          key: "name",
          width: 80,
          align: "center"
        },
        {
          title: "性别",
          slot: "gender",
          width: 70,
          align: "center"
        },
        {
          title: "出生年月",
          slot: "birthDate",
          width: 100,
          align: "center"
        },
        {
          title: "证件类型",
          slot: "certificateType",
          width: 100,
          align: "center"
        },
        {
          title: "证件号码",
          key: "certificateNo",
          width: 160,
          align: "center"
        },
        {
          title: "身份类型",
          key: "identityType",
          width: 150,
          align: "center"
        },
        {
          title: "机构名称",
          key: "insName",
          width: 150,
          align: "center"
        },
        {
          title: "最高学历",
          key: "highestDegree",
          width: 100,
          align: "center"
        },
        {
          title: "最高学位",
          key: "highestEdu",
          width: 90,
          align: "center"
        },
        {
          title: "最高职称",
          key: "highestTitle",
          width: 90,
          align: "center"
        },
        {
          title: "coreId1",
          key: "coreId1",
          width: 270,
          align: "center"
        },
        {
          title: "coreId2",
          key: "coreId2",
          width: 270,
          align: "center"
        },
        {
          title: "添加时间",
          key: "createDate",
          width: 150,
          align: "center"
        }
      ],
      data: [],
      total: 0,
      pageIndex: 0,
      pageSize: 15,
      //主体编辑
      ModalShow: false,
      idcardTypes: [],
      editObje: {},
      //查询参数定义
      queryPar: {
        name: null,
        certificateNo: null
      }
    };
  },
  created() {
    this.pageSizeOps = [15, 30, 50, 100];
      dtls("IdcardType").then(res => {
      this.idcardTypes = res.datas;
    });
    this.reload(1);
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
  methods: {
    reload(page) {
      if (page != undefined) {
        this.pageIndex = page;
      }
      // this.loading = true;
      //查询相关参数
      let params = {
        page: {
          pageNum: this.pageIndex,
          pageSize: this.pageSize
        },
        name : this.queryPar.name,
        certificateNo :this.queryPar.certificateNo
      };
      query(params).then(res => {
        if (res.code == 10000) {
          this.total = res.total;
          this.data = res.datas;

        } else {
          Message.error(data.msg);
        }
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
    //删除
    deletes(row) {
      let Id = row.id;
      Modal.confirm({
        title: "删除",
        content: "<p>确定要删除？</p>",
        onOk: () => {
            let params = {
            id: Id
          };
         deletes(params).then(res => {
            if (res.code == 10000) {
              Message.success("删除成功");
              this.reload();
            } else {
              Message.error(res.data.msg);
            }
          });
        }
      });
    }
  }
};
</script>