export const CustomFun={
	contains(arr,str){
		for(var i in arr){
			if(arr[i]==str) return true;
		}
		return false;
	},
	removeByValue(arr,str){
		for(var i in arr){
			if(arr[i]==str){
				arr.splice(i,1);
				break;
			}
		}
	},
	TimeStamp(str){
		var timestamp = Date.parse(new Date(str));
		timestamp = timestamp / 1000;
		return timestamp;
	},
	TimeStamp2(str){
		var newDate = new Date();
		newDate.setTime(str * 1000);
		newDate = newDate.toLocaleDateString();
		return newDate.replace(/\//g, "-")
	},
  setCookie: function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    console.info(cname + "=" + cvalue + "; " + expires);
    document.cookie = cname + "=" + cvalue + "; " + expires;
    //console.info(document.cookie);
  },
  //获取cookie
  getCookie: function (cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0) == ' ') c = c.substring(1);
          if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
      }
      return "";
  },  
	// Cookieset(name, value, days) {
	//     var d = new Date;
	//     d.setTime(d.getTime() + 24*60*60*1000*days);
	//     window.document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
	// },
	// Cookieget(name) {
	//     var v = window.document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
	//     return v ? v[2] : null;
	// },
	// Cookiedel(name) {
	//     vm.$set(name, '', -1);
	// },
  /*
   滚动条离头部的距离
   */
  getScrollTop() {  
          var scrollPos;  
          if (window.pageYOffset) {  
          scrollPos = window.pageYOffset; }  
          else if (document.compatMode && document.compatMode != 'BackCompat')  
          { scrollPos = document.documentElement.scrollTop; }  
          else if (document.body) { scrollPos = document.body.scrollTop; }   
          return scrollPos;   
  },
 /* 网络图片正则  */

  CheckUrl(imgurl) {  
    var ImgObj = new Image(); //判断图片是否存在  
    ImgObj.src = imgurl;  
    //没有图片，则返回-1  
    if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {  
      return true;  
    } else {  
      return false;
    }  
  } ,
  /* 价格验证  */
  priceValid(name) {  
    var myval = parseFloat(name);
    //console.log(myval);
    var myreg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/;
    if(myval !='' && myreg.test(myval)){ 
      return true;
    }else {  
      return false;
    }  
  } ,

  opToggle: function(obj,id,fid) {
     var opt = obj;
     for(var i=0; i<opt.length; i++){
       if(opt[i][fid] == id){
         opt[i].isOptShow = !opt[i].isOptShow
       }else{
         opt[i].isOptShow = false;
       }
     }
  },
  /*
  * obj 列表项
  * attr 与值对应的属性
  * val 某属性的值
  */
  viewOpt (obj,attr,val) {
    var that=this;
    obj.forEach(function (item,index) {
      if(typeof item.isOptShow=="undefined"){
        that.$set(item,"isOptShow",false);
      }
      if(item[attr]==val){
        item.isOptShow=!item.isOptShow;
      }else{
        item.isOptShow=false;
      }
    })
  },
  /*
   * obj 对象列表
   * */
  checkedAll (obj) {
    var that=this;
    that.checkAllFlag=!that.checkAllFlag;
    obj.forEach(function (item,index) {
      if(typeof item.isChecked =="undefined"){
        that.$set(item,"isChecked",that.checkAllFlag);
      }else {
        item.isChecked=that.checkAllFlag;
      }
    })
    if(that.checkAllFlag){
      that.selectedList=obj;
    }else{
      that.selectedList=[];
    }
  },
  /*
   * obj 对象列表
   * item 对象列表的某一项
   * */
  chkSelectAndAll (obj,item) {
    if(typeof item.isChecked =="undefined"){
      this.$set(item,"isChecked",true);
    }else {
      item.isChecked=!item.isChecked;
    }
    var that=this;
    that.selectedList=[];
    obj.forEach(function (item,index) {
      if(item.isChecked){
        that.selectedList.push(item);
      }
    })
    if(that.selectedList.length==obj.length){
      that.checkAllFlag=true;
    }else{
      that.checkAllFlag=false;
    }
  }
};



// export const Imgpath = 'http://59.110.217.163:8602/hejia_img'
// export const HjsevUrl  = 'http://59.110.217.163:9999/hejia_shop_admin/admin/api'
// export const sevUrl  = 'http://59.110.217.163:9999/hejia_shop_admin'
export const Imgpath = 'http://59.110.217.163:8602/hejia_img'
export const HjsevUrl  = 'http://59.110.217.163:8603/hejia_shop_admin/admin/api'
export const sevUrl  = 'http://59.110.217.163:8603/hejia_shop_admin'
export const pageSizes = [5, 10, 20]

