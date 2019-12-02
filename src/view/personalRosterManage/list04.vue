<template>
  <div style="height:100%;position:relative;">
    <div>
      <Form inline :model="queryPar">
        <Row>
          <FormItem>
            <Input v-model="queryPar.name" placeholder="姓名" @on-enter="reload(1)"/>
          </FormItem>
          <FormItem style="width:180px">
            <Input v-model="queryPar.idcardNo" placeholder="证件号" @on-enter="reload(1)"/>
          </FormItem>
          <FormItem label="对比结果" :label-width="65" style="width:180px">
            <Select v-model="queryPar.type" @on-change="reload(1)">
              <Option value="-999">所有</Option>
              <Option value="2">未对比</Option>
              <Option value="3">对比成功</Option>
              <Option value="1">对比失败</Option>
            </Select>
          </FormItem>
          <FormItem label="详细说明" :label-width="65" style="width:240px">
            <Input v-model="queryPar.reasons" placeholder="详细说明" @on-enter="reload(1)"/>
          </FormItem>
          <FormItem>
            <Button type="primary" @click="reload(1)">搜索</Button>
            <Button type="primary" @click="onAdd">单个新增名单</Button>
            <Button type="primary" @click="onExportExcel()">预传名单导出</Button>
          </FormItem>
        </Row>
        <Row>
          <FormItem>
            <Button type="primary" @click="download()">预传文件模版下载</Button>
            <Button type="primary" @click="onEmpty()">清空所有预传退休名单</Button>
          </FormItem>
          <FormItem>
            <Upload
              ref="upload"
              v-if="uploadUrl"
              :headers="AccessToken"
              :action="uploadUrl"
              :data="uploadDataPar"
              name="files"
              :on-format-error="handleFormatError"
              :on-success="handleSuccess"
              :on-error="handleError"
              :format="['xlsx','xls']"
            >
              <Button type="primary" icon="ios-cloud-upload-outline">预传退休名单导入</Button>
            </Upload>
          </FormItem>
          <FormItem>
            <span>
              <b>未对比数：{{count1}}人</b>
            </span>&nbsp;&nbsp;&nbsp;&nbsp;
            <span>
              <b>对比成功数：{{count2}}人</b>
            </span>&nbsp;&nbsp;&nbsp;&nbsp;
            <span>
              <b>对比失败数：{{count3}}人</b>
            </span>&nbsp;&nbsp;&nbsp;&nbsp;
          </FormItem>
        </Row>
      </Form>
    </div>
    <div class="form_lists">
      <div style="height:100%;overflow: hidden;" ref="TableHeight">
        <Table border :columns="columns" :data="data" :loading="loading" :height="tableHeight">
          <template slot-scope="{row}" slot="action">
            <div class="action-btn">
              <a v-if="row.type!=100 && row.type != 110" @click="onDtls(row)">编辑</a>
              <a @click="onDel(row.id)">删除</a>
            </div>
          </template>
          <template slot-scope="{row}" slot="type">
            <span v-if="row.chkStatus < 0" style="color:red">对比失败</span>
            <span
              v-if="row.chkStatus >99"
              style="color:green"
            >对比成功</span>
            <span v-else-if="row.chkStatus == 10" style="color:green">对比成功（待确认）</span>
            <span v-if="row.chkStatus=='0'" style="color:gray;">未对比</span>
          </template>
            <template slot-scope="{row}" slot="identityType">
                 <span
              v-for="(item,index) in identityTypes"
              :key="index"
              v-if="item.itemvalue1==row.identityType"
            >{{ item.name }}</span>
          </template>
          <template slot-scope="{row}" slot="idcardType">
          <span
              v-for="(item,index) in idcardTypes"
              :key="index"
              v-if="item.itemvalue1==row.idcardType"
            >{{ item.name }}</span>
          </template>
          <template slot-scope="{row}" slot="gender">
            <span v-if="row.gender == 1">男</span>
            <span v-else-if="row.gender == 2">女</span>
          </template>
          <template slot-scope="{row}" slot="birth">{{row.birth | dateFmt("yyyy-MM-dd")}}</template>
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
    <Modal
      v-model="showDtlsModal"
      :mask-closable="false"
      class-name="vertical-center-modal"
      footer-hide
      loading
    >
      <p slot="header" style="color:#333333;font-size:16px">
        <span>{{ModalTitle}}</span>
      </p>
      <Form
        :model="dtlsObj"
        v-if="dtlsObj"
        ref="formDtlsValidate"
        :rules="ruleDtlsValidate"
        :label-width="80"
      >
        <FormItem label="姓名" prop="name">
          <Input v-model="dtlsObj.name" placeholder="姓名"  :maxlength='200'/>
        </FormItem>
        <FormItem label="证件号码" prop="name">
          <Input v-model="dtlsObj.idcardNo" placeholder="证件号码" :maxlength='18'/>
         </FormItem>
         <FormItem label="退休类型" prop='identityType'  >
            <Select v-model="dtlsObj.identityType"  
            label-in-value
             @on-change="selectChange"
             >
              <Option
              v-for="(item,index) in identityTypes"
              :value="item.name"
              :key="index+'0'"
            >{{item.name}}</Option>
            </Select>
          </FormItem>

          <Button size="large" @click="showDtlsModal=false">取消</Button>
          <Button type="primary" size="large" @click="onDtlsSave()">确定</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<style lang="less" scoped>
