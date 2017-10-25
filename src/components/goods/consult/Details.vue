<template>
	<div id="AnnexDet">
		<HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
		<div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">                     
                        <div class="ibox-content p-m">
                            <div class="hd-title">咨询查看</div>
                            <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t" id="commentForm" >
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">咨询商品：</label>
                                    <div class="col-sm-4 m-t-8">
                                        {{fields.goods_name}}
                                    </div>
                                </div>                                
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">咨询内容：</label>
                                    <div class="col-sm-8 m-t-8">
                                        {{fields. consult_assessment}}
                                    </div>                                    
                                </div>                                
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">咨询用户：</label>
                                    <div class="col-sm-4 m-t-8">
                                        {{fields.consult_user_name}}
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">咨询时间：</label>
                                    <div class="col-sm-4 m-t-8">
                                        {{fields.time_create}}
                                    </div>
                                </div>
                                <div class="form-group" v-if="fields.is_answer==1">
                                    <label class="col-sm-3 control-label">回复内容：</label>
                                    <div class="col-sm-4 m-t-8">
                                        {{fields.answer_assessment}}
                                    </div>
                                </div>
                                <validate class="form-group" v-else>
                                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>回复内容：</label>
                                    <div class="col-sm-5 m-t-8">
                                        <textarea name="answer_assessment" class="form-control" rows="5" v-model="fields.answer_assessment" required :class="fieldClassName(formstate.answer_assessment)">{{fields.answer_assessment}}</textarea>
                                        <field-messages name="answer_assessment" show="$touched || $submitted" class="form-control-callback">
                                            <div slot="required" class="error">回复内容不能为空</div>
                                        </field-messages>
                                    </div>
                                </validate>                                                            
                                <div class="hr-line-dashed"></div>
                                <div class="form-group draggable ui-draggable">
                                    <div class="col-sm-12 col-sm-offset-3">
                                      <!--<button class="btn btn-primary m-r-sm" type="submit" v-if="fields.is_answer==-1">确定</button>
                                      <router-link to="/goods/consult/list" class="btn btn-white">返回列表</router-link>-->
                                        <el-button type="primary" native-type="submit" v-if="fields.is_answer==-1">确定</el-button>
                                        <router-link to="/goods/consult/list" class="white-btn m-l-sm">返回列表</router-link>
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
                            title:'商品咨询',
                            url:'/goods/consult/list'
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
                fields:{
                    consult_id:0,
                    goods_name:'',
                    consult_user_name:'',
                    consult_assessment:'',
                    answer_assessment:'',
                    time_create:'',
                    is_answer:0,                             
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
                          url: '/consult/infodata',
                          params:{ 
                            'consult_id':cid                       
                          }           
                        }).then(function (res) {                                                 
                            var  fieldList =  res.data.data;
                            if(res.data.error==0){
                                that.fields.consult_id = fieldList.consult_id;
                                that.fields.goods_name = fieldList.goods_name;
                                that.fields.consult_user_name = fieldList.consult_user_name;
                                that.fields.consult_assessment = fieldList.consult_assessment;
                                that.fields.is_answer = fieldList.is_answer;
                                that.fields.answer_assessment = fieldList.answer_assessment;
                                that.fields.time_create = fieldList.time_create; 
                            }else{
                                that.$message({
                                    type: 'error',
                                    message: res.data.msg
                                });                           
                            }                                                        
                        }).catch(function (error) {
                            console.log(error);
                        });
            }, 
            onSubmit: function () {
                var that = this;        
                if (this.formstate.$valid) {                 
                  that.$http({
                    method: 'post',
                    url: '/consult/editsubmit',
                    params: {
                      'answer_assessment':that.fields.answer_assessment,
                      'answer_user':JSON.parse(window.localStorage.getItem("userid")),
                      'consult_id':that.fields.consult_id,
                    }
                  }).then(function (res) {            
                    if(res.data.error=='0'){
                      that.$message({
                        type: 'success',
                        message: '提交成功!'
                      });
                      that.$router.push('/goods/consult/list');              
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
