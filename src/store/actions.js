//import 数据 from ''	这里面可以获取数据
import * as types from './type'

export default{	
	/*loading*/
	hideLoading:({commit})=>{
		commit(types.HIDE_LOADING)
	},
	showLoading:({commit})=>{
		commit(types.SHOW_LOADING)
	},
	/*TREE*/
	hideTree:({commit})=>{
		commit(types.HIDE_TREE)
	},
	showTree:({commit})=>{
		commit(types.SHOW_TREE)
	},
	/*UserInfo*/
	updateUserInfo:({commit,newUserInfo})=>{
		commit(types.UPDATE_USER_INFO,newUserInfo)
	},
	newParentId:({commit,updatePid})=>{
		commit(types.CATE_PARENT_ID,updatePid)
	}
}
