<template>
  <div>
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-content">
              <form action="#" class="form-inline m-b-sm" role="form">
                <el-button type="warning" class="m-b-sm" @click="remove">删除角色</el-button>
                <router-link to="/admin/role/add" class="add-btn"><i class="shop icon-xinzeng"></i> 添加角色</router-link>
              </form>
              <!--<div class="form-group m-r-xs m-t-xs">-->
                <!--<router-link to="/admin/role/add" class="btn btn-primary m-r-xs">添加角色</router-link>-->
                <!--<button type="button" class="btn btn-danger m-r-xs" @click="remove">删除角色</button>-->
              <!--</div>-->
              <div class="table-responsive clearfix">
                <table class="table table-striped table-bordered table-hover">
                  <thead>
                  <tr>
                    <th class="table-checkbox">
                      <div class="checkbox-square-green" :class="{'checked':checkAllFlag}" @click="checkedAll">
                        <input type="checkbox" class="checks">
                      </div>
                    </th>
                    <th>角色名</th>
                    <th>角色描述</th>
                    <th class="opt-select">操作</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item,index) in roleLists">
                    <td>
                      <div class="checkbox-square-green" :class="{'checked':item.isChecked}" @click="chkSelectAndAll(item)">
                        <input type="checkbox" class="checks">
                      </div>
                    </td>
                    <td>{{item.rolename}}</td>
                    <td>{{item.remark}}</td>
                    <td class="opt">
                      <span class="opt-down shop icon-shezhicaozuo" @click.stop="viewOpt(roleLists,'id',item.id)"></span>
                      <ul v-show="item.isOptShow">
                        <!--<li><router-link :to="'/admin/role/detail/'+item.id">查看</router-link></li>-->
                        <li @click="removeSingle(item.id)"><a href="javascript:;">删除</a></li>
                        <li><router-link :to="'/admin/role/edit/'+item.id">编辑</router-link></li>
                      </ul>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <div v-if="roleLists.length==0" class="text-center">暂无信息</div>
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
  import {CustomFun} from '../comms/main.js'
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
                url:'/admin/group'
              },
              {
                title:'权限管理',
                url:'/admin/group'
              },
              {
                title:'管理员角色',
                url:''
              }
            ]
        },
        roleLists:[],
        checkAllFlag:false,
        selectedList:[]
      }
    },
    methods:{
      viewOpt:CustomFun.viewOpt,
      getRoleLists () {
        var that=this;
        that.selectedList=[];
        that.$http({
          method:'post',
          url: '/role/list'
        }).then(function (res) {
          if(res.data.error=='0'){
            that.roleLists=res.data.data;
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
      checkedAll () {
        var that=this;
        that.checkAllFlag=!that.checkAllFlag;
        that.roleLists.forEach(function (item,index) {
          if(typeof item.isChecked =="undefined"){
            that.$set(item,"isChecked",that.checkAllFlag);
          }else {
            item.isChecked=that.checkAllFlag;
          }
        })
        if(that.checkAllFlag){
          that.selectedList=that.roleLists;
        }else{
          that.selectedList=[];
        }
      },
      chkSelectAndAll (item) {
        if(typeof item.isChecked =="undefined"){
          this.$set(item,"isChecked",true);
        }else {
          item.isChecked=!item.isChecked;
        }
        var that=this;
        that.selectedList=[];
        that.roleLists.forEach(function (item,index) {
          if(item.isChecked){
            that.selectedList.push(item);
          }
        })
        if(that.selectedList.length==that.roleLists.length){
          that.checkAllFlag=true;
        }else{
          that.checkAllFlag=false;
        }
      },
      remove () {
        var that=this;
        if(that.selectedList.length>0){
          var selectedId=[];
          that.selectedList.forEach(function(item,index){
            selectedId.push(item.id);
          })
          if(selectedId.length>0){
            this.$confirm('确认删除此角色吗？', '提示', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning',
              closeOnClickModal:false
            }).then(() => {
              that.$http({
                method:'post',
                url: '/role/del',
                params:{
                  ids:selectedId.join(',')
                }
              }).then(function (res) {
                if(res.data.error=='0'){
                  that.$message({
                    type: 'success',
                    message: '角色删除成功!'
                  });
                  that.getRoleLists();
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
        this.$confirm('确认删除此角色吗？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal:false
        }).then(() => {
          that.$http({
            method:'post',
            url: '/role/del',
            params:{
              ids:id
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '角色删除成功!'
              });
              that.getRoleLists();
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
        this.getRoleLists();
        // 点击操作以外的地方，操作隐藏
        var that=this;
        document.addEventListener("click",function(event){
          if(!this.contains(this.$el,event.target)){
            if(that.roleLists.length>0){
              that.roleLists.forEach(function (item,index) {
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
  .ibox-content{
    overflow: inherit;
  }
  .table-responsive{
    overflow-x:inherit;
  }
</style>
