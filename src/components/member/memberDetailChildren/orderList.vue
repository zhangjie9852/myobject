<template>
  <div>
    <div class="panel blank-panel">
      <div class="panel-heading">
        <div class="panel-options">
          <ul class="nav nav-tabs">
            <li v-for="(item,index) in orderCount" :class="[tabIndex==index?'active':'']" @click="getOrderLists(index,1,pageData.Perpage,false)">
              <a href="javascript:;">{{item.title}}({{item.count}})</a>
            </li>
          </ul>
        </div>
      </div>
      <div class="panel-body">
        <div class="tab-content">
          <form action="#" class="form-inline m-b-md" role="form">
            <div class="form-group m-r-xs m-t-xs">
              <input type="text" class="form-control" name="keyword" placeholder="关键词" v-model="keyword">
            </div>
            <div class="form-group m-r-xs m-t-xs" v-show="tabIndex!=2">
              <select class="form-control" name="payment_id" v-model="paymentId">
                <option :value="null">支付类型</option>
                <option value="3">余额支付</option>
                <option value="2">微信支付</option>
                <option value="1">支付宝支付</option>
                <option value="4">银联支付</option>
              </select>
            </div>
            <div class="form-group m-r-xs m-t-xs">
              <select class="form-control" name="status_order" v-model="statusOrder">
                <option :value="null">订单总状态</option>
                <option value="0">未开始</option>
                <option value="1">进行中</option>
                <option value="2">已完成</option>
                <option value="9">已取消</option>
              </select>
            </div>
            <div class="form-group m-r-xs m-t-xs" v-show="tabIndex!=2 && tabIndex!=4">
              <select class="form-control" name="status_pay" v-model="statusPay">
                <option :value="null">支付状态</option>
                <option value="0">未支付</option>
                <option value="4">付款中</option>
                <option value="1">已支付</option>
                <option value="2">退款中</option>
              </select>
            </div>
            <div class="form-group m-r-xs m-t-xs" v-show="tabIndex!=1 && tabIndex!=4">
              <select class="form-control" name="status_deliver" v-model="statusDeliver">
                <option :value="null">配送状态</option>
                <option value="0">未发货</option>
                <option value="1">配货中</option>
                <option value="2">发货中</option>
                <option value="3">已发货</option>
                <option value="4">已收货</option>
              </select>
            </div>
            <div class="form-group m-r-xs m-t-xs" v-show="tabIndex!=1 && tabIndex!=4">
              <select class="form-control" name="status_check" v-model="statusCheck">
                <option :value="null">审核状态</option>
                <option value="0">未审核</option>
                <option value="1">已审核</option>
                <option value="9">审核不通过</option>
              </select>
            </div>
            <div class="form-group m-r-xs m-t-xs">
              <a href="javascript:;" class="btn" :class="[amountRange?' btn-white':' btn-primary']" @click="dialogAmountVisible=true">
                {{amountRange?'金额：￥'+amountRange.replace(',','-'):'订单金额范围'}}
                <em @click.stop="closedAmount">&times;</em>
              </a>
            </div>
            <div class="form-group m-r-xs m-t-xs">
              <a href="javascript:;" class="btn" :class="[dateRange?' btn-white':' btn-primary']" @click="dialogDateVisible=true">
                {{dateRange?'日期：'+dateRange.replace(',','-'):'日期范围'}}
                <em @click.stop="closedDate">&times;</em>
              </a>
            </div>
            <div class="form-group m-r-xs m-t-xs">
              <button type="button" class="btn btn-primary" @click="getOrderLists(tabIndex,1,pageData.Perpage,true)">查询</button>
            </div>
          </form>
          <div class="table-responsive clearfix">
            <table class="table table-striped table-bordered table-hover">
              <thead>
              <tr>
                <th>订单编号</th>
                <th>商家名称</th>
                <th>收货人</th>
                <th>支付方式</th>
                <th>支付渠道</th>
                <th>来源</th>
                <th>金额标签</th>
                <th>订单状态</th>
                <th>下单时间</th>
                <th>操作</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item,index) in orderLists">
                <td>{{item.order_no}}</td>
                <td class="text-org">{{item.shop_name}}</td>
                <td>
                  <div>{{item.user_name}}</div>
                  <div>[TEL: {{item.user_mobile}}]</div>
                </td>
                <td>{{item.pay_type}}</td>
                <td>{{item.payment_id}}</td>
                <td>来源：{{item.order_source}}</td>
                <td>
                  <div><span class="inner-label">订单总金额：</span><span class="inner-amount">￥ {{item.order_amount}}</span></div>
                  <div><span class="inner-label">实付金额：</span><span class="inner-amount">￥ {{item.real_amount}}</span></div>
                </td>
                <td>
                  <div :class="{'text-red':item.status_order=='已取消'}">{{item.status_order}}</div>
                  <div>{{item.status_pay}}</div>
                  <div>{{item.status_deliver}}</div>
                </td>
                <td>{{item.time_create}}</td>
                <td>
                  <div class="single-opt">
                    <router-link :to="'/order/detail/'+item.order_id+'/'+encodeURIComponent(item.pay_type)"><i class="icon_l_see"></i> 查看</router-link>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
            <div v-if="orderLists.length==0" class="text-center">暂无信息</div>
            <div class="hj_fr">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageData.PageID"
                :page-sizes="PSLists"
                :page-size="pageData.Perpage"
                v-show="orderLists.length>0"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageData.Results">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="选择订单金额" :visible.sync="dialogAmountVisible">
      <div>
        <el-input placeholder="请输入最小金额" v-model="amountLow" @focus="amountError=false">
          <template slot="prepend">￥</template>
        </el-input>
        <span>-</span>
        <el-input placeholder="请输入最大金额" v-model="amountHigh" @focus="amountError=false">
          <template slot="prepend">￥</template>
        </el-input>
      </div>
      <div class="validate-error" v-if="amountError">最小金额不能大于最大金额</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelAmount">取消</el-button>
        <el-button type="primary" @click="confirmAmount">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择订单日期" :visible.sync="dialogDateVisible">
      <div>
        <el-date-picker type="date" placeholder="选择开始日期" v-model="startDate" @change="changeStartDate"></el-date-picker>
        <span>-</span>
        <el-date-picker type="date" placeholder="选择结束日期" v-model="endDate" @change="changeEndDate"></el-date-picker>
      </div>
      <div class="validate-error" v-if="dateError">开始日期不能大于结束日期</div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancelDate">取消</el-button>
        <el-button type="primary" @click="confirmDate">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
  import {pageSizes} from '../../comms/main.js'
  export default{
    props:['userId'],
    data () {
      return {
        orderLists:[],
        keyword:"",
        paymentId:null,
        statusOrder:null,
        statusPay:null,
        statusDeliver:null,
        statusCheck:null,
        amountRange:null,
        amountLow:null,
        amountHigh:null,
        dialogAmountVisible:false,
        amountError:false,
        dateRange:null,
        startDate:null,
        endDate:null,
        dialogDateVisible:false,
        dateError:false,
        checkAllFlag:false,
        selectedList:[],
        PSLists:pageSizes,
        pageData:{
          PageID:1,
          Perpage:10,
          Results:1,
          Pages:1
        },
        orderCount:[],
        tabIndex:0,
        queryFlag:false
      }
    },
    methods:{
      getOrderCount () {
        var that = this;
        that.$http({
          method:'post',
          url: '/order/getOrderCount',
          params:{
            user_id:that.userId
          }
        }).then(function (res) {
          if(res.data.error=='0'){
            that.orderCount=res.data.data.table_data;
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
            message: '订单信息加载失败，请重新加载!'
          });
        });
      },
      /*
       * index tab选项卡的索引
       * pageID 请求的是第几页
       * Perpage 每页几条数据
       * flag true代表有查询条件，false代表无查询条件
       * */
      getOrderLists (index,pageID,Perpage,flag) {
        var that=this;
        that.tabIndex=index;
        that.queryFlag=flag;
        that.checkAllFlag=false;
        that.selectedList=[];
        var paramObj={
          PageID:pageID,
          Perpage:Perpage,
          user_id:that.userId
        };
        switch (index){
          case 1:
            paramObj["status_check"]=0;
            break;
          case 2:
            paramObj["status_pay"]=0;
            break;
          case 3:
            paramObj["status_check"]=1;
            paramObj["status_deliver"]=0;
            break;
          case 4:
            paramObj["status_order"]=2;
            break;
        }

        if(flag){
          if(that.keyword!=""){
            paramObj["keyword"]=that.keyword;
          }
          if(that.paymentId){
            paramObj["payment_id"]=that.paymentId;
          }
          if(that.statusOrder){
            paramObj["status_order"]=that.statusOrder;
          }
          if(that.statusPay){
            paramObj["status_pay"]=that.statusPay;
          }
          if(that.statusDeliver){
            paramObj["status_deliver"]=that.statusDeliver;
          }
          if(that.statusCheck){
            paramObj["status_check"]=that.statusCheck;
          }
          if(that.amountRange){
            paramObj["order_amount"]=that.amountLow+","+that.amountHigh;
          }
          if(that.dateRange){
            paramObj["order_date"]=that.startDate+","+that.endDate
          }
        }else{
          that.keyword="";
          that.paymentId=null;
          that.statusOrder=null;
          that.statusPay=null;
          that.statusDeliver=null;
          that.statusCheck=null;
          that.amountRange=null;
          that.amountLow=null;
          that.amountHigh=null;
          that.dateRange=null;
          that.startDate=null;
          that.endDate=null;
        }
        that.$http({
          method:'post',
          url: '/order/listdata',
          params:paramObj
        }).then(function (res) {
          if(res.data.error=='0'){
            that.orderLists=res.data.data.table_data;
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
            message: '订单信息加载失败，请重新加载!'
          });
        });
      },
      closedAmount () {
        this.amountLow=null;
        this.amountHigh=null;
        this.amountRange = null;
      },
      cancelAmount () {
        this.dialogAmountVisible=false;
        if(this.amountRange){
          this.amountLow=this.amountRange.split(",")[0];
          this.amountHigh=this.amountRange.split(",")[1];
        }else {
          this.amountLow=null;
          this.amountHigh=null;
        }
      },
      confirmAmount () {
        if(this.amountLow && this.amountHigh && (parseFloat(this.amountLow)>parseFloat(this.amountHigh))){
          this.amountError=true;
        }else{
          this.dialogAmountVisible=false;
          if(this.amountLow || this.amountHigh){
            this.amountRange = (this.amountLow?this.amountLow:'')+','+(this.amountHigh?this.amountHigh:'')
          }else{
            this.amountRange = null
          }
          this.getOrderLists(this.tabIndex,1,this.pageData.Perpage,true);
        }
      },
      changeStartDate (val) {
        this.dateError=false;
        this.startDate=val;
      },
      changeEndDate (val) {
        this.dateError=false;
        this.endDate=val;
      },
      closedDate (){
        this.startDate=null;
        this.endDate=null;
        this.dateRange = null;
      },
      cancelDate () {
        this.dialogDateVisible=false;
        if(this.dateRange){
          this.startDate=this.dateRange.split(",")[0];
          this.endDate=this.dateRange.split(",")[1];
        }else {
          this.startDate=null;
          this.endDate=null;
        }
      },
      confirmDate () {
        if(this.startDate && this.endDate && (this.startDate>this.endDate)){
          this.dateError=true;
        }else{
          this.dialogDateVisible=false;
          if(this.startDate || this.endDate){
            this.dateRange = (this.startDate?this.startDate:'')+','+(this.endDate?this.endDate:'')
          }else{
            this.dateRange = null
          }
          this.getOrderLists(this.tabIndex,1,this.pageData.Perpage,true);
        }
      },
      handleSizeChange(val) {
        this.pageData.Perpage = val;
        this.getOrderLists(this.tabIndex,1,this.pageData.Perpage,this.queryFlag);
      },
      handleCurrentChange(val) {
        this.getOrderLists(this.tabIndex,val,this.pageData.Perpage,this.queryFlag);
      }
    },
    mounted () {
      this.$nextTick(function () {
        var that=this;
        setTimeout(function(){
          that.getOrderCount();
          that.getOrderLists(0,1,that.pageData.Perpage,false);
        },20)
      })
    }
  }
</script>

<style scoped>
  .tab-content{
    overflow-x: auto;
  }
  .table-responsive{
    min-width: 1072px;
    padding-bottom: 50px;
  }
  .table thead tr th,.table tbody tr td{
    text-align: center;
    vertical-align: middle;
  }
  .inner-label{
    width:75px;
    display: inline-block;
    text-align: right;
  }
  .inner-amount{
    min-width:60px;
    display: inline-block;
    text-align: left;
  }
  .single-opt a{
    color: #676a6c;
  }
  .single-opt:hover a{
    color:#3EA0C4;
  }
  .nav-tabs > li.active > a,
  .nav-tabs > li.active > a:hover,
  .nav-tabs > li.active > a:focus{
    border-bottom: 1px solid #fff;
  }
  .btn-primary em{
    display: none;
  }
  .btn-white em{
    font-size: 16px;
    line-height:20px;
    color: #999;
    margin-left:6px;
    vertical-align: top;
  }
  .btn-white:hover em{
    color: #333;
  }
  .el-input{
    width:200px;
  }
  .validate-error{
    color: red;
    margin-top: 8px;
  }
</style>
