<template>
  <div style="height:100%;position:relative;">
    <div>
      <Form inline :model="queryPar" v-if="queryPar">
        <FormItem>
          <Input v-model="queryPar.name" placeholder="配置名称或标题" @on-enter="reload(1)" />
        </FormItem>
        <FormItem label="配置类型" :label-width="75" style="width:200px">
          <Select v-model="queryPar.category" clearable @on-change="reload(1)">
            <Option value="-999">所有</Option>
            <Option value="1">热门业务</Option>
            <Option value="2">轮播图</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="reload(1)">搜索</Button>
          <Button type="primary" @click="onAdd()">新增</Button>
        </FormItem>
      </Form>
    </div>
    <div class="form_lists">
      <div style="height:100%;overflow: hidden;" ref="TableHeight">
        <Table border :columns="columns" :data="data" :loading="loading" :height="tableHeight">
          <template slot-scope="{ row }" slot="name"> 
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row }" slot="enableMark">
            <span>{{ row.enableMark==1?'是':'否' }}</span>
          </template>
          <template slot-scope="{ row }" slot="category">
            <span>{{row.category==1?"热门业务":"轮播图"}}</span>
          </template>
          <template slot-scope="{row}" slot="action">
            <div class="action-btn">
              <a @click="edit(row)">编辑</a>
              <a @click="deletes(row.id)">删除</a>
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
        <span>编辑</span>
      </div>
      <Form :model="editObje" ref="editValidate" :label-width="80" :rules="editValidate">
        <FormItem label="配置名称" prop="name">
          <Input v-model="editObje.name" placeholder="请输入配置名称"   :maxlength='50'/>
        </FormItem>
        <FormItem label="配置标题">
          <Input v-model="editObje.title" placeholder="请输入配置标题"  :maxlength='50'/>
        </FormItem>
        <Row>
          <Col span="12">
            <FormItem label="配置类型">
              <!-- <Select v-model="editObje.category">
                <Option value="1">热门业务</Option>
                <Option value="2">轮播图</Option>
              </Select> -->
              <span>轮播图</span>
            </FormItem>
          </Col>
          <!-- <Col span="12">
            <FormItem label="图标">
              <Input v-model="editObje.icon" placeholder="请输入图标"  :maxlength='50'/>
            </FormItem>
          </Col> -->
        </Row>

        <FormItem label="图片指向" prop="imgPoint">
          <Input v-model="editObje.imgPoint" placeholder="请输入图片指向"  :maxlength='50'/>
        </FormItem>
        <FormItem label="是否启用">
          <Checkbox v-model="editObje.enableMark"></Checkbox>
        </FormItem>
        <FormItem label="显示类型 " prop="showType">
          <RadioGroup v-model="editObje.showType">
            <Radio label="1" value="1">手机</Radio>
            <Radio label="2" value="2">电脑</Radio>
            <Radio label="3" value="3">手机和电脑</Radio>
          </RadioGroup>
        </FormItem>
        <div style="padding-left:10px;">
          <label>上传图片</label>
          <Upload
            ref="upload1"
            :show-upload-list="false"
            name="file"
            :data="uploadDataPar"
            :on-success="handleSuccess1"
            :format="['jpg','jpeg','png']"
            :max-size="2048"
            :on-format-error="handleFormatError1"
            :on-exceeded-size="handleMaxSize1"
            :action="actionurl"
            style="display: inline-block;width:58px;"
          >
            <div
              style="width: 120px;height:140px;line-height: 140px;text-align: center;border:1px solid #eeeeee;margin-left:15px;cursor: pointer;overflow: hidden;"
            >
              <img  v-if="editObje.img" :src="editObje.img" />
              <Icon v-if="!editObje.img" type="ios-camera" size="20"></Icon>
            </div>
          </Upload>
        </div>
      </Form>
      <div slot="footer">
        <Button size="large" @click="cancleSubmit()">取消</Button>
        <Button type="primary" size="large" @click="createExt('editValidate')">确定</Button>
      </div>
    </Modal>
  </div>
