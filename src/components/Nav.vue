<template>
	<div class="Leftnav">
		<nav class="navbar-default navbar-static-side" role="navigation" >
	      <div class="sidebar-collapse">
	          <ul class="nav side-menu animated" id="side-menu">
	              <li class="nav-header">
	                  <div class="nav-header-img profile-element">
	                      <img alt="image" :src="sysLogo" />
	                  </div>
	                  <div class="logo-element">
	                      和佳
	                  </div>
	              </li><!-- 一级分类 -->
	              <router-link :to="item.path_url" tag="li" v-for="(item,index) in menu" active-class="nav-current" :key="index" @click.native="toggle(item.menu_id)" v-if="!menu[index].submenu">
	              	<a><i class="fa" :class="item.menu_class"></i><span class="nav-label">{{item.menu_title}}</span><span class="fa arrow" v-if="menu[index].submenu"></span></a>
	              </router-link>
					<!-- 二级分类 -->
	              <li v-for="(item,index) in menu" :class="item.opens?'active':''" :key="index" v-if="menu[index].submenu">
	              	<a @click="toggle(item.menu_id)"><i class="fa" :class="item.menu_class"></i><span class="nav-label">{{item.menu_title}}</span><span class="fa arrow" v-if="menu[index].submenu"></span></a>
                    <ul class="nav nav-second-level collapse" :class="item.opens?'in':''">
                    	<router-link tag="li" v-for="(sec,sindex) in menu[index].submenu" v-if="!menu[index].submenu[sindex].submenu" :to="sec.path_url" :key="sindex" :class="seurl==navSecurl(sec.path_url)?'nav-current':''"><a>{{sec.menu_title}}<span class="fa arrow" v-if="menu[index].submenu[sindex].submenu"></span></a></router-link>
						<!-- 三级分类 -->
                        <li v-for="(sec,sindex) in menu[index].submenu" v-if="menu[index].submenu[sindex].submenu" :class="sec.secOpen?'active':''">
                        	<a @click="toggle2(sec.menu_id,index)" class="sec-class">{{sec.menu_title}}<span class="fa arrow"></span></a>
                            <ul class="nav nav-third-level collapse" :class="sec.secOpen?'in':''">
                                <router-link :to="third.path_url" tag="li" v-for="(third,tindex) in menu[index].submenu[sindex].submenu" :key="tindex" :class="seurl==navSecurl(third.path_url)?'nav-current':''"><a>{{third.menu_title}}</a></router-link>
                            </ul>
                        </li>
                    </ul>
	              </li>
	          </ul>
	      </div>
    	</nav>
	</div>
</template>
<script>
	import "../assets/css/sidebar.css"
	import {CustomFun} from './comms/main.js'
	export default {
		data(){
			return {				
				menu:[],
				current:5,
				navsecid:0,
				sysLogo:'',
				basePid:0,
				secPid:0
			}
		},
		computed:{	       
	        baseurl:function(){
	            var url = this.$route.path.split("/");
	            if(url.length>1){
	                return "/"+url[1];
	            }else{
	                return "/index"
	            }
	        },
	        seurl:function(){
	            var url = this.$route.path.split("/");
	            if(url.length>1){
	                return "/"+url[1]+"/"+url[2];
	            }else{
	                return "/index"
	            }

	        }
	    },
		mounted(){
			//获取数据
			this.getLeftMenu();	
			this.baseMain();								
		},		
		methods:{
			navBaseurl:CustomFun.navBaseurl,
			navSecurl:CustomFun.navSecurl,
			getLeftMenu() {	//菜单
	      		var that = this;	      		    		
	      		that.$http({
						  method:'post',
						  url: '/base/navmenu'						  			  
						}).then(function (res) {							
							if(res.data.error == 0){								
								that.menu = res.data.data;
								//一级          
				                  that.menu.forEach(function (item,index) {
				                  	if(that.current == item.menu_id){//判断当前展开栏目
									   that.menu[index].opens= true
								    }                   
				                    if(item.submenu != undefined){
				                      //二级
				                      item.submenu.forEach(function (item2,index2) {
			                            that.$set(item2,"secOpen",false);
				                        if(item2.submenu != undefined){
				                          //三级
				                          item2.submenu.forEach(function (item3,index3) {
				                            if(item3.path_url != undefined && that.navSecurl(item3.path_url)==that.navSecurl(that.$route.path) ){
				                            	item2.secOpen = true;
				                            	that.secPid = item3.parent_id;
				                            	if(item.menu_id == item2.parent_id ){
				                            		item.opens = true;
				                            		that.basePid = item2.parent_id;
				                            	}
				                            	//console.log(that.basePid,that.secPid);
				                            }
				                          });
				                        }
				                      });
				                    }                 
				                  });
							}else{								
								that.$message({
                                  message: res.data.desc,
                                  type: 'warning'
                                });
							}						
						}).catch(function (error) {
							console.log(error);
						});
	      	},
	      	toggle: function(id){//一级分类
			   var navList = this.menu;
			   //console.log(id);			   
			   for(var i=0; i<navList.length; i++){			   	   
				   if(navList[i].menu_id == id){				   		
					   this.menu[i].opens = !this.menu[i].opens
				   }else{
					   this.menu[i].opens = false;
				   }			       
				}
			},
			toggle2: function(id,index){//二级分类
			   var secList = this.menu[index].submenu;			   		   
			   for(var x=0; x<secList.length; x++){			   			   	   
				   if(secList[x].menu_id == id){				   		
					   secList[x].secOpen = !secList[x].secOpen
				   }else{
					   secList[x].secOpen = false;
				   }			       
				}
			},		
			baseMain(){				
                var that = this;
                that.$http({
                          method:'post',
                          url: '/setting_base/sitedata'        
                        }).then(function (res) {
                        //console.log(res)                            
                            if(res.data.error==0){
                            	var  fieldList =  res.data.data;
                                that.sysLogo = fieldList.site_logo_backend;
                            }else{
                                that.$message({
                                  message: res.data.desc,
                                  type: 'warning'
                                });                                        
                            }                                                        
                        }).catch(function (error) {
                            console.log(error);
                        });
            }
		}
	}	
</script>
<style scoped>
	.nav li a i{
		font-family: 'sidebar';
	}
</style>