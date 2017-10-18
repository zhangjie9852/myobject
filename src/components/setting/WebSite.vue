<template>
    <div id="WebSite">
        <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title">
                            <h5>站点设置</h5>
                        </div>                        
                        <div class="ibox-content add-user">
                            <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t" id="commentForm">                                              
                                <validate class="form-group">
                                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>站点名称：</label>
                                    <div class="col-sm-4">                                        
                                        <input type="text" name="site_name" class="form-control" v-model="fields.site_name" required :class="fieldClassName(formstate.site_name)">
                                        <field-messages name="site_name" show="$touched ||$submitted" class="form-control-callback">
                                            <div class="valid">Success!</div>
                                            <div slot="required" class="error">站点名称不能为空.</div>
                                        </field-messages>
                                    </div>
                                </validate>
                                <div class="form-group">
                                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>标准站点logo：</label>
                                    <validate class="col-sm-2">
                                        <input type="hidden" name="site_logo_standard" v-model="fields.site_logo_standard" required :class="fieldClassName(formstate.site_logo_standard)">
                                        <el-upload
                                          class="avatar-uploader"
                                          :action="sevUrl+'/admin/upload'" 
                                          :data="usermsg"                                 
                                          :show-file-list="false"
                                          :on-success="handleAvatarSuccess"
                                          :before-upload="beforeAvatarUpload">
                                          <img v-if="fields.site_logo_standard" :src="fields.site_logo_standard" class="avatar">
                                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>                                        
                                        <field-messages name="site_logo_standard" show="$submitted" class="form-control-callback">
                                            <div class="valid">Success!</div>
                                            <div slot="required" class="error">图片不能为空.</div>
                                        </field-messages>
                                    </validate>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>前台logo：</label>
                                    <validate class="col-sm-2">
                                        <input type="hidden" name="site_logo_frontend" v-model="fields.site_logo_frontend" required :class="fieldClassName(formstate.site_logo_frontend)">
                                        <el-upload
                                          class="avatar-uploader"
                                          :action="sevUrl+'/admin/upload'" 
                                          :data="usermsg"                                 
                                          :show-file-list="false"
                                          :on-success="handleAvatarSuccess2"
                                          :before-upload="beforeAvatarUpload">
                                          <img v-if="fields.site_logo_frontend" :src="fields.site_logo_frontend" class="avatar">
                                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>                                        
                                        <field-messages name="site_logo_frontend" show="$submitted" class="form-control-callback">
                                            <div class="valid">Success!</div>
                                            <div slot="required" class="error">图片不能为空.</div>
                                        </field-messages>
                                    </validate>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>后台logo：</label>
                                    <validate class="col-sm-2">
                                        <input type="hidden" name="site_logo_backend" v-model="fields.site_logo_backend" required :class="fieldClassName(formstate.site_logo_backend)">
                                        <el-upload
                                          class="avatar-uploader"
                                          :action="sevUrl+'/admin/upload'" 
                                          :data="usermsg"                                 
                                          :show-file-list="false"
                                          :on-success="handleAvatarSuccess3"
                                          :before-upload="beforeAvatarUpload">
                                          <img v-if="fields.site_logo_backend" :src="fields.site_logo_backend" class="avatar">
                                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                                        </el-upload>                                        
                                        <field-messages name="site_logo_backend" show="$submitted" class="form-control-callback">
                                            <div class="valid">Success!</div>
                                            <div slot="required" class="error">图片不能为空.</div>
                                        </field-messages>
                                    </validate>
                                </div>
                                <field class="form-group">
                                    <label class="col-sm-3 control-label">公司/备案号：</label>
                                    <div class="col-sm-4">
                                        <input type="text" name="record_number" v-model="fields.site_icp" class="form-control" >
                                    </div>
                                    <span class="f-c-r">xxxxxx有限公司/京ICP备xxxxxxx号</span>
                                </field>                        
                                <field class="form-group">
                                    <label class="col-sm-3 control-label">是否关闭站点：</label>
                                    <div class="col-sm-6">
                                        <div class="r-state">
                                            <el-radio class="radio" v-model="fields.is_close_bool" :label="true">是</el-radio>
                                            <el-radio class="radio" v-model="fields.is_close_bool" :label="false">否</el-radio>                                                    
                                        </div>                                        
                                    </div>
                                </field>
                                <field class="form-group" v-if="fields.is_close_bool">
                                    <label class="col-sm-3 control-label">关闭站点原因：</label>
                                    <div class="col-sm-4">
                                        <textarea type="text" rows="5" name="site_close_reason" v-model="fields.site_close_reason" class="form-control">{{fields.site_close_reason}}</textarea>
                                    </div>
                                </field>
                              <div class="hr-line-dashed"></div>
                                <div class="form-group draggable ui-draggable">
                                    <div class="col-sm-12 col-sm-offset-3">
                                        <button class="btn btn-primary" type="submit">提交</button>
                                        <button class="btn btn-white m-l-sm" type="reset">重置</button>
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
    import {Imgpath,sevUrl,CustomFun} from '../comms/main.js'
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
                            title:'系统设置',
                            url:'/setting/website'
                        },
                        {
                            title:'站点设置',
                            url:''
                        }
                    ]
                },
                Imgpath:Imgpath,
                sevUrl:sevUrl,               
                formstate:{},
                cateList:[],
                dialogVisible: false,
                usermsg:{
                    'token_admin':JSON.parse(window.localStorage.getItem('access_token')),
                    'admin_id':JSON.parse(window.localStorage.getItem('userid'))
                },               
                fields:{ 
                    site_name:'', 
                    site_logo_standard:'', 
                    site_logo_frontend:'', 
                    site_logo_backend:'', 
                    site_icp:'', 
                    is_close_bool:false, 
                    site_close_reason:''
                }
            }
        }, 
        mounted(){          
            this.baseMain()                
        },
        methods:{ 
            removeByValue:CustomFun.removeByValue,                     
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
                var picPath1 = res.data.file_path;                
                this.fields.site_logo_standard = Imgpath+picPath1;
            },
            handleAvatarSuccess2(res, file) {
                var picPath2 = res.data.file_path;
                this.fields.site_logo_frontend = Imgpath+picPath2;
            }, 
            handleAvatarSuccess3(res, file) {
                var picPath3 = res.data.file_path;
                this.fields.site_logo_backend = Imgpath+picPath3;
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
            baseMain(){
                var that = this;
                that.$http({
                          method:'post',
                          url: '/setting_base/sitedata'
                        }).then(function (res) {                            
                            var  fieldList =  res.data.data; 
                            //console.log(fieldList);                            
                            if(res.data.error==0){ 
                                //console.log(fieldList); 
                                that.fields.site_name = fieldList.site_name;
                                that.fields.site_logo_standard = fieldList.site_logo_standard;
                                that.fields.site_logo_frontend = fieldList.site_logo_frontend;
                                that.fields.site_logo_backend = fieldList.site_logo_backend;
                                that.fields.site_icp = fieldList.site_icp;
                                that.fields.is_close_bool = fieldList.is_close_bool;
                                that.fields.site_close_reason = fieldList.site_close_reason;
                                //console.log(that.fields.picArr);                          
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
            onSubmit:function(){
                var that = this;
                if(this.formstate.$valid){                                                                         
                    that.$http({
                          method:'post',
                          url: '/setting_base/sitesubmit',
                          params:{
                            'site_name':that.fields.site_name,                    
                            'site_logo_standard':that.fields.site_logo_standard,
                            'site_logo_frontend':that.fields.site_logo_frontend,
                            'site_logo_backend':that.fields.site_logo_backend,
                            'site_icp':that.fields.site_icp,
                            'is_close_bool':that.fields.is_close_bool,
                            'site_close_reason':that.fields.site_close_reason
                          }           
                        }).then(function (res) {
                            //console.log(res)                                                                       
                            if(res.data.error==0){
                                that.$message({
                                  message: '更新成功',
                                  type: 'success'
                                });                                
                                //that.$router.push('/setting/website');
                            }else{
                                that.$message({
                                  message: '更新失败',
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

