<template>
  <div style="height:100%;position:relative;">
    <span>辖区内全部社区卫生服务站管理</span>
    <Button type="primary" icon="ios-refresh" @click="refresh">刷新</Button>|
    <Button type="primary" icon="md-add" @click="addPage">添加</Button>
    <div class="form_list" style="padding: 15px 0;">
      <Table border :columns="columns" :data="data" :loading="loading">
        <template slot-scope="{ row }" slot="stationName">
          <strong>{{ row.stationName }}</strong>
        </template>
        <template slot-scope="{ row }" slot="isCurunitEstablish">
          <span>{{ row.isCurunitEstablish?'是':'否' }}</span>
        </template>
        <template slot-scope="{ row }" slot="isOnselfManage">
          <span>{{ row.isOnselfManage?'是':'否' }}</span>
        </template>
        <template slot-scope="{ row }" slot="isIndependentLegalPerson">
          <span>{{ row.isIndependentLegalPerson?'是':'否' }}</span>
        </template>
        <template slot-scope="{row,index}" slot="action">
          <a @click="edit(row)">编辑</a>
          <a @click="deletes(row.id)">删除</a>
        </template>
      </Table>
    </div>
    <div style="position:absolute;left:0;">
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

    <!--对话框-->
    <Modal
      v-model="ModalShow"
      :mask-closable="false"
      width="650"
      class-name="vertical-center-modal"
    >
      <div slot="header" style="color:#333333;font-size:16px">
        <Icon type="md-hammer"></Icon>
        <span>{{Title}}</span>
      </div>
      <Form :model="editObje" ref="editValidate" :label-width="125" :rules="editValidate">
        <Row>
          <Col span="20">
            <FormItem label="名称：" prop="stationName">
              <Input v-model="editObje.stationName" placeholder="请输入名称" />
            </FormItem>
          </Col>
          <!-- <Col span="4">
                        <span>社区卫生服务站</span>
          </Col>-->
        </Row>
        <FormItem label="地址：" prop="address">
          <Input v-model="editObje.address" placeholder="请输入详细地址" />
        </FormItem>
        <FormItem label="是否本单位设立：" prop="isCurunitEstablish">
          <RadioGroup v-model="editObje.isCurunitEstablish">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="站内工作人数：" prop="workersNumber">
          <Input type="number" v-model="editObje.workersNumber" placeholder="请输入工作人数" />
        </FormItem>
        <FormItem label="是否一体化管理：" prop="isOnselfManage">
          <RadioGroup v-model="editObje.isOnselfManage">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="是否独立法人：" prop="isIndependentLegalPerson">
          <RadioGroup v-model="editObje.isIndependentLegalPerson">
            <Radio label="1">是</Radio>
            <Radio label="0">否</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="地理位置：">
          <span>经度</span>
          <Input
            v-model="editObje.baidu_address_jd"
            placeholder="请输入经度"
            style="width:130px"
            readonly
          />
          <span>纬度</span>
          <Input
            v-model="editObje.baidu_address_wd"
            placeholder="请输入纬度"
            style="width:130px"
            readonly
          />
          <Button type="primary" @click="ShowBaiduMap()">地图定位</Button>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button size="large" @click="cancleSubmit()">取消</Button>
        <Button type="primary" size="large" @click="createExt('editValidate')">确定</Button>
      </div>
    </Modal>

    <!--弹框--百度地图-->
    <Modal
      v-model="BaiduMapModalShow"
      :mask-closable="false"
      width="1100"
      class-name="vertical-center-modal"
      footer-hide
    >
      <p slot="header" style="color:#333333;font-size:16px">
        <span>地图定位</span>
      </p>
      <BaiduMap @CloseBaiduMap="CloseBaiduMap"></BaiduMap>
    </Modal>
  </div>
</template>
<script>
import {
  addStation,
  deleteStation,
  queryStationList
} from "@/service/insSubManageDtl";
import {
  getAccessToken,
  urlPath,
  dataItemHandle,
  validateSequence,
  getUserInfo
} from "@/libs/util";
import { Modal, Message } from "iview";
import BaiduMap from "@/view/insInfoManage/addressInfo/BMapComponent.vue";

