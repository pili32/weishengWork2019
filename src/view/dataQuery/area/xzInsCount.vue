<template>
  <div style="height:100%" ref="TableHeight" class="wsInsTable">
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
          noChildrenText='当前机构无下属机构'
        />
      </FormItem>
      <FormItem label="数据层级" :label-width="75" style="width:180px">
        <Select v-model="queryPar.data_layer" @on-change="reload(true)">
          <Option value="0" selected>直属下级</Option>
          <Option value="1">所有下级</Option>
        </Select>
      </FormItem>
      <!-- <FormItem label="机构名称" :label-width="75" style="width:300px">
        <Input v-model="queryPar.ins_name" placeholder="请输入机构名称" @on-enter="reload(true)"/>
      </FormItem> -->
      <FormItem>
        <Button type="primary" @click="reload(true)">搜索</Button>
      </FormItem>
    </Form>
    <vxe-table
      v-if="tableHeight"
      border
      :height="tableHeight"
      auto-resize
      :loading="tableLoad"
      :tree-config="{key: 'id', children: 'children',trigger:'cell'}"
      :data.sync="tableData"
    >
      <vxe-table-column
        prop="key"
        label="项目"
        header-align="center"
        tree-node
        width="250px"
        show-overflow
      >
        <template v-slot="{row}">
          <span class="Table_tree_node">{{ row.name}}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column prop="total" label="合计" header-align="center" width="100px" show-overflow></vxe-table-column>
      <vxe-table-column label="行政层级" header-align="center">
        <vxe-table-column
          prop="subordinateNum"
          label="国家部委"
          header-align="center"        
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="provincialNum"
          label="省(区市)"
          header-align="center"        
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="cityNum"
          label="地级市州"
          header-align="center"       
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="countyLevelCityNum"
          label="县级市区属"
          header-align="center"         
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="cityDirectNum"
          label="省直管市林区"
          header-align="center"        
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="countyNum"
          label="县"
          header-align="center"        
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="townshipNum"
          label="乡镇"
          header-align="center"
          show-overflow
        ></vxe-table-column>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>
<script>
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import store from "@/store/index";
import {xzCount} from '@/service/count';
import {insOptionList} from "@/service/adminSearch"
import {
  urlPath,
  getUserInfo,
  treeTbDataItem,
  xzdataItem,
  dataItemHandle
} from "@/libs/util";
export default {
  components: {
    Treeselect
  },
  name: "tree_table_page",
  data() {
    return {
      tableData: [],
      tableLoad: false,
      tableHeight: "",
      queryPar: {
        data_layer:'1'
      },
      insCategory: [],
      currTreeVal: null,
      organLayer: [],
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
      this.queryPar.ins_id = this.objs.insId;
      this.reload();
    }
  },
  created() {
    // let curUserInfo = getUserInfo();
    this.userInfo = this.objs;
    this.queryPar.ins_id = this.objs.insId;
    this.reload();
    // let params = {
    //   node_path: curUserInfo.ins_node_path
    // };
    // this.getRequest("data_query/xz_ins", urlPath(params)).then(res => {
    //   res.data.data[0].pid = "null"; //循环加载下拉数据时第一条数据的pid需要置为null
    //   this.insCategory = xzdataItem(res.data.data);
    // });

    // this.getDictionaries("InstitutionOrganLayer").then(res => {
    //   this.organLayer = dataItemHandle(res);
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
      this.tableHeight = tableHeight-60;
    });
  },
  methods: {
    reload() {
      // let params={
      //   type:"ws",
      //   ins_id:this.currTreeVal,
      //   data_layer:this.queryPar.data_layer
      // };
      if (!this.currTreeVal) {
        this.currTreeVal = this.userInfo.insId;
      }
      this.tableLoad = true;
      let params = {
        dataLayer:this.queryPar.data_layer,
        id:this.currTreeVal
      };
      xzCount(params).then(res=>{
        this.tableLoad = false;
        if(res.datas.length>0){
            this.tableData = res.datas;
        }
      })
        // this.getRequest("data_statistical", urlPath({ type: "ws" })).then(
        //   res => {
        //     this.tableLoad = false;
        //     if (res.data.code == 40000) {
        //       let result = res.data.data;
        //       this.tableData = treeTbDataItem(result);
        //     }
        //   }
        // );
    },
    onInsCategorySeachChange(node) {
      this.queryPar.ins_id = node.id;
      this.currTreeVal=node.id;
      this.reload(true);
    }
  }
};
</script>

<style>
</style>
