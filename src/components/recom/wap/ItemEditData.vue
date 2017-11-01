<template>
    <div id="recomData">
        <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t" id="commentForm">
            <validate class="form-group" v-for="(item,index) in fields" :key="index">                
                <div class="col-sm-3 posR">                                        
                    <span class="f-c-r">*</span>图片({{recomMsg.pwidth}}px*{{recomMsg.pheight}}px)：<input type="text" :name="'img_url'+index" readonly class="form-control picurl" v-model="fields[index].img_url" required :class="fieldClassName(formstate.img_url)">
                    <!-- <img :src="fields[index].img_url" width="60" height="60"> -->
                    <button type="button" class="btn btn-primary picBtn" @click="picChange(index)" value="选择">选择</button>
                </div>                
                <div class="col-sm-3">                                        
                    链接地址：<input type="text" name="jump_url" v-model="fields[index].jump_url" class="form-control">
                </div>                
                <div class="col-sm-3">                                        
                    名称：<input type="text" name="recmd_data_title" v-model="fields[index].recmd_data_title" class="form-control">
                </div>
                <div class="col-sm-1">                                        
                    排序：<input type="text" name="recmd_sort" v-model="fields[index].sort" class="form-control">
                </div>
                <div>                                        
                    <a class="shop icon-shanchu" @click="delItem(index)" title="删除"></a>
                </div>
                <el-dialog title="选择图片" v-if="dialogInd==index" :visible.sync="dialogPic">
                    <el-tabs v-model="activeName" type="card">
                      <el-tab-pane label="本地图片" name="first">
                        <el-upload
                          class="avatar-uploader"
                          :action="sevUrl+'/admin/upload'" 
                          :show-file-list="false"
                          :data="usermsg"                                          
                          :on-success="handleAvatarSuccess"
                          :before-upload="beforeAvatarUpload">
                          <img v-if="uploadPic" :src="uploadPic" class="avatar">
                          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>                        
                      </el-tab-pane>
                      <el-tab-pane label="图片库" name="second" :data-val="galleryPicUrl">
                        <PicLlibrary v-if="dialogPic"></PicLlibrary>
                      </el-tab-pane>
                      <el-tab-pane label="网络图片" name="third">
                        网络图片：<input type="text" class="web-pic" v-model="webLinkPic" @blur="CheckUrl(webLinkPic)"> 图片地址必须以http开头,以jpg,png,bmp,gif结束
                      </el-tab-pane>            
                    </el-tabs>          
                    <div slot="footer" class="dialog-footer">
                      <el-button type="primary" @click="SureBtn">确 定</el-button>
                      <el-button @click="CancelBtn">取 消</el-button>
                    </div>
                </el-dialog>
            </validate>
            
          <div class="hr-line-dashed"></div>
            <div class="form-group draggable ui-draggable">
                <div class="col-sm-12 col-sm-offset-3">
                    <button class="btn btn-primary" type="submit" v-if="fields!=''">提交</button>
                    <button class="btn btn-white m-l-md" type="button" @click="additem" v-if="recomMsg.maxLen>fields.length">添加数据</button>
                    <!-- <el-button type="primary" native-type="submit" v-if="fields!=''">提交</el-button>
                    <el-button class="white-btn m-l-sm" @click="additem" v-if="recomMsg.maxLen>fields.length">添加数据</el-button>  -->       
                </div>  
            </div>
        </vue-form>
    </div>
</template>

