<template>
	<div id="SkuEdit">
		<HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
		<div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-content p-m">
                            <div class="hd-title">编辑规格</div>
                            <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t" id="commentForm">
                                <validate class="form-group">
                                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>规格名称：</label>
                                    <div class="col-sm-4">
                                        <input type="text" name="goods_sku_name" class="form-control" v-model="fields.goods_sku_name" required :class="fieldClassName(formstate.goods_sku_name)">
                                        <field-messages name="goods_sku_name" show="$touched ||$submitted" class="form-control-callback">
                                            <div class="valid">Success!</div>
                                            <div slot="required" class="error">规格名称不能为空.</div>
                                        </field-messages>
                                    </div>
                                </validate>
                                <field class="form-group">
                                    <label class="col-sm-3 control-label">显示方式：</label>
                                    <div class="col-sm-6">
                                        <div class="r-state">
                                            <el-radio class="radio" v-model="fields.goods_sku_type" label="1">文字</el-radio>
                                            <el-radio class="radio" v-model="fields.goods_sku_type" label="2">图片</el-radio>
                                            <el-radio class="radio" v-model="fields.goods_sku_type" label="3">文字+图片</el-radio>
                                        </div>
                                    </div>
                                </field>
                                <field class="form-group">
                                    <label class="col-sm-3 control-label">显示状态：</label>
                                    <div class="col-sm-6">
                                        <div class="r-state">
                                            <el-radio class="radio" v-model="fields.delete_status" :label="1">已启用</el-radio>
                                            <el-radio class="radio" v-model="fields.delete_status" :label="0">未启用</el-radio>
                                            <el-radio class="radio" v-model="fields.delete_status" :label="-1">已禁用</el-radio>
                                        </div>
                                    </div>
                                </field>
                                <field class="form-group">
                                    <label class="col-sm-3 control-label">备注：</label>
                                    <div class="col-sm-4">
                                        <textarea type="text" rows="5" name="photo_desc" v-model="fields.description" class="form-control">{{fields.description}}</textarea>
                                    </div>
                                </field>
                                <div class="table-responsive clearfix">
                                	<div class="hd-title">规格值</div>
	                                <table class="table table-bordered table-hover">
	                                    <thead>
	                                        <tr>
	                                            <th class="text-center">规格值名称</th>
	                                            <th class="text-center" v-if="fields.goods_sku_type!='1'">规格图片</th>
	                                            <th class="text-center">排序</th>
	                                            <th class="text-center" >操作</th>
	                                        </tr>
	                                    </thead>
	                                    <tbody>
	                                        <tr v-for="(item,index) in skuList" :key="index">
	                                            <td class="text-center"><input type="text" v-model="skuList[index].sku_value" class="w150"></td>
	                                            <td class="text-center" v-if="fields.goods_sku_type!='1'"><img v-if="skuList[index].img_url" :src="skuList[index].img_url" @click="picChange(index)" class="listImg"/><a @click="picChange(index)" v-else>选择图片</a></td>
	                                            <td class="text-center"><input type="number" onmousewheel="return false;" class="w100" v-model="skuList[index].sort"></td>
	                                            <td class="text-center">
													<a  class="single-opt" @click="delItem(index)" title="删除">删除</a>
	                                            </td>
	                                        </tr>
	                                    </tbody>
	                                </table>
	                                <!--<button type="button" class="btn btn-m btn-primary" @click="addSku">添加规格值</button>-->
                                    <el-button type="primary" @click="addSku">添加规格值</el-button>
	                        	</div>
                              <div class="hr-line-dashed"></div>
                                <div class="form-group draggable ui-draggable">
                                    <div class="col-sm-12 col-sm-offset-3">
                                    	<!--<button class="btn btn-primary" type="submit">提交</button>
                                        <router-link to="/goods/sku" class="btn btn-white m-l-sm">返回列表</router-link>-->
                                        <el-button type="primary" native-type="submit">提交</el-button>
                                        <router-link to="/goods/sku" class="white-btn m-l-sm">返回列表</router-link>
                                    </div>
                                </div>
                            </vue-form>
                      </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="选择图片" :visible.sync="dialogPic">
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
                <PicLlibrary v-if="activeName=='second'"></PicLlibrary>
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
		                  url:'/goods/sku'
		              },
		              {
		                  title:'规格管理',
		                  url:'/goods/sku'
		              },
		              {
		                  title:'编辑',
		                  url:''
		              }
				    ]
		    	},
				dialogPic:false,
                activeName:'first',
				Imgpath:Imgpath,
				sevUrl:sevUrl,
				formstate:{},
				skuList:[],
				dialogInd:0,
				uploadPic:'',
				webLinkPic:'',
				galleryPic:'',
				usermsg:{
				  'token_admin':JSON.parse(window.localStorage.getItem('access_token')),
				  'admin_id':JSON.parse(window.localStorage.getItem('userid'))
				},
				fields:{
                    goods_sku_id:0,
                    goods_sku_name:"",
                    goods_sku_type:'',
                    delete_status:'',
                    description:""
				}
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
            this.ListInfo(this.$route.params.id);
        },
        methods:{
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
            addSku(){
            	this.skuList.push({
                    sku_value:"",
                    img_url:"",
                    sort:0
                 });
            },
            ListInfo(cid){
                var that = this;
                that.$http({
                          method:'post',
                          url: '/goods_sku/infodata',
                          params:{
                            'goods_sku_id':cid
                          }
                        }).then(function (res) {
                            var  DataList =  res.data.data;
                            console.log(DataList)
                            if(res.data.error==0){
                                that.fields.goods_sku_id = cid;
                                that.fields.goods_sku_name = DataList.goods_sku_name;
                                that.fields.goods_sku_type = DataList.goods_sku_type;
                                that.fields.delete_status = DataList.delete_status;
                                that.fields.description = DataList.description;
                                that.skuListInfo(that.fields.goods_sku_id);
                            }else{
                                this.$message.error(res.data.desc);
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
            },
            skuListInfo(sid){
                var that = this;
                that.$http({
                          method:'post',
                          url: '/goods_sku/infolistdata',
                          params:{
                            'goods_sku_id':sid
                          }
                        }).then(function (res) {
                            var  DataList =  res.data.data.table_data;
                            //console.log(DataList)
                            if(res.data.error==0){
                                that.skuList=[];
                                for(var i=0;i<DataList.length;i++){
                                    that.skuList.push({
                                        sku_value:DataList[i].sku_value,
                                        img_url:DataList[i].img_url,
                                        sort:DataList[i].sort
                                     });
                                }
                            }else{
                                this.$message.error(res.data.desc);
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
            },
            delItem:function(index){
            	this.$confirm('确认删除此信息吗？', '提示', {
		          confirmButtonText: '确认',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          this.skuList.splice(index, 1);
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });
		        });

            },
            picChange(index){
                this.dialogPic = true;
                this.dialogInd = index;
                this.uploadPic = ''
                this.webLinkPic = ''
                this.galleryPic = ''
            },
            SureBtn(){
                var ind = this.dialogInd;
                if(this.activeName == "first"){
                    if(this.uploadPic != ""){
                        this.skuList[ind].img_url = this.uploadPic;
                        this.dialogPic = false;
                    }else{
                        this.$message({
                          message: '请选择文件后再上传',
                          type: 'warning'
                        });
                    }
                }else if(this.activeName == "second"){
                    if(this.galleryPic != ""){
                        this.skuList[ind].img_url = this.galleryPic;
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
                            this.skuList[ind].img_url = this.webLinkPic;
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
            onSubmit:function(){
                var that = this;
                if(this.formstate.$valid){
                    that.$http({
                          method:'post',
                          url: '/goods_sku/editsubmit',
                          params:{
                            'goods_sku_id':that.fields.goods_sku_id,
                            'goods_sku_name':that.fields.goods_sku_name,
                            'goods_sku_type':that.fields.goods_sku_type,
                            'delete_status':that.fields.delete_status,
                            'description':that.fields.description
                          }
                        }).then(function (res) {
                            if(res.data.error==0){
                                that.fields.goods_sku_id =  res.data.data
                                that.$http({
                                  method:'post',
                                  url: '/goods_sku/keyeditsubmit',
                                  params:{
                                    'goods_sku_id':that.fields.goods_sku_id,
                                    'goodsSkuArr':JSON.stringify(that.skuList)
                                  }
                                }).then(function (res) {
                                    if(res.data.error==0){
                                        that.$message({
                                          message: '更新成功',
                                          type: 'success'
                                        });
                                    }else{
                                        that.$message({
                                          message: res.data.desc,
                                          type: 'error'
                                        });
                                    }
                                }).catch(function (error) {
                                    console.log(error);
                                });
                            }else{
                                that.$message({
                                  message: res.data.desc,
                                  type: 'error'
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
