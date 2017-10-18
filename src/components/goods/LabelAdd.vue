<template>
	<div id="LabelAdd">
		<HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
		<div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title">
                            <h5>添加标签</h5>
                        </div>                        
                        <div class="ibox-content add-user">
                            <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t" id="commentForm" >
                                <validate class="form-group">
                                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>商品分类：</label>
                                    <div class="col-sm-4">
                                    	<input type="hidden" name="category_id" v-model="fields.category_id" required :class="fieldClassName(formstate.category_id)" :dataval="codeid">
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
                                      <!-- <select class="form-control" name="cate_id" v-model="fields.cate_id" required :class="fieldClassName(formstate.cate_id)">
                                            <option :value="null">请选择商品分类</option>
                                            <option v-for="(item,index) in cateList" :value="item.category_id">{{item.category_name}}</option>
                                        </select>
                                        <field-messages name="cate_id" show="$touched ||$submitted" class="form-control-callback">
                                            <div class="valid">Success!</div>
                                            <div slot="required" class="error">请选择商品分类.</div>
                                        </field-messages> -->
                                    </div>
                                </validate>                                
                                <validate class="form-group">
                                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>标签名称：</label>
                                    <div class="col-sm-4">                                        
                                        <input type="text" name="goods_label_name" class="form-control" v-model="fields.goods_label_name" required :class="fieldClassName(formstate.goods_label_name)">
                                        <field-messages name="goods_label_name" show="$touched ||$submitted" class="form-control-callback">
                                            <div class="valid">Success!</div>
                                            <div slot="required" class="error">标签名称不能为空.</div>
                                        </field-messages>
                                    </div>
                                </validate>
                              <div class="hr-line-dashed"></div>
                                <div class="form-group draggable ui-draggable">
                                    <div class="col-sm-12 col-sm-offset-3">
                                    	<button class="btn btn-primary" type="submit">提交</button>
                                        <router-link to="/goods/label" class="btn btn-white m-l-sm">返回列表</router-link>
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
    import {Imgpath,sevUrl} from '../comms/main.js'
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
                            url:'/goods/label'
                        },
                        {
                            title:'标签管理',
                            url:'/goods/label'
                        },
                        {
                            title:'添加',
                            url:''
                        }
		    		]
		    	},                        
                formstate:{},
                cateList:[],                
                cprops:{
                    value:'category_id',
                    label:'category_name'
                }, 
                fields:{
                    category_id:'',
                    goods_label_name:"",                    
                	category_id_str:'',
                }
	    	}
	    }, 
        mounted(){          
            this.CatePrent();    //上级分类数据                  
        },        
        methods:{
            CatePrent() {
                var that = this;                                         
                that.$http({
                      method:'post',
                      url: '/goods_category/listdata'                              
                    }).then(function (res) {                                                                
                        if(res.data.error==0){
                           that.cateList = res.data.data.table_data;    
                        }else{
                            console.log(res.data.desc);                            
                        }                                                        
                    }).catch(function (error) {
                        console.log(error);
                    });
            }, 
            handleChange(value) {
                this.fields.category_id= value[value.length-1];                
                this.fields.category_id_str = value.join(",");                
            },           
            fieldClassName:function(field){
                if(!field){
                    return '';
                }else if((field.$touched ||field.$submitted) && field.$invalid){
                    return 'error';
                }else if((field.$touched ||field.$submitted) && field.$valid){
                    return 'valid';
                }
            },
            onSubmit:function(){
                var that = this;
                if(this.formstate.$valid){                                                             
                    that.$http({
                          method:'post',
                          url: '/goods_label/addsubmit',
                          params:{ 
                            'cate_id':that.fields.cate_id,
                            'goods_label_name':that.fields.attribute_name,                            
                          }           
                        }).then(function (res) {
                            //console.log(res)                                               
                            if(res.data.error==0){
                                that.$message({
                                  message: '添加成功',
                                  type: 'success'
                                }); 
                                that.formstate._reset();
                                that.fields = {
				                    cate_id:'',
				                    goods_label_name:""
				                }

                                //that.$router.push('/goods/label');
                            }else{
                                that.$message({
                                  message: '保存失败',
                                  type: 'error'
                                });                                
                            }                            
                            //console.log(that.cateList)                                  
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