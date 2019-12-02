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
        label="统计项目"
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
        <vxe-table-column
          prop="bianzhi"
          label="编制内人数"
          header-align="center"
          width="70px"
          show-overflow
        ></vxe-table-column>
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
      <vxe-table-column label="职称（聘/评）" header-align="center">
        <vxe-table-column
          prop="zhenggao"
          label="正高级"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column prop="fugao" label="副高级" header-align="center" width="60px" show-overflow></vxe-table-column>
        <vxe-table-column
          prop="jiweigao"
          label="其中基卫高"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column
          prop="zhongji"
          label="中级"
          header-align="center"
          width="60px"
          show-overflow
        ></vxe-table-column>
        <vxe-table-column prop="chuji" label="初级" header-align="center" width="60px" show-overflow></vxe-table-column>
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
    </vxe-table>
  </div>
</template>
<script>
import store from "@/store/index";
import { urlPath, getUserInfo, treeTbDataItembyPid } from "@/libs/util";
import { wsOnCount } from "@/service/stat";
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
      wsOnCount().then(res => {
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
