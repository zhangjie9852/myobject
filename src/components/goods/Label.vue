<template>
	<div id="Label">
		<HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
		<div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title">
                            <h5>标签管理</h5>
                        </div>
                        <div class="ibox-content">
                            <div class="form-inline m-b-md clearfix">
                                <div class="form-group">
                                  <input name="title" v-model="title" type="text" class="form-control m-r-xs" placeholder="标签名称" @keyup.enter="getList(pageData.PageID)">
                                </div>
                                <div class="form-group">
	                                <el-cascader
									  :options="cateList"
									  :props="cprops"
									  clearable									  
									  @change="handleChange" 
									  change-on-select
									></el-cascader>
                                </div>
                                <button type="button" class="btn btn-m btn-primary m-l-xs" @click="getList(pageData.PageID)" :dataid="codeid">查询</button>                                
                                <button type="button" class="btn btn-m btn-primary m-l-xs" @click="delAll">批量删除</button>                                
                                <router-link to="/goods/label/add" class="btn btn-m btn-danger hj_fr">添加标签</router-link>
                            </div>                                
                            <div class="table-responsive clearfix">
                                <table class="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th width="5%">
                                            	<div class="checkbox-square-green" :class="{'checked':checkAllFlag}" @click="checkedAll(lists)">
                                                <input type="checkbox" class="checks"></div>   
                                            </th>
                                            <th class="text-center">标签名称</th>
                                            <th class="text-center">商品分类</th>      
                                            <th class="text-center">创建时间</th>
                                            <th class="t-right">操作</th>
                                        </tr>
                                    </thead>                                    
                                    <tbody>                                    	
                                        <tr v-for="(item,index) in lists">
                                            <td>
                                            	<div class="checkbox-square-green" :class="{'checked':item.isChecked}" @click="chkSelectAndAll(lists,item)">
                                                <input type="checkbox" class="checks"></div>	
                                            </td>
                                            <td class="text-center">{{item.goods_label_name}}</td>
                                            <td class="text-center">{{item.category_name}}</td>
                                            <td class="text-center">{{item.time_create}}</td>
                                            <td class="text-center opt">
                                            	<span class="opt-down" @click.stop="opToggle(lists,item.goods_label_id,'goods_label_id')">处理 <i class="fa fa-caret-down"></i></span>
                                                <ul v-show="item.isOptShow">                   	
                                                    <li><router-link :to="'/goods/label/edit/'+item.goods_label_id"><i class="icon_l_edit"></i> 编辑</router-link></li>
                                                    <li><a @click="delOne(item.goods_label_id)"><i class="icon_l_delete"></i> 删除</a></li>
                                                </ul>
                                           </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div v-show="lists.length==0" class="text-center">暂无信息</div>
                                <div class="hj_fr">
                                	<el-pagination
								      @size-change="handleSizeChange"
								      @current-change="handleCurrentChange"
								      :current-page="pageData.PageID"
								      :page-sizes="PSLists"
								      :page-size="pageData.Perpage"
								      v-show="pageData.Results>1"
								      layout="total, sizes, prev, pager, next, jumper"
								      :total="pageData.Results">
								    </el-pagination>
                                </div>
                            <div>
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
	import CateSel from '../comms/CateSel.vue'
	import {CustomFun,pageSizes} from '../comms/main.js'
	import {mapGetters,mapActions} from 'vuex'
	export default{
		components:{	      
	      HjCrumb,
	      CateSel
	    },
		data(){
			return {			
				title:'',
				checkAllFlag:false,
        		selectedList:[],
				PSLists:pageSizes,
				CrumbBox:{
	    			CrumbList:
		    		[
			    		{
				    		title:'商品中心',
				    		url:'/goods/label'
			    		},
			    		{
				    		title:'商品配置',
				    		url:'/goods/label'
			    		},
			    		{
				    		title:'标签管理',
				    		url:''
			    		}
		    		]
		    	},
		    	lists:[],
		    	cateList:[],		    	
		    	cprops:{
		            value:'category_code',
		            label:'category_name'
		        },
		    	category_code:'',	
				pageData:{					
                    PageID:1,
					Perpage:10,
					Results:1,
					Pages:1									
                },
                open:false                
			}
		},							       
		mounted(){
			this.getList(1);	//列表数据
			this.CatePrent();    //分类数据 			
			this.$nextTick(function () {
				document.addEventListener('click', (e) => {				
			       	if(this.$el.contains(e.target)){
			       		if(this.lists.length>0){
			              this.lists.forEach(function (item,index) {
			                  item.isOptShow=false;
			              })
			            }
			            this.open = false;
			       	}
			   })
			})								
		},				
		methods:{
			opToggle:CustomFun.opToggle,
			checkedAll:CustomFun.checkedAll,
      		chkSelectAndAll:CustomFun.chkSelectAndAll,
			CatePrent() {
                var that = this;                                         
                that.$http({
                      method:'post',
                      url: '/goods_category/listdata'                            
                    }).then(function (res) {
                        if(res.data.error==0){
                           that.cateList = res.data.data.table_data;   
                        }else{
                        	console.log(res.data.desc);                        	
                        }                                                         
                    }).catch(function (error) {
                        console.log(error);
                    });
            }, 
            handleChange(value) {
		    	this.category_code= value[value.length-1];		    		    	
		    },            		
			handleSizeChange(val) {
		        this.pageData.Perpage = val;
		        this.getList(1);
		    },
		    handleCurrentChange(val) {
		       this.getList(val);
		    },
            delOne:function(id){				
		        var that=this;
		        this.$confirm('确认删除此信息吗？', '提示', {
		          confirmButtonText: '确认',
		          cancelButtonText: '取消',
		          type: 'warning',
		          closeOnClickModal:false
		        }).then(() => {
		          that.$http({
		            method:'post',
		            url: '/goods_label/batchsubmit',
		            params:{
		            	'ids':id						
		            }
		          }).then(function (res) {		          	
		            that.$message({
		              type: 'success',
		              message: '删除成功!'
		            });
		            that.getList(1);
		          }).catch(function (error) {
		            console.log(error);
		          });
		        }).catch(() => {
		          //已取消
		        });
		    },
		    delAll:function(){
		        var that=this;		        
		        if(that.selectedList.length>0){
		          var selectedId=[];
		          that.selectedList.forEach(function(item,index){
		            selectedId.push(item.goods_label_id);
		          })
		          if(selectedId.length>0){
		            this.$confirm('确认操作此信息吗？', '提示', {
		              confirmButtonText: '确认',
		              cancelButtonText: '取消',
		              type: 'warning'
		            }).then(() => {
		              that.$http({
		                method:'post',
		                url: '/goods_label/batchsubmit',
		                params:{
		                  'ids':selectedId.join(','),		                  
		                }
		              }).then(function (res) {
		                that.$message({
		                  type: 'success',
		                  message: '操作成功!'
		                });
		                that.getList(1);		                
		              }).catch(function (error) {
		                console.log(error);
		              });
		            }).catch(() => {
		              this.$message({
		                type: 'info',
		                message: '已取消操作'
		              });
		            });
		          }
		        }else{
		          this.$message({
		            type: 'warning',
		            message: '请至少选择一条数据!'
		          });
		        }
		    },
			getList(page) {
				var that = this;
				that.checkAllFlag=false;
				that.selectedList=[];
				var filterObj={};
				if(that.title!=""){
		            filterObj["keyword"]=that.title;
		        }
		        if(that.category_code!=''){
		            filterObj["category_code"]=that.category_code;
		        }		        						     		    		
	      		that.$http({
						  method:'post',
						  url: '/goods_label/listdata',
						  params:{
							'Perpage':that.pageData.Perpage,
							'PageID':page,
							'filter':filterObj
							// 'filter':{
							// 	'keyword':that.title,
							// 	'category_code':that.category_code
							// }
						  }			  
						}).then(function (res) {
							//console.log(res);
							if(res.data.error==0){						
								that.lists   = res.data.data.table_data;			
								that.pageData.PageID  = res.data.data.PageID;
								that.pageData.Perpage = res.data.data.Perpage;
								that.pageData.Results = res.data.data.Results;
								that.pageData.Pages   = res.data.data.Pages;							
								//that.title = '';								
								that.lists.forEach(function (item,index) {							      
							        that.$set(item,"isOptShow",false);
							    })						    															
							}else{
								that.$message({
		                          message: res.data.desc,
		                          type: 'error'
		                        });		                        
							}
						}).catch(function (error) {
							console.log(error);
						});
			},	
			// isShow:function(cid,status){
			// 	var that = this;
			// 	that.$http({
			// 			  method:'post',
			// 			  url: '/goods_attribute/editsubmit',
			// 			  params:{
			// 				'goods_label_id':cid,
			// 				'status_attribute':status
			// 			  }			  
			// 			}).then(function (res) {																	 
			// 				if(res.data.error==0){
			// 					that.getList(that.pageData.PageID);
			// 				}else{
			// 					that.$message({
		 //                          message: res.data.desc,
		 //                          type: 'warning'
		 //                        });
			// 				}
			// 			}).catch(function (error) {
			// 				console.log(error);
			// 			});				
			// }         
		}
	}
</script>