export default {
  data() {
    return {
      loading: false,
      BaiduMapModalShow: false,
      columns: [
        {
          title: "操作",
          slot: "action",
          width: 150,
          align: "center"
        },
        {
          title: "名称",
          slot: "stationName"
        },
        {
          title: "地址",
          key: "address"
        },
        {
          title: "人数",
          key: "workersNumber"
        },
        {
          title: "本单位设立",
          slot: "isCurunitEstablish"
        },
        {
          title: "一体化管理",
          slot: "isOnselfManage"
        },
        {
          title: "独立法人",
          slot: "isIndependentLegalPerson"
        }
      ],
      insId: this.$route.params.id,
      data: [],
      total: 0,
      pageIndex: 0,
      pageSize: 15,
      //主体编辑
      ModalShow: false,
      Title: "编辑",
      editObje: {},
      editValidate: {
        stationName: [
          { required: true, message: "请输入名称", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入地址信息", trigger: "blur" }
        ],
        isCurunitEstablish: [
          { required: true, message: "请是否本单位设立", trigger: "blur" }
        ],
        workersNumber: [
          {
            required: true,
            message: "站内工作人数",
            trigger: "blur",
            validator: validateSequence
          }
        ],
        isOnselfManage: [
          { required: true, message: "是否一体化管理", trigger: "blur" }
        ],
        isIndependentLegalPerson: [
          { required: true, message: "是否独立法人", trigger: "blur" }
        ]
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
      this.userNew = this.objs;
      if (!this.insId) this.insId = this.userNew.insId;
      this.pageSizeOps = [15, 30, 50, 100];
      this.reload({
        ins_id: this.insId,
        page_index: this.pageIndex,
        page_size: this.pageSize
      });
    }
  },
  created() {
    // let userNew = getUserInfo();
    this.userNew = this.objs;
    if (!this.insId) this.insId = this.userNew.insId;
    this.pageSizeOps = [15, 30, 50, 100];
    this.reload({
      ins_id: this.insId,
      page_index: this.pageIndex,
      page_size: this.pageSize
    });
  },
  components: {
    BaiduMap
  },
  methods: {
    reload(obj) {
      this.loading = true;
      let params = {
        page: {
          pageNum: this.pageIndex,
          pageSize: this.pageSize
        },
        insId: this.insId
      };
      queryStationList(params).then(res => {
        if (res.code == 10000) {
          this.data = res.datas;
          this.total = res.total;
        } else {
          Message.error(datas.msg);
        }
        this.loading = false;
      });
      // this.getRequest("sqfwz/list", urlPath(params)).then(res => {
      //     if(res.data.data){
      //         this.total = res.data.data.total_count;
      //         var resData = res.data.data.items;
      //         if (resData) {
      //             this.data = resData;
      //         }
      //     }
      //     this.loading = false;
      // });
    },
    onPageChange(num) {
      this.pageIndex = num;
      this.reload({
        ins_id: this.insId,
        page_index: this.pageIndex,
        page_size: this.pageSize
      });
    },
    onPageSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.reload({
        ins_id: this.insId,
        page_index: this.pageIndex,
        page_size: this.pageSize
      });
    },
    //编辑
    edit(row) {
      this.$refs["editValidate"].resetFields();
      this.Title = row.stationName + "信息编辑";
      this.editObje = {
        id: row.id,
        ins_id: row.insId,
        stationName: row.stationName,
        category_key: row.category_key,
        category_value: row.category_value,
        address: row.address,
        workersNumber: row.workersNumber,
        isCurunitEstablish: row.isCurunitEstablish ? "1" : "0",
        isOnselfManage: row.isOnselfManage ? "1" : "0",
        isIndependentLegalPerson: row.isIndependentLegalPerson ? "1" : "0",
        baidu_address: row.baidu_address,
        baidu_address_jd: row.latitude,
        baidu_address_wd: row.longitude
      };
      if (row.baidu_address) {
        var baidu_address_array = row.baidu_address.split(",");
        this.editObje.baidu_address_jd = baidu_address_array[0];
        this.editObje.baidu_address_wd = baidu_address_array[1];
      }
      this.ModalShow = true;
    },
    //删除
    deletes(id) {
      Modal.confirm({
        title: "删除",
        content: "<p>确定要删除？</p>",
        onOk: () => {
          let params = {
            id: id
          };
          deleteStation(params).then(res => {
            if (res.code == 10000) {
              Message.success("删除成功!");
              this.reload();
            } else {
              Message.error(res.data.msg);
            }
          });
        }
      });
    },
    //新增按钮点击事件
    addPage() {
      this.$refs["editValidate"].resetFields();
      this.Title = "新增社区卫生服务站";
      this.editObje = {};
      this.editObje.isCurunitEstablish = "0";
      this.editObje.isOnselfManage = "0";
      this.editObje.isIndependentLegalPerson = "0";
      this.ModalShow = true;
    },
    cancleSubmit(stationName) {
      this.ModalShow = false;
    },
    createExt(stationName) {
      this.$refs[stationName].validate(valid => {
        if (valid) {
          if (this.editObje.baidu_address_jd && this.editObje.baidu_address_wd)
            this.editObje.baidu_address =
              this.editObje.baidu_address_jd +
              "," +
              this.editObje.baidu_address_wd;
          this.editObje.stationName = this.editObje.stationName
            .replace(" ", "")
            .replace("社区卫生服务站", " ")
            .replace("服务站", " ");
          this.editObje.stationName += "社区卫生服务站";
          let params = {
            id: this.editObje.id,
            insId: this.insId,
            stationName: this.editObje.stationName,
            // category_key:this.editObje.category_key,
            // category_value:this.editObje.category_value,
            address: this.editObje.address,
            workersNumber: parseInt(this.editObje.workersNumber),
            isCurunitEstablish:
              this.editObje.isCurunitEstablish == "1" ? "1" : "0",
            isOnselfManage: this.editObje.isOnselfManage == "1" ? "1" : "0",
            isIndependentLegalPerson:
              this.editObje.isIndependentLegalPerson == "1" ? "1" : "0",
            latitude: this.editObje.baidu_address_jd,
            longitude: this.editObje.baidu_address_wd
            // baidu_address:this.editObje.baidu_address?this.editObje.baidu_address:''
          };
          if (this.editObje.id) {
            this.UpData(params);
          } else {
            this.PostData(params);
          }
        }
      });
    },
    UpData(param) {
      //更新数据
      addStation(param).then(res => {
        if (res.code == 10000) {
          if (res.code == 10000) {
            this.ModalShow = false;
            Message.success("保存成功!");
            this.reload();
          } else {
            Message.error(res.data.message);
          }
        }
      });
    },
    PostData(param) {
      //写入数据
      addStation(param).then(res => {
        if (res.code == 10000) {
          this.ModalShow = false;
          Message.success("保存成功!");
          this.reload();
        } else {
          Message.error(data.data.message);
        }
      });
    },
    ShowBaiduMap() {
      this.BaiduMapModalShow = true;
    },
    CloseBaiduMap(data) {
      this.BaiduMapModalShow = false;
      this.editObje.baidu_address_jd = data.lng;
      this.editObje.baidu_address_wd = data.lat;
    },
    refresh() {
      this.reload();
    }
  }
};
</script>