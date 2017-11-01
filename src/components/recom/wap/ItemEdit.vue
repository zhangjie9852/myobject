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
                                                <div slot="min" class="error">数据最少条数不能少于1</div>
                                                <div slot="max" class="error">数据最大条数不能超过10</div>
                                            </field-messages>                                            
                                        </div>
                                        <span class="f-c-r form-tips">数据最大条数不超过10</span>
                                    </validate>
                                    <!-- <div class="form-group">
                                        <label class="col-sm-3 control-label">是否打开新窗口：</label>
                                        <div class="col-sm-4">                                          
                                             <el-select name="is_blank" v-model="fields.is_blank" required :class="fieldClassName(formstate.is_blank)">  
                                              <el-option :key="0" label="不打开新窗口" :value="0"></el-option>
                                              <el-option :key="1" label="打开新窗口" :value="1"></el-option>
                                              <el-option :key="2" label="自定义  " :value="2"></el-option>
                                            </el-select>                                          
                                        </div>
                                    </div> -->
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
                                            <!--<button class="btn btn-primary" type="submit">提交</button>
                                            <router-link :to="'/recom/wap/item/'+$route.params.pid" class="btn btn-white m-l-sm">返回列表</router-link>-->
                                            <el-button type="primary" native-type="submit">提交</el-button>
                                            <router-link :to="'/recom/wap/item/'+$route.params.pid" class="white-btn m-l-sm">返回列表</router-link>
                                        </div>  
                                    </div>
                                </vue-form>
                                </el-tab-pane>
                                <el-tab-pane label="推荐数据" name="second">
                                    <ItemEditData :recomMsg="recomList" v-if="activeName=='second'"></ItemEditData>
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
    import ItemEditData from './ItemEditData.vue'
    import {mapGetters,mapActions} from 'vuex'    
	export default{
		components:{
	      HjCrumb,
          ItemEditData
	    },
	    data(){
	    	return{
	    		CrumbBox:{
	    			CrumbList:
		    		[
			    		{
                            title:'推荐管理',
                            url:'/recom/wap/list'
                        },
                        {
                            title:'推荐栏目列表',
                            url:'/recom/wap/item/'+this.$route.params.pid
                        },
                        {
                            title:'编辑',
                            url:''
                        }
		    		]
		    	},                
                recomList:{
                    maxLen:0,
                    pwidth:0,
                    pheight:0,
                    itemid:this.$route.params.id,
                    pid:this.$route.params.pid,
                },
                activeName: 'first', 
                cateList:[], 
                formstate:{},                
                fields:{
                    recmd_item_id:0,
                    recmd_item_label:"",
                    recmd_block_id:0,
                    recmd_block_name:"",                    
                    recmd_item_channel:null,
                    recmd_item_max:"",
                    is_blank:2,
                    recmd_item_img_w:0,
                    recmd_item_img_h:0,
                    status_recmd_item:1
                }
	    	}
	    },
         mounted(){
            this.itemInfo(this.$route.params.id);               
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
            itemInfo(cid){
                var that = this;
                that.$http({
                          method:'post',
                          url: '/recmd_item/infodata',
                          params:{
                            'recmd_item_id':cid                       
                          }           
                        }).then(function (res) {                                                    
                            var  fieldList =  res.data.data;                   
                            if(res.data.error==0){
                                that.fields.recmd_item_id = fieldList.recmd_item_id;
                                that.fields.recmd_item_label = fieldList.recmd_item_label;
                                that.fields.recmd_item_channel = fieldList.recmd_item_channel;
                                that.fields.recmd_item_max = fieldList.recmd_item_max;
                                that.recomList.maxLen = fieldList.recmd_item_max;
                                that.recomList.pwidth = fieldList.recmd_item_img_w;
                                that.recomList.pheight = fieldList.recmd_item_img_h;
                                that.fields.is_blank = fieldList.is_blank;
                                that.fields.recmd_item_img_w = fieldList.recmd_item_img_w;
                                that.fields.recmd_item_img_h = fieldList.recmd_item_img_h;
                                that.fields.status_recmd_item = fieldList.status_recmd_item;             
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
            onSubmit:function(){
                var that = this;
                if(this.formstate.$valid){                                                             
                    that.$http({
                          method:'post',
                          url: '/recmd_item/editsubmit',
                          params:{
                            'recmd_item_id':that.fields.recmd_item_id,
                            'recmd_item_label':that.fields.recmd_item_label,                            
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
                                  message: '更新成功',
                                  type: 'success'
                                });
                                that.recomList.maxLen = parseInt(that.fields.recmd_item_max);
                                //that.activeName="second"
                                //console.log(that.recomList.maxLen)
                                //that.$router.push('/recom/wap/item/'+that.$route.params.pid);                                
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
