<template>
	<div id="CategoryAdd">
		<HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
		<div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title">
                            <h5>商品添加</h5>
                        </div>                        
                        <div class="ibox-content add-user">
                            <el-tabs v-model="activeName" type="card">
                              <el-tab-pane label="基本信息" name="first">
                                    <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t" id="commentForm" >
                                        <validate class="form-group">
                                            <label class="col-sm-3 control-label"><span class="f-c-r">*</span>所属分类：</label>
                                            <div class="col-sm-4">                                       
                                                <input type="hidden" name="category_id" v-model="fields.category_id" required :class="fieldClassName(formstate.category_id)">
                                                <el-cascader
                                                  placeholder="请选择分类"
                                                  :options="cateList"
                                                  :props="cprops"
                                                  filterable                                                  
                                                  @change="handleChange" 
                                                  change-on-select
                                                ></el-cascader>
                                                <field-messages name="category_id" show="$submitted" class="form-control-callback">
                                                    <div class="valid">Success!</div>
                                                    <div slot="required" class="error">请选择商品分类.</div>
                                                </field-messages>
                                            </div>
                                        </validate>
                                        <validate class="form-group">
                                            <label class="col-sm-3 control-label"><span class="f-c-r">*</span>商品货号：</label>
                                            <div class="col-sm-4">                                        
                                                <input type="text" name="goods_item_num" class="form-control" v-model="fields.goods_item_num" required :class="fieldClassName(formstate.goods_item_num)">
                                                <field-messages name="goods_item_num" show="$touched ||$submitted" class="form-control-callback">
                                                    <div class="valid">Success!</div>
                                                    <div slot="required" class="error">商品货号不能为空.</div>
                                                </field-messages>
                                            </div>
                                        </validate>
                                        <validate class="form-group">
                                            <label class="col-sm-3 control-label"><span class="f-c-r">*</span>商品名称：</label>
                                            <div class="col-sm-4">                                        
                                                <input type="text" name="goods_name" class="form-control" v-model="fields.goods_name" required :class="fieldClassName(formstate.goods_name)">
                                                <field-messages name="goods_name" show="$touched ||$submitted" class="form-control-callback">
                                                    <div class="valid">Success!</div>
                                                    <div slot="required" class="error">商品名称不能为空.</div>
                                                </field-messages>
                                            </div>
                                        </validate>
                                        <validate class="form-group">
                                            <label class="col-sm-3 control-label"><span class="f-c-r">*</span>商品售价：</label>
                                            <div class="col-sm-4">                                        
                                                <input type="number" onmousewheel="return false;" name="goods_price" class="form-control" v-model="fields.goods_price" required :class="fieldClassName(formstate.goods_price)">
                                                <field-messages name="goods_price" show="$touched ||$submitted" class="form-control-callback">
                                                    <div class="valid">Success!</div>
                                                    <div slot="required" class="error">商品售价不能为空.</div>
                                                </field-messages>
                                            </div>
                                        </validate>
                                        <validate class="form-group">
                                            <label class="col-sm-3 control-label"><span class="f-c-r">*</span>市场价：</label>
                                            <div class="col-sm-4">                                        
                                                <input type="number" onmousewheel="return false;" name="price_market" class="form-control" v-model="fields.price_market" required :class="fieldClassName(formstate.price_market)">
                                                <field-messages name="price_market" show="$touched ||$submitted" class="form-control-callback">
                                                    <div class="valid">Success!</div>
                                                    <div slot="required" class="error">市场价不能为空.</div>
                                                </field-messages>
                                            </div>
                                        </validate>
                                        <validate class="form-group">
                                            <label class="col-sm-3 control-label"><span class="f-c-r">*</span>商品成本价：</label>
                                            <div class="col-sm-4">                                        
                                                <input type="number" onmousewheel="return false;" name="price_cost" class="form-control" v-model="fields.price_cost" required :class="fieldClassName(formstate.price_cost)">
                                                <field-messages name="price_cost" show="$touched ||$submitted" class="form-control-callback">
                                                    <div class="valid">Success!</div>
                                                    <div slot="required" class="error">商品成本价不能为空.</div>
                                                </field-messages>
                                            </div>
                                        </validate>
                                        <validate class="form-group">
                                            <label class="col-sm-3 control-label"><span class="f-c-r">*</span>库存预警值：</label>
                                            <div class="col-sm-4">                                        
                                                <input type="number" onmousewheel="return false;" name="warning_line" class="form-control" v-model="fields.warning_line" required :class="fieldClassName(formstate.warning_line)">
                                                <field-messages name="warning_line" show="$touched ||$submitted" class="form-control-callback">
                                                    <div class="valid">Success!</div>
                                                    <div slot="required" class="error">库存预警值不能为空.</div>
                                                </field-messages>
                                            </div>
                                            <span class="f-c-r">当库存少于或等于库存警告设置数量时，后台会提醒，提醒管理员增加库存</span>
                                        </validate>
                                        <div class="form-group">
                                            <label class="col-sm-3 control-label">商品品牌：</label>
                                            <div class="col-sm-4">                                        
                                                <select class="form-control" name="brand_id" v-if="brandList" v-model="fields.brand_id">
                                                    <option :value="0">请选择品牌</option>
                                                    <option v-for="(item,index) in brandList" :value="item.brand_id">{{item.brand_ch_name}}</option>
                                                </select>
                                            </div>                                            
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-3 control-label"><span class="f-c-r">*</span>商品图片：</label>                                 
                                            <validate class="col-sm-2">
                                                <input type="hidden" name="goods_img_url_pc" v-model="fields.goods_img_url_pc" required :class="fieldClassName(formstate.goods_img_url_pc)">
                                                <ul class="imgList clearfix">
                                                    <li v-if="fields.goods_img_url_pc">
                                                      <div class="img-box">
                                                        <img :src="fields.goods_img_url_pc" @click="picChange('pc')">
                                                      </div>
                                                    </li>
                                                    <li class="upload" v-else>
                                                      <a @click="picChange('pc')"><img src="../../assets/img/add.png"></a>
                                                    </li>
                                                </ul>                                                
                                                <span class="picTips">PC端</span>
                                                <field-messages name="goods_img_url_pc" show="$submitted" class="form-control-callback">
                                                    <div class="valid">Success!</div>
                                                    <div slot="required" class="error">图片不能为空.</div>
                                                </field-messages>
                                            </validate>
                                            <validate class="col-sm-2">
                                                <input type="hidden" name="goods_img_url" v-model="fields.goods_img_url" required :class="fieldClassName(formstate.goods_img_url)">
                                                <ul class="imgList clearfix">
                                                    <li v-if="fields.goods_img_url">
                                                      <div class="img-box">
                                                        <img :src="fields.goods_img_url"  @click="picChange('wap')">
                                                      </div>
                                                    </li>
                                                    <li class="upload" v-else>
                                                      <a @click="picChange('wap')"><img src="../../assets/img/add.png"></a>
                                                    </li>
                                                </ul>
                                                <span class="picTips">手机端</span>
                                                <field-messages name="goods_img_url" show="$submitted" class="form-control-callback">
                                                    <div class="valid">Success!</div>
                                                    <div slot="required" class="error">图片不能为空.</div>
                                                </field-messages>
                                            </validate>                                            
                                        </div>
                                        <field class="form-group">
                                            <label class="col-sm-3 control-label">是否为免运费商品：</label>
                                            <div class="col-sm-6">                             
                                                <el-radio class="radio" v-model="fields.is_freight" :label="1">是</el-radio>
                                                <el-radio class="radio" v-model="fields.is_freight" :label="0">否</el-radio>                                      
                                            </div>
                                        </field>
                                        <validate class="form-group" v-if="fields.is_freight==0">
                                            <label class="col-sm-3 control-label"><span class="f-c-r">*</span>运费模板：</label>
                                            <div class="col-sm-4">
                                                <select class="form-control" name="freight_framker" v-model="fields.freight_framker" required :class="fieldClassName(formstate.freight_framker)">
                                                    <option :value="null">请选择运费模板</option>
                                                    <option v-for="(item,index) in freightTemp" :value="item.id">{{item.templet_name}}</option>
                                                </select>
                                                <field-messages name="freight_framker" show="$touched ||$submitted" class="form-control-callback">
                                                    <div class="valid">Success!</div>
                                                    <div slot="required" class="error">请选择运费模板.</div>
                                                </field-messages>
                                            </div>
                                        </validate>
                                        <!-- <validate class="form-group" v-if="fields.is_freight==0">
                                            <label class="col-sm-3 control-label"><span class="f-c-r">*</span>商品运费：</label>
                                            <div class="col-sm-4">                                        
                                                <input type="number" onmousewheel="return false;" name="goods_freight" class="form-control" v-model="fields.goods_freight" 
                                                pattern="([1-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])"
                                                required :class="fieldClassName(formstate.goods_freight)">
                                                <span class="units">元</span>
                                                <field-messages name="goods_freight" show="$touched ||$submitted" class="form-control-callback">
                                                    <div class="valid">Success!</div>
                                                    <div slot="required" class="error">商品运费不能为空.</div>
                                                    <div slot="pattern" class="error">商品运费不能为0.</div>
                                                </field-messages>
                                            </div>
                                        </validate> -->
                                        <field class="form-group">
                                            <label class="col-sm-3 control-label">商品重量：</label>
                                            <div class="col-sm-4">
                                                <input type="number" onmousewheel="return false;" name="goods_weight" class="form-control" v-model="fields.goods_weight">
                                                <span class="units">g</span>
                                            </div>
                                        </field>
                                        <field class="form-group">
                                            <label class="col-sm-3 control-label">排序：</label>
                                            <div class="col-sm-4">
                                                <input type="warning_line" name="sort" class="form-control" v-model="fields.sort">
                                            </div>
                                        </field>
                                        <div class="form-group">
                                            <label class="col-sm-3 control-label">购买模式：</label>
                                            <div class="col-sm-6 m-t-8">
                                                <el-checkbox v-model="fields.goods_retail">零售</el-checkbox>
                                                <el-checkbox v-model="fields.goods_wholesale">批发</el-checkbox>
                                            </div>
                                        </div>
                                        <validate class="form-group">
                                            <label class="col-sm-3 control-label"><span class="f-c-r">*</span>商品描述：</label>
                                            <div class="col-sm-6">
                                                <textarea type="text" rows="5" name="goods_subtitle" v-model="fields.goods_subtitle" class="form-control" required :class="fieldClassName(formstate.goods_subtitle)">{{fields.goods_subtitle}}</textarea>
                                                <field-messages name="goods_subtitle" show="$touched ||$submitted" class="form-control-callback">
                                                    <div class="valid">Success!</div>
                                                    <div slot="required" class="error">商品描述不能为空.</div>
                                                </field-messages>
                                            </div>
                                        </validate>                                        
                                        <div class="form-group">
                                            <label class="col-sm-3 control-label">是否上架：</label>
                                            <div class="col-sm-6">                            
                                                <el-radio class="radio" v-model="fields.goods_isonline" :label="1">是</el-radio>
                                                <el-radio class="radio" v-model="fields.goods_isonline" :label="-1">否</el-radio>                                      
                                            </div>
                                        </div>
                                        <div class="form-group">
                                            <label class="col-sm-3 control-label">商品详情：</label>
                                            <div class="col-sm-9">
                                                <script id="editor" ref="editor" type="text/plain" style="width:100%;height:200px;"></script>
                                            </div>
                                        </div>
                                      <div class="hr-line-dashed"></div>
                                        <div class="form-group draggable ui-draggable">
                                            <div class="col-sm-12 col-sm-offset-3">
                                                <button class="btn btn-primary" type="submit">提交</button>
                                                <router-link to="/goods/list" class="btn btn-white m-l-sm">返回</router-link>                                        
                                            </div>  
                                        </div>
                                    </vue-form>
                              </el-tab-pane>
                                <el-tab-pane label="规格信息" name="second" :disabled="true">
                                </el-tab-pane>
                                <el-tab-pane label="SEO信息" name="third" :disabled="true">
                                </el-tab-pane>
                            </el-tabs>                            
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
    import '../../../static/UEditor/ueditor.config' 
    import '../../../static/UEditor/ueditor.all'; 
    import '../../../static/UEditor/lang/zh-cn/zh-cn';
	import HjCrumb from '../comms/BreadCrumb.vue'    
    import {Imgpath,sevUrl,CustomFun} from '../comms/main.js'
    import PicLlibrary from '../comms/PicLlibrary.vue'
    import {mapGetters,mapActions} from 'vuex'   
	export default{
		components:{
	      HjCrumb,
          PicLlibrary
	    },
	    data(){
	    	return{
	    		CrumbBox:{
	    			CrumbList:
		    		[
			    		{
                            title:'商品中心',
                            url:'/goods/list'
                        },
                        {
                            title:'商品管理',
                            url:'/goods/list'
                        },
                        {
                            title:'商品添加',
                            url:''
                        }
		    		]
		    	},
                activeName: 'first',
                activeName2: 'first',
                Imgpath:Imgpath,
                dialogPic:false,
                ptype:'',
                uploadPic:'',
                webLinkPic:'',
                galleryPic:'',
                sevUrl:sevUrl,               
                formstate:{},
                formstate2:{},
                cateList:[],                
                brandList:[],
                category_id:0,
                category_id_str:'',
                cprops:{
                    value:'category_id',
                    label:'category_name'
                },
                usermsg:{
                    'token_admin':JSON.parse(window.localStorage.getItem('access_token')),
                    'admin_id':JSON.parse(window.localStorage.getItem('userid'))
                },               
                fields:{
                    category_id_f:0,
                    category_id:null,
                    category_id_str:'',
                    brand_id:0,
                    goods_name:'',
                    goods_img_url:'',
                    goods_img_url_pc:'',
                    goods_weight:0,
                    goods_item_num:'',
                    goods_base_id:"",
                    goods_code:"",
                    goods_store_nums:0,                    
                    sort:0,
                    goods_isonline:1,
                    warning_line:0,
                    goods_price:0,
                    price_market:0,
                    price_cost:0,
                    goods_desc:'',
                    goods_subtitle:'',
                    pro_desc:'',
                    is_freight:0,
                    //goods_freight:0,
                    goods_wholesale:false,
                    goods_retail:false,
                    freight_framker:null                              
                },
                freightTemp:[],
                ue: ''               
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
            this.CatePrent();
            this.freightList();   
            this.ue = UE.getEditor(this.$refs.editor.id,{ 
                BaseUrl: '', 
                UEDITOR_HOME_URL: '/static/UEditor/', 
                 //toolbars:[['FullScreen', 'Source', 'Undo', 'Redo','Bold','test']] 
                 toolbars:[  
                    ['source', '|', 'undo', 'redo', '|',  
                        'bold', 'italic', 'underline', 'fontborder', 'strikethrough', 'superscript', 'subscript', 'removeformat', 'pasteplain', '|', 'forecolor', 'backcolor', 'lineheight', '|',  
                        'paragraph', 'fontfamily', 'fontsize', '|',  
                        'indent', '|',  
                        'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|',   
                        'link', 'unlink', 'anchor', '|', 'imagenone', 'imageleft', 'imageright', 'imagecenter','map', '|',  
                        'insertimage', 'insertvideo', 'attachment', '|',  
                        'horizontal', '|',  
                        'inserttable', 'deletetable', 'insertparagraphbeforetable', 'insertrow', 'deleterow', 'insertcol', 'deletecol', 'mergecells', 'mergeright', 'mergedown', 'splittocells', 'splittorows', 'splittocols', '|',  
                        'preview', 'searchreplace','drafts']  
                ]
            });

        },
        destroyed() {
            this.ue.destroy();
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
            Brands() {//品牌列表
                var that = this;                                         
                that.$http({
                      method:'post',
                      url: '/goods_brand/listdata',
                      params:{
                        'category_id':parseInt(that.fields.category_id_f)
                      }                                 
                    }).then(function (res) {                                                                
                        if(res.data.error==0){
                           that.brandList = res.data.data.table_data;    
                        }else{
                            that.$message({
                              message: '品牌'+res.data.desc,
                              type: 'warning'
                            });
                            //console.log(res.data.desc);                           
                        }                                                         
                    }).catch(function (error) {
                        console.log(error);
                    });
            },
            freightList() {//运费模板
                var that = this;                                         
                that.$http({
                      method:'post',
                      url: '/freight_temp/getList',
                      params:{
                        'shop_id':JSON.parse(window.localStorage.getItem("shopid"))
                      }                                 
                    }).then(function (res) {                                  
                        if(res.data.error==0){
                           that.freightTemp = res.data.data;    
                        }else{
                            that.$message({
                              message: '运费模板'+res.data.desc,
                              type: 'warning'
                            });                          
                        }                                                         
                    }).catch(function (error) {
                        console.log(error);
                    });
            },                 
            CatePrent() {//分类列表
                var that = this;                                         
                that.$http({
                      method:'post',
                      url: '/goods_category/listdata'                            
                    }).then(function (res) {                                                                
                        if(res.data.error==0){
                           that.cateList = res.data.data.table_data;   
                        }else{
                            that.$message({
                              message: '商品分类'+res.data.desc,
                              type: 'warning'
                            });                            
                        }                                                         
                    }).catch(function (error) {
                        console.log(error);
                    });
            },
            picChange(ptype){
                this.ptype = ptype;            
                this.dialogPic = true;                
                this.uploadPic = '';
                this.webLinkPic = '';
                this.galleryPic='';         
            },
            SureBtn(){//弹窗确定
                var ind = this.dialogInd;                
                if(this.activeName2 == "first"){
                    if(this.uploadPic != ""){
                        if(this.ptype =="pc"){
                            this.fields.goods_img_url_pc = this.uploadPic;     
                        }else{
                            this.fields.goods_img_url = this.uploadPic;                            
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
                            this.fields.goods_img_url_pc = this.galleryPic; 
                        }else{
                            this.fields.goods_img_url = this.galleryPic;
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
                        //console.log(this.CheckUrl(str))                        
                        if(this.CheckUrl(str)){
                            if(this.ptype =="pc"){
                                this.fields.goods_img_url_pc = this.webLinkPic;                       
                            }else{
                                this.fields.goods_img_url = this.webLinkPic;
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
            handleChange(value) {//选择分类
                this.fields.category_id= value[value.length-1];
                this.fields.category_id_f= value[0];
                this.fields.category_id_str = value.join(",");
                this.Brands();               
            },
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
            onSubmit:function(){//提交
                this.fields.goods_desc = UE.getEditor('editor').getContent();                 
                var that = this;
                if(this.formstate.$valid){                                                                        
                    that.$http({
                          method:'post',
                          url: '/goods/addsubmit',
                          params:{ 
                            'category_id':that.fields.category_id,
                            'category_id_str':that.fields.category_id_str,
                            'brand_id':that.fields.brand_id,
                            'goods_name':that.fields.goods_name,
                            'goods_img_url':that.fields.goods_img_url,
                            'goods_img_url_pc':that.fields.goods_img_url_pc,
                            'goods_weight':that.fields.goods_weight,
                            'goods_item_num':that.fields.goods_item_num,
                            'is_online':that.fields.goods_isonline,
                            'warning_line':that.fields.warning_line,
                            'goods_price':that.fields.goods_price,
                            'goods_sort':that.fields.sort,
                            'price_market':that.fields.price_market,
                            'price_cost':that.fields.price_cost,
                            'goods_desc':that.fields.goods_desc,
                            'goods_subtitle':that.fields.goods_subtitle,
                            'is_freight':that.fields.is_freight,
                            //'goods_freight':that.fields.goods_freight,
                            'freight_framker':that.fields.freight_framker,
                            'goods_examine':1,//无需审核
                            'goods_wholesale':that.fields.goods_wholesale==false?-1:1,
                            'goods_retail':that.fields.goods_retail==false?-1:1,
                            'shop_id':JSON.parse(window.localStorage.getItem('shopid'))
                          }           
                        }).then(function (res) {
                            //console.log(res)                                               
                            if(res.data.error==0){
                                that.$message({
                                  message: '添加成功',
                                  type: 'success'
                                });
                                that.$router.push('/goods/list/edit/'+res.data.data); 
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
<style scoped>
    .el-cascader{width: 100%}
</style>