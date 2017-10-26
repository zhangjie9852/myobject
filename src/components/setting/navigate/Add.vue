<template>
  <div id="MemberAdd">
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-content p-m">
              <div class="hd-title">添加导航</div> 
              <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t">
                <validate class="form-group">
                  <label class="col-sm-3 control-label"><span class="f-c-r">*</span>导航类型：</label>
                  <div class="col-sm-4">
                    <!--<select class="form-control" name="nav_parent" v-model="fields.nav_parent" required>
                      <option :value="null">请选择</option>
                      <template v-for="item in navType">
                        <option :value="item.id">{{item.name}}</option>
                      </template>
                    </select>-->
                      <el-select name="nav_parent" v-model="fields.nav_parent" required :class="fieldClassName(formstate.nav_parent)">
                        <el-option :key="null" label="请选择" :value="null"></el-option>
                        <template v-for="item in navType">
                          <el-option :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </template>
                      </el-select>
                    <field-messages name="nav_parent" show="$touched || $submitted" class="form-control-callback">
                      <div slot="required" class="error">导航类型不能为空</div>
                    </field-messages>
                  </div>
                </validate>
                <validate class="form-group">
                  <label class="col-sm-3 control-label"><span class="f-c-r">*</span>导航名称：</label>
                  <div class="col-sm-4">
                    <input type="text" name="sys_nav_name" class="form-control" v-model="fields.sys_nav_name" required
                           :class="fieldClassName(formstate.sys_nav_name)">
                    <field-messages name="sys_nav_name" show="$touched || $submitted" class="form-control-callback">
                      <div slot="required" class="error">导航名称不能为空</div>                      
                    </field-messages>
                  </div>
                </validate>
                <validate class="form-group">
                  <label class="col-sm-3 control-label"><span class="f-c-r">*</span>链接地址：</label>
                  <div class="col-sm-4">
                    <input type="text" name="link" class="form-control" v-model="fields.link" required
                           :class="fieldClassName(formstate.link)">
                    <field-messages name="link" show="$touched || $submitted" class="form-control-callback">
                      <div slot="required" class="error">链接地址不能为空</div>
                    </field-messages>
                  </div>
                </validate>
                <div class="form-group">
                  <label class="col-sm-3 control-label">排序：</label>
                  <div class="col-sm-4">
                    <input type="number" onmousewheel="return false;" name="ad_position_high" class="form-control" v-model="fields.sort">
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-sm-3 control-label">是否显示：</label>
                  <div class="col-sm-4">
                    <el-radio class="radio" name="is_open" v-model="fields.open_type" :label="1">是</el-radio>
                    <el-radio class="radio" name="is_open" v-model="fields.open_type" :label="0">否</el-radio>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-sm-3 control-label">是否新窗口：</label>
                  <div class="col-sm-4">
                    <el-radio class="radio" name="is_open" v-model="fields.open_new_window" :label="1">是</el-radio>
                    <el-radio class="radio" name="is_open" v-model="fields.open_new_window" :label="-1">否</el-radio>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-sm-3 control-label">导航位置：</label>
                  <div class="col-sm-4">
                    <!--<select class="form-control" name="nav_point" v-model="fields.nav_point" required>
                      <option :value="null">请选择</option>
                      <template v-for="item in navPointType">
                        <option :value="item.id">{{item.name}}</option>
                      </template>
                    </select>-->
                    <el-select name="nav_point" v-model="fields.nav_point" required>
                        <el-option :key="null" label="请选择" :value="null"></el-option>
                        <template v-for="item in navPointType">
                          <el-option :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </template>
                      </el-select>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-sm-3 control-label">导航描述：</label>
                  <div class="col-sm-4">
                     <textarea name="remark" class="form-control" v-model="fields.remark">{{fields.remark}}</textarea>
                  </div>
                </div>
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
  import HjCrumb from '../../comms/BreadCrumb.vue'  
  export default{
    components: {
      HjCrumb
    },    
    data(){
      return {
        CrumbBox: {
          CrumbList: [
            {
              title:'系统设置',
                url:'/setting/navigation/list'
            },
            {
              title:'导航设置',
              url:'/setting/navigation/list'
            },
            {
              title:'添加导航',
              url:''
            }
          ]
        },
        formstate: {},        
        isExist:false,
        navType:[
          {'id':0,name:'PC端导航 '},
          {'id':1,name:'移动端导航 '}         
        ],
        navPointType:[
          {'id':0,name:'顶部 '},
          {'id':1,name:'中部 '},
          {'id':2,name:'底部 '},        
        ],      
        fields: {
          nav_parent: null,
          sys_nav_name:'',
          nav_point:null,
          open_new_window:1,
          open_type:1,
          sort:null,
          link:'',
          remark:''
        }
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
      // IsExist () {
      //   var that=this;
      //   that.$http({
      //     method:'post',
      //     url: '/adposition/validateRepeat',
      //     params:{
      //       adPosition_name:that.adPositionInfo.adPositionName,
      //       shop_id:that.shopId
      //     }
      //   }).then(function (res) {
      //     if(res.data.error=='0'){
      //       that.isExist=false;
      //     }else{
      //       that.isExist=true;
      //     }
      //   }).catch(function (error) {
      //     console.log(error);
      //   });
      // },
      onSubmit: function () {
        var that = this;
        if (that.formstate.$valid) {
          that.$http({
            method: 'post',
            url: '/nav/addsubmit',
            params: {
              nav_parent:that.fields.nav_parent,
              sys_nav_name:that.fields.sys_nav_name,              
              open_new_window:that.fields.open_new_window,
              open_type:that.fields.open_type,
              sort:that.fields.sort,
              link:that.fields.link,
              nav_point:that.fields.nav_point,
              remark:that.fields.remark
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '添加成功!'
              });
              that.$router.push('/setting/navigation/list');
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
      },
      onReset () {
        this.formstate._reset();
        this.fields={
          nav_parent: null,
          sys_nav_name:'',
          nav_point:null,
          open_new_window:1,
          open_type:1,
          sort:null,
          link:'',
          remark:''
        }
      }
    }    
  }
</script>

<style scoped>
  .el-switch { margin-top: 5px; }
</style>
