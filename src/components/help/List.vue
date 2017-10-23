<template>
  <div>
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-content">
              <form action="#" class="form-inline m-b-sm" role="form">
                <el-dropdown class="m-r-xs m-b-sm">
                  <el-button type="warning">
                    批量操作&nbsp;&nbsp;&nbsp;&nbsp;<i class="el-icon-caret-bottom el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><span @click="remove">批量删除</span></el-dropdown-item>
                    <el-dropdown-item><span @click="batchPublish">批量发布</span></el-dropdown-item>
                    <el-dropdown-item><span @click="batchWithdrawal">批量撤回</span></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-input class="m-r-xs m-b-sm" name="keyword" v-model="keyword" placeholder="帮助内容"></el-input>
                <el-input class="m-r-xs m-b-sm" name="articleCateId" v-model="articleCateId" placeholder="帮助分类ID"></el-input>
                <el-select class="m-r-xs m-b-sm" name="is_publish" v-model="isPublish">
                  <el-option :key="null" label="是否发布" :value="null"></el-option>
                  <el-option :key="0" label="未发布" value="0"></el-option>
                  <el-option :key="1" label="已发布" value="1"></el-option>
                </el-select>
                <el-button class="search-btn" type="primary" icon="search" @click="getArticleList(1,pageData.Perpage,true)">筛选</el-button>
                <router-link to="/help/list/add" class="add-btn"><i class="shop icon-xinzeng"></i> 添加帮助信息</router-link>
                <!--<div class="form-group m-r-xs m-t-xs">-->
                  <!--<input type="text" class="form-control" name="keyword" placeholder="帮助内容" v-model="keyword">-->
                <!--</div>-->
                <!--<div class="form-group m-r-xs m-t-xs">-->
                  <!--<input type="text" class="form-control" name="articleCateId" placeholder="帮助分类ID"-->
                         <!--v-model="articleCateId">-->
                <!--</div>-->
                <!--<div class="form-group m-r-xs m-t-xs">-->
                  <!--<select class="form-control" name="is_publish" v-model="isPublish">-->
                    <!--<option :value="null">是否发布</option>-->
                    <!--<option value="0">未发布</option>-->
                    <!--<option value="1">已发布</option>-->
                  <!--</select>-->
                <!--</div>-->
                <!--<div class="form-group m-r-xs m-t-xs">-->
                  <!--<button type="button" class="btn btn-primary" @click="getArticleList(1,pageData.Perpage,true)">查询-->
                  <!--</button>-->
                <!--</div>-->
              </form>
              <!--<div class="btn-group m-b-md">-->
                <!--<button type="button" class="btn btn-primary m-r-xs" @click="remove">批量删除</button>-->
                <!--<button type="button" class="btn btn-primary m-r-xs" @click="batchPublish">批量发布</button>-->
                <!--<button type="button" class="btn btn-primary m-r-xs" @click="batchWithdrawal">批量撤回</button>-->
                <!--<router-link to="/help/list/add" class="btn btn-warning m-r-xs">添加帮助信息</router-link>-->
              <!--</div>-->
              <div class="table-responsive clearfix">
                <table class="table table-striped table-bordered table-hover">
                  <thead>
                  <tr>
                    <th class="table-checkbox">
                      <div class="checkbox-square-green" :class="{'checked':checkAllFlag}"
                           @click="checkedAll(articleList)">
                        <input type="checkbox" class="checks">
                      </div>
                    </th>
                    <th>帮助标题</th>
                    <th>帮助分类</th>
                    <th>排序</th>
                    <th>是否发布</th>
                    <th>添加时间</th>
                    <th>发布时间</th>
                    <th class="opt-select">操作</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item,index) in articleList">
                    <td>
                      <div class="checkbox-square-green" :class="{'checked':item.isChecked}"
                           @click="chkSelectAndAll(articleList,item)">
                        <input type="checkbox" class="checks">
                      </div>
                    </td>
                    <td>{{item.article_title}}</td>
                    <td>{{item.article_cate_name}}</td>
                    <td>
                      <input type="number" v-model="item.article_sort" @blur="sort(item)" @keyup.enter="sort(item)">
                    </td>
                    <td>
                      <!--<el-switch-->
                        <!--v-model="item.is_publish"-->
                        <!--on-text=""-->
                        <!--off-text="" :on-value="1" :off-value="0" @change="changeIsPublish(item)">-->
                      <!--</el-switch>-->
                      {{item.is_publish==1?'是':'否'}}
                    </td>
                    <td>{{item.time_create}}</td>
                    <td>{{item.time_publish}}</td>
                    <td class="opt">
                      <span class="opt-down shop icon-shezhicaozuo" @click.stop="viewOpt(articleList,'id',item.id)"></span>
                      <ul v-show="item.isOptShow">
                        <li v-if="index!=0" @click="toTop(item)"><a href="javascript:;">置顶</a></li>
                        <li @click="removeSingle(item.id)"><a href="javascript:;">删除</a></li>
                        <li><router-link :to="'/help/list/edit/'+item.id">编辑</router-link></li>
                        <li v-if="item.is_publish==0" @click="changeIsPublish(item)"><a href="javascript:;">发布</a></li>
                        <li v-if="item.is_publish==1" @click="changeIsPublish(item)"><a href="javascript:;">取消发布</a></li>
                      </ul>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <div v-if="articleList.length==0" class="text-center">暂无信息</div>
                <div class="hj_fr">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageData.PageID"
                    :page-sizes="PSLists"
                    :page-size="pageData.Perpage"
                    v-show="articleList.length>0"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageData.Results">
                  </el-pagination>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import HjCrumb from '../comms/BreadCrumb.vue'
  import {CustomFun, pageSizes} from '../comms/main.js'
  export default{
    components: {
      HjCrumb
    },
    data () {
      return {
        CrumbBox: {
          CrumbList: [
            {
              title: '内容管理',
              url: '/help/list'
            },
            {
              title: '帮助管理',
              url: '/help/list'
            },
            {
              title: '帮助列表',
              url: ''
            }
          ]
        },
        articleList: [],
        keyword: "",
        articleCateId: '',
        isPublish: null,
        checkAllFlag: false,
        selectedList: [],
        PSLists: pageSizes,
        pageData: {
          PageID: 1,
          Perpage: 10,
          Results: 1,
          Pages: 1
        },
        queryFlag: false
      }
    },
    methods: {
      viewOpt: CustomFun.viewOpt,
      checkedAll: CustomFun.checkedAll,
      chkSelectAndAll: CustomFun.chkSelectAndAll,
      /*
       * pageID 请求的是第几页
       * Perpage 每页几条数据
       * flag true代表有查询条件，false代表无查询条件
       * */
      getArticleList (pageID, Perpage, flag) {
        var that = this;
        that.queryFlag = flag;
        that.checkAllFlag = false;
        that.selectedList = [];
        var paramObj = {
          PageID: pageID,
          Perpage: Perpage
        };
        if (flag) {
          if (that.keyword != "") {
            paramObj["keyword"] = that.keyword;
          }
          if (that.articleCateId != "") {
            paramObj["article_cate_id"] = that.articleCateId;
          }
          if (that.isPublish) {
            paramObj["is_publish"] = that.isPublish;
          }
        } else {
          that.keyword = "";
          that.articleCateId = "";
          that.isPublish = null;
        }
        that.$http({
          method: 'post',
          url: '/help/listdata',
          params: paramObj
        }).then(function (res) {
          if(res.data.error=='0'){
            that.articleList = res.data.data.table_data;
            that.pageData.Results = res.data.data.Results;
            that.pageData.Pages = res.data.data.Pages;
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
      handleSizeChange(val) {
        this.pageData.Perpage = val;
        this.getArticleList(1, this.pageData.Perpage, this.queryFlag);
      },
      handleCurrentChange(val) {
        this.getArticleList(val, this.pageData.Perpage, this.queryFlag);
      },
      sort (item) {
        var that = this;
        that.$http({
          method: 'post',
          url: '/help/editsubmit',
          params: {
            id: item.id,
            article_sort: item.article_sort
          }
        }).then(function (res) {
          if(res.data.error=='0'){
            that.getArticleList(1, that.pageData.Perpage, that.queryFlag);
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
      changeIsPublish(item){
        var that = this;
        var flag = item.is_publish==1 ? 0 : 1;
        that.$http({
          method: 'post',
          url: '/help/editsubmit',
          params: {
            id: item.id,
            is_publish: flag
          }
        }).then(function (res) {
          if(res.data.error=='0'){
            that.getArticleList(1, that.pageData.Perpage, that.queryFlag);
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
      toTop(item){
        var that = this;
        that.$http({
          method: 'post',
          url: '/help/editsubmit',
          params: {
            id: item.id,
            is_top_page: 1
          }
        }).then(function (res) {
          if(res.data.error=='0'){
            that.getArticleList(1, that.pageData.Perpage, that.queryFlag);
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
      remove () {
        var that = this;
        if (that.selectedList.length > 0) {
          var selectedId = [];
          that.selectedList.forEach(function (item, index) {
            selectedId.push(item.id);
          })
          this.$confirm('确认删除此帮助信息吗？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal:false
          }).then(() => {
            that.$http({
              method: 'post',
              url: '/help/batchsubmit',
              params: {
                article_ids: selectedId.join(','),
                method: "-2"
              }
            }).then(function (res) {
              if(res.data.error=='0'){
                that.$message({
                  type: 'success',
                  message: '帮助信息删除成功!'
                });
                that.getArticleList(1, that.pageData.Perpage, that.queryFlag);
              }else{
                that.$message({
                  type: 'error',
                  message: res.data.desc
                });
              }
            }).catch(function (error) {
              console.log(error);
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            });
          });
        } else {
          this.$message({
            type: 'warning',
            message: '请至少选择一条数据!'
          });
        }
      },
      removeSingle (id) {
        var that = this;
        this.$confirm('确认删除此帮助信息吗？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal:false
        }).then(() => {
          that.$http({
            method: 'post',
            url: '/help/batchsubmit',
            params: {
              article_ids: id,
              method: "-2"
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '帮助信息删除成功!'
              });
              that.getArticleList(1, that.pageData.Perpage, that.queryFlag);
            }else{
              that.$message({
                type: 'error',
                message: res.data.desc
              });
            }
          }).catch(function (error) {
            console.log(error);
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      batchPublish () {
        var that = this;
        if (that.selectedList.length > 0) {
          var selectedId = [];
          var isRight = true;
          that.selectedList.forEach(function (item, index) {
            if (item.is_publish) {
              that.$message({
                type: 'warning',
                message: '所选项包含已发布帮助，请重新选择!'
              });
              isRight = false;
              return;
            } else {
              selectedId.push(item.id);
            }
          })
          if (isRight) {
            this.$confirm('确认发布此帮助信息吗？', '提示', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning',
              closeOnClickModal:false
            }).then(() => {
              that.$http({
                method: 'post',
                url: '/help/batchsubmit',
                params: {
                  article_ids: selectedId.join(','),
                  method: "1"
                }
              }).then(function (res) {
                if(res.data.error=='0'){
                  that.$message({
                    type: 'success',
                    message: '帮助信息发布成功!'
                  });
                  that.getArticleList(1, that.pageData.Perpage, that.queryFlag);
                }else{
                  that.$message({
                    type: 'error',
                    message: res.data.desc
                  });
                }
              }).catch(function (error) {
                console.log(error);
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消操作'
              });
            });
          }
        } else {
          this.$message({
            type: 'warning',
            message: '请至少选择一条数据!'
          });
        }
      },
      publishSingle (id) {
        var that = this;
        this.$confirm('确认发布此帮助信息吗？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal:false
        }).then(() => {
          that.$http({
            method: 'post',
            url: '/help/batchsubmit',
            params: {
              article_ids: id,
              method: "1"
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '帮助信息发布成功!'
              });
              that.getArticleList(1, that.pageData.Perpage, that.queryFlag);
            }else{
              that.$message({
                type: 'error',
                message: res.data.desc
              });
            }
          }).catch(function (error) {
            console.log(error);
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      batchWithdrawal () {
        var that = this;
        if (that.selectedList.length > 0) {
          var selectedId = [];
          that.selectedList.forEach(function (item, index) {
            selectedId.push(item.id);
          })
          this.$confirm('确认撤回此帮助信息吗？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal:false
          }).then(() => {
            that.$http({
              method: 'post',
              url: '/help/batchsubmit',
              params: {
                article_ids: selectedId.join(','),
                method: "-1"
              }
            }).then(function (res) {
              if(res.data.error=='0'){
                that.$message({
                  type: 'success',
                  message: '帮助信息撤回成功!'
                });
                that.getArticleList(1, that.pageData.Perpage, that.queryFlag);
              }else{
                that.$message({
                  type: 'error',
                  message: res.data.desc
                });
              }
            }).catch(function (error) {
              console.log(error);
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            });
          });
        } else {
          this.$message({
            type: 'warning',
            message: '请至少选择一条数据!'
          });
        }
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.getArticleList(1, this.pageData.Perpage, false);
        // 点击操作以外的地方，操作隐藏
        var that = this;
        document.addEventListener("click", function (event) {
          if (!this.contains(this.$el, event.target)) {
            if (that.articleList.length > 0) {
              that.articleList.forEach(function (item, index) {
                if (typeof item.isOptShow == "undefined") {
                  that.$set(item, "isOptShow", false);
                } else {
                  item.isOptShow = false;
                }
              })
            }
          }
        }, false);
      })
    }
  }
</script>

<style scoped>

</style>
