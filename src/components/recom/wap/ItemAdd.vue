<template>
    <div id="RecomWapAdd">
        <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
        <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">                        
                        <div class="ibox-content p-m">
                            <el-tabs v-model="activeName" type="card">
                                <el-tab-pane label="设置" name="first">
                                <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t" id="commentForm">                                                                
                                    <validate class="form-group">
                                        <label class="col-sm-3 control-label"><span class="f-c-r">*</span>推荐栏目标识：</label>
                                        <div class="col-sm-4">                                        
                                            <input type="text" name="recmd_item_label" class="form-control" v-model="fields.recmd_item_label" required :class="fieldClassName(formstate.recmd_item_label)">
                                            <field-messages name="recmd_item_label" show="$touched ||$submitted" class="form-control-callback">
                                                <div class="valid">Success!</div>
                                                <div slot="required" class="error">推荐栏目标识不能为空.</div>
                                            </field-messages>
                                        </div>
                                    </validate>
                                    <validate class="form-group">
                                        <label class="col-sm-3 control-label"><span class="f-c-r">*</span>投放频道：</label>
                                        <div class="col-sm-4">
                                          <!--<select class="form-control" name="recmd_item_channel" v-model="fields.recmd_item_channel" required :class="fieldClassName(formstate.recmd_item_channel)">
                                                <option :value="null">请选择投放频道</option>
                                                <option value="1">首页</option>
                                                <option value="2">列表</option>
                                                <option value="3">详情</option>
                                            </select>-->
                                            <el-select name="recmd_item_channel" v-model="fields.recmd_item_channel" required :class="fieldClassName(formstate.recmd_item_channel)">
                                              <el-option :key="null" label="请选择投放频道" :value="null"></el-option>
                                              <!--<template v-for="item in freightTemp">
                                                <el-option :key="item.id" :label="item.templet_name" :value="item.id"></el-option>
                                              </template>-->
                                              <el-option :key="1" label="首页" :value="1"></el-option>
                                              <el-option :key="2" label="列表" :value="2"></el-option>
                                              <el-option :key="3" label="详情  " :value="3"></el-option>
                                            </el-select>
                                            <field-messages name="recmd_item_channel" show="$touched ||$submitted" class="form-control-callback">
                                                <div class="valid">Success!</div>
                                                <div slot="required" class="error">请选择投放频道.</div>
                                            </field-messages>
                                        </div>
                                    </validate>
                                    <validate class="form-group">
                                        <label class="col-sm-3 control-label"><span class="f-c-r">*</span>数据最大条数：</label>
                                        <div class="col-sm-4">                                        
                                            <input type="number" onmousewheel="return false;" name="recmd_item_max" class="form-control" min="1" max="10" v-model="fields.recmd_item_max" required :class="fieldClassName(formstate.recmd_item_max)">
                                            <field-messages name="recmd_item_max" show="$touched ||$submitted" class="form-control-callback">
                                                <div class="valid">Success!</div>
                                                <div slot="required" class="error">数据最大条数不能为空.</div>
                                            </field-messages>
                                        </div>
                                        <span class="f-c-r form-tips">数据最大条数不超过10</span>
                                    </validate>
                                    <div class="form-group">
                                        <label class="col-sm-3 control-label">是否打开新窗口：</label>
                                        <div class="col-sm-4">
                                            <!--<select class="form-control" name="is_blank" v-model="fields.is_blank">
                                                <option value="0">不打开新窗口</option>
                                                <option value="1">打开新窗口</option>
                                                <option value="2">自定义</option>
                                            </select>  -->
                                            <el-select name="is_blank" v-model="fields.is_blank" required :class="fieldClassName(formstate.is_blank)">
                                              <!--<template v-for="item in freightTemp">
                                                <el-option :key="item.id" :label="item.templet_name" :value="item.id"></el-option>
                                              </template>-->
                                              <el-option :key="0" label="不打开新窗口" :value="0"></el-option>
                                              <el-option :key="1" label="打开新窗口" :value="1"></el-option>
                                              <el-option :key="2" label="自定义  " :value="2"></el-option>
                                            </el-select>                                          
                                        </div>
                                    </div>
                                    <validate class="form-group">
                                        <label class="col-sm-3 control-label"><span class="f-c-r">*</span>图片宽度：</label>
                                        <div class="col-sm-4">                                        
                                           <input type="number" onmousewheel="return false;" name="recmd_item_img_w" class="form-control" v-model="fields.recmd_item_img_w" required :class="fieldClassName(formstate.recmd_item_img_w)">
                                            <span class="units">PX</span>
                                            <field-messages name="recmd_item_img_w" show="$touched ||$submitted" class="form-control-callback">
                                                <div class="valid">Success!</div>
                                                <div slot="required" class="error">图片宽度不能为空.</div>
                                            </field-messages>
                                        </div>
                                    </validate>
                                    <validate class="form-group">
                                        <label class="col-sm-3 control-label"><span class="f-c-r">*</span>图片高度：</label>
                                        <div class="col-sm-4">                                        
                                           <input type="number" onmousewheel="return false;" name="recmd_item_img_h" class="form-control" v-model="fields.recmd_item_img_h" required :class="fieldClassName(formstate.recmd_item_img_h)">
                                            <span class="units">PX</span>
                                            <field-messages name="recmd_item_img_h" show="$touched ||$submitted" class="form-control-callback">
                                                <div class="valid">Success!</div>
                                                <div slot="required" class="error">图片高度不能为空.</div>
                                            </field-messages>
                                        </div>
                                    </validate>                            
                                    <field class="form-group">
                                        <label class="col-sm-3 control-label">是否启用：</label>
                                        <div class="col-sm-6">
                                            <div class="r-state">                                                  
                                                <el-radio class="radio" v-model="fields.status_recmd_item" :label="1">是</el-radio>
                                                <el-radio class="radio" v-model="fields.status_recmd_item" :label="-1">否</el-radio>
                                            </div>                                            
                                        </div>
                                    </field>
                                  <div class="hr-line-dashed"></div>
                                    <div class="form-group draggable ui-draggable">
                                        <div class="col-sm-12 col-sm-offset-3">
                                            <!--<button class="btn btn-primary" type="submit" v-if="itemID==''">提交</button>
                                            <router-link :to="'/recom/wap/item/'+$route.params.id" class="btn btn-white m-l-sm">返回列表</router-link>-->
                                            <el-button type="primary" native-type="submit"  v-if="itemID==''">提交</el-button>
                                            <router-link :to="'/recom/wap/item/'+$route.params.id" class="white-btn m-l-sm">返回列表</router-link>
                                        </div>  
                                    </div>
                                </vue-form>
                                </el-tab-pane>
                                <el-tab-pane label="推荐数据" name="second" :disabled="true">                                    
                                </el-tab-pane>            
                            </el-tabs>                            
                      </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>
