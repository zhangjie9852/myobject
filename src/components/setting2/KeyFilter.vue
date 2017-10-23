<template>
  <div>
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-content">
              <form action="#" class="form-inline m-b-sm" role="form">
                <!--<div class="form-group m-r-xs m-t-xs">
                  <input type="text" class="form-control" name="keyword" placeholder="敏感关键词" v-model="keyword">
                </div>
                <div class="form-group m-r-xs m-t-xs">
                  <button type="button" class="btn btn-primary" @click="getSensitiveList(1,pageData.Perpage,true)">查询</button>
                </div>
                <div class="form-group m-r-xs m-t-xs">
                  <button type="button" class="btn btn-primary" @click="remove">批量删除</button>
                </div>
                <div class="form-group m-r-xs m-t-xs">
                  <router-link to="/setting2/keyfilter/add" class="btn btn-warning">添加敏感词</router-link>
                </div>-->
                <el-button  type="warning" class="m-r-sm" @click="remove">批量删除</el-button>
                <el-input class="m-r-sm m-b-sm" name="keyword" v-model="keyword" placeholder="敏感关键词"></el-input>
                <el-button class="search-btn" type="primary" icon="search" @click="getSensitiveList(1,pageData.Perpage,true)">筛选</el-button>
                <router-link to="/setting2/keyfilter/add" class="add-btn"><i class="shop icon-xinzeng"></i>添加敏感词</router-link>
              </form>
              <div class="table-responsive clearfix">
                <table class="table table-striped table-bordered table-hover">
                  <thead>
                  <tr>
                    <th class="table-checkbox">
                      <div class="checkbox-square-green" :class="{'checked':checkAllFlag}" @click="checkedAll(sensitiveList)">
                        <input type="checkbox" class="checks">
                      </div>
                    </th>
                    <th>敏感词内容</th>
                    <th>创建时间</th>
                    <th class="opt-select">操作</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item,index) in sensitiveList">
                    <td>
                      <div class="checkbox-square-green" :class="{'checked':item.isChecked}" @click="chkSelectAndAll(sensitiveList,item)">
                        <input type="checkbox" class="checks">
                      </div>
                    </td>
                    <td>{{item.sen_content}}</td>
                    <td>{{item.time_create}}</td>
                    <td class="opt">
                      <!--<div class="opt" @click.stop="viewOpt(sensitiveList,'id',item.id)">处理<i class="fa fa-caret-down"></i></div>-->
                      <span class="opt-down shop icon-shezhicaozuo" @click.stop="viewOpt(sensitiveList,'id',item.id)"></span>
                      <ul v-show="item.isOptShow">
                        <li @click="removeSingle(item.id)"><a href="javascript:;"> 删除</a></li>
                        <li><router-link :to="'/setting2/keyfilter/edit/'+item.id">编辑</router-link></li>
                      </ul>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <div v-if="sensitiveList.length==0" class="text-center">暂无信息</div>
                <div class="hj_fr">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageData.PageID"
                    :page-sizes="PSLists"
                    :page-size="pageData.Perpage"
                    v-show="sensitiveList.length>0"
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
  import {CustomFun,pageSizes} from '../comms/main.js'
  export default{
    components:{
      HjCrumb
    },
    data () {
      return {
        CrumbBox:{
          CrumbList:
            [
              {
                title:'系统设置',
                url:'/setting2/keyfilter'
              },
              {
                title:'高级设置',
                url:'/setting2/keyfilter'
              },
              {
                title:'敏感词过滤',
                url:''
              }
            ]
        },
        sensitiveList:[],
        keyword:"",
        checkAllFlag:false,
        selectedList:[],
        PSLists:pageSizes,
        pageData:{
          PageID:1,
          Perpage:10,
          Results:1,
          Pages:1
        },
        queryFlag:false
      }
    },
    methods:{
      viewOpt:CustomFun.viewOpt,
      checkedAll:CustomFun.checkedAll,
      chkSelectAndAll:CustomFun.chkSelectAndAll,
      /*
       * pageID 请求的是第几页
       * Perpage 每页几条数据
       * flag true代表有查询条件，false代表无查询条件
       * */
      getSensitiveList (pageID,Perpage,flag) {
        var that=this;
        that.queryFlag=flag;
        that.checkAllFlag=false;
        that.selectedList=[];
        var paramObj={
          PageID:pageID,
          Perpage:Perpage
        };
        if(flag){
          if(that.keyword!=""){
            paramObj["keyword"]=that.keyword;
          }
        }else{
          that.keyword="";
        }
        that.$http({
          method:'post',
          url: '/setting_sensitive/listdata',
          params:paramObj
        }).then(function (res) {
          console.log(res);
          if(res.data.error=='0'){
            that.sensitiveList=res.data.data.table_data;
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
        this.getSensitiveList(1,this.pageData.Perpage,this.queryFlag);
      },
      handleCurrentChange(val) {
        this.getSensitiveList(val,this.pageData.Perpage,this.queryFlag);
      },
      remove () {
        var that=this;
        if(that.selectedList.length>0){
          var selectedId=[];
          that.selectedList.forEach(function(item,index){
            selectedId.push(item.id);
          })
          if(selectedId.length>0){
            this.$confirm('确认删除此敏感词吗？', '提示', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              that.$http({
                method:'post',
                url: '/setting_sensitive/batchsubmit',
                params:{
                  sen_ids:selectedId.join(','),
                  method:-2
                }
              }).then(function (res) {
                if(res.data.error=='0'){
                  that.$message({
                    type: 'success',
                    message: '敏感词删除成功!'
                  });
                  that.getSensitiveList(1,that.pageData.Perpage,that.queryFlag);
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
        }else{
          this.$message({
            type: 'warning',
            message: '请至少选择一条数据!'
          });
        }
      },
      removeSingle (id) {
        var that=this;
        this.$confirm('确认删除此敏感词吗？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$http({
            method:'post',
            url: '/setting_sensitive/batchsubmit',
            params:{
              sen_ids:id,
              method:-2
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '敏感词删除成功!'
              });
              that.getSensitiveList(1,that.pageData.Perpage,that.queryFlag);
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
    },
    mounted () {
      this.$nextTick(function () {
        this.getSensitiveList(1,this.pageData.Perpage,false);
        // 点击操作以外的地方，操作隐藏
        var that=this;
        document.addEventListener("click",function(event){
          if(!this.contains(this.$el,event.target)){
            if(that.sensitiveList.length>0){
              that.sensitiveList.forEach(function (item,index) {
                if(typeof item.isOptShow=="undefined"){
                  that.$set(item,"isOptShow",false);
                }else{
                  item.isOptShow=false;
                }
              })
            }
          }
        },false);
      })
    }
  }
</script>

<!--<style scoped>
  .table thead tr th,.table tbody tr td{
    text-align: center;
    vertical-align: middle;
  }
  .table thead tr .opt-select{
    text-align: right;
    padding-right: 20px;
  }
  .table tbody tr .opt-select{
    position: relative;
    text-align: right;
  }
  .opt-select .opt{
    display: inline-block;
    cursor: pointer;
  }
  .opt-select .opt i{
    margin-left:5px;
  }
  .opt-select ul{
    margin-top: 12px;
    background-color: #fff;
    border: 1px solid #d2d2d2;
    padding: 0 8px;
    text-align: left;
    position: absolute;
    right: 0;
    top: 50%;
    z-index: 1000;
  }
  .opt-select ul li{
    line-height:32px;
    border-top:1px dashed #d2d2d2;
  }
  .opt-select ul li:first-child{
    border-top:0;
  }
  .opt-select ul li a{
    color: #676a6c;
  }
  .opt-select ul li:hover a{
    color:#3EA0C4;
  }
</style>-->
