<template>
	<div id="AnnexAdd">
		<HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
		<div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">                   
                        <div class="ibox-content p-m">
                          <div class="hd-title">添加图册</div> 
                            <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t" id="commentForm">                                                                
                                <validate class="form-group">
                                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>图册名称：</label>
                                    <div class="col-sm-4">                                        
                                        <input type="text" name="photo_collection_name" class="form-control" v-model="model.photo_collection_name" required :class="fieldClassName(formstate.photo_collection_name)">
                                        <field-messages name="photo_collection_name" show="$touched ||$submitted" class="form-control-callback">
                                            <div class="valid">Success!</div>
                                            <div slot="required" class="error">图册名称不能为空.</div>
                                        </field-messages>
                                    </div>
                                </validate>
                                <div class="form-group">
                                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>上传图片：</label>
                                    <div class="col-sm-9">
                                        <ul class="imgList clearfix">
                                            <li v-for="(item,index) in model.picArr">
                                              <div class="img-box">
                                                <img :src="item">
                                              </div>
                                              <a class="img-del" @click="RemovePic(item);"></a>
                                            </li>
                                            <li class="upload">
                                              <a @click="picChange"><img src="../../assets/img/add.png"></a>
                                            </li>
                                        </ul>
                                        <validate>
                                            <input type="hidden" name="picStr" v-model="model.picStr" required :class="fieldClassName(formstate.picStr)">
                                            <field-messages name="picStr" show="$touched ||$submitted" class="form-control-callback">
                                                <div class="valid">Success!</div>
                                                <div slot="required" class="error">图片不能为空.</div>
                                            </field-messages>
                                        </validate>
                                    </div>
                                </div>                                
                                <field class="form-group">
                                    <label class="col-sm-3 control-label">描述：</label>
                                    <div class="col-sm-4">
                                        <textarea type="text" rows="5" name="photo_desc" v-model="model.photo_desc" class="form-control">{{model.photo_desc}}</textarea>
                                    </div>
                                </field>
                              <div class="hr-line-dashed"></div>
                                <div class="form-group draggable ui-draggable">
                                    <div class="col-sm-12 col-sm-offset-3">
                                    	<!--<button class="btn btn-primary" type="submit">提交</button>
                                        <router-link to="/goods/images" class="btn btn-white m-l-sm">返回列表</router-link>-->
                                        <el-button type="primary" native-type="submit">提交</el-button>
                                        <router-link to="/goods/images" class="white-btn m-l-sm">返回列表</router-link>
                                    </div>  
                                </div>
                            </vue-form>
                      </div>
                    </div>
                </div>

            </div>
        </div>
        <el-dialog title="选择图片" :visible.sync="dialogPic" :close-on-click-modal="false">
            <el-tabs v-model="activeName" type="card">
              <el-tab-pane label="本地图片" name="first">
                <el-upload
                 class="avatarlist-uploader"
                  :action="sevUrl+'/admin/upload'"
                  list-type="picture-card"
                  :multiple="true"
                  :data="usermsg"
                  :on-remove="handleRemove"
                  :file-list="fileList"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload" >
                  <i class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-tab-pane>
              <el-tab-pane label="网络图片" name="second">
                网络图片：<input type="text" class="web-pic" v-model="webLinkPic" @blur="CheckUrl(webLinkPic)"> 图片地址必须以http开头,以jpg,png,bmp,gif结束
              </el-tab-pane>            
            </el-tabs>          
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="SureBtn">确 定</el-button>
              <el-button @click="CancelBtn">取 消</el-button>
            </div>
        </el-dialog>
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
                  title:'商品中心',
                  url:'/goods/category'
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
          dialogPic:false,
          activeName: 'first',
          Imgpath:Imgpath,
          sevUrl:sevUrl,
          uploadPic:[],               
          formstate:{},
          cateList:[],
          dialogVisible: false,
          webLinkPic:'',
          usermsg:{
              'token_admin':JSON.parse(window.localStorage.getItem('access_token')),
              'admin_id':JSON.parse(window.localStorage.getItem('userid'))
          },               
          model:{
              photo_collection_name:"",
              picArr:[],
              photo_desc:"",
              picStr:''
          },
          fileList: []
	    	 }
	      }, 
        mounted(){          
                           
        },
        methods:{ 
            removeByValue:CustomFun.removeByValue,
            CheckUrl:CustomFun.CheckUrl,                  
            fieldClassName:function(field){
                if(!field){
                    return '';
                }else if((field.$touched ||field.$submitted) && field.$invalid){
                    return 'error';
                }else if((field.$touched ||field.$submitted) && field.$valid){
                    return 'valid';
                }
            },            
            handleAvatarSuccess(res, file,fileList) { 
                var picpath = Imgpath+res.data.file_path;                                
                if(res.result==1){
                  this.uploadPic.push(picpath); 
                  //this.model.picArr.push(picpath); 
                  //this.model.picStr = this.model.picArr.join(",");                              
                }                         
            },           
            handleRemove(file, fileList) {
              this.removeByValue(this.model.picArr,file.url);
            },
            RemovePic(url){
              this.removeByValue(this.model.picArr,url);
              this.model.picStr = this.model.picArr.join(","); 
              console.log(this.model.picArr)
            },
            handlePictureCardPreview(file) {                
                this.model.bigImg = file.url;
                this.dialogVisible = true;
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
            SureBtn(){
              if(this.activeName == "first"){
                    if(this.uploadPic != ""){
                        if(this.uploadPic.length>1){
                          for(var i=0;i<this.uploadPic.length;i++){                                   
                              this.model.picArr.push(this.uploadPic[i])
                          } 
                        }else{
                          this.model.picArr.push(this.uploadPic); 
                        }
                        
                        this.model.picStr = this.model.picArr.join(",");                         
                        this.dialogPic = false; 
                    }else{
                        this.$message({
                          message: '请选择文件后再上传',
                          type: 'warning'
                        });
                    }                   
                }else{
                    if(this.webLinkPic != ""){
                        var str = this.webLinkPic;                        
                        if(this.CheckUrl(str)){                            
                            this.model.picArr.push(str);
                            this.model.picStr = this.model.picArr.join(",");
                            this.dialogPic = false;
                            this.activeName = 'first';
                        }else{
                            this.$message({
                              message: '请正确输入地址',
                              type: 'warning'
                            });
                        }                         
                    }else{
                        this.$message({
                          message: '请输入网络图片地址',
                          type: 'warning'
                        });
                    }
                }              
            },
            CancelBtn(){
              this.dialogPic = false;
              this.activeName = 'first';
            },
            picChange(){             
                this.dialogPic = true;                
                this.uploadPic = [];
                this.webLinkPic = '' ;
                this.fileList = [];             
            },
            onSubmit:function(){
                var that = this;
                if(this.formstate.$valid){                                                             
                    that.$http({
                          method:'post',
                          url: '/goods_gallery/addsubmit',
                          params:{ 
                            'gallery_name':that.model.photo_collection_name,                            
                            'imglist':that.model.picStr,
                            'gallery_desc':that.model.photo_desc                            
                          }           
                        }).then(function (res) {                                                                        
                            if(res.data.error==0){
                                that.$message({
                                  message: '添加成功',
                                  type: 'success'
                                });                                
                                that.$router.push('/goods/images');
                            }else{
                                that.$message({
                                  message: '保存失败',
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