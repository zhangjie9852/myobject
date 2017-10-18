// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Loading from './components/Loading'
import stores from './store/store'
import filters from './filters/index.js'
import vueForm from 'vue-form'
import axios from 'axios'
import $ from 'jquery'

import './assets/css/bootstrap.min.css';
import './assets/font-awesome/css/font-awesome.css';
import './assets/css/animate.css';
import './assets/css/style.css';
import { Dialog,Switch,Upload,Button,MessageBox,Message,Pagination,Select,Option,DatePicker,Input,Tabs,TabPane,Tooltip,Cascader,Radio,RadioGroup,RadioButton,Checkbox,CheckboxGroup} from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import "./assets/css/radio_checkbox.css"
import "./assets/css/public.css"
import './assets/css/main.css';


Object.keys(filters).forEach(key => Vue.filter(key, filters[key]))

Vue.use(Loading);
Vue.use(Pagination);
Vue.use(vueForm);
Vue.use(Upload);
Vue.use(Switch);
Vue.use(Dialog);
Vue.use(Button);
Vue.use(Select);
Vue.use(Option);
Vue.use(DatePicker);
Vue.use(Input);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Tooltip);
Vue.use(Cascader);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);

axios.interceptors.request.use(function (config) {  //配置发送请求的信息
  stores.dispatch('showLoading')
  return config;
}, function (error) {
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) { //配置请求回来的信息
  stores.dispatch('hideLoading');
  //验证身份有效期
  if(response){
      switch (response.data.error) {
          case "-40350":
              // -40350 清除token信息并跳转到登录页面
              sessionStorage.clear();
              window.localStorage.clear();
              router.replace({
                  path: '/login'                  
              });              
              break;
      }
  }
  return response;
}, function (error) {
  return Promise.reject(error);
});

axios.defaults.baseURL='/hjshop';

Vue.prototype.$http = axios;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$message = Message;
Vue.config.productionTip = false



/* eslint-disable no-new */
var vm = new Vue({
  el: '#app',
  router,
  store:stores,
  watch:{
    "$route" : 'checkLogin'
  },
  created() {
    this.checkLogin();
  },
  methods:{
    checkLogin(){
       //检查是否存在session
      if(!window.localStorage.getItem('access_token')){
        //如果没有登录状态则跳转到登录页
        this.$router.push('/login');
      }else{
        //否则跳转到登录后的页面
        this.$router.push({
          path: this.$route.params.redirect
        })
        axios.defaults.headers.common['token_admin'] = window.localStorage.getItem('access_token');
        axios.defaults.headers.common['admin_id'] = window.localStorage.getItem('userid');
      }
    }
  },
  template: '<App/>',
  components: { App }
})
export default vm
