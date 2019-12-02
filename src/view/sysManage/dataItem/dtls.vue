<template>
  <div style="height:100%;position:relative;">
    <Form inline>
      <FormItem label="所属分类" :label-width="75" style="width:280px">
        <Select v-model="queryPar.dataItemCategory" @on-change="onDataItemCategorySelectChange">
          <Option
            v-for="(item,index) in dataItemCategory"
            :value="item.itemvalue1"
            :key="index+'0'"
          >{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="所属字典" :label-width="75" style="width:280px">
        <Select v-model="queryPar.code" @on-change="onDataItemSelectChange">
          <Option v-for="(item,index) in dataItem" :value="item.code" :key="index+'0'">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="字典代码" :label-width="75" style="width:280px">
        <Input v-model="queryPar.code" placeholder="字典代码" @on-enter="reload()"/>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="reload()">搜索</Button>
        <Button type="primary" @click="onAdd()">新增</Button>
        <!-- <Button  @click="reduce">取消选中</Button> -->
      </FormItem>
    </Form>
    <div class="Dictionaries_table" ref="TableHeight">
      <div class="form_list" style="height:100%;overflow: hidden;">
        <vxe-table
          v-if="tableHeight"
          border
          :height="tableHeight"
          auto-resize
          :loading="loading"
          :tree-config="{key: 'id', children: 'children',trigger:'cell'}"
          :data.sync="tableData"
          ref="xTable1"
          @radio-change="changeSelect"
        >
          <vxe-table-column type="radio"  width="40"></vxe-table-column>
          <vxe-table-column prop="action" label="操作" header-align="center" width="140px">
            <template v-slot="{row}">
              <div class="action-btn">
                <a @click="onDtls(row)">编辑</a>
                <a @click="onDel(row.id)">删除</a>
              </div>
            </template>
          </vxe-table-column>
          <vxe-table-column
            prop="name"
            label="字典项名称"
            header-align="center"
            width="200"
            tree-node
            show-overflow
          >
            <template v-slot="{row }">
              <span class="Table_tree_node">{{ row.name}}</span>
            </template>
          </vxe-table-column>
          <vxe-table-column prop="code" label="所属字典代码" header-align="center" width="150"></vxe-table-column>
          <vxe-table-column prop="sortCode" label="排序码" header-align="center" width="90"></vxe-table-column>
          <vxe-table-column prop="layers" label="层级" header-align="center" width="90"></vxe-table-column>
          <vxe-table-column prop="itemvalue1" label="值1" header-align="center" width="90"></vxe-table-column>
          <vxe-table-column prop="itemvalue2" label="值2" header-align="center" width="90"></vxe-table-column>
          <vxe-table-column prop="itemvalue3" label="值3" header-align="center" width="90"></vxe-table-column>
          <vxe-table-column prop="description" label="描述" header-align="center"></vxe-table-column>
        </vxe-table>
      </div>
    </div>
    <Modal
      v-model="ModalShow"
      :mask-closable="false"
      class-name="vertical-center-modal"
      footer-hide
      loading
      :closable='this.escC'
    >
      <p slot="header" style="color:#333333;font-size:16px">
        <span>{{ModalTitle}}</span>
      </p>
      <Form
        :model="dtlsObje"
        v-if="dtlsObje"
        ref="formValidate"
        :rules="ruleValidate"
        :label-width="100"
      >
        <FormItem label="所属字典代码" prop="code">
          <Input disabled v-model="dtlsObje.code" placeholder="字典代码"/>
        </FormItem>
        <FormItem label="字典名称" prop="name">
          <Input v-model="dtlsObje.name" placeholder="字典名称"/>
        </FormItem>
        <FormItem label="值1" prop="itemvalue1">
          <Input v-model="dtlsObje.itemvalue1" placeholder="值1"/>
        </FormItem>
        <FormItem label="值2">
          <Input v-model="dtlsObje.itemvalue2" placeholder="值2"/>
        </FormItem>
        <FormItem label="值3">
          <Input v-model="dtlsObje.itemvalue3" placeholder="值3"/>
        </FormItem>
        <FormItem label="排序码" prop='sort_code'>
          <Input number v-model="dtlsObje.sort_code" :maxlength="10" placeholder="排序码"/>
        </FormItem>
        <FormItem label="描述">
          <Input v-model="dtlsObje.description" type="textarea" :rows="4" placeholder="描述"/>
        </FormItem>
        <FormItem>
          <!-- <Button size="large" @click="ModalShow=false">取消</Button> -->
          <Button size="large" @click="reduceSelect">取消</Button>
          <Button type="primary" size="large" @click="onDtlsSave()">确定</Button>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<style>
.Dictionaries_table {
  height: calc(100% - 57px);
  overflow: hidden;
}
</style>
<script>
import {
  getAccessToken,
  urlPath,
  getUserInfo,
  dataItemHandle,
  getTableTreeData
} from "@/libs/util";
import { Modal, Message } from "iview";
import { checkType , getDicType , dicMessage , dicAllMessage , dataDicMessageEdit , dicMsgDelete} from "@/service/dic.js"
export default {
  data() {
    return {
      loading: false,
      tableHeight: 600,
      selectRow: true,
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
          title: "字典项名称",
          key: "name",
          width: 260
        },
        {
          title: "所属字典代码",
          key: "code",
          width: 160
        },
        {
          title: "排序码",
          key: "sortCode",
          width: 100
        },
        {
          title: "层级",
          key: "layers",
          width: 100
        },
        {
          title: "值1",
          key: "itemvalue1",
          width: 200
        },
        {
          title: "值2",
          key: "itemvalue2",
          width: 200
        },
        {
          title: "值3",
          key: "itemvalue3",
          width: 200
        },
        {
          title: "描述",
          key: "description"
        }
      ],
      data: [],
      total: 0,
      pageIndex: 0,
      pageSize: 15,
      dataItem: [],
      dataItemCategory: [],
      ModalShow: false,
      escC:false,
      ModalTitle: "",
      curDataItem: null,
      dtlsObje: null,
      tableData: [],
      select:{},
      modal1:false,
      //查询参数定义
      queryPar: {
        code: null,
        dataItemCategory: null
      },
      ruleValidate: {
        code: [
          { required: true, message: "请先选择所属字典", trigger: "change" }
        ],
        name: [{ required: true, message: "请输入字典名称", trigger: "blur" }],
        itemvalue1: [{ required: true, message: "请输入值1", trigger: "blur" }],
        sort_code:[{required: true, message: "请输入排序码", trigger: "blur",type:'number'}]
      }
    };
  },
  //初始化
  created() {
    // let curUserInfo = getUserInfo();
    // this.userInfo = curUserInfo;
    this.pageSizeOps = [15, 30, 50, 100];
    //  获取数据字典类型
    checkType().then(res=>{
      let data = dataItemHandle(res);
      data.unshift({ name: "所有", itemvalue1: "all" });
      this.dataItemCategory = data;
    })
    this.queryPar.dataItemCategory = "-999";
    this.loadDataItem();
    this.$nextTick(() => {
      this.select = this.$refs.xTable1.selectRow
    })
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
    loadDataItem() {
      let category = this.queryPar.dataItemCategory
      getDicType(category).then(res=>{
        this.dataItem = res.datas;
      })
    },
    reload() {
      if (this.queryPar.code != null) {
        this.loading = true;
        let code = this.queryPar.code;
        dicMessage(code).then(res=>{
          if(res.code==10000){
            this.tableData = res.datas;
            this.loading = false;
          } else {
            Message.error(res.msg)
          }
        })
      }
    },
    //  所属字典下拉
    onDataItemSelectChange(node) {
      this.queryPar.code = node;
      this.curDataItem = this.dataItem.filter(function(e) {
        return e.code == node;
      })[0];
      this.reload();
    },
    onDataItemCategorySelectChange(node) {
      this.queryPar.dataItemCategory = node;
      this.loadDataItem();
    },
    //    新增
    onAdd() {
      if (this.$refs["formValidate"] != undefined) {
        this.$refs["formValidate"].resetFields();
      }
      // console.log(this.curDataItem);
      if (!this.curDataItem) {
        Message.error("请选择所属字典！");
        return;
      }
      Message.info({content:"点击新增即可在该字典下新增字典，如想在对应的字典下新建请勾选对应的字典再点击新增",duration: 10,closable: true});
      this.select = this.$refs.xTable1.selectRow;
      if(this.select == '' || this.select == undefined) {
        this.dtlsObje = {
          id: null,
          dataitem_id:this.curDataItem.id,
          code: this.curDataItem.code,
          name: null,
          pid: null,
          itemvalue1: null,
          itemvalue2: null,
          itemvalue3: null,
          sort_code: null,
          description: null
        };
      } else {
        this.dtlsObje = {
          id: null,
          dataitem_id:this.curDataItem.id,
          code: this.curDataItem.code,
          name: null,
          pid: this.select.id,
          itemvalue1: null,
          itemvalue2: null,
          itemvalue3: null,
          sort_code: null,
          description: null
        };
      }
      this.ModalTitle = "新增数据字典项";
      this.ModalShow = true;
      //console.log(this.dtlsObje);
    },
    //   修改
    onDtls(row) {
      if (this.$refs["formValidate"] != undefined) {
        this.$refs["formValidate"].resetFields();
      }
      this.dtlsObje = {
        id:row.id,
        dataitem_id: this.curDataItem.id,
        code: row.code,
        name: row.name,
        pid: row.pid,
        layers:row.layers,
        itemvalue1: row.itemvalue1,
        itemvalue2: row.itemvalue2,
        itemvalue3: row.itemvalue3,
        sort_code: row.sortCode,
        description: row.description
      };
      this.ModalTitle = "编辑数据字典项";
      this.ModalShow = true;
    },
    //   确定新增或者修改
    onDtlsSave() {
      this.$refs["formValidate"].validate(valid => {
        if (valid) {
          //  新增
          if(this.select == null || this.select == '') {
            if(!this.dtlsObje.id) {
              let params = {
                code: this.dtlsObje.code,
                dataitemId: this.dtlsObje.dataitem_id,
                description: this.dtlsObje.description,
                itemvalue1: this.dtlsObje.itemvalue1,
                itemvalue2: this.dtlsObje.itemvalue2,
                itemvalue3: this.dtlsObje.itemvalue3,
                layers:  0 ,
                name: this.dtlsObje.name,
                pid: '',
                sortCode: this.dtlsObje.sort_code,
                // id: this.dtlsObje.id,
              };
              dicAllMessage(params).then(res=>{
                this.ModalShow = false;
                if(res.datas == 1){
                  this.reload();
                  this.$refs.xTable1.selectRow = '';
                  Message.success("新增字典成功！");
                }
              })
            } else {
              let params = {
                code:this.dtlsObje.code,
                dataitemId:this.dtlsObje.dataitem_id,
                description:this.dtlsObje.description,
                id:this.dtlsObje.id,
                itemvalue1:this.dtlsObje.itemvalue1,
                itemvalue2: this.dtlsObje.itemvalue2,
                itemvalue3: this.dtlsObje.itemvalue3,
                layers:this.dtlsObje.layers,
                name:this.dtlsObje.name,
                pid:this.dtlsObje.pid,
                sortCode:this.dtlsObje.sort_code,
              }
              dataDicMessageEdit(params).then(res=>{
                this.ModalShow = false;
                if(res.datas == 1) {
                  this.reload();
                  Message.success("编辑字典成功！");
                }
              })
            }
          } else {
            let params = {
              code: this.dtlsObje.code,
              dataitemId: this.dtlsObje.dataitem_id,
              description: this.dtlsObje.description,
              itemvalue1: this.dtlsObje.itemvalue1,
              itemvalue2: this.dtlsObje.itemvalue2,
              itemvalue3: this.dtlsObje.itemvalue3,
              layers: this.select.layers + 1,
              name: this.dtlsObje.name,
              pid:this.dtlsObje.pid,
              sortCode: this.dtlsObje.sort_code,
              // id: this.dtlsObje.id,
            };
            dicAllMessage(params).then(res=>{
              this.ModalShow = false;
              if(res.datas == 1){
                this.reload();
                this.select = ''
                this.$refs.xTable1.selectRow = ''
                Message.success("新增字典成功！")
              }
            })
          }
          // if (!editPar.id) {
          //   this.postCommonApiRequest("sys_dataitem", editPar).then(res => {
          //     var data = res.data;
          //     if (data.code == "40000") {
          //       Message.success("操作成功！");
          //       this.ModalShow = false;
          //       this.reload();
          //     } else {
          //       Message.error(data.msg);
          //     }
          //   });
          // } else {
          //   this.putCommonApiRequest("sys_dataitem", editPar).then(res => {
          //     var data = res.data;
          //     if (data.code == "40000") {
          //       Message.success("操作成功！");
          //       this.ModalShow = false;
          //       this.reload();
          //     } else {
          //       Message.error(data.msg);
          //     }
          //   });
          // }
        }
      });
    },
    reduceSelect(){
      this.ModalShow = false;
      this.$refs.xTable1.selectRow = '';
    },
    //  取消选中
    reduce(){
      this.$refs.xTable1.selectRow = '';
      // console.log(this.$refs.xTable1.clearSelected());
    },
    changeSelect(){
      console.log("666666")
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
          dicMsgDelete(params).then(res=>{
            if(res.datas == 1) {
              Message.success("操作成功！");
              this.reload();
            }
          })
        }
      });
    }
  }
};
</script>

