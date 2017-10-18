<template>
    <div id="WebSite">
        <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title">
                            <h5>全局SEO配置</h5>
                        </div>                        
                        <div class="ibox-content add-user">
                            <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t" id="commentForm">                                              
                                <field class="form-group">
                                    <label class="col-sm-3 control-label">全局标题后缀：</label>
                                    <div class="col-sm-4">                                        
                                        <input type="text" name="seo_title_global" class="form-control" v-model="fields.seo_title_global">
                                    </div>
                                    <span class="f-c-r">小于32字符，超出自动截取</span>
                                </field>
                                <field class="form-group">
                                    <label class="col-sm-3 control-label">全局页面关键词：</label>
                                    <div class="col-sm-4">
                                        <textarea type="text" rows="3" name="seo_keywords_global" v-model="fields.seo_keywords_global" class="form-control">{{fields.seo_keywords_global}}</textarea>
                                    </div>                                    
                                    <span class="f-c-r">小于255字符，超出自动截取</span>
                                </field>
                                <field class="form-group">
                                    <label class="col-sm-3 control-label">全局页面描述：</label>
                                    <div class="col-sm-4">
                                        <textarea type="text" rows="3" name="seo_description_global" v-model="fields.seo_description_global" class="form-control">{{fields.seo_description_global}}</textarea>
                                    </div>
                                    <span class="f-c-r">小于255字符，超出自动截取</span>                             
                                </field>
                                <field class="form-group">
                                    <label class="col-sm-3 control-label">首页标题：</label>
                                    <div class="col-sm-4">                                        
                                        <input type="text" name="seo_title_index" class="form-control" v-model="fields.seo_title_index">
                                    </div>
                                </field>
                                <field class="form-group">
                                    <label class="col-sm-3 control-label">首页关键词：</label>
                                    <div class="col-sm-4">
                                        <textarea type="text" rows="3" name="seo_keywords_index" v-model="fields.seo_keywords_index" class="form-control">{{fields.seo_keywords_index}}</textarea>
                                    </div>                                    
                                </field>
                                <field class="form-group">
                                    <label class="col-sm-3 control-label">首页描述：</label>
                                    <div class="col-sm-4">
                                        <textarea type="text" rows="3" name="seo_description_index" v-model="fields.seo_description_index" class="form-control">{{fields.seo_description_index}}</textarea>
                                    </div>
                                </field>
                              <div class="hr-line-dashed"></div>
                                <div class="form-group draggable ui-draggable">
                                    <div class="col-sm-12 col-sm-offset-3">
                                        <button class="btn btn-primary" type="submit">提交</button>
                                        <button class="btn btn-white m-l-sm" type="reset">重置</button>
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
                            title:'系统设置',
                            url:'/setting/seo'
                        },
                        {
                            title:'SEO设置',
                            url:''
                        }
                    ]
                },                              
                formstate:{},
                fields:{ 
                    seo_title_global:'', 
                    seo_keywords_global:'', 
                    seo_description_global:'', 
                    seo_title_index:'', 
                    seo_keywords_index:'',                     
                    seo_description_index:''
                }
            }
        }, 
        mounted(){          
            this.seoMain()                
        },
        methods:{              
            fieldClassName:function(field){
                if(!field){
                    return '';
                }else if((field.$touched ||field.$submitted) && field.$invalid){
                    return 'error';
                }else if((field.$touched ||field.$submitted) && field.$valid){
                    return 'valid';
                }
            },            
            seoMain(){
                var that = this;
                that.$http({
                          method:'post',
                          url: '/setting_base/seodata'
                        }).then(function (res) {                                            
                            var  fieldList =  res.data.data;
                            if(res.data.error==0){ 
                                that.fields.seo_title_global = fieldList.seo_title_global;
                                that.fields.seo_keywords_global = fieldList.seo_keywords_global;
                                that.fields.seo_description_global = fieldList.seo_description_global;
                                that.fields.seo_title_index = fieldList.seo_title_index;
                                that.fields.seo_keywords_index = fieldList.seo_keywords_index;
                                that.fields.seo_description_index = fieldList.seo_description_index;
                            }else{
                                that.$message({
                                  message: res.data.desc,
                                  type: 'warning'
                                });                         
                            }                                                        
                        }).catch(function (error) {
                            console.log(error);
                        });
            },
            onSubmit:function(){
                var that = this;
                if(this.formstate.$valid){                                                             
                    that.$http({
                          method:'post',
                          url: '/setting_base/seosubmit',
                          params:{
                            'seo_title_global':that.fields.seo_title_global,                    
                            'seo_keywords_global':that.fields.seo_keywords_global,
                            'seo_description_global':that.fields.seo_description_global,
                            'seo_title_index':that.fields.seo_title_index,
                            'seo_keywords_index':that.fields.seo_keywords_index,
                            'seo_description_index':that.fields.seo_description_index
                          }           
                        }).then(function (res) {
                            if(res.data.error==0){
                                that.$message({
                                  message: '更新成功',
                                  type: 'success'
                                });                                
                                that.$router.push('/setting/seo');
                            }else{
                                that.$message({
                                  message: '更新失败',
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

