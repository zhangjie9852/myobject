<template>
	<div id="sellerList">
		<HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
		<div class="wrapper wrapper-content animated fadeInRight">
			<div class="row">
				<div class="col-lg-12">
					<div class="ibox float-e-margins">
						<div class="ibox-title">
                            <h5>商家列表</h5>
                        </div>
                        <div>
                        	<div class="ibox-content">
                        		<div class="form-inline m-b-sm clearfix">
                        			<div class="form-group">
	                                  <input name="title" type="text" class="form-control m-r-xs" placeholder="商家名称" v-model="title" @keyup.enter="getList(pageData.PageID)">
	                                </div>
				                    <button type="button" class="btn btn-m btn-primary" @click="getList(pageData.PageID)">查询</button>
				                    <button type="button" class="btn btn-m btn-danger m-l-xs" @click="batchOpt('del','删除')">批量删除</button>
				                   <button type="button" class="btn btn-m btn-warning m-l-xs" @click="batchOpt('state','禁止登录',-1)">禁止登录</button>
				                    <button type="button" class="btn btn-m btn-primary m-l-xs" @click="batchOpt('state','恢复登录',1)">恢复登录</button>
				                    <router-link to="/shop/add" class="btn btn-m btn-danger hj_fr">添加商家</router-link>
                        		</div>
                        		<div class="table-responsive clearfix">
                        			<table class="table table-striped table-bordered table-hover">
                        				<thead>
                        					<tr>
	                                            <th width="5%">
	                                            	<div class="checkbox-square-green" :class="{'checked':checkAllFlag}" @click="checkedAll(clist)">
	                                                <input type="checkbox" class="checks"></div>
	                                            </th>
	                                            <th class="text-center">商家名称</th>
	                                            <th class="text-center">经营类型</th>
	                                            <th class="text-center">联系方式</th>
	                                            <th class="text-center">所属区域</th>
	                                            <th class="text-center">商家开关</th>
	                                            <th class="text-center">创建时间</th>
	                                            <th class="t-right">操作</th>
	                                        </tr>
                        				</thead>
                        				<tbody>
											<tr v-for="(item,index) in clist">
												<td>
													<div class="checkbox-square-green" :class="{'checked':item.isChecked}" @click="chkSelectAndAll(clist,item)">
                                                	<input type="checkbox" class="checks"></div>
												</td>
												<td class="text-center">{{item.shop_name}}</td>
												<td class="text-center">
													<template v-if="item.shop_modes==0">平台分店</template>
													<template v-if="item.shop_modes==1">自营</template>
													<template v-if="item.shop_modes==2">分销-集中供货</template>
												</td>
												<td class="text-center">{{item.shop_linkman}}({{item.shop_linkman_mobile}})</td>
												<td class="text-center">{{item.shop_address}}</td>
												<td class="text-center">
													<el-switch
											          v-model="item.shop_state"
											          on-text=""
											          off-text=""
											          :on-value="1" :off-value="-1"
											          @change="changeSellerStatus(item)">
											        </el-switch>
												</td>
												<td class="text-center">{{item.time_create}}</td>
												<td class="opt">
													<span class="opt-down" @click.stop="opToggle(clist,item.shop_id,'shop_id')">处理 <i class="fa fa-caret-down"></i></span>
	                                                <ul v-show="item.isOptShow">
	                                                	<li><router-link :to="'/shop/edit/'+item.shop_id"><i class="icon_l_edit"></i> 编辑</router-link></li>      	
	                                                    <li><a @click="delOne(item.shop_id)"><i class="icon_l_delete" ></i> 删除</a></li>
	                                                    <li v-if="item.user_id==''||item.user_id==null"><a @click="openDialog(item.shop_name,item.shop_id,item.user_id,item.user_login,item.user_pass)"><i class="icon_l_jurisdiction" ></i> 分配账户</a></li>
	                                                    <li v-else><a @click="openDialog(item.shop_name,item.shop_id,item.user_id,item.user_login,item.user_pass)"><i class="icon_l_jurisdiction" ></i> 修改账户</a></li>
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
		<el-dialog title="分配账户" :visible.sync="dialogVisible" size="tiny">	      
	      <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal">
	      	  <div class="form-group">
	            <label class="col-sm-4 control-label">商家名称：</label>
	            <div class="col-sm-7 m-t-8">
	              {{seller_title}}                    
	            </div>
	          </div>
	          <template v-if="user_id!='' && user_id!=null"><!-- 修改权限 -->
		          <validate class="form-group">
		            <label class="col-sm-4 control-label">账户名称66：</label>
		            <div class="col-sm-7">
		              <input type="text" name="seller_account" v-model="seller_account" class="form-control" required :class="fieldClassName(formstate.seller_account)" @blur="userIsExist2" @focus="isExist2=false"> 
		              <field-messages name="seller_account" show="$touched || $submitted" class="form-control-callback">
	                    <div slot="required" class="error">账户名称不能为空</div>
	                    <div class="error" v-if="isExist2">账户已存在</div>
	                  </field-messages>                    
		            </div>
		          </validate>
		          <validate class="form-group">
		            <label class="col-sm-4 control-label">登录密码：</label>
		            <div class="col-sm-7">
		              <input type="password" name="seller_password" v-model="seller_password" class="form-control" minlength="6" maxlength="20" placeholder="不修改请保持为空" :class="fieldClassName(formstate.seller_password)">
		              <field-messages name="seller_password" show="$touched || $submitted" class="form-control-callback">                    
	                    <div slot="minlength" class="error">登录密码不能少于6位</div>
	                    <div slot="maxlength" class="error">登录密码不能多于20位</div>                   
	                  </field-messages>
		            </div>
		          </validate>
	          </template>
	          <template v-else><!-- 添加权限 -->
		          <validate class="form-group">
		            <label class="col-sm-4 control-label">账户名称：</label>
		            <div class="col-sm-7">
		              <input type="text" name="seller_account" v-model="seller_account" class="form-control" required :class="fieldClassName(formstate.seller_account)" @blur="userIsExist" @focus="isExist=false"> 
		              <field-messages name="seller_account" show="$touched || $submitted" class="form-control-callback">
	                    <div slot="required" class="error">账户名称不能为空</div>
	                    <div class="error" v-if="isExist">账户已存在</div>
	                  </field-messages>                    
		            </div>
		          </validate>
		          <validate class="form-group">
		            <label class="col-sm-4 control-label">登录密码：</label>
		            <div class="col-sm-7">
		              <input type="password" name="seller_password" v-model="seller_password" class="form-control" required minlength="6" maxlength="20" :class="fieldClassName(formstate.seller_password)">
		              <field-messages name="seller_password" show="$touched || $submitted" class="form-control-callback">
	                    <div slot="required" class="error">登录密码不能为空</div>
	                    <div slot="minlength" class="error">登录密码不能少于6位</div>
	                    <div slot="maxlength" class="error">登录密码不能多于20位</div>                   
	                  </field-messages>
		            </div>
		          </validate>
	          </template>
	          <div class="hr-line-dashed"></div>
              <div class="form-group draggable ui-draggable">
                <div class="col-sm-12 col-sm-offset-4">
                  <button class="btn btn-primary" type="submit">确定</button>
                  <button class="btn btn-white m-l-sm" type="button" @click="dialogVisible=false">取消</button>                  
                </div>
              </div>
	      </vue-form>	      
	      <!-- <div slot="footer" class="dialog-footer">
	        <el-button @click="dialogVisible=false">取消</el-button>
	        <el-button type="primary" @click="confirmAllot">确定</el-button>
	      </div> -->
	    </el-dialog>
	</div>
