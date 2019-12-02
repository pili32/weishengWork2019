<template>
  <div style="height:100%;position:relative;">
    <span>辖区内全部村卫生室管理</span>
    <Button type="primary" icon="ios-refresh" @click="refresh">刷新</Button>|
    <Button type="primary" icon="md-add" @click="addPage('editValidate')">添加</Button>
    <div class="form_list" style="padding: 15px 0;">
      <Table border :columns="columns" :data="data" :loading="loading">
        <template slot-scope="{ row }" slot="roomName">
          <strong>{{ row.roomName }}</strong>
        </template>
        <template slot-scope="{ row }" slot="isOnselfManage">
          <span>{{ row.isOnselfManage?'是':'否' }}</span>
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
      width="750"
      class-name="vertical-center-modal"
    >
      <div slot="header" style="color:#333333;font-size:16px">
        <Icon type="md-hammer"></Icon>
        <span>编辑村卫生室信息</span>
      </div>
      <Form :model="editObje" ref="editValidate" :label-width="125" :rules="editValidate">
        <Row>
          <Col span="22">
            <FormItem label="名称：" prop="roomName">
              <Input v-model="editObje.roomName" placeholder="请输入名称" style='display:inline-block'/>
            </FormItem>
          </Col>
          <Col span="2">
            <span>村卫生室</span>
          </Col>
        </Row>
        <Row>
          <Col span="22">
            <FormItem label="所在村委会名称：" prop="villageCommittee">
              <Input v-model="editObje.villageCommittee" placeholder="请输入所在村委会名称" />
            </FormItem>
          </Col>
          <Col span="2">
            <span>村委会</span>
          </Col>
        </Row>
        <FormItem label="地址：" prop="address">
          <Input v-model="editObje.address" placeholder="请输入详细地址" />
        </FormItem>
        <FormItem label="工作人数：" prop="workersNumber">
          <Input type="number" v-model="editObje.workersNumber" placeholder="请输入工作人数" />
        </FormItem>
        <FormItem label="设置情况：" prop="establishCategory">
          <Select v-model="editObje.establishCategory" label-in-value>
            <Option
              v-for="item in EstablishCategory"
              :value="item.code"
              :key="item.code"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="行医方式：" prop="medicalMode">
          <Select v-model="editObje.medicalMode" label-in-value>
            <Option v-for="item in MedicalMode" :value="item.code" :key="item.code">{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="法人代表类别：" prop="legalPersonCategory">
          <Select v-model="editObje.legalPersonCategory" label-in-value>
            <Option
              v-for="item in LegalPersonCategory"
              :value="item.code"
              :key="item.code"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="单位负责人类别：" prop="unitHeadCategory">
          <Select v-model="editObje.unitHeadCategory" label-in-value>
            <Option
              v-for="item in UnitHeadCategory"
              :value="item.code"
              :key="item.code"
            >{{ item.name }}</Option>
          </Select>
        </FormItem>
        <FormItem label="服务人口数：" prop="serviceNumber">
          <Input v-model="editObje.serviceNumber" placeholder="请输入服务人口数" />
        </FormItem>
        <FormItem label="是否乡村卫生服务一体化管理：" prop="isOnselfManage" :label-width="210">
          <RadioGroup v-model="editObje.isOnselfManage">
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
          <Button type="primary" @click="ShowBaiduMap()">地图定位</Button>(可定位在本单位大门或主楼)
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
      <BaiduMap v-if='create' @CloseBaiduMap="CloseBaiduMap" :baidu_address="baiduForm.baidu_address"></BaiduMap>
      <Spin size="large" fix v-if="loading1" style='font-size:20px'>加载中...</Spin>
    </Modal>
  </div>
</template>
<script>
import {
  deleteRoom,
  editHealthRoom,
  queryRoomList,
  OptionList
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
      loading1:false,
      create:false,
      baiduForm:{
        baidu_address:''
      },
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
          slot: "roomName"
        },
        {
          title: "所在村委",
          key: "villageCommittee"
        },
        {
          title: "地址",
          key: "address"
        },
        {
          title: "工作人数",
          key: "serviceNumber"
        },
        {
          title: "服务人数",
          key: "serviceNumber"
        },
        {
          title: "是否乡村卫生服务一体化管理",
          slot: "isOnselfManage"
        }
      ],
      insId: this.$route.params.id,
      data: [],
      total: 0,
      pageIndex: 0,
      pageSize: 15,
      //主体编辑
      ModalShow: false,
      editObje: {},
      EstablishCategory: [], //设置情况
      MedicalMode: [], //行医方式
      LegalPersonCategory: [], //法人代表类别
      UnitHeadCategory: [], //单位负责人类别
      editValidate: {
        roomName: [{ required: true, message: "请输入名称", trigger: "blur" }],
        villageCommittee: [
          { required: true, message: "请输入所在村委会名称", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入地址信息", trigger: "blur" }
        ],
        workersNumber: [
          {
            required: true,
            message: "请输入工作人数",
            trigger: "blur",
            validator: validateSequence
          }
        ],
        establishCategory: [
          { required: true, message: "请选择设置情况", trigger: "change" }
        ],
        medicalMode: [
          { required: true, message: "请选择行医方式", trigger: "change" }
        ],
        legalPersonCategory: [
          { required: true, message: "请选择法人代表类别", trigger: "change" }
        ],
        unitHeadCategory: [
          { required: true, message: "请选择单位负责人类别", trigger: "change" }
        ],
        serviceNumber: [
          {
            required: true,
            message: "请输入服务人口数",
            trigger: "blur",
            validator: validateSequence
          }
        ],
        isOnselfManage: [
          {
            required: true,
            message: "是否乡村卫生服务一体化管理",
            trigger: "change"
          }
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
    OptionList().then(res => {
      if (res.code == 10000) {
        this.EstablishCategory = res.datas.EstablishCategory;
        this.MedicalMode = res.datas.MedicalMode;
        this.UnitHeadCategory = res.datas.LegalPersonCategory;
        this.LegalPersonCategory = res.datas.LegalPersonCategory;
      }
    });
    // // this.getDictionaries("MedicalInstitution-EstablishCategory").then((res)=>{
    // //     if(res.data.code==40000){
    // //         this.EstablishCategory=dataItemHandle(res);
    // //     }
    // // });
    // this.getDictionaries("MedicalInstitution-MedicalMode").then((res)=>{
    //     if(res.data.code==40000){
    //         this.MedicalMode=dataItemHandle(res);
    //     }
    // });
    // this.getDictionaries("MedicalInstitution-LegalPersonCategory").then((res)=>{
    //     if(res.data.code==40000){
    //         this.LegalPersonCategory=dataItemHandle(res);
    //     }
    // });
    //  this.getDictionaries("MedicalInstitution-UnitHeadCategory").then((res)=>{
    //     if(res.data.code==40000){
    //         this.UnitHeadCategory=dataItemHandle(res);
    //     }
    // });
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
      // this.getRequest("cwss/list", urlPath(params)).then(res => {
      //     if(res.data.data){
      //         this.total = res.data.data.total_count;
      //         let resData = res.data.data.items;
      //         if (resData) {
      //             this.data = resData;
      //         }
      //     }
      //     this.loading = false;
      // });
      queryRoomList(params).then(res => {
        if (res.code == 10000) {
          this.total = res.total;
          this.data = res.datas;
        } else {
          Message.error(datas.msg);
        }
        this.loading = false;
      });
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
      this.editObje = {
        id: row.id,
        ins_id: row.insId,
        roomName: row.roomName.replace("村卫生室", ""),
        category_key: row.category_key,
        category_value: row.category_value,
        villageCommittee: row.villageCommittee.replace("村委会", ""),
        address: row.address,
        workersNumber: row.workNumber,
        establishCategory: row.establish.code,
        medicalMode: row.medicalMode.code,
        serviceNumber: row.serviceNumber,
        legalPersonCategory: row.legalPerson.code,
        unitHeadCategory: row.unitHead.code,
        baidu_address_jd: row.longitude,
        baidu_address_wd: row.latitude
      };
      if(this.editObje.baidu_address_jd && this.editObje.baidu_address_wd) {
        this.baiduForm.baidu_address = this.editObje.baidu_address_jd +"," + this.editObje.baidu_address_wd
      };
      this.editObje.isOnselfManage = row.isOnselfManage ? "1" : "0";
      if (row.baidu_address) {
        let baidu_address_array = row.baidu_address.split(",");
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
          deleteRoom(params).then(res => {
            if (res.code == 10000) {
              Message.success("删除成功!");
              this.reload();
            } else {
              Message.error(res.data.message);
            }
          });
        }
      });
    },
    //新增按钮点击事件
    addPage(roomName) {
      this.$refs["editValidate"].resetFields();
      this.editObje = {};
      this.editObje.isOnselfManage = "0";
      this.ModalShow = true;
    },
    cancleSubmit(roomName) {
      this.ModalShow = false;
    },
    createExt(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          this.editObje.roomName = this.editObje.roomName
            .replace(" ", "")
            .replace("村卫生室", "")
            .replace("卫生室", "");
          this.editObje.roomName += "村卫生室";
          this.editObje.villageCommittee = this.editObje.villageCommittee
            .replace(" ", "")
            .replace("村委会", "");
          this.editObje.villageCommittee += "村委会";
          let params = {
            id: this.editObje.id,
            insId: this.insId,
            roomName: this.editObje.roomName,
            category_key: this.editObje.category_key,
            category_value: this.editObje.category_value,
            villageCommittee: this.editObje.villageCommittee,
            address: this.editObje.address,
            workersNumber: parseInt(this.editObje.workersNumber), //int
            establishCategory: this.editObje.establishCategory,
            medicalMode: this.editObje.medicalMode,
            legalPersonCategory: this.editObje.legalPersonCategory,
            unitHeadCategory: this.editObje.unitHeadCategory,
            serviceNumber: parseInt(this.editObje.serviceNumber), //int
            isOnselfManage: this.editObje.isOnselfManage == "1" ? 1 : 0,
            longitude: this.editObje.baidu_address_wd,
            latitude: this.editObje.baidu_address_jd
          };
          if (this.editObje.id) {
            this.UpData(params);
          } else {
            this.PostData(params);
          }
        }
      });
    },
    UpData(params) {
      editHealthRoom(params).then(res => {
        if (res.code == 10000) {
          this.ModalShow = false;
          Message.success("保存成功!");
          this.reload();
        } else {
          Message.error(res.data.msg);
        }
      });
    },
    PostData(params) {
      editHealthRoom(params).then(res => {
        if (res.code == 10000) {
          this.ModalShow = false;
          Message.success("保存成功!");
          this.reload();
        } else {
          Message.error(res.data.message);
        }
      });
    },
    ShowBaiduMap() {
      this.loading1 = true;
      this.create = true;
      this.BaiduMapModalShow = true;
      setTimeout(()=>{
        this.loading1 = false;
      },2000)
    },
    CloseBaiduMap(data) {
      this.BaiduMapModalShow = false;
      this.editObje.baidu_address_jd = data.lng;
      this.editObje.baidu_address_wd = data.lat;
    },
    CategoryChange(res) {
      if (res != undefined) {
        this.editObje.category_value = res.label;
      }
    },
    refresh() {
      this.reload();
    }
  }
};
</script>