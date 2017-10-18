<template>
	<div id="CategoryEdit">
		<HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
		<div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title">
                            <h5>编辑分类</h5>
                        </div>                        
                        <div class="ibox-content add-user">
                            <el-tabs v-model="activeName" type="card" @tab-click="changeTab">
                              <el-tab-pane label="基本信息" name="first">
                                    <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t" id="commentForm" >                                 
                                        <validate class="form-group">
                                            <label class="col-sm-3 control-label"><span class="f-c-r">*</span>分类名称：</label>
                                            <div class="col-sm-4">                                        
                                                <input type="text" name="category_name" class="form-control" placeholder="请输入分类名称" v-model="fields.category_name" required :class="fieldClassName(formstate.category_name)">
                                                <field-messages name="category_name" show="$submitted" class="form-control-callback">
                                                    <div class="valid">Success!</div>
                                                    <div slot="required" class="error">分类名称不能为空.</div>
                                                </field-messages>
                                            </div>
                                            <span class="f-c-r">分类名称较长，以“ 、”号隔开，如：手机数码、手机通讯</span>
                                        </validate>
                                        <validate class="form-group">
                                            <label class="col-sm-3 control-label"><span class="f-c-r">*</span>分类别名：</label>
                                            <div class="col-sm-4">                                        
                                                <input type="text" name="cate_alias" class="form-control" placeholder="请输入分类别名" v-model="fields.cate_alias" required :class="fieldClassName(formstate.cate_alias)">
                                                <field-messages name="cate_alias" show="$submitted" class="form-control-callback">
                                                    <div class="valid">Success!</div>
                                                    <div slot="required" class="error">分类别名不能为空.</div>
                                                </field-messages>
                                            </div>                                            
                                        </validate>
                                        <div class="form-group">
                                            <label class="col-sm-3 control-label"><span class="f-c-r">*</span>分类图片：</label>                                    
                                            <validate class="col-sm-2">
                                                <input type="hidden" name="category_pc_pic" v-model="fields.category_pc_pic" required :class="fieldClassName(formstate.category_pc_pic)">
                                                <el-upload
                                                  class="avatar-uploader"
                                                  :action="sevUrl+'/admin/upload'" 
                                                  :data="usermsg"                                 
                                                  :show-file-list="false"
                                                  :on-success="handleAvatarSuccess"
                                                  :before-upload="beforeAvatarUpload">
                                                  <img v-if="fields.category_pc_pic" :src="fields.category_pc_pic" class="avatar">
                                                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                                </el-upload>
                                                <span class="picTips">PC端</span>
                                                <field-messages name="category_pc_pic" show="$submitted" class="form-control-callback">
                                                    <div class="valid">Success!</div>
                                                    <div slot="required" class="error">图片不能为空.</div>
                                                </field-messages>
                                            </validate>
                                            <validate class="col-sm-2">
                                                <input type="hidden" name="category_pic" v-model="fields.category_pic" required :class="fieldClassName(formstate.category_pic)">
                                                <el-upload
                                                  class="avatar-uploader"
                                                  :action="sevUrl+'/admin/upload'"
                                                  :show-file-list="false"
                                                  :data="usermsg"                                  
                                                  :on-success="handleAvatarSuccess2"
                                                  :before-upload="beforeAvatarUpload">
                                                  <img v-if="fields.category_pic" :src="fields.category_pic" class="avatar">
                                                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                                </el-upload>
                                                <span class="picTips">手机端</span>
                                                <field-messages name="category_pic" show="$submitted" class="form-control-callback">
                                                    <div class="valid">Success!</div>
                                                    <div slot="required" class="error">图片不能为空.</div>
                                                </field-messages>
                                            </validate>
                                            <span class="f-c-r">（注：电脑端与手机端图片单独上传）</span>
                                        </div>                                
                                        <field class="form-group">
                                            <label class="col-sm-3 control-label">排序：</label>
                                            <div class="col-sm-4">
                                                <input type="text" name="category_sort" class="form-control" v-model="fields.category_sort">
                                            </div>
                                        </field>                                
                                        <field class="form-group">
                                            <label class="col-sm-3 control-label">是否显示：</label>
                                            <div class="col-sm-6">
                                                <div class="r-state">
                                                    <el-radio class="radio" v-model="fields.is_show" :label="true">是</el-radio>
                                                    <el-radio class="radio" v-model="fields.is_show" :label="false">否</el-radio>                                                    
                                                </div>                                                 
                                            </div>
                                        </field>
                                      <div class="hr-line-dashed"></div>
                                        <div class="form-group draggable ui-draggable">
                                            <div class="col-sm-12 col-sm-offset-3">
                                                <button class="btn btn-primary" type="submit">提交</button>
                                                <router-link to="/goods/category" class="btn btn-white m-l-sm">返回列表</router-link>                                        
                                            </div>  
                                        </div>
                                    </vue-form>
                              </el-tab-pane>
                            <el-tab-pane label="SEO信息" name="second">
                                <vue-form :state="formstate2" @submit.prevent="onSubmit2" class="form-horizontal m-t" id="commentForm" >                         
                                        <div class="form-group">
                                            <label class="col-sm-3 control-label">页面标题：</label>
                                            <div class="col-sm-4">
                                                <input type="text" name="seo_title" class="form-control" v-model="seoData.seo_title">
                                            </div>
                                        </div> 
                                        <div class="form-group">
                                            <label class="col-sm-3 control-label">页面关键词：</label>
                                            <div class="col-sm-4">
                                                <input type="text" name="seo_keywords" class="form-control" v-model="seoData.seo_keywords">
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-3 control-label">页面描述：</label>
                                            <div class="col-sm-4">
                                                <textarea type="text" name="seo_description" v-model="seoData.seo_description" class="form-control">{{seoData.seo_description}}</textarea>
                                            </div>
                                        </div>
                                      <div class="hr-line-dashed"></div>
                                        <div class="form-group draggable ui-draggable">
                                            <div class="col-sm-12 col-sm-offset-3">
                                                <button class="btn btn-primary" type="submit">提交</button>
                                                <router-link to="/goods/category" class="btn btn-white m-l-sm">返回列表</router-link>                                        
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
                            url:'/goods/category'
                        },
                        {
                            title:'商品配置',
                            url:'/goods/category'
                        },
			    		{
				    		title:'分类编辑',
				    		url:''
			    		}
		    		]
		    	},                
                activeName: 'first',
                curActiveName:'first',
                Imgpath:Imgpath,
                frompath:'',
                sevUrl:sevUrl,               
                formstate:{},
                formstate2:{},
                cateList:[],
                usermsg:{
                    'token_admin':JSON.parse(window.localStorage.getItem('access_token')),
                    'admin_id':JSON.parse(window.localStorage.getItem('userid'))
                },               
                fields:{
                    category_id:"",
                    category_name:"",
                    cate_alias:"",                    
                    category_pic:"",
                    category_pc_pic:"",
                    category_sort:"",
                    is_show:""                        
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
            this.CateEditList(this.$route.params.id);            
        },        
        methods:{
            objectAssign (obj,oldObj) {
                for (var key in oldObj){
                  obj[key]=oldObj[key];
                }
            },           
            CateEditList(cid){
                var that = this;
                that.$http({
                          method:'post',
                          url: '/goods_category/infodata',
                          params:{
                            'id':cid                           
                          }           
                        }).then(function (res) {
                            //console.log(res.data.data) 
                            var  categoryList =  res.data.data;                                            
                            if(res.data.error==0){
                                //console.log(categoryList)
                                that.fields.category_id = cid;
                                that.fields.category_name = categoryList.category_name; 
                                that.fields.cate_alias = categoryList.cate_alias;                               
                                that.fields.category_pc_pic = categoryList.category_pc_pic;
                                that.fields.category_pic = categoryList.category_pic;
                                that.fields.category_sort = categoryList.category_sort;
                                that.fields.is_show = categoryList.is_show;
                                that.seoData.seo_title = categoryList.seo_title;
                                that.seoData.seo_keywords = categoryList.seo_keywords;
                                that.seoData.seo_description = categoryList.seo_description; 
                                that.objectAssign(that.fields2,that.fields);
                                that.objectAssign(that.seoData2,that.seoData);  
                                //console.log(that.fields.category_parentid);                
                            }else{                                
                                 console.log(res.data.desc);
                                that.pageError = true;                         
                            }                             
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
                    //console.log('保存')               
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
            fieldClassName:function(field){
                if(!field){
                    return '';
                }else if((field.$submitted) && field.$invalid){
                    return 'error';
                }else if((field.$submitted) && field.$valid){
                    return 'valid';
                }
            },
            handleAvatarSuccess(res, file) {                
                var PcPath = Imgpath+res.data.file_path;                
                this.fields.category_pc_pic = PcPath;
            },
            handleAvatarSuccess2(res, file) {
                var WapPath = Imgpath+res.data.file_path;
                this.fields.category_pic = WapPath;
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
                          url: '/goods_category/editsubmit',
                          params:{ 
                            'category_id':that.fields.category_id,
                            'category_name':that.fields.category_name,
                            'cate_alias':that.fields.cate_alias,
                            'category_pc_pic':that.fields.category_pc_pic,
                            'category_pic':that.fields.category_pic,
                            'category_sort':that.fields.category_sort,
                            'is_show':that.fields.is_show
                          }           
                        }).then(function (res) {
                            //console.log(res)                                               
                            if(res.data.error==0){
                                that.$message({
                                  message: '编辑成功',
                                  type: 'success'
                                });
                                that.objectAssign(that.fields2,that.fields);                                
                                //that.$router.push('/goods/category');
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
                if(this.formstate2.$valid){                                                             
                    that.$http({
                          method:'post',
                          url: '/goods_category/editsubmit',
                          params:{ 
                            'category_id':that.fields.category_id,                           
                            'seo_title':that.seoData.seo_title,
                            'seo_keywords':that.seoData.seo_keywords,
                            'seo_description':that.seoData.seo_description
                          }           
                        }).then(function (res) {                                                                         
                            if(res.data.error==0){
                                that.$message({
                                  message: '编辑成功',
                                  type: 'success'
                                });
                                that.objectAssign(that.seoData2,that.seoData);                               
                                //that.$router.push('/goods/category');
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
	}
</script>