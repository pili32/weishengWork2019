<template>
  <div style="height:100%;position:relative;">
    <div>
      <Form inline :model="queryPar" v-if="queryPar">
        <FormItem>
          <Input v-model="queryPar.name" placeholder="姓名" @on-enter="reload(1)" />
        </FormItem>
        <FormItem>
          <Input v-model="queryPar.idcardNo" placeholder="证件号" @on-enter="reload(1)" />
        </FormItem>
        <!-- <FormItem label="身份类型" :label-width="75" style="width:180px">
          <Select v-model="queryPar.identityType" @on-change="reload(1)">
            <Option value="-999">所有</Option>
            <Option value="02">在职人员</Option>
            <Option value="04">退休人员</Option>
          </Select>
        </FormItem> -->
          <FormItem label="审批状态" :label-width="75" style="width:180px">
          <Select v-model="queryPar.chkStatus" @on-change="reload(1)">
            <Option value="0">未审批</Option>
            <Option value="1">审批通过</Option>
            <Option value="2">审批不通过</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="reload(1)">搜索</Button>
        </FormItem>
          </FormItem>
           <FormItem>
          <Button type="primary" @click="ManyAgree">批量转出</Button>
        </FormItem>
      </Form>
    </div>
    <div class="form_lists">
      <div style="height:100%;overflow: hidden;" ref="TableHeight">
        <Table border @on-selection-change="selectList" ref="selection" :columns="columns" :data="data" :loading="loading" :height="tableHeight">
          <template slot-scope="{row}" slot="action">
            <div class="action-btn">
              <a @click="onPass(row)">查看</a>
              <a v-if="row.chkStatus == 1" @click="dete(row)">删除</a>
              <!-- <a @click="onReturn(row)">审批</a> -->
            </div>
          </template>
          <template slot-scope="{row}" slot="chkStatus">
            <span v-if="row.chkStatus ==0">未审批</span>
            <span v-if="row.chkStatus == 1">审批通过</span>
            <span v-else-if="row.chkStatus == 2">审批不通过</span>
          </template>
            <template slot-scope="{row}" slot="idcardType">
            <span
              v-for="(item,index) in identityTypes"
              :key="index"
              v-if="item.itemvalue1==row.idcardType"
            >{{ item.name }}</span>
          </template>
          <template slot-scope="{row}" slot="gender">
            <span v-if="row.gender == 1">男</span>
            <span v-else-if="row.gender == 2">女</span>
          </template>
          <template
            slot-scope="{row}"
            slot="createDate"
          >{{ row.createDate | dateFmt("yyyy-MM-dd") }}</template>
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
    <Modal v-model="ModalShow" :mask-closable="false" footer-hide loading>
      <p slot="header" style="color:#333333;font-size:16px">
        <span>{{ModalTitle}}</span>
      </p>
      <Form
        :model="dtlsObje"
        v-if="dtlsObje"
        ref="formDtlsValidate"
        :rules="ruleDtlsValidate"
        :label-width="80"
      >
        <FormItem label="姓名">{{dtlsObje.name}}</FormItem>
        <FormItem label="证件号码">{{dtlsObje.idcardNo}}</FormItem>
        <FormItem label="出生年月">{{dtlsObje.birthDate}}</FormItem>
        <FormItem label="证件类型" >{{dtlsObje.Type}}</FormItem>
        <FormItem label="证件号码">{{dtlsObje.idcardNo}}</FormItem>
        <FormItem label="联系方式">{{dtlsObje.telephone}}</FormItem>
        <FormItem label="转出原因" >
          <span>{{dtlsObje.comeOutType}}</span>
        </FormItem>
        <FormItem label="转出备注">{{dtlsObje.reasons}}</FormItem>
         <FormItem>
            <RadioGroup v-model="disabledGroup" v-if="dtlsObje.chkStatus==0" @on-change="RadioChick">
                <Radio label="同意"></Radio>
                <Radio label="不同意"></Radio>
            </RadioGroup>
        </FormItem>
        <FormItem>
          <Button size="large"  v-if="dtlsObje.chkStatus==0" @click="ModalShow = false">取消</Button>
          <Button type="primary" size="large"  v-if="dtlsObje.chkStatus==0" @click="dtlsSave(dtlsObje)">确认提交</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<style lang="less" scoped>
.form_lists {
  height: calc(100% - 60px);
  overflow: hidden;
  padding-bottom: 38px;
  box-sizing: border-box;
}
</style>
<script>
import { pass, editOn, goback,dtls } from "@/service/realNameManage";
import { ManyAgree, disagree, del, agree,list,dtlss } from "@/service/personalComeOut";