</template>
<style lang="less" scoped>
.form_lists {
  height: calc(100% - 60px);
  overflow: hidden;
  padding-bottom: 38px;
  box-sizing: border-box;
}
img{
  width: 100%;
  height: 100%;
}
</style>
<script>
import { queryList, edit,add,deletes} from "@/service/personalcfg";
import {
  getAccessToken,
  urlPath,
  validateSequence,
  getUserInfo
} from "@/libs/util";
import { Modal, Message } from "iview";
export default {
  data() {
    return {
      loading: false,
      tableHeight: 520,
      actionurl: "",
      images:'',
      columns: [
        {
          title: "操作",
          slot: "action",
          width: 130,
          align: "center"
        },
        {
          title: "配置名称",
          slot: "name"
        },
        {
          title: "标题",
          key: "title"
        },
        {
          title: "图片指向",
          key: "imgPoint"
        },
        {
          title: "是否启用",
          slot: "enableMark"
        },
        {
          title: "图片类型",
          slot: "category"
        },
        {
          title: "添加时间",
          key: "createDate"
        }
      ],
      data: [],
      total: 0,
      pageIndex: 0,
      pageSize: 15,
      //主体编辑
      ModalShow: false,
      editObje: {},
      //查询参数定义
      queryPar: {
        name: null,
        category: null
      },
      uploadDataPar: {
        file_type: ""
      },
      editValidate: {
        name: [{ required: true, message: "请输入配置名称", trigger: "blur" }],
        category: [
          { required: true, message: "请输入配置类型", trigger: "change" }
        ],
        imgPoint: [
          { required: true, message: "请输入图片指向", trigger: "blur" }
        ],
        showType: [
          { required: true, message: "请选择显示类型", trigger: "change" }
        ]
      }
    };
  },
  created() {
    this.pageSizeOps = [15, 30, 50, 100];
    // let userNew = getUserInfo();
    // this.userNew = userNew;
    this.uploadDataPar = {
      file_type: "PersonalConfig"
    };
    this.actionurl =this.UPLOAD_API_HOST
    this.reload();
  },
  mounted() {
    //计算table的高度
    this.$nextTick(() => {
      let tableHeight = this.$refs.TableHeight.offsetHeight;
      this.tableHeight = tableHeight;
    });
  },
  methods: {
    reload(page) {
      if (page != undefined) {
        this.pageIndex = page;
      }
      // this.loading = true;
      //查询相关参数
      var where = {
        name: this.queryPar.name,
        code: this.queryPar.code,
        category: null
      };
      if (this.queryPar.dataItemCategory != "-999") {
        where.category = this.queryPar.dataItemCategory;
      }

      let params = {
        page: {
          pageNum: this.pageIndex,
          pageSize: this.pageSize
        },
        name: this.queryPar.name,
        category: ""
      };
      // this.getRequest("sys_personal_cfg/list", urlPath(params)).then(res => {
      //   if (res.data.data) {
      //     let data = res.data;
      //     if (data.code == 40000) {
      //       this.total = data.data.total_count;
      //       var resData = data.data.items;
      //       if (resData) {
      //         this.data = resData;
      //       }
      //     } else {
      //       Message.error(data.msg);
      //     }
      //   }
      //   this.loading = false;
      // });

      //页面初次table页渲染
      queryList(params).then(res => {
        if (res.code == 10000) {
          this.total = res.total;
          this.data = res.datas;
        } else {
          Message.error(data.msg);
        }
        this.loading = false;
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
    //编辑
    edit(row) {
      this.editObje = {
        id: row.id,
        category: row.category + "",
        name: row.name,
        title: row.title,
        icon: row.icon,
        img: process.env.fileUrl+row.img,
        imgPoint: row.imgPoint,
        enableMark: row.enableMark == 1 ? true : false,
        showType: row.showType
      };
      console.log( this.editObje.img)
      this.$refs["editValidate"].resetFields();
      this.ModalShow = true;
    },
    //删除
    deletes(id) {
      let Id = id;
      Modal.confirm({
        title: "删除",
        content: "<p>确定要删除？</p>",
        onOk: () => {
            let params = {
            id: Id
          };
            deletes(params).then(res => {
            if (res.code == 10000) {
              Message.success("删除成功");
              this.reload();
            } else {
              Message.error(res.data.msg);
            }
          });
        }
      });
    },
    //新增按钮点击事件
    onAdd() {
      this.$refs["editValidate"].resetFields();
      this.editObje = {};
      this.editObje.enableMark = true;
      this.ModalShow = true;
    },
    cancleSubmit() {
      this.$refs["editValidate"].resetFields();
      this.ModalShow = false;
    },
    createExt(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          // if (!this.editObje.img && this.editObje.category == 2) {
          //   Message.error("请先上传图片!");
          //   return;
          // }
          let params = {
            id: this.editObje.id,
            category:'2',
            name: this.editObje.name,
            title: this.editObje.title,
            // icon: this.editObje.icon,
            imgPoint: this.editObje.imgPoint,
            enableMark: this.editObje.enableMark ? 1 : 0,
            showType: this.editObje.showType,
            img: this.images
          };
          if (this.editObje.id) {
            this.UpData(params);
          } else {
            this.PostData( params);
          }
        }
      });
    },
    UpData( params) {
      //更新数据
      edit(params).then(res => {
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
      add(params).then(res => {
        if (res.code == 10000) {
          this.ModalShow = false;
          Message.success("保存成功!");
          this.reload();
        } else {
          Message.error(res.data.msg);
        }
      });
    },
    /***登记照上传事件***/
    //文件上传成功时的钩子，返回字段为 response, file, fileList
    handleSuccess1(res, file) {
      if (res.code == 10000) {
        this.images = res.datas[0].relativePath;
        this.editObje.img =process.env.fileUrl+ res.datas[0].relativePath;
        Message.success("图片上传成功!");
          this.reload();

      } else {
        Message.error(res.msg);
      }
    },
    //文件格式验证失败时的钩子，返回字段为 file, fileList
    handleFormatError1(file) {
      Message.error(
        "File format of " +
          file.name +
          " is incorrect, please select jpg or png."
      );
    },
    //文件超出指定大小限制时的钩子，返回字段为 file, fileList
    handleMaxSize1(file) {
      Message.error("File  " + file.name + " is too large, no more than 2M.");
    }
  }
};
</script>