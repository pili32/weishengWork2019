<template>
  <div style="height:100%;position:relative;">
    <div class="search_tables">
      <Form inline :model="queryPar">
        <Row>
          <Col span="24">
            <Row :gutter="20">
              <Col span="9">
                <FormItem label="机构层级" :label-width="75">
                  <treeselect
                    v-model="currTreeVal"
                    :options="insCategory"
                    :show-count="true"
                    clearValueText="清除"
                    placeholder="请选择"
                    noResultsText="当前没有搜索的内容"
                    @select="onInsCategorySeachChange"
                    :normalizer="normalizer"
                    noChildrenText='当前机构无下属机构'
                  />
                </FormItem>
              </Col>
              <Col span="7">
                <FormItem label="数据层级" :label-width="75" style="width:100%">
                  <Select v-model="queryPar.data_layer" @on-change="reload(true)" >
                    <Option value="0">直属下级</Option>
                    <Option value="1">所有下级</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="机构名称" :label-width="75">
                  <Input v-model="queryPar.ins_name" placeholder="请输入机构名称" @on-enter="reload(true)"/>
                </FormItem>
              </Col>
            </Row>
          </Col>
          <Col span="24">
            <Row :gutter="20">
              <Col span="9">
                <FormItem label="账户名称" :label-width="75" style="width:100%">
                  <Input v-model="queryPar.user_name" placeholder="请输入账户名称" @on-enter="reload(true)" />
                </FormItem>
              </Col>
              <Col span="7">
                <FormItem label="管理员姓名" :label-width="75" style="width:100%">
                  <Input v-model="queryPar.real_name" placeholder="请输入管理员姓名" @on-enter="reload(true)"/>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem label="办公电话" :label-width="75">
                  <Input v-model="queryPar.office_phone" placeholder="请输入办公电话" @on-enter="reload(true)"/>
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
        <div class="search_box">
          <Button type="primary" @click="reload(true)">搜索</Button>
        </div>
      </Form>
    </div>
    <div class="form_lists">
      <div style="height:100%;overflow: hidden;" ref="TableHeight">
        <Table border :columns="columns" :data="data" :loading="loading" :max-height="tableHeight">
          <template slot-scope="{ row }" slot="service_mark">
            <span v-if="row.serviceMark">{{serviceCategory(row.serviceMark)}}</span>
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
  </div>
</template>
<style lang="less" scoped>
.search_tables{
  position: relative;
  .search_box{
    position: absolute;
    right: 30px;
    top: 50%;
    transform: translateY(-60%);
  }
} 
.form_lists{
  height:calc(100% - 116px);
  overflow: hidden;
  padding-bottom: 38px;
  box-sizing: border-box;
}
</style>


<script>
import store from "@/store/index";
import {
  getAccessToken,
  urlPath,
  filterArray,
  getUserInfo,
  xzdataItem,
  getServiceCategory
} from "@/libs/util";
import { Modal, Message } from "iview";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {adminSearchWs , insOptionList} from "@/service/adminSearch"
export default {
  components: {
    Treeselect
  },
  data() {
    return {
      loading: false,
      tableHeight: 520,
      normalizer(node){
        if(node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id:node.id,
          label:node.name,
          children:node.list,
        }
      },
      columns: [
        {
          title: "序号",
          width: 70,
          type: "index",
          align: "center"
        },
        {
          title: "机构名称",
          width: 230,
          key: "insName",
          align: "center"
        },
        {
          title: "主管单位",
          key: "pname",
          width: 230,
          align: "center"
        },
        {
          title: "业务名称",
          slot: "service_mark",
          width: 150,
          align: "center"
        },
        {
          title: "管理员姓名",
          key: "realName",
          width: 100,
          align: "center"
        },
        {
          title: "所在部门",
          key: "department"
        },
        {
          title: "职务",
          key: "job"
        },
        {
          title: "办公电话",
          key: "officePhone"
        },
        {
          title: "邮箱",
          key: "emailAddress"
        }
      ],
      insCategory: [],
      currTreeVal: null,
      data: [],
      total: 0,
      pageIndex: 1,
      pageSize: 15,
      //查询参数定义
      queryPar: {
        data_layer:'1'
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
      this.userInfo = this.objs
      this.currTreeVal = this.userInfo.insId
      this.queryPar.ins_id = this.objs.insId
      this.reload()
    }
  },
  //初始化
  created() {
    // let curUserInfo = getUserInfo();
    this.userInfo = this.objs;
    this.currTreeVal = this.userInfo.insId;
    this.pageSizeOps = [15, 30, 50, 100];
    this.queryPar.ins_id = this.objs.insId;
    this.reload();
    // let params = {
    //   node_path: curUserInfo.ins_node_path
    // };
    // this.getRequest("data_query/xz_ins", urlPath(params)).then(res => {
    //   res.data.data[0].pid = "null"; //循环加载下拉数据时第一条数据的pid需要置为null
    //   this.insCategory = xzdataItem(res.data.data);
    // });
    insOptionList().then(res=>{
      if(res.datas){
        this.insCategory = res.datas;
      }
    })
  },
  mounted() {
    //计算table的高度
    this.$nextTick(() => {
      let tableHeight = this.$refs.TableHeight.offsetHeight;
      this.tableHeight = tableHeight;
    });
    var _this = this;
    window.onresize = function(){ // 定义窗口大小变更通知事件
        let tableHeight = _this.$refs.TableHeight.offsetHeight;
        _this.tableHeight = tableHeight;
    };
  },
  beforeDestroy(){
    window.onresize = null;
  },
  //方法
  methods: {
    reload(flag) {
      if (!this.currTreeVal) {
        this.queryPar.ins_id = this.userInfo.insId;
      }
      //搜索时从第1页开始搜索
      if (flag) {
        this.pageIndex = 1;
      }
      this.loading = true;
      //查询相关参数
      var where = {
        ins_id: this.queryPar.ins_id,
        data_layer: this.queryPar.data_layer,
        ins_name: this.queryPar.ins_name,
        user_name: this.queryPar.user_name,
        real_name: this.queryPar.real_name,
        office_phone: this.queryPar.office_phone
      };
      let params = {
        page:{
          pageNum:this.pageIndex,
          pageSize:this.pageSize,
          orderBy:''
        },
        dataLayer:this.queryPar.data_layer,
        insId:this.currTreeVal,
        insName:this.queryPar.ins_name,
        officePhone:this.queryPar.office_phone,
        realName:this.queryPar.real_name,
        userName:this.queryPar.user_name
      }
      adminSearchWs(params).then(res=>{
        this.loading = false;
        if(res.datas){
          // 查询成功
          this.data = res.datas;
          this.total = res.total;
        }
      })
      // let params = {
      //   is_XZ: true,
      //   page_index: this.pageIndex,
      //   page_size: this.pageSize,
      //   sql_where: JSON.stringify(where)
      // };
      // this.getRequest("data_query/user_list", urlPath(params)).then(res => {
      //   this.total = res.data.data.total_count;
      //   var resData = res.data.data.items;
      //   if (resData) {
      //     this.data = resData;
      //   }
      //   this.loading = false;
      // });
    },
    Details(row) {
      this.$router.push({
        name: "insDataQueryDtls",
        params: {
          id: row.ins_id
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
    onInsCategorySeachChange(node) {
      this.queryPar.ins_id = node.id;
      this.currTreeVal=node.id;
      this.reload(true);
    },
    serviceCategory(key)
    {
      return getServiceCategory(key);
    }
  }
};
</script>

