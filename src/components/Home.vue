<template>
	<div id="wrapper">
      <NavList v-if="token"></NavList>
      <div id="page-wrapper" class="gray-bg dashbard-1">
          <div class="row border-bottom">
              <nav class="navbar navbar-static-top" role="navigation" style="margin-bottom: 0">
                <div class="navbar-header">
                    <a class="navbar-minimalize minimalize-styl-2" href="javascript:;"><i class="shop icon-caidanzhedie"></i> </a>
                </div>
                <div class="logo-title"></div>
                
                <div class="head-top-right">
                  <div class="search">
                    <el-input
                      placeholder="请输入功能关键词，例如商品"
                      icon="search"
                      v-model="searchVal">
                    </el-input>
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
    </div>
</template>
<script>
  import NavList from './Nav.vue'  
  import FooterView from './Footer.vue'
  import { mapGetters } from 'vuex'
  import {CustomFun} from './comms/main.js'
  export default {
    data(){
      return {
        realname:'',
        token:'',
        searchVal:''          
      }
    },
    computed:mapGetters([
      'userInfo',
      'loading'  
    ]),       
    mounted(){      
      var that=this;
      $('.navbar-minimalize').click(function () {
          $("body").toggleClass("mini-navbar");
          that.SmoothlyMenu();         
      }); 
       that.bodyW(); 
       that.baseinfo(); 
      this.token = window.localStorage.getItem('access_token');          
    },
    components:{
      NavList,
      FooterView
    },
    methods:{ 
        baseinfo(){
          var that = this;                    
              that.$http({
                method:'post',
                url: '/base/main',
                /*params:{
                    'token_admin':JSON.parse(window.localStorage.getItem('access_token')),
                    'admin_id':JSON.parse(window.localStorage.getItem('userid'))
                  }*/                               
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
            that.$router.push('/setting/freight/list/');
          } 
        }
        // logout: function () { //退出登录           
        //   var that = this;                    
        //       that.$http({
        //         method:'post',
        //         url: '/user/logout'                                              
        //       }).then(function (res) {
        //         //console.log(res);
        //         if(res.data.error==0){//退出成功                   
        //            sessionStorage.clear();
        //            window.localStorage.clear();
        //            that.$message({
        //             type: 'success',
        //             message: res.data.desc
        //            });
        //            that.$router.push('/login');
        //         }                      
        //       }).catch(function (error) {
        //         console.log(error);
        //       }); 
        // }
    }
  }
</script>
<style scoped>
  
</style>