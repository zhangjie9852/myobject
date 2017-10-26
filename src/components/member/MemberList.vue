<template>
  <div id="MemberList">
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-content">
              <form action="#" class="form-inline m-b-sm" role="form">
                <el-dropdown class="m-r-sm m-b-sm">
                  <el-button type="warning">
                    批量操作&nbsp;&nbsp;&nbsp;&nbsp;<i class="el-icon-caret-bottom el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><span @click="remove">批量删除</span></el-dropdown-item>
                    <el-dropdown-item><span @click="prohibit">禁止登陆</span></el-dropdown-item>
                    <el-dropdown-item><span @click="recovery">恢复登陆</span></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-input class="m-r-sm m-b-sm" name="keyword" v-model="keyword" placeholder="关键词"></el-input>
                <el-button class="search-btn" type="primary" icon="search" @click="getMemberLists(1,pageData.Perpage,true)">筛选</el-button>
                <router-link to="/member/add" class="add-btn"><i class="shop icon-xinzeng"></i> 添加会员</router-link>
                <!--<div class="form-group m-r-xs m-t-xs">-->
                  <!--<input type="text" class="form-control" name="keyword" placeholder="关键词" v-model="keyword">-->
                <!--</div>-->
                <!-- <div class="form-group m-r-xs m-t-xs">
                  <select class="form-control" name="is_realname" v-model="isRealname">
                    <option :value="null">是否实名</option>
                    <option value="0">未实名</option>
                    <option value="1">已实名</option>
                  </select>
                </div> -->
                <!--<div class="form-group m-r-xs m-t-xs">-->
                  <!--<button type="button" class="btn btn-primary" @click="getMemberLists(1,pageData.Perpage,true)">查询</button>-->
                <!--</div>-->
              </form>
              <!--<div class="btn-group m-b-md">-->
                <!--<button type="button" class="btn btn-primary m-r-xs" @click="remove">批量删除</button>-->
                <!--<button type="button" class="btn btn-primary m-r-xs" @click="prohibit">禁止登陆</button>-->
                <!--<button type="button" class="btn btn-primary m-r-xs" @click="recovery">恢复登陆</button>-->
                <!--<router-link to="/member/add" class="btn btn-warning m-r-xs">添加会员</router-link>-->
              <!--</div>-->
              <div class="table-responsive clearfix">
                <table class="table table-striped table-bordered table-hover">
                  <thead>
                  <tr>
                    <th class="table-checkbox">
                      <div class="checkbox-square-green" :class="{'checked':checkAllFlag}" @click="checkedAll(memberLists)">
                        <input type="checkbox" class="checks">
                      </div>
                    </th>
                    <th>用户名</th>
                    <th>会员昵称</th>
                    <th>手机/邮箱</th>
                    <th>注册时间</th>
                    <th>账户余额</th>
                    <th>会员等级</th>
                    <th>积分</th>
                    <th>状态</th>
                    <th class="opt-select">操作</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item,index) in memberLists">
                    <td>
                      <div class="checkbox-square-green" :class="{'checked':item.isChecked}" @click="chkSelectAndAll(memberLists,item)">
                        <input type="checkbox" class="checks">
                      </div>
                    </td>
                    <td>{{item.user_name}}</td>
                    <td>{{item.user_nickname}}</td>
                    <td>{{item.user_mobile || item.user_email}}</td>
                    <td>{{item.time_create}}</td>
                    <td>{{item.user_balance}}</td>
                    <td :class="{'text-org':item.user_level=='金牌' || item.user_level=='金牌会员','text-red':item.user_level=='银牌' || item.user_level=='银牌会员'}">{{item.user_level}}</td>
                    <td>{{item.user_point}}</td>
                    <td>{{item.user_statue}}</td>
                    <td class="opt">
                      <span class="opt-down shop icon-shezhicaozuo" @click.stop="viewOpt(memberLists,'user_id',item.user_id)"></span>
                      <ul v-show="item.isOptShow">
                        <li><router-link :to="'/member/detail/'+item.user_id">查看</router-link></li>
                        <li><router-link :to="'/member/edit/'+item.user_id">编辑</router-link></li>
                        <li @click="removeSingle(item.user_id)"><a href="javascript:;">删除</a></li>
                      </ul>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <div v-if="memberLists.length==0" class="text-center">暂无信息</div>
                <div class="hj_fr">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageData.PageID"
                    :page-sizes="PSLists"
                    :page-size="pageData.Perpage"
                    v-show="memberLists.length>0"
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
              title:'客户中心',
              url:'/member/list'
            },
            {
              title:'会员管理',
              url:'/member/list'
            },
            {
              title:'会员列表',
              url:''
            }
          ]
        },
        memberLists:[],
        keyword:"",
        isRealname:null,
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
      getMemberLists (pageID,Perpage,flag) {
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
          if(that.isRealname){
            paramObj["is_realname"]=that.isRealname;
          }
        }else{
          that.keyword="";
          that.isRealname=null;
        }
        that.$http({
          method:'post',
          url: '/member/listdata',
          params:paramObj
        }).then(function (res) {
          if(res.data.error=='0'){
            that.memberLists=res.data.data.table_data;
            that.pageData.Results = res.data.data.Results;
            that.pageData.Pages = res.data.data.Pages;
          }else {
            that.$message({
              type: 'error',
              message: res.data.desc
            });
          }
        }).catch(function (error) {
          console.log(error);
          that.$message({
            type: 'error',
            message: '会员列表加载失败，请重新加载!'
          });
        });
      },
      handleSizeChange(val) {
        this.pageData.Perpage = val;
        this.getMemberLists(1,this.pageData.Perpage,this.queryFlag);
      },
      handleCurrentChange(val) {
        this.getMemberLists(val,this.pageData.Perpage,this.queryFlag);
      },
      remove () {
        var that=this;
        if(that.selectedList.length>0){
          var selectedId=[];
          that.selectedList.forEach(function(item,index){
            selectedId.push(item.user_id);
          })
          if(selectedId.length>0){
            this.$confirm('确认删除此会员信息吗？', '提示', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning',
              closeOnClickModal:false
            }).then(() => {
              that.$http({
                method:'post',
                url: '/member/batchsubmit',
                params:{
                  user_id:selectedId.join(','),
                  method:"U_DEL"
                }
              }).then(function (res) {
                if(res.data.error=='0'){
                  that.$message({
                    type: 'success',
                    message: '会员删除成功!'
                  });
                  that.getMemberLists(1,that.pageData.Perpage,that.queryFlag);
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
                  message: '会员删除失败，请重新提交!'
                });
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
        this.$confirm('确认删除此条会员信息吗？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal:false
        }).then(() => {
          that.$http({
            method:'post',
            url: '/member/batchsubmit',
            params:{
              user_id:id,
              method:"U_DEL"
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '会员删除成功!'
              });
              that.getMemberLists(1,that.pageData.Perpage,that.queryFlag);
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
              message: '会员删除失败，请重新提交!'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      prohibit () {
        var that=this;
        if(that.selectedList.length>0){
          var selectedId=[];
          var isRight=true;
          that.selectedList.forEach(function(item,index){
            if(item.user_statue=='冻结'){
              that.$message({
                type: 'warning',
                message: '所选项包含已冻结数据，请重新选择!'
              });
              isRight=false;
              return;
            }else{
              selectedId.push(item.user_id);
            }
          })
          if(isRight){
            this.$confirm('确认禁用此会员吗？', '提示', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning',
              closeOnClickModal:false
            }).then(() => {
              that.$http({
                method:'post',
                url: '/member/batchsubmit',
                params:{
                  user_id:selectedId.join(','),
                  method:"U_BAN"
                }
              }).then(function (res) {
                if(res.data.error=='0'){
                  that.$message({
                    type: 'success',
                    message: '会员禁用成功!'
                  });
                  that.getMemberLists(1,that.pageData.Perpage,that.queryFlag);
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
                  message: '会员禁用失败，请重新提交!'
                });
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
      recovery () {
        var that=this;
        if(that.selectedList.length>0){
          var selectedId=[];
          var isRight=true;
          that.selectedList.forEach(function(item,index){
            if(item.user_statue=='正常'){
              that.$message({
                type: 'warning',
                message: '所选项包含未冻结数据，请重新选择!'
              });
              isRight=false;
              return;
            }else{
              selectedId.push(item.user_id);
            }
          })
          if(isRight){
            this.$confirm('确认恢复此会员吗？', '提示', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning',
              closeOnClickModal:false
            }).then(() => {
              that.$http({
                method:'post',
                url: '/member/batchsubmit',
                params:{
                  user_id:selectedId.join(','),
                  method:"U_RBAN"
                }
              }).then(function (res) {
                if(res.data.error=='0'){
                  that.$message({
                    type: 'success',
                    message: '会员恢复成功!'
                  });
                  that.getMemberLists(1,that.pageData.Perpage,that.queryFlag);
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
                  message: '会员恢复失败，请重新提交!'
                });
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
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.getMemberLists(1,this.pageData.Perpage,false);
        // 点击操作以外的地方，操作隐藏
        var that=this;
        document.addEventListener("click",function(event){
          if(!this.contains(this.$el,event.target)){
            if(that.memberLists.length>0){
              that.memberLists.forEach(function (item,index) {
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
  .table-responsive{
    padding-bottom: 35px;
    overflow: auto;
  }
</style>
