<template>
  <div style="height:100%;position:relative;">
    <div>
      <Form inline :model="queryPar" v-if="queryPar">
        <FormItem>
          <Input v-model="queryPar.title" placeholder="请输入标题搜索" @on-enter="reload(1)" />
        </FormItem>
        <FormItem label="类型" :label-width="55" style="width:200px">
          <Select v-model="queryPar.sendType" clearable @on-change="reload(1)">
            <Option value="2">机构</Option>
            <Option value="1">个人</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Button type="primary" @click="reload(1)">搜索</Button>
        </FormItem>
      </Form>
    </div>
    <div class="form_lists">
      <div style="height:100%;overflow: hidden;" ref="TableHeight">
        <Table border :columns="columns" :data="data" :loading="loading" :max-height="tableHeight">
          <template slot-scope="{ row }" slot="name">
            <strong>{{ row.name }}</strong>
          </template>
          <template slot-scope="{ row }" slot="sendType">
            <span v-if="row.sendType=='2'">机构</span>
            <span v-else-if="row.sendType=='1'">个人</span>
          </template>
          <template slot-scope="{ row }" slot="status">
            <span v-if="row.status==0" style="color:red">未回复</span>
            <span v-else-if="row.status==1" style="color:green">已回复</span>
          </template>
          <template slot-scope="{row}" slot="action">
            <div class="action-btn">
              <a @click="reply(row)">回复</a>
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
      width="550"
      class-name="vertical-center-modal"
    >
      <div slot="header" style="color:#333333;font-size:16px">
        <Icon type="md-hammer"></Icon>
        <span>回复</span>
      </div>
      <Form :model="editObje" ref="editValidate" :label-width="80" :rules="editValidate">
        <FormItem label="意见建议">
          <Input v-model="editObje.content" type="textarea" disabled />
        </FormItem>
        <FormItem label="回复消息" prop="replyContent">
          <Input
            v-model="editObje.replyContent"
            type="textarea"
            :rows="6"
            placeholder="请输入回复消息..."
          />
        </FormItem>
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
</style>
<script>
import { queryList, reply, deletes } from "@/service/advice";
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
      columns: [
        {
          title: "操作",
          slot: "action",
          width: 120,
          align: "center"
        },
        {
          title: "类型",
          slot: "sendType"
        },
        // {
        //   title: "分类",
        //   key: "adviceType"
        // },
        {
          title: "标题",
          key: "title"
        },
        {
          title: "内容",
          key: "content",
          ellipsis: true,
          render: (h, params) => {
            let texts = "";
            if (params.row.content ) {
              if (params.row.content.length > 15) {
                texts = params.row.content.substring(0, 13) + "...";
              } else {
                texts = params.row.content;
              }
            }
            return h(
              "Tooltip",
              {
                props: {
                  placement: "top"
                }
              },
              [
                texts,
                h(
                  "span",
                  {
                    slot: "content",
                    style: {
                      whiteSpace: "normal",
                      wordBreak: "break-all"
                    }
                  },
                  params.row.content
                )
              ]
            );
          }
        },
        {
          title: "姓名",
          key: "name"
        },
        {
          title: "联系电话",
          key: "telephone"
        },
        {
          title: "联系邮箱",
          key: "emailAddress"
        },
        {
          title: "状态",
          slot: "status"
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
        title: null,
        sendType: null
      },
      editValidate: {
        replyContent: [
          { required: true, message: "请输入回复消息", trigger: "blur" }
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
      this.reload();
    }
  },
  created() {
    this.pageSizeOps = [15, 30, 50, 100];
    // let userNew = getUserInfo();
    this.userNew = this.objs;
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
      // var where = {
      //   title:this.queryPar.title,
      //   sendType: this.queryPar.sendType
      // };
      // let params = {
      //   page_index: this.pageIndex,
      //   page_size: this.pageSize,
      //   sql_where: JSON.stringify(where)
      // };
      let params = {
        page: {
          pageNum: this.pageIndex,
          pageSize: this.pageSize
        },
        title: this.queryPar.title,
        sendType: this.queryPar.sendType
      };
      // this.getCommonApiRequest("advice/list", urlPath(params)).then(res => {
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
      //   this.loading = false;
      // });
      queryList(params).then(res => {
        if (res.code == 10000) {
          this.total = res.total;
          this.data = res.datas;
        } else {
          Message.error(data.msg);
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
    //回复
    reply(row) {
      this.editObje = {
        id: row.id,
        replyContent: row.replyContent,
        content: row.content
      };
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
    cancleSubmit() {
      this.$refs["editValidate"].resetFields();
      this.ModalShow = false;
    },
    createExt(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          let params = {
            id: this.editObje.id,
            status: 1,
            replyContent: this.editObje.replyContent
          };
          this.UpData(params);
        }
      });
    },
    UpData(params) {
      //更新数据
      // this.putCommonApiRequest(url, param).then(res => {
      //   if (res.data.code == 40000) {
      //     this.ModalShow = false;
      //     Message.success("回复成功!");
      //     this.reload();
      //   } else {
      //     Message.error(res.data.msg);
      //   }
      // });
      //回复建议
      reply(params).then(res => {
        if (res.code == 10000) {
          this.ModalShow = false;
          Message.success("回复成功!");
          this.reload();
        } else {
          Message.error(res.data.msg);
        }
      });
    }
  }
};
</script>