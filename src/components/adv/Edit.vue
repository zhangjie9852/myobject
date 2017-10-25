<template>
  <div id="MemberAdd">
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-content p-m">
              <div class="hd-title">编辑广告</div> 
              <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t">
                <validate class="form-group">
                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>广告位置：</label>
                    <div class="col-sm-4">
                      <select class="form-control" name="advertising_location" v-model="fields.advertising_location" required :class="fieldClassName(formstate.advertising_location)">
                            <option :value="null">请选择</option>
                            <option v-for="(item,index) in adPosition" :value="item.id">{{item.ad_position_name}}</option>
                        </select>
                        <field-messages name="advertising_location" show="$touched ||$submitted" class="form-control-callback">
                            <div class="valid">Success!</div>
                            <div slot="required" class="error">请选择广告位置.</div>
                        </field-messages>
                    </div>
                </validate>
                <validate class="form-group">
                  <label class="col-sm-3 control-label"><span class="f-c-r">*</span>广告名称：</label>
                  <div class="col-sm-4">
                    <input type="text" name="advertising_name" class="form-control" v-model="fields.advertising_name" required
                           :class="fieldClassName(formstate.advertising_name)" @blur="validateIsExist" @focus="isExist=false">
                    <field-messages name="advertising_name" show="$touched || $submitted" class="form-control-callback">
                      <div slot="required" class="error">广告名称不能为空</div>
                      <div class="error" v-if="isExist">该广告名称已经存在</div>
                    </field-messages>
                  </div>
                </validate>
                <div class="form-group">
                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>广告图片：</label>
                    <validate class="col-sm-2">
                        <input type="hidden" name="advertising_pc_logo" v-model="fields.advertising_pc_logo" required :class="fieldClassName(formstate.advertising_pc_logo)">
                        <ul class="imgList clearfix">
                            <li v-if="fields.advertising_pc_logo">
                              <div class="img-box">
                                <img :src="fields.advertising_pc_logo" @click="picChange('pc')">
                              </div>
                            </li>
                            <li class="upload" v-else>
                              <a @click="picChange('pc')"><img src="../../assets/img/add.png"></a>
                            </li>
                        </ul>                                                
                        <span class="picTips">PC端</span>
                        <field-messages name="advertising_pc_logo" show="$submitted" class="form-control-callback">
                            <div class="valid">Success!</div>
                            <div slot="required" class="error">图片不能为空.</div>
                        </field-messages>
                    </validate>
                    <validate class="col-sm-2">
                        <input type="hidden" name="advertising_wap_logo" v-model="fields.advertising_wap_logo" required :class="fieldClassName(formstate.advertising_wap_logo)">
                        <ul class="imgList clearfix">
                            <li v-if="fields.advertising_wap_logo">
                              <div class="img-box">
                                <img :src="fields.advertising_wap_logo"  @click="picChange('wap')">
                              </div>
                            </li>
                            <li class="upload" v-else>
                              <a @click="picChange('wap')"><img src="../../assets/img/add.png"></a>
                            </li>
                        </ul>
                        <span class="picTips">手机端</span>
                        <field-messages name="advertising_wap_logo" show="$submitted" class="form-control-callback">
                            <div class="valid">Success!</div>
                            <div slot="required" class="error">图片不能为空.</div>
                        </field-messages>
                    </validate>                                            
                </div>
                <validate class="form-group">
                  <label class="col-sm-3 control-label"><span class="f-c-r">*</span>图片链接：</label>
                  <div class="col-sm-4">
                    <input type="text" name="advertising_link" class="form-control" v-model="fields.advertising_link" required :class="fieldClassName(formstate.advertising_link)">                    
                    <field-messages name="advertising_link" show="$touched || $submitted" class="form-control-callback">
                      <div slot="required" class="error">图片链接不能为空</div>
                    </field-messages>
                  </div>
                </validate>
                <div class="form-group">
                  <label class="col-sm-3 control-label"><span class="f-c-r">*</span>广告时间：</label>
                  <validate class="col-sm-5">
                      <el-date-picker
                        v-model="advertising_time"
                        name="range"
                        type="datetimerange"
                        range-separator=" 至 "
                        required :class="fieldClassName(formstate.range)"
                        @change = "changeStartDate"
                        placeholder="选择日期范围">
                      </el-date-picker>
                      <field-messages name="range" show="$submitted" class="form-control-callback">
                          <div slot="required" class="error">请选择广告时间.</div>
                      </field-messages>
                  </validate>                  
                </div>               
                <div class="form-group">
                  <label class="col-sm-3 control-label">备注：</label>
                  <div class="col-sm-4">
                    <textarea class="form-control" :rows="4" name="advertising_remark" v-model="fields.advertising_remark"></textarea>
                  </div>
                </div>                
                <div class="hr-line-dashed"></div>
                <div class="form-group draggable ui-draggable">
                  <div class="col-sm-12 col-sm-offset-3">
                    <!--<button class="btn btn-primary" type="submit">确定</button>
                    <router-link to="/adv/list" class="btn btn-white m-l-sm">返回列表</router-link>-->
                    <el-button type="primary" native-type="submit">确定</el-button>
                    <router-link to="/adv/list" class="white-btn m-l-sm">返回列表</router-link>
                  </div>
                </div>
              </vue-form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="选择图片" :visible.sync="dialogPic">
        <el-tabs v-model="activeName2" type="card">
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
            <PicLlibrary v-if="activeName2=='second'"></PicLlibrary>
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
  </div>