<script>
import {Imgpath,sevUrl,CustomFun} from '../../comms/main.js'
import PicLlibrary from '../../comms/PicLlibrary.vue'
import {mapGetters,mapActions} from 'vuex'
    export default{
        name:"HjRecom",
        props: ['recomMsg'],
        components:{
          PicLlibrary
        },
        data(){
            return{                               
                formstate:{},                
                fields:[],
                activeName: 'first',
                Imgpath:Imgpath,
                sevUrl:sevUrl,
                dialogPic:false,
                dialogVisible: false,
                isShowPic:false,
                Verification:false,
                uploadPic:'',
                webLinkPic:'',
                galleryPic:'',
                dialogInd:0,               
                usermsg:{
                    'token_admin':JSON.parse(window.localStorage.getItem('access_token')),
                    'admin_id':JSON.parse(window.localStorage.getItem('userid'))
                },
            }
        }, 
        computed: {     
            ...mapGetters([           
              'galleryUrl'      
            ]),
            galleryPicUrl(){
                this.galleryPic= this.galleryUrl;
            }   
        },           
        mounted(){
            this.$store.commit('GALLERY_PIC_URL', '');             
            this.dataInfo(this.recomMsg.itemid)                       
        },
        methods:{
            CheckUrl:CustomFun.CheckUrl,    
            fieldClassName:function(field){
                if(!field){
                    return '';
                }else if((field.$submitted) && field.$invalid){
                    return 'error';
                }else if((field.$submitted) && field.$valid){
                    return 'valid';
                }
            },
            dataInfo(cid){
                var that = this;
                that.$http({
                          method:'post',
                          url: '/recmd_data/listdata',
                          params:{
                            'recmd_item_id':cid                       
                          }           
                        }).then(function (res) {                                                    
                            var  fieldList =  res.data.data;
                            //console.log(fieldList)                                                     
                            if(res.data.error==0){
                                if(fieldList.length>0){
                                    that.fields=[];
                                    for(var i=0;i<fieldList.length;i++){                                   
                                        that.fields.push({
                                            recmd_data_title:fieldList[i].recmd_data_title,
                                            img_url:fieldList[i].img_url,
                                            jump_url:fieldList[i].jump_url,
                                            sort:fieldList[i].sort         
                                         });
                                    } 
                                }else{
                                    that.fields=[];
                                   for(var i=0;i<that.recomMsg.maxLen;i++){                                   
                                        that.fields.push({
                                            recmd_data_title:"",
                                            img_url:"",
                                            jump_url:"",
                                            sort:0         
                                         });
                                    } 
                                }    
                            }else{
                                 that.$message({
                                    type: 'error',
                                    message: res.data.desc
                                  });                            
                            }                                                        
                        }).catch(function (error) {
                            console.log(error);
                        });
            },
            delItem:function(index){
                this.fields.splice(index, 1); 
            },
            additem:function(){
                this.fields.push({
                    recmd_data_title:"",
                    img_url:"",
                    jump_url:"",
                    sort:0          
                 });
            },
            SureBtn(){
                var ind = this.dialogInd;                
                if(this.activeName == "first"){
                    if(this.uploadPic != ""){
                        this.fields[ind].img_url = this.uploadPic;
                        this.dialogPic = false; 
                    }else{
                        this.$message({
                          message: '请选择文件后再上传',
                          type: 'warning'
                        });
                    }                   
                }else if(this.activeName == "second"){
                    if(this.galleryPic != ""){
                        this.fields[ind].img_url = this.galleryPic;
                        this.dialogPic = false;
                        this.$store.commit('GALLERY_PIC_URL', ''); 
                        this.activeName = 'first';
                    }else{                        
                        this.$message({
                          message: '未选择任何图片',
                          type: 'warning'
                        });
                    }                   
                }else{
                    if(this.webLinkPic != ""){
                        var str = this.webLinkPic;                        
                        if(this.CheckUrl(str)){
                            this.fields[ind].img_url = this.webLinkPic;
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
            picChange(index){
                this.dialogPic = true;
                this.dialogInd = index;
                this.uploadPic = ''
                this.webLinkPic = ''
                this.galleryPic = ''
            },
            handleAvatarSuccess(res, file) {
                //this.isShowPic=true;           
                //var ind = this.dialogInd;                          
                var PcPath = Imgpath+res.data.file_path;
                this.uploadPic = PcPath;                            
                //this.fields[ind].img_url = PcPath;
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
                var fieldsArr = that.fields;
                for(var ii=0; ii<fieldsArr.length; ii++) {                                        
                    if(fieldsArr[ii].img_url==''){                        
                        that.$message({
                          message: '图片不能为空',
                          type: 'warning'
                        }); 
                        return
                        this.Verification = false;
                    }else{
                        this.Verification = true;
                    }                    
                }
                if(this.Verification){                                                                        
                    that.$http({
                          method:'post',
                          url: '/recmd_data/editsubmit',
                          params:{ 
                            'item_id':that.recomMsg.itemid,                           
                            'itemArr':JSON.stringify(that.fields)
                          }           
                        }).then(function (res) {                                                                         
                            if(res.data.error==0){
                                that.$message({
                                  message: '编辑成功',
                                  type: 'success'
                                }); 
                                //that.$router.push('/recom/wap/item/'+that.recomMsg.pid)
                            }else{
                                that.$message({
                                  message: res.data.desc,
                                  type: 'warning'
                                });                                
                            }                               
                        }).catch(function (error) {
                            console.log(error);
                        });
                }else{
                    that.$message({
                      message: '信息不完整',
                      type: 'warning'
                    });
                }
            }
        }
    }
</script>
