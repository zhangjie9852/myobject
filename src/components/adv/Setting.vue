<template>
  <div>
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-title">
              <h5>广告位列表</h5>
            </div>
            <div class="ibox-content">
              <form action="#" class="form-inline m-b-md" role="form">
                <div class="form-group m-r-xs m-t-xs">
                  <input type="text" class="form-control" name="ad_position_name" placeholder="广告位名称" v-model="adPositionName">
                </div>
                <div class="form-group m-r-xs m-t-xs">
                  <button type="button" class="btn btn-primary" @click="getAdPositionList(1,pageData.Perpage,true)">查询</button>
                </div>
                <div class="form-group m-t-xs">
                  <button type="button" class="btn btn-primary m-r-xs" @click="remove">批量删除</button>
                  <router-link to="/adv/setting/add" class="btn btn-warning">添加广告位</router-link>
                </div>
              </form>
              <div class="table-responsive clearfix">
                <table class="table table-striped table-bordered table-hover">
                  <thead>
                  <tr>
                    <th>
                      <div class="checkbox-square-green" :class="{'checked':checkAllFlag}" @click="checkedAll(adPositionList)">
                        <input type="checkbox" class="checks">
                      </div>
                    </th>
                    <th>广告位名称</th>
                    <th>商家名称</th>
                    <th>广告位描述</th>
                    <th>是否启用</th>
                    <th>创建时间</th>
                    <th class="opt-select">操作</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item,index) in adPositionList">
                    <td>
                      <div class="checkbox-square-green" :class="{'checked':item.isChecked}" @click="chkSelectAndAll(adPositionList,item)">
                        <input type="checkbox" class="checks">
                      </div>
                    </td>
                    <td>{{item.ad_position_name}}</td>
                    <td>{{item.goods_shop_base_name}}</td>
                    <td>{{item.ad_position_desc}}</td>
                    <td>
                      <el-switch
                        v-model="item.is_open"
                        on-text=""
                        off-text=""
                        :on-value="1" :off-value="-1"
                        @change="changeInitiateStatus(item)">
                      </el-switch>
                    </td>
                    <td>{{item.time_create}}</td>
                    <td class="opt-select">
                      <div class="opt" @click.stop="viewOpt(adPositionList,'id',item.id)">处理<i class="fa fa-caret-down"></i></div>
                      <ul v-show="item.isOptShow">
                        <li><router-link :to="'/adv/setting/edit/'+item.id"><i class="icon_l_edit"></i> 编辑</router-link></li>
                        <li @click="removeSingle(item.id)"><a href="javascript:;"><i class="icon_l_delete"></i> 删除</a></li>
                      </ul>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <div v-if="adPositionList.length==0" class="text-center">暂无信息</div>
                <div class="hj_fr">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageData.PageID"
                    :page-sizes="PSLists"
                    :page-size="pageData.Perpage"
                    v-show="adPositionList.length>0"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageData.Results">
                  </el-pagination>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import HjCrumb from '../comms/BreadCrumb.vue'
  import {CustomFun,pageSizes} from '../comms/main.js'
  export default{
    components:{
      HjCrumb
    },
    data () {
      return {
        CrumbBox:{
          CrumbList:
            [
              {
                title:'运营中心',
                url:'/adv/setting'
              },
              {
                title:'广告管理',
                url:'/adv/setting'
              },
              {
                title:'广告位列表',
                url:''
              }
            ]
        },
        adPositionList:[],
        adPositionName:"",
        checkAllFlag:false,
        selectedList:[],
        PSLists:pageSizes,
        pageData:{
          PageID:1,
          Perpage:10,
          Results:1,
          Pages:1
        },
        queryFlag:false
      }
    },
    methods:{
      viewOpt:CustomFun.viewOpt,
      checkedAll:CustomFun.checkedAll,
      chkSelectAndAll:CustomFun.chkSelectAndAll,
      /*
       * pageID 请求的是第几页
       * Perpage 每页几条数据
       * flag true代表有查询条件，false代表无查询条件
       * */
      getAdPositionList (pageID,Perpage,flag) {
        var that=this;
        that.queryFlag=flag;
        that.checkAllFlag=false;
        that.selectedList=[];
        var paramObj={
          PageID:pageID,
          Perpage:Perpage
        };
        if(flag){
          if(that.adPositionName!=""){
            paramObj["ad_position_name"]=that.adPositionName;
          }
        }else{
          that.adPositionName="";
        }
        that.$http({
          method:'post',
          url: '/adposition/listdata',
          params:paramObj
        }).then(function (res) {
          if(res.data.error=='0'){
            that.adPositionList=res.data.data.table_data;
            that.pageData.Results = res.data.data.Results;
            that.pageData.Pages = res.data.data.Pages;
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
      handleSizeChange(val) {
        this.pageData.Perpage = val;
        this.getAdPositionList(1,this.pageData.Perpage,this.queryFlag);
      },
      handleCurrentChange(val) {
        this.getAdPositionList(val,this.pageData.Perpage,this.queryFlag);
      },
      changeInitiateStatus(item){
        var that = this;
        that.$http({
          method: 'post',
          url: '/adposition/batchsubmit',
          params: {
            adposition_ids: item.id,
            method:'state',
            state: item.is_open
          }
        }).then(function (res) {
          if(res.data.error=='0'){

          }else {
            that.$message({
              type: 'error',
              message: res.data.desc
            });
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      remove () {
        var that=this;
        if(that.selectedList.length>0){
          var selectedId=[];
          that.selectedList.forEach(function(item,index){
            selectedId.push(item.id);
          })
          if(selectedId.length>0){
            this.$confirm('确认删除此广告位吗？', '提示', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              that.$http({
                method:'post',
                url: '/adposition/batchsubmit',
                params:{
                  adposition_ids:selectedId.join(','),
                  method:'del'
                }
              }).then(function (res) {
                if(res.data.error=='0'){
                  that.$message({
                    type: 'success',
                    message: '广告位删除成功!'
                  });
                  that.getAdPositionList(1,that.pageData.Perpage,that.queryFlag);
                }else{
                  that.$message({
                    type: 'error',
                    message: res.data.desc
                  });
                }
              }).catch(function (error) {
                console.log(error);
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消删除'
              });
            });
          }
        }else{
          this.$message({
            type: 'warning',
            message: '请至少选择一条数据!'
          });
        }
      },
      removeSingle (id) {
        var that=this;
        this.$confirm('确认删除此广告位吗？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$http({
            method:'post',
            url: '/adposition/batchsubmit',
            params:{
              adposition_ids:id,
              method:'del'
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '广告位删除成功!'
              });
              that.getAdPositionList(1,that.pageData.Perpage,that.queryFlag);
            }else{
              that.$message({
                type: 'error',
                message: res.data.desc
              });
            }
          }).catch(function (error) {
            console.log(error);
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.getAdPositionList(1,this.pageData.Perpage,false);
        // 点击操作以外的地方，操作隐藏
        var that=this;
        document.addEventListener("click",function(event){
          if(!this.contains(this.$el,event.target)){
            if(that.adPositionList.length>0){
              that.adPositionList.forEach(function (item,index) {
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
    }
  }
</script>

<style scoped>
  .table thead tr th,.table tbody tr td{
    text-align: center;
    vertical-align: middle;
  }
  .table thead tr .opt-select{
    min-width:72px;
    text-align: right;
    padding-right: 20px;
  }
  .table tbody tr .opt-select{
    min-width:72px;
    position: relative;
    text-align: right;
  }
  .opt-select .opt{
    display: inline-block;
    cursor: pointer;
  }
  .opt-select .opt i{
    margin-left:5px;
  }
  .opt-select ul{
    margin-top: 12px;
    background-color: #fff;
    border: 1px solid #d2d2d2;
    padding: 0 8px;
    text-align: left;
    position: absolute;
    right: 0;
    top: 50%;
    z-index: 1000;
  }
  .opt-select ul li{
    line-height:32px;
    border-top:1px dashed #d2d2d2;
  }
  .opt-select ul li:first-child{
    border-top:0;
  }
  .opt-select ul li a{
    color: #676a6c;
  }
  .opt-select ul li:hover a{
    color:#3EA0C4;
  }
</style>
