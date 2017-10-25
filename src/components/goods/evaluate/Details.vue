<template>
	<div id="AnnexDet">
		<HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
		<div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-content p-m">
                            <div class="hd-title">评论详情</div>
                            <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal form-detail">
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">评论用户：</label>
                                    <div class="col-sm-4 control-info">
                                        {{fields.user_name}}
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">评论商品：</label>
                                    <div class="col-sm-8 control-info">
                                        {{fields.goods_name}}
                                    </div>
                                </div>
                                <div class="form-group clearfix">
                                    <label class="col-sm-3 control-label">评论内容：</label>
                                    <div class="col-sm-8 control-info">
                                        <div>{{fields.goods_assessment}}</div>
                                        <!--<ul class="imgList clearfix">
                                            <li v-if="fields.goods_pic1!=''&&fields.goods_pic1!=null">
                                                <div class="img-box">
                                                    <img :src="fields.goods_pic1" @click="openPic(fields.goods_pic1)">
                                                </div>
                                            </li>
                                            <li v-if="fields.goods_pic2!=''&&fields.goods_pic2!=null">
                                                <div class="img-box">
                                                    <img :src="fields.goods_pic2" @click="openPic(fields.goods_pic2)">
                                                </div>
                                            </li>
                                            <li v-if="fields.goods_pic3!=''&&fields.goods_pic3!=null">
                                                <div class="img-box">
                                                    <img :src="fields.goods_pic3" @click="openPic(fields.goods_pic3)">
                                                </div>
                                            </li>
                                            <li v-if="fields.goods_pic4!=''&&fields.goods_pic4!=null">
                                                <div class="img-box">
                                                    <img :src="fields.goods_pic4" @click="openPic(fields.goods_pic4)">
                                                </div>
                                            </li>
                                            <!-- <li v-for="(item,index) in fields.fileList">
                                                <div class="img-box">
                                                    <img :src="item.img_url">
                                                </div>
                                            </li> -->
                                        <!---</ul>-->
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">晒图：</label>
                                    <div class="col-sm-8 control-info">
                                        <ul class="imgList clearfix">
                                            <li v-if="fields.goods_pic1!=''&&fields.goods_pic1!=null">
                                                <div class="img-box">
                                                    <img :src="fields.goods_pic1" @click="openPic(fields.goods_pic1)">
                                                </div>
                                            </li>
                                            <li v-if="fields.goods_pic2!=''&&fields.goods_pic2!=null">
                                                <div class="img-box">
                                                    <img :src="fields.goods_pic2" @click="openPic(fields.goods_pic2)">
                                                </div>
                                            </li>
                                            <li v-if="fields.goods_pic3!=''&&fields.goods_pic3!=null">
                                                <div class="img-box">
                                                    <img :src="fields.goods_pic3" @click="openPic(fields.goods_pic3)">
                                                </div>
                                            </li>
                                            <li v-if="fields.goods_pic4!=''&&fields.goods_pic4!=null">
                                                <div class="img-box">
                                                    <img :src="fields.goods_pic4" @click="openPic(fields.goods_pic4)">
                                                </div>
                                            </li>
                                            </ul>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">评论时间：</label>
                                    <div class="col-sm-4 control-info">
                                        {{fields.time_create}}
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">评论等级：</label>
                                    <div class="col-sm-4 eva-start">
                                        <i class="fa fa-star" v-for="item in fields.star"></i>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">IP地址：</label>
                                    <div class="col-sm-4 control-info">
                                        {{fields.ip}}
                                    </div>
                                </div>
                                <div class="form-group" v-if="fields.is_assess==1">
                                    <label class="col-sm-3 control-label">回复内容：</label>
                                    <div class="col-sm-4 control-info">
                                        {{fields.answer_content}}
                                    </div>
                                </div>
                                <validate class="form-group" v-else>
                                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span> 回复内容：</label>
                                    <div class="col-sm-5 m-t-xs control-info">
                                        <textarea name="answer_content" class="form-control" rows="5" v-model="fields.answer_content" required :class="fieldClassName(formstate.answer_content)">{{fields.answer_content}}</textarea>
                                        <field-messages name="answer_content" show="$touched || $submitted" class="form-control-callback">
                                            <div slot="required" class="error">回复内容不能为空</div>
                                        </field-messages>
                                    </div>
                                </validate>
                                <div class="hr-line-dashed"></div>
                                <div class="form-group draggable ui-draggable">
                                    <div class="col-sm-12 col-sm-offset-3">
                                      <!--<button class="btn btn-primary m-r-sm" type="submit" v-if="fields.is_assess!=1">确定</button>
                                      <router-link to="/goods/evaluate/list" class="btn btn-white">返回列表</router-link>-->
                                      <el-button type="primary" native-type="submit" v-if="fields.is_assess!=1">确定</el-button>
                                      <router-link to="/goods/evaluate/list" class="white-btn m-l-sm">返回列表</router-link>
                                    </div>
                                </div>
                            </vue-form>
                      </div>
                    </div>
                </div>
            </div>
        </div>
