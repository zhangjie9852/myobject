<template>
  <div class="table-responsive clearfix">
    <table class="table table-striped table-bordered table-hover">
      <thead>
      <tr>
        <th>收货人</th>
        <th>联系地址</th>
        <th>联系电话</th>
        <th>邮政编码</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item,index) in deliveryAddrList">
        <td>{{item.accept_name}}</td>
        <td>[{{item.province_name}} {{item.city_name}} {{item.area_name}}] {{item.accept_street}}</td>
        <td>{{item.accept_mobile}}</td>
        <td>{{item.accept_zip}}</td>
        <td>
          <div class="single-opt" @click="removeSingle(item.accept_id)"><a href="javascript:;"><i class="icon_l_delete"></i> 删除</a></div>
        </td>
      </tr>
      </tbody>
    </table>
    <div v-if="deliveryAddrList.length==0" class="text-center">暂无信息</div>
    <div class="hj_fr">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageData.PageID"
        :page-sizes="PSLists"
        :page-size="pageData.Perpage"
        v-show="deliveryAddrList.length>0"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.Results">
      </el-pagination>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {CustomFun,pageSizes} from '../../comms/main.js'
  export default{
    props:['userId'],
    data () {
      return{
        deliveryAddrList: {},
        PSLists:pageSizes,
        pageData:{
          PageID:1,
          Perpage:10,
          Results:1,
          Pages:1
        }
      }
    },
    methods:{
      getDeliveryAddrList (id,pageID,Perpage) {
        var that=this;
        that.$http({
          method:'post',
          url: '/member_address/listdata',
          params:{
            user_id:id,
            PageID:pageID,
            Perpage:Perpage
          }
        }).then(function (res) {
          if(res.data.error=='0'){
            that.deliveryAddrList=res.data.data.table_data;
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
          that.$message({
            type: 'error',
            message: '收货信息加载失败，请重新加载!'
          });
        });
      },
      handleSizeChange(val) {
        this.pageData.Perpage = val;
        this.getDeliveryAddrList(this.userId,1,this.pageData.Perpage);
      },
      handleCurrentChange(val) {
        this.getDeliveryAddrList(this.userId,val,this.pageData.Perpage);
      },
      removeSingle (id) {
        var that=this;
        this.$confirm('确认删除此条收货信息吗？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal:false
        }).then(() => {
          that.$http({
            method:'post',
            url: '/member_address/batchsubmit',
            params:{
              user_id:that.userId,
              accept_id:id,
              method:"-3"
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '收货信息删除成功!'
              });
              that.getDeliveryAddrList(that.userId,1,that.pageData.Perpage);
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
              message: '收货信息删除失败，请重新提交!'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      }
    },
    mounted () {
      this.$nextTick(function () {
        var that=this;
        setTimeout(function(){
          that.getDeliveryAddrList(that.userId,1,that.pageData.Perpage);
        },20)
      })
    }
  }
</script>

<style scoped>
  .table thead tr th,.table tbody tr td{
    text-align: center;
    vertical-align: middle;
  }
  .single-opt a{
    color: #676a6c;
  }
  .single-opt:hover a{
    color:#3EA0C4;
  }
</style>
