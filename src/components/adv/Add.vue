<template>
  <div id="MemberAdd">
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-content p-m">
              <div class="hd-title">添加广告</div> 
              <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t">
                <validate class="form-group" v-if="cateList!=''">
                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>商品分类：</label>
                    <div class="col-sm-4">                        
                        <el-select name="category_id" v-model="fields.category_id" required :class="fieldClassName(formstate.category_id)">
                            <el-option :key="null" label="请选择商品分类" :value="null"></el-option>
                            <template v-for="item in cateList">
                                <el-option :key="item.category_id" :label="item.category_name" :value="item.category_id"></el-option>
                            </template>
                        </el-select>
                        <field-messages name="category_id" show="$touched ||$submitted" class="form-control-callback">
                            <div class="valid">Success!</div>
                            <div slot="required" class="error">请选择商品分类.</div>
                        </field-messages>
                    </div>
                </validate>
                <validate class="form-group">
                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>广告位置：</label>
                    <div class="col-sm-4">
                      <!--<select class="form-control" name="advertising_location" v-model="fields.advertising_location" required :class="fieldClassName(formstate.advertising_location)">
                            <option :value="null">请选择</option>
                            <option v-for="(item,index) in adPosition" :value="item.id">{{item.ad_position_name}}</option>
                        </select>-->
                        <el-select name="advertising_location" v-model="fields.advertising_location" required :class="fieldClassName(formstate.advertising_location)"  @change="handleChange">
                          <el-option :key="null" label="请选择" :value="null"></el-option>
                          <template v-for="item in adPosition">
                            <el-option :key="item.id" :label="item.ad_position_name" :value="item.id"></el-option>
                          </template>
                        </el-select>
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
                        <!-- <span class="picTips">PC端</span> -->
                        <field-messages name="advertising_pc_logo" show="$submitted" class="form-control-callback">
                            <div class="valid">Success!</div>
                            <div slot="required" class="error">图片不能为空.</div>
                        </field-messages>
                    </validate>
                    <!-- <validate class="col-sm-2">
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
                    </validate> -->
                    <span class="f-c-r form-tips m-t-xl" v-if="ad_position_high>0">建议尺寸：{{ad_position_high}}px*{{ad_position_wide}}px</span>                                                              
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
                  <div class="col-sm-5">
                    <validate class="col-sm-6 p-l-n">
                      <el-date-picker type="datetime" name="advertising_start_time" placeholder="选择开始日期" v-model="fields.advertising_start_time" @change="changeStartDate" :editable="false" required :class="fieldClassName(formstate.advertising_start_time)"></el-date-picker>
                      <field-messages name="advertising_start_time" show="$submitted" class="form-control-callback">
                          <div class="valid">Success!</div>
                          <div slot="required" class="error">请选择开始日期.</div>
                      </field-messages>
                    </validate>
                    <validate class="col-sm-6">
                      <el-date-picker type="datetime" placeholder="选择结束日期" name="advertising_end_time" v-model="fields.advertising_end_time" :picker-options="pickerOptions" @change="changeEndDate" :editable="false" :disabled="fields.advertising_start_time==''?true:false" required :class="fieldClassName(formstate.advertising_end_time)"></el-date-picker>
                      <field-messages name="advertising_end_time" show="$submitted" class="form-control-callback">
                          <div class="valid">Success!</div>
                          <div slot="required" class="error">请选择结束日期.</div>
                      </field-messages>
                    </validate>
                  </div>                  
                </div>
                <div class="form-group">
                  <label class="col-sm-3 control-label">是否推荐：</label>
                  <div class="col-sm-4">
                    <el-radio class="radio" name="is_recommend" v-model="fields.is_recommend" :label="1">是</el-radio>
                    <el-radio class="radio" name="is_recommend" v-model="fields.is_recommend" :label="0">否</el-radio>
                  </div>
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
                    <button class="btn btn-white m-l-sm" type="reset" @click="onReset">重置</button>-->
                    <el-button type="primary" native-type="submit">确定</el-button>
                    <el-button native-type="reset" @click="onReset">重置</el-button>
                  </div>
                </div>
              </vue-form>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="选择图片" :visible.sync="dialogPic" :close-on-click-modal="false">
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
              title:'添加广告',
              url:''
            }
          ]
        }, 
        pickerOptions: {
            disabledDate:(time)=>{
            return time.getTime() < this.fields.advertising_start_time;
          }
        },
        cateList:[],
        formstate: {},
        shopId:'',
        isExist:false,
        adPosition:[],
        uploadPic:'',
        webLinkPic:'',
        galleryPic:'',
        sevUrl:sevUrl,
        ad_position_high:0,
        ad_position_wide:0,
        fields: {
          category_id:null,
          advertising_location:null,
          advertising_name: '',
          advertising_pc_logo:'',
          advertising_wap_logo:'',
          advertising_link:'',
          advertising_remark:'',
          advertising_start_time:'',
          advertising_end_time:'',
          is_recommend:0
        },        
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
                     that.$message({
                      type: 'warning',
                      message: res.data.desc
                    });                          
                  }                            
              }).catch(function (error) {
                  console.log(error);
              });
      },
      fieldClassName: function (field) {
        if (!field) {
          return '';
        } else if ((field.$touched || field.$submitted) && field.$invalid) {
          return 'error';
        }
      },
      handleChange(value) {//选择广告位出现对应的图片尺寸        
        var obj = {};
        obj = this.adPosition.find((item)=>{          
            return item.id === value;
        });
        this.ad_position_high = obj.ad_position_high;
        this.ad_position_wide = obj.ad_position_wide;
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
        //this.fields.advertising_start_time=val;        
      },
      changeEndDate (val) {
        //this.fields.advertising_start_time=new Date(val);         
        this.fields.advertising_end_time=val;
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
      validateIsExist () {
        var that=this;
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
      },
      onSubmit: function () {
        var that = this;
        if (that.formstate.$valid && !that.isExist) {
          var start_time = new Date(that.fields.advertising_start_time);
          start_time = start_time.getFullYear()+'-'+(start_time.getMonth()+1)+'-'+start_time.getDate();
          that.$http({
            method: 'post',
            url: '/ad/addsubmit',
            params: {
              goods_category:that.fields.category_id,
              goods_shop_base_id:that.shopId,
              advertising_location:that.fields.advertising_location,
              advertising_name: that.fields.advertising_name,
              advertising_pc_logo:that.fields.advertising_pc_logo,
              advertising_wap_logo:that.fields.advertising_wap_logo,
              advertising_link:that.fields.advertising_link,
              advertising_remark:that.fields.advertising_remark,
              advertising_start_time:start_time,
              advertising_end_time:that.fields.advertising_end_time,
              is_recommend:that.fields.is_recommend            
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '广告添加成功!'
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
              message: '添加失败，请重新提交!'
            });
          });
        }
      },
      onReset () {
        this.formstate._reset();
        this.fields={
          advertising_location:null,
          advertising_name: '',
          advertising_pc_logo:'',
          advertising_wap_logo:'',
          advertising_link:'',
          advertising_remark:'',
          advertising_start_time:'',
          advertising_end_time:''
        }
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.shopId=JSON.parse(window.localStorage.getItem("shopid"));
        this.adList(); 
        this.CatePrent();    //上级分类数据         
      })
    }
  }
</script>
