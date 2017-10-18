<template>
  <div id="MemberAdd">
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-title">
              <h5>编辑文章</h5>
            </div>
            <div class="ibox-content">
              <el-tabs v-model="activeName" type="card" @tab-click="changeTab">
                <el-tab-pane label="基本信息" name="first">
                  <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t">
                    <validate class="form-group">
                      <label class="col-sm-3 control-label"><span class="f-c-r">*</span> 文章分类：</label>
                      <div class="col-sm-4">
                        <input type="hidden" name="article_cate_id" v-model="articleInfo.articleCateId" required>
                        <el-cascader name="article-cate-arr"
                                     :class="fieldClassName(formstate.article_cate_id)"
                                     :options="articleCateList"
                                     :props="articleCateProps"
                                     v-model="articleInfo.articleCateIds"
                                     @change="changeArticleCate"
                                     change-on-select
                        ></el-cascader>
                        <field-messages name="article_cate_id" show="$touched || $submitted"
                                        class="form-control-callback">
                          <div slot="required" class="error">文章分类不能为空</div>
                        </field-messages>
                      </div>
                    </validate>
                    <validate class="form-group">
                      <label class="col-sm-3 control-label"><span class="f-c-r">*</span>文章标题：</label>
                      <div class="col-sm-4">
                        <input type="text" name="article_title" class="form-control" v-model="articleInfo.articleTitle"
                               required
                               :class="fieldClassName(formstate.article_title)">
                        <field-messages name="article_title" show="$touched || $submitted"
                                        class="form-control-callback">
                          <div slot="required" class="error">文章标题不能为空</div>
                        </field-messages>
                      </div>
                    </validate>
                    <field class="form-group">
                      <label class="col-sm-3 control-label">文章来源：</label>
                      <div class="col-sm-4">
                        <input type="text" name="article_source " class="form-control"
                               v-model="articleInfo.articleSource ">
                      </div>
                    </field>
                    <field class="form-group">
                      <label class="col-sm-3 control-label">文章作者：</label>
                      <div class="col-sm-4">
                        <input type="text" name="article_author" class="form-control"
                               v-model="articleInfo.articleAuthor">
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
                        <router-link to="/article/list" class="btn btn-white m-l-sm">返回列表</router-link>
                      </div>
                    </div>
                  </vue-form>
                </el-tab-pane>
                <el-tab-pane label="文章内容" name="second">
                  <div class="form-horizontal m-t">
                    <div class="form-group">
                      <label class="col-sm-3 control-label">文章摘要：</label>
                      <div class="col-sm-6">
                        <textarea rows="5" class="form-control" name="article_summary"
                                  v-model="articleInfo.articleSummary"></textarea>
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="col-sm-3 control-label">文章内容：</label>
                      <div class="col-sm-8">
                        <script id="editor" ref="editor" type="text/plain" style="width:100%;height:200px;"></script>
                      </div>
                    </div>
                    <div class="hr-line-dashed"></div>
                    <div class="form-group draggable ui-draggable">
                      <div class="col-sm-12 col-sm-offset-3">
                        <button class="btn btn-primary" @click="articleConfirm">确定</button>
                        <router-link to="/article/list" class="btn btn-white m-l-sm">返回列表</router-link>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="SEO信息" name="third">
                  <div class="form-horizontal m-t">
                    <div class="form-group">
                      <label class="col-sm-3 control-label">页面标题：</label>
                      <div class="col-sm-4">
                        <input type="text" name="seo_title" class="form-control"
                               v-model="articleInfo.seoTitle">
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="col-sm-3 control-label">页面关键词：</label>
                      <div class="col-sm-4">
                        <input type="text" name="seo_keywords" class="form-control"
                               v-model="articleInfo.seoKeywords">
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="col-sm-3 control-label">页面描述：</label>
                      <div class="col-sm-4">
                        <input type="text" name="seo_description" class="form-control"
                               v-model="articleInfo.seoDescription">
                      </div>
                    </div>
                    <div class="hr-line-dashed"></div>
                    <div class="form-group draggable ui-draggable">
                      <div class="col-sm-12 col-sm-offset-3">
                        <button class="btn btn-primary" @click="seoConfirm">确定</button>
                        <router-link to="/article/list" class="btn btn-white m-l-sm">返回列表</router-link>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import HjCrumb from '../comms/BreadCrumb.vue'
  import vueForm from 'vue-form'
  import UnderScore from 'underscore'
  import '../../../static/UEditor/ueditor.config'
  import '../../../static/UEditor/ueditor.all';
  import '../../../static/UEditor/lang/zh-cn/zh-cn';

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
              title: '编辑文章',
              url: ''
            }
          ]
        },
        activeName: 'first',
        curActiveName:'first',
        formstate: {},
        articleId: '',
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
          isJump: 0,
          articleSummary: '',
          articleContent: '',
          seoTitle: '',
          seoKeywords: '',
          seoDescription: ''
        },
        articleInfoTemp:{},
        ue: ''
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
      objectAssign (obj,oldObj) {
        for (var key in oldObj){
          obj[key]=oldObj[key];
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
      getArticleInfo () {
        var that = this;
        that.$http({
          method: 'post',
          url: '/article/infodata',
          params: {
            article_id: that.articleId
          }
        }).then(function (res) {
          if(res.data.error=='0'){
            that.articleInfo = {
              articleCateId: res.data.data.article_cate_id,
              articleCateIds:res.data.data.article_cate_ids.split(','),
              articleTitle: res.data.data.article_title,
              articleSource: res.data.data.article_source,
              articleAuthor: res.data.data.article_author,
              articleSort: res.data.data.article_sort,
              isPublish: res.data.data.is_publish ? 1 : 0,
              isJump: parseInt(res.data.data.is_jump),
              articleSummary: res.data.data.article_summary,
              articleContent: res.data.data.article_content,
              seoTitle: res.data.data.seo_title,
              seoKeywords: res.data.data.seo_keywords,
              seoDescription: res.data.data.seo_description
            };
            that.articleInfo.articleCateIds.forEach(function (item,index) {
              that.articleInfo.articleCateIds[index]=parseInt(that.articleInfo.articleCateIds[index]);
            });
            that.objectAssign(that.articleInfoTemp,that.articleInfo);
            UE.getEditor('editor').setContent(that.articleInfo.articleContent);
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
            url: '/article/editsubmit',
            params: {
              id: that.articleId,
              article_cate_id: that.articleInfo.articleCateId,
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
                message: '文章修改成功!'
              });
              that.objectAssign(that.articleInfoTemp,that.articleInfo);
            }else{
              that.$message({
                type: 'error',
                message: res.data.desc
              });
            }
          }).catch(function (error) {
            console.log(error);
            that.$message({
              type: 'error',
              message: '文章修改失败，请重新提交!'
            });
          });
        }
      },
      articleConfirm () {
        var that = this;
        that.articleInfo.articleContent = UE.getEditor('editor').getContent();
        that.$http({
          method: 'post',
          url: '/article/editsubmit',
          params: {
            id: that.articleId,
            article_summary:that.articleInfo.articleSummary,
            article_content:that.articleInfo.articleContent
          }
        }).then(function (res) {
          if(res.data.error=='0'){
            that.$message({
              type: 'success',
              message: '文章修改成功!'
            });
            that.objectAssign(that.articleInfoTemp,that.articleInfo);
          }else{
            that.$message({
              type: 'error',
              message: res.data.desc
            });
          }
        }).catch(function (error) {
          console.log(error);
          that.$message({
            type: 'error',
            message: '文章修改失败，请重新提交!'
          });
        });
      },
      seoConfirm () {
        var that = this;
        that.$http({
          method: 'post',
          url: '/article/editsubmit',
          params: {
            id: that.articleId,
            seo_title: that.articleInfo.seoTitle,
            seo_keywords: that.articleInfo.seoKeywords,
            seo_description: that.articleInfo.seoDescription
          }
        }).then(function (res) {
          if(res.data.error=='0'){
            that.$message({
              type: 'success',
              message: '文章修改成功!'
            });
            that.objectAssign(that.articleInfoTemp,that.articleInfo);
          }else{
            that.$message({
              type: 'error',
              message: res.data.desc
            });
          }
        }).catch(function (error) {
          console.log(error);
          that.$message({
            type: 'error',
            message: '文章修改失败，请重新提交!'
          });
        });
      },
      changeTab (target) {
        var that=this;
        setTimeout(function(){
          that.activeName=that.curActiveName;
        },20);
        if(!UnderScore.isEqual(that.articleInfo, that.articleInfoTemp)){
          this.$confirm('内容已修改，为使数据不丢失，请先保存再离开！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal:false
          }).then(() => {
            // 留在当前选项卡页面
          }).catch(() => {
            that.objectAssign(that.articleInfo,that.articleInfoTemp);
            that.activeName=target.name;
            that.curActiveName=target.name;
          });
        }else{
          that.activeName=target.name;
          that.curActiveName=target.name;
        }
      }
    },
    created () {
      this.articleId = this.$route.params.id;
    },
    mounted () {
      this.$nextTick(function () {
        var that=this;
        that.getArticleCateList();
        that.getArticleInfo();
        that.ue = UE.getEditor(that.$refs.editor.id,{
          BaseUrl: '',
          UEDITOR_HOME_URL: '/static/UEditor/',
          toolbars:[
            ['source', '|', 'undo', 'redo', '|',
              'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'pasteplain', '|', 'forecolor', 'backcolor', 'lineheight', '|',
              'paragraph', 'fontfamily', 'fontsize', '|',
              'indent', '|',
              'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',
              'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter','map', '|',
              'insertimage', 'insertvideo', 'attachment', '|',
              'horizontal', '|',
              'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', '|',
              'preview', 'searchreplace','drafts']
          ]
        });
        UE.getEditor('editor').ready(function () {
          UE.getEditor('editor').setContent(that.articleInfo.articleContent);
        });
      })
    },
    destroyed() {
      this.ue.destroy();
    }
  }
</script>

<style scoped>
  .el-cascader {
    width: 100%;
  }

  .error .el-input__inner {
    border: 1px dotted #cc5965 !important;
  }
</style>
