<template>
  <div id="MemberAdd">
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-content">
              <div class="hd-title">添加文章</div>
              <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="基本信息" name="first">
                  <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t">
                    <validate class="form-group">
                      <label class="col-sm-3 control-label"><span class="f-c-r">*</span> 文章分类：</label>
                      <div class="col-sm-4">
                        <input type="hidden" name="article_cate_id" v-model="articleInfo.articleCateId" required>
                        <el-cascader :class="fieldClassName(formstate.article_cate_id)"
                                     :options="articleCateList"
                                     :props="articleCateProps"
                                     @change="changeArticleCate"
                                     change-on-select
                        ></el-cascader>
                        <field-messages name="article_cate_id" show="$touched || $submitted" class="form-control-callback">
                          <div slot="required" class="error">文章分类不能为空</div>
                        </field-messages>
                      </div>
                    </validate>
                    <validate class="form-group">
                      <label class="col-sm-3 control-label"><span class="f-c-r">*</span>文章标题：</label>
                      <div class="col-sm-4">
                        <input type="text" name="article_title" class="form-control" v-model="articleInfo.articleTitle" required
                               :class="fieldClassName(formstate.article_title)">
                        <field-messages name="article_title" show="$touched || $submitted" class="form-control-callback">
                          <div slot="required" class="error">文章标题不能为空</div>
                        </field-messages>
                      </div>
                    </validate>
                    <field class="form-group">
                      <label class="col-sm-3 control-label">文章来源：</label>
                      <div class="col-sm-4">
                        <input type="text" name="article_source " class="form-control" v-model="articleInfo.articleSource ">
                      </div>
                    </field>
                    <field class="form-group">
                      <label class="col-sm-3 control-label">文章作者：</label>
                      <div class="col-sm-4">
                        <input type="text" name="article_author" class="form-control" v-model="articleInfo.articleAuthor">
                      </div>
                    </field>
                    <field class="form-group">
                      <label class="col-sm-3 control-label">排序：</label>
                      <div class="col-sm-4">
                        <input type="number" name="article_sort" class="form-control" v-model="articleInfo.articleSort">
                      </div>
                    </field>

                    <field class="form-group">
                      <label class="col-sm-3 control-label">是否发布：</label>
                      <div class="col-sm-4">
                        <el-radio class="radio" name="is_publish" v-model="articleInfo.isPublish" :label="1">是</el-radio>
                        <el-radio class="radio" name="is_publish" v-model="articleInfo.isPublish" :label="0">否</el-radio>
                      </div>
                    </field>
                    <field class="form-group">
                      <label class="col-sm-3 control-label">是否外链：</label>
                      <div class="col-sm-4">
                        <el-radio class="radio" name="is_jump" v-model="articleInfo.isJump" :label="1">是</el-radio>
                        <el-radio class="radio" name="is_jump" v-model="articleInfo.isJump" :label="0">否</el-radio>
                      </div>
                    </field>
                    <div class="hr-line-dashed"></div>
                    <div class="form-group draggable ui-draggable">
                      <div class="col-sm-12 col-sm-offset-3">
                        <button class="btn btn-primary" type="submit">确定</button>
                        <button class="btn btn-white m-l-sm" type="reset" @click="onReset">重置</button>
                      </div>
                    </div>
                  </vue-form>
                </el-tab-pane>
                <el-tab-pane label="文章内容" name="second" :disabled="true"></el-tab-pane>
                <el-tab-pane label="SEO信息" name="third" :disabled="true"></el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import HjCrumb from '../comms/BreadCrumb.vue'
  import vueForm from 'vue-form'
  export default{
    components: {
      HjCrumb
    },
    mixins: [vueForm],
    data(){
      return {
        CrumbBox: {
          CrumbList: [
            {
              title: '文章管理',
              url: '/article/list'
            },
            {
              title: '文章列表',
              url: '/article/list'
            },
            {
              title: '添加文章',
              url: ''
            }
          ]
        },
        activeName:'first',
        formstate: {},
        articleCateList: [],
        articleCateProps: {
          value: 'id',
          label: 'article_cate_name'
        },
        articleInfo: {
          articleCateId: null,
          articleCateIds:[],
          articleTitle: '',
          articleSource: '',
          articleAuthor: '',
          articleSort: '',
          isPublish: 0,
          isJump: 0
        }
      }
    },
    methods: {
      fieldClassName: function (field) {
        if (!field) {
          return '';
        } else if ((field.$touched || field.$submitted) && field.$invalid) {
          return 'error';
        }
      },
      getArticleCateList () {
        var that = this;
        that.$http({
          method: 'post',
          url: '/article_category/listdata'
        }).then(function (res) {
          if(res.data.error=='0'){
            that.articleCateList = res.data.data.table_data;
          }else{
            that.$message({
              type: 'error',
              message: res.data.desc
            });
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      changeArticleCate (value) {
        this.articleInfo.articleCateId = value[value.length - 1];
        this.articleInfo.articleCateIds=value;
      },
      onSubmit: function () {
        var that = this;
        if (this.formstate.$valid) {
          that.$http({
            method: 'post',
            url: '/article/addsubmit',
            params: {
              article_cate_id: that.articleInfo.articleCateId,
              article_cate_ids: that.articleInfo.articleCateIds.join(','),
              article_title: that.articleInfo.articleTitle,
              article_source: that.articleInfo.articleSource,
              article_author: that.articleInfo.articleAuthor,
              article_sort: that.articleInfo.articleSort,
              is_publish: that.articleInfo.isPublish,
              is_jump: that.articleInfo.isJump
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '文章添加成功!'
              });
              that.$router.push('/article/list/edit/'+res.data.data.article_id);
            }else{
              that.$message({
                type: 'error',
                message: res.data.desc
              });
            }
          }).catch(function (error) {
            that.$message({
              type: 'error',
              message: '文章添加失败，请重新提交!'
            });
          });
        }
      },
      onReset () {
        this.formstate._reset();
        this.articleInfo = {
          articleCateId: null,
          articleCateIds:[],
          articleTitle: '',
          articleSource: '',
          articleAuthor: '',
          articleSort: '',
          isPublish: 0,
          isJump: 0
        }
      }
    },
    mounted () {
      this.getArticleCateList();
    }
  }
</script>

<style scoped>
  .radio-option {
    width: 33.3333%;
    float: left;
    margin-top: 4px;
    margin-bottom: 4px;
  }

  .radio-option label {
    margin-left: 4px;
    margin-bottom: 0;
    line-height: 22px;
    vertical-align: middle;
  }

  .el-cascader {
    width: 100%;
  }

  .error .el-input__inner {
    border: 1px dotted #cc5965 !important;
  }
</style>
