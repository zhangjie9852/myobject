<template>
	<div id="AnnexEdit">
		<HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
		<div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title">
                            <h5>编辑图册</h5>
                        </div>                        
                        <div class="ibox-content add-user">
                            <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t" id="commentForm">                                              
                                <validate class="form-group">
                                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>图册名称：</label>
                                    <div class="col-sm-4">                                        
                                        <input type="text" name="photo_collection_name" class="form-control" v-model="fields.photo_collection_name" required :class="fieldClassName(formstate.photo_collection_name)">
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
                                            <li v-for="(item,index) in fields.picArr">
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
                                            <input type="hidden" name="picStr" v-model="fields.picStr" required :class="fieldClassName(formstate.picStr)">
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
                                        <textarea type="text" rows="5" name="photo_desc" v-model="fields.photo_desc" class="form-control">{{fields.photo_desc}}</textarea>
                                    </div>
                                </field>
                              <div class="hr-line-dashed"></div>
                                <div class="form-group draggable ui-draggable">
                                    <div class="col-sm-12 col-sm-offset-3">
                                    	<button class="btn btn-primary" type="submit">提交</button>
                                        <router-link to="/goods/images" class="btn btn-white m-l-sm">返回列表</router-link>
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
                  :multiple="true"
                  list-type="picture-card"
                  :data="usermsg"
                  :on-remove="handleRemove"
                  :file-list="fileList"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload" >
                  <i class="el-icon-plus"></i>
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
                  title:'图片库编辑',
                  url:''
              }
		    		]
		    	},
                Imgpath:Imgpath,
                sevUrl:sevUrl,
                dialogPic:false,
                activeName: 'first',
                dialogVisible: false,
                uploadPic:[],
                webLinkPic:'',               
                formstate:{},
                cateList:[],
                dialogVisible: false,
                usermsg:{
                    'token_admin':JSON.parse(window.localStorage.getItem('access_token')),
                    'admin_id':JSON.parse(window.localStorage.getItem('userid'))
                },               
                fields:{
                    gallery_id:0,
                    photo_collection_name:'',
                    picArr:[],
                    picStr:'',
                    photo_desc:"",                    
                    fileList:[]                                  
                }
	    	}
	    }, 
        mounted(){          
            this.ImgEditList(this.$route.params.id)                
        },
        // updated(){
        //     if(this.pageError){
        //         this.ImgEditList(this.$route.params.id)  
        //     }           
        // },
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
                  //this.fields.picArr.push(picpath); 
                  //this.fields.picStr = this.fields.picArr.join(",");                  
                }                                         
            },            
            handleRemove(file, fileList) {              
              this.removeByValue(this.fields.picArr,file.url);
            },
            RemovePic(url){
              this.removeByValue(this.fields.picArr,url);
              this.fields.picStr = this.fields.picArr.join(","); 
              //console.log(this.fields.picArr)
            },
            handlePictureCardPreview(file) {
                this.fields.bigImg = file.url;
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
                //return isJPG && isLt2M;
                return (isJPG||isPNG||isGIF) && isLt2M;
            },
            ImgEditList(cid){
                var that = this;
                that.$http({
                          method:'post',
                          url: '/goods_gallery/infodata',
                          params:{
                            'gallery_id':cid                       
                          }           
                        }).then(function (res) {                                                    
                            var  fieldList =  res.data.data;
                            //console.log(res)                                                      
                            if(res.data.error==0){
                                that.fields.gallery_id = fieldList.gallery_id;
                                that.fields.photo_collection_name = fieldList.gallery_name;
                                that.fields.photo_desc = fieldList.gallery_desc;
                                var listArr = fieldList.imglist.length; 
                                for(var i=0;i<listArr;i++){
                                    that.fields.picArr.push(fieldList.imglist[i].img_url);
                                    that.fields.picStr = that.fields.picArr.join(",");
                                } 
                                //console.log(that.fields.picStr)                                 
                            }else{
                                 that.$message({
                                  message: res.data.desc,
                                  type: 'warning'
                                }); 
                                that.pageError = true;                         
                            }                                                        
                        }).catch(function (error) {
                            console.log(error);
                        });
            },
            SureBtn(){
              if(this.activeName == "first"){
                    if(this.uploadPic != ""){
                        if(this.uploadPic.length>1){
                          for(var i=0;i<this.uploadPic.length;i++){                                   
                              this.fields.picArr.push(this.uploadPic[i])
                          } 
                        }else{
                          this.fields.picArr.push(this.uploadPic); 
                        }
                        
                        this.fields.picStr = this.fields.picArr.join(",");                         
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
                            this.fields.picArr.push(str);
                            this.fields.picStr = this.fields.picArr.join(",");
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
                          url: '/goods_gallery/editsubmit',
                          params:{
                            'gallery_id':that.fields.gallery_id, 
                            'gallery_name':that.fields.photo_collection_name, 
                            'imglist':that.fields.picStr, 
                            'gallery_desc':that.fields.photo_desc                            
                          }           
                        }).then(function (res) {
                            if(res.data.error==0){
                                that.$message({
                                  message: res.data.desc,
                                  type: 'success'
                                });                                
                                that.$router.push('/goods/images');
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

