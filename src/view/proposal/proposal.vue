<template>
  <div class="proposal">
    <div class="proposal_upload">
      <Button type="primary" size="large" icon="md-add" @click="Add_proposal=true">我要上传意见</Button>
    </div>
    <div class="form_lists">
      <div style="height:100%;overflow: hidden;" ref="TableHeight">
        <Table border :columns="columns" :data="data" :loading="loading" :height="tableHeight">
          <template slot-scope="{ row }" slot="action">
            <a @click="actionProposal(row)">查看</a>
          </template>
          <template slot-scope="{ row }" slot="status">
            <span v-if="row.status==1" style="color:green">{{"已结办"}}</span>
            <span v-else style="color:red">{{"未结办"}}</span>
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
    <!--新增意见-->
    <Modal v-model="Add_proposal" :mask-closable="false" title="新增意见" footer-hide width="500">
      <Form ref="AddProposalValidate" :model="AddProposal" :label-width="80">
        <FormItem
          label="标题"
          prop="title"
          :rules="{required: true, message: '请输入标题', trigger: 'blur'}"
        >
          <Input v-model="AddProposal.title" placeholder="请输入标题" :maxlength="200" />
        </FormItem>
        <FormItem
          label="描述"
          prop="content"
          :rules="{required: true, message: '请详细描述你的意见', trigger: 'blur'}"
        >
          <Input
            v-model="AddProposal.content"
            type="textarea"
            :rows="4"
            placeholder="请详细描述你的意见"
            :maxlength="4000"
          />
        </FormItem>
        <FormItem
          label="姓名"
          prop="name"
          :rules="{required: true, message: '请输入姓名', trigger: 'blur'}"
        >
          <Input v-model="AddProposal.name" placeholder="请输入姓名" :maxlength="200" />
        </FormItem>
        <FormItem
          label="电话"
          prop="phone"
          :rules="{required: true, message: '请输入电话', trigger: 'blur'}"
        >
          <Input v-model="AddProposal.phone" placeholder="请输入电话" />
        </FormItem>
        <FormItem
          label="邮箱"
          prop="email"
          :rules="{required: true, message: '请输入邮箱', trigger: 'blur'}"
        >
          <Input v-model="AddProposal.email" placeholder="请输入邮箱" />
        </FormItem>
        <FormItem label="附件">
          <Upload
            ref="upload1"
            multiple
            name="file"
            :data="uploadDataPar"
            :on-success="handleSuccess"
            :on-format-error="handleFormatError"
            :on-exceeded-size="handleMaxSize"
            :action="actionurl"
          >
            <Button icon="ios-cloud-upload-outline">上传附件</Button>
          </Upload>
        </FormItem>
        <FormItem style="text-align: center;">
          <Button type="primary" size="large" @click="AddProposalSubmit('AddProposalValidate')">确定</Button>
        </FormItem>
      </Form>
    </Modal>
    <!--查看意见详情-->
    <Modal v-model="proposalDetails" :mask-closable="false" title="意见查看" footer-hide width="500">
      <Form ref="proposalDetailsValidate" :model="proposalDetailsForm" :label-width="80">
        <FormItem label="标题">
          <Input v-model="proposalDetailsForm.title" readonly :maxlength="200" />
        </FormItem>
        <FormItem label="描述">
          <Input
            v-model="proposalDetailsForm.content"
            type="textarea"
            :rows="4"
            readonly
            :maxlength="1000"
          />
        </FormItem>
        <FormItem label="附件">
          <a href="#">{{proposalDetailsForm.fileName}}</a>
          <!-- <a href="">{{proposalDetailsForm.file}}</a> -->
          <!-- <span>{{proposalDetailsForm.file}}</span> -->
        </FormItem>
        <FormItem label="回复">
          <Input v-model="proposalDetailsForm.reply" type="textarea" readonly />
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>
<style lang="less" >
.proposal {
  position: relative;
  height: 100%;
  .proposal_upload {
    height: 50px;
  }
  .form_lists {
    height: calc(100% - 55px);
    overflow: hidden;
    padding-bottom: 38px;
    box-sizing: border-box;
  }
}
.proposalDetaiCont {
  border: 1px solid #eeeeee;
}
</style>
<script>
import { queryList, add, reply } from "@/service/advice";
import { urlPath, getAccessToken } from "@/libs/util";
import { Message } from "iview";
import axios from "axios";
export default {
  data() {
    return {
      tableHeight: "500",
      columns: [],
      data: [],
      loading: false,
      columns: [
        {
          title: "序号",
          width: 80,
          type: "index",
          align: "center"
        },
        {
          title: "标题",
          key: "title",
          align: "center"
        },
        {
          title: "描述",
          key: "content",
          align: "center",
          ellipsis: true, //开启后，文本将不换行，超出部分显示为省略号
          //tooltip	:true  开启后，文本将不换行，超出部分显示为省略号，并用 Tooltip 组件显示完整内容
          render: (h, params) => {
            let texts = "";
            //判断返回的内容不为空
            if (params.row.content !== null) {
              //判断内容长度大于6个字符
              if (params.row.content.length > 6) {
                //substring() 方法用于提取字符串中介于两个指定下标之间的字符，这里是如果时超出这个范围后用...省略号代替
                texts = params.row.content.substring(0, 60) + "...";
              } else {
                texts = params.row.content;
              }
            }
            return h(
              "Tooltip",
              {
                //这个地方时防止位置
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
                      whiteSpace: "normal", //规定段落中的文本不进行换行
                      wordBreak: "break-all" //在合适的点换行
                    }
                  },
                  params.row.content
                )
              ]
            );
          }
        },
        {
          title: "时间",
          key: "createDate",
          align: "center",
          width: 150
        },
        {
          title: "意见状态",
          slot: "status",
          width: 100,
          align: "center"
        },
        {
          title: "操作",
          slot: "action",
          width: 100,
          align: "center"
        }
      ],
      total: 0,
      pageIndex: 1,
      pageSize: 15,
      pageSizeOps: [15, 30, 50, 100],
      Add_proposal: false,
      fileName: "",
      AddProposal: {
        title: "",
        content: "",
        file: "",
        name: "",
        phone: "",
        email: ""
      },
      actionurl: "",
      uploadDataPar: {
        file_type: "PersonalConfig"
      },
      proposalDetails: false,
      proposalDetailsForm: {
        title: "",
        content: "",
        file: "",
        reply: "",
        email: "",
        fileName: ""
      }
    };
  },
  created() {
    // this.actionurl =process.env.COMMON_API_HOST +"service/upload"
    this.actionurl = this.UPLOAD_API_HOST;
    this.fileName = "";
  },
  mounted() {
    //计算table的高度
    this.$nextTick(() => {
      let tableHeight = this.$refs.TableHeight.offsetHeight;
      this.tableHeight = tableHeight;
    });
    this.getProposalList(this.pageSize, this.pageIndex);
  },
  methods: {
    getProposalList(num, page) {
      this.loading = true;
      let obj = {
        page: {
          pageNum: this.pageIndex,
          pageSize: this.pageSize
        },
        isSelf:'1',
        sendType: "2",
        title: ""
      };
      queryList(obj).then(res => {
        this.loading = false;
        if (res.code == 10000) {
          this.data = res.datas;
          this.total = res.total;
          this.fileName = "";
        } else {
          Message.error(res.data.msg);
        }
      });
    },
    onPageChange(num) {
      this.pageIndex = num;
      this.getProposalList(this.pageSize, this.pageIndex);
    },
    onPageSizeChange(page) {
      this.pageSize = page;
      this.getProposalList(this.pageSize, this.pageIndex);
    },
    actionProposal(item) {
      this.proposalDetails = true;
      this.proposalDetailsForm.title = item.title;
      this.proposalDetailsForm.content = item.content;
      this.proposalDetailsForm.file = process.env.fileUrl + item.file;
      this.proposalDetailsForm.reply =
        item.replyContent == null ? "暂无回复" : item.replyContent;
      this.proposalDetailsForm.fileName = item.fileName;
    },
    AddProposalSubmit(name) {
      this.$refs[name].validate(valid => {
        if (valid) {
          var reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
          let flag = false;
          var pattern = /^([A-Za-z0-9_\-\.])+\@(163.com|vip.163.com|qq.com|42du.cn|sina.com|189.cn|sina.cn)$/;
          let email = false;
          //手机号正则
          if (reg.test(this.AddProposal.phone)) {
            flag = true;
          }
          //邮箱正则
          if (pattern.test(this.AddProposal.email)) {
            email = true;
          }
          if (flag == true && email == true) {
            let commonBase = process.env.COMMON_API_HOST;
            let params = {
              title: this.AddProposal.title,
              content: this.AddProposal.content,
              name: this.AddProposal.name,
              telephone: this.AddProposal.phone,
              file: this.AddProposal.file,
              fileName: this.fileName,
              emailAddress: this.AddProposal.email
            };
            add(params).then(res => {
              if (res.code == 10000) {
                Message.success("提交成功！");
                this.$refs[name].resetFields();
                this.Add_proposal = false;
                this.getProposalList();
                this.fileName = null;
              } else {
                Message.error(res.msg);
              }
            });
          } else if (flag == false) {
            Message.error("请输入正确的手机号");
          } else if (email == false) {
            Message.error("请输入正确的邮箱");
          }
        }
      });
      // }
    },
    //文件上传成功时的钩子，返回字段为 response, file, fileList
    handleSuccess(res, file) {
      if (res.code == 10000) {
        this.AddProposal.file = res.datas[0].relativePath;
        let content = res.datas[0].originalFileName;
        this.fileName = content;
        Message.success("附件上传成功!");
      } else {
        Message.error(res.msg);
      }
    },
    
    //文件格式验证失败时的钩子，返回字段为 file, fileList
    handleFormatError(file) {
      Message.error(
        "File format of " +
          file.name +
          " is incorrect, please select jpg or png."
      );
    },
    //文件超出指定大小限制时的钩子，返回字段为 file, fileList
    handleMaxSize(file) {
      Message.error("File  " + file.name + " is too large, no more than 2M.");
    }
  }
};



</script>

