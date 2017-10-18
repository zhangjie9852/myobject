<template>
	<div id="AnnexDet">
		<HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
		<div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title">
                            <h5>图册详情</h5>
                        </div>                        
                        <div class="ibox-content add-user">
                            <div class="form-horizontal m-t" id="commentForm" >
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">图册名称：</label>
                                    <div class="col-sm-4 m-t-8">
                                        {{fields.photo_collection_name}}
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">图片：</label>                                    
                                    <div class="col-sm-9">
                                        <ul class="imgList clearfix">
                                            <li v-for="(item,index) in fields.fileList">
                                                <div class="img-box">
                                                    <img :src="item.img_url">
                                                </div>
                                            </li>                                            
                                        </ul>
                                    </div>
                                </div>                                
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">图册描述：</label>
                                    <div class="col-sm-4 m-t-8">
                                        {{fields.photo_desc}}
                                    </div>
                                </div>                                                                
                                <div class="hr-line-dashed"></div>
                                <div class="form-group draggable ui-draggable">
                                    <div class="col-sm-12 col-sm-offset-3">
                                        <router-link to="/goods/images" class="btn btn-primary">返回列表</router-link>
                                    </div>  
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
    import {Imgpath,sevUrl} from '../comms/main.js'
	export default{
		components:{
	      HjCrumb
	    },
	    data(){
	    	return{
	    		CrumbBox:{
	    			CrumbList:
		    		[
			    		{
                            title:'商品中心',
                            url:'/goods/category'
                        },
                        {
                            title:'商品配置',
                            url:'/goods/Brand'
                        },
                        {
                            title:'图册管理',
                            url:''
                        }
		    		]
		    	},
                Imgpath:Imgpath,
                sevUrl:sevUrl,
                fields:{
                    photo_collection_name:"",
                    fileList:[],
                    photo_desc:""            
                }
	    	}
	    },                     
        mounted(){ 
            this.ImgEditList(this.$route.params.id)         
        },
        methods:{            
            ImgEditList(cid){
                var that = this;
                that.$http({
                          method:'post',
                          url: '/goods_gallery/infodata',
                          params:{ 
                            'gallery_id':cid                       
                          }           
                        }).then(function (res) {
                            console.log(res)
                            var  fieldList =  res.data.data;
                            if(res.data.error==0){
                                that.fields.photo_collection_name = fieldList.gallery_name;
                                that.fields.photo_desc = fieldList.gallery_desc;
                                that.fields.fileList = fieldList.imglist; 
                            }else{
                                console.log(res.data.desc)                           
                            }                                                        
                        }).catch(function (error) {
                            console.log(error);
                        });
            },                        
        }
	}
</script>
