<template>
  <div id="MemberAdd">
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-content p-m">
              <div class="hd-title">编辑文章分类</div>
              <el-tabs v-model="activeName" type="card" @tab-click="changeTab">
                <el-tab-pane label="基本信息" name="first">
                  <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t">
                    <validate class="form-group">
                      <label class="col-sm-3 control-label"><span class="f-c-r">*</span>分类名称：</label>
                      <div class="col-sm-4">
                        <input type="text" name="article_cate_name" class="form-control" v-model="articleCateInfo.articleCateName"
                               required
                               :class="fieldClassName(formstate.article_cate_name)">
                        <field-messages name="article_cate_name" show="$touched || $submitted"
                                        class="form-control-callback">
                          <div slot="required" class="error">分类名称不能为空</div>
                        </field-messages>
                      </div>
                    </validate>
                    <field class="form-group">
                      <label class="col-sm-3 control-label">上级分类：</label>
                      <div class="col-sm-4" style="padding-top: 7px; padding-bottom: 7px;">{{articleCateInfo.parentName}}</div>
                    </field>
                    <field class="form-group">
                      <label class="col-sm-3 control-label">排序：</label>
                      <div class="col-sm-4">
                        <input type="number" name="displayorder" class="form-control" v-model="articleCateInfo.displayorder">
                      </div>
                    </field>
                    <field class="form-group">
                      <label class="col-sm-3 control-label">分类状态：</label>
                      <div class="col-sm-4">
                        <el-radio class="radio" name="status_article_cate" v-model="articleCateInfo.cateStatus" :label="1">正常</el-radio>
                        <el-radio class="radio" name="status_article_cate" v-model="articleCateInfo.cateStatus" :label="-1">停用</el-radio>
                        <el-radio class="radio" name="status_article_cate" v-model="articleCateInfo.cateStatus" :label="-2">逻辑删除</el-radio>
                      </div>
                    </field>
                    <div class="hr-line-dashed"></div>
                    <div class="form-group draggable ui-draggable">
                      <div class="col-sm-12 col-sm-offset-3">
                        <!--<button class="btn btn-primary" type="submit">确定</button>-->
                        <!--<router-link to="/article/category" class="btn btn-white m-l-sm">返回列表</router-link>-->
                        <el-button type="primary" native-type="submit">确定</el-button>
                        <router-link to="/article/category" class="white-btn m-l-sm">返回列表</router-link>
                      </div>
                    </div>
                  </vue-form>
                </el-tab-pane>
                <el-tab-pane label="SEO信息" name="second">
                  <div class="form-horizontal m-t">
                    <div class="form-group">
                      <label class="col-sm-3 control-label">页面标题：</label>
                      <div class="col-sm-4">
                        <input type="text" name="seo_title" class="form-control"
                               v-model="articleCateInfo.seoTitle">
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="col-sm-3 control-label">页面关键词：</label>
                      <div class="col-sm-4">
                        <input type="text" name="seo_keywords" class="form-control"
                               v-model="articleCateInfo.seoKeywords">
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="col-sm-3 control-label">页面描述：</label>
                      <div class="col-sm-4">
                        <input type="text" name="seo_description" class="form-control"
                               v-model="articleCateInfo.seoDescription">
                      </div>
                    </div>
                    <div class="hr-line-dashed"></div>
                    <div class="form-group draggable ui-draggable">
                      <div class="col-sm-12 col-sm-offset-3">
                        <!--<button class="btn btn-primary" @click="seoConfirm">确定</button>-->
                        <!--<router-link to="/article/category" class="btn btn-white m-l-sm">返回列表</router-link>-->
                        <el-button type="primary" @click="seoConfirm">确定</el-button>
                        <router-link to="/article/category" class="white-btn m-l-sm">返回列表</router-link>
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
              title: '文章分类管理',
              url: '/article/category'
            },
            {
              title: '文章分类列表',
              url: '/article/category'
            },
            {
              title: '编辑文章分类',
              url: ''
            }
          ]
        },
        activeName: 'first',
        curActiveName:'first',
        formstate: {},
        articleCateId: '',
        articleCateInfo: {
          articleCateName: '',
          parentName:'',
          displayorder:'',
          cateStatus:1,
          seoTitle: '',
          seoKeywords: '',
          seoDescription: ''
        },
        articleCateInfoTemp:{}
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
      getArticleCateInfo () {
        var that = this;
        that.$http({
          method: 'post',
          url: '/article_category/infodata',
          params: {
            article_cate_id: that.articleCateId
          }
        }).then(function (res) {
          console.log(res);
          if(res.data.error=='0'){
            that.articleCateInfo = {
              articleCateName: res.data.data.article_cate_name,
              parentName:'',
              displayorder:res.data.data.displayorder,
              cateStatus:res.data.data.status_article_cate,
              seoTitle: res.data.data.seo_title,
              seoKeywords: res.data.data.seo_keywords,
              seoDescription: res.data.data.seo_description
            };
            if(res.data.data.parent_id){
              that.$http({
                method: 'post',
                url: '/article_category/infodata',
                params: {
                  article_cate_id: res.data.data.parent_id
                }
              }).then(function (response) {
                if(response.data.error=='0'){
                  that.articleCateInfo.parentName=response.data.data.article_cate_name;
                  that.objectAssign(that.articleCateInfoTemp,that.articleCateInfo);
                }else {
                  that.$message({
                    type: 'error',
                    message: response.data.desc
                  });
                }
              }).catch(function (error) {
                console.log(error);
              });
            }else{
              that.articleCateInfo.parentName='顶级分类';
              that.objectAssign(that.articleCateInfoTemp,that.articleCateInfo);
            }
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
      onSubmit: function () {
        var that = this;
        if (this.formstate.$valid) {
          that.$http({
            method: 'post',
            url: '/article_category/editsubmit',
            params: {
              id:that.articleCateId,
              article_cate_name: that.articleCateInfo.articleCateName,
              displayorder: that.articleCateInfo.displayorder,
              status_article_cate: that.articleCateInfo.cateStatus
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '文章分类修改成功!'
              });
              that.objectAssign(that.articleCateInfoTemp,that.articleCateInfo);
            }else{
              that.$message({
                type: 'error',
                message: res.data.desc
              });
            }
          }).catch(function (error) {
            that.$message({
              type: 'error',
              message: '文章分类修改失败，请重新提交!'
            });
          });
        }
      },
      seoConfirm () {
        var that = this;
        that.$http({
          method: 'post',
          url: '/article_category/editsubmit',
          params: {
            id:that.articleCateId,
            seo_title: that.articleCateInfo.seoTitle,
            seo_keywords: that.articleCateInfo.seoKeywords,
            seo_description: that.articleCateInfo.seoDescription
          }
        }).then(function (res) {
          if(res.data.error=='0'){
            that.$message({
              type: 'success',
              message: '文章分类修改成功!'
            });
            that.objectAssign(that.articleCateInfoTemp,that.articleCateInfo);
          }else{
            that.$message({
              type: 'error',
              message: res.data.desc
            });
          }
        }).catch(function (error) {
          that.$message({
            type: 'error',
            message: '文章分类修改失败，请重新提交!'
          });
        });
      },
      changeTab (target) {
        var that=this;
        setTimeout(function(){
          that.activeName=that.curActiveName;
        },20);
        if(!UnderScore.isEqual(that.articleCateInfo, that.articleCateInfoTemp)){
          this.$confirm('内容已修改，为使数据不丢失，请先保存再离开！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal:false
          }).then(() => {
            // 留在当前选项卡页面
          }).catch(() => {
            that.objectAssign(that.articleCateInfo,that.articleCateInfoTemp);
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
      this.articleCateId = this.$route.params.id;
    },
    mounted () {
      this.getArticleCateInfo();
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
