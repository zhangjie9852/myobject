<template>
	<div id="wrapper">
      <NavList v-if="token"></NavList>
      <div id="page-wrapper" class="gray-bg dashbard-1">
          <div class="row border-bottom">
              <nav class="navbar navbar-static-top" role="navigation" style="margin-bottom: 0">
                <div class="navbar-header">
                    <a class="navbar-minimalize minimalize-styl-2 btn btn-primary" href="javascript:;"><i class="fa fa-bars"></i> </a>
                </div>
                <div class="logo-title">欢迎使用后台管理</div>
                <ul class="nav navbar-top-links navbar-right">
                    <li>你好，{{realname}}</li>
                    <li>
                        <a href="javascript:;" @click="logout">
                            <i class="fa fa-sign-out"></i> 退出
                        </a>
                    </li>
                </ul>
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
        token:''           
      }
    },
    computed:mapGetters([
      'userInfo',
      'loading'  
    ]),       
    mounted(){
      //this.$http.defaults.headers['token_admin'] = JSON.parse(window.localStorage.getItem('access_token'));
      //this.$http.defaults.headers['admin_id'] = window.localStorage.getItem('userid'); 
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
        logout: function () { //退出登录           
          var that = this;                    
              that.$http({
                method:'post',
                url: '/user/logout'                                              
              }).then(function (res) {
                //console.log(res);
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
    }
  }
</script>
<style scoped>
  
</style>