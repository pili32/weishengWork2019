<template>
  <Form :model="formItemIns" ref="formItemIns" :label-width="200" :rules="ruleValidate">
    <div>
      <div class="border_line">
        <span class="border_line_txt">主/本院（所、站）地址</span>
        <Row :gutter="25" style="margin-top: 10px;">
          <Col :md="24" :lg="20">
            <FormItem label="详细地址：" prop="Address">
              <span>湖北省</span>
              <Select
                v-model="formItemIns.selCity"
                style="width:150px;padding-left:10px;"
                @on-change="cityChange"
              >
                <Option
                  v-for="(item,index) in queryCityList"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</Option>
              </Select>
              <Select v-model="formItemIns.selArea" style="width:150px" @on-change="areaChange">
                <Option
                  v-for="(item,index) in queryAreaList"
                  :key="index"
                  :value="item.value"
                >{{ item.label }}</Option>
              </Select>
              <Select v-model="formItemIns.selRoad" style="width:150px">
                <Option
                  v-for="item in queryRegionList"
                  :value="item.value"
                  :key="item.value"
                >{{ item.label }}</Option>
              </Select>
              <Input v-model="formItemIns.Address" placeholder="请输入详细地址" style="width:200px" />(详细社区/村组及门牌)
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="25">
          <Col :md="12" :lg="5">
            <FormItem label="邮政编码：" prop="zipCode">
              <Input
                type="number"
                v-model="formItemIns.zipCode"
                placeholder="请输入邮政编码"
                style="width:200px"
              />
            </FormItem>
          </Col>
          <Col :md="12" :lg="15">
            <FormItem label="地理位置：">
              <span>经度</span>
              <Input
                v-model="formItemIns.baiduAddress_jd"
                placeholder="请输入经度"
                style="width:130px"
                readonly
              />
              <span>纬度</span>
              <Input
                v-model="formItemIns.baiduAddress_wd"
                placeholder="请输入纬度"
                style="width:130px"
                readonly
              />
              <Button type="primary" @click="ShowBaiduMap()">地图定位</Button>(可定位在本单位大门或主楼)
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="25">
          <Col :md="24" :lg="14" style="text-align:center;">
            <FormItem>
              <Button type="primary" @click="SubmitAddress('formItemIns')">保存</Button>
            </FormItem>
          </Col>
        </Row>
      </div>
      <div class="border_line">
        <span class="border_line_txt">分院（所、站）信息</span>
        <Row :gutter="25" style="margin-top: 10px;">
          <Col :md="24" :lg="20">
            <FormItem>
              <Checkbox @on-change="chkChang" v-model="boolVale">无分院（所、站）信息</Checkbox>
              <p style="color:red;">
                填报说明：分院（站、所）是由主体单位直接设立，承担相同的对外服务职能，但非独立法人单位，
                其工作人员人事关系由主体单位管理。例如：华中科技大学同济医学院附属同济医院“光谷院区”、“中法新城院区”；
                武汉大学口腔医学“汉街门诊部”、“和平大道门诊部”；湖北省中西医结合医院的“汉兴街第二社区卫生服务中心”。
                乡镇卫生院、社区卫生服务中心主办设立的村卫生室、社区卫生服务站不做分院填报。
              </p>
            </FormItem>
          </Col>
        </Row>
        <Row :gutter="25" style="margin:5px;">
          <Col :md="24">
            <BranchList></BranchList>
          </Col>
        </Row>
      </div>
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
        <BaiduMap v-if='create'  @CloseBaiduMap="CloseBaiduMap" :baidu_address="formItemIns.baiduAddress"></BaiduMap>
      <Spin size="large" fix v-if="loading1" style='font-size:20px'>加载中...</Spin>

      </Modal>
    </div>
  </Form>
