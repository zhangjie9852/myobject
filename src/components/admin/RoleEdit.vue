<template>
  <div id="RoleEdit">
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-title">
              <h5>编辑角色</h5>
            </div>
            <div class="ibox-content">
              <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t">
                <validate class="form-group">
                  <label class="col-sm-3 control-label"><span class="f-c-r">*</span>角色名称：</label>
                  <div class="col-sm-4">
                    <input type="text" name="roleName" class="form-control" v-model="roleInfo.roleName" required
                           :class="fieldClassName(formstate.roleName)">
                    <field-messages name="roleName" show="$touched || $submitted" class="form-control-callback">
                      <div slot="required" class="error">角色名称不能为空</div>
                    </field-messages>
                  </div>
                </validate>
                <div class="form-group">
                  <label class="col-sm-3 control-label">角色描述：</label>
                  <div class="col-sm-4">
                    <textarea class="form-control" v-model="roleInfo.remark"></textarea>
                  </div>
                </div>
                <div class="check-all">
                  <div class="checkbox-square-green" :class="{'checked':checkAllFlag}" @click="checkAll">
                    <input type="checkbox" class="checks">
                  </div>
                  <label>全选</label>
                </div>
                <div class="menu-item clearfix" v-for="(item,index) in menuList">
                  <div class="menu-title">
                    <div class="checkbox-square-green" :class="{'checked':item.isChecked}" @click="checkLevelOne(item)">
                      <input type="checkbox" class="checks">
                    </div>
                    <label>{{item.menu_title}}</label>
                  </div>
                  <div class="submenu-item">
                    <template v-for="(item2,index2) in item.submenu">
                      <div class="submenu" v-for="(item3,index3) in item2.submenu">
                        <div class="checkbox-square-green" :class="{'checked':item3.isChecked}" @click="checkLevelThree(item,item2,item3)">
                          <input type="checkbox" class="checks">
                        </div>
                        <label>{{item3.menu_title}}</label>
                      </div>
                    </template>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>
                <div class="form-group draggable ui-draggable">
                  <div class="col-sm-12 col-sm-offset-3">
                    <button class="btn btn-primary" type="submit">确定</button>
                    <router-link to="/admin/group" class="btn btn-white m-l-sm">返回列表</router-link>
                  </div>
                </div>
              </vue-form>
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
  import vueForm from 'vue-form'

  export default{
    components: {
      HjCrumb
    },
    mixins: [vueForm],
    data(){
      return {
        CrumbBox:{
          CrumbList:[
            {
              title:'系统设置',
              url:'/admin/group'
            },
            {
              title:'权限管理',
              url:'/admin/group'
            },
            {
              title:'编辑角色',
              url:''
            }
          ]
        },
        formstate: {},
        menuList:[],
        roleId:"",
        checkAllFlag:false,
        selectedList:[],
        roleInfo: {
          roleName: '',
          remark: ''
        }
      }
    },
    methods: {
      contains:CustomFun.contains,
      fieldClassName: function (field) {
        if (!field) {
          return '';
        } else if ((field.$touched || field.$submitted) && field.$invalid) {
          return 'error';
        }
      },
      getMenuLists () {
        var that=this;
        that.$http({
          method:'post',
          url: '/role/navmenu'
        }).then(function (res) {
          if(res.data.error=='0'){
            that.menuList=res.data.data;
            that.menuList.forEach(function (item,index) {
              that.$set(item,"isChecked",false);
              if(typeof item.submenu !="undefined"){
                item.submenu.forEach(function(item2,index2){
                  that.$set(item2,"isChecked",false);
                  if(typeof item2.submenu !="undefined"){
                    item2.submenu.forEach(function(item3,index3){
                      that.$set(item3,"isChecked",false);
                    })
                  }
                })
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
            var selectedMenuList=[];
            var menuLists=res.data.data.menulist;
            menuLists.forEach(function(item,index){
              if(item.checked){
                selectedMenuList.push(item.menu_id);
              }
            })
            that.menuList.forEach(function (item,index) {
              if(that.contains(selectedMenuList,item.menu_id)){
                item.isChecked=true;
                if(typeof item.submenu !="undefined"){
                  item.submenu.forEach(function(item2,index2){
                    if(that.contains(selectedMenuList,item2.menu_id)){
                      item2.isChecked=true;
                      if(typeof item2.submenu !="undefined"){
                        item2.submenu.forEach(function(item3,index3){
                          if(that.contains(selectedMenuList,item3.menu_id)){
                            item3.isChecked=true;
                          }
                        })
                      }
                    }
                  })
                }
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
      },
      checkLevelOne(obj){
        var that=this;
        obj.isChecked=!obj.isChecked;
        if(typeof obj.submenu !="undefined"){
          obj.submenu.forEach(function (item,index) {
            item.isChecked=obj.isChecked;
            if(typeof item.submenu !="undefined"){
              item.submenu.forEach(function (subitem,subindex) {
                subitem.isChecked=obj.isChecked;
              })
            }
          })
        }
      },
      checkLevelTwo (parentObj,obj) {
        var that=this;
        obj.isChecked=!obj.isChecked;
        if(typeof obj.submenu !="undefined"){
          obj.submenu.forEach(function (item,index) {
            item.isChecked=obj.isChecked;
          })
        }
        parentObj.isChecked=false;
        parentObj.submenu.forEach(function (item,index) {
          if(item.isChecked){
            parentObj.isChecked=true;
            return;
          }
        })
      },
      checkLevelThree (parentsObj,parentObj,obj) {
        var that=this;
        obj.isChecked=!obj.isChecked;
        parentObj.isChecked=false;
        parentObj.submenu.forEach(function (item,index) {
          if(item.isChecked){
            parentObj.isChecked=true;
            return;
          }
        })
        parentsObj.isChecked=false;
        parentsObj.submenu.forEach(function (item,index) {
          if(item.isChecked){
            parentsObj.isChecked=true;
            return;
          }
        })
      },
      checkAll () {
        var that=this;
        that.checkAllFlag=!that.checkAllFlag;
        that.menuList.forEach(function (item,index) {
          item.isChecked=that.checkAllFlag;
          if(typeof item.submenu !="undefined"){
            item.submenu.forEach(function(item2,index2){
              item2.isChecked=that.checkAllFlag;
              if(typeof item2.submenu !="undefined"){
                item2.submenu.forEach(function(item3,index3){
                  item3.isChecked=that.checkAllFlag;
                })
              }
            })
          }
        })
      },
      onSubmit: function () {
        var that = this;
        if (that.formstate.$valid) {
          that.menuList.forEach(function (item,index) {
            if(item.isChecked){
              that.selectedList.push(item.menu_id);
              if(typeof item.submenu !="undefined"){
                item.submenu.forEach(function (item2,index2) {
                  if(item2.isChecked){
                    that.selectedList.push(item2.menu_id);
                    if(typeof item2.submenu !="undefined"){
                      item2.submenu.forEach(function (item3,index3) {
                        if(item3.isChecked){
                          that.selectedList.push(item3.menu_id);
                        }
                      })
                    }
                  }
                })
              }
            }
          })
          that.$http({
            method: 'post',
            url: '/role/addRole',
            params: {
              rolename:that.roleInfo.roleName,
              remark:that.roleInfo.remark,
              status:1,
              menuStr:that.selectedList.join(','),
              id:that.roleId
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '角色保存成功!'
              });
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
  .menu-item{
    padding-top: 10px;
    border-top: 1px solid #dedede;
    margin-bottom: 20px;
  }
  .menu-item .menu-title{
    padding:8px 15px;
    font-size:14px;
    font-weight: normal;
    width:30%;
    max-width: 260px;
    float:left;
  }
  .submenu-item{
    width:70%;
    padding-left:15px;
    float:left;
    overflow: hidden;
  }
  @media screen and (max-width:610px){
    .menu-item .menu-title{
      width: 100%;
      max-width: none;
    }
    .submenu-item{
      width:100%;
    }
  }
  .submenu-item .submenu{
    width: 146px;
    float: left;
    margin-top: 8px;
    margin-bottom: 8px;
  }
  .menu-item label,.check-all label{
    margin-left: 8px;
    margin-bottom: 0;
    line-height: 22px;
    vertical-align: middle;
  }
  .check-all{
    padding:10px 15px;
    font-size: 14px;
  }
</style>

