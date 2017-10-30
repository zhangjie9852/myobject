<template>
  <div id="orderList">
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-content">
              <div class="btn-group m-b-sm">
                <!--<button type="button" v-for="(item,index) in orderCount" :class="['btn','m-r-sm',tabIndex==index?'btn-primary':'btn-default']" @click="getOrderLists(index,1,pageData.Perpage,false)">{{item.title}}({{item.count}})</button>-->
                <el-button :type="tabIndex==index?'primary':'info'" v-for="(item,index) in orderCount" :key="index" @click="getOrderLists(index,1,pageData.Perpage,false)">{{item.title}}({{item.count}})</el-button>
              </div>
              <form action="#" class="form-inline m-b-sm" role="form">
                <el-dropdown class="m-r-sm m-b-sm">
                  <el-button type="warning">
                    批量操作&nbsp;&nbsp;&nbsp;&nbsp;<i class="el-icon-caret-bottom el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-if="tabIndex==0 || tabIndex==1"><span @click="auditingOrder">审核</span></el-dropdown-item>
                    <el-dropdown-item><span @click="cancelOrder"></span>取消</el-dropdown-item>
                    <el-dropdown-item><span @click="removeOrder">移除</span></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
                <el-button type="warning" class="m-r-sm m-b-sm">打印订单</el-button>
                <el-input class="m-r-sm m-b-sm" name="keyword" v-model="keyword" placeholder="订单编号/收货人姓名"></el-input>
                <el-select class="m-r-sm m-b-sm" name="payment_id" v-model="paymentId" v-show="tabIndex!=2">
                  <el-option :key="null" label="支付类型" :value="null"></el-option>
                  <el-option :key="3" label="余额支付" value="3"></el-option>
                  <el-option :key="2" label="微信支付" value="2"></el-option>
                  <el-option :key="1" label="支付宝支付" value="1"></el-option>
                  <el-option :key="4" label="银联支付" value="4"></el-option>
                </el-select>
                <el-select class="m-r-sm m-b-sm" name="status_order" v-model="statusOrder">
                  <el-option :key="null" label="订单总状态" :value="null"></el-option>
                  <el-option :key="0" label="未开始" value="0"></el-option>
                  <el-option :key="1" label="进行中" value="1"></el-option>
                  <el-option :key="2" label="已完成" value="2"></el-option>
                  <el-option :key="9" label="已取消" value="9"></el-option>
                </el-select>
                <el-select class="m-r-sm m-b-sm" name="status_pay" v-model="statusPay" v-show="tabIndex!=2 && tabIndex!=4">
                  <el-option :key="null" label="支付状态" :value="null"></el-option>
                  <el-option :key="0" label="未支付" value="0"></el-option>
                  <el-option :key="1" label="已支付" value="1"></el-option>
                  <el-option :key="2" label="退款中" value="2"></el-option>
                </el-select>
                <el-select class="m-r-sm m-b-sm" name="status_deliver" v-model="statusDeliver" v-show="tabIndex!=1 && tabIndex!=4">
                  <el-option :key="null" label="配送状态" :value="null"></el-option>
                  <el-option :key="0" label="未发货" value="0"></el-option>
                  <el-option :key="1" label="配货中" value="1"></el-option>
                  <el-option :key="3" label="已发货" value="3"></el-option>
                  <el-option :key="4" label="已收货" value="4"></el-option>
                </el-select>
                <el-select class="m-r-sm m-b-sm" name="status_check" v-model="statusCheck" v-show="tabIndex!=1 && tabIndex!=4">
                  <el-option :key="null" label="审核状态" :value="null"></el-option>
                  <el-option :key="0" label="未审核" value="0"></el-option>
                  <el-option :key="1" label="已审核" value="1"></el-option>
                </el-select>
                <el-button :type="amountRange?'default':'primary'" class="m-r-sm m-b-sm" @click="dialogAmountVisible=true">
                  {{amountRange?'金额：￥'+amountRange.replace(',','-'):'订单金额范围'}}
                  <em class="shop icon-cha" @click.stop="closedAmount"></em>
                </el-button>
                <el-button :type="dateRange?'default':'primary'" class="m-r-sm m-b-sm" @click="dialogDateVisible=true">
                  {{dateRange?'日期：'+dateRange.replace(',','-'):'日期范围'}}
                  <em class="shop icon-cha" @click.stop="closedDate"></em>
                </el-button>
                <el-button class="search-btn" type="primary" icon="search" @click="getOrderLists(tabIndex,1,pageData.Perpage,true)">筛选</el-button>
              </form>
              <div class="table-responsive clearfix">
                <table class="table table-striped table-bordered table-hover">
                  <thead>
                  <tr>
                    <th class="table-checkbox">
                      <div class="checkbox-square-green" :class="{'checked':checkAllFlag}" @click="checkedAll">
                        <input type="checkbox" class="checks">
                      </div>
                    </th>
                    <th>订单编号</th>
                    <th>商家名称</th>
                    <th>收货人</th>
                    <th>支付方式</th>
                    <th>支付渠道</th>
                    <th>来源</th>
                    <th>金额标签</th>
                    <th>订单状态</th>
                    <th>下单时间</th>
                    <th class="opt-select">操作</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="(item,index) in orderLists">
                    <td>
                      <div class="checkbox-square-green" :class="{'checked':item.isChecked}" @click="chkSelectAndAll(item)">
                        <input type="checkbox" class="checks">
                      </div>
                    </td>
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
                    <td class="opt">
                      <span class="opt-down shop icon-shezhicaozuo" @click.stop="viewOpt(orderLists,'order_id',item.order_id)"></span>
                      <ul v-show="item.isOptShow">
                        <li><router-link :to="'/order/detail/'+item.order_id+'/'+encodeURIComponent(item.pay_type)">查看</router-link></li>
                        <li v-if="(item.pay_type=='货到付款' && item.status_check=='未审核') || (item.pay_type!='货到付款' && item.status_check=='未审核' && item.status_pay=='已支付')" @click="auditingSingle(item.order_id)"><a href="javascript:;">审核</a></li>
                        <li v-if="item.status_order!='已取消' && item.status_deliver=='未发货'" @click="cancelSingleOrder(item.order_id)"><a href="javascript:;">取消</a></li>
                        <li v-if="item.status_order=='已取消'" @click="removeSingleOrder(item.order_id)"><a href="javascript:;">移除</a></li>
                      </ul>
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
              url:'/order/list'
            },
            {
              title:'订单管理',
              url:'/order/list'
            },
            {
              title:'商品订单',
              url:''
            }
          ]
        },
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
      viewOpt:CustomFun.viewOpt,
      getOrderCount () {
        var that = this;
        that.$http({
          method:'post',
          url: '/order/getOrderCount'
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
            message: '订单列表加载失败，请重新加载'
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
          Perpage:Perpage
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
            message: '订单列表加载失败，请重新加载'
          });
        });
      },
      checkedAll () {
        var that=this;
        that.checkAllFlag=!that.checkAllFlag;
        that.orderLists.forEach(function (item,index) {
          if(typeof item.isChecked =="undefined"){
            that.$set(item,"isChecked",that.checkAllFlag);
          }else {
            item.isChecked=that.checkAllFlag;
          }
        })
        if(that.checkAllFlag){
          that.selectedList=that.orderLists;
        }else{
          that.selectedList=[];
        }
      },
      chkSelectAndAll (item) {
        if(typeof item.isChecked =="undefined"){
          this.$set(item,"isChecked",true);
        }else {
          item.isChecked=!item.isChecked;
        }
        var that=this;
        that.selectedList=[];
        that.orderLists.forEach(function (item,index) {
          if(item.isChecked){
            that.selectedList.push(item);
          }
        })
        if(that.selectedList.length==that.orderLists.length){
          that.checkAllFlag=true;
        }else{
          that.checkAllFlag=false;
        }
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
      },
      auditingOrder () {
        var that=this;
        if(that.selectedList.length>0){
          var selectedId=[];
          var isRight=true;
          that.selectedList.forEach(function(item,index){
            if((item.pay_type=='货到付款' && item.status_check=='未审核') || (item.pay_type!='货到付款' && item.status_check=='未审核' && item.status_pay=='已支付')){
              selectedId.push(item.order_id);
            }else{
              that.$message({
                type: 'warning',
                message: '所选项包含不可审核数据，请重新选择!'
              });
              isRight=false;
              return false;
            }
          })
          if(isRight){
            this.$confirm('确认审核此条订单吗？', '提示', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning',
              closeOnClickModal:false
            }).then(() => {
              that.$http({
                method:'post',
                url: '/order/batchsubmit',
                params:{
                  status_check:1,
                  order_id:selectedId.join(',')
                }
              }).then(function (res) {
                if(res.data.error=='0'){
                  that.$message({
                    type: 'success',
                    message: '订单审核成功!'
                  });
                  that.getOrderCount();
                  that.getOrderLists(that.tabIndex,1,that.pageData.Perpage,that.queryFlag);
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
                  message: '订单审核失败，请重新提交!'
                });
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消操作'
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
      auditingSingle (id) {
        var that=this;
        this.$confirm('确认审核此条订单吗？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal:false
        }).then(() => {
          that.$http({
            method:'post',
            url: '/order/batchsubmit',
            params:{
              status_check:1,
              order_id:id
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '订单审核成功!'
              });
              that.getOrderCount();
              that.getOrderLists(that.tabIndex,1,that.pageData.Perpage,that.queryFlag);
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
              message: '订单审核失败，请重新提交!'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      cancelOrder () {
        var that=this;
        if(that.selectedList.length>0){
          var selectedId=[];
          var isRight=true;
          that.selectedList.forEach(function(item,index){
            if(item.status_order=='已取消' || item.status_deliver!='未发货'){
              that.$message({
                type: 'warning',
                message: '所选项包含不可取消数据，请重新选择!'
              });
              isRight=false;
              return;
            }else{
              selectedId.push(item.order_id);
            }
          })
          if(isRight){
            this.$confirm('确认取消此条订单吗？', '提示', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning',
              closeOnClickModal:false
            }).then(() => {
              that.$http({
                method:'post',
                url: '/order/batchsubmit',
                params:{
                  status_order:9,
                  order_id:selectedId.join(',')
                }
              }).then(function (res) {
                if(res.data.error=='0'){
                  that.$message({
                    type: 'success',
                    message: '订单取消成功!'
                  });
                  that.getOrderCount();
                  that.getOrderLists(that.tabIndex,1,that.pageData.Perpage,that.queryFlag);
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
                  message: '订单取消失败，请重新提交!'
                });
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消操作'
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
      cancelSingleOrder(id){
        var that=this;
        this.$confirm('确认取消此条订单吗？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal:false
        }).then(() => {
          that.$http({
            method:'post',
            url: '/order/batchsubmit',
            params:{
              status_order:9,
              order_id:id
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '订单取消成功!'
              });
              that.getOrderCount();
              that.getOrderLists(that.tabIndex,1,that.pageData.Perpage,that.queryFlag);
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
              message: '订单取消失败，请重新提交!'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      removeOrder () {
        var that=this;
        if(that.selectedList.length>0){
          var selectedId=[];
          var isRight=true;
          that.selectedList.forEach(function(item,index){
            if(item.status_order!='已取消'){
              that.$message({
                type: 'warning',
                message: '所选项包含未取消数据，请重新选择!'
              });
              isRight=false;
              return;
            }else{
              selectedId.push(item.order_id);
            }
          })
          if(isRight){
            this.$confirm('确认删除此条订单吗？', '提示', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning',
              closeOnClickModal:false
            }).then(() => {
              that.$http({
                method:'post',
                url: '/order/batchsubmit',
                params:{
                  status_delete:1,
                  order_id:selectedId.join(',')
                }
              }).then(function (res) {
                if(res.data.error=='0'){
                  that.$message({
                    type: 'success',
                    message: '订单删除成功!'
                  });
                  that.getOrderCount();
                  that.getOrderLists(that.tabIndex,1,that.pageData.Perpage,that.queryFlag);
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
                  message: '订单删除失败，请重新提交!'
                });
              });
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消操作'
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
      removeSingleOrder (id) {
        var that=this;
        this.$confirm('确认删除此条订单吗？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal:false
        }).then(() => {
          that.$http({
            method:'post',
            url: '/order/batchsubmit',
            params:{
              status_delete:1,
              order_id:id
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '订单删除成功!'
              });
              that.getOrderCount();
              that.getOrderLists(that.tabIndex,1,that.pageData.Perpage,that.queryFlag);
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
              message: '订单删除失败，请重新提交!'
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
        this.getOrderCount();
        this.getOrderLists(0,1,this.pageData.Perpage,false);
        // 点击操作以外的地方，操作隐藏
        var that=this;
        document.addEventListener("click",function(event){
          if(!this.contains(this.$el,event.target)){
            if(that.orderLists.length>0){
              that.orderLists.forEach(function (item,index) {
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
</style>
