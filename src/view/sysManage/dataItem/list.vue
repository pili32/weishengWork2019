<template>
  <div style="height:100%;position:relative;">
    <div class="search_table">
      <Form inline :model="queryPar" v-if="queryPar">
        <FormItem>
          <Input v-model="queryPar.name" placeholder="字典名称" @on-enter="reload(1)"/>
        </FormItem>
        <FormItem>
          <Input v-model="queryPar.code" placeholder="字典代码" @on-enter="reload(1)"/>
        </FormItem>
        <FormItem label="所属分类" :label-width="75" style="width:280px">
          <Select v-model="queryPar.dataItemCategory" :clearable="this.select" @on-change="onDataItemCategorySelectChange">
            <Option
              v-for="(item,index) in dataItemCategory"
              :value="item.itemvalue1"
              :key="index+'0'"
            >{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="reload(1)">搜索</Button>
          <Button type="primary" @click="onAdd()">新增</Button>
        </FormItem>
      </Form>
    </div>
    <div class="form_lists">
      <div style="height:100%;overflow: hidden;" ref="TableHeight">
        <Table border :columns="columns" :data="data" :loading="loading" :height="tableHeight">
          <template slot-scope="{row}" slot="action">
            <div class="action-btn">
              <a @click="onDtls(row)">编辑</a>
              <a style='color:red' @click="onDel(row.id)">删除</a>
            </div>
          </template>
          <template slot-scope="{row}" slot="is_tree">
            <span v-if="row.isTree == 1">是</span>
            <span v-if="row.isTree == 0">否</span>
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
    <!--主体编辑-->
    <Modal
      v-model="ModalShow"
      :mask-closable="false"
      footer-hide
      class-name="vertical-center-modal"
      loading
    >
      <p slot="header" style="color:#333333;font-size:16px">
        <span>{{ModalTitle}}</span>
      </p>
      <Form
        :model="dtlsObje"
        v-if="dtlsObje"
        ref="formValidate"
        :rules="ruleValidate"
        :label-width="80"
      >
        <FormItem label="所属分类" prop="category">
          <Select v-model="dtlsObje.category">
            <Option
              v-for="(item,index) in dataItemCategory"
              :value="item.itemvalue1"
              :key="index+'0'"
            >{{item.name}}</Option>
          </Select>
        </FormItem>
        <FormItem label="字典名称" prop="name">
          <Input v-model="dtlsObje.name" placeholder="字典名称"/>
        </FormItem>
        <FormItem label="字典代码" prop="code">
          <Input v-model="dtlsObje.code" placeholder="字典代码"/>
        </FormItem>
        <FormItem label="是否树形" prop="is_tree">
          <Radio-group v-model="dtlsObje.is_tree">
            <Radio :label="1" value="1">是</Radio>
            <Radio :label="0" value="0">否</Radio>
          </Radio-group>
        </FormItem>
        <FormItem label="排序码" prop="sort_code">
          <Input number v-model="dtlsObje.sort_code" :maxlength="10" placeholder="排序码"/>
        </FormItem>
        <FormItem label="描述">
          <Input v-model="dtlsObje.description" type="textarea" :rows="4" placeholder="描述"/>
        </FormItem>
        <FormItem>
          <Button size="large" @click="ModalShow=false">取消</Button>
          <Button type="primary" size="large" @click="onDtlsSave()">确定</Button>
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
import { getAccessToken, urlPath, getUserInfo,dataItemHandle  } from "@/libs/util";
import { Modal, Message } from "iview";
import { getDicList , getDicType , checkType , addDic , dataDicEdit , deleteDic} from "@/service/dic.js"
export default {
  data() {
    return {
      loading: false,
      tableHeight: 600,
      select:true,
      columns: [
        {
          title: "序号",
          width: 70,
          type: "index"
        },
        {
          title: "操作",
          slot: "action",
          width: 120,
          align: "center"
        },
        {
          title: "字典名称",
          key: "name",
          width: 200
        },
        {
          title: "字典代码",
          key: "code",
          width: 200
        },
        {
          title: "是否树形",
          slot: "is_tree",
          width: 100
        },
        {
          title: "排序码",
          key: "sortCode",
          width: 100
        },
        {
          title: "描述",
          key: "description",
        }
      ],
      data: [],
      dataItemCategory: [],
      total: 0,
      pageIndex: 0,
      pageSize: 15,
      pageSizeOps:[15, 30, 50, 100],
      ModalShow: false,
      ModalTitle: "",
      dtlsObje: null,
      //查询参数定义
      queryPar: {
        name: null,
        code: null,
        dataItemCategory: null
      },
      ruleValidate: {
        category: [
          { required: true, message: "请选择所属分类", trigger: "blur" ,type:'string'}
        ],
        name: [{ required: true, message: "请输入字典名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入字典代码", trigger: "blur" }],
        sort_code: [
          { required: true, message: "请输入排序码", trigger: "blur" , type:'number'}
        ],
        is_tree:[
          {required: true, message: "请选择是否为树形", trigger: "change" ,type:'number'}
        ]
      }
    };
  },
  //初始化
  created() {
    // let curUserInfo = getUserInfo();
    // this.userInfo = curUserInfo;
    // let category = "all"
    // getDicType(category).then(res=>{
    //   let data = dataItemHandle(res.datas);
    //   data.unshift({ name: "所有", itemvalue1: "all" });
    //   this.dataItemCategory = data;
    // })
    //  获取数据字典类型
    checkType().then(res=>{
      let data = dataItemHandle(res);
      data.unshift({ name: "所有", itemvalue1: 'null' });
      this.dataItemCategory = data;
    })
    // this.getDictionaries("DataItemCategory").then(res => {
    //   let data = dataItemHandle(res);
    //   data.unshift({ name: "所有", itemvalue1: "-999" });
    //   this.dataItemCategory = data;
    // });
    // this.queryPar.dataItemCategory = "all";
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
    reload(page) {
      if (page != undefined) {
        this.pageIndex = page;
      }
      this.loading = true;
      //查询相关参数
      var where = {
        name: this.queryPar.name,
        code: this.queryPar.code,
        category: null
      };
      let params = {
        page:{
          pageNum: this.pageIndex,
          pageSize: this.pageSize,
          orderBy: ''
        },
        category:this.queryPar.dataItemCategory == 'null' ? '' : this.queryPar.dataItemCategory ,
        code:this.queryPar.code,
        name:this.queryPar.name
      };
      getDicList(params).then(res=>{
        if(res.code==10000){
          this.total = res.total;
          this.data = res.datas
        } else {
          Message.error(data.msg)
        }
        this.loading = false;
      })
    },
    onPageChange(num) {
      this.pageIndex = num;
      this.reload();
    },
    onPageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.reload();
    },
    //  切换数据字典类型时刷新页面
    onDataItemCategorySelectChange(node) {
      this.queryPar.dataItemCategory = node;
      this.reload(1);
    },
    
    //  新增字典----弹出弹框进行新增
    onAdd() {
      if (this.$refs["formValidate"] != undefined) {
        this.$refs["formValidate"].resetFields();
      }
      this.dtlsObje = {
        id: null,
        name: null,
        code: null,
        category: null,
        is_tree: null,
        sort_code: null,
        description: null
      };
      this.ModalTitle = "新增数据字典项";
      this.ModalShow = true;
    },
    //  编辑已有字典逻辑
    onDtls(row) {
      if (this.$refs["formValidate"] != undefined) {
        this.$refs["formValidate"].resetFields();
      }
      this.dtlsObje = {
        id: row.id,
        name: row.name,
        code: row.code,
        category: row.category,
        is_tree: row.isTree,
        sort_code: row.sortCode,
        description: row.description
      };
      this.ModalTitle = "编辑数据字典项";
      this.ModalShow = true;
    },
    //  新增字典具体逻辑
    onDtlsSave() {
      let editPar = {
        id: this.dtlsObje.id,
        name: this.dtlsObje.name,
        code: this.dtlsObje.code,
        category: this.dtlsObje.category,
        is_tree: this.dtlsObje.is_tree,
        sort_code: this.dtlsObje.sort_code,
        description: this.dtlsObje.description
      };
      this.$refs["formValidate"].validate(valid => {
        if (valid) {
          if (!editPar.id) {
            let params = {
              page:{
                pageNum: this.pageIndex,
                pageSize: this.pageSize,
                orderBy: ''
              },
              category:this.dtlsObje.category == 'null' ? '' : this.dtlsObje.category,
              code:this.dtlsObje.code,
              description:this.dtlsObje.description,
              isTree:this.dtlsObje.is_tree,
              name:this.dtlsObje.name,
              sortCode:this.dtlsObje.sort_code
            };
            addDic(params).then(res=>{
              if(res.code == 10000){
                Message.success("新增成功！");
                this.ModalShow = false;
                this.reload();
              }
            })
          } else {
            let params = {
              page:{
                pageNum: this.pageIndex,
                pageSize: this.pageSize,
                orderBy: ''
              },
              category:this.dtlsObje.category == 'null' ? '' : this.dtlsObje.category,
              code:this.dtlsObje.code,
              description:this.dtlsObje.description,
              id:editPar.id,
              isTree:this.dtlsObje.is_tree,
              name:this.dtlsObje.name,
              sortCode:this.dtlsObje.sort_code
            };
            dataDicEdit(params).then(res=>{
              if(res.code == 10000){
                Message.success("编辑成功！");
                this.ModalShow = false;
                this.reload();
              }
            })
          }
          // if (!editPar.id) {
            // this.postCommonApiRequest("sys_dataitem", editPar).then(res => {
            //   var data = res.data;
            //   if (data.code == "40000") {
            //     Message.success("操作成功！");
            //     this.ModalShow = false;
            //     this.reload();
            //   } else {
            //     Message.error(data.msg);
            //   }
            // });
          // } else {
            // this.putCommonApiRequest("sys_dataitem", editPar).then(res => {
            //   var data = res.data;
            //   if (data.code == "40000") {
            //     Message.success("操作成功！");
            //     this.ModalShow = false;
            //     this.reload();
            //   } else {
            //     Message.error(data.msg);
            //   }
            // });
          // }
        }
      });
    },
    //删除按钮
    onDel(id) {
      Modal.confirm({
        title: "提示信息",
        content: "确认删除？",
        onOk: () => {
          let params = {
            id:id
          };
          deleteDic(params).then(res=>{
            if(res.datas == 1) {
              Message.success("操作成功！");
              this.reload();
            }
          })
        }
      });
    },
  }
};
</script>