</template>
<style scoped>
.border_line {
  width: 100%;
  border: 1px solid #dddddd;
  position: relative;
  margin-top: 10px;
}
.border_line_txt {
  position: absolute;
  left: 10px;
  top: -12px;
  height: 25px;
  line-height: 25px;
  padding: 0 7px;
  background: #f5f7f9;
  font-size: 12px;
  color: #000000;
}
.btnhandleAdd {
  width: 100px;
  font-size: 14px;
  color: #464c5b;
}
</style>
<script>
import { querySubInsAddr, editSubInsAddr ,deleteBranches} from "@/service/insSubManageDtl";
import { getAccessToken, urlPath, getUserInfo } from "@/libs/util";
import { Modal, Message } from "iview";
import BaiduMap from "@/view/insInfoManage/addressInfo/BMapComponent.vue";
import CityList from "@/libs/hb-qc-lv4.json";
import BranchList from "@/view/insInfoManage/branchInfo/list.vue";
export default {
  data() {
    return {
      insId: this.$route.params.id,
      boolVale: false,
      BaiduMapModalShow: false,
      loading1:false,
      queryCityList: [],
      queryAreaList: [],
      queryRegionList: [],
      create:false,
      musicTypeJSON: [],
      formItemIns: {
        id: "",
        selCity: "",
        selArea: "",
        selRoad: "",
        Address: "",
        zipCode: "",
        baiduAddress_jd: "",
        baiduAddress_wd: ""
      },
      ruleValidate: {
        Address: [
          { required: true, message: "详细地址不能为空！", trigger: "blur" }
        ],
        zipCode: [
          { required: true, message: "邮政编码不能为空！", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    BaiduMap,
    CityList,
    BranchList
  },
  computed:{
    objs(){
      return this.$store.state.user.userInfo
    }
  },
  watch:{
    objs(){
      this.userNew = this.objs
      if (!this.insId) this.insId = this.userNew.insId
      this.musicTypeJSON = CityList
      this.getCityDate(() => {
        this.getMainFrom()
      })
    }
  },
  created() {
    // let userNew = getUserInfo();
    this.userNew = this.objs;
    if (!this.insId) this.insId = this.userNew.insId;
    this.musicTypeJSON = CityList;
    this.getCityDate(() => {
      this.getMainFrom();
    });
  },
  methods: {
    getMainFrom(url) {
      // this.getRequest("ins_branch/list",urlPath({insId:this.insId})).then((res)=>{
      //     if(res.data.data){
      //         let resData = res.data.data.items;
      //         resData = resData.filter(e => {
      //             return e.category_key !='' && e.category_key.indexOf("10") == 0;
      //         });
      //         if(resData.length>0){
      //             this.formItemIns=resData[0];
      //             if(resData[0].address){
      //                 var addressArray=resData[0].address.split(',');
      //                 this.formItemIns.selCity=addressArray[1];
      //                 this.formItemIns.selArea=addressArray[2];
      //                 this.formItemIns.selRoad=addressArray[3];
      //                 this.formItemIns.Address=addressArray[4];
      //                 if(this.formItemIns.selCity){
      //                     this.BindCity(this.formItemIns.selCity);
      //                 }
      //                 if(this.formItemIns.selArea){
      //                     this.BindArea(this.formItemIns.selArea);
      //                 }
      //             }
      //             if(resData[0].baiduAddress){
      //                 var baiduAddress_array=resData[0].baiduAddress.split(',');
      //                 this.formItemIns.baiduAddress_jd=baiduAddress_array[0];
      //                 this.formItemIns.baiduAddress_wd=baiduAddress_array[1];
      //             }
      //         }
      //     }
      // });
      //基本信息查询
      let params ={
        insId : this.insId
      }
    querySubInsAddr(params).then(res => {
        if (res.code == 10000) {
          let resData = res.datas.address;
          this.formItemIns.Address =resData.addr
          this.formItemIns.zipCode =resData.zipCode
          this.formItemIns.selRoad = resData.street
          this.formItemIns.baiduAddress_jd = resData.longitude
          this.formItemIns.baiduAddress_wd =resData.latitude
          this.formItemIns.selCity = resData.city
          this.formItemIns.selArea = resData.district
          if(this.formItemIns.selCity){
              this.BindCity(this.formItemIns.selCity);
          }
          if(this.formItemIns.selArea){
              this.BindArea(this.formItemIns.selArea);
          }
          if(res.datas.branchInfo.isHasBranches==1){
            this.boolVale =true
          }else{
            this.boolVale =false
          }
        }
      });
    },
    SubmitAddress(name) {;
      this.$refs[name].validate(valid => {
        if (valid) {
          if (
            this.formItemIns.baiduAddress_jd &&
            this.formItemIns.baiduAddress_wd
          )
            this.formItemIns.baiduAddress =
              this.formItemIns.baiduAddress_jd +
              "," +
              this.formItemIns.baiduAddress_wd;

             var regStr="^[0-9]{6}$"; 
          var re=new RegExp(regStr); 
            if(re.test(this.formItemIns.zipCode)){ 
                 let params = {
            // id:this.formItemIns.id,
            insId:this.insId,
            // name:"本院区",
            // code:"10",
            // branchName:"本院区",
            address:
              "湖北省," +
              this.formItemIns.selCity +
              "," +
              this.formItemIns.selArea +
              "," +
              this.formItemIns.selRoad +
              "," +
              this.formItemIns.Address,
            baiduAddress: this.formItemIns.baiduAddress
              ? this.formItemIns.baiduAddress
              : "",
            zipCode: this.formItemIns.zipCode
            // orderIndex:"0"
          };
          if (this.formItemIns.id) {
            this.UpData(params);
          } else {
            this.PostData(params);
          }
            
          } else{
             Message.error("邮政编码输入不合法！正确格式如450000!"); 
          }
         
        } else {
          Message.error("验证失败！");
        }
      });
    },
    UpData(params) {
      //更新数据
      editSubInsAddr(params).then(res => {
        if (res.datas == 10000) {
          Message.success("保存成功!");
        } else {
          Message.error(res.data.msg);
        }
      });
    },
    PostData(params) {
    //写入数据
    editSubInsAddr(params).then(res => {
        if (res.code == 10000) {
          Message.success("保存成功!");
        } else {
          Message.error(res.data.msg);
        }
      });
    },
    ShowBaiduMap() {
      if(this.formItemIns.baiduAddress_jd ||this.formItemIns.baiduAddress_wd){
        this.formItemIns.baiduAddress = this.formItemIns.baiduAddress_jd+","+this.formItemIns.baiduAddress_wd
      }
      this.BaiduMapModalShow = true;
      this.loading1 = true;

      this.create = true;
        setTimeout(()=>{
        this.loading1 = false;
      },2000)
    },
    CloseBaiduMap(data) {
      this.BaiduMapModalShow = false;
      this.formItemIns.baiduAddress_jd = data.lng;
      this.formItemIns.baiduAddress_wd = data.lat;
    },
    getCityDate(callback) {
      var array = this.musicTypeJSON.list;
      for (let p in array) {
        array[p].label = array[p].name;
        array[p].value = array[p].name;
      }
      this.queryCityList = array;
      callback();
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
      let array = this.ForEachJson(this.queryAreaList, index);
      for (let p in array) {
        array[p].label = array[p].name;
        array[p].value = array[p].name;
      }
      this.queryRegionList = array;
    },
    cityChange(res) {
      this.BindCity(res);
    },
    areaChange(res) {
      this.BindArea(res);
    },
    chkChang(boolVale) {
      if (boolVale) {
        Modal.confirm({
          title: "提示信息",
          content: "无分院（所、站）信息时，将清除已设置信息，是否继续？",
          onOk: () => {
            let params ={
              insId:this.insId
            }
            deleteBranches(params).then(res=>{
                  if (res.code == 10000) {
                  Message.success("删除成功!");

                } else {
                  Message.error(res.data.msg);
                }
            })
          },
          onCancel: () => {
            this.boolVale = false;
          }
        });
      }
    },
    ForEachJson(cityjson, name) {
      let array = [];
      cityjson.forEach(item => {
        if (item.value == name) {
          array = item.list;
        }
      });
      return array;
    }
  }
};
</script>