</template>
<script>
  import HjCrumb from '../comms/BreadCrumb.vue'
  import vueForm from 'vue-form'
  import {Imgpath,sevUrl,CustomFun} from '../comms/main.js'
  import PicLlibrary from '../comms/PicLlibrary.vue'
  import {mapGetters,mapActions} from 'vuex'
  export default{
    components: {
      HjCrumb,
      PicLlibrary
    },
    mixins: [vueForm],
    data(){
      return {
        CrumbBox: {
          CrumbList: [
            {
              title:'运营中心',
              url:'/adv/setting'
            },
            {
              title:'广告管理',
              url:'/adv/list'
            },
            {
              title:'编辑广告',
              url:''
            }
          ]
        },
        formstate: {},
        shopId:'',
        isExist:false,
        adPosition:[],
        uploadPic:'',
        webLinkPic:'',
        galleryPic:'',
        sevUrl:sevUrl,
        advertising_name:'',
        fields: {
          ad_id:0,
          advertising_location:null,
          advertising_name: '',
          advertising_pc_logo:'',
          advertising_wap_logo:'',
          advertising_link:'',
          advertising_remark:'',
          advertising_start_time:'',
          advertising_end_time:'',          
        },
        advertising_time:'',
        advertising_time_str:'',
        usermsg:{
            'token_admin':JSON.parse(window.localStorage.getItem('access_token')),
            'admin_id':JSON.parse(window.localStorage.getItem('userid'))
        },
        activeName2: 'first',
        dialogPic:false,
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
    methods: {
      CheckUrl:CustomFun.CheckUrl,
      fieldClassName: function (field) {
        if (!field) {
          return '';
        } else if ((field.$touched || field.$submitted) && field.$invalid) {
          return 'error';
        }
      },
      getInfo () {
        var that=this;
        that.$http({
          method:'post',
          url: '/ad/infodata',
          params:{
            ad_id:that.fields.ad_id
          }
        }).then(function (res) {
          if(res.data.error=='0'){
            var list = res.data.data; 
            that.fields={
              ad_id:list.id,
              advertising_location:list.advertising_location,
              advertising_name:list.advertising_name,
              advertising_pc_logo:list.advertising_pc_logo,
              advertising_wap_logo:list.advertising_wap_logo,
              advertising_link:list.advertising_link,
              advertising_remark:list.advertising_remark,
              advertising_start_time:list.advertising_start_time,
              advertising_end_time:list.advertising_end_time
            };
            that.advertising_time = [new Date(list.advertising_start_time), new Date(list.advertising_end_time)];
            that.advertising_time_str = list.advertising_start_time+" 至 "+list.advertising_end_time;
            that.advertising_name = list.advertising_name;
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
      adList () {//广告位置下拉
        var that=this;        
        that.$http({
          method:'post',
          url: '/adposition/list',
          params:{
            goods_shop_base_id:that.shopId
          }
        }).then(function (res) {             
          if(res.data.error=='0'){
            that.adPosition = res.data.data.table_data;
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
      /*选择日期*/
      changeStartDate (val) {
        if(val != undefined){
          this.advertising_time_str=val;
        }else{
          this.advertising_time = null;
        }      
      },      
      /*上传图片*/
      picChange(ptype){
          this.ptype = ptype;            
          this.dialogPic = true;                
          this.uploadPic = '';
          this.webLinkPic = '';
          this.galleryPic='';         
      },
      SureBtn(){
          var ind = this.dialogInd;                
          if(this.activeName2 == "first"){
              if(this.uploadPic != ""){
                  if(this.ptype =="pc"){
                      this.fields.advertising_pc_logo = this.uploadPic;     
                  }else{
                      this.fields.advertising_wap_logo = this.uploadPic;                            
                  }
                  this.dialogPic = false; 
              }else{
                  this.$message({
                    message: '请选择文件后再上传',
                    type: 'warning'
                  });
              }                   
          }else if(this.activeName2 == "second"){
              if(this.galleryPic != ""){
                  if(this.ptype =="pc"){
                      this.fields.advertising_pc_logo = this.galleryPic; 
                  }else{
                      this.fields.advertising_wap_logo = this.galleryPic;
                  }
                  this.dialogPic = false;
                  this.$store.commit('GALLERY_PIC_URL', ''); 
                  this.activeName2 = 'first';
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
                      if(this.ptype =="pc"){
                          this.fields.advertising_pc_logo = this.webLinkPic;                       
                      }else{
                          this.fields.advertising_wap_logo = this.webLinkPic;
                      }                            
                      this.dialogPic = false;
                      this.activeName2 = 'first';
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
        this.activeName2 = 'first';
      },
      /*图片上传*/      
      handleAvatarSuccess(res, file) { 
          var PcPath = Imgpath+res.data.file_path;
          if(res.result==1){
              this.uploadPic = PcPath;
          }
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
      validateIsExist () {//验证广告名称
        var that=this;
        if(that.fields.advertising_name!=that.advertising_name){
          that.$http({
            method:'post',
            url: '/ad/validateRepeat',
            params:{
              advertising_name:that.fields.advertising_name,
              shop_id:that.shopId
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.isExist=false;
            }else{
              that.isExist=true;  
            }
          }).catch(function (error) {
            console.log(error);
          });
        }else{
          that.isExist=false;
        }       
      },
      onSubmit: function () {
        var that = this;       
        if (that.formstate.$valid && !that.isExist) {
          var start_time = new Date(that.fields.advertising_start_time);
          start_time = start_time.getFullYear()+'-'+(start_time.getMonth()+1)+'-'+start_time.getDate();        
          that.$http({
            method: 'post',
            url: '/ad/editsubmit',
            params: {
              id:that.fields.ad_id,
              goods_shop_base_id:that.shopId,
              advertising_location:that.fields.advertising_location,
              advertising_name: that.fields.advertising_name,
              advertising_pc_logo:that.fields.advertising_pc_logo,
              advertising_wap_logo:that.fields.advertising_wap_logo,
              advertising_link:that.fields.advertising_link,
              advertising_remark:that.fields.advertising_remark,
              advertising_start_time:that.advertising_time_str.slice(0,19),
              advertising_end_time:that.advertising_time_str.slice(22,42)              
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '更新成功!'
              });
              that.$router.push('/adv/list');
            }else{
              that.$message({
                type: 'error',
                message: res.data.desc
              });
            }
          }).catch(function (error) {
            that.$message({
              type: 'error',
              message: '更新失败，请重新提交!'
            });
          });
        }
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.shopId=JSON.parse(window.localStorage.getItem("shopid"));
        this.adList();
        this.fields.ad_id=this.$route.params.id;
        this.getInfo();
      })
    }
  }
</script>