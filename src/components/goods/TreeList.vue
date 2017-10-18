<template>
	<div id="treelist-template">
		<ul class="clearfix listbody" :dataVal="isopen">			
            <li><input type="number" class="w100" @keyup.enter="editSort(item.category_id,item.sort)" @blur="editSort(item.category_id,item.sort)" v-model="item.sort"></li>
            <li class="listTitle"><div :style="{'padding-left': (item.level-1)*paddingSize + 'px'}"><a v-if="isFolder" @click="toggle()"><i class="icon_sb_stop" v-if="open"></i><i class="icon_sb_open" v-else></i></a>
	        <a v-else style="color:#FFF;"><span v-if="item.level>1" style="width:12px;display: inline-block"></span></a> <input type="text" v-model="item.category_name" v-if="item.opens" placeholder="分类名称" ><span v-else>{{item.category_name}}</span><a class="m-l-md icon_lb_add" v-if="!item.opens" @click="addChild()" title="添加分类"></a> <button type="button" v-if="item.opens" @click="subAdd()">提交</button></div></li>
            <li><el-switch
				  v-model="item.is_show"
				  on-text=""
				  off-text=""
				  @change="isShow(item.category_id,item.is_show)">
				</el-switch></li>
            <li class="listOpt"><router-link :to="'/goods/category/edit/'+item.category_id" class="icon_l_edit" title="编辑"></router-link> <a class="m-l-xs icon_l_delete" @click="$emit('remove')"v-if="!isFolder" title="删除"></a> </li>
            <ul v-show="open" v-if="isFolder">
		        <treelist v-for="(val, index) in item.children" :item="val" @subm="$emit('subm')" @remove="delItem(index,val.category_id)" :key="index"></treelist>
		     </ul>
        </ul>            
    </div>
  </template>
  <script>
  import  vm from '../../main.js'
  import {CustomFun} from '../comms/main.js'
  import {mapGetters,mapActions} from 'vuex'
    export default{
    	name:"treelist",
    	props: {
	      item: Object	      
	    },
	    computed: {	  	
		    ...mapGetters([
		      'tree'     
		    ]),
		    isFolder: function() {
		        return this.item.children && this.item.children.length
		    },
		    isopen:function(){
		    	return this.open = this.tree
		    }
	    },
	    data(){
	    	return {
		        open: false,
		        paddingSize: 15		        
		    }
		},		
	    mounted(){
	    },
	    methods: {	    	    	    
	      toggle: function() {	      	
	        if (this.isFolder) {	        	
	          this.open = !this.open;
	        }
	      },	      
	      addChild: function() {
	        if (!this.isFolder) {
	              vm.$set(this.item, 'children', [])
	          }
	        this.open = true
	        this.item.children.push({
	          sort: 0,
	          category_name: '',
	          is_show: true,
	          opens: true,
	          level: parseInt(this.item['level'])+1,
	          parent_id: this.item['category_id'],
	          category_code: this.item['category_code']     
	        })
	      },	      
	      subAdd: function() {	      	
	        var that = this;	   
	        if(this.item['category_name']==""){
	        	that.$message({
                  message: '分类名称不能为空',
                  type: 'warning'
                });
	        	return;
	        }
	        //console.log(this.item['level'])                
	        that.$http({
	              method:'post',
	              url: '/goods_category/addsubmit',
	              params:{
		              'category_name':this.item['category_name'],
		              'level':this.item['level'],
		              'category_parentid':this.item['parent_id'],
		              'category_sort':this.item['sort'],
		              'is_show':this.item['is_show'],
		              'category_code':this.item['category_code']		              
	              }       
	            }).then(function (res) {                         
	              if(res.data.error==0){	              	
	              	that.item['opens'] = false;	
	              	that.$emit('subm');	              	
	              }	             
	            }).catch(function (error) {
	              console.log(error);
	            });
	      },	      
	      delItem:function(index,id){
	      	var that=this; 
	      	if(id>0){
	      		this.$confirm('确认删除此分类吗？', '提示', {
	              confirmButtonText: '确认',
	              cancelButtonText: '取消',
	              type: 'warning'
	            }).then(() => {
	              that.$http({
	                method:'post',
	                url: '/goods_category/batchsubmit',
	                params:{
	                  'cate_id':id,
	                  'method':-2            
	                }
	              }).then(function (res) {
	              	if(res.data.error==0){		              	               
		                that.$message({
		                  type: 'success',
		                  message: '删除成功!'
		                });
		                that.$emit('subm');
		            }else{
		            	that.$message({
	                    message: res.data.desc,
	                    type: 'warning'
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
	      	}else{
	      		that.item['children'].splice(index, 1);
	      	}	      	
	      	
	             
	      },
	      isShow:function(id,status){
	      	if(id>0){	      	   		
		        var that = this;
		        that.$http({
		              method:'post',
		              url: '/goods_category/editsubmit',
		              params:{
		              'category_id':id,
		              'is_show':status
		              }       
		            }).then(function (res) {		            		                                               
		              if(res.data.error==0){	              	
		              	that.$emit('subm');
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
	      },
	      editSort:function(id,sort){
	      	if(id>0){
	      		//console.log(id)
		        var that = this;
		        event.currentTarget.blur();	
		        that.$http({
		              method:'post',
		              url: '/goods_category/editsubmit',
		              params:{
			              'category_id':id,
			              'category_sort':sort
		              }       
		            }).then(function (res) {	                                               
		              if(res.data.error==0){		              	              	
		              	that.$emit('subm');
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
    }
  </script> 