</template>
<script>	
	import HjCrumb from '../comms/BreadCrumb.vue'
	import {CustomFun,pageSizes,Imgpath} from '../comms/main.js'
	//import vueForm from 'vue-form'
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
				dialogVisible:false,
				isExist:false,
				isExist2:false,
				user_id:null,
				seller_id:0,
				seller_title:'',
				seller_account_old:'',
				seller_account:'',
				seller_password:'',				
        		selectedList:[],
	    		CrumbBox:{
	    			CrumbList:
		    		[
			    		{
				    		title:'商家管理',
				    		url:'/shop/list'
			    		},			    		
			    		{
				    		title:'商家列表',
				    		url:''
			    		}
		    		]
		    	},
		    	formstate: {},
		    	paramObj:{},
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
		    		url:'/shop/listdata',
		    		params:{
		    			'shop_name':that.title,		    			
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
		    openDialog(title,id,uid,name,pass){
		    	this.dialogVisible = true;
		    	this.seller_id = id;
		    	this.user_id = uid;
		    	this.seller_title = title;
		    	this.seller_account_old = name;		    	
		    	this.seller_account = name;
		    	this.seller_password = '';
		    },		    
		    changeSellerStatus(item){//商家开关		    	
		        var that = this;
		        //var flag = item.shop_state==1 ? -1 : 1;
		        var flag = item.shop_state;		        
		        that.$http({
		          method: 'post',
		          url: '/shop/batchsubmit',
		          params: {
		            shop_ids: item.shop_id,
		            state: flag,
		            method:'state'
		          }
		        }).then(function (res) {		        	
		          if(res.data.error=='0'){
		            that.getList(that.pageData.PageID);
		          }else {
		            that.$message({
		              type: 'error',
		              message: res.data.desc
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
		          type: 'warning'
		        }).then(() => {
		          that.$http({
		            method:'post',
		            url: '/shop/batchsubmit',
		            params:{
		            	'shop_ids':id,
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
		          	if(item.shop_state==val){
			              that.$message({
			                type: 'warning',
			                message: '所选项包含已'+prompt+'数据，请重新选择!'
			              });
			              isRight=false;
			              return;
			            }
			            selectedId.push(item.shop_id);	            
		          })
		          if(isRight&&selectedId.length>0){
		            this.$confirm('确定要批量【'+prompt+'】吗？', '提示', {
		              confirmButtonText: '确认',
		              cancelButtonText: '取消',
		              type: 'warning'
		            }).then(() => {
		              that.$http({
		                method:'post',
		                url: '/shop/batchsubmit',
		                params:{
		                  'shop_ids':selectedId.join(','),
		                  'method':status,
		                  'state':val
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
		    userIsExist () {
		        var that=this;		        
		        that.$http({
		          method:'post',
		          url: '/user/userExist',
		          params:{
		            user_login:that.seller_account
		          }
		        }).then(function (res) {
		          if(res.data.error=='0'){		          	
		            that.isExist=res.data.data;
		          }else{		          	
		            that.$message({
		              type: 'error',
		              message: res.data.desc
		            });
		          }
		        }).catch(function (error) {
		          console.log(error);
		        });
		    },
		    userIsExist2 () {
		        var that=this;
		        if(that.seller_account!=that.seller_account_old){	        
			        that.$http({
			          method:'post',
			          url: '/user/userExist',
			          params:{
			            user_login:that.seller_account
			          }
			        }).then(function (res) {
			          if(res.data.error=='0'){		          	
			            that.isExist2=res.data.data;
			          }else{		          	
			            that.$message({
			              type: 'error',
			              message: res.data.desc
			            });
			          }
			        }).catch(function (error) {
			          console.log(error);
			        });
		        }else{
		          that.isExist2=false;
		        }
		    },
		    onSubmit: function () {
		        var that = this;
		        var isAdmin = null;
		        var userPass = '';
		        var id = null;       
		        if (this.formstate.$valid && !that.isExist) {
		        	if(that.user_id !='' && that.user_id !=null){
		        		id = that.user_id;
		        		isAdmin = null;
		        	}else{
		        		id = null;
		        		isAdmin = 1;
		        	}
		        	// if(that.seller_password !='' && that.seller_password !=null){
		        	// 	userPass = that.seller_password;
		        	// }else{
		        	// 	userPass = null;
		        	// }
		          that.$http({
		            method: 'post',
		            url: '/user/addUser',
		            params: {
		              user_login:that.seller_account,
		              user_pass:that.seller_password,
		              user_status:1,
		              goods_shop_base_id:that.seller_id,
		              is_admin:isAdmin,
		              id:id	              
		            }
		          }).then(function (res) {		          	
		            if(res.data.error=='0'){
		              that.$message({
		                type: 'success',
		                message: '成功!'
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
		              message: '失败，请重新提交!'
		            });
		          });
		        }
		      }		    		    
		}
	}
</script>