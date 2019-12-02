<template>
  <div style="height:100%;position:relative;">
    <div>
      <Form inline :model="queryPar" v-if="queryPar">
        <FormItem>
          <Input v-model="queryPar.name" placeholder="姓名" @on-enter="reload(1)"/>
        </FormItem>
        <FormItem>
          <Input v-model="queryPar.idcardNo" placeholder="证件号" @on-enter="reload(1)"/>
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
          <template slot-scope="{row}" slot="comeoutType">
            <span
              v-for="(item,index) in ComeOutMode"
              :key="index"
              v-if="item.itemvalue1==row.comeoutType"
            >{{ item.name }}</span>
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
  .form_lists{
    height:calc(100% - 60px);
    overflow: hidden;
    padding-bottom: 38px;
    box-sizing: border-box;
  }
</style>
<script>
import {comeoutPerson,del,dtls} from '@/service/unitPersonalManagement'

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
          width: 90,
          type: "index"
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
          slot: "comeoutType"
        },
        {
          title: "移除前身份",
          width: 150,
          slot: "comeoutBeforeIdentity"
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
        }
      ],
      data: [],
      total: 0,
      pageIndex: 0,
      pageSize: 15,
      idcardTypes: [],
      ComeOutMode: null,
      //查询参数定义
      queryPar: {
        name: null,
        idcardNo: null,
        chk_status: null
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
    // this.getDictionaries("ComeOutMode").then(res => {
    //   let dataitem_dtls = res.data.data.data_item_dtls;
    //   if (dataitem_dtls) {
    //     this.ComeOutMode = dataitem_dtls;
    //   }
    // });
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
         page:{
          pageNum:this.pageIndex,
          pageSize: this.pageSize,
        },
        name: this.queryPar.name,
        idcardNo: this.queryPar.idcardNo
      };
      //初次列表渲染
      comeoutPerson(params).then(res=>{
            if(res.code == 10000){
          this.total =res.total;
          this.data = res.datas
          dtls('ComeOutMode').then(res=>{
              this.ComeOutMode = res.datas
          })
        }else{
            Message.error(data.msg);
        }
      })
        this.loading = false;

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
        title: "删除",
        content: "<p>确定要删除？</p>",
        onOk: () => {
        let params ={
        coreId :row.coreId,
           hrId :row.hrId,
          }
             del(params).then(res=>{
            if(res.code==10000){
              Message.success("删除成功!");
              this.reload();
            }
              Message.error(res.data.msg);
          })
        }
      });
    }
  }
};
</script>

