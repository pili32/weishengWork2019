<template>
    <div>
        <div>
        <Form ref="formInline" :model="formInline" :rules="ruleInline" :label-width="80">
            <FormItem label="民族：" prop="user">
                <Select v-model="formInline.Nation" style="width:200px">
                    <Option v-for="item in nationList" :value="item.itemvalue1" :key="item.itemvalue1">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem label="籍贯：" prop="NativePlace">
                <Select v-model="formInline.NativePlace" style="width:200px">
                    <Option v-for="item in nativePlaceList" :value="item.itemvalue1" :key="item.itemvalue1">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem label="出生地：" prop="BirthAddress">
                <Select v-model="formInline.BirthAddress" style="width:200px">
                    <Option v-for="item in nativePlaceList" :value="item.itemvalue1" :key="item.itemvalue1">{{ item.name }}</Option>
                </Select>
            </FormItem>
            <FormItem label="政治面貌：" prop="password">
                <Select v-model="formInline.PoliticsOutlook" style="width:200px">
                    <Option v-for="item in PoliticsOutlookList" :value="item.itemvalue1" :key="item.itemvalue1">{{ item.name }}</Option>
                </Select>
            </FormItem>
        </Form>
        </div>
        <div slot="footer">
            <Button  size="large" @click="cancleModal()">取消 </Button>
            <Button type="primary" size="large" @click="createModal('ruleInline')">确定 </Button>
        </div>
    </div>
</template>
<script>
import {urlPath,dataItemHandle} from '@/libs/util'
import {Modal,Message } from 'iview'
    export default {
        data () {
            return {
                nationList: [],
                nativePlaceList:[],
                PoliticsOutlookList:[],
                formInline:{},
                ruleInline:{

                }
            }
        },
        created() {
            this.getDictionaries("Nation").then((res)=>{
                if(res.data.code==40000){
                    this.nationList=dataItemHandle(res);
                }
            });
            this.getDictionaries("Politics").then((res)=>{
                if(res.data.code==40000){
                    this.PoliticsOutlookList=dataItemHandle(res);
                }
            });
        },
        methods: {
            cancleModal(){
                this.$emit("cancleModal");
            },
            createModal(){
                 Message.success("保存成功!");
                 this.$emit("cancleModal")
            }
        }
    }
</script>
