import {
	HIDE_LOADING,
	SHOW_LOADING,
	HIDE_TREE,
	SHOW_TREE,
	UPDATE_USER_INFO,
	CATE_PARENT_ID,
	CATE_CHANGE_ID,
	GALLERY_PIC_URL
} from './type'

const state={
	loading:false,
	tree:false,
	domain:'http://106.15.94.230:8080', 
	Imgpath:'http://120.24.240.78:8084/hejia_img', 
	cate_parent_id:0,
	cate_changed:{
		id:0,
		name:null,
		codes:null
	},
	userInfo: { //保存用户信息
      upic: null,
      systit: null,
      realname:null,
      userid: null,
      access_token: null      
    },
    galleryUrl:''   
};

const mutations={
	/*loading*/
	[HIDE_LOADING](state){
		state.loading=false;
	},
	[SHOW_LOADING](state){
		state.loading=true;
	},
	/*TREE*/
	[HIDE_TREE](state){
		state.tree=false;
	},
	[SHOW_TREE](state){
		state.tree=true;
	},
	[UPDATE_USER_INFO](state, newUserInfo) {
      state.userInfo = newUserInfo;
    },
    [CATE_PARENT_ID](state,id) {
      state.cate_parent_id = id;
    },
    [CATE_CHANGE_ID](state,changed) {
      state.cate_changed = changed;
    },
    [GALLERY_PIC_URL](state,picurl) {
      state.galleryUrl = picurl;
    }	
};

const getters={
	loading(state){
		return state.loading;
	},
	tree(state){
		return state.tree;
	},
	userInfo(state){
		return state.userInfo;
	},
	cate_parent_id(state){
		return state.cate_parent_id;
	},
	cate_changed(state){
		return state.cate_changed;
	},
	galleryUrl(state){
		return state.galleryUrl;
	}
};

export default{
	state,
	mutations,
	getters
}