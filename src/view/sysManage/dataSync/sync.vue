<style lang="less" scoped>
.form_lists {
  height: calc(100% - 60px);
  overflow: hidden;
  padding-bottom: 38px;
  box-sizing: border-box;
}
img{
  width: 100%;
  height: 100%;
}
.uploadModal{
  height: 300px;
  display:flex;
  justify-content: center;
}

</style>
<template>
  <div style="height:100%;position:relative;">
    <!-- 条件搜索 -->
    <div>
      <Form inline  label-position="left" :label-width="55" >
        <FormItem label="对比"  style="width:300px">
          <Select v-model="queryAction"  clearable @on-change="actionChange" >
            <Option  value="1">相同</Option>
            <Option  value="2">不相同</Option>
          </Select>
        </FormItem>
        <FormItem>
          <!-- <Button type="primary" @click="reload(1)">搜索</Button> -->
        </FormItem>
        <span style="position:absolute;top:40px;right:10px;">表名:{{typeText}}&nbsp;&nbsp;版本:{{detailObj.version}}</span>
      </Form>
     
    </div>
    
    <div class="form_lists">
      <div style="height:100%;overflow: hidden;" ref="TableHeight">
        <Table border :columns="columns2" :data="data" :loading="loading" :height="tableHeight">
          <!-- <template slot-scope="{ row }" slot="newData"> 
            <div>{{ getJsonView(row.newData) }}</div>
          </template>
          <template slot-scope="{ row }" slot="rawData"> 
            <div>{{ getJsonView(row.rawData) }}</div>
          </template>
          <template slot-scope="{ row }" slot="actionData"> 
            <div>{{ getJsonView(row.actionData) }}</div>
          </template> -->
          <template slot-scope="{row}" slot="action" >
            <div class="action-btn" v-if="detailObj.status=='1'">
              <a v-if="row.status=='1'"  @click="recover(row.id)">回退</a>
              <a v-if="row.status=='0'&&row.flag==2" @click="sync(row.id)">同步</a>
            </div>
            <div v-else>-</div>
          </template>
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

<script>
import { recover,show,sync} from "@/service/dataSync";
import {
  getAccessToken,
  urlPath,
  validateSequence,
  getUserInfo
} from "@/libs/util";
import { Modal, Message } from "iview";

export default {
  data() {
    return {
      loading: false,
      tableHeight: 520,
      images:'',
      columns2:[
        {
          title: "操作",
          slot: "action",
          width: 130,
          align: "center"
        },
        {
          title: "状态",
          key: "statusText"
        },
        {
          title: "对比",
          key: "flagText"
        },
        // {
        //   title: "系统原始数据",
        //   key: "rawData",
        //   render: (h, p) =>{
        //     var html = "";
        //     if(p.row.rawData){
        //       var datas = JSON.parse(p.row.rawData);
        //       for (var index  in datas) {
        //         html += "<lable>" + index+':'+datas[index] + "</lable>";
        //         html += "<br></br>";
        //       }
        //     }
        //     return h("div", {
        //       domProps: {
        //         innerHTML: html
        //       }
        //     });
        //   }
        // },
         {
          title: "系统数据",
          key: "systemData",
          render: (h, p) =>{
            var html = "";
            if(p.row.systemData){
              var datas = JSON.parse(p.row.systemData);
              for (var index  in datas) {
                html += "<lable>" + index+':'+datas[index] + "</lable>";
                html += "<br></br>";
              }
            }
            return h("div", {
              domProps: {
                innerHTML: html
              }
            });
          }
        },
        {
          title: "版本数据",
          key: "newData",
          render: (h, p) =>{
            var html = "";
            if(p.row.newData){
              var datas = JSON.parse(p.row.newData);
              for (var index  in datas) {
                html += "<lable>" + index+':'+datas[index] + "</lable>";
                html += "<br></br>";
              }
            }
            return h("div", {
              domProps: {
                innerHTML: html
              }
            });
          }
        },
      ],
   
      data:[{num:1},{num:2}],//同步详情
      total: 0,
      pageIndex: 0,
      pageSize: 15,
      //主体编辑
      ModalShow: false,
      mainInfo: {},
      //查询参数定义
      queryAction: '',

      host:process.env.baseUrl,
      typeList:[],
      statusList:[{code:1,name:'有效'},{code:0,name:'无效'}],
      AccessToken: { Authorization: "" },
      
      showUpload:false,
      uploadType:'',
      uploadProps:[],

      typeText:this.$route.params.typeText,
      detailObj:{
        status:this.$route.params.status,
        type:this.$route.params.type,
        version:this.$route.params.version
      }
    };
  },
  computed:{
 
  },
  created() {
    this.pageSizeOps = [15, 30, 50, 100];
  
  },
  mounted() {
    //计算table的高度
    this.$nextTick(() => {
      let tableHeight = this.$refs.TableHeight.offsetHeight;
      this.tableHeight = tableHeight;
    });
    this.reload();
  },
  methods: {
    // getJsonView(jsonStr){//{"name": "华中科技大学"}-->name: 华中科技大学
    //   let str=''; 
    //   let json=JSON.parse(jsonStr);
    //   for(let i in json){
    //     str+=i+':'+json[i]+'<br>'
    //   }
    //   return str
    // },
    actionChange(data){
      this.reload();
    },
    reload(page) {
      if (page != undefined) {
        this.pageIndex = page;
      }
      let params = {
        page: {
          pageNum: this.pageIndex,
          pageSize: this.pageSize
        },
        status:this.detailObj.status,
        type:this.detailObj.type,
        version:this.detailObj.version,
        isEqual:this.queryAction===''?null:parseInt(this.queryAction),
      };
      //页面初次table页渲染
      show(params).then(res => {
        if (res.code == 10000) {
          this.data = res.datas.filter((f)=>{
            f.statusText=f.status==1?'已同步':'未同步'
            f.flagText=f.flag==1?'相同':'不相同'
            //f.actionData=f.status=='0'?f.rawData:f.newData
            return f
          });
          this.total = res.total;
        } else {
          Message.error(data.msg);
        }
        // this.loading = false;
      });
    },
    sync(id){
      sync({id:id}).then(res => {
        if (res.code == 10000) {
           Message.success('同步成功');
           this.reload()
        } else {
          Message.error(data.msg);
        }
      });
    },
    recover(id){
      recover({id:id}).then(res => {
        if (res.code == 10000) {
           Message.success('回退成功');
           this.reload()
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
    
    
    cancleSubmit() {
      this.$refs["editValidate"].resetFields();
      this.ModalShow = false;
    },
    //文件超出指定大小限制时的钩子，返回字段为 file, fileList
    handleMaxSize1(file) {
      Message.error("File  " + file.name + " is too large, no more than 2M.");
    },
    handleFormatError(file) {
      this.$refs.upload.clearFiles();
      this.$Modal.error({
        title: "提示信息",
        content: "无效的文件类型！"
      });
    },
  }
};
</script>