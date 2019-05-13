<template>
    <a-card :bordered="false">
      <a-row :gutter="16">
        <a-col :span="24">

          <!-- 新增和搜索栏 -->
          <div class="toolbar">
            <a-row>
              <a-col :span="12"><a-button type="primary" icon="plus" @click="add">新增</a-button></a-col>
              <a-col :span="12">
                <div style="text-align: right">
                  <a-input-search placeholder="请输入移动资源名称" style="width:200px" @search="search"/>
                </div>
              </a-col>
            </a-row>
          </div>

          <a-table
            :loading="listLoading"
            :columns="columns"
            :dataSource="list"
            rowKey="id"
          >
            <span slot="actions" slot-scope="text,item">
              <a-tag color="blue" @click="detail(item)">详情</a-tag>
              <a-tag color="green" @click="edit(item)">修改</a-tag>
              <a-tag color="red" @click="del(item)">删除</a-tag>
            </span>
          </a-table>

        </a-col>
      </a-row>

      <!-- 添加通讯录页 -->
      <a-modal v-model="showModal" title="移动资源维护" @ok="handleSubmit" :maskClosable="false">
        <div style="width: 120px;margin: auto">
          <a-upload
            name="icon"
            listType="picture-card"
            :showUploadList="false"
            :action="uploadAction"
            :headers="{'BY-Token':token}"
            @change="handleIconChange"
          >
            <img style="max-width: 86px;max-height: 86px" v-if="imagePath" :src="imageUrl" alt="icon"/>
            <div v-else>
              <a-icon :type="imageLoading ? 'loading' : 'plus'"/>
              <div class="ant-upload-text">上传图标</div>
            </div>
          </a-upload>
        </div>
        <a-form :form="form">
          <a-form-item style="display: none">
            <a-input v-decorator="['id']"></a-input>
          </a-form-item>
          <a-form-item style="display: none">
            <a-input v-decorator="['icon']"></a-input>
          </a-form-item>
          <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input placeholder="请输入名称" v-decorator="['name',{rules:[{required:true,message:'请输入名称'}]}]"></a-input>
          </a-form-item>
          <a-form-item label="标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input placeholder="请输入标题" v-decorator="['title',{rules:[{required:true,message:'请输入标题'}]}]"></a-input>
          </a-form-item>
          <a-form-item label="路径" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input placeholder="请输入路径" v-decorator="['path',{rules:[{required:true,message:'请输入的路径'}]}]"></a-input>
          </a-form-item>
          <a-form-item label="资源地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input placeholder="请输入资源地址" v-decorator="['component',{rules:[{required:true,message:'请输入资源地址'}]}]"></a-input>
          </a-form-item>
          <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <!-- <a-input-number>标签中的precision：表示小数点的位数 -->
            <a-input-number
              style="width: 315px"
              :min="1"
              :precision="0"
              placeholder="请输入资源排序"
              v-decorator="['seq',{rules:[{required:true,message:'请输入排序序号，只能输入正整数,数字最长10位'}]}]"/>
          </a-form-item>
        </a-form>
      </a-modal>

      <!-- 详情页 -->
      <a-modal v-model="showDetail" :title="detailTitle" :maskClosable="false" :footer="null">
        <div style="width: 150px;margin: auto">
          <img style="max-width: 130px;max-height: 130px" v-if="imagePath" :src="imageUrl" alt="icon"/>
          <div v-else style="padding-left: 40px">
            <a-avatar shape="square" :size="64" icon="user"/>
            <div class="ant-upload-text">未上传图标</div>
          </div>
        </div>
        <a-form-item label="名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
          {{detailData.name}}
        </a-form-item>
        <a-form-item label="标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
          {{detailData.title}}
        </a-form-item>
        <a-form-item label="路径" :labelCol="labelCol" :wrapperCol="wrapperCol">
          {{detailData.path}}
        </a-form-item>
        <a-form-item label="资源地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
          {{detailData.component}}
        </a-form-item>
        <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
          {{detailData.seq}}
        </a-form-item>
      </a-modal>

    </a-card>
