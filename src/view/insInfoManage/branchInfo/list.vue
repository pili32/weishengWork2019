<template>
  <div>
    <Button type="primary" icon="ios-refresh" @click="refresh">刷新</Button>|
    <Button type="primary" icon="md-add" @click="addPage">添加</Button>
    <div class="form_list" style="padding: 15px 0;">
      <Table border :columns="columns" :data="data" :loading="loading">
        <template slot-scope="{ row }" slot="branchName">
          <strong>{{ row.branchName }}</strong>
        </template>
        <template slot-scope="{row}" slot="branchType">
      <span
        v-for="(item,index) in category"
        :key="index"
        v-if="item.code==row.branchTypeCode"
      >{{ item.name }}</span>
    </template>
        <template slot-scope="{row}" slot="action">
          <div class="action-btn">
            <a @click="edit(row)">编辑</a>
            <a @click="deletes(row.branchId)">删除</a>
          </div>
        </template>
      </Table>
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
        style="display:none;"
      />
    </div>

    <!--对话框-->
    <Modal
      v-model="ModalShow"
      :mask-closable="false"
      width="800"
      class-name="vertical-center-modal"
    >
      <div slot="header" style="color:#333333;font-size:16px">
        <Icon type="md-hammer"></Icon>
        <span>{{Title}}</span>
      </div>
      <Form :model="editObje" ref="editValidate" :label-width="90" :rules="editValidate">
        <Row :gutter="25" style="margin-top: 10px;">
          <Col :md="12">
            <FormItem label="名称：" prop="branchName">
              <Input v-model="editObje.branchName" />
            </FormItem>
          </Col>
          <Col :md="12">
            <FormItem label="类型： "  prop="category_key">
              <Select v-model="editObje.category_key" label-in-value @on-change="CategoryChange">
                <Option
                  v-for="(item ,index) in category" 
                  :value="item.code"
                  :key="index"
                >{{ item.name }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="25">
          <Col :md="24">
            <FormItem label="所在地区：" prop="selCity">
              <span>湖北省</span>
              <Select
                v-model="editObje.selCity"
                style="width:150px;padding-left:10px;"
                @on-change="cityChange"
              >
                <Option
                  v-for="(item,index) in queryCityList"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</Option>
              </Select>
              <Select v-model="editObje.selArea" style="width:150px" @on-change="areaChange">
                <Option
                  v-for="(item,index) in queryAreaList"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</Option>
              </Select>
              <Select v-model="editObje.selRoad" style="width:150px">
                <Option
                  v-for="item in queryRegionList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="25">
          <Col :md="24">
            <FormItem label="详细地址：" prop="branchAddr">
              <Input v-model="editObje.branchAddr" placeholder="请输入详细地址" />
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="25">
          <Col :md="24">
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
              <Button  type="primary" @click="ShowBaiduMap()">地图定位</Button>(可定位在本单位大门或主楼)
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="25">
          <Col :md="12">
            <FormItem label="邮政编码：" prop="zipCode">
              <Input
                type="number"
                v-model="editObje.zipCode"
                placeholder="请输入邮政编码"
                style="width:200px"
              />
            </FormItem>
          </Col>
          <Col :md="12">
            <FormItem label="排序：" prop="orderIndex">
              <Input type="number" v-model="editObje.orderIndex" style="width:200px" />
            </FormItem>
          </Col>
        </Row>
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
      <BaiduMap   v-if='create' @CloseBaiduMap="CloseBaiduMap" :baidu_address="baidu_address"></BaiduMap>
      <Spin size="large" fix v-if="loading1" style='font-size:20px'>加载中...</Spin>
    </Modal>
  </div>
</template>
<script>
import {
  addBranch,
  querySubInsAddr,
  branchTypeOption,
  editBranch,
  deleteBranch,
  deleteBranches
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
import CityList from "@/libs/hb-qc-lv4.json";

export default {
  data() {
    return {
      loading: false,
      labels: "",
      queryCityList: [],
      queryAreaList: [],
      queryRegionList: [],
      create:false,
      musicTypeJSON: [],
      BaiduMapModalShow: false,
      baidu_address: "",
      columns: [
        {
          title: "操作",
          slot: "action",
          width: 150,
          align: "center"
        },
        {
          title: "名称",
          slot: "branchName"
        },
        {
          title: "类型",
          // key: "branchType"
          slot: "branchType"

        },
        {
          title: "地址",
          key: "branchAddr"
        },
        {
          title: "排序",
          key: "orderIndex"
        }
      ],
      insId: this.$route.params.id,
      data: [],
      total: 0,
      pageIndex: 0,
      pageSize: 15,
      loading1:false,
      //主体编辑
      Title: "编辑",
      ModalShow: false,
      editObje: {},
      category: [],
      editValidate: {
        branchName: [{ required: true, message: "请输入名称", trigger: "blur" }],
        category_key: [
          { required: true, message: "请选择类别", trigger: "blur" }
        ],
        selCity: [
          {
            required: true,
            message: "请依次选择市区（县/乡）以及街道（镇）",
            trigger: "change"
          }
        ],
        branchAddr: [
          { required: true, message: "请输入详细地址", trigger: "blur" }
        ],
        
          zipCode: [
          { required: true, message: "请输入邮政编码", trigger: "blur" }
        ],
        orderIndex: [
          {
            required: true,
            message: "请输入排序",
            trigger: "blur",
            validator: validateSequence
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
      // this.getDetaItemCategory("InstitutionBranchCategory");
      this.musicTypeJSON = CityList;
      this.getCityDate();
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
    // this.getDetaItemCategory("InstitutionBranchCategory");
    this.musicTypeJSON = CityList;
    this.getCityDate();
  },
  components: {
    BaiduMap,
    CityList
  },
  methods: {
    reload(obj) {
      this.loading = true;
      let params = {
        insId: this.insId,
        page_index: this.pageIndex,
        page_size: 9999
      };
      querySubInsAddr(params)
      branchTypeOption().then(res => {
        this.category = res.datas;
      });
      // this.getRequest("ins_branch/list", urlPath(params)).then(res => {
      //   if (res.data.data) {
      //     this.total = res.data.data.total_count;
      //     let resData = res.data.data.items;
      //     if (resData) {
      //       resData = resData.filter(e => {
      //         return e.category_key != "" && e.category_key.indexOf("20") == 0;
      //       });
      //       this.data = resData;
      //     }
      //   }
      //   this.loading = false;
      // });
      // let params = {
      //   insId : this.insId
      // }
    querySubInsAddr(params).then(res => {
        if (res.code == 10000) {
          this.data = res.datas.branchInfo.branchList;
           let baidu_address=[]
         this.baidu_address = res.datas.address.longitude+","+res.datas.address.latitude
        } else {
          Message.error(res.datas.msg);
        }
      });
      this.loading = false;
    },
    //地址信息类型
    getDetaItemCategory(code) {
      this.getDictionaries(code).then(res => {
        if (res.data.code == 40000) {
          let dataitem_dtls = res.data.data.data_item_dtls;
          if (dataitem_dtls) {
            dataitem_dtls = dataitem_dtls.filter(function(e) {
              return e.itemvalue1.indexOf("20") >= 0 && e.itemvalue1 != 20;
            });
            this.category = dataitem_dtls;
          }
        }
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
      this.Title = row.branchName + "信息编辑";
      this.$refs["editValidate"].resetFields();
      this.baiduAddr = row.baiduAddr
      this.editObje = {
        id: row.branchId,
        ins_id: row.insId,
        branchName: row.branchName,
        category_key: row.branchType,
        branchAddr: row.branchAddr,
        baidu_address: row.baidu_address,
        zipCode: row.zipCode,
        orderIndex: row.orderIndex
      };
    if(row.branchType){
      for(var i=0;i<this.category.length;i++){
        if(this.category[i].name==row.branchType){
           this.editObje .  category_key = this.category[i].code
        } 
      }
    }
      if (row.branchAddr) {
        let addressArray = row.branchAddr.split(",");
        this.editObje.selCity = addressArray[1];
        this.editObje.selArea = addressArray[2];
        this.editObje.selRoad = addressArray[3];
        this.editObje.branchAddr = addressArray[4];
        if (this.editObje.selCity) {
          this.BindCity(this.editObje.selCity);
        }
        if (this.editObje.selArea) {
          this.BindArea(this.editObje.selArea);
        }
      }
      if (row.baiduAddr) {
        this.baidu_address = row.baiduAddr;
        let baidu_address_array = row.baiduAddr.split(",");
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
            branchId: id
          };
          deleteBranch(params).then(res => {
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
      this.Title = "新增分院（所、站）信息";
      this.editObje = {};
      this.editObje.orderIndex = 0;
      this.ModalShow = true;
    },
    cancleSubmit(branchName) {
      this.ModalShow = false;
    },
    createExt(branchName) {
      this.$refs[branchName].validate(valid => {
        if (valid) {
          if (this.editObje.baidu_address_jd && this.editObje.baidu_address_wd)
            this.baidu_address =
              this.editObje.baidu_address_jd +
              "," +
              this.editObje.baidu_address_wd;
            var regStr="^[0-9]{6}$"; 
            var re=new RegExp(regStr); 
            if(re.test(this.editObje.zipCode)){ 
            let params = {
            branchId: this.editObje.id,
            insId: this.insId,
            branchName: this.editObje.branchName,
            code: this.editObje.category_key,
            branchType: this.editObje.branchType,
            // branchAddr:
            //   "湖北省," +
            //   this.editObje.selCity +
            //   "," +
            //   this.editObje.selArea +
            //   "," +
            //   this.editObje.selRoad +
            //   "," +
            //   this.editObje.branchAddr,
            province: "湖北省",
            //市
            city: this.editObje.selCity,
            //区
            district: this.editObje.selArea,
            //县
            street:  this.editObje.selRoad,
           
            addr:this.editObje.branchAddr,
            name: this.labels,
            // baidu_address: this.baidu_address,
            latitude: this.editObje.baidu_address_wd,
            longitude: this.editObje.baidu_address_jd,

            zipCode: this.editObje.zipCode,
            orderIndex: this.editObje.orderIndex
          };
          if (this.editObje.id) {
            editBranch(params).then(res => {
              if (res.code == 10000) {
                this.ModalShow = false;
                Message.success("保存成功!");
              this.reload();

              } else {
                Message.error(res.data.msg);
              }
            });
           } else {
            // this.PostData("ins_branch", params);
            addBranch(params).then(res => {
              if (res.code == 10000) {
                this.ModalShow = false;
                Message.success("保存成功!");
              this.reload();

              } else {
                Message.error(res.data.msg);
              }
            });
          }
          
          } else{
               Message.error("邮政编码输入不合法！正确格式如450000!"); 
          }
       
        } else {
          Message.error("验证失败！");
        }
      });
    },
    UpData(url, param) {
      //更新数据
      this.putRequest(url, param).then(res => {
        if (res.data.code == 40000) {
          this.ModalShow = false;
          Message.success("保存成功!");
          this.reload();
        } else {
          Message.error(res.data.msg);
        }
      });
    },
    PostData(url, param) {
      //写入数据
      this.postRequest(url, param).then(res => {
        if (res.data.code == 40000) {
          this.ModalShow = false;
          Message.success("保存成功!");
          this.reload();
        } else {
          Message.error(res.data.msg);
        }
      });
    },
    ShowBaiduMap() {
      this.loading1 = true;
      this.create = true;
      this.BaiduMapModalShow =true
      setTimeout(()=>{
        this.loading1 = false;
      },2000)
    },
    CloseBaiduMap(data) {
      this.BaiduMapModalShow = false;
      this.editObje.baidu_address_jd = data.lng;
      this.editObje.baidu_address_wd = data.lat;
    },
    getCityDate() {
      let array = this.musicTypeJSON.list;
      for (let p in array) {
        array[p].label = array[p].name;
        array[p].value = array[p].name;
      }
      this.queryCityList = array;
    },
    BindCity(index) {
      let array = this.ForEachJson(this.queryCityList, index);
      for (let p in array) {
        array[p].label = array[p].name;
        array[p].value = array[p].name;
      }
      this.queryAreaList = array;
      this.BindArea(array[0].value);
    },
    BindArea(index) {
      let AreaArray = this.ForEachJson(this.queryAreaList, index);
      for (let p in AreaArray) {
        AreaArray[p].label = AreaArray[p].name;
        AreaArray[p].value = AreaArray[p].name;
      }
      this.queryRegionList = AreaArray;
    },
    cityChange(res) {
      if (res != undefined) {
        this.BindCity(res);
      }
    },
    areaChange(res) {
      if (res != undefined) {
        this.BindArea(res);
      }
    },
    CategoryChange(res) {
      this.labels = res.label;
      if (res != undefined) {
        this.editObje.branchType = res.value;
      }
    },
    ForEachJson(cityjson, name) {
      let array = [];
      for (let i = 0; i < cityjson.length; i++) {
        if (cityjson[i].value == name) {
          array = cityjson[i].list;
          break;
        }
      }
      return array;
    },
    refresh() {
      this.reload();
    }
  }
};
</script>

