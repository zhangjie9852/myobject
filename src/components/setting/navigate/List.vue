<template>
  <div id="Brand">
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-content">
                            <form action="#" class="form-inline m-b-sm" role="form">
                                <!--<div class="form-group">
                                  <input name="title" v-model="title" type="text" class="form-control m-r-xs" placeholder="导航名称" @keyup.enter="getList(pageData.PageID)">
                                </div>
                                <div class="form-group m-r-xs">
                                  <select class="form-control" name="nav_parent" v-model="nav_parent">
                                    <option :value="null">导航类型</option>
                                    <option value="0">电脑端导航</option>
                                    <option value="1">移动端导航</option>
                                  </select>
                                </div>
                                <button type="button" class="btn btn-m btn-primary" @click="getList(pageData.PageID)">查询</button>
                                <button type="button" class="btn btn-m btn-warning m-l-xs" @click="batchOpt('del','删除')">批量删除</button>
                                <router-link to="/setting/navigation/add" class="btn btn-m btn-danger hj_fr">添加导航</router-link>-->
                                <el-button  type="warning" class="m-r-sm" @click="batchOpt('del','删除')">批量删除</el-button>
                                <el-input class="m-r-sm m-b-sm" name="title" v-model="title" placeholder="导航名称"></el-input>
                                <el-select class="m-r-xs m-b-sm" name="nav_parent" v-model="nav_parent">
                                  <el-option :key="null" label="导航类型" :value="null"></el-option>
                                  <el-option :key="0" label="电脑端导航" value="0"></el-option>
                                  <el-option :key="1" label="移动端导航" value="1"></el-option>
                                </el-select>
                                <el-button class="search-btn" type="primary" icon="search" @click="getList(pageData.PageID)">筛选</el-button>
                                <router-link to="/setting/navigation/add" class="add-btn"><i class="shop icon-xinzeng"></i>添加导航</router-link>
                            </form>                                
                            <div class="table-responsive clearfix">
                                <table class="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th class="table-checkbox">
                                              <div class="checkbox-square-green" :class="{'checked':checkAllFlag}" @click="checkedAll(clist)">
                                                <input type="checkbox" class="checks"></div>
                                            </th>
                                            <th>导航名称</th>
                                            <th>导航描述</th>     
                                            <th>导航类型</th>    
                                            <th>是否显示</th>
                                            <th>是否新窗口</th>
                                            <th>排序</th>
                                            <th class="opt-select">操作</th>
                                        </tr>
                                    </thead>                                    
                                    <tbody>                                     
                                        <tr v-for="(item,index) in clist">
                                            <td>
                                              <div class="checkbox-square-green" :class="{'checked':item.isChecked}" @click="chkSelectAndAll(clist,item)">
                                                                      <input type="checkbox" class="checks"></div>
                                            </td>        
                                            <td>{{item.sys_nav_name}}</td>
                                            <td><span class="listDesc" :title="item.remark">{{item.remark}}</span></td>
                                            <td>{{item.nav_parent_name}}</td>
                                            <td>
                                              <el-switch
                                                v-model="item.open_type"
                                                on-text=""
                                                off-text=""
                                                :on-value="1" :off-value="0"
                                                @change="changeOpen(item)"
                                               >
                                              </el-switch>
                                            </td>
                                            <td>
                                              <el-switch
                                                v-model="item.open_new_window"
                                                on-text=""
                                                off-text=""
                                                :on-value="1" :off-value="-1"
                                                @change="changeWindow(item)"
                                               >
                                              </el-switch>
                                            </td>
                                            <td>
                                              <input type="text" :value="item.sort" class="w100" @keyup.enter="editSort(item.id,item.sort)" @blur="editSort(item.id,item.sort)" v-model="item.sort" />
                                            </td>
                                            <td class="opt">
                                              <span class="opt-down shop icon-shezhicaozuo" @click.stop="viewOpt(clist,'id',item.id)"></span>
                                                <ul v-show="item.isOptShow">
                                                    <li><router-link :to="'/setting/navigation/edit/'+item.id"> 编辑</router-link></li>
                                                    <li><a @click="delOne(item.id)">删除</a></li>
                                                </ul>                                             
                                           </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div v-show="clist.length==0" class="text-center">暂无信息</div>
                                <div class="hj_fr">
                                  <el-pagination
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"
                                    :current-page="pageData.PageID"
                                    :page-sizes="PSLists"
                                    :page-size="pageData.Perpage"
                                    v-show="pageData.Results>1"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="pageData.Results">
                                  </el-pagination>
                                </div>
                            <div>
                        </div>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>          
  </div>
