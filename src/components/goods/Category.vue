<template>
	<div id="category">
		<HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
		<div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title">
                            <h5>一级分类</h5>
                        </div>
                        <div class="ibox-content">
                            <div class="form-inline m-b-md clearfix">
                                <button type="button" class="btn btn-m btn-primary" @click="allOpen" v-if="!tree">全部展开</button>                                
                                <button type="button" class="btn btn-m btn-primary" @click="allPack" v-if="tree">全部收齐</button>                                
                                <button class="btn btn-m btn-danger hj_fr" @click="add">添加一级分类</button>
                            </div>                                
                            <div class="table-responsive">  
                                    <ul class="clearfix listhead">                                        
                                        <li>排序</li>
                                        <li class="listTitle">分类名称</li>
                                        <li>是否显示</li>
                                        <li class="listOpt">操作</li>
                                    </ul>                                                                       
                                    <TreeList v-for="(val, index) in items" :item="val" @subm="getList()" @remove="delItem(index,val.category_id)" :key="index"></TreeList>
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
  import TreeList from './TreeList.vue'
	import {CustomFun} from '../comms/main.js'
  import {mapGetters,mapActions} from 'vuex'
	export default{
		components:{	      
	      HjCrumb,
        TreeList
	    },
		data(){
			return {        
				title:'',        
				CrumbBox:{
	    			CrumbList:
		    		[
			    		{
				    		title:'商品中心',
				    		url:'/goods/category'
			    		},
			    		{
				    		title:'商品配置',
				    		url:'/goods/category'
			    		},
			    		{
				    		title:'分类管理',
				    		url:''
			    		}
		    		]
		    	},
          category_code:null,         
          mydata: {},
          items:[]
			}
		},
    computed: {     
        ...mapGetters([
          'tree',
          'cate_parent_id'   
        ])        
    },    						       
		mounted(){	
        this.getList();
		},    
		methods:{
      allPack(){
        this.$store.dispatch('hideTree');        
      },
      allOpen(){
        this.$store.dispatch('showTree');        
      },     
      getList() {
        var that = this;                            
            that.$http({
              method:'post',
              url: '/goods_category/listdata'                    
            }).then(function (res) {              
              if(res.data.error==0){
              //console.log(res.data.data.table_data)            
                that.items   = res.data.data.table_data; 
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
			add:function(){
        this.mydata['sort'] = 0;
        this.mydata['is_show'] = true;
        this.mydata['parent_id'] = 0;
        this.mydata['level'] = 1;
        this.mydata['category_name'] = '';
        this.mydata['opens'] = true;
        this.items.unshift(this.mydata);
        this.mydata = {};
        //this.$store.commit('CATE_PARENT_ID', 0)
      },      
      delItem:function(index,id){         
          var that=this;
            if(id>0){
              this.$confirm('确认删除此分类吗？', '提示', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                that.$http({
                  method:'post',
                  url: '/goods_category/batchsubmit',
                  params:{
                    'cate_id':id,
                    'method':-2            
                  }
                }).then(function (res) {                
                  if(res.data.error==0){
                    that.items.splice(index, 1);               
                    that.$message({
                      type: 'success',
                      message: '删除成功!'
                    });
                    that.getList();
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
                  message: '已取消删除'
                });
              });           
            }else{
              that.items.splice(index, 1);
            } 
      }             
		}
	}
</script>