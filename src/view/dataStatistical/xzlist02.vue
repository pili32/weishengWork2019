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
      <vxe-table-column prop="total" label="合计" header-align="center" width="60px" show-overflow></vxe-table-column>
      <vxe-table-column label="基本信息" header-align="center">
        <vxe-table-column prop="female" label="女" header-align="center" width="70px" show-overflow></vxe-table-column>
        <vxe-table-column
          prop="shaoShuMingZu"
          label="少数名族"
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
          prop="yanJiuSheng"
          label="研究生"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="daXueBenKe"
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
        <vxe-table-column
          prop="zhongZhuan"
          label="中专"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="gaoZhong"
          label="高中及以下"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column label="任职年限" header-align="center">
        <vxe-table-column
          prop="workYear2"
          label="<2"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="workYear23"
          label="2-3"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="workYear34"
          label="3-4"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="workYear45"
          label="4-5"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="workYear56"
          label="5-6"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="workYear67"
          label="6-7"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="workYear78"
          label="7-8"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="workYear812"
          label="8-12"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="workYear1215"
          label="12-15"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="workYear15"
          label=">15"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column label="年龄" header-align="center">
        <vxe-table-column prop="age29" label="<29" header-align="center" width="60px" show-overflow></vxe-table-column>
        <vxe-table-column
          prop="age3034"
          label="30-34"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="age3539"
          label="35-39"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="age4044"
          label="40-44"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="age4549"
          label="45-49"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
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
        <vxe-table-column prop="age65" label=">65" header-align="center" width="60px" show-overflow></vxe-table-column>
      </vxe-table-column>
      <vxe-table-column label="行政层级" header-align="center">
        <vxe-table-column
          prop="xzcj01"
          label="国家部委"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="xzcj02"
          label="省(区市)"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="xzcj03"
          label="地（市州）"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="xzcj04"
          label="县（市区）"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column prop="xzcj05" label="乡镇" header-align="center" width="60px" show-overflow></vxe-table-column>
      </vxe-table-column>
    </vxe-table>
  </div>
</template>
<script>
import store from "@/store/index";
import { urlPath, getUserInfo, treeTbDataItembyPid } from "@/libs/util";
import { xzOnCount } from "@/service/stat";
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
      xzOnCount().then(res => {
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