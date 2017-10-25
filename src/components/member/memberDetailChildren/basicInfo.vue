<template>
  <div class="form-horizontal form-detail">
    <div class="form-group">
      <label class="col-sm-3 control-label">用户名：</label>
      <div class="col-sm-4 control-info">{{memberInfo.user_name}}</div>
    </div>
    <div class="form-group">
      <label class="col-sm-3 control-label">会员昵称：</label>
      <div class="col-sm-4 control-info">{{memberInfo.user_nickname}}</div>
    </div>
    <div class="form-group">
      <label class="col-sm-3 control-label">账户余额：</label>
      <div class="col-sm-4 control-info">{{memberInfo.user_balance}}</div>
    </div>
    <div class="form-group">
      <label class="col-sm-3 control-label">等级积分：</label>
      <div class="col-sm-6 control-info">{{memberInfo.user_point}}<span class="f-c-r m-l-lg">注：等级积分是一种累计的积分，系统根据该积分来判定用户的会员等级。</span></div>
    </div>
    <div class="form-group">
      <label class="col-sm-3 control-label">邮件地址：</label>
      <div class="col-sm-4 control-info">{{memberInfo.user_email}}</div>
    </div>
    <div class="form-group">
      <label class="col-sm-3 control-label">会员性别：</label>
      <div class="col-sm-4 control-info" v-if="memberInfo.user_gender==0">保密</div>
      <div class="col-sm-4 control-info" v-else-if="memberInfo.user_gender==1">男</div>
      <div class="col-sm-4 control-info" v-else-if="memberInfo.user_gender==2">女</div>
    </div>
    <div class="form-group">
      <label class="col-sm-3 control-label">出生日期：</label>
      <div class="col-sm-4 control-info">{{memberInfo.user_birthday}}</div>
    </div>
    <div class="form-group">
      <label class="col-sm-3 control-label">手机号码：</label>
      <div class="col-sm-4 control-info">{{memberInfo.user_mobile}}</div>
    </div>
    <div class="form-group">
      <label class="col-sm-3 control-label">登录状态：</label>
      <div class="col-sm-4 control-info" v-if="memberInfo.user_statue==0">正常</div>
      <div class="col-sm-4 control-info" v-else>冻结</div>
    </div>
    <div class="hr-line-dashed"></div>
    <div class="form-group draggable ui-draggable">
      <div class="col-sm-12 col-sm-offset-3">
        <!--<router-link to="/member/list" class="btn btn-primary">返回列表</router-link>-->
        <router-link to="/member/list" class="white-btn">返回列表</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default{
    props:['userId'],
    data () {
      return{
        memberInfo: {}
      }
    },
    methods:{
      getMemberInfo (id) {
        var that=this;
        that.$http({
          method:'post',
          url: '/member/infodata',
          params:{
            user_id:id
          }
        }).then(function (res) {
          if(res.data.error=='0'){
            that.memberInfo=res.data.data;
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
            message: '会员信息加载失败，请重新加载!'
          });
        });
      }
    },
    mounted () {
      this.$nextTick(function () {
        var that=this;
        setTimeout(function(){
          that.getMemberInfo(that.userId);
        },20)
      })
    }
  }
</script>

<style scoped>
.text-blue{
  color:#0099FF;
}
</style>
