<template>
	<div id="sellerList">
		<HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
		<div class="wrapper wrapper-content animated fadeInRight">
			<div class="row">
				<div class="col-lg-12">
					<div class="ibox float-e-margins">
						<div class="ibox-title">
                            <h5>用户评论</h5>
                        </div>
                        <div>
                        	<div class="ibox-content">
                        		<div class="form-inline m-b-sm clearfix">
                        			<div class="form-group">
	                                  <input name="title" type="text" class="form-control m-r-xs" placeholder="请输入商品关键词" v-model="title" @keyup.enter="getList(pageData.PageID)">
	                                </div>
				                    <button type="button" class="btn btn-m btn-primary" @click="getList(pageData.PageID)">查询</button>
				                    <button type="button" class="btn btn-m btn-danger m-l-xs" @click="batchOpt('del','删除',0)">批量删除</button>
				                   <button type="button" class="btn btn-m btn-warning m-l-xs" @click="batchOpt('ishow','禁止显示',-1)">禁止显示</button>
				                    <button type="button" class="btn btn-m btn-primary m-l-xs" @click="batchOpt('ishow','恢复显示',1)">恢复显示</button>				                    
                        		</div>
                        		<div class="table-responsive clearfix">
                        			<table class="table table-striped table-bordered table-hover">
                        				<thead>
                        					<tr>
	                                            <th width="5%">
	                                            	<div class="checkbox-square-green" :class="{'checked':checkAllFlag}" @click="checkedAll(clist)">
	                                                <input type="checkbox" class="checks"></div>
	                                            </th>
	                                            <th class="text-center">用户名</th>
	                                            <th class="text-center">评论商品</th>
	                                            <th class="text-center">品牌</th>
	                                            <th class="text-center">商品分类</th>
	                                            <th class="text-center">商家名称</th>
	                                            <th class="text-center">IP地址</th>
	                                            <th class="text-center">是否显示</th>
	                                            <th class="text-center">是否回复</th>
	                                            <th class="text-center">评论时间</th>
	                                            <th class="t-right">操作</th>
	                                        </tr>
                        				</thead>
                        				<tbody>
											<tr v-for="(item,index) in clist">
												<td>
													<div class="checkbox-square-green" :class="{'checked':item.isChecked}" @click="chkSelectAndAll(clist,item)">
                                                	<input type="checkbox" class="checks"></div>
												</td>
												<td class="text-center">{{item.user_name}}</td>
												<td class="text-center"><span class="listDesc" :title="item.goods_name">{{item.goods_name}}</span></td>
												<td class="text-center">{{item.brand_ch_name}}</td>
												<td class="text-center">{{item.category_name}}</td>
												<td class="text-center">{{item.shop_name}}</td>
												<td class="text-center">{{item.ip}}</td>
												<td class="text-center">{{item.is_show_name}}</td>
												<td class="text-center">
													<template v-if="item.is_assess==1">已回复</template>
													<template v-else>未回复</template>
												</td>
												<td class="text-center">{{item.time_create}}</td>
												<td class="opt">
													<span class="opt-down" @click.stop="opToggle(clist,item.assessment_id,'assessment_id')">处理 <i class="fa fa-caret-down"></i></span>
	                                                <ul v-show="item.isOptShow">
	                                                	<li v-if="item.is_assess==1"><router-link :to="'/goods/evaluate/details/'+item.assessment_id"><i class="icon_l_see"></i> 查看</router-link></li>
	                                                	<li v-else><router-link :to="'/goods/evaluate/details/'+item.assessment_id"><i class="fa fa-mail-reply"></i> 回复</router-link></li>      	
	                                                    <li><a @click="delOne(item.assessment_id)"><i class="icon_l_delete" ></i> 删除</a></li>                                   
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
	</div>
</template>
<script>	
	import HjCrumb from '../../comms/BreadCrumb.vue'
	import {CustomFun,pageSizes,Imgpath} from '../../comms/main.js'	
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
				    		title:'商品中心',
				    		url:'/goods/list'
			    		},
			    		{
				    		title:'商品管理',
				    		url:'/goods/list'
			    		},			    		
			    		{
				    		title:'用户评论',
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
			fieldClassName: function (field) {
		        if (!field) {
		          return '';
		        } else if ((field.$touched || field.$submitted) && field.$invalid) {
		          return 'error';
		        }
		    },
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
		    		url:'/assessment/listdata',
		    		params:{
		    			'shop_id':JSON.parse(window.localStorage.getItem("shopid")),
		    			'goods_name':that.title,		    			
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
		            url: '/assessment/batchsubmit',
		            params:{
		            	'assessment_ids':id,
		            	'method':'del',
		            	'is_show':0						
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
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });
		        });
		    },
		    batchOpt:function(status,prompt,val){
		        var that=this;		        
		        if(that.selectedList.length>0){
		          var selectedId=[];
		          var isRight=true;
		          that.selectedList.forEach(function(item,index){
		          	if(item.is_show==val){
			              that.$message({
			                type: 'warning',
			                message: '所选项包含已'+prompt+'数据，请重新选择!'
			              });
			              isRight=false;
			              return;
			            }
			            selectedId.push(item.assessment_id);	            
		          })
		          if(isRight&&selectedId.length>0){
		            this.$confirm('确定要批量【'+prompt+'】吗？', '提示', {
		              confirmButtonText: '确认',
		              cancelButtonText: '取消',
		              type: 'warning'
		            }).then(() => {
		              that.$http({
		                method:'post',
		                url: '/assessment/batchsubmit',
		                params:{
		                  'assessment_ids':selectedId.join(','),
		                  'method':status,
		                  'is_show':val
		                }
		              }).then(function (res) {		              	
		              	if(res.data.error=='0'){		              	
			                that.$message({
			                  type: 'success',
			                  message: '操作成功!'
			                });
			            }else{
	                      that.$message({
	                        type: 'error',
	                        message: res.data.desc
	                      });
	                    }
		                if(status=="del"){		                	
		                	that.getList(1);
		                }else{		                	
		                	that.getList(that.pageData.PageID);
		                }		                
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
		    }	    		    
		}
	}
</script>