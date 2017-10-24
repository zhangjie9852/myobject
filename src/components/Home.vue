<template>
	<div id="wrapper">
      <NavList ref="navMenu"></NavList>
      <div id="page-wrapper" class="gray-bg dashbard-1">
          <div class="row border-bottom">
              <nav class="navbar navbar-static-top" role="navigation" style="margin-bottom: 0">
                <div class="navbar-header">
                    <a class="navbar-minimalize minimalize-styl-2" href="javascript:;"><i class="shop icon-caidanzhedie"></i> </a>
                </div>
                <div class="logo-title"></div>
                
                <div class="head-top-right">
                  <div class="search">
                    <!-- <input placeholder="请输入功能关键词，例如商品" v-model="searchVal" @input="searchFun" /> -->
                    <em class="shop icon-guanbi" @click="clearTit" v-show="searchVal!=''"></em>
                    <el-input
                      placeholder="请输入功能关键词，例如商品"
                      icon="search"
                      v-model="searchVal" @input="searchFun">
                    </el-input>
                    <div class="Searchs" v-if="showSearch">
                      <ul>
                        <template v-for="item in searchList">
                        <li><a @click="jumpUrl(item.path_url,item.label)">{{item.label}}</a></li>
                        </template>        
                      </ul>
                      <span class="lastBtn" @click="showSearch=false"><a class="text-center">关闭</a></span>
                    </div>
                  </div>
                  <span>
                  <img src="../assets/img/man.png" >
                  <el-dropdown trigger="click" @command="userinfo">
                    <em>
                    你好，{{realname}}
                    <i class="shop icon-jiantouxia font12"></i>
                    </em>
                    <el-dropdown-menu slot="dropdown" class="dropList">
                      <el-dropdown-item command="password"><i class="shop icon-mima1"></i> 修改密码</el-dropdown-item>
                      <el-dropdown-item command="logout"><i class="shop icon-tuichu1"></i> 退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                    </el-dropdown>
                  </span>
                </div>
              </nav>
          </div> 
          <loading v-if="loading"></loading>
          <!--<keep-alive>-->
          <router-view></router-view>
          <!--</keep-alive>-->
          <FooterView></FooterView>
      </div>
      <el-dialog title="密码修改" :visible.sync="dialogVisible" size="tiny">        
        <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal">
            <div class="p-lr-m"><!-- 修改权限 -->
              <validate class="form-group"> 
                  <input type="text" name="pass1" v-model="pass1" class="form-control" placeholder="请输入原始密码" required :class="fieldClassName(formstate.pass1)"> 
                  <field-messages name="pass1" show="$touched || $submitted" class="form-control-callback">
                      <div slot="required" class="error">请输入原始密码</div>
                  </field-messages> 
              </validate>
              <validate class="form-group"> 
                  <input type="password" name="pass2" v-model="pass2" class="form-control" minlength="6" maxlength="20" placeholder="请输入新密码" required :class="fieldClassName(formstate.pass2)">
                  <field-messages name="pass2" show="$touched || $submitted" class="form-control-callback">    <div slot="required" class="error">请输入新密码</div>            
                      <div slot="minlength" class="error">登录密码不能少于6位</div>
                      <div slot="maxlength" class="error">登录密码不能多于20位</div>                   
                  </field-messages>
              </validate>
              <validate class="form-group">
                  <input type="password" name="pass3" v-model="pass3" class="form-control" placeholder="请再输入一次新密码" required :match="pass3==pass2" :class="fieldClassName(formstate.pass3)">
                  <field-messages name="pass3" show="$touched || $submitted" class="form-control-callback">    <div slot="required" class="error">请再输入一次新密码</div>               
                      <div slot="match" class="error">两次密码不一致</div>                   
                  </field-messages>
              </validate>
            </div>
            <div class="draggable ui-draggable">
              <div class="col-sm-offset-4">
                <button class="btn btn-primary" type="submit">确定</button>
                <button class="btn btn-white m-l-sm" type="button" @click="dialogVisible=false">取消</button>                  
              </div>
            </div>
        </vue-form>       
        <!-- <div slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible=false">取消</el-button>
          <el-button type="primary" @click="confirmAllot">确定</el-button>
        </div> -->
      </el-dialog>          
    </div>