</template>

<script>
  import {getListSysMobileResourcesByName,saveSysMobileResources,update,delSysMobileResources} from '@/api/mobileResources'
  import { getType } from '@/api/unit'
  import { baseUrl } from '@/utils/request'
  import AFormItem from 'ant-design-vue/es/form/FormItem'
  import ARow from 'ant-design-vue/es/grid/Row'
  import ACol from 'ant-design-vue/es/grid/Col'
  export default {
    name: 'SysMobileResources',
    components: { ACol, ARow, AFormItem },
    data() {
      return {
        token: this.$ls.get('BY-Token'),
        uploadAction: baseUrl+'/sys/mobileResources/uploadMobileResourcesIcon',
        imagePath: '',
        imageLoading: false,

        queryParam: {},//集合对象(全列表)
        showModal: false,//添加或修改的控制按钮
        showDetail:false,//详情的控制按钮
        detailData: {},//封装一条移动资源的数据，需要展示到详情页的
        detailTitle:'',//详情页的标题
        form: {},
        isAdd: false,
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        },
        list: [],
        listLoading: false,

        columns: [{
          title: '名称',
          dataIndex:'name'
        }, {
          title: '标题',
          dataIndex: 'title'
        }, {
          title: '路径',
          dataIndex: 'path',
        }, {
          title: '资源地址',
          dataIndex: 'component',
        }, {
          title:'排序',
          dataIndex:'seq'
        },{
          title:'操作',
          dataIndex:'id',
          scopedSlots:{customRender:'actions'}
        }],
      }
    },
    computed: {
      imageUrl() {
        return baseUrl+ this.imagePath
      }
    },

    mounted() {
      this.fetchList()
    },

    methods: {
      fetchList() {
        this.listLoading = true
        getListSysMobileResourcesByName(this.queryParam).then(res => {
          this.list = res.data.list
          this.listLoading = false
        })
      },

      add(){
        this.showModal = true
        this.isAdd = true
        this.imagePath = ''
        this.form = this.$form.createForm(this)
      },

      handleSubmit(e){
        e.preventDefault()
        this.form.validateFields((err,values) => {
          if(err){
            return;
          }
          if (this.isAdd){
            saveSysMobileResources(values).then(res => {
              this.$message.success('提交成功')
              this.showModal = false
              this.fetchList()
            })
          }else {
            update(values).then(res => {
              this.$message.success('提交成功')
              this.showModal = false
              this.fetchList()
            })
          }
        })
      },

      edit(item){
        this.showModal = true
        this.form = this.$form.createForm(this)
        this.$nextTick(() => {
          this.form.setFieldsValue(item)
          this.imagePath = item.icon
        })
      },

      detail(item){
        this.detailTitle = '<'+item.name+'>的详细信息'
        this.showModal = false
        this.isAdd = false
        this.showDetail = true
        this.detailData = item
        this.imagePath = item.icon
      },

      del(item){
        const that = this
        this.$confirm({
          title:'确定删除该条信息吗？',
          content:'删除后将不可恢复',
          onOk(){
            delSysMobileResources({id:item.id}).then(res => {
              if (res.code !== 200){
                that.$message.error('删除失败');
                return;
              }
              that.$message.success('删除成功');
              that.fetchList();
            });
          }
        });
      },

      handleIconChange(info){
        if (info.file.status === 'uploading'){
          this.loading = true;
          return;
        }
        if (info.file.status === 'done'){
          this.imagePath = info.file.response.data;
          this.form.setFieldsValue({'icon':this.imagePath})
        }
      },

      search(value){
        this.queryParam.name=value;
        this.fetchList();
      }
    }
  }
</script>

<style lang="less" scoped>
  .toolbar {
    margin-bottom: 10px;
  }
</style>