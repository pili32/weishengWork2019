<template>
  <div>
    <div class="search">
      <Form ref="searchBox" :model="searchBox" inline>
        <FormItem label="机构类别">
          <Select v-model="searchBox.mechanismType" style="width:200px">
            <Option
              v-for="item in mechanismList"
              :value="item.value"
              :key="item.value"
            >{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="数据层级">
          <Select v-model="searchBox.hierarchy" style="width:200px">
            <Option v-for="item in hierarchy" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="关键字">
          <Input v-model="searchBox.Keyword" placeholder="机构名称中搜索" />
        </FormItem>
        <FormItem style="margin-top: 32px">
          <Button type="primary" icon="ios-search" @click="searchBtn">搜索</Button>
        </FormItem>
      </Form>
    </div>
    <!---添加按钮-->
    <Button type="primary" icon="md-add" @click="addPage">添加</Button>
    <!--table列表-->
    <div class="form_list" style="padding: 15px 0;">
      <Table border :columns="columns" :data="data">
        <template slot-scope="{ row }" slot="name">
          <strong>{{ row.name }}</strong>
        </template>
        <template slot-scope="{row,index}" slot="action">
          <Button type="primary" size="small" style="margin-right: 5px" @click="edit(index)">编辑</Button>
          <Button type="error" size="small" @click="deletes(row.id)">删除</Button>
        </template>
      </Table>
    </div>
    <!--对话框-添加-->
    <Modal
      v-model="AddModalShow"
      :mask-closable="false"
      class-name="vertical-center-modal"
      footer-hide
    >
      <p slot="header" style="color:#333333;font-size:16px">
        <Icon type="md-add-circle"></Icon>
        <span>添加</span>
      </p>
      <Form :model="AddObje" :label-width="80" :rules="ruleValidate" ref="addRefDom">
        <FormItem label="类别" prop="category">
          <Select v-model="AddObje.category">
            <Option value="0">别名</Option>
            <Option value="1">曾用名</Option>
          </Select>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model="AddObje.name" />
        </FormItem>
        <FormItem label="年度" prop="year">
          <DatePicker type="year" v-model="AddObje.year" />
        </FormItem>
        <FormItem label="评论">
          <Input v-model="AddObje.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" />
        </FormItem>
        <FormItem>
          <Button type="primary" @click="handleSubmit('addRefDom')">保存</Button>
          <Button @click="handleReset('addRefDom')" style="margin-left: 8px">重置</Button>
        </FormItem>
      </Form>
    </Modal>
    <!--对话框-编辑-->
    <Modal
      v-model="ModalShow"
      :mask-closable="false"
      class-name="vertical-center-modal"
      @on-ok="define"
      loading
    >
      <p slot="header" style="color:#333333;font-size:16px">
        <Icon type="md-hammer"></Icon>
        <span>编辑</span>
      </p>
      <Form :model="editObje" :label-width="80" :rules="ruleValidate">
        <FormItem label="类别" prop="category">
          <Select v-model="editObje.category" disabled>
            <Option value="0">别名</Option>
            <Option value="1">曾用名</Option>
          </Select>
        </FormItem>
        <FormItem label="名称" prop="name">
          <Input v-model="editObje.name" />
        </FormItem>
        <FormItem label="年度" prop="year">
          <DatePicker type="year" v-model="editObje.year" />
        </FormItem>
        <FormItem label="评论" prop="remark">
          <Input v-model="editObje.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<script>
import { getAccessToken, urlPath } from "@/libs/util";
import { Modal, Message } from "iview";
export default {
  data() {
    return {
      columns: [
        {
          title: "名称",
          slot: "name"
        },
        {
          title: "年度",
          key: "year"
        },
        {
          title: "评论",
          key: "remark"
        },
        {
          title: "操作",
          slot: "action",
          width: 150,
          align: "center"
        }
      ],
      data: [],
      ModalShow: false,
      Title: "编辑",
      editObje: {
        category: "",
        name: "",
        year: "",
        remark: "",
        id: null,
        ins_id: null,
        order_index: 0
      },
      ruleValidate: {
        category: [
          {
            required: true,
            message: "Please select the city",
            trigger: "change"
          }
        ],
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        year: [
          {
            required: true,
            type: "date",
            message: "请选择年份",
            trigger: "change"
          }
        ],
        remark: [{ required: true, message: "请输入评论", trigger: "blur" }]
      },
      AddModalShow: false,
      AddObje: {
        category: "",
        name: "",
        year: "",
        remark: ""
      },
      //搜索
      searchBox: {
        mechanismType: "",
        Keyword: "",
        hierarchy: ""
      },
      mechanismList: [
        {
          value: "New York",
          label: "New York"
        },
        {
          value: "London",
          label: "London"
        },
        {
          value: "Sydney",
          label: "Sydney"
        },
        {
          value: "Ottawa",
          label: "Ottawa"
        },
        {
          value: "Paris",
          label: "Paris"
        },
        {
          value: "Canberra",
          label: "Canberra"
        }
      ],
      hierarchy: [
        {
          value: "0",
          label: "直属下级"
        },
        {
          value: "1",
          label: "直属上级"
        }
      ]
    };
  },
  created() {
    this.getTableList("ins_names/list/0");
  },
  methods: {
    getTableList(url) {
      this.getRequest(url + "?").then(res => {
        if (res.data.data.items) {
          let datas = [];
          for (let i = 0; i < res.data.data.items.length; i++) {
            let obj = {
              category: res.data.data.items[i].category,
              name: res.data.data.items[i].name,
              year: res.data.data.items[i].last_use_year,
              remark: res.data.data.items[i].remark,
              id: res.data.data.items[i].id,
              ins_id: res.data.data.items[i].ins_id
            };
            datas.push(obj);
          }
          this.data = datas;
        }
      });
    },
    //编辑
    edit(index) {
      this.editObje.category = this.data[index].category + "";
      this.editObje.name = this.data[index].name;
      this.editObje.year = this.data[index].year;
      this.editObje.remark = this.data[index].remark;
      this.editObje.id = this.data[index].id;
      this.editObje.ins_id = this.data[index].ins_id;
      this.ModalShow = true;
    },
    //删除
    deletes(id) {
      Modal.confirm({
        title: "删除",
        content: "<p>确定要删除？</p>",
        onOk: () => {
          // Message.success('删除成功!');
          let token = getAccessToken();
          this.deleteRequest("ins_names/" + id).then(res => {});
        }
      });
    },
    //编辑保存
    define() {
      let token = getAccessToken();
      let params = {
        id: this.editObje.id,
        ins_id: this.editObje.ins_id,
        category: parseInt(this.editObje.category),
        name: this.editObje.name,
        last_use_year: new Date(this.editObje.year).getFullYear().toString(),
        order_index: 0,
        remark: this.editObje.remark
      };
      this.putRequest("ins_names", params).then(res => {
        if (res.data.code == 40000) {
          Message.success("保存成功!");
          this.ModalShow = false;
          this.getTableList("ins_names/list/0");
        } else {
          Message.error(res.data.msg);
        }
      });
    },
    //时间选择器
    DatePicker(value, date) {
      this.editObje.year = value;
    },
    //***************新增*********************/
    //新增按钮点击事件
    addPage() {
      this.AddModalShow = true;
    },
    handleSubmit(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          let params = {
            category: parseInt(this.AddObje.category),
            name: this.AddObje.name,
            last_use_year: new Date(this.AddObje.year).getFullYear().toString(),
            order_index: 0,
            remark: this.AddObje.remark
          };
          this.postRequest("ins_names", params).then(res => {
            this.AddModalShow = false;
            if (res.data.code == 40000) {
              Message.success("添加成功!");
              this.getTableList("ins_names/list/0");
              this.$refs[refName].resetFields();
            } else {
              Message.error(res.data.msg);
            }
          });
        }
      });
    },
    handleReset(refName) {
      this.$refs[refName].resetFields();
    },
    searchBtn() {
      alert(this.searchBox.Keyword);
    }
  }
};
</script>

