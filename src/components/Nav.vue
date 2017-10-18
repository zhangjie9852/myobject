<template>
	<div class="Leftnav">
		<nav class="navbar-default navbar-static-side" role="navigation" >
	      <div class="sidebar-collapse">
	          <ul class="nav animated" id="side-menu">
	              <li class="nav-header">
	                  <div class="nav-header-img profile-element">
	                      <img alt="image" :src="sysLogo" />
	                  </div>
	                  <div class="logo-element">
	                      管理<br/>后台
	                  </div>
	              </li><!-- 一级分类 -->
	              <router-link :to="item.path_url" tag="li" v-for="(item,index) in menu" active-class="nav-current" :key="index" @click.native="toggle(item.menu_id),navActive(item.menu_id,0)" v-if="!menu[index].submenu">
	              	<a><i class="fa" :class="item.menu_class"></i><span class="nav-label">{{item.menu_title}}</span><span class="fa arrow" v-if="menu[index].submenu"></span></a>
	              </router-link>
					<!-- 二级分类 -->
	              <li v-for="(item,index) in menu" :class="item.opens?'active':''" :key="index" v-if="menu[index].submenu">
	              	<a @click="toggle(item.menu_id)"><i class="fa" :class="item.menu_class"></i><span class="nav-label">{{item.menu_title}}</span><span class="fa arrow" v-if="menu[index].submenu"></span></a>
                    <ul class="nav nav-second-level collapse" :class="item.opens?'in':''">
                    	<router-link tag="li" v-for="(sec,sindex) in menu[index].submenu" v-if="!menu[index].submenu[sindex].submenu" :to="sec.path_url" active-class="nav-current" @click.native="navActive(item.menu_id,sec.menu_id)"><a>{{sec.menu_title}}<span class="fa arrow" v-if="menu[index].submenu[sindex].submenu"></span></a></router-link>
						<!-- 三级分类 -->
                        <li v-for="(sec,sindex) in menu[index].submenu" v-if="menu[index].submenu[sindex].submenu" :class="sec.secOpen?'active':''">
                        	<a @click="toggle2(sec.menu_id,index)" class="sec-class">{{sec.menu_title}}<span class="fa arrow"></span></a>
                            <ul class="nav nav-third-level collapse" :class="sec.secOpen?'in':''">
                                <router-link :to="third.path_url" tag="li" v-for="third in menu[index].submenu[sindex].submenu" @click.native="navActive(item.menu_id,sec.menu_id)" active-class="nav-current"><a>{{third.menu_title}}</a></router-link>
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
	export default {
		data(){
			return {				
				menu:[],
				current:5,
				navsecid:0,
				sysLogo:''
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
	                return "/workbench/index"
	            }

	        }
	    },
		mounted(){
			//获取数据
			this.getLeftMenu();	
			this.baseMain()		
			this.current = sessionStorage.getItem("navId");
			this.navsecid = sessionStorage.getItem("secId");						
		},		
		methods:{
			getLeftMenu() {	//菜单
	      		var that = this;	      		    		
	      		that.$http({
						  method:'post',
						  url: '/base/navmenu'						  			  
						}).then(function (res) {
							//console.log(res);
							if(res.data.error == 0){								
								that.menu = res.data.data;								
								for(var i=0; i<that.menu.length; i++){
									if(that.current == that.menu[i].menu_id){//判断当前展开栏目
									   that.menu[i].opens= true
								   }								   
								   if(that.menu[i].submenu != undefined){							   		
									   	that.menu[i].submenu.forEach(function (item,index) {
									        that.$set(item,"secOpen",false);
									    });
									    for(var j=0; j<that.menu[i].submenu.length; j++){
											if(that.navsecid == that.menu[i].submenu[j].menu_id){//判断当前展开栏目
											   that.menu[i].submenu[j].secOpen= true
										    }
										}
								   }								 							  
								}								
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
            },
			navActive: function(id,sid){
				//console.log(sid);
				sessionStorage.setItem("navId",id);
				if(sid>0){
					sessionStorage.setItem("secId",sid);
				}
				//sessionStorage.setItem("navId",id);
				var navid = sessionStorage.getItem("navId");
				var navsecid = sessionStorage.getItem("secId");
				this.current = navid;
				this.navsecid = navsecid;			
			}		
		}
	}	
</script>
<style scoped>
	.nav li a i{
		font-family: 'sidebar';
	}
</style>