<script>
    import HjCrumb from '../../comms/BreadCrumb.vue'
    import ItemAddData from './ItemAddData.vue'    
    export default{
        components:{
          HjCrumb,
          ItemAddData
        },
        data(){
            return{
                CrumbBox:{
                    CrumbList:
                    [
                        {
                            title:'推荐列表WAP',
                            url:'/recom/wap/list'
                        },
                        {
                            title:'推荐栏目列表',
                            url:'/recom/wap/item/'+this.$route.params.id
                        },
                        {
                            title:'添加',
                            url:''
                        }
                    ]
                },                
                activeName: 'first', 
                cateList:[], 
                formstate:{},
                itemID:'',
                tabDisabled:true,
                fields:{
                    recmd_item_label:"",
                    recmd_block_id:"",
                    recmd_block_name:"",                    
                    recmd_item_channel:null,
                    recmd_item_max:"",
                    is_blank:0,
                    recmd_item_img_w:"",
                    recmd_item_img_h:"",
                    status_recmd_item:1
                },
                recomList:{
                    maxLen:0,
                    itemid:0,
                    pid:this.$route.params.id
                },
            }
        },
        mounted(){
            //this.recomList.maxLen = this.fields.recmd_item_max;
        },
        methods:{    
            fieldClassName:function(field){
                if(!field){
                    return '';
                }else if((field.$submitted) && field.$invalid){
                    return 'error';
                }else if((field.$submitted) && field.$valid){
                    return 'valid';
                }
            },    
            onSubmit:function(){
                var that = this;
                if(this.formstate.$valid){                                                             
                    that.$http({
                          method:'post',
                          url: '/recmd_item/addsubmit',
                          params:{ 
                            'recmd_item_label':that.fields.recmd_item_label,
                            'recmd_block_id':that.$route.params.id,
                            'recmd_item_channel':that.fields.recmd_item_channel,
                            'recmd_item_max':that.fields.recmd_item_max,
                            'is_blank':that.fields.is_blank,
                            'recmd_item_img_w':that.fields.recmd_item_img_w,
                            'recmd_item_img_h':that.fields.recmd_item_img_h,
                            'status_recmd_item':that.fields.status_recmd_item
                          }           
                        }).then(function (res) {
                            //console.log(res)                                               
                            if(res.data.error==0){
                                that.$message({
                                  message: '添加成功',
                                  type: 'success'
                                });
                                that.itemID=res.data.data.recmd_item_id;                                
                                that.recomList.itemid = res.data.data.recmd_item_id; 
                                that.recomList.maxLen = parseInt(that.fields.recmd_item_max);                            
                                that.tabDisabled = false 
                                //that.activeName="second"  
                                //"'/recom/wap/itemedit/'+$route.params.id+'/'+item.recmd_item_id"               
                                that.$router.push('/recom/wap/itemedit/'+that.$route.params.id+'/'+that.itemID);
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
