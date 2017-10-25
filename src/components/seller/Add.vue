<template>
  <div id="MemberAdd">
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-content p-m">
              <div class="hd-title">添加商家</div> 
                <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t">                  
                  <validate class="form-group">
                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>商家名称：</label>
                    <div class="col-sm-4">
                      <input type="text" name="shop_name" class="form-control" v-model="fields.shop_name" required
                             :class="fieldClassName(formstate.shop_name)" @blur="nameIsExist" @focus="isExist=false">
                      <field-messages name="shop_name" show="$touched || $submitted" class="form-control-callback">
                        <div slot="required" class="error">商家名称不能为空</div>
                        <div class="error" v-if="isExist">商家名称已经存在</div>
                      </field-messages>
                    </div>                    
                  </validate>
                  <validate class="form-group">
                      <label class="col-sm-3 control-label"><span class="f-c-r">*</span>商家类型：</label>
                      <div class="col-sm-4">
                        <select class="form-control" name="shop_modes" v-model="fields.shop_modes" required :class="fieldClassName(formstate.shop_modes)">
                              <option :value="null">请选择商家类型</option>
                              <option v-for="(item,index) in sellerType" :value="item.id">{{item.name}}</option>
                          </select>
                          <field-messages name="shop_modes" show="$touched ||$submitted" class="form-control-callback">
                              <div class="valid">Success!</div>
                              <div slot="required" class="error">请选择商家类型.</div>
                          </field-messages>
                      </div>
                  </validate>
                  <validate class="form-group">
                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>店铺关键词：</label>
                    <div class="col-sm-4">
                      <input type="text" name="shop_keyword" class="form-control" v-model="fields.shop_keyword" required
                             :class="fieldClassName(formstate.shop_keyword)">
                      <field-messages name="shop_keyword" show="$touched || $submitted" class="form-control-callback">
                        <div slot="required" class="error">店铺关键词不能为空</div>
                      </field-messages>
                    </div>
                  </validate>
                  <validate class="form-group">
                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>联系人姓名：</label>
                    <div class="col-sm-4">
                      <input type="text" name="shop_linkman" class="form-control" v-model="fields.shop_linkman" required
                             :class="fieldClassName(formstate.shop_linkman)">
                      <field-messages name="shop_linkman" show="$touched || $submitted" class="form-control-callback">
                        <div slot="required" class="error">联系人姓名不能为空</div>
                        <div slot="pattern" class="error">联系人电话格式不正确</div>
                      </field-messages>
                    </div>
                  </validate>
                  <validate class="form-group">
                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>联系人电话：</label>
                    <div class="col-sm-4">
                      <input type="text" name="shop_linkman_mobile" class="form-control" v-model="fields.shop_linkman_mobile" pattern="^1[34578]\d{9}$" required
                             :class="fieldClassName(formstate.shop_linkman_mobile)">
                      <field-messages name="shop_linkman_mobile" show="$touched || $submitted" class="form-control-callback">
                        <div slot="required" class="error">联系人电话不能为空</div>
                        <div slot="pattern" class="error">联系人电话格式不正确</div>
                      </field-messages>
                    </div>
                  </validate>
                  <div class="form-group">
                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>选择区域：</label>
                    <validate class="col-sm-2">
                      <select class="form-control" name="shop_province_id" v-model="fields.shop_province_id" required :class="fieldClassName(formstate.shop_province_id)" @change="changeProvince" ref="province">
                        <option :value="null">请选择</option>
                        <template v-for="item in provinceList">
                          <option :value="item.region_id">{{item.region_name}}</option>
                        </template>
                      </select>
                      <field-messages name="shop_province_id" show="$touched ||$submitted" class="form-control-callback">
                          <div class="valid">Success!</div>
                          <div slot="required" class="error">请选择区域.</div>
                      </field-messages>
                    </validate>
                    <validate class="col-sm-2" v-if="fields.shop_province_id!=null">
                      <select class="form-control" name="shop_city_id" v-model="fields.shop_city_id" :disabled="fields.shop_province_id==null" required :class="fieldClassName(formstate.shop_city_id)" @change="changeCity">
                        <option :value="null">请选择</option>
                        <template v-for="item in cityList">
                          <option :value="item.region_id">{{item.region_name}}</option>
                        </template>
                      </select>
                      <field-messages name="shop_city_id" show="$touched ||$submitted" class="form-control-callback">
                          <div class="valid">Success!</div>
                          <div slot="required" class="error">请选择区域.</div>
                      </field-messages>
                    </validate>
                    <validate class="col-sm-2" v-if="fields.shop_city_id!=null">
                      <select class="form-control" name="shop_area_id" v-model="fields.shop_area_id" :disabled="fields.shop_city_id==null" required :class="fieldClassName(formstate.shop_area_id)">
                        <option :value="null">请选择</option>
                        <template v-for="item in regionList">
                          <option :value="item.region_id">{{item.region_name}}</option>
                        </template>
                      </select>
                      <field-messages name="shop_area_id" show="$touched ||$submitted" class="form-control-callback">
                          <div class="valid">Success!</div>
                          <div slot="required" class="error">请选择区域.</div>
                      </field-messages>
                    </validate>
                  </div>                  
                  <div class="form-group">
                    <label class="col-sm-3 control-label">详细地址：</label>
                    <div class="col-sm-6">
                      <input type="text" name="shop_address_details" class="form-control" v-model="fields.shop_address_details">                      
                    </div>
                  </div>
                  <validate class="form-group">
                    <label class="col-sm-3 control-label">电子邮箱：</label>
                    <div class="col-sm-4">
                      <input type="text" name="email" class="form-control" v-model="fields.email" pattern="^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}$"
                           :class="fieldClassName(formstate.email)">
                      <field-messages name="email" show="$touched || $submitted" class="form-control-callback">
                        <div slot="pattern" class="error">邮箱地址不正确</div>
                      </field-messages>                    
                    </div>
                  </validate>                  
                  <div class="form-group">
                    <label class="col-sm-3 control-label">店铺介绍：</label>
                    <div class="col-sm-4">
                      <textarea name="description" class="form-control" v-model="fields.description">{{fields.description}}</textarea>                      
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="col-sm-3 control-label">店铺公告：</label>
                    <div class="col-sm-4">
                      <textarea name="shop_notice" class="form-control" v-model="fields.shop_notice">{{fields.shop_notice}}</textarea>                     
                    </div>
                  </div>
                  <field class="form-group">
                    <label class="col-sm-3 control-label">店铺开关：</label>
                    <div class="col-sm-4">
                      <el-radio class="radio" name="shop_state" v-model="fields.shop_state" :label="-1">关闭</el-radio>
                      <el-radio class="radio" name="shop_state" v-model="fields.shop_state" :label="1">开启</el-radio>
                    </div>
                  </field>
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
  </div>
