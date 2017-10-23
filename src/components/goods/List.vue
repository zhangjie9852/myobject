<template>
	<div id="GoodsList">
		<HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
		<div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                    	<div class="ibox-content">
                        	<div class="btn-group m-b-md">	                      
		                      <button type="button" class="btn m-r-sm" :class="isOnline==''&&Lstatus==1?'btn-primary':'btn-default'" @click="ListState('',1)">全部商品</button>
		                      <button type="button" class="btn m-r-sm" :class="isOnline==1?'btn-primary':'btn-default'" @click="ListState(1,1)">已上架商品(10)</button>
		                      <button type="button" class="btn m-r-sm" :class="isOnline==-1?'btn-primary':'btn-default'" @click="ListState(-1,1)">下架商品(12)</button>
		                      <button type="button" class="btn m-r-sm" :class="Lstatus==-1?'btn-primary':'btn-default'" @click="ListState('',-1)">商品回收站(2)</button>
		                    </div>
		                    <form action="#" class="form-inline m-b-sm" role="form">
								<el-dropdown class="m-r-xs">
								  <el-button class="batch-btn">
								    批量操作<i class="el-icon-caret-bottom el-icon--right"></i>
								  </el-button>
								  <el-dropdown-menu slot="dropdown" v-if="Lstatus==1">
								    <el-dropdown-item v-if="isOnline==-1 ||isOnline==''"><span @click="batchOpt('up','上架')">上架</span></el-dropdown-item>
								    <el-dropdown-item v-if="isOnline==1 ||isOnline==''"><span  @click="batchOpt('down','下架')">下架</span></el-dropdown-item>
								    <el-dropdown-item><span @click="batchOpt('topic','置顶')">置顶</span></el-dropdown-item>
								    <el-dropdown-item><span @click="batchOpt('untopic','取消置顶')">取消置顶</span></el-dropdown-item>
								    <el-dropdown-item>
										<el-tooltip placement="top">
		                                	<span @click="batchOpt('del','删除')">批量删除</span>
		                                	<div slot="content">删除后的商品可在商品回收站保存。<br/>可以进行商品还原，也可以彻底删除</div>
		                                </el-tooltip>
								    </el-dropdown-item>
								  </el-dropdown-menu>
								  <el-dropdown-menu slot="dropdown" v-else>
								    <el-dropdown-item ><span @click="batchOpt('restore','还原')">批量还原</span></el-dropdown-item>
								    <el-dropdown-item><span @click="batchOpt('callback','删除')">批量删除</span></el-dropdown-item>
								  </el-dropdown-menu>
								</el-dropdown>
								<el-input class="m-r-xs m-b-sm" name="title" v-model="title" placeholder="商品名称"></el-input>
                                <el-button class="search-btn" type="primary" icon="search" @click="getList(pageData.PageID)">筛选</el-button>  
                                <router-link to="/goods/list/add" class="add-btn"><i class="shop icon-xinzeng"></i>添加商品</router-link>
                            </form>                              
                            <div class="table-responsive clearfix">
                                <table class="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th class="table-checkbox">
                                            	<div class="checkbox-square-green" :class="{'checked':checkAllFlag}" @click="checkedAll(clist)">
                                                <input type="checkbox" class="checks"></div>
                                            </th>
                                            <th>商品编号</th>
                                            <th>商品名称</th>
                                            <th>商品图片</th>
                                            <th>商家名称</th>
                                            <th>所属分类</th>
                                            <th>售价</th>
                                            <th>库存</th>                                        
                                            <th v-if="Lstatus==1">排序</th>
                                            <th>商品状态</th>
                                            <th>审核状态</th>
                                            <th>置顶状态</th>
                                            <th class="opt-select">操作</th>
                                        </tr>
                                    </thead>                                    
                                    <tbody class="goodlist">                                    	
                                        <tr v-for="(item,index) in clist">
                                            <td>
                                                <div class="checkbox-square-green" :class="{'checked':item.isChecked}" @click="chkSelectAndAll(clist,item)">
                                                <input type="checkbox" class="checks"></div>
                                            </td>
                                            <td>{{item.goods_code}}</td>
                                            <td>
                                            	<span class="listDesc" :title="item.goods_name">{{item.goods_name}}</span><br>
                                            	<em class="bg-blue" v-if="item.goods_wholesale==1">支持批发</em>
                                            	<em class="text-org" v-if="item.goods_retail==1">支持零售</em>
                                            </td>
                                            <td><img :src="item.goods_img_url" class="listImg"></td>
                                            <td>{{item.shop_name}}</td>
                                            <td>{{item.category_name}}</td>
                                            <td>{{item.goods_price}}</td>
                                            <td>{{item.goods_store_nums}}</td>
                                            <td v-if="Lstatus==1">
												<input type="text" :value="item.goods_sort" class="w100" @keyup.enter="editSort(item.goods_id,item.goods_sort)" @blur="editSort(item.goods_id,item.goods_sort)" v-model="item.goods_sort" />
                                            </td>
                                            <td>{{item.goods_isonline}}</td>
                                            <td>{{item.goods_examine_name}}</td>
                                            <td>{{item.is_topicStr}}</td>
                                            <td class="opt">
                                            	<span class="opt-down shop icon-shezhicaozuo" @click.stop="opToggle(clist,item.goods_id,'goods_id')"></span>
                                                <ul v-if="Lstatus==1" v-show="item.isOptShow"> 	
                                                    <li><router-link :to="'/goods/list/edit/'+item.goods_id">编辑</router-link></li>
                                                    <li v-if="item.goods_examine == -1 || item.goods_examine == 3"><a @click="openDialog(item.goods_name,item.goods_id,item.goods_examine,item.examine_msg)"><i class="icon_s_password"></i> 审核</a></li>
                                                    <li><a @click="delOne(item.goods_id,'del')">删除</a></li>
                                                </ul>
                                                <ul v-else v-show="item.isOptShow">
                                                    <li><a @click="restore(item.goods_id)"><i class="icon_l_reply"></i> 还原</a></li>
                                                    <li><a @click="delOne(item.goods_id,'callback')"><i class="icon_l_delete"></i> 删除</a></li>
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
        <el-dialog title="商品审核" :visible.sync="dialogVisible" size="tiny">	      
	      <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal">
	      	  <div class="form-group">
	            <label class="col-sm-4 control-label">商品名称：</label>
	            <div class="col-sm-7 m-t-8">
	              {{goods_name}}                    
	            </div>
	          </div>
	          <div class="form-group">
	            <label class="col-sm-4 control-label">商品审核：</label>
	            <div class="col-sm-7">
	              	<el-radio class="radio" name="audit_status" v-model="audit_status" :label="2">审核通过</el-radio>
                    <el-radio class="radio" name="audit_status" v-model="audit_status" :label="3">审核不通过</el-radio>
	            </div>
	          </div>
	          <validate class="form-group" v-if="audit_status==3">
	            <label class="col-sm-4 control-label">原因：</label>
	            <div class="col-sm-7">
	              <textarea name="reason" class="form-control" v-model="reason" required :class="fieldClassName(formstate.reason)">{{reason}}</textarea>
	              <field-messages name="reason" show="$touched || $submitted" class="form-control-callback">
                    <div slot="required" class="error">原因不能为空</div>                    
                  </field-messages>                  
	            </div>
	          </validate>	          
	          <div class="hr-line-dashed"></div>
              <div class="form-group draggable ui-draggable">
                <div class="col-sm-12 col-sm-offset-4">
                  <button class="btn btn-primary" type="submit">确定</button>
                  <button class="btn btn-white m-l-sm" type="button" @click="dialogVisible=false">取消</button>                  
                </div>
              </div>
	      </vue-form>
	    </el-dialog> 	    	            
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
			return {
				title:'',				
				PSLists:pageSizes,
				Imgpath:Imgpath,
				checkAllFlag:false,
        		selectedList:[],				
				isOnline:'',
				Lstatus:1,
				dialogVisible:false,
				goods_name:'',
				audit_status:2,
				reason:'',
				formstate: {},			
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
				    		title:'商品列表',
				    		url:''
			    		}
		    		]
		    	},
		    	clist:[],	
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
		    ListState(state,state2){		    	
		    	this.isOnline = state;
		    	this.Lstatus = state2;
		    	this.getList(1)
		    },
			getList(page) {									
				var that = this;
				that.checkAllFlag=false;
				that.selectedList=[];
				var paramObj={
		          PageID:page,
		          Perpage:that.pageData.Perpage
		        };
				// if(that.title!=""){
		  //           paramObj["keyword"]=that.title;
		  //       }
		  //       if(that.isOnline!=''){
		  //           paramObj["is_online"]=that.isOnline;
		  //       }
		  //       if(that.Lstatus!=1){
		  //           paramObj["status"]=that.Lstatus;
		  //       }				     		    		
	      		that.$http({
						  method:'post',
						  url: '/goods/listdata',						  
						  params:{						  							
							'keyword':that.title,
							'Perpage':that.pageData.Perpage,
							'PageID':page,
							'is_online':that.isOnline,
							'status':that.Lstatus,
						  }
						}).then(function (res) {							
							if(res.data.error==0){														
								that.clist = res.data.data.table_data;			
								that.pageData.PageID  = res.data.data.PageID;
								that.pageData.Perpage = res.data.data.Perpage;
								that.pageData.Results = res.data.data.Results;
								that.pageData.Pages   = res.data.data.Pages;							
								that.title = '';
								that.clist.forEach(function (item,index) {							      
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
			delOne:function(id,state){				
		        var that=this;
		        this.$confirm('确认删除此信息吗？', '提示', {
		          confirmButtonText: '确认',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          that.$http({
		            method:'post',
		            url: '/goods/batchsubmit',
		            params:{
		            	'goods_id':id,
						'method':state
		            }
		          }).then(function (res) {
		          	//console.log(res)
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
		    restore:function(id){
				var that = this;
				that.$http({
						  method:'post',
						  url: '/goods/batchsubmit',
						  params:{
							'goods_id':id,
		                  	'method':'restore'
						  }			  
						}).then(function (res){																			 
							if(res.data.error==0){
								that.$message({
						            type: 'info',
						            message: res.data.desc
						          });
								that.getList(that.pageData.PageID);
							}									
						}).catch(function (error) {
							console.log(error);
						});
			},			
			batchOpt:function(status,prompt){
		        var that=this;		        
		        if(that.selectedList.length>0){
		          var selectedId=[];
		          var isRight=true;
		          that.selectedList.forEach(function(item,index){
		          	if(item.goods_isonline==prompt){
			              that.$message({
			                type: 'warning',
			                message: '所选项包含已'+prompt+'数据，请重新选择!'
			              });
			              isRight=false;
			              return;
			            }
			            selectedId.push(item.goods_id);	            
		          })
		          if(isRight&&selectedId.length>0){
		            this.$confirm('确定要批量【'+prompt+'】吗？', '提示', {
		              confirmButtonText: '确认',
		              cancelButtonText: '取消',
		              type: 'warning'
		            }).then(() => {
		              that.$http({
		                method:'post',
		                url: '/goods/batchsubmit',
		                params:{
		                  'goods_id':selectedId.join(','),
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
		    },
		    openDialog:function(title,id,flag,reason){
		    	this.dialogVisible = true;
		    	this.goods_id = id;
		    	this.goods_name = title;		    	
		    	this.audit_status = flag;
		    	this.reason = reason;		    	
		    },
		    onSubmit:function(){
		    	var that = this; 
		    	if (this.formstate.$valid) {
			    	that.$http({
			            method: 'post',
			            url: '/goods/batchsubmit',
			            params: {
			            	goods_id:that.goods_id,
			              	method:'examine',
			              	examine:that.audit_status,
			              	examine_msg:that.reason	              
			            }
			          }).then(function (res) {			          	          	
			            if(res.data.error=='0'){
			              that.$message({
			                type: 'success',
			                message: '操作成功!'
			              });
			              that.dialogVisible = false;
			              that.getList(that.pageData.PageID);
			            }else{
			              that.$message({
			                type: 'error',
			                message: res.data.desc
			              });
			            }
			          }).catch(function (error) {
			            that.$message({
			              type: 'error',
			              message: '操作失败，请重新提交!'
			            });
			          });
			    }
		    },		    	
			editSort:function(cid,csort){
				var that = this;					
				event.currentTarget.blur();
				that.$http({
						  method:'post',
						  url: '/goods/updateSort',
						  params:{
							'goods_id':cid,
							'sort':csort,
							'method':'updateSort'
						  }			  
						}).then(function (res) {
						console.log(res)							 
							if(res.data.error==0){
								//that.getList(that.pageData.PageID);
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
.table-box{
    overflow-x: auto;
  }
  .table-responsive{
    padding-bottom: 20px;
    overflow:auto;
  }
</style>