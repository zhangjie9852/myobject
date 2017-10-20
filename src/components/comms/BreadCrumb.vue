<template>
	<div id="HjCrumb" class="row wrapper border-bottom white-bg">
		<span class="crumbs-tit">{{currentTitle}} ></span>
		<div class="crumbs">
		  <ol class="breadcrumb">		  			  	
		  	  <router-link :to="ctitle.url" tag="li" v-for="(ctitle,index) in crumbMsg.CrumbList" :key="index" v-if="ctitle.url != ''">
	              	<a>{{ctitle.title}}</a>
	          </router-link>                    
		      <!-- <li v-for="(ctitle,index) in crumbMsg.CrumbList" :key="index" v-if="ctitle.url == ''">
		      		<strong>{{ctitle.title}}</strong>
		      </li> -->		      
		  </ol>
		</div>
	</div>	
</template>
<script>
    export default{
        name:"HjCrumb",
        props: ['crumbMsg'],
        data(){
	      return {
	        currentTitle:''	                 
	      }
	    },
        mounted(){ 
        var title =  this.crumbMsg.CrumbList[this.crumbMsg.CrumbList.length-1].title;
	      this.currentTitle = title;        
	    }
    }  
</script>