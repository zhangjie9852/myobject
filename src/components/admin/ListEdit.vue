<template>
  <div id="MemberAdd">
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-content p-m">
              <div class="hd-title">编辑管理员</div>
              <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t" id="commentForm">
                <validate class="form-group">
                  <label class="col-sm-3 control-label"><span class="f-c-r">*</span> 管理员登录名称：</label>
                  <div class="col-sm-4">
                    <input type="text" name="user_login" class="form-control" v-model="adminInfo.userLogin" required
                           :class="fieldClassName(formstate.user_login)" @blur="userIsExist" @focus="isExist=false">
                    <field-messages name="user_login" show="$touched || $submitted" class="form-control-callback">
                      <div slot="required" class="error">管理员登录名称不能为空</div>
                      <div class="error" v-if="isExist">该登录名称已经存在</div>
                    </field-messages>
                  </div>
                </validate>
                <div class="form-group">
                  <label class="col-sm-3 control-label">真实姓名：</label>
                  <div class="col-sm-4">
                    <input type="text" name="realname" class="form-control" v-model="adminInfo.realname">
                  </div>
                </div>
                <validate class="form-group">
                  <label class="col-sm-3 control-label">管理员密码：</label>
                  <div class="col-sm-4">
                    <input type="password" name="user_pass" class="form-control" v-model="adminInfo.userPass"
                           minlength="6" maxlength="20"
                           :class="fieldClassName(formstate.user_pass)">
                    <field-messages name="user_pass" show="$touched || $submitted" class="form-control-callback">
                      <div slot="minlength" class="error">管理员密码不能少于6位</div>
                      <div slot="maxlength" class="error">管理员密码不能多于20位</div>
                    </field-messages>
                  </div>
                </validate>
                <validate class="form-group">
                  <label class="col-sm-3 control-label">管理员确认密码：</label>
                  <div class="col-sm-4">
                    <input type="password" name="userPass2" class="form-control" v-model="adminInfo.userPass2"
                           :match="adminInfo.userPass2==adminInfo.userPass"
                           :class="fieldClassName(formstate.userPass2)">
                    <field-messages name="userPass2" show="$touched || $submitted" class="form-control-callback">
                      <div slot="match" class="error">两次密码不一致</div>
                    </field-messages>
                  </div>
                </validate>
                <validate class="form-group">
                  <label class="col-sm-3 control-label"><span class="f-c-r">*</span> 角色名：</label>
                  <div class="col-sm-4">
                    <!--<select class="form-control" name="role" v-model="adminInfo.role" required>-->
                      <!--<option :value="null">请选择角色</option>-->
                      <!--<template v-for="item in roleList">-->
                        <!--<option :value="item.id">{{item.rolename}}</option>-->
                      <!--</template>-->
                    <!--</select>-->
                    <el-select name="role" v-model="adminInfo.role" required :class="fieldClassName(formstate.role)">
                      <el-option :key="null" label="请选择角色" :value="null"></el-option>
                      <template v-for="item in roleList">
                        <el-option :key="item.id" :label="item.rolename" :value="item.id"></el-option>
                      </template>
                    </el-select>
                    <field-messages name="role" show="$touched || $submitted" class="form-control-callback">
                      <div slot="required" class="error">角色不能为空</div>
                    </field-messages>
                  </div>
                </validate>
                <div class="form-group">
                  <label class="col-sm-3 control-label">管理员描述：</label>
                  <div class="col-sm-4">
                    <textarea class="form-control" name="user_remark" v-model="adminInfo.userRemark"></textarea>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-sm-3 control-label">管理员状态：</label>
                  <div class="col-sm-4">
                    <el-radio class="radio" name="user_status" v-model="adminInfo.status" :label="1">正常</el-radio>
                    <el-radio class="radio" name="user_status" v-model="adminInfo.status" :label="0">禁止</el-radio>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>
                <div class="form-group draggable ui-draggable">
                  <div class="col-sm-12 col-sm-offset-3">
                    <!--<button class="btn btn-primary" type="submit">确定</button>-->
                    <!--<router-link to="/admin/list" class="btn btn-white m-l-sm">返回列表</router-link>-->
                    <el-button type="primary" native-type="submit">确定</el-button>
                    <router-link to="/admin/list" class="white-btn m-l-sm">返回列表</router-link>
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
  import Vue from 'vue'
  import vueForm from 'vue-form'
  //  自定义验证器
  var vueFormOptions = {
    validators: {
      'match': function (value, attrValue) {
        return attrValue;
      }
    }
  };
  Vue.use(vueForm, vueFormOptions);
  export default{
    components: {
      HjCrumb
    },
    data(){
      return {
        CrumbBox: {
          CrumbList: [
            {
              title:'权限管理',
              url:'/admin/list'
            },
            {
              title: '管理员列表',
              url: '/admin/list'
            },
            {
              title: '编辑管理员',
              url: ''
            }
          ]
        },
        formstate: {},
        adminId:'',
        roleList:[],
        isExist:false,
        originUserLogin:'',
        adminInfo: {
          userLogin: '',
          realname: '',
          userPass: '',
          userPass2: '',
          role:null,
          userRemark:'',
          status:1
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
      getRoleList () {
        var that=this;
        that.$http({
          method:'post',
          url: '/role/list'
        }).then(function (res) {
          if(res.data.error=='0'){
            that.roleList=res.data.data;
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
      getAdminInfo (id) {
        var that=this;
        that.$http({
          method:'post',
          url: '/user/findUser',
          params:{
            id:id
          }
        }).then(function (res) {
          if(res.data.error=='0'){
            that.adminInfo={
              userLogin: res.data.data.user_login,
              realname: res.data.data.realname,
              userPass: '',
              userPass2: '',
              role:res.data.data.role,
              userRemark:res.data.data.user_remark,
              status:res.data.data.user_status
            }
            that.originUserLogin=res.data.data.user_login;
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
      userIsExist () {
        var that=this;
        if(that.adminInfo.userLogin!=that.originUserLogin){
          that.$http({
            method:'post',
            url: '/user/userExist',
            params:{
              user_login:that.adminInfo.userLogin
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.isExist=res.data.data;
            }else{
              that.$message({
                type: 'error',
                message: res.data.desc
              });
            }
          }).catch(function (error) {
            console.log(error);
          });
        }else{
          that.isExist=false;
        }
      },
      onSubmit: function () {
        var that = this;
        if (this.formstate.$valid && !that.isExist) {
          that.$http({
            method: 'post',
            url: '/user/addUser',
            params: {
              user_login:that.adminInfo.userLogin,
              user_pass:that.adminInfo.userPass,
              user_status:that.adminInfo.status,
              realname:that.adminInfo.realname,
              user_remark:that.adminInfo.userRemark,
              role:that.adminInfo.role,
              id:that.adminId
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '管理员修改成功!'
              });
            }else{
              that.$message({
                type: 'error',
                message: res.data.desc
              });
            }
          }).catch(function (error) {
            that.$message({
              type: 'error',
              message: '管理员修改失败，请重新提交!'
            });
          });
        }
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.adminId=this.$route.params.id;
        this.getRoleList();
        this.getAdminInfo(this.adminId);
      })
    }
  }
</script>

<style>
  .radio{
    font-weight: normal;
  }
</style>