<!-- 图片放大 -->
        <el-dialog title="图片放大" :visible.sync="dialogPic">
            <div class="bigPic">
                <img :src="bigPic">
            </div>
        </el-dialog>
	</div>
</template>
<script>
	import HjCrumb from '../../comms/BreadCrumb.vue'
    import {Imgpath,sevUrl} from '../../comms/main.js'
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
                            url:'/goods/list'
                        },
                        {
                            title:'商品管理',
                            url:'/goods/list'
                        },
                        {
                            title:'用户评论',
                            url:'/goods/evaluate/list'
                        },
                        {
                            title:'查看详情',
                            url:''
                        }
		    		]
		    	},
                formstate:{},
                Imgpath:Imgpath,
                sevUrl:sevUrl,
                dialogPic:false,
                bigPic:'',
                fields:{
                    assessment_id:0,
                    goods_name:'',
                    answer_content:'',
                    answer_user_name:'',
                    goods_assessment:'',
                    ip:'',
                    star:null,
                    fileList:[],
                    time_create:'',
                    user_name:'',
                    goods_pic1:'',
                    goods_pic2:'',
                    goods_pic3:'',
                    goods_pic4:'',
                    is_assess:-1
                }
	    	}
	    },
        mounted(){
            this.EditList(this.$route.params.id)
        },
        methods:{
            fieldClassName: function (field) {
                if (!field) {
                  return '';
                } else if ((field.$touched || field.$submitted) && field.$invalid) {
                  return 'error';
                }
            },
            EditList(cid){
                var that = this;
                that.$http({
                          method:'post',
                          url: '/assessment/infodata',
                          params:{
                            'assessment_id':cid
                          }
                        }).then(function (res) {
                            var  fieldList =  res.data.data;
                            if(res.data.error==0){
                                that.fields.assessment_id = fieldList.assessment_id;
                                that.fields.goods_name = fieldList.goods_name;
                                that.fields.answer_content = fieldList.answer_content;
                                that.fields.answer_user_name = fieldList.answer_user_name;
                                that.fields.goods_assessment = fieldList.goods_assessment;
                                that.fields.ip = fieldList.ip;
                                that.fields.time_create = fieldList.time_create;
                                that.fields.star = fieldList.star;
                                that.fields.user_name = fieldList.user_name;
                                that.fields.is_assess = fieldList.is_assess;
                                that.fields.goods_pic1 = fieldList.goods_pic1;
                                that.fields.goods_pic2 = fieldList.goods_pic2;
                                that.fields.goods_pic3 = fieldList.goods_pic3;
                                that.fields.goods_pic4 = fieldList.goods_pic4;
                            }else{
                                console.log(res.data.desc)
                            }
                        }).catch(function (error) {
                            console.log(error);
                        });
            },
            openPic:function(url){
                this.dialogPic=true;
                this.bigPic = url;
            },
            onSubmit: function () {
                var that = this;
                if (this.formstate.$valid) {
                  that.$http({
                    method: 'post',
                    url: '/assessment/editsubmit',
                    params: {
                      'answer_content':that.fields.answer_content,
                      'answer_user_id':JSON.parse(window.localStorage.getItem("userid")),
                      'assessment_id':that.fields.assessment_id,
                      'is_show':1
                    }
                  }).then(function (res) {
                    if(res.data.error=='0'){
                      that.$message({
                        type: 'success',
                        message: '提交成功!'
                      });
                      that.$router.push('/goods/evaluate/list');
                    }else{
                      that.$message({
                        type: 'error',
                        message: res.data.desc
                      });
                    }
                  }).catch(function (error) {
                    that.$message({
                      type: 'error',
                      message: '提交失败，请重新提交!'
                    });
                  });
                }
              }
        }
	}
</script>
<style>
    .eva-start{font-size: 18px; color: #FF9000}
    .eva-start i{margin-right: 5px;}
</style>
