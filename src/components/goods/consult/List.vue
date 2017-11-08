<template>
	<div id="sellerList">
		<HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
		<div class="wrapper wrapper-content animated fadeInRight">
			<div class="row">
				<div class="col-lg-12">
					<div class="ibox float-e-margins">
						<div class="ibox-content">
							<form action="" class="form-inline m-b-sm clearfix" role="form">
								<el-button type="warning" class="m-r-sm" @click="batchOpt('del','删除')">批量删除</el-button>
								<!--<button type="button" class="btn btn-m btn-warning m-r-sm" @click="batchOpt('del','删除')">批量删除</button>-->
                    			<!--<div class="form-group">
                                  <input name="title" type="text" class="form-control m-r-sm" placeholder="请输入商品关键词" v-model="title" @keyup.enter="getList(pageData.PageID)">
                                </div>-->
                                <el-input class="m-r-sm m-b-sm" name="title" v-model="title" placeholder="请输入商品关键词" @keyup.enter="getList(pageData.PageID)"></el-input>
			                    <!--<button type="button" class="btn btn-m btn-primary" @click="getList(pageData.PageID)"><i class="shop icon-chaxun"></i>筛选</button>-->
			                    <el-button class="search-btn" type="primary" icon="search" @click="getList(pageData.PageID)">筛选</el-button>
                    		</form>
						
                    		<div class="table-responsive clearfix">
                    			<table class="table table-striped table-bordered table-hover">
                    				<thead>
                    					<tr>
                                            <th class="table-checkbox">
                                            	<div class="checkbox-square-green" :class="{'checked':checkAllFlag}" @click="checkedAll(clist)">
                                                <input type="checkbox" class="checks"></div>
                                            </th>
                                            <th>咨询商品</th>
                                            <th>商家名称</th>
                                            <th>咨询内容</th>
                                            <th>咨询时间</th>
                                            <th>是否回复</th>      
                                            <th class="opt-select">操作</th>
                                        </tr>
                    				</thead>
                    				<tbody>
										<tr v-for="(item,index) in clist">
											<td>
												<div class="checkbox-square-green" :class="{'checked':item.isChecked}" @click="chkSelectAndAll(clist,item)">
                                            	<input type="checkbox" class="checks"></div>
											</td>
											<td><span class="listDesc" :title="item.goods_name">{{item.goods_name}}</span></td>
											<td>{{item.shop_name}}</td>
											<td><span class="listDesc" :title="item.consult_assessment">{{item.consult_assessment}}</span></td>
											<td>{{item.time_create}}</td>
											<td>{{item.is_answer_name}}</td>
											<td class="opt">
												<span class="opt-down shop icon-shezhicaozuo" @click.stop="opToggle(clist,item.consult_id,'consult_id')"></span>
                                                <ul v-show="item.isOptShow">
                                                	<li v-if="item.is_answer==1"><router-link :to="'/goods/consult/details/'+item.consult_id">查看</router-link></li>
                                                	<li v-else><router-link :to="'/goods/consult/details/'+item.consult_id"> 回复</router-link></li>      	
                                                    <li><a @click="delOne(item.consult_id)"> 删除</a></li>                                   
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
	import HjCrumb from '../../comms/BreadCrumb.vue'
	import {CustomFun,pageSizes,Imgpath} from '../../comms/main.js'
	import vueForm from 'vue-form'
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
				    		url:'/goods/consult/list'
			    		},	
			    		{
				    		title:'商品管理',
				    		url:'/goods/consult/list'
			    		},		    		
			    		{
				    		title:'商品咨询',
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
		    		url:'/consult/listdata',
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
		          type: 'warning',
		          closeOnClickModal:false
		        }).then(() => {
		          that.$http({
		            method:'post',
		            url: '/consult/batchsubmit',
		            params:{
		            	'consult_ids':id,
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
			         selectedId.push(item.consult_id);	            
		          })
		          if(isRight&&selectedId.length>0){
		            this.$confirm('确定要批量【'+prompt+'】吗？', '提示', {
		              confirmButtonText: '确认',
		              cancelButtonText: '取消',
		              type: 'warning'
		            }).then(() => {
		              that.$http({
		                method:'post',
		                url: '/consult/batchsubmit',
		                params:{
		                  'consult_ids':selectedId.join(','),
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