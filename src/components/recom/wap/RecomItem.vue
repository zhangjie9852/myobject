<template>
	<div id="recomItem">
		<HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
		<div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-content">
                            <form action="" class="form-inline m-b-sm clearfix" role="form">
                                <!--<div class="form-group">
                                  <input name="title" v-model="filter.title" type="text" class="form-control m-r-xs" placeholder="推荐栏目名称" @keyup.enter="getList(pageData.PageID)">
                                </div>-->
                                <!--<div class="form-group m-r-xs">
			                        <select class="form-control" name="status" v-model="remStatus">
			                          <option :value="null">全部状态</option>
			                          <option value="1">启用</option>
			                          <option value="-1">隐藏</option>			                          
			                        </select>
			                    </div>
			                    <div class="form-group m-r-xs">
			                        <select class="form-control" name="channel" v-model="remChannel">
			                          <option :value="null">全部频道</option>
			                          <option value="1">首页</option>
			                          <option value="2">列表</option>
			                          <option value="3">详情</option>		                          
			                        </select>
			                    </div>
                                <button type="button" class="btn btn-m btn-primary" @click="getList(pageData.PageID)">查询</button>                                
                                
                                <router-link :to="'/recom/wap/itemadd/'+$route.params.id" class="btn btn-m btn-danger hj_fr">添加</router-link>-->
                                <el-select class="m-r-sm m-b-sm" name="status" v-model="remStatus">
				                  <el-option :key="null" label="全部状态" :value="null"></el-option>
				                  <el-option :key="1" label="启用" value="1"></el-option>
				                  <el-option :key="-1" label="隐藏" value="-1"></el-option>
				                </el-select>
				                <el-select class="m-r-sm m-b-sm" name="channel" v-model="remChannel">
				                  <el-option :key="null" label="全部频道" :value="null"></el-option>
				                  <el-option :key="1" label="首页" value="1"></el-option>
				                  <el-option :key="2" label="列表" value="2"></el-option>
				                  <el-option :key="3" label="详情" value="3"></el-option>
				                </el-select>
				                <el-button class="search-btn" type="primary" icon="search" @click="getList(pageData.PageID)">筛选</el-button>
                				<router-link :to="'/recom/wap/itemadd/'+$route.params.id" class="add-btn"><i class="shop icon-xinzeng"></i> 添加推荐</router-link>
                            </form>                                
                            <div class="table-responsive clearfix">
                                <table class="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>名称</th>
                                            <th>总条数</th>
                                            <th>投放频道</th>
                                            <th>状态</th>
                                            <th class="opt-select">操作</th>
                                        </tr>
                                    </thead>                                    
                                    <tbody>                                    	
                                        <tr v-for="(item,index) in clist">                                            
                                            <td>{{item.recmd_item_label}}</td>
                                            <td>{{item.recmd_item_max}}</td>
                                            <td>{{item.recmd_item_channel}}</td>
                                            <td>{{item.status_recmd_item}}</td>
                                            <td class="icon-opt">
                                            	<router-link :to="'/recom/wap/itemedit/'+$route.params.id+'/'+item.recmd_item_id" title="编辑">编辑</router-link>
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
	</div>
</template>
<script>	
	import HjCrumb from '../../comms/BreadCrumb.vue'
	import {CustomFun,pageSizes} from '../../comms/main.js'
	export default{
		components:{	      
	      HjCrumb
	    },
		data(){
			return {
				pageError:false,				
				checkAllFlag:false,
        		selectedList:[],        						
				PSLists:pageSizes,
				title:'',
        		remChannel:null,
        		remStatus:null,															
				CrumbBox:{
	    			CrumbList:
		    		[
			    		{
				    		title:'推荐管理',
				    		url:'/recom/wap/list'
			    		},			    		
			    		{
				    		title:'推荐栏目列表',
				    		url:''
			    		},			    		
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
			this.getList(1);	//列表数据								
		},
		// updated(){
  //           if(this.pageError){
  //               this.getList(1);
  //           }           
  //       },	
		methods:{
			handleSizeChange(val) {
		        this.pageData.Perpage = val;
		        this.getList(1);
		    },
		    handleCurrentChange(val) {
		       this.getList(val);
		    },
			getList(page) {
				$(window).scrollTop(0);				
				var that = this;											     		    		
	      		that.$http({
						  method:'post',
						  url: '/recmd_item/listdata',
						  params:{
							'Perpage':that.pageData.Perpage,
							'PageID':page,
							'keyword':that.title,							
							'recmd_block_id':this.$route.params.id,
							'recmd_item_channel':that.remChannel,
							'status_recmd_item':that.remStatus
						  }			  
						}).then(function (res) {
							//console.log(res);
							if(res.data.error==0){
								that.clist   = res.data.data.table_data;			
								that.pageData.PageID  = res.data.data.PageID;
								that.pageData.Perpage = res.data.data.Perpage;
								that.pageData.Results = res.data.data.Results;
								that.pageData.Pages   = res.data.data.Pages;							
								that.title = '';								
							}else{								 
								 console.log(res.data.desc);
								 that.pageError = true;
							}
						}).catch(function (error) {
							console.log(error);
						});
			}
		}
	}
</script>