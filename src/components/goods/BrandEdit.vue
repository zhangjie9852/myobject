<template>
	<div id="BrandEdit">
		<HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
		<div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">                       
                        <div class="ibox-content p-m">
                            <el-tabs v-model="activeName" type="card" @tab-click="changeTab">
                                <el-tab-pane label="基本信息" name="first">
                                    <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t" id="commentForm" >
                                        <div class="form-group">
                                            <label class="col-sm-3 control-label"><span class="f-c-r">*</span>商品分类：</label>
                                            <div class="col-sm-4">
                                            <!--<select class="form-control" name="category_id" v-model="fields.category_id" v-if="cateList!=''">
                                                    <option v-for="(item,index) in cateList" :value="item.category_id">{{item.category_name}}</option>
                                                </select>-->
                                                <el-select name="category_id" v-model="fields.category_id" required :class="fieldClassName(formstate.category_id)">
                                                  <el-option :key="null" label="商品分类" :value="null"></el-option>
                                                  <template v-for="item in cateList">
                                                    <el-option :key="item.category_id" :label="item.category_name" :value="item.category_id"></el-option>
                                                  </template>
                                                </el-select>
                                            </div>
                                        </div>                        
                                        <validate class="form-group">
                                            <label class="col-sm-3 control-label"><span class="f-c-r">*</span>品牌名称：</label>
                                            <div class="col-sm-4">                                        
                                                <input type="text" name="brand_ch_name" class="form-control" v-model="fields.brand_ch_name" required :class="fieldClassName(formstate.brand_ch_name)">
                                                <field-messages name="brand_ch_name" show="$touched ||$submitted" class="form-control-callback">
                                                    <div class="valid">Success!</div>
                                                    <div slot="required" class="error">分类名称不能为空.</div>
                                                </field-messages>
                                            </div>
                                        </validate>
                                        <validate class="form-group">
                                            <label class="col-sm-3 control-label"><span class="f-c-r">*</span>品牌官网：</label>
                                            <div class="col-sm-4">                                        
                                                <input type="text" name="brand_website" class="form-control" v-model="fields.brand_website" required :class="fieldClassName(formstate.brand_website)">
                                                <field-messages name="brand_website" show="$touched ||$submitted" class="form-control-callback">
                                                    <div class="valid">Success!</div>
                                                    <div slot="required" class="error">品牌官网不能为空.</div>
                                                </field-messages>
                                            </div>
                                        </validate>
                                        <field class="form-group">
                                            <label class="col-sm-3 control-label">品牌英文名称：</label>
                                            <div class="col-sm-4">
                                                <input type="text" name="brand_en_name" class="form-control" v-model="fields.brand_en_name">
                                            </div>
                                        </field>
                                        <div class="form-group">
                                            <label class="col-sm-3 control-label"><span class="f-c-r">*</span>品牌LOGO：</label>                                    
                                            <validate class="col-sm-2">
                                                <input type="hidden" name="brand_pc_logo" v-model="fields.brand_pc_logo" required :class="fieldClassName(formstate.brand_pc_logo)">
                                                <el-upload
                                                  class="avatar-uploader"
                                                  :action="sevUrl+'/admin/upload'"  
                                                  :data="usermsg"                                 
                                                  :show-file-list="false"
                                                  :on-success="handleAvatarSuccess"
                                                  :before-upload="beforeAvatarUpload">
                                                  <img v-if="fields.brand_pc_logo" :src="fields.brand_pc_logo" class="avatar">
                                                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                                </el-upload>
                                                <span class="picTips">PC端</span>
                                                <field-messages name="brand_pc_logo" show="$touched ||$submitted" class="form-control-callback">
                                                    <div class="valid">Success!</div>
                                                    <div slot="required" class="error">图片不能为空.</div>
                                                </field-messages>
                                            </validate>
                                            <validate class="col-sm-2">
                                                <input type="hidden" name="brand_logo" v-model="fields.brand_logo" required :class="fieldClassName(formstate.brand_logo)">
                                                <el-upload
                                                  class="avatar-uploader"
                                                  :action="sevUrl+'/admin/upload'" 
                                                  :show-file-list="false"
                                                  :data="usermsg"                                          
                                                  :on-success="handleAvatarSuccess2"
                                                  :before-upload="beforeAvatarUpload">
                                                  <img v-if="fields.brand_logo" :src="fields.brand_logo" class="avatar">
                                                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                                </el-upload>
                                                <span class="picTips">手机端</span>
                                                <field-messages name="brand_logo" show="$touched ||$submitted" class="form-control-callback">
                                                    <div class="valid">Success!</div>
                                                    <div slot="required" class="error">图片不能为空.</div>
                                                </field-messages>
                                            </validate>
                                            <span class="f-c-r form-tips">（注：电脑端与手机端图片单独上传）</span>
                                        </div>                                
                                        <field class="form-group">
                                            <label class="col-sm-3 control-label">品牌描述：</label>
                                            <div class="col-sm-4">
                                                <textarea type="text" rows="5" name="description" v-model="fields.description" class="form-control">{{fields.description}}</textarea>
                                            </div>
                                        </field>
                                        <field class="form-group">
                                            <label class="col-sm-3 control-label">排序：</label>
                                            <div class="col-sm-4">
                                                <input type="number" onmousewheel="return false;" name="brand_sort" class="form-control" v-model="fields.brand_sort">
                                            </div>
                                            <span class="f-c-r form-tips">用于排序品牌显示先后顺序，数字越小越靠后显示</span>
                                        </field>                                        
                                        <!-- <field class="form-group">
                                            <label class="col-sm-3 control-label">品牌标签：</label>
                                            <div class="col-sm-4">
                                                <input type="text" name="brand_tag" class="form-control" v-model="fields.brand_tag">
                                            </div>                                    
                                        </field> -->                               
                                        <field class="form-group">
                                            <label class="col-sm-3 control-label">是否显示：</label>
                                            <div class="col-sm-6">
                                                <div class="r-state">
                                                    <el-radio class="radio" v-model="fields.is_show" :label="true">是</el-radio>
                                                    <el-radio class="radio" v-model="fields.is_show" :label="false">否</el-radio>                                                    
                                                </div>                                                
                                            </div>
                                        </field>
                                        <field class="form-group">
                                            <label class="col-sm-3 control-label">是否推荐：</label>
                                            <div class="col-sm-6">
                                                <div class="r-state">                                                  
                                                    <el-radio class="radio" v-model="fields.is_topic" :label="true">是</el-radio>
                                                    <el-radio class="radio" v-model="fields.is_topic" :label="false">否</el-radio>
                                                </div>                                                
                                            </div>
                                        </field>
                                        
                                      <div class="hr-line-dashed"></div>
                                        <div class="form-group draggable ui-draggable">
                                            <div class="col-sm-12 col-sm-offset-3">
                                                <!--<button class="btn btn-primary" type="submit">提交</button>
                                                <router-link to="/goods/Brand" class="btn btn-white m-l-sm">返回列表</router-link>-->
                                                <el-button type="primary" native-type="submit">提交</el-button>
                                                <router-link to="/goods/brand" class="white-btn m-l-sm">返回列表</router-link>
                                            </div>  
                                        </div>
                                    </vue-form>
                                </el-tab-pane>
                                <el-tab-pane label="SEO信息" name="second">
                                    <vue-form :state="formstate2" @submit.prevent="onSubmit2" class="form-horizontal m-t" id="commentForm" >                                        
                                        <field class="form-group">
                                            <label class="col-sm-3 control-label">SEO标题：</label>
                                            <div class="col-sm-4">
                                                <input type="text" name="seo_title" class="form-control" v-model="seoData.seo_title">
                                            </div>                                    
                                        </field>
                                        <field class="form-group">
                                            <label class="col-sm-3 control-label">SEO关键词：</label>
                                            <div class="col-sm-4">
                                                <input type="text" name="seo_keywords" class="form-control" v-model="seoData.seo_keywords">
                                            </div>                                   
                                        </field>
                                        <field class="form-group">
                                            <label class="col-sm-3 control-label">SEO描述：</label>
                                            <div class="col-sm-4">
                                                <textarea type="text" rows="5" name="seo_description" v-model="seoData.seo_description" class="form-control">{{seoData.seo_description}}</textarea>
                                            </div>
                                        </field>
                                      <div class="hr-line-dashed"></div>
                                        <div class="form-group draggable ui-draggable">
                                            <div class="col-sm-12 col-sm-offset-3">
                                                <!--<button class="btn btn-primary" type="submit">提交</button>
                                                <router-link to="/goods/Brand" class="btn btn-white m-l-sm">返回列表</router-link>-->
                                                <el-button type="primary" native-type="submit">提交</el-button>
                                                <router-link to="/goods/brand" class="white-btn m-l-sm">返回列表</router-link>
                                            </div>  
                                        </div>
                                    </vue-form>
                                </el-tab-pane>
                            </el-tabs>                            
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
    import UnderScore from 'underscore'
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
                Imgpath:Imgpath,
                sevUrl:sevUrl,
                activeName: 'first',
                curActiveName:'first',               
                formstate:{},
                formstate2:{},
                cateList:[],
                usermsg:{
                    'token_admin':JSON.parse(window.localStorage.getItem('access_token')),
                    'admin_id':JSON.parse(window.localStorage.getItem('userid'))
                },                          
                fields:{
                    brand_website:"",
                    brand_ch_name:"",
                    brand_en_name:"",
                    brand_id:0,
                    brand_logo:"",
                    brand_pc_logo:"",
                    brand_sort:0,
                    category_id:0,
                    category_name:"",
                    is_show:true,
                    is_topic:false,                    
                    brand_tag:''                              
                },
                fields2:{},
                seoData:{                    
                    seo_title:'',
                    seo_keywords:'',
                    seo_description:''                         
                },
                seoData2:{}
	    	}
	    },                     
        mounted(){          
            this.CatePrent();    //上级分类数据
            this.BrandEditList(this.$route.params.id)         
        },        
        methods:{
            objectAssign (obj,oldObj) {
                for (var key in oldObj){
                  obj[key]=oldObj[key];
                }
            },            
            BrandEditList(cid){
                var that = this;
                that.$http({
                          method:'post',
                          url: '/goods_brand/infodata',
                          params:{
                            'brand_id':cid                       
                          }           
                        }).then(function (res) {
                            //console.log(res) 
                            var  categoryList =  res.data.data;                            
                            if(res.data.error==0){
                                //console.log(categoryList)
                                that.fields.brand_id = cid;
                                that.fields.category_id = parseInt(categoryList.category_id);
                                that.fields.brand_ch_name = categoryList.brand_ch_name;
                                that.fields.brand_en_name = categoryList.brand_en_name;
                                that.fields.brand_pc_logo = categoryList.brand_pc_logo;
                                that.fields.brand_logo = categoryList.brand_logo;
                                that.fields.brand_sort = categoryList.brand_sort;
                                that.fields.is_show = categoryList.is_show;
                                that.fields.description = categoryList.description;
                                that.fields.is_topic = categoryList.is_topic;                                
                                that.fields.brand_tag = categoryList.brand_tag;
                                that.fields.brand_website = categoryList.brand_website; 

                                that.seoData.seo_title = categoryList.seo_title;
                                that.seoData.seo_keywords = categoryList.seo_keywords;
                                that.seoData.seo_description = categoryList.seo_description;
                                //console.log(that.fields.category_id)                               
                            }else{
                                //console.log(res.data.desc)
                                that.$message({
                                  message: 'infodata'+res.data.desc,
                                  type: 'warning'
                                });                                                         
                            }                            
                            that.objectAssign(that.fields2,that.fields);
                            that.objectAssign(that.seoData2,that.seoData);
                            //console.log(that.seoData2)                                                        
                        }).catch(function (error) {
                            console.log(error);
                        });
            },            
            changeTab (target) {
                var that=this;
                setTimeout(function(){
                  that.activeName=that.curActiveName;
                },20);                               
                if(!UnderScore.isEqual(that.fields, that.fields2)){                    
                  this.$confirm('基本信息已修改，为了数据不丢失，请您先保存再离开！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    // that.onSubmit();
                    // that.objectAssign(that.fields2,that.fields);
                    // that.activeName=target.name;
                    // that.curActiveName=target.name;
                    //console.log('保存')
                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消操作'
                    });
                    that.objectAssign(that.fields,that.fields2);
                    that.activeName=target.name;
                    that.curActiveName=target.name;
                  });
                }else if(!UnderScore.isEqual(that.seoData, that.seoData2)){
                  this.$confirm('SEO信息已修改，为了数据不丢失，请您先保存再离开！', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                    // that.onSubmit2();
                    // that.objectAssign(that.seoData2,that.seoData);
                    // that.activeName=target.name;
                    // that.curActiveName=target.name;                   
                  }).catch(() => {
                    this.$message({
                      type: 'info',
                      message: '已取消操作'
                    });
                    that.objectAssign(that.seoData,that.seoData2);
                    that.activeName=target.name;
                    that.curActiveName=target.name;
                  });
                }else{
                  that.activeName=target.name;
                  that.curActiveName=target.name;
                }
            },             
            CatePrent() {
                var that = this;                                         
                that.$http({
                      method:'post',
                      url: '/goods_category/listdata',
                      params:{
                        'level':1
                      }           
                    }).then(function (res) {                                                                    
                        if(res.data.error==0){
                           that.cateList = res.data.data.table_data;    
                        }else{
                           console.log(res.data.desc) 
                            that.pageError = true;
                        }   
                        //console.log(that.cateList)                                  
                    }).catch(function (error) {
                        console.log(error);
                    });
            },            
            fieldClassName:function(field){
                if(!field){
                    return '';
                }else if((field.$touched ||field.$submitted) && field.$invalid){
                    return 'error';
                }else if((field.$touched ||field.$submitted) && field.$valid){
                    return 'valid';
                }
            },
            handleAvatarSuccess(res, file) {                
                var PcPath = res.data.file_path;                
                this.fields.brand_pc_logo = Imgpath+PcPath;
            },
            handleAvatarSuccess2(res, file) {
                var WapPath = res.data.file_path;
                this.fields.brand_logo =Imgpath+WapPath;
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isGIF = file.type === 'image/gif';
                const isLt2M = file.size / 1024 / 1024 < 2;

                if (!isJPG&&!isPNG&&!isGIF) {
                  this.$message.error('上传图片只能是 JPG、PNG、GIF 格式!');
                }
                if (!isLt2M) {
                  this.$message.error('上传图片大小不能超过 2MB!');
                }                
                return (isJPG||isPNG||isGIF) && isLt2M;
            },
            onSubmit:function(){
                var that = this;
                if(this.formstate.$valid){                                                             
                    that.$http({
                          method:'post',
                          url: '/goods_brand/editsubmit',
                          params:{
                            'brand_id':that.fields.brand_id,
                            'category_id':that.fields.category_id,
                            'brand_ch_name':that.fields.brand_ch_name,
                            'brand_en_name':that.fields.brand_en_name, 
                            'brand_pc_logo':that.fields.brand_pc_logo,
                            'brand_logo':that.fields.brand_logo,
                            'description':that.fields.description,
                            'brand_sort':that.fields.brand_sort,
                            'is_show':that.fields.is_show,
                            'is_topic':that.fields.is_topic,                            
                            //'brand_tag':that.fields.brand_tag                           
                          }           
                        }).then(function (res) {
                            //console.log(res)                                               
                            if(res.data.error==0){
                                that.$message({
                                  message: '编辑成功',
                                  type: 'success'
                                });
                                that.objectAssign(that.fields2,that.fields);                               
                                //that.$router.push('/goods/Brand');
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
            },
            onSubmit2:function(){
                var that = this;
                if(this.formstate.$valid){                                                             
                    that.$http({
                          method:'post',
                          url: '/goods_brand/editseosubmit',
                          params:{
                            'brand_id':that.fields.brand_id,                            
                            'seo_title':that.seoData.seo_title,
                            'seo_keywords':that.seoData.seo_keywords,
                            'seo_description':that.seoData.seo_description
                          }           
                        }).then(function (res) {                                                      
                            if(res.data.error==0){
                                that.$message({
                                  message: 'SEO信息更新成功',
                                  type: 'success'
                                });
                                that.objectAssign(that.seoData2,that.seoData);                                
                                //that.$router.push('/goods/Brand');
                            }else{
                                that.$message({
                                  message: res.data.desc,
                                  type: 'warning'
                                });                                
                            }                            
                            //console.log(that.cateList)                                  
                        }).catch(function (error) {
                            console.log(error);
                        });
                }
            }
        }
	}
</script>