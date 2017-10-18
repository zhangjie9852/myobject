<template>
	<div id="AttributeAdd">
		<HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
		<div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title">
                            <h5>添加属性</h5>
                        </div>                        
                        <div class="ibox-content add-user">
                            <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t" id="commentForm" >
                                <validate class="form-group">
                                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>商品分类：</label>
                                    <div class="col-sm-4">
                                      <select class="form-control" name="cate_id" v-model="fields.cate_id" required :class="fieldClassName(formstate.cate_id)">
                                            <option :value="null">请选择商品分类</option>
                                            <option v-for="(item,index) in cateList" :value="item.category_id">{{item.category_name}}</option>
                                        </select>
                                        <field-messages name="cate_id" show="$touched ||$submitted" class="form-control-callback">
                                            <div class="valid">Success!</div>
                                            <div slot="required" class="error">请选择商品分类.</div>
                                        </field-messages>
                                    </div>
                                </validate>                                
                                <validate class="form-group">
                                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>属性名称：</label>
                                    <div class="col-sm-4">                                        
                                        <input type="text" name="attribute_name" class="form-control" v-model="fields.attribute_name" required :class="fieldClassName(formstate.attribute_name)">
                                        <field-messages name="attribute_name" show="$touched ||$submitted" class="form-control-callback">
                                            <div class="valid">Success!</div>
                                            <div slot="required" class="error">属性名称不能为空.</div>
                                        </field-messages>
                                    </div>
                                </validate>                                                 
                                <field class="form-group">
                                    <label class="col-sm-3 control-label">属性状态：</label>
                                    <div class="col-sm-6">
                                        <div class="r-state">
                                            <input type="radio" class="i-checks" name="status_attribute" v-model="fields.status_attribute" value="true">
                                            <label for="normal">开启</label>
                                        </div>
                                        <div class="r-state">
                                            <input type="radio" class="i-checks" name="status_attribute" v-model="fields.status_attribute" value="false">
                                            <label for="r_close">关闭</label>
                                        </div>
                                    </div>
                                </field>
                              <div class="hr-line-dashed"></div>
                                <div class="form-group draggable ui-draggable">
                                    <div class="col-sm-12 col-sm-offset-3">
                                    	<button class="btn btn-primary" type="submit">提交</button>
                                        <router-link to="/goods/attribute" class="btn btn-white m-l-sm">返回列表</router-link>
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
                            url:'/goods/attribute'
                        },
                        {
                            title:'商品配置',
                            url:'/goods/attribute'
                        },
                        {
                            title:'属性添加',
                            url:''
                        }
		    		]
		    	}, 
                pageError:false,         
                formstate:{},
                cateList:[], 
                fields:{
                    cate_id:100,
                    attribute_name:"",
                    status_attribute:true
                }
	    	}
	    }, 
        mounted(){          
            this.CatePrent();    //上级分类数据                  
        },
        updated(){
            if(this.pageError){                            
                this.CatePrent();
            }           
        },
        methods:{
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
                            console.log(res.data.desc);
                            that.pageError = true;
                        } 
                        //console.log(that.cateList)                                  
                    }).catch(function (error) {
                        console.log(error);
                    });
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
                          url: '/goods_attribute/addsubmit',
                          params:{ 
                            'cate_id':that.fields.cate_id,
                            'attribute_name':that.fields.attribute_name,
                            'status_attribute':that.fields.status_attribute
                          }           
                        }).then(function (res) {
                            console.log(res)                                               
                            if(res.data.error==0){
                                that.$message({
                                  message: '添加成功',
                                  type: 'success'
                                });                                
                                that.$router.push('/goods/attribute');
                            }else{
                                that.$message({
                                  message: '保存失败',
                                  type: 'warning'
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
