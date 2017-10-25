<template>
	<div id="recomList">
		<HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
		<div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-content">
                            <div class="table-responsive clearfix">
                                <table class="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>推荐位名称</th>
                                            <th>推荐位类型</th>
                                            <th class="opt-select">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item,index) in clist">
                                            <td>{{item.recmd_block_name}}</td>
                                            <td>{{item.recmd_block_type}}</td>
                                            <td class="opt">
                                            	<router-link class="single-opt" :to="'/recom/wap/item/'+item.recmd_block_id">管理</router-link>
                                           </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div v-show="clist.length==0" class="text-center">暂无信息</div>
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
			return {
				CrumbBox:{
	    			CrumbList:
		    		[
			    		{
				    		title:'推荐管理',
				    		url:'/goods/brand'
			    		},
			    		{
				    		title:'推荐列表',
				    		url:''
			    		}
		    		]
		    	},
		    	pageError:false,
		    	clist:[]
			}
		},
		mounted(){
			this.getList();	//列表数据
		},
		// updated(){
  //           if(this.pageError){
  //               this.getList();
  //           }
  //       },
		methods:{
			getList() {
				var that = this;
	      		that.$http({
						  method:'post',
						  url: '/recmd_block/listdata',
						  params:{
							'recmd_block_platform':2
						  }
						}).then(function (res) {
							//console.log(res);
							if(res.data.error==0){
								that.clist   = res.data.data.table_data;
							}else{
								 console.log(res.data.desc);
								 that.pageError =true
							}
						}).catch(function (error) {
							console.log(error);
						});
			}
		}
	}
</script>
<style scoped>
 .ibox-content{padding:0;}
</style>
