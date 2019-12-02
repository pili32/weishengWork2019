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
    <!-- 上传弹框 -->
    <Modal
      v-model="showUpload"
      :mask-closable="false"
      :footer-hide="true"
      width="600"
      class-name="uploadModal"
    >
      <p slot="header" style="color:#333333;font-size:16px">
        <span>上传</span>
      </p>
      <Form v-if="true" label-position="left" :label-width="120" style="height:180px">
        <FormItem label="表类型"  >
          <Select
            v-model="uploadType"
            @on-change="uploadTypeChange"
          >
            <Option
              v-for="(item,index) in typeList"
              :value="item.code"
              :key="index+'0'"
            >{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="对比的表格数据"  >
          <Select
            multiple 
            v-model="uploadProps"
            :max-tag-count='6'
            @on-change="uploadPropsChange"
          >
            <Option
              v-for="(item,index) in uploadPropsList"
              :value="item"
              :key="index+'0'"
            >{{item}}</Option>
          </Select>
        </FormItem>
        <div style="padding:10px 40%">
          <Upload
            :disabled="uploadModalSelected"
            ref="upload"
            accept=".xlsx,.xls"
            :format="['xlsx','xls']"
            :on-format-error="handleFormatError"
            :show-upload-list="false"
            :on-success="uploadSuccess"
            :on-error="uploadError"
            :action='getUploadurl'
            name="files"
            :headers="AccessToken">
            <!-- :before-upload="uploaded" -->
            <Button icon="ios-cloud-upload-outline" :disabled="uploadModalSelected">上传EXCEL</Button>
          </Upload>
        </div>
      </Form>
    </Modal>
    <!-- 条件搜索 -->
    <div style="display:inline-block;width:100%">
      <Form inline :model="queryPar" label-position="left" :label-width="55" v-if="queryPar" style="float:left">
        <FormItem label="类型"  style="width:200px">
          <Select v-model="queryPar.type" clearable @on-change="reload(1)">
            <Option v-for="(item,index) in typeList"
              :value="item.code"
              :key="index+'0'"
            >{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="状态" style="width:200px">
           <Select v-model="queryPar.status" clearable @on-change="reload(1)">
            <Option v-for="(item,index) in statusList"
              :value="item.code"
              :key="index+'0'"  
            >{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="reload(1)">搜索</Button>
        </FormItem>
      </Form>
      <Button type="default" style="margin-right:10px;float:right" @click="showUpload=true">上传</Button>
    </div>
    <div class="form_lists">
      <div style="height:100%;overflow: hidden;" ref="TableHeight">
        <Table border :columns="columns" :data="data" :loading="loading" :height="tableHeight">
          <template slot-scope="{ row }" slot="name"> 
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{row}" slot="action">
            <div class="action-btn">
              <a  @click="view(row.type,row.status,row.version)">详情</a>
            </div>
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
import { recover,show,sync,list,queryDataItem} from "@/service/dataSync";
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
      columns: [
        {
          title: "操作",
          slot: "action",
          width: 130,
          align: "center"
        },
        {
          title: "类型",
          key: "typeText"
        },
        {
          title: "版本号",
          key: "version"
        },
        {
          title: "状态",//1有效 0无效
          key: "statusText"
        },
        {
          title: "同步字段",
          key: "contrastField"
        },
        {
          title:"数据来源",
          key:"fileName"
        },
        {
          title: "更新时间",
          key: "uploadDate"
        }
        
      ],
     
      data: [{num:1},{num:2}],//版本列表
      data2:[{num:1},{num:2}],//同步详情
      total: 0,
      pageIndex: 0,
      pageSize: 15,
      //主体编辑
      ModalShow: false,
      mainInfo: {},
      //查询参数定义
      queryPar: {
        type: '',
        status: ''
      },

      host:process.env.baseUrl,
      typeList:[],
      statusList:[{code:1,name:'有效'},{code:0,name:'无效'}],
      AccessToken: { Authorization: "" },
      
      showUpload:false,
      uploadType:'',
      uploadProps:[],

      typeText:'',//表类型标记
      detailObj:{
        status:'',
        type:'',
        version:''
      }
    };
  },
  computed:{
    getUploadurl(){
      let props=this.uploadProps.join(',')
      return this.host.replace('http:','')+process.env.INFOPLATFORM_API_HOST+'sync/upload?type='+this.uploadType+'&contrastField='+props
    },
    uploadPropsList(){
      for(let i of this.typeList){
        if(i.code===this.uploadType){
          return i.props
        }
      }
    },
    uploadModalSelected(){
      if(this.uploadProps.length==0||this.uploadType===''){
        return true
      }else{
        return false
      }
    }
  },
  created() {
    this.pageSizeOps = [15, 30, 50, 100];

    this.AccessToken = {
      Authorization: getAccessToken()
    };
    
  },
  mounted() {
    this.getTypeProps()
    //计算table的高度
    this.$nextTick(() => {
      let tableHeight = this.$refs.TableHeight.offsetHeight;
      this.tableHeight = tableHeight;
    });
    this.reload();
  },
  methods: {
    uploaded(file){
      debugger
      // var formData = new FormData();
      // formData.append("type", "0");
      // formData.append("contrastField", '机构名称'); 
      // // HTML 文件类型input，由用户选择
      // formData.append("file", file);
      // const upload=async params => {
      //   const res = await request.iviewUpload(process.env.INFOPLATFORM_API_HOST,'sync/upload?type='+'0'+'&contrastField='+'机构名称', params);
      //   return res.data;
      // }
      // upload(formData).then(res => {
      // });
     
    },
    getTypeProps(){
      queryDataItem({}).then(res => {
        if (res.code == 10000) {
          for(let i of res.datas){
            this.typeList.push({code:i.code,name:i.name,props:i.fields})
            
          }
        }
        
      })
    },
    reload(page) {
      if (page != undefined) {
        this.pageIndex = page;
      }
      let params = {
        page: {
          pageNum: this.pageIndex,
          pageSize: this.pageSize,
          orderBy:"upload_date desc"
        },
        status:this.queryPar.status,
        type:this.queryPar.type,
      };
      //页面初次table页渲染
      list(params).then(res => {
        if (res.code == 10000) {
          // var newList=[];
          // for(let m of res.datas){
          //   if( (type==null||type==m.auditStatus) && (insName==null||m.insName.indexOf(insName)!=-1) ){
          //     newList.push( {
          //       auditStatus:m.auditStatus==0?'待审核':m.auditStatus==1?'退回':'通过',
          //       id:m.id,
          //       insName:m.insName,
          //       registeDate:m.registeDate,
          //       registedBy:m.registedBy
          //     })
          //   }
          // }
          this.data = res.datas.filter((f)=>{
            let code=f.type;
            for(let i of this.typeList){
              if(code==i.code){
                f.typeText=i.name;
                this.typeText=i.name;
                break;
              }
            }
            f.statusText=f.status==1?'有效':'无效'
            return f
          })
          this.total = res.total;
        } else {
          Message.error(data.msg);
        }
        // this.loading = false;
      });
    },
    view(type,status,version){//详情\
      this.$router.push({name:'dataSyncInfo',params:{type:type,status:status,version:version,typeText:this.typeText} })
    },
    sync(id){
      sync({id:id}).then(res => {
        if (res.code == 10000) {
           Message.success('同步成功');
        } else {
          Message.error(data.msg);
        }
      });
    },
    recover(id){
      recover({id:id}).then(res => {
        if (res.code == 10000) {
           Message.success('回退成功');
        } else {
          Message.error(data.msg);
        }
      });
    },
    uploadTypeChange(data){
      //this.uploadType=data
    },
    uploadPropsChange(data){
      //this.uploadProps=data
    },
    uploadError() {
      Message.error('文件上传失败！请重新上传');
    },
    uploadSuccess(res) {
      if (res.code == 10000) {
         Message.success('上传成功');
         this.reload();
      }else{
         Message.warning(res.msg);
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