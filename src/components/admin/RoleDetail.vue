<template>
  <div id="RoleEdit">
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-title">
              <h5>角色详情</h5>
            </div>
            <div class="ibox-content">
              <div class="form-horizontal m-t">
                <div class="form-group">
                  <label class="col-sm-3 control-label">角色名称：</label>
                  <div class="col-sm-4 m-t-8">{{roleInfo.roleName}}</div>
                </div>
                <div class="form-group">
                  <label class="col-sm-3 control-label">角色描述：</label>
                  <div class="col-sm-4 m-t-8">{{roleInfo.remark}}</div>
                </div>
                <div class="form-group">
                  <label class="col-sm-3 control-label">管理员状态：</label>
                  <div class="col-sm-4 m-t-8">{{roleInfo.statusName}}</div>
                </div>
                <div class="form-group">
                  <label class="col-sm-3 control-label">菜单选择：</label>
                  <div class="col-sm-4 m-t-8">{{selectedList.join("、")}}</div>
                </div>
                <div class="form-group">
                  <label class="col-sm-3 control-label">创建时间：</label>
                  <div class="col-sm-4 m-t-8">{{roleInfo.timeCreate}}</div>
                </div>
                <div class="hr-line-dashed"></div>
                <div class="form-group draggable ui-draggable">
                  <div class="col-sm-12 col-sm-offset-3">
                    <router-link to="/admin/group" class="btn btn-primary">返回列表</router-link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import HjCrumb from '../comms/BreadCrumb.vue'
  import {CustomFun} from '../comms/main.js'

  export default{
    components: {
      HjCrumb
    },
    data(){
      return {
        CrumbBox:{
          CrumbList:[
            {
              title:'权限管理',
              url:'/admin/group'
            },
            {
              title:'管理员角色',
              url:'/admin/group'
            },
            {
              title:'角色详情',
              url:''
            }
          ]
        },
        menuList:[],
        roleId:"",
        selectedList:[],
        roleInfo: {
          roleName: '',
          remark: '',
          statusName:'',
          menuStr:[],
          timeCreate:''
        }
      }
    },
    methods: {
      contains:CustomFun.contains,
      getMenuLists () {
        var that=this;
        that.$http({
          method:'post',
          url: '/base/navmenu'
        }).then(function (res) {
          if(res.data.error=='0'){
            that.menuList=res.data.data;
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
      getRoleInfo (id) {
        var that=this;
        that.$http({
          method:'post',
          url: '/role/details',
          params:{
            id:id
          }
        }).then(function (res) {
          if(res.data.error=='0'){
            that.roleInfo.roleName=res.data.data.role.rolename;
            that.roleInfo.remark=res.data.data.role.remark;
            that.roleInfo.statusName=res.data.data.role.status_name;
            that.roleInfo.timeCreate=res.data.data.role.time_create;
            var selectedMenuList=[];
            var menuLists=res.data.data.menulist;
            menuLists.forEach(function(item,index){
              if(item.checked){
                selectedMenuList.push(item.menu_id);
              }
            })
            that.menuList.forEach(function (item,index) {
              if(that.contains(selectedMenuList,item.menu_id)){
                that.selectedList.push(item.menu_title);
              }
            })
          }else{
            that.$message({
              type: 'error',
              message: res.data.desc
            });
          }
        }).catch(function (error) {
          console.log(error);
        });
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.roleId=this.$route.params.id;
        this.getMenuLists();
        this.getRoleInfo(this.roleId);
      })
    }
  }
</script>

<style scoped>
  .menu-list {
    width: 134px;
    float: left;
    margin-top: 4px;
    margin-bottom: 4px;
  }

  .menu-list label {
    margin-left: 4px;
    margin-bottom: 0;
    line-height: 22px;
    vertical-align: middle;
  }
</style>
