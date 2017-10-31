<template>
	<div id="login">
		<div class="middle-box text-center loginscreen animated fadeInDown">
			<div class="login-wt-bg">
		        <div>
		            <h3 class="login-tit">欢迎使用后台管理系统</h3>
		            <form class="m-t login-form" role="form" @submit.prevent="loginData">
		                <div class="form-group">
		                    <input type="text" class="form-control" id="username" name="username" v-model="username" placeholder="用户名">
		                    <i class="uname"></i>
		                </div>
		                <div class="form-group">
		                    <input type="password" class="form-control" id="password" name="password" placeholder="密码" v-model="password">
		                    <i class="upwd"></i>
		                </div>
		                <div class="form-group">
		                    <input type="text" class="form-control input-lg m-b" id="captcha" name="captcha" v-model="captcha" placeholder="验证码">
		                    <i class="yzm"></i>
		                	<img onclick="this.src=this.src+'?'" :src="validcodeUrl"
		                	class="codeimg" title="重新获取验证码" />
		                </div>
		                <button type="submit" class="btn btn-primary full-width login-btn">登 录</button>
		            </form>
		        </div>
	        </div>
	    </div>
	</div>
</template>
<script>
import {CustomFun,HjsevUrl} from './comms/main.js'
export default {
		data(){
			return {
				username:'',
				password:'',
				captcha:'',
				validcodeUrl: '',
				form_tip: '',
				tipshow:false,
				HjsevUrl:HjsevUrl
			}
		},
		mounted(){
			$("body").addClass("login_body");
	      	this.validcodeUrl = HjsevUrl+'/common/captcha';
	      	if(window.localStorage.getItem('access_token')&&window.localStorage.getItem('userid')){
		        this.$router.push('/index');              
		    }
		},
		destroyed(){
			$("body").removeClass("login_body");
		},
		methods:{			
			loginData() {	//登录
	      		var that = this;
	      		if(that.username==''){
	      			that.$message({
                      message: '用户名不能为空',
                      type: 'warning'
                    });
                    return
	      		}else if(that.password==''){
	      			that.$message({
                      message: '密码不能为空',
                      type: 'warning'
                    });
                    return
	      		}else if(that.captcha==''){
	      			that.$message({
                      message: '验证不能为空',
                      type: 'warning'
                    });
                    return
	      		}
	      		that.$http({
						  method:'post',
						  url: '/user/login',
						  params:{
						  	'admin_name':that.username,
							'password':that.password,
							'veri_code':that.captcha
						  }
						}).then(function (res) {							
							if(res.data.error==0){//登录成功
								window.localStorage.setItem("access_token",JSON.stringify(res.data.data.token_admin));
								window.localStorage.setItem("userid",JSON.stringify(res.data.data.admin_id));
								window.localStorage.setItem("shopid",JSON.stringify(res.data.data.shop_id));
								if (that.$route.params.redirect) {
				                    that.$router.push({
				                      path: that.$route.params.redirect
				                    })
				                } else {
					                that.$message({
			                          message: '登录成功',
			                          type: 'success'
			                        });
				                	//window.location.href='/#/index';
				                  that.$router.push({
				                    path: '/index'
				                  })
				                }
				                //window.location.reload();
				                //console.log(that.userInfo);
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
</script>
<style scoped>
	.codeimg{cursor: pointer;margin-top:-57px;float:right; width: 130px; height: 42px }
	.form-tip{text-align: left; height: 30px; color: #ff0000;}
	.middle-box{padding-top: 0}
	.loginscreen.middle-box{position: absolute; left: 50%; top: 50%;  margin: -200px 0 0 -200px;}
	.login-wt-bg{ width:400px; height:400px; background-color: #FFF; border-radius: 6px}
	.login-wt-bg>div{width:337px; margin:0 auto}
	.login-wt-bg input{height: 42px; padding-left: 42px}
	.uname{background: url("../assets/img/uname.png") 14px center no-repeat;}
	.upwd{background: url("../assets/img/upwd.png") 14px center no-repeat;}
	.yzm{background: url("../assets/img/uyzm.png") 14px center no-repeat; width: 193px; }
	.login-tit{height:90px; line-height:100px;font-size: 28px; font-weight: 100; color: #2EB6E3}
	.login-btn{height: 42px; margin-top: 20px; font-size: 18px;}
	.login-form>div{position:relative;}
	.login-form>div>i{position:absolute; display: inline-block; width: 20px; height: 20px; background-position: center center; background-repeat: no-repeat; left: 10px; top: 10px;}
	.login-form .form-group input.form-control{height: 42px;}
</style>
