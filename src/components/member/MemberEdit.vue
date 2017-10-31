<template>
  <div id="MemberEdit">
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-content p-m">
              <div class="hd-title">编辑会员</div>
              <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t">
                <field class="form-group">
                  <label class="col-sm-3 control-label"><span class="f-c-r">*</span> 用户名：</label>
                  <div class="col-sm-4">
                    <div style="font-size: 14px;line-height: 34px;">{{memberInfo.userName}}</div>
                  </div>
                </field>
                <validate class="form-group">
                  <label class="col-sm-3 control-label"><span class="f-c-r">*</span> 用户昵称：</label>
                  <div class="col-sm-4">
                    <input type="text" name="userNickname" class="form-control" v-model="memberInfo.userNickname"
                           required
                           :class="fieldClassName(formstate.userNickname)">
                    <field-messages name="userNickname" show="$touched || $submitted" class="form-control-callback">
                      <div slot="required" class="error">用户昵称不能为空</div>
                    </field-messages>
                  </div>
                </validate>
                <validate class="form-group">
                  <label class="col-sm-3 control-label"><span class="f-c-r">*</span> 邮箱地址：</label>
                  <div class="col-sm-4">
                    <input type="text" name="userEmail" class="form-control" v-model="memberInfo.userEmail" required
                           pattern="^[A-Za-z0-9]+([-_.][A-Za-z0-9]+)*@([A-Za-z0-9]+[-.])+[A-Za-z0-9]{2,5}$"
                           :class="fieldClassName(formstate.userEmail)">
                    <field-messages name="userEmail" show="$touched || $submitted" class="form-control-callback">
                      <div slot="required" class="error">邮箱地址不能为空</div>
                      <div slot="pattern" class="error">邮箱地址不正确</div>
                    </field-messages>
                  </div>
                </validate>
                <validate class="form-group">
                  <label class="col-sm-3 control-label">登录密码：</label>
                  <div class="col-sm-4">
                    <input type="password" name="userPassword" class="form-control" v-model="memberInfo.userPassword"
                           minlength="6" maxlength="20"
                           :class="fieldClassName(formstate.userPassword)">
                    <field-messages name="userPassword" show="$touched || $submitted" class="form-control-callback">
                      <div slot="minlength" class="error">登录密码不能少于6位</div>
                      <div slot="maxlength" class="error">登录密码不能多于20位</div>
                    </field-messages>
                  </div>
                </validate>
                <validate class="form-group">
                  <label class="col-sm-3 control-label">确认密码：</label>
                  <div class="col-sm-4">
                    <input type="password" name="userPassword2" class="form-control" v-model="memberInfo.userPassword2"
                           :match="memberInfo.userPassword2==memberInfo.userPassword"
                           :class="fieldClassName(formstate.userPassword2)">
                    <field-messages name="userPassword2" show="$touched || $submitted" class="form-control-callback">
                      <div slot="match" class="error">两次密码不一致</div>
                    </field-messages>
                  </div>
                </validate>
                <field class="form-group">
                  <label class="col-sm-3 control-label">性别：</label>
                  <div class="col-sm-4">
                    <el-radio class="radio" name="user_gender" v-model="memberInfo.userGender" :label="1">男</el-radio>
                    <el-radio class="radio" name="user_gender" v-model="memberInfo.userGender" :label="2">女</el-radio>
                    <el-radio class="radio" name="user_gender" v-model="memberInfo.userGender" :label="0">保密</el-radio>
                  </div>
                </field>
                <field class="form-group">
                  <label class="col-sm-3 control-label">出生日期：</label>
                  <div class="col-sm-4">
                    <el-date-picker v-model="memberInfo.userBirthday" :picker-options="pickerOptions" :editable="false" type="date" @change="changeDate"></el-date-picker>
                  </div>
                </field>
                <validate class="form-group">
                  <label class="col-sm-3 control-label"><span class="f-c-r">*</span> 手机号码：</label>
                  <div class="col-sm-4">
                    <input type="text" name="user_mobile" class="form-control" v-model="memberInfo.userMobile"
                           :class="fieldClassName(formstate.user_mobile)" pattern="^1[34578]\d{9}$" required>
                    <field-messages name="user_mobile" show="$touched || $submitted" class="form-control-callback">
                      <div slot="required" class="error">手机号码不能为空</div>
                      <div slot="pattern" class="error">手机号码格式不正确</div>
                    </field-messages>
                  </div>
                </validate>
                <field class="form-group">
                  <label class="col-sm-3 control-label">登录状态：</label>
                  <div class="col-sm-5">
                    <el-radio class="radio" name="user_statue" v-model="memberInfo.userStatue" :label="0">正常</el-radio>
                    <el-radio class="radio" name="user_statue" v-model="memberInfo.userStatue" :label="-1">冻结</el-radio>
                  </div>
                </field>
                <field class="form-group">
                  <label class="col-sm-3 control-label">交易状态：</label>
                  <div class="col-sm-5">
                    <el-radio class="radio" name="user_status_balance" v-model="memberInfo.userStatusBalance" :label="1">正常交易</el-radio>
                    <el-radio class="radio" name="user_status_balance" v-model="memberInfo.userStatusBalance" :label="-1">禁止交易</el-radio>
                  </div>
                </field>
                <field class="form-group">
                  <label class="col-sm-3 control-label">评价状态：</label>
                  <div class="col-sm-5">
                    <el-radio class="radio" name="user_status_comment" v-model="memberInfo.userStatusComment" :label="1">正常评价</el-radio>
                    <el-radio class="radio" name="user_status_comment" v-model="memberInfo.userStatusComment" :label="-1">禁止评价</el-radio>
                  </div>
                </field>
                <field class="form-group">
                  <label class="col-sm-3 control-label">积分获得状态：</label>
                  <div class="col-sm-5">
                    <el-radio class="radio" name="user_status_point" v-model="memberInfo.userStatusPoint" :label="1">正常获得</el-radio>
                    <el-radio class="radio" name="user_status_point" v-model="memberInfo.userStatusPoint" :label="-1">禁止获得</el-radio>
                  </div>
                </field>
                <div class="hr-line-dashed"></div>
                <div class="form-group draggable ui-draggable">
                  <div class="col-sm-12 col-sm-offset-3">
                    <!--<button class="btn btn-primary" type="submit">确定</button>-->
                    <!--<router-link to="/member/list" class="btn btn-white m-l-sm">返回列表</router-link>-->
                    <el-button type="primary" native-type="submit">确定</el-button>
                    <router-link to="/member/list" class="white-btn m-l-sm">返回列表</router-link>
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
              title: '会员管理',
              url: '/member/list'
            },
            {
              title: '会员列表',
              url: '/member/list'
            },
            {
              title: '编辑会员',
              url: ''
            }
          ]
        },
        memberId:'',
        pickerOptions: {
            disabledDate:(time)=>{
            return time.getTime() > Date.now() - 8.64e7;
          }
        },
        yearList: [],
        monthList: [],
        dayList: [],
        formstate: {},
        memberInfo: {
          userName: '',
          userNickname: '',
          userEmail: '',
          userPassword: '',
          userPassword2: '',
          userGender: 0,
          userBirthday:'',
          userMobile: '',
          userStatue:0,
          userStatusBalance:1,
          userStatusComment:1,
          userStatusPoint:1
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
      changeDate (val) {
        this.memberInfo.userBirthday=val;
      },
      getMemberInfo () {
        var that=this;
        that.$http({
          method:'post',
          url: '/member/infodata',
          params:{
            user_id:that.memberId
          }
        }).then(function (res) {
          if(res.data.error=='0'){
            that.memberInfo={
              userName: res.data.data.user_name,
              userNickname: res.data.data.user_nickname,
              userEmail: res.data.data.user_email,
              userPassword: '',
              userPassword2: '',
              userGender: res.data.data.user_gender,
              userBirthday:res.data.data.user_birthday,
              userMobile: res.data.data.user_mobile,
              userStatue:res.data.data.user_statue,
              userStatusBalance:res.data.data.user_status_balance,
              userStatusComment:res.data.data.user_status_comment,
              userStatusPoint:res.data.data.user_status_point
            };
          }else {
            that.$message({
              type: 'error',
              message: res.data.desc
            });
          }
        }).catch(function (error) {
          console.log(error);
          that.$message({
            type: 'error',
            message: '会员信息加载失败，请重新加载!'
          });
        });
      },
      onSubmit: function () {
        var that = this;
        if (this.formstate.$valid) {
          that.$http({
            method: 'post',
            url: '/member/editsubmit',
            params: {
              user_id:that.memberId,
              user_name:that.memberInfo.userName,
              user_nickname:that.memberInfo.userNickname,
              user_email:that.memberInfo.userEmail,
              user_password:that.memberInfo.userPassword,
              user_gender:that.memberInfo.userGender,
              user_birthday:that.memberInfo.userBirthday,
              user_mobile:that.memberInfo.userMobile,
              user_statue:that.memberInfo.userStatue,
              user_status_balance:that.memberInfo.userStatusBalance,
              user_status_comment:that.memberInfo.userStatusComment,
              user_status_point:that.memberInfo.userStatusPoint
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '会员修改成功!'
              });
            }else if(res.data.error=='-1'){
              that.$message({
                type: 'warning',
                message: '手机号已经存在，请修改后重新提交!'
              });
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
              message: '会员修改失败，请重新提交!'
            });
          });
        }
      }
    },
    created () {
      this.memberId = this.$route.params.id;
    },
    mounted () {
      this.$nextTick(function () {
        this.getMemberInfo();
      })
    }
  }
</script>

<style scoped>
  .el-date-editor.el-input{
    width:100% !important;
  }
</style>

