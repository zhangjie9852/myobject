<template>
  <div>
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-content">
              <form action="#" class="form-inline m-b-sm" role="form">
                <el-button type="warning" class="m-r-xs m-b-sm" @click="remove">批量删除</el-button>
                <el-input class="m-r-xs m-b-sm" name="userLogin" v-model="userLogin" placeholder="用户名"></el-input>
                <el-button class="search-btn" type="primary" icon="search" @click="getAdminList(1,pageData.Perpage,true)">筛选</el-button>
                <router-link to="/admin/list/add" class="add-btn"><i class="shop icon-xinzeng"></i> 添加管理员</router-link>
                <!--<div class="form-group m-r-xs m-t-xs">-->
                  <!--<input type="text" class="form-control" name="userLogin" placeholder="用户名" v-model="userLogin">-->
                <!--</div>-->
                <!--<div class="form-group m-r-xs m-t-xs">-->
                  <!--<button type="button" class="btn btn-primary" @click="getAdminList(1,pageData.Perpage,true)">查询</button>-->
                <!--</div>-->
                <!--<div class="form-group m-r-xs m-t-xs">-->
                  <!--<button type="button" class="btn btn-primary" @click="remove">批量删除</button>-->
                <!--</div>-->
                <!--<div class="form-group m-r-xs m-t-xs">-->
                  <!--<router-link to="/admin/list/add" class="btn btn-warning">添加管理员</router-link>-->
                <!--</div>-->
              </form>
              <div class="table-responsive clearfix">
                <table class="table table-striped table-bordered table-hover">
                  <thead>
                  <tr>
                    <th class="table-checkbox">
                      <div class="checkbox-square-green" :class="{'checked':checkAllFlag}" @click="checkedAll(adminList)">
                        <input type="checkbox" class="checks">
                      </div>
                    </th>
                    <th>用户名</th>
                    <th>所属店铺</th>
                    <th>管理员描述</th>
                    <th>添加时间</th>
                    <th>最后登录时间</th>
                    <th class="opt-select">操作</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item,index) in adminList">
                    <td>
                      <div class="checkbox-square-green" :class="{'checked':item.isChecked}" @click="chkSelectAndAll(adminList,item)">
                        <input type="checkbox" class="checks">
                      </div>
                    </td>
                    <td>{{item.user_login}}</td>
                    <td>{{item.goods_shop_base_name}}</td>
                    <td>{{item.user_remark}}</td>
                    <td>{{item.time_create}}</td>
                    <td>{{item.last_login_time}}</td>
                    <td class="opt">
                      <span class="opt-down shop icon-shezhicaozuo" @click.stop="viewOpt(adminList,'id',item.id)"></span>
                      <ul v-show="item.isOptShow">
                        <li><router-link :to="'/admin/list/edit/'+item.id">编辑</router-link></li>
                        <li @click="removeSingle(item.id)"><a href="javascript:;">删除</a></li>
                      </ul>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <div v-if="adminList.length==0" class="text-center">暂无信息</div>
                <div class="hj_fr">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageData.PageID"
                    :page-sizes="PSLists"
                    :page-size="pageData.Perpage"
                    v-show="adminList.length>0"
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
                url:'/admin/list'
              },
              {
                title:'权限管理',
                url:'/admin/list'
              },
              {
                title:'管理员列表',
                url:''
              }
            ]
        },
        adminList:[],
        userLogin:"",
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
      getAdminList (pageID,Perpage,flag) {
        var that=this;
        that.queryFlag=flag;
        that.checkAllFlag=false;
        that.selectedList=[];
        var paramObj={
          PageID:pageID,
          Perpage:Perpage
        };
        if(flag){
          if(that.userLogin!=""){
            paramObj["user_login"]=that.userLogin;
          }
        }else{
          that.userLogin="";
        }
        that.$http({
          method:'post',
          url: '/user/list',
          params:paramObj
        }).then(function (res) {
          if(res.data.error=='0'){
            that.adminList=res.data.data.table_data;
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
        this.getAdminList(1,this.pageData.Perpage,this.queryFlag);
      },
      handleCurrentChange(val) {
        this.getAdminList(val,this.pageData.Perpage,this.queryFlag);
      },
      remove () {
        var that=this;
        if(that.selectedList.length>0){
          var selectedId=[];
          that.selectedList.forEach(function(item,index){
            selectedId.push(item.id);
          })
          if(selectedId.length>0){
            this.$confirm('确认删除此用户管理员吗？', '提示', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning',
              closeOnClickModal:false
            }).then(() => {
              that.$http({
                method:'post',
                url: '/user/delUser',
                params:{
                  ids:selectedId.join(',')
                }
              }).then(function (res) {
                if(res.data.error=='0'){
                  that.$message({
                    type: 'success',
                    message: '用户管理员删除成功!'
                  });
                  that.getAdminList(1,that.pageData.Perpage,that.queryFlag);
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
                message: '已取消删除'
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
        this.$confirm('确认删除此用户管理员吗？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal:false
        }).then(() => {
          that.$http({
            method:'post',
            url: '/user/delUser',
            params:{
              ids:id
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '用户管理员删除成功!'
              });
              that.getAdminList(1,that.pageData.Perpage,that.queryFlag);
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
            message: '已取消删除'
          });
        });
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.getAdminList(1,this.pageData.Perpage,false);
        // 点击操作以外的地方，操作隐藏
        var that=this;
        document.addEventListener("click",function(event){
          if(!this.contains(this.$el,event.target)){
            if(that.adminList.length>0){
              that.adminList.forEach(function (item,index) {
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

<style scoped>

</style>
