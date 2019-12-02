<template>
  <Form :model="formItemIns" ref="formItemIns" :label-width="200" :rules="ruleValidate">
    <div>
      <div class="border_line">
        <span class="border_line_txt">主/本院（所、站）地址</span>
        <Row :gutter="25" style="padding-top: 50px;">
          <Col :md="24" :lg="24">
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
          <Col :md="12" :lg="7">
            <FormItem label="邮政编码：" prop="zip_code">
              <Input
                type="number"
                v-model="formItemIns.zip_code"
                placeholder="请输入邮政编码"
                style="width:200px"
              />
            </FormItem>
          </Col>
          <Col :md="12" :lg="17">
            <FormItem label="地理位置：">
              <span>经度</span>
              <Input
                v-model="formItemIns.baidu_address_jd"
                placeholder="请输入经度"
                style="width:130px"
                readonly
              />
              <span>纬度</span>
              <Input
                v-model="formItemIns.baidu_address_wd"
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
      <!--弹框--百度地图-->
      <Modal
        v-model="BaiduMapModalShow"
        :mask-closable="false"
        width="1100"
        class-name="vertical-center-modal"
        footer-hide
        class="demo-spin-article"
      >
        <p slot="header" style="color:#333333;font-size:16px">
          <span>地图定位</span>
        </p>
        <BaiduMap v-if='create' @CloseBaiduMap="CloseBaiduMap" :baidu_address="formItemIns.baidu_address"></BaiduMap>
        <Spin size="large" fix v-if="loading" style='font-size:20px'>加载中...</Spin>
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
import { getAccessToken, urlPath, getUserInfo } from "@/libs/util";
import { Modal, Message } from "iview";
import BaiduMap from "@/view/insInfoManage/addressInfo/BMapComponent.vue";
import CityList from "@/libs/hb-qc-lv4.json";
import {
  administrationAddressMessage,
  administrationAddressChange
} from "@/service/xzjgAdmin";

export default {
  data() {
    const validateSequence = (rule, value, callback) => {
      // debugger;
      value = this.formItemIns.zip_code;
      let regNum = /^[0-9]{6}$/;
      if (value === "") {
        callback(new Error("邮政编码不能为空！"));
      } else if (!regNum.test(value)) {
        callback(new Error("邮政编码格式有误！"));
      } else {
        callback();
      }
    };
    const isEmpty = (rule, value, callback) => {
      value = this.formItemIns.Address;
      if (value === "") {
        callback(new Error("详细地址不能为空！"));
      } else {
        callback();
      }
    };
    return {
      insId: this.$route.params.id,
      BaiduMapModalShow: false,
      queryCityList: [],
      queryAreaList: [],
      queryRegionList: [],
      musicTypeJSON: [],
      formItemIns: {
        baidu_address:'',
        baidu_address_jd: "",
        baidu_address_wd: "",
        zip_code: null,
        Address: ""
      },
      ruleValidate: {
        Address: [{ required: true, trigger: "blur", validator: isEmpty }],
        zip_code: [
          { required: true, trigger: "blur", validator: validateSequence }
          // {type:'string',pattern: /^[0-9]{6}$/,message: '请输入正确的邮政编码！',trigger: 'blur',}
        ]
      },
      userNew: null,
      loading:true,
      create:false
    };
  },
  components: {
    BaiduMap,
    CityList
  },
  computed:{
    objs(){
      return this.$store.state.user.userInfo
    }
  },
  watch:{
    objs(){
      this.userNew = this.objs;
      if (!this.insId) {
        this.insId = this.userNew.insId;
      }
      this.musicTypeJSON = CityList;
      this.getCityDate(() => {
        this.getMainFrom();
      });
    }
  },
  created() {
    // let userNew = getUserInfo();
    this.userNew = this.objs;
    if (!this.insId) {
      this.insId = this.userNew.insId;
    }
    this.musicTypeJSON = CityList;
    this.getCityDate(() => {
      this.getMainFrom();
    });
  },
  methods: {
    getMainFrom() {
      let params = {
        insMainId: this.insId
      };
      administrationAddressMessage(params).then(res => {
        if (res.code == 10000) {
            this.formItemIns.selCity = res.datas.city;
            this.formItemIns.selArea = res.datas.district;
            this.formItemIns.selRoad = res.datas.county;
            this.formItemIns.Address = res.datas.door;
            this.formItemIns.zip_code = res.datas.zipCode;
            this.formItemIns.baidu_address_jd = res.datas.longitude;
            this.formItemIns.baidu_address_wd = res.datas.latitude;
            if(this.formItemIns.baidu_address_jd && this.formItemIns.baidu_address_wd) {
              this.formItemIns.baidu_address = this.formItemIns.baidu_address_jd +"," + this.formItemIns.baidu_address_wd
            };
          if (this.formItemIns.selCity) {
            this.BindCity(this.formItemIns.selCity);
          }
          if (this.formItemIns.selArea) {
            this.BindArea(this.formItemIns.selArea);
          }
        } else {
          Message.error(res.msg);
        }
      });
    },
    SubmitAddress(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          if (
            this.formItemIns.selCity == "null" ||
            this.formItemIns.selRoad == "null" ||
            this.formItemIns.selArea == "null" ||
            this.formItemIns.selCity == "" ||
            this.formItemIns.selRoad == "" ||
            this.formItemIns.selArea == "" ||
            this.formItemIns.selCity == undefined ||
            this.formItemIns.selRoad == undefined ||
            this.formItemIns.selArea == undefined
          ) {
            Message.error("请选择详细地址信息！");
          } else {
            let params = {
              city: this.formItemIns.selCity,
              county: this.formItemIns.selRoad,
              district: this.formItemIns.selArea,
              door: this.formItemIns.Address,
              insMainId: this.insId,
              latitude: this.formItemIns.baidu_address_wd,
              longitude: this.formItemIns.baidu_address_jd,
              province: "湖北省",
              zipCode: this.formItemIns.zip_code.toString()
            };
            administrationAddressChange(params).then(res => {
              if (res.code == 10000) {
                Message.success("保存成功");
                this.getMainFrom();
              }
            });
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
          Message.success("保存成功!");
        } else {
          Message.error(res.data.msg);
        }
      });
    },
    PostData(url, param) {
      //写入数据
      this.postRequest(url, param).then(res => {
        if (res.data.code == 40000) {
          Message.success("保存成功!");
        } else {
          Message.error(res.data.msg);
        }
      });
    },
    // 调起百度地图API
    ShowBaiduMap() {
      this.create = true;
      setTimeout(()=>{
        this.loading = false;
      },2000)
      this.BaiduMapModalShow = true;
    },
    // 从子组件里获取到的经纬度数据
    CloseBaiduMap(data) {
      this.BaiduMapModalShow = false;
      this.formItemIns.baidu_address_jd = data.lng;
      this.formItemIns.baidu_address_wd = data.lat;
    },
    //  获取行政单位地址数据
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
      this.formItemIns.selRoad = "";
    },
    areaChange(res) {
      this.BindArea(res);
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