<template>
  <div style="height:100%;position:relative;">
    <div>
      <Form inline :model="queryPar">
        <FormItem label="身份类型" :label-width="75" style="width:300px">
          <!-- <Select v-model="queryPar.identity_type" @on-change="reload(true)">
            <Option value="">所有</Option>
            <Option value="02">在职</Option>
            <Option value="04">离退休</Option>
            <Option value="0401">退休</Option>
            <Option value="0402">病退</Option>
            <Option value="0403">退职</Option>
            <Option value="0404">离休</Option>
          </Select> -->
           <Cascader style="width:250px" placeholder="请选择身份类型" :data="this.data2" v-model="identity_type" @on-change='getValue'></Cascader>
        </FormItem>
        <FormItem label="姓名" :label-width="75" style="width:300px">
          <Input v-model="queryPar.name" placeholder="请输入姓名" @on-enter="reload(true)"/>
        </FormItem>
        <FormItem label="身份证" :label-width="75" style="width:300px">
          <Input v-model="queryPar.idcard_no" placeholder="请输入身份证" @on-enter="reload(true)"/>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="reload(true)">搜索</Button>
        </FormItem>
      </Form>
    </div>
    <div class="form_lists">
      <div style="height:100%;overflow: hidden;" ref="TableHeight">
        <Table border :columns="columns" :data="data" :loading="loading" :height="tableHeight">
             <template slot-scope="{row}" slot="birthDate">
                <span>{{ row.birthDate | dateFmt("yyyy-MM") }}</span>
            </template>
            <template slot-scope="{row}" slot="identity_type">
            <span>{{getName(row.identityType)}}</span>
            </template>
             <template slot-scope="{row}" slot="gender">
                <span>{{ row.gender=="1"?"男":"女" }}</span>
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
  .form_lists{
    height:calc(100% - 60px);
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
  getUserInfo,
  dateFormat,
  convertTree,
  changeTree,
  transform
} from "@/libs/util";
import { Modal, Message } from "iview";
import { unitPersonSearch , dic} from "@/service/unitPersonStatistics";
export default {
  watch: {
      identity_type(val, oldVal) {
        if(val == ''){
          this.outType = '';
          this.reload(true);
        }
      }
  },
  data() {
    return {
      loading: false,
      tableHeight: 520,
      identity_type:[],
      columns: [
        {
          title: "序号",
          width: 70,
          type: "index",
          align: "center"
        },
        {
          title: "姓名",
          width: 200,
          key: "name"
        },
        {
          title: "性别",
          slot: "gender",
          width: 100,
          align: "center"
        },
        {
          title: "身份证号",
          key: "idcardNo",
          align: "center"
        },
        {
          title: "出生年月",
          slot: "birthDate",
          align: "center"
        },
        {
          title: "身份类型",
          slot: "identity_type"
          // key:'identityType'
        }
      ],
      data: [],
      total: 0,
      pageIndex: 1,
      pageSize: 15,
      //查询参数定义
      queryPar: {
        name: null,
        idcard_no: null,
        identity_type: []
      },
      datas:[],
      data2:[],
      outType:''
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
      console.log('watch')
      this.getDic()
      this.reload()
    },
    // '$router'(to,from) {
    //   this.$router.go(0)
    // }
  },
  //初始化
  created() {
    // let curUserInfo = getUserInfo();
    console.log('created')
    this.getDic()
    this.userInfo = this.objs;
    this.pageSizeOps = [15, 30, 50, 100];
    this.reload()
    // this.getDD()
    // console.log(this.data)
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
  filters: {
    dateFmt(d, fmt) {
      if (d && fmt) {
        return dateFormat(fmt, new Date(d));
      }
      return "";
    }
  },
  beforeDestroy(){
    window.onresize = null;
  },
  //方法
  methods: {
    // getDD(){
    //   this.getDic().then(val => {
    //     console.log(2)
    //     console.log(this.data2)
    //       this.reload();
    //   });
    // },
    getDic(){
      let code = 'IdentityType';
      dic(code).then(res=>{
        if(res.code == 10000){
          let map = {
            value: 'itemvalue1',
            label: 'name',
            children: 'children'
          }
          this.datas = convertTree(res.datas,map);
          this.data2 = changeTree(this.datas);
        }
      })
      // return Promise.resolve(this.data2)
    },
    reload(flag) {
      if (flag) {
        this.pageIndex = 1;
      }
      this.loading = true;
      let params = {
        page:{
          pageNum:this.pageIndex,
          pageSize:this.pageSize
        },
        idcardNo:this.queryPar.idcard_no,
        identityType:this.outType,
        insId:this.userInfo.insId,
        name:this.queryPar.name,
      }
      unitPersonSearch(params).then(res=>{
        this.loading = false;
        if(res.datas){
          this.data = res.datas;
          // this.getDic()
          this.total = res.total;
          // let newArr = transform(this.data2,[]);
          // let arr = res.datas;
          // for(let i = 0 ; i < arr.length ; i++ ) {
          //   let type = arr[i].identityType;
          //   for(let j = 0 ; j < newArr.length ; j++ ){
          //     let value = newArr[j];
          //     if(type == value.value){
          //       // arr[i].identityType = value.name
          //       this.$set(arr[i],'identityType',value.name)
          //     }
          //   }
          // };
          // this.data = arr;
          // return Promise.resolve(this.data)
        }
      })
      // this.getPersonalApiRequest("PersonalSelect/findPersonalList", urlPath(params)).then(res => {
      //   this.total = res.data.data.total_count;
      //   var resData = res.data.data.item;
      //   if (resData) {
      //     this.data = resData;
      //   }
      //   this.loading = false;
      // });
    },
    getName(code){
      let newArr = transform(this.data2,[]);
      for(let j = 0 ; j < newArr.length ; j++ ){
        let value = newArr[j];
        if(code == value.value){
          // arr[i].identityType = value.name
          return value.name
        }
      }
    },
    onPageChange(num) {
      this.pageIndex = num;
      this.reload();
    },
    onPageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.reload();
    },
    getValue(value, selectedData){
      if(value.length > 0 ){
        this.outType = value[value.length - 1];
        this.reload(true);
      }
    }
  }
};
</script>

