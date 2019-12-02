<template>
    <Form :model="center" :label-width="80">
        <span>经度：</span>
            <Input v-model="center.lng" placeholder="请输入经度" style="width:130px" readonly/>
        <span>纬度：</span>
            <Input v-model="center.lat" placeholder="请输入纬度" style="width:130px" readonly/>
        <Button type="primary" @click="BaiduMapOK()">确定</Button>
        <span style="color:red;">
            提示：用鼠标拖动地图，通过手型指针选择本单位大门或主楼，鼠标左键单击定位后点击“确定”按钮。
        </span>
        <baidu-map 
            class="map"
            :center="center" 
            :zoom="zoom" 
            :scroll-wheel-zoom="true"
            @click="getClickInfo" 
            @ready="handler">
            <bm-view style="width: 100%; height:600px;"></bm-view>
            <bm-marker :position="center" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
            </bm-marker>
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
            <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" 
                :showAddressBar="true" 
                :autoLocation="true">
            </bm-geolocation>
        </baidu-map>
    </Form>
</template>
<style scoped>
    .anchorBL{
        display:none
　　}
</style>

<script>
import { BmView , BmMarker , BmNavigation , BmGeolocation} from 'vue-baidu-map'
import {Message} from 'iview'
    export default {
        name: 'Map',
        data:function(){
            return{
               map: null, 
               center: {
                    lng: 116.404,
                    lat: 39.915
                },
                location: {
                    lng: '',
                    lat: ''
                },
                zoom: 15
            }
        },
        props: {
            baidu_address: String,
            required: true
        },
        watch: {        
            baidu_address: function(newVal,oldVal){
                let baidu_address_array=newVal.split(',');
                this.location.lng=baidu_address_array[0];
                this.center.lng  =  this.location.lng
                this.location.lat=baidu_address_array[1];
                this.center.lat =this.location.lat
                if(newVal && this.map){
                    this.map.centerAndZoom(this.location, 12)
                }
            }
        },
        methods: {
            BaiduMapOK(){
               let data={
                     lng:this.center.lng,
                     lat:this.center.lat
               };
                this.$emit("CloseBaiduMap",data);
            },
            getClickInfo(e){
                this.center.lng = e.point.lng;
                this.center.lat = e.point.lat;
            },
            handler ({BMap, map}) {
                this.map = map
                let _this = this;
                setTimeout(() => {
                    const {lng, lat} = this.location
                    if (this.location.lng && this.location.lat) {
                        _this.center = {lng: lng, lat: lat};		// 设置center属性值
                        _this.center.lng = lng;
                        _this.center.lat = lat;
                        _this.zoom = 18
                    }
                }, 2500)
                
                // var geolocation = new BMap.Geolocation();
                // geolocation.getCurrentPosition(function(r){
                //     _this.center = {lng: r.longitude, lat: r.latitude};		// 设置center属性值
                //     _this.center.lng = r.longitude;
                //     _this.center.lat = r.latitude;
                // },{enableHighAccuracy: true})
			}
        },
        mounted(){
            if(this.baidu_address) {
                let baidu_address_array=this.baidu_address.split(',');
                this.location.lng=baidu_address_array[0];
                this.location.lat=baidu_address_array[1];
                if(this.baidu_address && this.map){
                    this.map.centerAndZoom(this.location, 12)
                }
            }
        }
    }
</script>