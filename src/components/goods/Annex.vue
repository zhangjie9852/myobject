<template>
	<div id="Annex">
		<HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
		<div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-content">
                            <form action="" class="form-inline m-b-sm clearfix" role="form">
                            	<el-button type="warning" class="m-r-sm" @click="delAll">批量删除</el-button>
                            	<el-input class="m-r-sm m-b-sm" name="title" v-model="title" placeholder="图册名称" @keyup.enter="getList(pageData.PageID)"></el-input>
			                    <!--<button type="button" class="btn btn-m btn-primary" @click="getList(pageData.PageID)"><i class="shop icon-chaxun"></i>筛选</button>-->
			                    <el-button class="search-btn" type="primary" icon="search" @click="getList(pageData.PageID)">筛选</el-button>
                            	<!--<button type="button" class="btn btn-m btn-warning m-r-sm" @click="delAll">批量删除</button>
                                <div class="form-group">
                                  <input name="title" v-model="title" type="text" class="form-control m-r-sm" placeholder="图册名称" @keyup.enter="getList(pageData.PageID)">
                                </div>
                                <button type="button" class="btn btn-m btn-primary" @click="getList(pageData.PageID)">查询</button>-->                           
                                <router-link to="/goods/images/add" class="add-btn"><i class="shop icon-xinzeng"></i>添加图册</router-link>
                            </form>                                
                            <div class="table-responsive clearfix">
                                <table class="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th class="table-checkbox">
                                            	<div class="checkbox-square-green" :class="{'checked':checkAllFlag}" @click="checkedAll(clist)">
                                                <input type="checkbox" class="checks"></div>	
                                            </th>
                                            <th width="20%">图册名称</th>
                                            <th width="10%">图片数量</th>
                                            <th width="20%">相册封面</th>       
                                            <th>描述</th>                                            
                                            <th class="opt-select">操作</th>
                                        </tr>
                                    </thead>                                    
                                    <tbody>                                    	
                                        <tr v-for="(item,index) in clist">
                                            <td>
                                            	<div class="checkbox-square-green" :class="{'checked':item.isChecked}" @click="chkSelectAndAll(clist,item)">
                                                <input type="checkbox" class="checks"></div>  
                                            </td>
                                            <td>{{item.gallery_name}}</td>
                                            <td>{{item.img_count}}</td>                              
                                            <td>
                                            	<img :src="item.cover_img_url" class="listImg">
                                            </td>
                                            <td><span class="listDesc">{{item.gallery_desc}}</span></td>
                                            <td class="opt">
                                            	<span class="opt-down shop icon-shezhicaozuo" @click.stop="opToggle(clist,item.gallery_id,'gallery_id')"></span>
                                                <ul v-show="item.isOptShow">
                                                	<!-- <li><router-link :to="'/goods/images/details/'+item.gallery_id">查看</router-link></li> -->                 	
                                                    <li><router-link :to="'/goods/images/edit/'+item.gallery_id">编辑</router-link></li>
                                                    <li><a @click="delOne(item.gallery_id)">删除</a></li>
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
				pageError:false,
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
				    		url:'/goods/images'
			    		},
			    		{
				    		title:'商品配置',
				    		url:'/goods/images'
			    		},
			    		{
				    		title:'图片库管理',
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
			this.getList(1);	//列表数据
			this.$nextTick(function () {
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
		// updated(){
  //           if(this.pageError){
  //               this.getList(1);
  //           }           
  //       },		
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
		            url: '/goods_gallery/batchsubmit',
		            params:{
		            	'gallery_id':id						
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
		            selectedId.push(item.gallery_id);
		          })
		          if(selectedId.length>0){
		            this.$confirm('确认操作此信息吗？', '提示', {
		              confirmButtonText: '确认',
		              cancelButtonText: '取消',
		              type: 'warning'
		            }).then(() => {
		              that.$http({
		                method:'post',
		                url: '/goods_gallery/batchsubmit',
		                params:{
		                  'gallery_id':selectedId.join(','),		                  
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
				//$(window).scrollTop(0);				
				var that = this;
				that.checkAllFlag=false;
				that.selectedList=[];							     		    		
	      		that.$http({
						  method:'post',
						  url: '/goods_gallery/listdata',
						  params:{					
							'keyword':that.title,
							'Perpage':that.pageData.Perpage,
							'PageID':page
						  }			  
						}).then(function (res) {							
							if(res.data.error==0){
								that.clist   = res.data.data.table_data;			
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
								that.pageError = true;
							}
						}).catch(function (error) {
							console.log(error);
						});
			}
		}
	}
</script>