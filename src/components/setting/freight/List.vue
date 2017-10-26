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
                                  <input name="title" v-model="title" type="text" class="form-control m-r-xs" placeholder="模板名称" @keyup.enter="getList(pageData.PageID)">
                                </div>
                                <button type="button" class="btn btn-m btn-primary" @click="getList(pageData.PageID)">查询</button>
                                <router-link to="/setting/freight/add" class="btn btn-m btn-danger hj_fr">添加模板</router-link>-->
                                <el-input class="m-r-sm m-b-sm" name="title" v-model="title" placeholder="模板名称" @keyup.enter="getList(pageData.PageID)"></el-input>
                                <el-button class="search-btn" type="primary" icon="search"  @click="getList(pageData.PageID)">筛选</el-button>
                                <router-link to="/setting/freight/add"  class="add-btn"><i class="shop icon-xinzeng"></i> 添加模板</router-link>
                            </form>                                
                            <div class="table-responsive clearfix">
                                <table class="table table-striped table-bordered table-hover">
                                    <thead>
                                        <tr>
                                            <th>模板名称</th>
                                            <th>保价费用</th>
                                            <th>费用计算方式</th>    
                                            <th>货到付款</th>
                                            <th class="opt-select">操作</th>
                                        </tr>
                                    </thead>                                    
                                    <tbody>                                     
                                        <tr v-for="(item,index) in clist">         
                                            <td>{{item.templet_name}}</td>
                                            <td>{{item.insured_cost}}元</td>
                                            <td>
                                              <template v-if="item.calculation==1">按件数计算({{item.unit_freight}}元/件)</template>
                                              <template v-else>按重量计算({{item.default_freight}}元/{{item.default_weight}}kg)</template>
                                            </td>
                                            <td>
                                              <template v-if="item.cash_on_delivery==1">是</template>
                                              <template v-else>否</template>
                                            </td>
                                            <td class="opt">
                                              <span class="opt-down shop icon-shezhicaozuo" @click.stop="viewOpt(clist,'id',item.id)"></span>
                                                <ul v-show="item.isOptShow">
                                                    <li><router-link :to="'/setting/freight/edit/'+item.id"> 编辑</router-link></li>
                                                    <li><a @click="delOne(item.id)"> 删除</a></li>
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
                url:'/setting/freight/list'
              },
              {
                title:'运费模板',
                url:''
              }              
            ]
          },
        clist:[], 
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
              url: '/freight_temp/deleteSubmit',
              params:{
                'ids':id            
              }
            }).then(function (res) {
              //console.log(res)
              if(res.data.error==0){
                that.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                that.getList(1);
             }else{
              that.$message({
                message: res.data.desc,
                type: 'warning'
              });
             } 
            }).catch(function (error) {
              console.log(error);
            });
          }).catch(() => {
            //取消
          });
        },        
        getList(page) {
          var that = this;       
            that.$http({
              method:'post',
              url: '/freight_temp/listdata',
              params:{
              'templet_name':that.title,
              'shop_id':JSON.parse(window.localStorage.getItem("shopid")),
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
      }                  
    }
  }
</script>
