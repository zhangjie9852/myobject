<template>
	<div id="BrandDet">
		<HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
		<div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title">
                            <h5>品牌详情</h5>
                        </div>                        
                        <div class="ibox-content add-user">
                            <div class="form-horizontal m-t" id="commentForm" >
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">商品分类：</label>
                                    <div class="col-sm-4 m-t-8">
                                        {{lists.category_name}}
                                    </div>
                                </div>                        
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">品牌名称：</label>
                                    <div class="col-sm-4 m-t-8">
                                        {{lists.brand_ch_name}}
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">品牌官网：</label>
                                    <div class="col-sm-4 m-t-8">
                                        {{lists.brand_website}}
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">品牌英文名称：</label>
                                    <div class="col-sm-4 m-t-8">
                                        {{lists.brand_en_name}}
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">品牌LOGO：</label>                                    
                                    <div class="col-sm-2">
                                        <ul class="imgList clearfix">
                                            <li>
                                                <div class="img-box">
                                                    <img :src="Imgpath+lists.brand_pc_logo">
                                                </div>
                                            </li>                                            
                                        </ul>                                        
                                        <span class="picTips">PC端</span>
                                    </div>
                                    <div class="col-sm-2">
                                        <ul class="imgList clearfix">
                                            <li>
                                                <div class="img-box">
                                                    <img :src="Imgpath+lists.brand_logo">
                                                </div>
                                            </li>                                            
                                        </ul>
                                        <span class="picTips">手机端</span>
                                    </div>
                                </div>                                
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">品牌描述：</label>
                                    <div class="col-sm-4 m-t-8">
                                        {{lists.description}}
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">排序：</label>
                                    <div class="col-sm-4 m-t-8">
                                        {{lists.brand_sort}}
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">SEO标题：</label>
                                    <div class="col-sm-4 m-t-8">
                                        {{lists.seo_title}}
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">SEO关键词：</label>
                                    <div class="col-sm-4 m-t-8">
                                        {{lists.seo_keywords}}
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">SEO描述：</label>
                                    <div class="col-sm-4 m-t-8">
                                        {{lists.seo_description}}
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">品牌标签：</label>
                                    <div class="col-sm-4 m-t-8">
                                        {{lists.brand_tag}}
                                    </div>
                                </div>                             
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">是否显示：</label>
                                    <div class="col-sm-6 m-t-8">                                        
                                        <span v-if="lists.is_show">是</span>
                                        <span v-else>否</span>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">是否热门：</label>
                                    <div class="col-sm-6 m-t-8">
                                        <span v-if="lists.is_topic">是</span>
                                        <span v-else>否</span>                                        
                                    </div>
                                </div>                                
                                <div class="hr-line-dashed"></div>
                                <div class="form-group draggable ui-draggable">
                                    <div class="col-sm-12 col-sm-offset-3">
                                        <router-link to="/goods/Brand" class="btn btn-primary">返回列表</router-link>
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
                            url:'/goods/Brand'
                        },
                        {
                            title:'商品配置',
                            url:'/goods/Brand'
                        },
                        {
                            title:'品牌管理',
                            url:''
                        }
		    		]
		    	},
                Imgpath:Imgpath,
                sevUrl:sevUrl,
                lists:{
                    brand_website:"",
                    brand_ch_name:"",
                    brand_en_name:"",
                    brand_id:0,
                    brand_logo:"",
                    brand_pc_logo:"",
                    brand_sort:0,
                    category_id:null, 
                    category_name:"",
                    is_show:true,
                    is_topic:false,                    
                    seo_title:"",
                    seo_keywords:"",
                    seo_description:"",
                    brand_tag : ""                              
                }
	    	}
	    },                     
        mounted(){ 
            this.BrandEditList(1)         
        },
        methods:{            
            BrandEditList(cid){
                var that = this;
                that.$http({
                          method:'post',
                          url: '/goods_brand/infodata',
                          params:{ 
                            'brand_id':cid                       
                          }           
                        }).then(function (res) {                            
                            var  categoryList =  res.data.data;
                            //console.log(categoryList)
                            if(res.data.error==0){
                                that.lists.category_id = categoryList.category_id;
                                that.lists.category_name = categoryList.category_name;
                                that.lists.brand_ch_name = categoryList.brand_ch_name;
                                that.lists.brand_en_name = categoryList.brand_en_name;
                                that.lists.brand_pc_logo = categoryList.brand_pc_logo;
                                that.lists.brand_logo = categoryList.brand_logo;
                                that.lists.brand_sort = categoryList.brand_sort;
                                that.lists.is_show = categoryList.is_show;
                                that.lists.description = categoryList.description;
                                that.lists.is_topic = categoryList.is_topic; 
                                that.lists.seo_title = categoryList.seo_title;
                                that.lists.seo_keywords = categoryList.seo_keywords;
                                that.lists.seo_description = categoryList.seo_description;
                                that.lists.brand_tag = categoryList.brand_tag;
                                that.lists.brand_website = categoryList.brand_website;                                
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
