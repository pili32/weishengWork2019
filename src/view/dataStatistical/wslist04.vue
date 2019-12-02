<template>
  <div style="height:100%" ref="TableHeight" class="wsInsTable">
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
        label="退休前岗位类别"
        header-align="center"
        tree-node
        width="250px"
        show-overflow
      >
        <template v-slot="{row}">
          <span class="Table_tree_node">{{ row.name}}</span>
        </template>
      </vxe-table-column>
      <vxe-table-column prop="total" label="合计" header-align="center" width="60px" show-overflow></vxe-table-column>
      <vxe-table-column label="其中" header-align="center">
        <vxe-table-column prop="lixiu" label="离休" header-align="center" width="70px" show-overflow></vxe-table-column>
        <vxe-table-column prop="female" label="女" header-align="center" width="70px" show-overflow></vxe-table-column>
        <vxe-table-column
          prop="shaoShuMingZu"
          label="少数民族"
          header-align="center"
          width="70px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="dangyuan"
          label="中共党员"
          header-align="center"
          width="70px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="waiji"
          label="港澳台及外籍"
          header-align="center"
          width="70px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column prop="boShi" label="博士" header-align="center" width="70px" show-overflow></vxe-table-column>
        <vxe-table-column
          prop="shuoShi"
          label="硕士"
          header-align="center"
          width="70px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column prop="xueShi" label="学士" header-align="center" width="70px" show-overflow></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column label="学历" header-align="center">
        <vxe-table-column
          prop="file10"
          label="研究生"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="yanJiuSheng"
          label="大学本科"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="daXueZhuanKe"
          label="大学专科"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column prop="file13" label="中专" header-align="center" width="60px" show-overflow></vxe-table-column>
        <vxe-table-column
          prop="gaoZhong"
          label="高中及以下"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column label="年龄" header-align="center">
        <vxe-table-column prop="age50" label="<50" header-align="center" width="60px" show-overflow></vxe-table-column>
        <vxe-table-column
          prop="age5054"
          label="50-54"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="age5559"
          label="55-59"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="age6064"
          label="60-64"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="age6569"
          label="65-69"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="age7074"
          label="70-74"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="age7579"
          label="75-79"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column prop="age80" label=">80" header-align="center" width="60px" show-overflow></vxe-table-column>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>
<script>
import store from "@/store/index";
import { urlPath, getUserInfo, treeTbDataItembyPid } from "@/libs/util";
import { wsReCount } from "@/service/stat";
export default {
  name: "tree_table_page",
  data() {
    return {
      tableData: [],
      tableLoad: false,
      tableHeight: ""
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
    }
  },
  created() {
    // let curUserInfo = getUserInfo();
    this.userInfo = this.objs;
    this.getTableData();
  },
  mounted() {
    //计算table的高度
    this.$nextTick(() => {
      let tableHeight = this.$refs.TableHeight.offsetHeight;
      this.tableHeight = tableHeight;
    });
  },
  methods: {
    getTableData() {
      this.tableLoad = true;
      // let par = {
      //   ins_id: this.userInfo.ins_id,
      //   tabletype: "ws04"
      // };
      // this.getPersonalApiRequest(
      //   "StatisticsUntill/gettable",
      //   urlPath(par)
      // ).then(res => {
      //   this.tableLoad = false;
      //   if (res.data.code == 40000) {
      //     let result = res.data.data;
      //     this.tableData = treeTbDataItembyPid(result, "");
      //   }
      // });
      wsReCount().then(res => {
        this.tableLoad = false;
        if (res.datas.length > 0) {
          this.tableData = treeTbDataItembyPid(res.datas, "0");
        }
      });
    }
  }
};
</script>

<style>
</style>