.form_lists {
  height: calc(100% - 125px);
  padding-bottom: 35px;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
<script>
import {retirePageMessage,retireEdit,retireImportAll,retireImportOne,retireExport,retireDeleteAll,retireRosterStatistics,retireDelete,dtls} from '@/service/retireRoster'
import { getAccessToken, urlPath, getUserInfo, dateFormat } from "@/libs/util";
import { Modal, Message } from "iview";
import axios from "axios";

export default {
  data() {
    return {
      AccessToken: {"Authorization": ''},
      loading: false,
      tableHeight: 520,
      organLayer:[
             {
                value: '退休',
                label: '0401'
            },
            {
                value: '病退',
                label: '0402'
            },
            {
                value: '退职',
                label: '0403'
            },
            {
                value: '离休',
                label: '0404'
            },
      ],
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
          title: "对比结果",
          width: 100,
          slot: "type"
        },
        {
          title: "详细说明",
          key: "reasons"
        },
        {
          title: "退休类型",
          slot: "identityType",
          width: 160
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
          slot: "birth"
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
      identityType:'',
      pageIndex: 0,
      pageSize: 15,
      showDtlsModal: false,
      ModalTitle: "",
      idcardTypes:[],
      identityTypes:[],
      dtlsObj: {
        name:'',
        identityType:'',
      },
      count1: 0,
      count2: 0,
      count3: 0,
      ruleDtlsValidate: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
        name: [{ required: true, message: "请输入证件号码", trigger: "blur" }],
        identityType: [{ required: true, message: "请选择退休类型", trigger: "blur" }],
      },
      uploadUrl: "",
      uploadDataPar: {
        ins_id: "",
        ins_name: "",
        ins_category_key: "",
        ins_category_value: "",
        ins_node_value: "",
        ins_node_path: "",
        identityType: this.identityType
      },
      //查询参数定义
      queryPar: {
        name: null,
        idcardNo: null,
        type: null,
        reasons: null,
        organLayerKey:null,
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
      this.uploadDataPar = {
        ins_id: this.userInfo.ins_id,
        ins_name: this.userInfo.ins_name,
        ins_category_key: this.userInfo.ins_category_key,
        ins_category_value: this.userInfo.ins_category_value,
        ins_node_value: this.userInfo.ins_node_value,
        ins_node_path: this.userInfo.ins_node_path,
        identityType: this.identityType
      };
      this.reload();
    }
  },
  //初始化
  created() {
    // let curUserInfo = getUserInfo();
    this.userInfo = this.objs;
    this.uploadDataPar = {
      ins_id: this.userInfo.ins_id,
      ins_name: this.userInfo.ins_name,
      ins_category_key: this.userInfo.ins_category_key,
      ins_category_value: this.userInfo.ins_category_value,
      ins_node_value: this.userInfo.ins_node_value,
      ins_node_path: this.userInfo.ins_node_path,
      identityType: this.identityType
    };
    this.pageSizeOps = [15, 30, 50, 100];
    dtls('IdentityType').then(res=>{
      let code='04'
      for(var i=0;i<res.datas.length;i++){
        let type=res.datas[i]
        if(type.itemvalue1 ==code){
          this.identityTypes = type.children
        }
      }
    })

       dtls('IdcardType').then(res=>{
         this.idcardTypes =res.datas
  })
    this.reload();
      this.AccessToken = {
      'Authorization': getAccessToken()
    }
    this.uploadUrl =
     process.env.baseUrl + "/hbwsrc-infoplatform/" +
      "retireRoster/retireImportAll";


    
  
  },
  mounted() {
    //计算table的高度
    this.$nextTick(() => {
      let tableHeight = this.$refs.TableHeight.offsetHeight;
      this.tableHeight = tableHeight;
    });
  },
  // components: {
  //   Upload
  // },
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
      let params = {
              page: {
          pageNum: this.pageIndex,
          pageSize: this.pageSize,
          orderBy: "c.chk_time desc"
        },
        name: this.queryPar.name,
        idcardNo: this.queryPar.idcardNo,
        type: this.queryPar.type,
        reasons: this.queryPar.reasons
      };
      //初次渲染数据
      retirePageMessage(params).then(res=>{
        if(res.code==10000){
          this.total =res.total;
          let arr =res.datas
           this.data =arr            
        }else{
          Message.error(data.msg);
        }
        this.loading = false;

      })
      retireRosterStatistics().then(res=>{
        if(res.code =10000){
          let d =res.datas
          this.count1 = d.noContrastCount;
          this.count2 = d.successCount;
          this.count3 = d.failContrastCount;
        }
      })
    },
    selectChange(data){
     this.identityType = data.value
    },
    onPageChange(num) {
      this.pageIndex = num;
      this.reload();
    },
    onPageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.reload();
    },
    onAdd() {
      this.dtlsObj = {
        id: null,
        name: null,
        idcardNo: null,
        identityType: this.identityType
      };
      this.ModalTitle = "单个新增退休人员信息";
      this.showDtlsModal = true;
      if (this.$refs["formDtlsValidate"] != undefined) {
        this.$refs["formDtlsValidate"].resetFields();
      }
    },
    onDtls(row) {
      this.dtlsObj.id = row.id
      this.dtlsObj.name = row.name
      this.dtlsObj.idcardNo = row.idcardNo
      // this.dtlsObj.identityType = row.identityType
      for(var i=0;i<this.organLayer.length;i++){
        if(this.organLayer[i].label ==row.identityType ){
           this.dtlsObj.identityType  = this.organLayer[i].value
        }
      }
      this.ModalTitle = "编辑退休人员信息";
      this.showDtlsModal = true;
      // if (this.$refs["formDtlsValidate"] != undefined) {
      //   this.$refs["formDtlsValidate"].resetFields();
      // }
    },
    onDtlsSave() {
      this.$refs["formDtlsValidate"].validate(valid => {
        if (valid) {
          //判断身份证号码长度
          if(this.dtlsObj.idcardNo.length>20){
           this.dtlsObj.idcardNo=''
            alert('身份证号必须小于20位')
          }
          let par = {
            id: this.dtlsObj.id,
            name: this.dtlsObj.name,
            identityType: this.dtlsObj.identityType,
            idcardNo: this.dtlsObj.idcardNo
          };

          if (!par.id) {
            //新增
           retireImportOne(par).then(res => {
              var data = res.data;
              if (res.code == 10000) {
                Message.success("操作成功！");
                this.showDtlsModal = false;
                this.reload();
              } else {
                Message.error(data.msg);
              }
            });
          } else {
            //修改
            retireEdit(par).then(res=>{
                if (res.code == 10000) {
                  Message.success("操作成功！");
                  this.showDtlsModal = false;
                  this.reload();
                } else {
                  Message.error(data.msg);
                }
            })
          }
        }
      });
    },
    download() {
      Modal.confirm({
        title: "提示信息",
        content: "确认下载【预传退休人员名单模板】？",
        onOk: () => {
          let fileUrl = "../../../static/files/预传退休人员名单模板.xls"; // 文件地址
          let downName = "预传退休人员名单模板.xls"; // 文件下载名称
          let aTag = document.createElement("a");
          aTag.download = downName;
          aTag.href = fileUrl;
          aTag.click();
          URL.revokeObjectURL(aTag.href);
        }
      });
    },
    //删除按钮
    onDel(id) {
      Modal.confirm({
        title: "提示信息",
        content: "删除后不影响退休人员名册结果，确认删除？",
        onOk: () => {
          let par = {
            id: id
          };
          //删除
          retireDelete(par).then(res=>{
            if(res.code==10000){
                Message.success("操作成功！");
                this.showDtlsModal = false;
                this.reload();
            }else{
        Message.error(data.msg);

            }
          })
        }
      });
    },
    onEmpty() {
      Modal.confirm({
        title: "提示信息",
        content: "清空所有预传退休名单不影响退休人员名册结果，确认清空？",
        onOk: () => {
           retireDeleteAll().then(res=>{
                  if(res.code==10000){
              Message.success('操作成功')
              this.showDtlsModal = false;
              this.reload()
            }else{
              Message.error(data.msg)
            }
          })
        }
      });
    },
    onExportExcel() {
      Modal.confirm({
        title: "提示信息",
        content: "确认导出预传退休名单？",
        onOk: () => {
          if (this.queryPar.type == null) {
            this.queryPar.type = 0;
          }
        let params={
          name:this.queryPar.name,
          idcardNo:this.queryPar.idcardNo,
          reasons:this.queryPar.reasons,
          type:this.queryPar.type
        };
          retireExport(params).then(res=>{
            let blob = new Blob([res], {
                type: "application/vnd.ms-excel;charset=UTF-8"
              });
              let aTag = document.createElement("a"); //加入a标签
              aTag.download = "预传在职名单";
              aTag.href = URL.createObjectURL(blob);
              aTag.click();
              URL.revokeObjectURL(aTag.href);
            })
            .catch(
              function(error){
                  Message.error("网络请求出错！");
              }.bind(this)
            )
          }
      });
    },
    handleFormatError(file) {
      this.$refs.upload.clearFiles();
      this.$Modal.error({
        title: "提示信息",
        content: "无效的文件类型！"
      });
    },
    handleSuccess(data, file) {
      this.$refs.upload.clearFiles();
      if (data.code == 10000) {
        //共上传10条数据，可导入9条，<br/>成功导入4条，其中身份证错误3条，个人未注册1条
        let d = data.datas;
        let msg =
          "成功导入" +
          d.successCount +
          "条，其中身份证错误" +
          d.idCardNoMissCount +
          "条，个人未注册" +
          d.notRegisterCount +
          "条";
        this.$Modal.success({
          title: "提示信息",
          content: msg,
          onOk: () => {
            this.reload();
          }
        });
      } else {
        this.$Modal.error({
          title: "提示信息",
          content: data.msg
        });
      }
    },
    handleError(error, file) {
      this.$Modal.error({
        title: "提示信息",
        content: "数据导入失败！"
      });
    }
  }
};
</script>