</template>
<script>
  import HjCrumb from '../comms/BreadCrumb.vue'
  export default{
    components: {
      HjCrumb
    },    
    data(){
      return {
        CrumbBox: {
          CrumbList: [
            {
              title: '商家管理',
              url: '/shop/list'
            },
            {
              title: '商家列表',
              url: '/shop/list'
            },
            {
              title: '添加',
              url: ''
            }
          ]
        },        
        formstate: {},
        sellerType:[
          {'id':0,name:'平台分店 '},
          {'id':1,name:'自营 '},
          {'id':2,name:'分销-集中供货 '},
        ],
        fields:{
          shop_name:'',
          shop_modes:null,
          shop_keyword:'',
          shop_linkman:'',
          shop_linkman_mobile:'',
          shop_province_id:null,
          shop_area_id:null,
          shop_city_id:null,
          shop_address:'',
          shop_address_details:'',
          description:'',
          shop_notice:'',
          shop_state:1,
          email:''
        },
        isExist:false,
        provinceList:[],
        cityList:[],
        regionList:[],
      }
    },
    methods: {
      fieldClassName: function (field) {
        if (!field) {
          return '';
        } else if ((field.$touched || field.$submitted) && field.$invalid) {
          return 'error';
        }
      },
      nameIsExist () {//验证名称
        var that=this;
        that.$http({
          method:'post',
          url: '/shop/validateRepeat',
          params:{
            shop_name:that.fields.shop_name
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
      getProvinceList () {
        var that=this;
        that.$http({
          method:'post',
          url: '/common/citymenu'
        }).then(function (res) {
          if(res.data.error=='0'){
            that.provinceList=res.data.data.table_data;
          }else{
            that.$message({
              type: 'error',
              message: res.data.desc
            });
          }
        }).catch(function (error) {
          console.log(error);
          that.$message({
            type: 'error',
            message: '省份加载失败，请重新加载!'
          });
        });
      },
      changeProvince () {
        var that=this;
        that.fields.shop_city_id = null;
        that.fields.shop_area_id = null;
        //console.log(this.fields.shop_province_id)
        that.$http({
          method:'post',
          url: '/common/citymenu',
          params:{
            parent_id:that.fields.shop_province_id
          }
        }).then(function (res) {          
          if(res.data.error=='0'){
            that.cityList=res.data.data.table_data;
          }else{
            that.$message({
              type: 'error',
              message: res.data.desc
            });
          }
        }).catch(function (error) {
          console.log(error);
          that.$message({
            type: 'error',
            message: '城市加载失败，请重新选择省份!'
          });
        });
      },
      changeCity () {
        var that=this;
        that.fields.shop_area_id = null;
        that.$http({
          method:'post',
          url: '/common/citymenu',
          params:{
            parent_id:that.fields.shop_city_id
          }
        }).then(function (res) {
          if(res.data.error=='0'){
            that.regionList=res.data.data.table_data;
          }else{
            that.$message({
              type: 'error',
              message: res.data.desc
            });
          }
        }).catch(function (error) {
          console.log(error);
          that.$message({
            type: 'error',
            message: '地区加载失败，请重新选择城市!'
          });
        });
      },
      onReset () {
        this.formstate._reset();
        this.fields = {
          shop_name:'',
          shop_modes:null,
          shop_keyword:'',
          shop_linkman:'',
          shop_linkman_mobile:'',
          shop_province_id:null,
          shop_area_id:null,
          shop_city_id:null,
          shop_address:'',
          shop_address_details:'',
          description:'',
          shop_notice:'',
          shop_state:1,
          email:''
        }
      },
      onSubmit: function () {
        var that = this;        
        if (this.formstate.$valid && !that.isExist) {
          var pname = "";
          var cname = "";
          var rname = "";
          that.provinceList.forEach(function (item,index) {              
              if(item.region_id == that.fields.shop_province_id){
                pname = item.region_name;              
              }
          });
          that.cityList.forEach(function (item,index) {              
              if(item.region_id == that.fields.shop_city_id){
                cname = item.region_name;              
              }
          });
          that.regionList.forEach(function (item,index) {              
              if(item.region_id == that.fields.shop_area_id){
                rname = item.region_name;              
              }
          });        
          that.$http({
            method: 'post',
            url: '/shop/addsubmit',
            params: {
              shop_name:that.fields.shop_name,
              shop_modes:that.fields.shop_modes,
              shop_keyword:that.fields.shop_keyword,
              shop_linkman:that.fields.shop_linkman,
              shop_linkman_mobile:that.fields.shop_linkman_mobile,
              shop_province_id:that.fields.shop_province_id,
              shop_area_id:that.fields.shop_area_id,
              shop_city_id:that.fields.shop_city_id,
              shop_address:pname+'-'+cname+'-'+rname,
              shop_address_details:that.fields.shop_address_details,
              description:that.fields.description,
              shop_notice:that.fields.shop_notice,
              shop_state:that.fields.shop_state,
              email:that.fields.email
            }
          }).then(function (res) {
          console.log(res)           
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '添加成功!'
              });
              that.$router.push('/shop/edit/'+res.data.data.id);
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
      }      
    },
    mounted () {
      this.getProvinceList();
    }
  }
</script>

