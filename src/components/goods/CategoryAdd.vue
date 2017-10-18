<template>
	<div id="CategoryAdd">
		<HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
		<div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title">
                            <h5>添加一级分类</h5>
                        </div>                        
                        <div class="ibox-content add-user">
                            <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t" id="commentForm" >                                 
                                <validate class="form-group">
                                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>分类名称：</label>
                                    <div class="col-sm-4">                                        
                                        <input type="text" name="category_name" class="form-control" placeholder="请输入分类名称" v-model="model.category_name" required :class="fieldClassName(formstate.category_name)">
                                        <field-messages name="category_name" show="$touched ||$submitted" class="form-control-callback">
                                            <div class="valid">Success!</div>
                                            <div slot="required" class="error">分类名称不能为空.</div>
                                        </field-messages>
                                    </div>
                                    <span class="f-c-r">分类名称较长，以“ 、”号隔开，如：手机数码、手机通讯</span>
                                </validate>
                                <div class="form-group">
                                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>分类图片：</label>                                    
                                    <validate class="col-sm-2">
                                        <input type="hidden" name="category_pc_pic" v-model="model.category_pc_pic" required :class="fieldClassName(formstate.category_pc_pic)">
                                        <el-upload
                                          class="avatar-uploader"
                                          :action="sevUrl+'/admin/upload'"  
                                          :data="usermsg"                                 
                                          :show-file-list="false"
                                          :on-success="handleAvatarSuccess"
                                          :before-upload="beforeAvatarUpload">
                                          <img v-if="model.category_pc_pic" :src="Imgpath+model.category_pc_pic" class="avatar">
                                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                        <span class="picTips">PC端</span>
                                        <field-messages name="category_pc_pic" show="$touched ||$submitted" class="form-control-callback">
                                            <div class="valid">Success!</div>
                                            <div slot="required" class="error">图片不能为空.</div>
                                        </field-messages>
                                    </validate>
                                    <validate class="col-sm-2">
                                        <input type="hidden" name="category_pic" v-model="model.category_pic" required :class="fieldClassName(formstate.category_pic)">
                                        <el-upload
                                          class="avatar-uploader"
                                          :action="sevUrl+'/admin/upload'" 
                                          :show-file-list="false"
                                          :data="usermsg"                                          
                                          :on-success="handleAvatarSuccess2"
                                          :before-upload="beforeAvatarUpload">
                                          <img v-if="model.category_pic" :src="Imgpath+model.category_pic" class="avatar">
                                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>
                                        <span class="picTips">手机端</span>
                                        <field-messages name="category_pic" show="$touched ||$submitted" class="form-control-callback">
                                            <div class="valid">Success!</div>
                                            <div slot="required" class="error">图片不能为空.</div>
                                        </field-messages>
                                    </validate>
                                    <span class="f-c-r">（注：电脑端与手机端图片单独上传）</span>
                                </div>                               
                               
                                <field class="form-group">
                                    <label class="col-sm-3 control-label">排序：</label>
                                    <div class="col-sm-4">
                                        <input type="text" name="category_sort" class="form-control" v-model="model.category_sort">
                                    </div>
                                </field>                                
                                <field class="form-group">
                                    <label class="col-sm-3 control-label">是否显示在分类导航：</label>
                                    <div class="col-sm-6">
                                        <div class="r-state">
                                            <input type="radio" class="i-checks" name="is_show" v-model="model.is_show" value="1">
                                            <label for="normal">是</label>
                                        </div>
                                        <div class="r-state">
                                            <input type="radio" class="i-checks" name="is_show" v-model="model.is_show" value="0">
                                            <label for="r_close">否</label>
                                        </div>
                                    </div>
                                </field>
                                <field class="form-group">
                                    <label class="col-sm-3 control-label">数量单位：</label>
                                    <div class="col-sm-4">
                                        <input type="text" name="category_unit" class="form-control" v-model="model.category_unit">
                                    </div>
                                </field>
                                <field class="form-group">
                                    <label class="col-sm-3 control-label">分类描述：</label>
                                    <div class="col-sm-4">
                                        <textarea type="text" name="category_desc" v-model="model.category_desc" class="form-control">{{model.category_desc}}</textarea>
                                    </div>
                                </field>
                                <div class="form-group">
                                    
                                </div>
                                
                              <div class="hr-line-dashed"></div>
                                <div class="form-group draggable ui-draggable">
                                    <div class="col-sm-12 col-sm-offset-3">
                                    	<button class="btn btn-primary" type="submit">提交</button>
                                        <router-link to="/goods/category" class="btn btn-white m-l-sm">返回列表</router-link>
                                    </div>  
                                </div>
                            </vue-form>
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
                            url:'/goods/category'
                        },
                        {
                            title:'分类添加',
                            url:''
                        }
		    		]
		    	},
                Imgpath:Imgpath,
                sevUrl:sevUrl,               
                formstate:{},
                cateList:[],
                usermsg:{
                    'access_token':JSON.parse(window.localStorage.getItem('access_token')),
                    'userid':JSON.parse(window.localStorage.getItem('userid'))
                },               
                model:{
                    category_name:"",
                    category_parentid:0,
                    category_pic:"",
                    category_pc_pic:"",
                    category_sort:0,
                    is_show:1,
                    category_desc:"",
                    category_unit:""                 
                }
	    	}
	    }, 
        mounted(){          
            this.CatePrent();    //上级分类数据                  
        },
        methods:{
            CatePrent() {
                var that = this;                                         
                that.$http({
                      method:'post',
                      url: '/goods/category/allList',
                      params:{                       
                        'access_token':JSON.parse(window.localStorage.getItem('access_token')),
                        'userid':JSON.parse(window.localStorage.getItem('userid'))
                      }           
                    }).then(function (res) {                                                
                        if(res.data.result==1){
                           that.cateList = res.data.data;    
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
                this.model.category_pc_pic = PcPath;
            },
            handleAvatarSuccess2(res, file) {
                var WapPath = res.data.file_path;
                this.model.category_pic = WapPath;
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
                //return isJPG && isLt2M;
                return (isJPG||isPNG||isGIF) && isLt2M;
            },
            onSubmit:function(){
                var that = this;
                if(this.formstate.$valid){                                                             
                    that.$http({
                          method:'post',
                          url: '/goods/category/addOrUpdate',
                          params:{                       
                            'access_token':JSON.parse(window.localStorage.getItem('access_token')),
                            'userid':JSON.parse(window.localStorage.getItem('userid')),
                            'category_name':that.model.category_name,
                            'category_parentid':0,
                            'category_pc_pic':that.model.category_pc_pic,
                            'category_pic':that.model.category_pic,
                            'category_sort':that.model.category_sort,
                            'is_show':that.model.is_show,
                            'category_unit':that.model.category_unit,
                            'category_desc':that.model.category_desc
                          }           
                        }).then(function (res) {
                            //console.log(res)                                               
                            if(res.data.result==1){
                                that.$message({
                                  message: '添加成功',
                                  type: 'success'
                                });
                                /*that.model.category_name="",
                                that.model.category_parentid=0,
                                that.model.category_pic="",
                                that.model.category_pc_pic="",
                                that.model.category_sort="",
                                that.model.is_show=1,
                                that.model.category_desc="",
                                that.model.category_unit=""*/
                                that.$router.push('/goods/category');
                                //that.model = Object.assign(that.model, that.defaultData);                                 
                            }else{
                                that.$message({
                                  message: '保存失败',
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
