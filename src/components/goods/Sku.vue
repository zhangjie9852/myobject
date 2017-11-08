<template>
	<div id="skuList">
		<HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
		<div class="wrapper wrapper-content animated fadeInRight">
			<div class="row">
				<div class="col-lg-12">
					<div class="ibox float-e-margins">
						<div class="ibox-content">
							<form action="" class="form-inline m-b-sm clearfix" role="form">
								<el-dropdown class="m-r-sm">
								  	<el-button type="warning">
								    	批量操作<i class="el-icon-caret-bottom el-icon--right"></i>
								  	</el-button>
								  	<el-dropdown-menu slot="dropdown">
									    <el-dropdown-item>
			                                <span @click="batchOpt(-2)">批量删除</span>
									    </el-dropdown-item>
									    <el-dropdown-item>
			                                <span @click="batchOpt(-1)">批量禁用</span>
									    </el-dropdown-item>
									    <el-dropdown-item>
			                                <span  @click="batchOpt(1)">批量启用</span>
									    </el-dropdown-item>
								  	</el-dropdown-menu>
								</el-dropdown>
                            	<el-input class="m-r-sm m-b-sm" name="title" v-model="title" placeholder="规格名称"  @keyup.enter="getList(pageData.PageID)"></el-input>
                            	<el-button class="search-btn" type="primary" icon="search" @click="getList(pageData.PageID)">筛选</el-button>

                    			<!--<div class="form-group">
                                  <input name="title" type="text" class="form-control m-r-sm" placeholder="规格名称" v-model="title" @keyup.enter="getList(pageData.PageID)">
                                </div>
			                    <button type="button" class="btn btn-m btn-primary" @click="getList(pageData.PageID)"><i class="shop icon-chaxun"></i>筛选</button>-->
			                    <router-link to="/goods/sku/add" class="btn btn-m btn-primary hj_fr"><i class="shop icon-xinzeng"></i>添加规格</router-link>
                    		</form>
                    		<div class="table-responsive clearfix">
                    			<table class="table table-striped table-bordered table-hover">
                    				<thead>
                    					<tr>
                                            <th class="table-checkbox">
                                            	<div class="checkbox-square-green" :class="{'checked':checkAllFlag}" @click="checkedAll(clist)">
                                                <input type="checkbox" class="checks"></div>
                                            </th>
                                            <th>规格名称</th>
                                            <th>规格值</th>
                                            <th>状态</th>
                                            <th>类型</th>
                                            <th class="opt-select">操作</th>
                                        </tr>
                    				</thead>
                    				<tbody>
										<tr v-for="(item,index) in clist">
											<td>
												<div class="checkbox-square-green" :class="{'checked':item.isChecked}" @click="chkSelectAndAll(clist,item)">
                                            	<input type="checkbox" class="checks"></div>
											</td>
											<td>{{item.goods_sku_name}}</td>
											<td>{{item.goods_sku_value}}</td>
											<td>
												<!-- <el-switch
												  v-model="item.status_goods_sku"
												  on-text=""
												  off-text=""
												  @change="cateShow(item.goods_sku_id,item.status_goods_sku)">
												</el-switch> -->
												{{item.status_goods_sku}}
											</td>
											<td>{{item.goods_sku_type}}</td>
											<td class="opt">
												<span class="opt-down shop icon-shezhicaozuo" @click.stop="opToggle(clist,item.goods_sku_id,'goods_sku_id')"></span>
                                                <ul v-show="item.isOptShow">
                                                	<li><router-link :to="'/goods/sku/edit/'+item.goods_sku_id">编辑</router-link></li>
                                                    <li><a @click="delOne(item.goods_sku_id)">删除</a></li>
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
				    		title:'商品中心',
				    		url:'/goods/sku'
			    		},
			    		{
				    		title:'商品配置',
				    		url:'/goods/sku'
			    		},
			    		{
				    		title:'规格管理',
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
		    		url:'/goods_sku/listdata',
		    		params:{
		    			"keyword":that.title,
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
			    		that.title = '';
			    		that.clist.forEach(function (item,index) {
					        that.$set(item,"isOptShow",false);
					    })
				    }else{
                        console.log(res.data.desc);
					}
		    	}).catch(function(error){
		    		console.log(error);
		    	})
		    },
		    cateShow:function(cid,status){
				var that = this;
				that.$http({
						  method:'post',
						  url: '/goods_sku/editsubmit',
						  params:{
							'goods_sku_id':cid,
							'status_goods_sku':status
						  }
						}).then(function (res) {
							if(res.data.error==0){
								that.getList(that.pageData.PageID);
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
		            url: '/goods_sku/batchsubmit',
		            params:{
		            	'goods_sku_id':id,
		            	'method':-2
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
		    batchOpt:function(status){
		        var that=this;
		        if(that.selectedList.length>0){
		          var selectedId=[];
		          that.selectedList.forEach(function(item,index){
		            selectedId.push(item.goods_sku_id);
		          })
		          if(selectedId.length>0){
		            this.$confirm('确定要进行批量操作吗？', '提示', {
		              confirmButtonText: '确认',
		              cancelButtonText: '取消',
		              type: 'warning'
		            }).then(() => {
		              that.$http({
		                method:'post',
		                url: '/goods_sku/batchsubmit',
		                params:{
		                  'goods_sku_id':selectedId.join(','),
		                  'method':status
		                }
		              }).then(function (res) {
		              	//console.log(res)
		              	if(res.data.error ==0){
		              		that.$message({
			                  type: 'success',
			                  message: '操作成功!'
			                });
			                if(status==-2){
			                	that.getList(1);
			                }else{
			                	that.getList(that.pageData.PageID);
			                }
		              	}else{
		              		that.$message({
			                  type: 'error',
			                  message: res.data.desc
			                });
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
		    },
		    /*
		    delAll:function(){
		        var that=this;
		        if(that.selectedList.length>0){
		          var selectedId=[];
		          that.selectedList.forEach(function(item,index){
		            selectedId.push(item.goods_sku_id);
		          })
		          if(selectedId.length>0){
		            this.$confirm('确认删除此信息吗？', '提示', {
		              confirmButtonText: '确认',
		              cancelButtonText: '取消',
		              type: 'warning'
		            }).then(() => {
		              that.$http({
		                method:'post',
		                url: '/goods_sku/batchsubmit',
		                params:{
		                  'goods_sku_id':selectedId.join(','),
		                  'method':-2
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
		          }
		        }else{
		          this.$message({
		            type: 'warning',
		            message: '请至少选择一条数据!'
		          });
		        }
		    },
		    forbidden:function(){
		    	var that=this;
		        if(that.selectedList.length>0){
		        	var selectedId=[];
		          	var isRight=true;
		          	that.selectedList.forEach(function(item,index){
		          		if(item.status_goods_sku=='已禁用'){
			              that.$message({
			                type: 'warning',
			                message: '所选项包含已禁用数据，请重新选择!'
			              });
			              isRight=false;
			              return;
			            }else{
			              selectedId.push(item.goods_sku_id);
			            }
			        })
		          if(isRight){
		            this.$confirm('确认全部禁用吗？', '提示', {
		              confirmButtonText: '确认',
		              cancelButtonText: '取消',
		              type: 'warning'
		            }).then(() => {
		              that.$http({
		                method:'post',
		                url: '/goods_sku/batchsubmit',
		                params:{
		                  'goods_sku_id':selectedId.join(','),
		                  'method':-1
		                }
		              }).then(function (res) {
		                that.$message({
		                  type: 'success',
		                  message: '确认禁用!'
		                });
		                that.getList(1);
		              }).catch(function (error) {
		                console.log(error);
		              });
		            }).catch(() => {
		              this.$message({
		                type: 'info',
		                message: '已取消禁用'
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
		    startUsing:function(){
		    	var that=this;
		        if(that.selectedList.length>0){
		        	var selectedId=[];
		        	var isRight=true;
		          	that.selectedList.forEach(function(item,index){
		          		if(item.status_goods_sku=='已启用'){
			              that.$message({
			                type: 'warning',
			                message: '所选项包含已启用数据，请重新选择!'
			              });
			              isRight=false;
			              return;
			            }else{
			              selectedId.push(item.goods_sku_id);
			            }
			        })
		          if(isRight){
		            this.$confirm('确认全部启用吗？', '提示', {
		              confirmButtonText: '确认',
		              cancelButtonText: '取消',
		              type: 'warning'
		            }).then(() => {
		              that.$http({
		                method:'post',
		                url: '/goods_sku/batchsubmit',
		                params:{
		                  'goods_sku_id':selectedId.join(','),
		                  'method':1
		                }
		              }).then(function (res) {
		                that.$message({
		                  type: 'success',
		                  message: '确认启用!'
		                });
		                console.log(1111,selectedId);
		                that.getList(1);
		              }).catch(function (error) {
		                console.log(error);
		              });
		            }).catch(() => {
		              this.$message({
		                type: 'info',
		                message: '已取消启用'
		              });
		            });
		          }
		        }else{
		          this.$message({
		            type: 'warning',
		            message: '请至少选择一条数据!'
		          });
		        }
		    }*/
		}
	}
</script>