import { getAccessToken, urlPath, getUserInfo, dateFormat,comeOutTypes,convertTree,changeTree } from "@/libs/util";
import { Modal, Message } from "iview";
export default {
  data() {
    return {
      loading: false,
      tableHeight: 520,
      ComeOutMode:null,
      ComeOutModeType:'',
      disabledSingle: true,
      // disabledGroup: '同意',
      cause:'',
      checkRadio:'',
      chechId:'',
      columns: [
        {
          type: 'selection',
          width: 60,
          align: 'center'
          },
        {
          title: "序号",
          width: 70,
          type: "index",
          align: "center"
        },
        {
          title: "操作",
          slot: "action",
          width: 140,
          align: "center"
        },
        {
          title: "审批状态",
          width: 160,
          slot: "chkStatus"
        },
         {
          title: "转出类型",
          width: 160,
          // slot: "comeOutType"
          key:'comeOutType'
        },
          {
          title: "转出原因",
          width: 160,
          key: "reasons"
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
          key: "birthDate"
        },
          {
          title: "申请时间",
          key: "applyDate"
        },
        {
          title: "证件类型",
          slot: "idcardType"
        },
        {
          title: "证件号码",
          key: "idcardNo"
        },
        {
          title: "联系方式",
          key: "telephone"
        }
      ],
      data: [],
      datas:[],
      data2:[],
      total: 0,
      pageIndex: 0,
      pageSize: 15,
      //主体编辑
      ModalShow: false,
      ModalTitle: "",
      dtlsObje: null,
      identityTypes:[],
      ruleDtlsValidate: {
        name: [{ required: true, message: "请输入姓名", trigger: "blur" }]
      },
      //查询参数定义
      queryPar: {
        name: null,
        idcardNo: null,
        identityType: null
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
    }
  },
  //初始化
  created() {
    // let curUserInfo = getUserInfo();
    this.userInfo = this.objs;
    this.getDic();
    this.pageSizeOps = [15, 30, 50, 100];
      dtls('IdCardType').then(res=>{
          this.identityTypes = res.datas
        })  
  },
  mounted() {
    //计算table的高度
    this.$nextTick(() => {
      let tableHeight = this.$refs.TableHeight.offsetHeight;
      this.tableHeight = tableHeight;
    });
  },
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
    getDic(){
        dtlss('ComeOutMode').then(res=>{
          if(res.code ==10000){
            let map = {
              value:'itemvalue1',
              label:'name',
              children:'children'
            }
            this.datas = convertTree(res.datas,map)
            this.data2 = changeTree(this.datas);
            
          }
             this.reload();
        })
    },
    reload(page) {
      if (page != undefined) {
        this.pageIndex = page;
      }
      // this.loading = true;
      //查询相关参数
      let params = {
        page: {
          pageNum: this.pageIndex,
          pageSize: this.pageSize,
          orderBy:'c.create_date desc'
        },
        chkStatus: this.queryPar.chkStatus,
        idcardNo: this.queryPar.idcardNo,
        name: this.queryPar.name
        
      };
      list(params).then(res => {
        this.loading = false;
        if (res.code == 10000) {
            this.total = res.total;
            let  arr = res.datas
            this.data = arr;
          let newArr = comeOutTypes(this.data2,[])
          for(let i=0;i<arr.length;i++){
            let type =arr[i].comeOutType
            for(let j=0;j<newArr.length;j++){
              let value =newArr[j]
              if(type ==value.value){
                arr[i].comeOutType=value.name
                this.data = arr[i]
              }
            }
          }
            //  for(var i=0;i<arr.length;i++){
            //   let type=arr[i].idcardType
            //     for(var j=0;j<this.identityTypes.length;j++){
            //       let value =this.identityTypes[j]
            //     if(type== value.itemvalue1){
            //         arr[i].idcardType = value.name
            //         let idcardType = value.name
            //     }
            //   };  
            // }
          
          this.data = arr;
        } else {
          Message.error(data.msg);
        }
        this.loading = false;
      });
    },
    onPageChange(num) {
      this.pageIndex = num;
      this.reload();
    },
    //Table选择事件
    selectList(selection,row){
      let arr=[]
      for(var i=0;i<selection.length;i++ ){
        let id = selection[i].outId
        arr.push(id)
        this.chechId =arr
      }


    },
    dtlsList(row){
      this.ModalShow = true
    },
    // 同意和不同意
    RadioChick(value){
       this.checkRadio = value

    },
    onPageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.reload();
    },
    dete(row) {
      this.$Modal.confirm({
          title: '删除',
          content: '<p>是否删除该条数据？</p>',
          onOk: () => {
              let params={
                id:row.outId
              }
        
              del(params).then(res=>{
                if(res.code==10000){
                Message.success("删除成功！");
                  this.reload();
                }
              })
          },
          onCancel: () => {

          }
      });
    },
    //批量转出
    ManyAgree(){
      let title = "";
        Modal.confirm({
        title: "提示信息",
        content: '确认转出吗？',
        onOk: () => {
          console.log(this.chechId)
          if(this.chechId){
            ManyAgree(this.chechId).then (res=>{
              if(res.code==10000){
               Message.success("成功转出"+res.datas+'条');
              this.ModalShow = false;
              this.reload();
     
              }else{
                 Message.error(data.msg);
              }
            })
          }else{
             Message.success('请勾选需要转出的内容');
          }
        }
      });

    },
    dtlsSave(list) {
      let params={
        id:list.outId
      }
      let checkRadio = this.checkRadio
      if(this.checkRadio){
        if(this.checkRadio=="同意"){
          agree(params).then(res=>{
            if(res.code==10000){
                 Message.success("审批通过！");
              this.ModalShow = false;
              this.reload();
            }
          })
  
        }else if(this.checkRadio=="不同意"){
            disagree(params).then(res=>{
            if(res.code==10000){
                 Message.success("审批不通过！");
              this.ModalShow = false;
              this.reload();
            }
          })
        }

        
      }
      

    },
    onPass(row) {
      let Type= row.idcardType
      this.dtlsObje = row;

        console.log(Type)
            for(var i=0;i<this.identityTypes.length;i++){
              if(Type== this.identityTypes[i].itemvalue1){
                Type = this.identityTypes[i].name
              }
            }
      this.dtlsObje.Type =Type

      this.ModalTitle = "查看人员信息";
      this.ModalShow = true;
    },
    onReturn(row) {
      this.dtlsObje = row;
      let params = {
        hrId: this.dtlsObje.hrId
      };
      this.onAudit(params);
    },
  }
};
</script>

