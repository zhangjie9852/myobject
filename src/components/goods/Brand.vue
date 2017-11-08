<template>
	<div id="Brand">
		<HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
		<div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-content">
                            <form action="" class="form-inline m-b-sm clearfix" role="form">
                            	<el-button  type="warning" class="m-r-sm" @click="delAll">批量删除</el-button>
                            	<el-input class="m-r-sm m-b-sm" name="title" v-model="title" placeholder="品牌名称"  @keyup.enter="getList(pageData.PageID)"></el-input>
                            	<el-button class="search-btn" type="primary" icon="search" @click="getList(pageData.PageID)">筛选</el-button>
                            	<!--<button type="button" class="btn btn-m btn-warning m-r-sm" @click="delAll">批量删除</button>
                                <div class="form-group">
                                  <input name="title" v-model="title" type="text" class="form-control m-r-sm" placeholder="品牌名称" @keyup.enter="getList(pageData.PageID)">
                                </div>
                                <button type="button" class="btn btn-m btn-primary" @click="getList(pageData.PageID)"><i class="shop icon-chaxun"></i>筛选</button>-->  
                                <router-link to="/goods/brand/add" class="add-btn"><i class="shop icon-xinzeng"></i>添加品牌</router-link>
                            </form>                                
                            <div class="table-responsive clearfix">
                                <table class="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th class="table-checkbox">
                                            	<div class="checkbox-square-green" :class="{'checked':checkAllFlag}" @click="checkedAll(clist)">
                                                <input type="checkbox" class="checks"></div>
                                            </th>
                                            <th>品牌名称</th>
                                            <th>英文名称</th>
                                            <th>品牌图片</th>       
                                            <th>排序</th>                                            
                                            <th>是否显示</th>
                                            <th>审核状态</th>
                                            <th class="opt-select">操作</th>
                                        </tr>
                                    </thead>                                    
                                    <tbody>                                    	
                                        <tr v-for="(item,index) in clist">
                                            <td>
                                            	<div class="checkbox-square-green" :class="{'checked':item.isChecked}" @click="chkSelectAndAll(clist,item)">
                                                <input type="checkbox" class="checks"></div>   
                                            </td>
                                            <td>{{item.brand_ch_name}}</td>
                                            <td>{{item.brand_en_name}}</td>                              
                                            <td>
                                            	<img :src="item.brand_pc_logo" class="listImg">
                                            </td>
                                            <td><input type="text" :value="item.brand_sort" class="w100" @keyup.enter="editSort(item.brand_id,item.category_id,item.brand_sort)" @blur="editSort(item.brand_id,item.category_id,item.brand_sort)" v-model="item.brand_sort" /></td>
                                            <td>
                                            	<el-switch
												  v-model="item.is_show"
												  on-text=""
												  off-text=""
												  @change="cateShow(item.brand_id,item.category_id,item.is_show)">
												</el-switch>                                            	
                                            </td>
                                            <td>{{item.check_status_name}}</td>
                                            <td class="opt">
                                            	<span class="opt-down shop icon-shezhicaozuo" @click.stop="opToggle(clist,item.brand_id,'brand_id')"></span>
                                                <ul v-show="item.isOptShow">
                                                	<!-- <li><router-link :to="'/goods/brand/details/'+item.brand_id">查看</router-link></li> -->                 	
                                                    <li><router-link :to="'/goods/brand/edit/'+item.brand_id">编辑</router-link></li>
                                                    <li v-if="item.check_status == 0 || item.check_status == -1"><a @click="openDialog(item.brand_ch_name,item.brand_id,item.check_status,item.check_msg)">审核</a></li>
                                                    <li><a @click="delOne(item.brand_id)">删除</a></li>
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
                            <div>
                        </div>
                        </div>
                      	</div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="品牌审核" :visible.sync="dialogVisible" size="tiny" :close-on-click-modal="false">	      
	      <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal">
	      	  <div class="form-group">
	            <label class="col-sm-4 control-label">品牌名称：</label>
	            <div class="col-sm-7 m-t-8">
	              {{brand_name}}                    
	            </div>
	          </div>
	          <div class="form-group">
	            <label class="col-sm-4 control-label">品牌审核：</label>
	            <div class="col-sm-7">
	              	<el-radio class="radio" name="check_status" v-model="check_status" :label="1">审核通过</el-radio>
                    <el-radio class="radio" name="check_status" v-model="check_status" :label="-1">审核不通过</el-radio>
	            </div>
	          </div>
	          <validate class="form-group" v-if="check_status==-1">
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
				checkAllFlag:false,
        		selectedList:[],				
				PSLists:pageSizes,
				Imgpath:Imgpath,				
				CrumbBox:{
	    			CrumbList:
		    		[
			    		{
				    		title:'商品中心',
				    		url:'/goods/brand'
			    		},
			    		{
				    		title:'商品配置',
				    		url:'/goods/brand'
			    		},
			    		{
				    		title:'品牌管理',
				    		url:''
			    		}
		    		]
		    	},
		    	formstate:{},
		    	clist:[],
		    	dialogVisible:false,
		    	brand_id:null,
		    	brand_name:'',    	
		    	check_status:null,
		    	reason:'',
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
		            url: '/goods_brand/batchsubmit',
		            params:{
		            	'ids':id						
		            }
		          }).then(function (res) {
			          if(res.data.error==0){
			          	that.$message({
			              type: 'success',
			              message: '删除成功!'
			            });
			            that.getList(1);
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
		          //已取消
		        });
		    },
		    delAll:function(){
		        var that=this;		        
		        if(that.selectedList.length>0){
		          var selectedId=[];
		          that.selectedList.forEach(function(item,index){
		            selectedId.push(item.brand_id);
		          })
		          if(selectedId.length>0){
		            this.$confirm('确认操作此信息吗？', '提示', {
		              confirmButtonText: '确认',
		              cancelButtonText: '取消',
		              type: 'warning'
		            }).then(() => {
		              that.$http({
		                method:'post',
		                url: '/goods_brand/batchsubmit',
		                params:{
		                  'ids':selectedId.join(','),		                  
		                }
		              }).then(function (res) {		              		                
		                 if(res.data.error==0){
				          	that.$message({
				              type: 'success',
				              message: '删除成功!'
				            });
				            that.getList(1);
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
		    	this.brand_id = id;
		    	this.brand_name = title;		    	
		    	this.check_status = flag;
		    	this.reason = reason;		    	
		    },
		    onSubmit:function(){
		    	var that = this; 
		    	if (this.formstate.$valid) {
			    	that.$http({
			            method: 'post',
			            url: '/goods_brand/batchexamine',
			            params: {
			            	band_ids:that.brand_id,
			              	method:'examine',
			              	check_status:that.check_status,
			              	check_msg:that.reason	              
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
			getList(page) {				
				//$(window).scrollTop(0);
				var that = this;
				that.checkAllFlag=false;
				that.selectedList=[];				     		    		
	      		that.$http({
						  method:'post',
						  url: '/goods_brand/listdata',
						  params:{						  							
							'brand_name':that.title,
							'Perpage':that.pageData.Perpage,
							'PageID':page
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
		                          type: 'warning'
		                        });
							}							
						}).catch(function (error) {
							console.log(error);
						});
			},		
			cateShow:function(cid,cateId,status){
				var that = this;				
				that.$http({
						  method:'post',
						  url: '/goods_brand/editsubmit',
						  params:{
							'brand_id':cid,
							'category_id':cateId,
							'is_show':status
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
			editSort:function(cid,cateId,csort){
				var that = this;					
				event.currentTarget.blur();
				that.$http({
						  method:'post',
						  url: '/goods_brand/editsubmit',
						  params:{
							'brand_id':cid,
							'category_id':cateId,
							'brand_sort':csort
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
			}               
		}
	}
</script>
