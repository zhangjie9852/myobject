<template>
	<div id="sellerList">
		<HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
		<div class="wrapper wrapper-content animated fadeInRight">
			<div class="row">
				<div class="col-lg-12">
					<div class="ibox float-e-margins">
                    	<div class="ibox-content">
                    		<form action="" class="form-inline m-b-sm clearfix" role="form">
                    			<el-button  type="warning" class="m-r-sm" @click="batchOpt('del','删除')">批量删除</el-button>
                            	<el-input class="m-r-sm m-b-sm" name="title" v-model="title" placeholder="广告名称"  @keyup.enter="getList(pageData.PageID)"></el-input>
                            	<el-button class="search-btn" type="primary" icon="search" @click="getList(pageData.PageID)">筛选</el-button>
                    			<!--<div class="form-group">
                                  <input name="title" type="text" class="form-control m-r-xs" placeholder="广告名称" v-model="title" @keyup.enter="getList(pageData.PageID)">
                                </div>
			                    <button type="button" class="btn btn-m btn-primary" @click="getList(pageData.PageID)">查询</button>
			                    <button type="button" class="btn btn-m btn-danger m-l-xs" @click="batchOpt('del','删除')">批量删除</button>	-->			                   
			                    <router-link to="/adv/list/add"  class="add-btn"><i class="shop icon-xinzeng"></i> 添加广告</router-link>
                    		</form>
                    		<div class="table-responsive clearfix">
                    			<table class="table table-striped table-bordered table-hover">
                    				<thead>
                    					<tr>
                                            <th class="table-checkbox">
                                            	<div class="checkbox-square-green" :class="{'checked':checkAllFlag}" @click="checkedAll(clist)">
                                                <input type="checkbox" class="checks"></div>
                                            </th>
                                            <th>广告名称</th>
                                            <th>商家名称</th>
                                            <th>广告位置</th>
                                            <th>广告图片</th>       
                                            <th>创建时间</th>
                                            <th class="opt-select">操作</th>
                                        </tr>
                    				</thead>
                    				<tbody>
										<tr v-for="(item,index) in clist">
											<td>
												<div class="checkbox-square-green" :class="{'checked':item.isChecked}" @click="chkSelectAndAll(clist,item)">
                                            	<input type="checkbox" class="checks"></div>
											</td>
											<td>{{item.advertising_name}}</td>
											<td>{{item.goods_shop_base_name}}</td>
											<td>{{item.advertising_location_name}}</td>
											<td><img :src="item.advertising_pc_logo" class="listImg"></td>												
											<td>{{item.time_create}}</td>
											<td class="opt">
												<span class="opt-down shop icon-shezhicaozuo" @click.stop="opToggle(clist,item.id,'id')"></span>
                                                <ul v-show="item.isOptShow">
                                                	<li><router-link :to="'/adv/list/edit/'+item.id">编辑</router-link></li>      	
                                                    <li><a @click="delOne(item.id)">删除</a></li>                                      
                                                </ul>
											</td>
										</tr>
                    				</tbody>
                    			</table>
                    			<div v-show="clist.length==0" class="text-center">暂无信息</div>
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
	import {CustomFun,pageSizes,Imgpath} from '../comms/main.js'
	export default{
		components:{	      
	      HjCrumb
	    },
	    data(){
	    	return{
	    		title:'',				
				PSLists:pageSizes,
				clist:[],
				checkAllFlag:false,
        		selectedList:[],
	    		CrumbBox:{
	    			CrumbList:
		    		[
			    		{
				    		title:'广告管理',
				    		url:'/adv/list'
			    		},			    		
			    		{
				    		title:'广告列表',
				    		url:''
			    		}
		    		]
		    	},
		    	pageData:{					
                    PageID:1,
					Perpage:10,
					Results:1,
					Pages:1									
                }
	    	}	
	    },
	    mounted(){
			this.$nextTick(function () {
				this.getList(1);	//列表数据
				document.addEventListener('click', (e) => {				
			       	if(this.$el.contains(e.target)){
			       		if(this.clist.length>0){
			              this.clist.forEach(function (item,index) {
			                  item.isOptShow=false;
			              })
			            }			           
			       	}
			   })
			})	
		},			
		methods:{
			opToggle:CustomFun.opToggle,
			checkedAll:CustomFun.checkedAll,
      		chkSelectAndAll:CustomFun.chkSelectAndAll,
			handleSizeChange(val) {
		        this.pageData.Perpage = val;
		        this.getList(1);
		    },
		    handleCurrentChange(val) {
		       this.getList(val);
		    },
		    getList(page){		    	
		    	var that=this;
		    	that.checkAllFlag=false;
		    	that.selectedList=[];
		    	that.$http({
		    		method:'post',
		    		url:'/ad/listdata',
		    		params:{
		    			"advertising_name":that.title,
		    			'Perpage':that.pageData.Perpage,
						'PageID':page
		    		}
		    	}).then(function(res){		    		
		    		if(res.data.error==0){		    			
			    		that.clist = res.data.data.table_data;
			    		that.pageData.PageID = res.data.data.PageID;
			    		that.pageData.Perpage = res.data.data.Perpage;
			    		that.pageData.Results = res.data.data.Results;
			    		that.pageData.Pages = res.data.data.Pages;			    		
			    		that.clist.forEach(function (item,index) {							      
					        that.$set(item,"isOptShow",false);
					    })
				    }else{
				    	that.$message({
			                type: 'error',
			                message: res.data.desc
			              });               
					}	
		    	}).catch(function(error){
		    		console.log(error);
		    	})
		    },
		    delOne:function(id){				
		        var that=this;
		        this.$confirm('确认删除此信息吗？', '提示', {
		          confirmButtonText: '确认',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          that.$http({
		            method:'post',
		            url: '/ad/batchsubmit',
		            params:{
		            	'ad_ids':id,
		            	'method':'del'						
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
		    batchOpt:function(status,prompt){
		        var that=this;		        
		        if(that.selectedList.length>0){
		          var selectedId=[];
		          var isRight=true;
		          that.selectedList.forEach(function(item,index){		          	
			         selectedId.push(item.id);	            
		          })
		          if(selectedId.length>0){
		            this.$confirm('确定要批量【'+prompt+'】吗？', '提示', {
		              confirmButtonText: '确认',
		              cancelButtonText: '取消',
		              type: 'warning'
		            }).then(() => {
		              that.$http({
		                method:'post',
		                url: '/ad/batchsubmit',
		                params:{
		                  'ad_ids':selectedId.join(','),
		                  'method':status	                  
		                }
		              }).then(function (res) {
		                that.$message({
		                  type: 'success',
		                  message: '操作成功!'
		                });
		                if(status=="del"){		                	
		                	that.getList(1);
		                }else{		                	
		                	that.getList(that.pageData.PageID);
		                }		                
		              }).catch(function (error) {
		                console.log(error);
		              });
		            }).catch(() => {
		              //已取消
		            });
		          }
		        }else{
		          this.$message({
		            type: 'warning',
		            message: '请至少选择一条数据!'
		          });
		        }
		    }		    		    
		}
	}
</script>