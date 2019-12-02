<template>
  <div style="height:100%;position:relative;">
    <div>
      <Form inline>
        <FormItem>
          <Button type="primary" @click="onAdd()">新增</Button>
        </FormItem>
      </Form>
    </div>
    <div class="form_lists">
      <div style="height:100%;overflow: hidden;" ref="TableHeight">
        <Table border :columns="columns" :data="data" :loading="loading" :height="tableHeight">
          <template slot-scope="{ row }" slot="enable_mark">
            <span v-if="row.enableMark == 100" style="color:green">启用</span>
            <span v-else-if="row.enableMark== 0" style="color:red">禁用</span>
          </template>
          <template slot-scope="{row}" slot="hrAuth">
            <span v-if="row.hrAuth == 1" style="color:green">是</span>
            <span v-else-if="row.hrAuth==0" style="color:red">否</span>
          </template>
          <template slot-scope="{row}" slot="isHot">
            <span v-if="row.isHot == 1" style="color:green">是</span>
            <span v-else-if="row.isHot==0" style="color:red">否</span>
          </template>
          <template slot-scope="{row}" slot="realAuth">
            <span v-if="row.realAuth == 1" style="color:green">是</span>
            <span v-else-if="row.realAuth==0" style="color:red">否</span>
          </template>
          <template slot-scope="{row}" slot="specialAuth">
            <span v-if="row.specialAuth == 1" style="color:green">是</span>
            <span v-else-if="row.specialAuth==0" style="color:red">否</span>
          </template>
          <template slot-scope="{row}" slot="action">
            <div class="action-btn">
              <a @click="onDtls(row)">编辑</a>
              <a style="color:red" @click="deletes(row.id)">删除</a>
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
      <!--对话框-->
      <Modal
        v-model="ModalShow"
        footer-hide
        :mask-closable="false"
        class-name="vertical-center-modal"
        width="800"
      >
        <p slot="header" style="color:#333333;font-size:16px">
          <span>{{ModalTitle}}</span>
        </p>
        <Form
          :model="dtlsObje"
          v-if="dtlsObje"
          ref="formValidate"
          :rules="formValidate"
          label-position="left"
          :label-width="200"
          inline
        >
          <p>项目基础信息</p>
          <div style="border:1px solid #E8EAEC">
            <Row>
              <Col span="12">
                <FormItem label="项目名称" prop="name">
                  <Input v-model="dtlsObje.name" placeholder="项目名称" />
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="项目编码" prop="mark">
                  <Input v-model="dtlsObje.mark" placeholder="项目编码" />
                </FormItem>
              </Col>
            </Row>
            <!-- <Row>
          <Col span="12">
            <FormItem label="第三方应用图标(手机端)图标名称" prop='h5IconName'>
              <Input v-model="dtlsObje.h5IconName" placeholder="请输入图标名称" />
            </FormItem>
          </Col>
          <Col span='12'>
            <FormItem label="第三方应用图标(电脑端)图标名称" prop='webIconName'>
              <Input v-model="dtlsObje.webIconName" placeholder="请输入图标名称" />
            </FormItem>
          </Col>
            </Row>-->
            <!-- <Row>
              <Col span="12">
                <FormItem label="应用图标(手机端)" >
                  <Upload
                    :action="UPLOAD_API_HOST"
                    :on-success="handleSuccess1"
                    :format="['jpg','jpeg','png']"
                    :on-format-error="handleFormatError"
                    :show-upload-list="false"
                    ref="mobileUpload"
                  >
                    <Button>上传图标</Button>
                  </Upload>
                  <img
                    :src="imgUrl"
                    alt
                    v-if="imgUrl"
                    style="width:100px;height:100px;margin-top:20px"
                  />
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="应用图标(电脑端)" prop="pcIcon">
                  <Upload
                    :action="UPLOAD_API_HOST"
                    :on-success="handleSuccess2"
                    :format="['jpg','jpeg','png']"
                    :on-format-error="handleFormatError"
                    :show-upload-list="false"
                    ref="pcUpload"
                  >
                    <Button>上传图标</Button>
                  </Upload>
                  <img
                    :src="imgUrl1"
                    alt
                    v-if="imgUrl1"
                    style="width:100px;height:100px;margin-top:20px"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <FormItem label="应用地址(手机端)" >
                  <Input v-model="dtlsObje.h5Url" placeholder="应用地址(手机端)" />
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="应用地址(电脑端)" prop="webUrl">
                  <Input v-model="dtlsObje.webUrl" placeholder="应用地址(电脑端)" />
                </FormItem>
              </Col>
            </Row> -->
            <Row>
              <Col span="12">
                <FormItem label="是否启用" prop="enable_mark">
                  <RadioGroup v-model="dtlsObje.enable_mark">
                    <Radio :label="100" value="100">启用</Radio>
                    <Radio style="margin-left:18px" :label="0" value="0">禁用</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="需单位认证" prop="hrAuth">
                  <RadioGroup v-model="dtlsObje.hrAuth">
                    <Radio :label="1" value="1">是</Radio>
                    <Radio style="margin-left:30px" :label="0" value="0">否</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <FormItem label="业务类别" prop="options1">
                  <Select v-model="dtlsObje.options1" style="width:163px">
                    <Option
                      v-for="item in this.options1"
                      :value="item.itemvalue1"
                      :key="item.value"
                    >{{ item.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="需实名认证" prop="realAuth">
                  <RadioGroup v-model="dtlsObje.realAuth">
                    <Radio :label="1" value="1">是</Radio>
                    <Radio style="margin-left:30px" :label="0" value="0">否</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <!-- <Col span="12">
                <FormItem label="小程序地址" prop="mpUrl">
                  <Input v-model="dtlsObje.mpUrl" placeholder="小程序地址" />
                </FormItem>
              </Col> -->
              <Col span="12">
                <FormItem label="业务平台类型" prop="other">
                  <RadioGroup v-model="dtlsObje.other" style="width:400px">
                    <Radio :label="1" value="1">第三方平台</Radio>
                    <Radio :label="0" value="0" style='margin-left:10px'>内部平台</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="专项信息完善状态" prop="specialAuth">
                  <!-- <Input v-model="dtlsObje.specialAuth" placeholder="专项信息完善状态" /> -->
                  <RadioGroup v-model="dtlsObje.specialAuth">
                    <Radio :label="1" value="1">是</Radio>
                    <Radio style="margin-left:30px" :label="0" value="0">否</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <FormItem label="业务热门类别" prop="hotType">
                  <Select v-model="dtlsObje.hotType" style="width:163px">
                    <Option
                      v-for="item in this.options2"
                      :value="item.itemvalue1"
                      :key="item.value"
                    >{{ item.name }}</Option>
                  </Select>
                </FormItem>
              </Col>
              <!-- <Col span="12">
                <FormItem label="业务平台类型" prop="other">
                  <RadioGroup v-model="dtlsObje.other" style="width:400px">
                    <Radio :label="1" value="1">第三方平台</Radio>
                    <Radio :label="0" value="0" style='margin-left:30px'>内部平台</Radio>
                  </RadioGroup>
                </FormItem>
              </Col> -->
            </Row>
            <Row v-if="dtlsObje.hotType == 2 ">
              <Col span="24">
                <FormItem label="热门时间段" class="form">
                  <div v-for="(item, index) in bmList" :key="index" style="display:inline-block">
                    <FormItem
                      :label="'第' + item.index +'热门时间段'"
                      style="margin-top:20px"
                      v-if="item.deleteMark != 1"
                    >
                      <!--     :prop="'items' + item.index + 'value'" 
                      :rules="{required: true, message: '第' + item.index +'名称不能为空', trigger: 'blur'}">-->
                      <Row>
                        <Col span="18">
                          <!-- <Date-picker v-model='item.value' :value= 'item.value' type="daterange" :clearable='false' placement="bottom-end" :options="options4" @on-change='getTime' placeholder="请选择热门时间段" style="width: 200px"></Date-picker> -->
                          <Date-picker
                            v-model="item.value"
                            :value="item.value"
                            type="daterange"
                            :clearable="false"
                            placement="bottom-end"
                            :options="options4"
                            @on-change="(datetime)=> {changeDateTime(item,index)}"
                            placeholder="请选择热门时间段"
                            style="width: 200px"
                          ></Date-picker>
                        </Col>
                        <Col span="4" offset="1">
                          <Button type="error" @click="handleRemove(index,item)">删除</Button>
                        </Col>
                      </Row>
                    </FormItem>
                  </div>
                  <FormItem class="add">
                    <Row>
                      <Col span="24">
                        <Button
                          type="dashed"
                          long
                          @click="handleAdd"
                          icon="md-add"
                          class="btnhandleAdd"
                        >继续添加</Button>
                      </Col>
                    </Row>
                  </FormItem>
                  <Row :gutter="25" style="margin-top: 10px;">
                    <Col :md="24" :lg="20">
                      <FormItem>
                        <p
                          style="color:red;"
                        >说明：热门时间段为业务热门类别为时间段热门时所需要填写的信息。即设置该项目的热门时间段，时间段时间不能重合，最多设置10个热门时间段。</p>
                      </FormItem>
                    </Col>
                  </Row>
                </FormItem>
              </Col>
            </Row>
          </div>
          <p>个人端</p>
          <div style="border:1px solid #E8EAEC">
            <Row>
              <Col span="12">
                <FormItem label="应用图标(手机端)" >
                  <Upload
                    :action="UPLOAD_API_HOST"
                    :on-success="handleSuccess1"
                    :format="['jpg','jpeg','png']"
                    :on-format-error="handleFormatError"
                    :show-upload-list="false"
                    ref="mobileUpload"
                  >
                    <Button>上传图标</Button>
                  </Upload>
                  <img
                    :src="imgUrl"
                    alt
                    v-if="imgUrl"
                    style="width:100px;height:100px;margin-top:20px"
                  />
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="应用图标(电脑端)" >
                  <Upload
                    :action="UPLOAD_API_HOST"
                    :on-success="handleSuccess2"
                    :format="['jpg','jpeg','png']"
                    :on-format-error="handleFormatError"
                    :show-upload-list="false"
                    ref="pcUpload"
                  >
                    <Button>上传图标</Button>
                  </Upload>
                  <img
                    :src="imgUrl1"
                    alt
                    v-if="imgUrl1"
                    style="width:100px;height:100px;margin-top:20px"
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <FormItem label="应用地址(手机端)" >
                  <Input v-model="dtlsObje.h5Url" placeholder="应用地址(手机端)" />
                </FormItem>
              </Col>
              <Col span="12">
                <FormItem label="应用地址(电脑端)" >
                  <Input v-model="dtlsObje.webUrl" placeholder="应用地址(电脑端)" />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="12">
                <FormItem label="小程序地址" >
                  <Input v-model="dtlsObje.mpUrl" placeholder="小程序地址" />
                </FormItem>
              </Col>
              <!-- <Col span="12">
                <FormItem label="业务平台类型" prop="other">
                  <RadioGroup v-model="dtlsObje.other" style="width:400px">
                    <Radio :label="1" value="1">第三方平台</Radio>
                    <Radio :label="0" value="0" style='margin-left:30px'>内部平台</Radio>
                  </RadioGroup>
                </FormItem>
              </Col> -->
            </Row>
          </div>
          <p>管理端</p>
          <div style="border:1px solid #E8EAEC">
            <Row>
              <Col span="14">
                <FormItem label="业务编码" :label-width="200">
                  <!-- <Select v-model="dtlsObje.mark" style='width:161px'>
                  <Option v-for="item in projectList" :value="item.itemvalue1" :key="item.itemvalue1">{{ item.name }}</Option>
                  </Select>-->
                  <treeselect
                    v-model="dtlsObje.projectMode"
                    :options="this.projectList"
                    :show-count="true"
                    clearValueText="清除"
                    placeholder="请选择"
                    noResultsText="当前没有搜索的内容"
                    @select="onInsCategorySeachChange"
                    :normalizer="normalizer"
                  />
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="应用地址" :label-width="100">
                  <Input v-model="dtlsObje.otherUrl" placeholder="  请输入应用地址" />
                </FormItem>
              </Col>
            </Row>
          </div>
          <!-- <div style="margin-top:20px">
            <Row>
              <Col span="24">
                <FormItem label="业务平台类型" prop="other">
                  <RadioGroup v-model="dtlsObje.other" style="width:400px">
                    <Radio :label="1" value="1">第三方平台</Radio>
                    <Radio :label="0" value="0" style='margin-left:30px'>内部平台</Radio>
                  </RadioGroup>
                </FormItem>
              </Col>
            </Row>
          </div> -->
          <Row type="flex" justify="space-around" class="code-row-bg">
            <Col span="16">
              <FormItem>
                <Button size="large" @click="ModalShow=false">取消</Button>
                <Button type="primary" size="large" @click="onDtlsSave()">{{this.type}}</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  </div>
</template>
<style lang="less" scoped>
.form_lists {
  height: calc(100% - 60px);
  overflow: hidden;
  box-sizing: border-box;
  padding-bottom: 38px;
}
.form {
  position: relative;
}
.add {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
<script>
import {
  getAccessToken,
  urlPath,
  validateSequence,
  getUserInfo
} from "@/libs/util";
import { Modal, Message } from "iview";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import {
  getProjectList,
  addProject,
  deletetProject,
  editProject,
  dic
} from "@/service/projectAdmin";
export default {
  components: {
    Treeselect
  },
  data() {
    const checkIcon = (rule, value, callback) => {
      if (this.imgUrl == "") {
        callback(new Error("请上传图标！"));
      } else {
        callback();
      }
    };
    const checkIcon1 = (rule, value, callback) => {
      if (this.imgUrl1 == "") {
        callback(new Error("请上传图标！"));
      } else {
        callback();
      }
    };
    return {
      bmList: [
        {
          value: [],
          id: "",
          index: 1
        }
      ],
      timeList: [
        {
          startDate: "",
          orderIndex: 1,
          endDate: ""
        }
      ],
      options4: {},
      index: 1,
      num: 1,
      active: "",
      time: [],
      newTime: null,
      loading: false,
      tableHeight: 520,
      mobileIcon: "",
      pcIcon: "",
      mobileList: [],
      pcList: [],
      type: "",
      columns: [
        {
          title: "序号",
          type: "index",
          align: "center"
        },
        {
          title: "操作",
          slot: "action",
          align: "center"
        },
        {
          title: "项目名称",
          key: "projectName"
        },
        {
          title: "项目编码",
          key: "projectCode"
        },
        {
          title: "使用状态",
          slot: "enable_mark"
        },
        {
          title: "单位认证",
          slot: "hrAuth"
        },
        // {
        //   title:"主键id",
        //   key:"id"
        // },
        {
          title: "实名认证",
          slot: "realAuth"
        },
        {
          title: "专项信息完善状态",
          slot: "specialAuth"
        },
        {
          title: "创建时间",
          key: "createDate"
        },
        {
          title: "最后修改时间",
          key: "lastModifiedDate"
        }
      ],
      data: [],
      total: 0,
      pageIndex: 0,
      pageSize: 15,
      ModalTitle: null,
      uploadList: [],
      uploadList1: [],
      options1: [],
      options2: [],
      //主体编辑
      ModalShow: false,
      dtlsObje: null,
      formValidate: {
        name: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
        mark: [{ required: true, message: "请输入项目编码", trigger: "blur" }],
        enable_mark: [
          {
            required: true,
            message: "请选择是否启用",
            trigger: "change",
            type: "number"
          }
        ],
        // h5IconName:[
        //   {required:true , message:'请输入图标名称',trigger:'blur'}
        // ],
        // webIconName:[
        //   {required:true , message:'请输入图标名称',trigger:'blur'}
        // ],
        h5Url: [{ required: true, message: "请输入应用地址", trigger: "blur" }],
        webUrl: [
          { required: true, message: "请输入应用地址", trigger: "blur" }
        ],
        hrAuth: [
          {
            required: true,
            message: "请选择是否需单位认证",
            trigger: "change",
            type: "number"
          }
        ],
        realAuth: [
          {
            required: true,
            message: "请选择是否需实名认证",
            trigger: "change",
            type: "number"
          }
        ],
        mpUrl: [
          { required: true, message: "请输入小程序地址", trigger: "blur" }
        ],
        specialAuth: [
          { required: true, message: "请选择专项信息完善状态", trigger: "change",type: "number" }
        ],
        mobileIcon: [
          {
            required: true,
            message: "请上传图标",
            trigger: "change",
            validator: checkIcon
          }
        ],
        pcIcon: [
          {
            required: true,
            message: "请上传图标",
            trigger: "change",
            validator: checkIcon1
          }
        ],
        options1: [
          { required: true, message: "请选择业务类别", trigger: "change" }
        ],
        // other:[
        //   {required:true , message:'请选择是否第三方业务类型',trigger:'change',type:'number'}
        // ],
        hotType: [
          { required: true, message: "请选择业务热门类别", trigger: "change" }
        ],
        hotService: [
          { required: true, message: "请设置业务热门时间段", trigger: "change" }
        ],
        other: [
          { required: true, message: "请选择是否第三方业务类型", trigger: "change",type:'number'}
        ]
      },
      imgUrl: "",
      imgUrl1: "",
      html5Url: "",
      computerUrl: "",
      projectList: [],
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.itemvalue1,
          label: node.name,
          children: node.children
        };
      }
    };
  },
  created() {
    // let userNew = getUserInfo();
    // this.userNew = userNew;
    this.pageSizeOps = [15, 30, 50, 100];
    this.getDic();
    this.getDic1();
    this.getDic2();
    this.reload();
  },
  mounted() {
    //计算table的高度
    this.$nextTick(() => {
      let tableHeight = this.$refs.TableHeight.offsetHeight;
      this.tableHeight = tableHeight;
    });
    var _this = this;
    window.onresize = function() {
      // 定义窗口大小变更通知事件
      let tableHeight = _this.$refs.TableHeight.offsetHeight;
      _this.tableHeight = tableHeight;
    };
  },
  beforeDestroy() {
    window.onresize = null;
  },
  methods: {
    getDic() {
      let code = "projectCategory";
      dic(code).then(res => {
        if (res.datas) {
          this.options1 = res.datas;
        }
      });
    },
    getDic1() {
      let code = "ServiceProjectHotCategory";
      dic(code).then(res => {
        if (res.datas) {
          this.options2 = res.datas;
        }
      });
    },
    getDic2() {
      let code = "ServiceCategory";
      dic(code).then(res => {
        if (res.datas) {
          this.projectList = res.datas;
        }
      });
    },
    reload() {
      this.loading = true;
      let params = {
        page: {
          pageNum: this.pageIndex,
          pageSize: this.pageSize,
          orderBy: ""
        }
      };
      getProjectList(params).then(res => {
        this.loading = false;
        if (res.code == 10000) {
          this.total = res.total;
          this.data = res.datas;
        } else {
          Message.error(res.msg);
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
    //新增按钮点击事件
    onAdd() {
      this.active = "1";
      if (this.$refs["formValidate"] != undefined) {
        this.$refs["formValidate"].resetFields();
      }
      this.dtlsObje = {
        id: null,
        name: null,
        mark: null,
        enable_mark: 100,
        web_url: null,
        mobile_url: null,
        hrAuth: 0,
        realAuth: 0,
        otherUrl: "",
        specialAuth: 0,
        projectMode: null
      };
      this.bmList = [
        {
          value: [],
          id: "",
          index: 1
        }
      ];
      this.timeList = [
        {
          startDate: "",
          orderIndex: 1,
          endDate: ""
        }
      ];
      this.imgUrl1 = "";
      (this.imgUrl = ""),
        (this.html5Url = ""),
        (this.computerUrl = ""),
        (this.type = "新建");
      this.ModalTitle = "新增业务项目";
      this.ModalShow = true;
    },
    //编辑
    onDtls(row) {
      if (this.$refs["formValidate"] != undefined) {
        this.$refs["formValidate"].resetFields();
      }
      this.active = "2";
      this.dtlsObje = {
        id: row.id,
        options1: row.category,
        other:row.isThird,
        name: row.projectName,
        mark: row.projectCode,
        enable_mark: row.enableMark,
        h5Url: row.h5Url,
        h5Icon: row.h5Icon,
        webIcon: row.webIcon,
        hrAuth: row.hrAuth,
        mpUrl: row.mpUrl,
        realAuth: row.realAuth,
        specialAuth: row.specialAuth,
        webUrl: row.webUrl,
        // h5IconName:row.h5IconName,
        // webIconName:row.webIconName,
        projectMode: row.businessMark,
        otherUrl: row.manageUrl,
        hotType: row.hotCategory.toString()
      };
      if (row.timeList) {
        this.num == row.timeList.length;
        this.bmList = [];
        this.timeList = row.timeList;
        if (row.timeList.length > 0) {
          for (let i = 0; i < row.timeList.length; i++) {
            let arr = [];
            arr.push(row.timeList[i].startDate);
            arr.push(row.timeList[i].endDate);
            let obj = {
              value: arr,
              id: "",
              index: i + 1
            };
            this.bmList.push(obj);
          }
        }
      }
      this.imgUrl = process.env.fileUrl + row.h5Icon;
      this.imgUrl1 = process.env.fileUrl + row.webIcon;
      this.html5Url = row.h5Icon;
      this.computerUrl = row.webIcon;

      this.type = "修改";
      this.ModalTitle = "编辑业务项目";
      this.ModalShow = true;
    },
    onDtlsSave() {
      for (let k = 0; k < this.timeList.length; k++) {
        if (this.timeList[k].timeUnitId && this.timeList[k].deleteMark != 1) {
          this.timeList[k].deleteMark = 0;
        }
      }
      let arrList = [];
      for (let p = 0; p < this.timeList.length; p++) {
        if (this.timeList[p].deleteMark != 1) {
          arrList.push(this.timeList[p]);
        }
      }
      this.$refs["formValidate"].validate(valid => {
        if (valid) {
          // 新增
          if (!this.dtlsObje.id) {
            // 非时间段热门
            if (this.dtlsObje.hotType == 0 || this.dtlsObje.hotType == 1) {
              let params = {
                page: {
                  pageNum: this.pageIndex,
                  pageSize: this.pageSize,
                  orderBy: ""
                },
                businessMark: this.dtlsObje.projectMode,
                manageUrl: this.dtlsObje.otherUrl,
                hotCategory: this.dtlsObje.hotType * 1,
                timeList: [],
                isThird:this.dtlsObje.other,
                category: this.dtlsObje.options1,
                enableMark: this.dtlsObje.enable_mark,
                // h5Icon:this.mobileIcon,
                h5Icon: this.html5Url,

                h5Url: this.dtlsObje.h5Url,
                hrAuth: this.dtlsObje.hrAuth,
                // h5IconName:this.dtlsObje.h5IconName,
                mpUrl: this.dtlsObje.mpUrl,
                projectCode: this.dtlsObje.mark,
                projectName: this.dtlsObje.name,
                realAuth: this.dtlsObje.realAuth,
                specialAuth: this.dtlsObje.specialAuth,
                // webIcon:this.pcIcon,
                webIcon: this.computerUrl,

                webUrl: this.dtlsObje.webUrl
                // webIconName:this.dtlsObje.webIconName
              };
              addProject(params).then(res => {
                if (res.datas > 0) {
                  this.ModalShow = false;
                  Message.success("新增成功");
                  this.imgUrl1 = "";
                  (this.imgUrl = ""),
                    (this.html5Url = ""),
                    (this.computerUrl = ""),
                    (this.timeList = [
                      {
                        startDate: "",
                        orderIndex: 1,
                        endDate: ""
                      }
                    ]);
                  this.bmList = [
                    {
                      value: [],
                      id: "",
                      index: 1
                    }
                  ];
                  this.reload();
                }
              });
            } else if (this.dtlsObje.hotType == 2) {
              //时间段热门
              let arr = JSON.parse(JSON.stringify(arrList));
              for (let i = 0; i < arr.length; i++) {
                let reg = new RegExp("-", "g");
                arr[i].startDate = arr[i].startDate.replace(reg, "");
                arr[i].endDate = arr[i].endDate.replace(reg, "");
              }
              var minTimes = [];
              var maxTimes = [];
              arr.map(v => {
                minTimes.push(v.startDate); //多段开始时间的数组 minTimes
              });
              arr.map(v => {
                maxTimes.push(v.endDate); //多段结束时间的数组 maxTimes
              });
              minTimes.sort();
              maxTimes.sort();
              let j = 0;
              for (let i = 0; i < minTimes.length; i++) {
                if (maxTimes[i] < minTimes[i + 1]) {
                  j = j;
                } else if (maxTimes[i] >= minTimes[i + 1]) {
                  j++;
                }
              }
              if (j == 0) {
                let params = {
                  page: {
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                    orderBy: ""
                  },
                  businessMark: this.dtlsObje.projectMode,
                  manageUrl: this.dtlsObje.otherUrl,
                  hotCategory: this.dtlsObje.hotType * 1,
                  timeList: this.timeList,
                  isThird:this.dtlsObje.other,
                  category: this.dtlsObje.options1,
                  enableMark: this.dtlsObje.enable_mark,
                  // h5Icon:this.mobileIcon,
                  h5Icon: this.html5Url,

                  h5Url: this.dtlsObje.h5Url,
                  hrAuth: this.dtlsObje.hrAuth,
                  h5IconName: this.dtlsObje.h5IconName,
                  mpUrl: this.dtlsObje.mpUrl,
                  projectCode: this.dtlsObje.mark,
                  projectName: this.dtlsObje.name,
                  realAuth: this.dtlsObje.realAuth,
                  specialAuth: this.dtlsObje.specialAuth,
                  // webIcon:this.pcIcon,
                  webIcon: this.computerUrl,

                  webUrl: this.dtlsObje.webUrl,
                  webIconName: this.dtlsObje.webIconName
                };
                // };
                addProject(params).then(res => {
                  if (res.datas > 0) {
                    this.ModalShow = false;
                    Message.success("新增成功");
                    this.imgUrl1 = "";
                    (this.imgUrl = ""),
                      (this.html5Url = ""),
                      (this.computerUrl = ""),
                      (this.timeList = [
                        {
                          startDate: "",
                          orderIndex: 1,
                          endDate: ""
                        }
                      ]);
                    this.bmList = [
                      {
                        value: [],
                        id: "",
                        index: 1
                      }
                    ];
                    this.reload();
                  }
                });
              } else {
                Message.error("热门时间段重合！");
              }
            }
          } else {
            // 编辑
            if (this.dtlsObje.hotType == 0 || this.dtlsObje.hotType == 1) {
              let params = {
                page: {
                  pageNum: this.pageIndex,
                  pageSize: this.pageSize,
                  orderBy: ""
                },
                businessMark: this.dtlsObje.projectMode,
                manageUrl: this.dtlsObje.otherUrl,
                timeList: [],
                hotCategory: this.dtlsObje.hotType * 1,
                isThird:this.dtlsObje.other,
                category: this.dtlsObje.options1,
                id: this.dtlsObje.id,
                enableMark: this.dtlsObje.enable_mark,
                // h5Icon:this.uploadList[0].url,   //  H5图标地址
                h5Icon: this.html5Url,

                h5Url: this.dtlsObje.h5Url,
                // h5IconName:this.dtlsObje.h5IconName,
                hrAuth: this.dtlsObje.hrAuth,
                mpUrl: this.dtlsObje.mpUrl,
                projectCode: this.dtlsObje.mark,
                projectName: this.dtlsObje.name,
                realAuth: this.dtlsObje.realAuth,
                specialAuth: this.dtlsObje.specialAuth,
                // webIcon:this.uploadList1[0].url,    //  PC图标地址
                webIcon: this.computerUrl,

                webUrl: this.dtlsObje.webUrl
                // webIconName:this.dtlsObje.webIconName
              };
              editProject(params).then(res => {
                if (res.datas > 0) {
                  this.ModalShow = false;
                  Message.success("修改成功");
                  this.imgUrl1 = "";
                  (this.imgUrl = ""),
                    (this.html5Url = ""),
                    (this.computerUrl = ""),
                    (this.timeList = [
                      {
                        startDate: "",
                        orderIndex: 1,
                        endDate: ""
                      }
                    ]);
                  this.bmList = [
                    {
                      value: [],
                      id: "",
                      index: 1
                    }
                  ];
                  this.reload();
                }
              });
            } else if (this.dtlsObje.hotType == 2) {
              //时间段热门
              let arr = JSON.parse(JSON.stringify(arrList));
              for (let i = 0; i < arr.length; i++) {
                let reg = new RegExp("-", "g");
                arr[i].startDate = arr[i].startDate.replace(reg, "");
                arr[i].endDate = arr[i].endDate.replace(reg, "");
              }
              var minTimes = [];
              var maxTimes = [];
              arr.map(v => {
                minTimes.push(v.startDate); //多段开始时间的数组 minTimes
              });
              arr.map(v => {
                maxTimes.push(v.endDate); //多段结束时间的数组 maxTimes
              });
              minTimes.sort();
              maxTimes.sort();
              let j = 0;
              for (let i = 0; i < minTimes.length; i++) {
                if (maxTimes[i] < minTimes[i + 1]) {
                  j = j;
                } else if (maxTimes[i] >= minTimes[i + 1]) {
                  j++;
                }
              }
              if (j == 0) {
                let params = {
                  page: {
                    pageNum: this.pageIndex,
                    pageSize: this.pageSize,
                    orderBy: ""
                  },
                  businessMark: this.dtlsObje.projectMode,
                  manageUrl: this.dtlsObje.otherUrl,
                  timeList: this.timeList,
                  hotCategory: this.dtlsObje.hotType * 1,
                  isThird:this.dtlsObje.other,
                  category: this.dtlsObje.options1,
                  id: this.dtlsObje.id,
                  enableMark: this.dtlsObje.enable_mark,
                  // h5Icon:this.uploadList[0].url,
                  h5Icon: this.html5Url,

                  h5Url: this.dtlsObje.h5Url,
                  h5IconName: this.dtlsObje.h5IconName,
                  hrAuth: this.dtlsObje.hrAuth,
                  mpUrl: this.dtlsObje.mpUrl,
                  projectCode: this.dtlsObje.mark,
                  projectName: this.dtlsObje.name,
                  realAuth: this.dtlsObje.realAuth,
                  specialAuth: this.dtlsObje.specialAuth,
                  // webIcon:this.uploadList1[0].url,
                  webIcon: this.computerUrl,

                  webUrl: this.dtlsObje.webUrl,
                  webIconName: this.dtlsObje.webIconName
                };
                editProject(params).then(res => {
                  if (res.datas > 0) {
                    this.ModalShow = false;
                    Message.success("修改成功");
                    this.imgUrl1 = "";
                    (this.imgUrl = ""),
                      (this.html5Url = ""),
                      (this.computerUrl = ""),
                      (this.timeList = [
                        {
                          startDate: "",
                          orderIndex: 1,
                          endDate: ""
                        }
                      ]);
                    this.bmList = [
                      {
                        value: [],
                        id: "",
                        index: 1
                      }
                    ];
                    this.reload();
                  }
                });
              } else {
                Message.error("热门时间段重合！");
              }
            }
          }
        }
      });
    },
    //文件上传成功时的钩子，返回字段为 response, file, fileList    移动端
    handleSuccess1(res, file) {
      // debugger;
      if (res.code == 10000) {
        this.imgUrl = process.env.fileUrl + res.datas[0].relativePath;
        this.html5Url = res.datas[0].relativePath;
        Message.success("上传成功!");
      } else {
        Message.error(res.msg);
      }
    },
    //文件上传成功时的钩子，返回字段为 response, file, fileList    PC端
    handleSuccess2(res, file) {
      // debugger;
      if (res.code == 10000) {
        this.imgUrl1 = process.env.fileUrl + res.datas[0].relativePath;
        this.computerUrl = res.datas[0].relativePath;
        Message.success("上传成功!");
      } else {
        Message.error(res.msg);
      }
    },
    //  文件类型错误回调
    handleFormatError(file) {
      Message.error("上传的图标类型应为png、jpg、jpeg的类型");
    },
    //删除
    deletes(id) {
      Modal.confirm({
        title: "删除",
        content: "<p>确定要删除？</p>",
        onOk: () => {
          let params = {
            page: {
              pageNum: this.pageIndex,
              pageSize: this.pageSize,
              orderBy: ""
            },
            id: id
          };
          deletetProject(params).then(res => {
            if (res.code == 10000) {
              Message.success("删除成功");
              this.reload();
            } else {
              Message.error(res.msg);
            }
          });
        }
      });
    },
    handleRemove(item, a) {
      let arr = [];
      for (let i = 0; i < this.timeList.length; i++) {
        if (this.timeList[i].deleteMark != 1) {
          arr.push(this.timeList[i]);
        }
      }
      if (this.timeList[item].timeUnitId) {
        if (arr.length == 1) {
          Message.error("最少要设置1个热门时间段！");
        } else {
          this.timeList[item].deleteMark = 1;
          this.num--;
          // this.bmList.splice(item,1);
          this.bmList[item].deleteMark = 1;
          for (let i = 0; i < this.bmList.length; i++) {
            if (this.bmList[i].index > item) {
              this.bmList[i].index--;
            }
          }
          this.$forceUpdate();
        }
      } else {
        if (arr.length == 1) {
          Message.error("最少要设置1个热门时间段！");
        } else {
          this.num--;
          this.bmList.splice(item, 1);
          this.timeList.splice(item, 1);
          for (let i = 0; i < this.bmList.length; i++) {
            if (this.bmList[i].index > item) {
              this.bmList[i].index--;
            }
          }
          for (let i = 0; i < this.timeList.length; i++) {
            if (this.timeList[i].orderIndex > item) {
              this.timeList[i].orderIndex--;
            }
          }
        }
      }
    },
    handleAdd() {
      // if(this.bmList.length == this.timeList.length) {
      this.num++;
      this.index = this.bmList.length;
      this.index++;
      if (this.bmList.length > 9) {
        Message.error("只支持设置10个热门时间段！");
      } else {
        this.bmList.push({
          value: "",
          id: "",
          index: this.index
        });
        this.timeList.push({
          startDate: "",
          endDate: "",
          orderIndex: this.index
        });
      }
      // }
      // else {
      //   Message.error("请先设置当前热门时间段的时间再进行添加操作！");
      // }
    },
    // getTime(item){
    //   if(item.length == 2) {
    //     let timeArea = {};
    //     timeArea.startDate = item[0];
    //     timeArea.endDate = item[1];
    //     timeArea.orderIndex = this.num;
    //     this.timeList.push(timeArea);
    //   }
    // },
    changeDateTime(item, index) {
      //  判断是否新增还是修改
      let time = item.value;
      let startDate =
        time[0].getFullYear() +
        "-" +
        this.p(time[0].getMonth() + 1) +
        "-" +
        this.p(time[0].getDate());
      let endDate =
        time[1].getFullYear() +
        "-" +
        this.p(time[1].getMonth() + 1) +
        "-" +
        this.p(time[1].getDate());
      this.timeList[index].startDate = startDate;
      this.timeList[index].endDate = endDate;
      this.timeList[index].orderIndex = index + 1;
      // //  新增弹框
      // if(this.active == '1'){
      //     let orderIndex = index + 1 ;
      //     let timeArea = {};
      //     timeArea.startDate = startDate;
      //     timeArea.endDate = endDate;
      //     timeArea.orderIndex = orderIndex;
      //     this.timeList.push(timeArea);
      // } else if(this.active == '2'){
      //   this.timeList[index].startDate = startDate;
      //   this.timeList[index].endDate = endDate;
      // }
    },
    // 时间数字不够10添加0
    p(s) {
      return s < 10 ? "0" + s : s;
    },
    onInsCategorySeachChange(node) {
      this.dtlsObje.projectMode = node.itemvalue1;
    }
  }
};
</script>