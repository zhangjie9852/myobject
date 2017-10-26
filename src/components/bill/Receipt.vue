<template>
  <div>
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-content">
              <form action="#" class="form-inline m-b-sm" role="form">
                <el-input class="m-r-sm m-b-sm" name="keyword" v-model="keyword" placeholder="订单编号/收款编号"></el-input>
                <el-select class="m-r-sm m-b-sm" name="payment_id" v-model="paymentId">
                  <el-option :key="null" label="支付类型" :value="null"></el-option>
                  <el-option :key="3" label="余额支付" value="3"></el-option>
                  <el-option :key="2" label="微信支付" value="2"></el-option>
                  <el-option :key="1" label="支付宝支付" value="1"></el-option>
                  <el-option :key="4" label="银联支付" value="4"></el-option>
                </el-select>
                <el-select class="m-r-sm m-b-sm" name="pay_type" v-model="payType">
                  <el-option :key="null" label="支付方式" :value="null"></el-option>
                  <el-option :key="1" label="线上付款" value="1"></el-option>
                  <el-option :key="2" label="货到付款" value="2"></el-option>
                  <el-option :key="3" label="预付款" value="3"></el-option>
                </el-select>
                <el-button :type="amountRange?'default':'primary'" class="m-r-sm m-b-sm" @click="dialogAmountVisible=true">
                  {{amountRange?'金额：￥'+amountRange.replace(',','-'):'付款金额范围'}}
                  <em class="shop icon-cha" @click.stop="closedAmount"></em>
                </el-button>
                <el-button :type="dateRange?'default':'primary'" class="m-r-sm m-b-sm" @click="dialogDateVisible=true">
                  {{dateRange?'日期：'+dateRange.replace(',','-'):'付款时间范围'}}
                  <em class="shop icon-cha" @click.stop="closedDate"></em>
                </el-button>
                <el-button class="search-btn" type="primary" icon="search" @click="getBillReceiptList(1,pageData.Perpage,true)">筛选</el-button>

                <!--<div class="form-group m-r-xs m-t-xs">-->
                  <!--<input type="text" class="form-control" name="keyword" placeholder="订单编号/收款编号" v-model="keyword">-->
                <!--</div>-->
                <!--<div class="form-group m-r-xs m-t-xs">-->
                  <!--<select class="form-control" name="payment_id" v-model="paymentId">-->
                    <!--<option :value="null">支付类型</option>-->
                    <!--<option value="3">余额支付</option>-->
                    <!--<option value="2">微信支付</option>-->
                    <!--<option value="1">支付宝支付</option>-->
                    <!--<option value="4">银联支付</option>-->
                  <!--</select>-->
                <!--</div>-->
                <!--<div class="form-group m-r-xs m-t-xs">-->
                  <!--<select class="form-control" name="pay_type" v-model="payType">-->
                    <!--<option :value="null">支付方式</option>-->
                    <!--<option value="1">线上付款</option>-->
                    <!--<option value="2">货到付款</option>-->
                    <!--<option value="3">预付款</option>-->
                  <!--</select>-->
                <!--</div>-->
                <!--<div class="form-group m-r-xs m-t-xs">-->
                  <!--<a href="javascript:;" class="btn" :class="[amountRange?' btn-white':' btn-primary']" @click="dialogAmountVisible=true">-->
                    <!--{{amountRange?'金额：￥'+amountRange.replace(',','-'):'付款金额范围'}}-->
                    <!--<em @click.stop="closedAmount">&times;</em>-->
                  <!--</a>-->
                <!--</div>-->
                <!--<div class="form-group m-r-xs m-t-xs">-->
                  <!--<a href="javascript:;" class="btn" :class="[dateRange?' btn-white':' btn-primary']" @click="dialogDateVisible=true">-->
                    <!--{{dateRange?'日期：'+dateRange.replace(',','-'):'付款时间范围'}}-->
                    <!--<em @click.stop="closedDate">&times;</em>-->
                  <!--</a>-->
                <!--</div>-->
                <!--<div class="form-group m-r-xs m-t-xs">-->
                  <!--<button type="button" class="btn btn-primary" @click="getBillReceiptList(1,pageData.Perpage,true)">查询</button>-->
                <!--</div>-->
              </form>
              <div class="table-responsive clearfix">
                <table class="table table-striped table-bordered table-hover">
                  <thead>
                  <tr>
                    <th>收款单编号</th>
                    <th>付款类型</th>
                    <th>支付渠道</th>
                    <th>支付方式</th>
                    <th>付款金额</th>
                    <th>付款时间</th>
                    <th>付款人</th>
                    <th class="opt-select">操作</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item,index) in billReceiptList">
                    <td>{{item.payee_no}}</td>
                    <td>{{item.fee_type}}</td>
                    <td>{{item.payment_id}}</td>
                    <td>{{item.pay_type}}</td>
                    <td>￥ {{item.amount_payee.toFixed(2)}}</td>
                    <td>{{item.time_create}}</td>
                    <td>{{item.user_name}}</td>
                    <td class="opt">
                      <span class="opt-down shop icon-shezhicaozuo" @click.stop="viewOpt(billReceiptList,'payee_id',item.payee_id)"></span>
                      <ul v-show="item.isOptShow">
                        <li><a href="javascript:;" @click="viewDetail(item.payee_id)">查看</a></li>
                        <li><a href="javascript:;" @click="auditingSingle(item.payee_id)">审核</a></li>
                      </ul>
                    </td>
                  </tr>
                  </tbody>
                </table>
                <div v-if="billReceiptList.length==0" class="text-center">暂无信息</div>
                <div class="hj_fr">
                  <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageData.PageID"
                    :page-sizes="PSLists"
                    :page-size="pageData.Perpage"
                    v-show="billReceiptList.length>0"
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
    <el-dialog title="收款单详情" :visible.sync="dialogDetailVisible">
      <div class="detail-title">收款单编号：<span>{{billInfo.payee_no}}</span></div>
      <div class="form-group m-t clearfix">
        <div class="col-sm-6">
          <div class="info-item">
            <label>付款类型：</label>
            <span>{{billInfo.fee_type}}</span>
          </div>
          <div class="info-item">
            <label>支付方式：</label>
            <span>{{billInfo.pay_type}}</span>
          </div>
          <div class="info-item">
            <label>付款金额：</label>
            <span>￥ {{billInfo.amount_payee}}</span>
          </div>
          <div class="info-item">
            <label>付款人：</label>
            <span>{{billInfo.user_name}}</span>
          </div>
        </div>
        <div class="col-sm-6">
          <div class="info-item">
            <label>支付渠道：</label>
            <span>{{billInfo.payment_id}}</span>
          </div>
          <div class="info-item">
            <label>支付状态：</label>
            <span class="text-org">{{billInfo.status_pay}}</span>
          </div>
          <div class="info-item">
            <label>付款时间：</label>
            <span>{{billInfo.time_create}}</span>
          </div>
        </div>
      </div>
    </el-dialog>
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
                title:'单据中心',
                url:'/bill/receipt'
              },
              {
                title:'财务单据',
                url:'/bill/receipt'
              },
              {
                title:'收款单',
                url:''
              }
            ]
        },
        billReceiptList:[],
        keyword:"",
        paymentId:null,
        payType:null,
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
        PSLists:pageSizes,
        pageData:{
          PageID:1,
          Perpage:10,
          Results:1,
          Pages:1
        },
        queryFlag:false,
        dialogDetailVisible:false,
        billInfo:{}
      }
    },
    methods:{
      viewOpt:CustomFun.viewOpt,
      /*
       * pageID 请求的是第几页
       * Perpage 每页几条数据
       * flag true代表有查询条件，false代表无查询条件
       * */
      getBillReceiptList (pageID,Perpage,flag) {
        var that=this;
        that.queryFlag=flag;
        var paramObj={
          PageID:pageID,
          Perpage:Perpage
        };
        if(flag){
          if(that.keyword!=""){
            paramObj["keyword"]=that.keyword;
          }
          if(that.paymentId){
            paramObj["payment_id"]=that.paymentId;
          }
          if(that.payType){
            paramObj["pay_type"]=that.payType;
          }
          if(that.amountRange){
            paramObj["amount_payee_begin"]=that.amountLow;
            paramObj["amount_payee_end"]=that.amountHigh;
          }
          if(that.dateRange){
            paramObj["time_payee_begin"]=that.startDate;
            paramObj["time_payee_end"]=that.endDate;
          }
        }else{
          that.keyword="";
          that.paymentId=null;
          that.payType=null;
          that.amountRange=null;
          that.amountLow=null;
          that.amountHigh=null;
          that.dateRange=null;
          that.startDate=null;
          that.endDate=null;
        }
        that.$http({
          method:'post',
          url: '/bill_payee/listdata',
          params:paramObj
        }).then(function (res) {
          if(res.data.error=='0'){
            that.billReceiptList=res.data.data.table_data;
            that.pageData.Results = res.data.data.Results;
            that.pageData.Pages = res.data.data.Pages;
          }else {
            that.$message({
              type: 'error',
              message: res.data.desc
            });
          }
        }).catch(function (error) {
          console.log(error);
          that.$message({
            type: 'error',
            message: '收款单列表加载失败，请重新加载!'
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
          this.getBillReceiptList(1,this.pageData.Perpage,true);
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
          this.getBillReceiptList(1,this.pageData.Perpage,true);
        }
      },
      handleSizeChange(val) {
        this.pageData.Perpage = val;
        this.getBillReceiptList(1,this.pageData.Perpage,this.queryFlag);
      },
      handleCurrentChange(val) {
        this.getBillReceiptList(val,this.pageData.Perpage,this.queryFlag);
      },
      viewDetail (id) {
        var that=this;
        that.dialogDetailVisible=true;
        that.$http({
          method:'post',
          url: '/bill_payee/infodata',
          params:{
            payee_id:id
          }
        }).then(function (res) {
          if(res.data.error=='0'){
            that.billInfo=res.data.data;
            that.billInfo['amount_payee']=that.billInfo['amount_payee'].toFixed(2);
          }else {
            that.$message({
              type: 'error',
              message: res.data.desc
            });
          }
        }).catch(function (error) {
          console.log(error);
          that.$message({
            type: 'error',
            message: '收款单详情加载失败，请重新加载!'
          });
        });
      },
      auditingSingle (id) {
        var that=this;
        this.$confirm('收款单是否确认？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal:false
        }).then(() => {
          that.$http({
            method:'post',
            url: '/bill_payee/batchsubmit',
            params:{
              payee_id:id
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '收款单审核成功!'
              });
              that.getBillReceiptList(1,that.pageData.Perpage,that.queryFlag);
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
              message: '收款单审核失败，请重新提交!'
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
        this.getBillReceiptList(1,this.pageData.Perpage,false);
        // 点击操作以外的地方，操作隐藏
        var that=this;
        document.addEventListener("click",function(event){
          if(!this.contains(this.$el,event.target)){
            if(that.billReceiptList.length>0){
              that.billReceiptList.forEach(function (item,index) {
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
  .table-responsive{
    padding-bottom: 35px;
    overflow:auto;
  }
  .el-button--primary em{
    display: none;
  }
  .el-button--default em{
    font-size: 12px;
    margin-left:6px;
  }
  .el-input{
    width:200px;
  }
  .validate-error{
    color: red;
    margin-top: 8px;
  }
  .detail-title{
    height:34px;
    line-height:34px;
    background-color:#f3f3f3;
    padding:0 20px;
    font-size:14px;
    font-weight: bold;
  }
  .detail-title span{
    font-weight: normal;
    color: #FF8E00;
  }
  .info-item{
    line-height: 20px;
    padding:5px 0;
  }
  .info-item label{
    margin-bottom:0;
  }
</style>
