<template>
  <div style="height:100%;position:relative;">
    <div>
      <Form inline :model="queryPar">
        <FormItem label="机构层级" :label-width="75" style="width:350px">
          <treeselect
            v-model="currTreeVal"
            :options="insCategory"
            :show-count="true"
            clearValueText="清除"
            placeholder="请选择"
            noResultsText="当前没有搜索的内容"
            @select="onInsCategorySeachChange"
            :normalizer="normalizer"
          />
        </FormItem>
        <FormItem label="数据层级" :label-width="75" style="width:180px">
          <Select v-model="queryPar.data_layer" @on-change="reload(true)">
            <Option value="0" selected>直属下级</Option>
            <Option value="1">所有下级</Option>
          </Select>
        </FormItem>
        <FormItem label="机构名称" :label-width="75" style="width:300px">
          <Input v-model="queryPar.ins_name" placeholder="请输入机构名称" @on-enter="reload(true)"/>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="reload(true)">搜索</Button>
        </FormItem>
      </Form>
    </div>
    <div class="form_lists">
      <div style="height:100%;overflow: hidden;" ref="TableHeight">
        <Table border :columns="columns" :data="data" :loading="loading" :height="tableHeight">
          <template slot-scope="{ row }" slot="organ_layer_value">
            <span
              v-for="(item,index) in organLayer"
              :key="index"
            >{{ item.itemvalue1==row.organLayerValue?item.name:"" }}</span>
          </template>

          <template slot-scope="{ row }" slot="name">
            <span v-if="row.name">
              <div class="action-btn">
                <a @click="Details(row)">
                  <span style="color:black;text-decoration: underline;">{{row.name}}</span>
                </a>
              </div>
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
    <Modal
      v-model="ModalShow"
      :mask-closable="false"
      class-name="vertical-center-modal"
      footer-hide
    >
      <p slot="header" style="color:#333333;font-size:16px">
        <span>机构信息</span>
      </p>
      <xzdtls :obj="insInfo"></xzdtls>
    </Modal>
  </div>
</template>
<style lang="less" scoped>
  .form_lists{
    height:calc(100% - 60px);
    width:calc(100%);
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
  dataItemHandle
} from "@/libs/util";
import { Modal, Message } from "iview";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import xzdtls from "./xzdtls.vue";
import {insOptionList} from "@/service/adminSearch";
import {wsUnitSearch} from "@/service/unitSsSearch";
import {administrationMessage} from "@/service/xzjgAdmin"
export default {
  components: {
    Treeselect,
    xzdtls
  },
  watch: {
  currTreeVal(val, oldVal) {
    if(val == undefined){
      this.reload(true);
    }
  }
  },
  data() {
    return {
      insInfo: {},
      ModalShow: false,
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
          width: 280,
          slot: "name",
          align: "center"
        },
        {
          title: "主管单位",
          key: "pname",
          width: 240,
          align: "center"
        },
        {
          title: "机构类别",
          key: "categoryValue",
          align: "center",
          width: 180
        },
        {
          title: "行政隶属",
          // slot: "organ_layer_value",
          key:'organLayerValue',
          align: "center",
          width: 150
        },
        {
          title: "邮编",
          key: "zipCode",
          align: "center",
          width: 100
        },
        {
          title: "地址",
          key: "address"
        }
      ],
      insCategory: [],
      currTreeVal: null,
      organLayer: [],
      data: [],
      total: 0,
      pageIndex: 1,
      pageSize: 15,
      //查询参数定义
      queryPar: {
        data_layer:'1',
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
      this.queryPar.ins_id = this.objs.insId
      this.reload()
    }
  },
  //初始化
  created() {
    // let curUserInfo = getUserInfo();
    this.userInfo = this.objs;
    this.pageSizeOps = [15, 30, 50, 100];
    this.queryPar.ins_id = this.objs.insId;
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
    });
    // this.getDictionaries("InstitutionOrganLayer").then(res => {
    //   this.organLayer = dataItemHandle(res);
    // });
    this.reload();
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
        this.currTreeVal = this.userInfo.insId;
      }
      //搜索时从第1页开始搜索
      if (flag) {
        this.pageIndex = 1;
      }
      this.loading = true;
      //查询相关参数
      // var where = {
      //   ins_id: this.queryPar.ins_id,
      //   data_layer: this.queryPar.data_layer,
      //   ins_name: this.queryPar.ins_name
      // };

      // let params = {
      //   is_xz: true,
      //   pid: this.userInfo.ins_id,
      //   page_index: this.pageIndex,
      //   page_size: this.pageSize,
      //   sql_where: JSON.stringify(where)
      // };
      let params = {
        page:{
          pageNum:this.pageIndex,
          pageSize:this.pageSize,
          orderBy:''
        },
        insId:this.currTreeVal,
        dataLayer:this.queryPar.data_layer,
        insName:this.queryPar.ins_name
      };
      wsUnitSearch(params).then(res=>{
        this.loading = false;
        this.total = res.total;
        if(res.datas){
          this.data = res.datas;
        }
      })
      // this.getRequest("data_query/ins_list", urlPath(params)).then(res => {
      //   this.total = res.data.data.total_count;
      //   var resData = res.data.data.items;
      //   if (resData) {
      //     this.data = resData;
      //   }
      //   this.loading = false;
      // });
    },
    Details(row) {
      let tempInfo = {};
      let params = {
          insMainId:row.id
      };
      administrationMessage(params).then(res=>{
          if(res.code == 10000){
              tempInfo.ins_name=res.datas.admDepartmentRespDto.departmentName;
              tempInfo.ins_prant_value=res.datas.admDepartmentRespDto.leader;
              tempInfo.ins_category_value=res.datas.admDepartmentRespDto.organType;
              tempInfo.ins_organ_lvevl_value=res.datas.admDepartmentRespDto.admType;
              tempInfo.fileid1 = res.datas.admBasicRespDto.areaCode;
              tempInfo.fileid2 = res.datas.admBasicRespDto.officePhone;
              tempInfo.fileid3 = res.datas.admBasicRespDto.officeFax;
              tempInfo.fileid4 = res.datas.admBasicRespDto.area;
              tempInfo.fileid5 = res.datas.admBasicRespDto.population;
              this.ModalShow = true;
              this.insInfo = tempInfo;
          } else {
              Message.error(res.msg);
          }
      })
      // this.getRequest("ins_main", urlPath({ id: row.id })).then(data => {
      //   if (data.data.code == 40000) {
      //     tempInfo.ins_name = data.data.data.name;
      //     tempInfo.ins_prant_value = data.data.data.pname;
      //     tempInfo.ins_category_value = data.data.data.category_value;
      //     tempInfo.ins_organ_lvevl_value = data.data.data.organ_layer_value;
      //     this.getRequest("ins_basic", urlPath({ ins_id: row.id })).then(
      //       res => {
      //         if (res.data.code == 40000) {
      //           tempInfo.fileid1 = res.data.data.fileid1;
      //           tempInfo.fileid2 = res.data.data.fileid2;
      //           tempInfo.fileid3 = res.data.data.fileid3;
      //           tempInfo.fileid4 = res.data.data.fileid4;
      //           tempInfo.fileid5 = res.data.data.fileid5;
      //           this.insInfo = tempInfo;
      //           this.ModalShow = true;
      //         }
      //       }
      //     );
      //   }
      // });
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
      this.currTreeVal = node.id;
      this.reload(true);
    }
  }
};
</script>