</template>
<script>  
  import HjCrumb from '../../comms/BreadCrumb.vue'
  import {CustomFun,pageSizes} from '../../comms/main.js'
  export default{
    components:{        
        HjCrumb
      },
    data(){
      return {       
        title:'',                
        PSLists:pageSizes,               
        CrumbBox:{
            CrumbList:
            [
              {
                title:'系统设置',
                url:'/setting/navigation/list'
              },
              {
                title:'导航设置',
                url:''
              }              
            ]
          },
        clist:[],
        selectedList:[],
        checkAllFlag:false,
        nav_parent:null,
        pageData:{          
          PageID:1,
          Perpage:10,
          Results:1,
          Pages:1                 
        }
      }
    },                   
    mounted(){
      this.$nextTick(function () {
        this.getList(1);  //列表数据
        var that=this;
        document.addEventListener("click",function(event){
          if(!this.contains(this.$el,event.target)){
            if(that.clist.length>0){
              that.clist.forEach(function (item,index) {
                if(typeof item.isOptShow=="undefined"){
                  that.$set(item,"isOptShow",false);
                }else{
                  item.isOptShow=false;
                }
              })
            }
          }
        },false);        
      })  
    },      
    methods:{        
        checkedAll:CustomFun.checkedAll,
        chkSelectAndAll:CustomFun.chkSelectAndAll,      
        viewOpt:CustomFun.viewOpt,     
        handleSizeChange(val) {
            this.pageData.Perpage = val;
            this.getList(1);
        },
        handleCurrentChange(val) {
           this.getList(val);
        },
        delOne:function(id){        
            var that=this;
            this.$confirm('确认删除此信息吗？', '提示', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              that.$http({
                method:'post',
                url: '/nav/batchsubmit',
                params:{
                  'nav_ids':id,
                  'method':'del'            
                }
              }).then(function (res) {                
                that.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                that.getList(1);
              }).catch(function (error) {
                console.log(error);
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });
        },
        batchOpt:function(status,prompt){
            var that=this;            
            if(that.selectedList.length>0){
              var selectedId=[];
              var isRight=true;
              that.selectedList.forEach(function(item,index){
                selectedId.push(item.id);              
              })
              if(isRight&&selectedId.length>0){
                this.$confirm('确定要批量【'+prompt+'】吗？', '提示', {
                  confirmButtonText: '确认',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  that.$http({
                    method:'post',
                    url: '/nav/batchsubmit',
                    params:{
                      'nav_ids':selectedId.join(','),
                      'method':status
                    }
                  }).then(function (res) {
                    that.$message({
                      type: 'success',
                      message: '操作成功!'
                    });
                    if(status=="del"){                      
                      that.getList(1);
                    }else{                      
                      that.getList(that.pageData.PageID);
                    }                   
                  }).catch(function (error) {
                    console.log(error);
                  });
                }).catch(() => {
                  //已取消
                });
              }
            }else{
              this.$message({
                type: 'warning',
                message: '请至少选择一条数据!'
              });
            }
        },       
        getList:function(page) {
          var that = this; 
          that.checkAllFlag=false;
          that.selectedList=[];      
            that.$http({
              method:'post',
              url: '/nav/listdata',
              params:{
              'sys_nav_name':that.title,
              'nav_parent':that.nav_parent,
              'Perpage':that.pageData.Perpage,
              'PageID':page
              }       
            }).then(function (res) {
            //console.log(res)             
              if(res.data.error==0){
                that.clist = res.data.data.table_data;      
                that.pageData.PageID  = res.data.data.PageID;
                that.pageData.Perpage = res.data.data.Perpage;
                that.pageData.Results = res.data.data.Results;
                that.pageData.Pages   = res.data.data.Pages;
              }else{
                that.$message({
                  message: res.data.desc,
                  type: 'warning'
                });                            
              }             
            }).catch(function (error) {
              console.log(error);
            });
      },
      changeWindow:function(item){//开关         
            var that = this;
            var flag = item.open_new_window;           
            that.$http({
              method: 'post',
              url: '/nav/batchsubmit',
              params: {
                nav_ids: item.id,
                window: flag,
                method:'window'
              }
            }).then(function (res) {
              if(res.data.error=='0'){
                that.getList(that.pageData.PageID);
              }else {
                that.$message({
                  type: 'error',
                  message: res.data.desc
                });
              }
            }).catch(function (error) {
              console.log(error);
            })
      },
      changeOpen:function(item){//开关         
            var that = this;
            var flag = item.open_type;           
            that.$http({
              method: 'post',
              url: '/nav/batchsubmit',
              params: {
                nav_ids: item.id,
                open: flag,
                method:'open'
              }
            }).then(function (res) { 
              if(res.data.error=='0'){
                that.getList(that.pageData.PageID);
              }else {
                that.$message({
                  type: 'error',
                  message: res.data.desc
                });
              }
            }).catch(function (error) {
              console.log(error);
            })
      },
      editSort:function(cid,csort){//排序
        var that = this;          
        event.currentTarget.blur();
        that.$http({
              method:'post',
              url: '/nav/batchsubmit',
              params:{
              'nav_ids':cid,
              'sort':csort,
              'method':'sort'
              }       
            }).then(function (res) {
              if(res.data.error==0){
                that.getList(that.pageData.PageID);
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