</template>
<script>
  import NavList from './Nav.vue'  
  import FooterView from './Footer.vue'
  import { mapGetters } from 'vuex'
  import {CustomFun} from './comms/main.js'
  import Vue from 'vue'
  import vueForm from 'vue-form'
  //  自定义验证器
  var vueFormOptions = {
    validators: {
      'match': function (value, attrValue) {
        return attrValue;
      }
    }
  };
  Vue.use(vueForm, vueFormOptions);
  export default {
    data(){
      return {
        realname:'',
        token:'',
        showSearch:false,
        dialogVisible:false,
        searchObj:[],
        searchVal:'',
        pass1:'',
        pass2:'',
        pass3:'',
        formstate: {},      
      }
    },    
    computed: {     
        ...mapGetters([           
          'userInfo',
          'loading'     
        ]),
        searchList:function(){
          var list=[];
          var that = this;
          this.searchObj.forEach(function(val){
            if(val.label.indexOf(that.searchVal)!=-1){
              list.push(val);
            }
          });
          return list;
        }         
    },      
    mounted(){      
      var that=this;
      $('.navbar-minimalize').click(function () {
          $("body").toggleClass("mini-navbar");
          that.SmoothlyMenu();         
      }); 
       that.bodyW(); 
       that.baseinfo();
       this.allMenu();            
    },
    components:{
      NavList,
      FooterView
    },
    methods:{
        fieldClassName: function (field) {
            if (!field) {
              return '';
            } else if ((field.$touched || field.$submitted) && field.$invalid) {
              return 'error';
            }
        },
        searchFun(){
          if(this.searchVal!=''){
            this.showSearch=true;
          }else{
            this.showSearch=false;
          }
        },
        jumpUrl(url,title){          
          this.showSearch=false;
          this.$refs.navMenu.getLeftMenu();
          this.$router.push(url);
          this.searchVal = title;
          console.log(url)
        },
        clearTit(){
          this.searchVal = '';
          this.showSearch=false;
        },
        onSubmit: function () {
          var that = this;                
          if (this.formstate.$valid) {            
            that.$http({
              method: 'post',
              url: '/user/addUser',
              params: {                
                user_pass:that.pass2,                
                id:id               
              }
            }).then(function (res) {                
              if(res.data.error=='0'){
                that.$message({
                  type: 'success',
                  message: '成功!'
                });
                that.dialogVisible = false;                
              }else{
                that.$message({
                  type: 'error',
                  message: res.data.desc
                });
              }
            }).catch(function (error) {
              that.$message({
                type: 'error',
                message: '失败，请重新提交!'
              });
            });
          }
        },
        allMenu(){
          var that = this;                    
              that.$http({
                method:'post',
                url: '/base/navmenu',                                            
              }).then(function (res) {               
              var menuList = res.data.data;                           
                if(res.data.error==0){
                //一级          
                  menuList.forEach(function (item,index) {                    
                    if(item.submenu != undefined){
                      //二级
                      item.submenu.forEach(function (item2,index2) {
                        if(item2.submenu != undefined){
                          //三级
                          item2.submenu.forEach(function (item3,index3) {                            
                            if(item3.path_url !=undefined){                      
                              that.searchObj.push({
                                path_url:item3.path_url,
                                label:item3.menu_title
                              });
                            }
                          });
                        }
                        if(item2.path_url !=undefined){                      
                          that.searchObj.push({
                            path_url:item2.path_url,
                            label:item2.menu_title
                          });
                        }
                      });
                    }                    
                    if(item.path_url !=undefined){                      
                      that.searchObj.push({
                        path_url:item.path_url,
                        label:item.menu_title
                      });
                    }                    
                  });
                }                  
              }).catch(function (error) {
                console.log(error);
              });              
        },
        baseinfo(){
          var that = this;                    
              that.$http({
                method:'post',
                url: '/base/main',                                            
              }).then(function (res) {
                //console.log(res);
                if(res.data.error==0){           
                  that.realname = res.data.data.realname
                }else{
                  that.$message({
                    message: res.data.desc,
                    type: 'warning'
                  });
                  sessionStorage.clear();                  
                  that.$router.push('/login');
                }                     
              }).catch(function (error) {
                console.log(error);
              });
        },       
        SmoothlyMenu() {
            if (!$('body').hasClass('mini-navbar') || $('body').hasClass('body-small')) {               
                $('#side-menu').hide();                
                setTimeout(
                    function () {
                        $('#side-menu').fadeIn(500);
                    }, 100);
            } else if ($('body').hasClass('fixed-sidebar')){
                $('#side-menu').hide();
                setTimeout(
                    function () {
                        $('#side-menu').fadeIn(500);
                    }, 300);
            } else {               
                $('#side-menu').removeAttr('style');
            }
        },
        bodyW(){
          $(window).bind("load resize", function() {
              if ($(this).width() < 769) {
                  $('body').addClass('body-small')
              } else {
                  $('body').removeClass('body-small')
              }
          })
        },
        userinfo(command) { //退出登录           
          var that = this;
          if(command =='logout'){
            that.$http({
                method:'post',
                url: '/user/logout'                                              
              }).then(function (res) {                
                if(res.data.error==0){//退出成功                   
                   sessionStorage.clear();
                   window.localStorage.clear();
                   that.$message({
                    type: 'success',
                    message: res.data.desc
                   });
                   that.$router.push('/login');
                }                     
              }).catch(function (error) {
                console.log(error);
              });
          }
          if(command=='password'){
            that.dialogVisible = true;
            //that.$router.push('/setting/freight/list/');
          } 
        }        
    }
  }
</script>
<style scoped>
 .p-lr-m{padding: 0 15px} 
</style>