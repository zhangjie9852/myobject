<template>
	<div id="PicList">
		<div class="clearfix">
			<label class="hj_fl control-label">图库分类：</label>
			<div class="col-sm-4">
				<select class="form-control" name="gallery_id" v-model="gallery_id" @change="changeSel">
		            <option v-if="gallery_id==0">图库分类</option>
		            <option v-for="(item,index) in cateList" :value="item.gallery_id">{{item.gallery_name}}</option>
		        </select>
	        </div>
	    </div>
	    <ul class="gallery m-t-sm clearfix">
			<li v-for="(item,index) in clist" :class="imgCurrent===item.gallery_img_id?'current':''" @click="changePic(item.gallery_img_id,item.img_url)"><img :src="item.img_url" class="gallery-img-size"></li>
		</ul>
	    <div v-show="clist.length==0" class="text-center">暂无信息</div>
	    <div class="hj_fr">
	    	<el-pagination
		      @current-change="handleCurrentChange"
		      :current-page="pageData.PageID"		      
		      :page-size="pageData.Perpage"
		      v-show="pageData.Results>pageData.Perpage"
		      layout="total, prev, pager, next, jumper"
		      :total="pageData.Results">
		    </el-pagination>
	    </div>
	</div>             
</template>
<script>
	import {CustomFun} from './main.js'
	import {mapGetters,mapActions} from 'vuex'
	export default{		
		data(){
			return {
		    	clist:[],
		    	cateList:[],	
				pageData:{					
                    PageID:1,
					Perpage:10,
					Results:1,
					Pages:1									
                },
                gallery_id:0,
                imgCurrent:0,
                imgUrl:''
			}
		},
		computed: {     
	        ...mapGetters([	          
	          'galleryUrl'      
	        ]),
	        galleryPicUrl(){
	        	this.galleryPicUrl = this.galleryUrl;
	        }   
	    },					       
		mounted(){												
			this.getList(1);	//列表数据
			this.galleryCate();
			this.imgCurrent=0;
		},		
		methods:{
		    handleCurrentChange(val) {
		       this.getList(val);
		    },
		    changePic(id,url){
		    	this.imgCurrent=id;
		    	this.imgUrl=url;
		    	this.$store.commit('GALLERY_PIC_URL', url); 
		    },
		    changeSel(){		    	
		    	this.getList(1)
		    },
		    galleryCate() {							
				var that = this;											     		    		
	      		that.$http({
						  method:'post',
						  url: '/goods_gallery/listdata'						  		  
						}).then(function (res) {													
							if(res.data.error==0){
								that.cateList   = res.data.data.table_data;								
								that.gallery_id = that.cateList[0].gallery_id;//默认显示第一个图库
								that.getList(1)
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
			getList(page) {							
				var that = this;											     		    		
	      		that.$http({
						  method:'post',
						  url: '/goods_gallery/imglistdata',
						  params:{
							'Perpage':that.pageData.Perpage,
							'PageID':page,
							'gallery_id':that.gallery_id
						  }			  
						}).then(function (res) {							
							if(res.data.error==0){
								that.clist   = res.data.data.table_data;											
								that.pageData.PageID  = res.data.data.PageID;
								that.pageData.Perpage = res.data.data.Perpage;
								that.pageData.Results = res.data.data.Results;
								that.pageData.Pages   = res.data.data.Pages;
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