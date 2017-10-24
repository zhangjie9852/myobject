<template>
  <div id="MemberAdd">
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-content p-m">
              <div class="hd-title">添加管理员</div>
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
                  <label class="col-sm-3 control-label"><span class="f-c-r">*</span> 管理员密码：</label>
                  <div class="col-sm-4">
                    <input type="password" name="user_pass" class="form-control" v-model="adminInfo.userPass"
                           required
                           minlength="6" maxlength="20"
                           :class="fieldClassName(formstate.user_pass)">
                    <field-messages name="user_pass" show="$touched || $submitted" class="form-control-callback">
                      <div slot="required" class="error">管理员密码不能为空</div>
                      <div slot="minlength" class="error">管理员密码不能少于6位</div>
                      <div slot="maxlength" class="error">管理员密码不能多于20位</div>
                    </field-messages>
                  </div>
                </validate>
                <validate class="form-group">
                  <label class="col-sm-3 control-label"><span class="f-c-r">*</span> 管理员确认密码：</label>
                  <div class="col-sm-4">
                    <input type="password" name="userPass2" class="form-control" v-model="adminInfo.userPass2"
                           required
                           :match="adminInfo.userPass2==adminInfo.userPass"
                           :class="fieldClassName(formstate.userPass2)">
                    <field-messages name="userPass2" show="$touched || $submitted" class="form-control-callback">
                      <div slot="required" class="error">管理员确认密码不能为空</div>
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
                    <!--<button class="btn btn-white m-l-sm" type="reset" @click="onReset">重置</button>-->
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
              title: '添加管理员',
              url: ''
            }
          ]
        },
        formstate: {},
        roleList:[],
        isExist:false,
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
      userIsExist () {
        var that=this;
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
      },
      onSubmit: function () {
        var that = this;
        if (that.formstate.$valid && !that.isExist) {
          that.$http({
            method: 'post',
            url: '/user/addUser',
            params: {
              user_login:that.adminInfo.userLogin,
              user_pass:that.adminInfo.userPass,
              user_status:that.adminInfo.status,
              realname:that.adminInfo.realname,
              user_remark:that.adminInfo.userRemark,
              role:that.adminInfo.role
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '管理员添加成功!'
              });
              that.$router.push('/admin/list');
            }else{
              that.$message({
                type: 'error',
                message: res.data.desc
              });
            }
          }).catch(function (error) {
            that.$message({
              type: 'error',
              message: '管理员添加失败，请重新提交!'
            });
          });
        }
      },
      onReset () {
        this.formstate._reset();
        this.adminInfo = {
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
    mounted () {
      this.$nextTick(function () {
        this.getRoleList();
      })
    }
  }
</script>

<style scoped>

</style>
