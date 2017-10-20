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
                    <el-input
                      placeholder="请输入功能关键词，例如商品"
                      icon="search"
                      v-model="searchVal" @input="searchFun">
                    </el-input>
                    <ul v-if="showSearch">
                      <template v-for="item in searchList">
                      <li><a @click="jumpUrl(item.path_url)">{{item.label}}</a></li>
                      </template>
                      <li @click="showSearch=false"><a class="text-center">关闭</a></li>                    
                    </ul>
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
        showSearch:false,
        searchObj:[],
        searchVal:''          
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
        searchFun(){
          if(this.searchVal!=''){
            this.showSearch=true;
          }else{
            this.showSearch=false;
          }
        },
        jumpUrl(url){          
          this.showSearch=false;
          this.$refs.navMenu.getLeftMenu();
          this.$router.push(url);
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
            that.$router.push('/setting/freight/list/');
          } 
        }        
    }
  }
</script>
<style scoped>
  
</style>