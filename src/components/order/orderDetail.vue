<template>
  <div>
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-title">
              <h5>订单信息</h5>
            </div>
            <div class="ibox-content">
              <div class="detail-info">
                <h6 class="text-org">订单编号：{{orderInfo.order_no}}</h6>
                <div class="steps-box">
                  <ul class="steps clearfix">
                    <li class="step" v-for="item in stepList" :class="{'completed':item.isCompleted}">
                      <div class="step-bar">
                        <span></span>
                      </div>
                      <div class="title">{{item.title}}</div>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="detail-info">
                <h6>基本信息</h6>
                <div class="form-group m-t clearfix">
                  <div class="col-lg-6">
                    <div class="row">
                      <div class="col-sm-6">
                        <div class="info-item">
                          <label>订单状态：</label>
                          <span>{{orderInfo.status_check}} {{orderInfo.status_payment}} {{orderInfo.status_deliver}}</span>
                        </div>
                        <div class="info-item">
                          <label>下单时间：</label>
                          <span>{{orderInfo.time_create}}</span>
                        </div>
                        <div class="info-item">
                          <label>付款时间：</label>
                          <span>{{orderInfo.pay_time}}</span>
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="info-item">
                          <label>支付方式：</label>
                          <span>{{orderInfo.pay_type}}</span>
                        </div>
                        <div class="info-item">
                          <label>配送方式：</label>
                          <span>{{orderInfo.ship_type}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="row">
                      <div class="col-sm-6">
                        <div class="info-item">
                          <label>支付渠道：</label>
                          <span>{{orderInfo.payment_name}}</span>
                        </div>
                        <div class="info-item">
                          <label>订单来源：</label>
                          <span>{{orderInfo.order_source}}</span>
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="info-item">
                          <label>订单总金额：</label>
                          <span>￥ {{orderInfo.order_amount}}</span>
                        </div>
                        <div class="info-item">
                          <label>订单实付金额：</label>
                          <span>￥ {{orderInfo.real_amount}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="detail-info">
                <h6>其他信息</h6>
                <div class="form-group m-t clearfix">
                  <div class="col-lg-5">
                    <div class="info-item">
                      <label>发票抬头：</label>
                      <span>{{orderInfo.invoice_type}}</span>
                    </div>
                  </div>
                  <div class="col-lg-7">
                    <div class="info-item">
                      <label>发票内容：</label>
                      <span>{{orderInfo.invoice_title}}</span>
                    </div>
                  </div>
                  <div class="col-lg-12">
                    <div class="info-item">
                      <label>买家留言：</label>
                      <span>{{orderInfo.user_remark}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="detail-info">
                <h6>商品信息</h6>
                <div class="table-responsive clearfix">
                  <table class="table table-striped table-bordered table-hover">
                    <thead>
                    <tr>
                      <th>商品图片</th>
                      <th>商品名称</th>
                      <th>货号</th>
                      <th>单价</th>
                      <th>数量</th>
                      <th>属性</th>
                      <th>库存</th>
                      <th>小计</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="item in goodsList">
                      <td><img :src="item.img_url" height="25"></td>
                      <td>{{item.goods_name}}</td>
                      <td>{{item.goods_no}}</td>
                      <td>￥ {{item.price_sell}}</td>
                      <td>{{item.pro_nums}}</td>
                      <td>{{item.pro_name}}</td>
                      <td>{{item.goods_store_nums}}</td>
                      <td>￥ {{item.item_total_price}}</td>
                    </tr>
                    </tbody>
                  </table>
                  <div v-if="goodsList.length==0" class="text-center">暂无数据</div>
                  <div class="text-org total-price">合计：￥ {{orderInfo.goods_amount}}</div>
                </div>
              </div>
              <div class="detail-info">
                <h6>费用信息</h6>
                <div class="form-group m-t clearfix">
                  <div class="col-lg-6">
                    <div class="row">
                      <div class="col-sm-6">
                        <div class="info-item">
                          <label>商品总金额：</label>
                          <span>￥ {{orderInfo.goods_amount}}</span>
                        </div>
                        <div class="info-item">
                          <label>订单总金额：</label>
                          <span>￥ {{orderInfo.order_amount}}</span>
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="info-item">
                          <label>订单实付金额：</label>
                          <span>￥ {{orderInfo.real_amount}}</span>
                        </div>
                        <div class="info-item">
                          <label>运送费用：</label>
                          <span>￥ {{orderInfo.ship_fee}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-6">
                    <div class="row">
                      <div class="col-sm-6">
                        <div class="info-item">
                          <label>使用优惠券：</label>
                          <span>￥ {{orderInfo.coupon_amount}}</span>
                        </div>
                        <div class="info-item">
                          <label>使用礼品卡：</label>
                          <span>￥ {{orderInfo.gift_amount}}</span>
                        </div>
                      </div>
                      <div class="col-sm-6">
                        <div class="info-item">
                          <label>使用积分：</label>
                          <span>{{orderInfo.integral_amount}}</span>
                        </div>
                        <div class="info-item">
                          <label>使用账户余额：</label>
                          <span>￥ {{orderInfo.balance_amount}}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="detail-info">
                <h6>收货人信息</h6>
                <div class="form-group m-t clearfix" v-if="orderInfo.status_check!='未审核'">
                  <div class="col-lg-5">
                    <div class="info-item">
                      <label>收货人：</label>
                      <span>{{orderInfo.accept_name}}</span>
                    </div>
                    <div class="info-item">
                      <label>收货地址：</label>
                      <span>{{orderInfo.accept_address}}</span>
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="info-item">
                      <label>手机号码：</label>
                      <span>{{orderInfo.accept_mobile}}</span>
                    </div>
                    <div class="info-item">
                      <label>邮箱地址：</label>
                      <span>{{orderInfo.accept_email}}</span>
                    </div>
                  </div>
                  <div class="col-lg-3">
                    <div class="info-item">
                      <label>邮政编码：</label>
                      <span>{{orderInfo.accept_zip}}</span>
                    </div>
                  </div>
                </div>
                <div class="form-group m-t clearfix" v-else>
                  <div class="col-lg-5">
                    <div class="info-item">
                      <label>收货人：</label>
                      <span>
                        <input type="text" class="form-control m-l-12" v-model="orderInfo.accept_name">
                      </span>
                    </div>
                    <div class="info-item">
                      <label>收货地址：</label>
                      <span>
                        <input type="text" class="form-control" v-model="orderInfo.accept_address">
                      </span>
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="info-item">
                      <label>手机号码：</label>
                      <span>
                        <input type="text" class="form-control" v-model="orderInfo.accept_mobile">
                      </span>
                    </div>
                    <div class="info-item">
                      <label>邮箱地址：</label>
                      <span>
                        <input type="text" class="form-control" v-model="orderInfo.accept_email">
                      </span>
                    </div>
                  </div>
                  <div class="col-lg-3">
                    <div class="info-item">
                      <label>邮政编码：</label>
                      <span>
                        <input type="text" class="form-control" v-model="orderInfo.accept_zip">
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="detail-info" v-if="orderInfo.status_order!='已取消' && orderInfo.status_deliver=='未发货'">
                <h6>操作信息</h6>
                <div class="btn-group m">
                  <button type="button" class="btn btn-primary m-r-xs" v-if="(orderInfo.pay_type=='货到付款' && orderInfo.status_check=='未审核') || (orderInfo.pay_type!='货到付款' && orderInfo.status_check=='未审核' && orderInfo.status_payment=='已支付')" @click="auditingSingle(orderId)">审核</button>
                  <button type="button" class="btn btn-primary m-r-xs" v-if="orderInfo.status_order!='已取消' && orderInfo.status_deliver=='未发货'" @click="cancelSingle(orderId)">取消</button>
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
  export default{
    components:{
      HjCrumb
    },
    data () {
      return{
        CrumbBox:{
          CrumbList:
            [
              {
                title:'订单管理',
                url:'/order/List'
              },
              {
                title:'商品订单',
                url:'/order/List'
              },
              {
                title:'订单信息',
                url:''
              }
            ]
        },
        stepList:[],
        orderId:'',
        orderPayType:'',
        orderInfo:{},
        goodsList:[]
      }
    },
    methods:{
      loadingStepList () {
        if(this.orderPayType=='货到付款'){
          this.stepList=[
            {
              title:"买家已下单",
              isCompleted:true
            },
            {
              title:"卖家已发货",
              isCompleted:false
            },
            {
              title:"买家已收货",
              isCompleted:false
            },
            {
              title:"买家已付款",
              isCompleted:false
            },
            {
              title:"交易完成",
              isCompleted:false
            }
          ]
        }else{
          this.stepList=[
            {
              title:"买家已下单",
              isCompleted:true
            },
            {
              title:"买家已付款",
              isCompleted:false
            },
            {
              title:"卖家已发货",
              isCompleted:false
            },
            {
              title:"买家已收货",
              isCompleted:false
            },
            {
              title:"交易完成",
              isCompleted:false
            }
          ]
        }
      },
      getOrderInfo (id) {
        var that=this;
        that.$http({
          method:'post',
          url: '/order/infodata',
          params:{
            order_id:id
          }
        }).then(function (res) {
          if(res.data.error=='0'){
            that.orderInfo=res.data.data;
            that.goodsList=res.data.data.goods_list;
            if(that.orderPayType=='货到付款'){
              if(that.orderInfo.status_payment=='已支付'){
                that.stepList[3].isCompleted=true;
              }else{
                that.stepList[3].isCompleted=false;
              }
              if(that.orderInfo.status_deliver!='已发货' && that.orderInfo.status_deliver!='已收货'){
                that.stepList[1].isCompleted=false;
                that.stepList[2].isCompleted=false;
              }else if(that.orderInfo.status_deliver=='已发货'){
                that.stepList[1].isCompleted=true;
                that.stepList[2].isCompleted=false;
              }else if(that.orderInfo.status_deliver=='已收货'){
                that.stepList[1].isCompleted=true;
                that.stepList[2].isCompleted=true;
              }
            }else{
              if(that.orderInfo.status_payment=='已支付'){
                that.stepList[1].isCompleted=true;
              }else{
                that.stepList[1].isCompleted=false;
              }
              if(that.orderInfo.status_deliver!='已发货' && that.orderInfo.status_deliver!='已收货'){
                that.stepList[2].isCompleted=false;
                that.stepList[3].isCompleted=false;
              }else if(that.orderInfo.status_deliver=='已发货'){
                that.stepList[2].isCompleted=true;
                that.stepList[3].isCompleted=false;
              }else if(that.orderInfo.status_deliver=='已收货'){
                that.stepList[2].isCompleted=true;
                that.stepList[3].isCompleted=true;
              }
            }
            if(that.orderInfo.status_order=="已完成"){
              that.stepList[4].isCompleted=true;
            }else{
              that.stepList[4].isCompleted=false;
            }
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
      auditingSingle (id) {
        var that=this;
        if(that.orderInfo.accept_name==''){
          that.$message({
            type: 'warning',
            message: '收货人不能为空'
          });
          return;
        }else if(that.orderInfo.accept_mobile==''){
          that.$message({
            type: 'warning',
            message: '手机号码不能为空'
          });
          return;
        }else if(that.orderInfo.accept_address==''){
          that.$message({
            type: 'warning',
            message: '收货地址不能为空'
          });
          return;
        }
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
              order_id:id,
              accept_name:that.orderInfo.accept_name,
              accept_address:that.orderInfo.accept_address,
              accept_mobile:that.orderInfo.accept_mobile,
              accept_email:that.orderInfo.accept_email,
              accept_zip:that.orderInfo.accept_zip
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '订单审核成功!'
              });
              that.getOrderInfo(that.orderId);
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
      cancelSingle (id) {
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
              that.getOrderInfo(that.orderId);
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
    },
    mounted () {
      this.$nextTick(function () {
        var that=this;
        that.orderId=that.$route.params.id;
        that.orderPayType=decodeURIComponent(that.$route.params.paytype);
        setTimeout(function(){
          that.loadingStepList();
          that.getOrderInfo(that.orderId);
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
  .detail-info h6{
    height:34px;
    line-height:34px;
    background-color:#f3f3f3;
    padding:0 20px;
    font-size:14px;
    font-weight: normal;
  }
  .info-item{
    line-height: 20px;
    padding:5px 0;
  }
  .info-item label{
    margin-bottom:0;
  }
  .info-item span .form-control{
    width:65%;
    display: inline-block;
  }
  .m-l-12{
    margin-left: 12px;
  }
  .total-price{
    padding:0 20px;
    font-size: 13px;
    text-align: right;
    margin-top:-10px;
  }

  .steps-box{
    width:90%;
    margin:20px auto;
  }
  .steps .step{
    width:20%;
    color: #666;
    text-align: center;
    line-height:20px;
    float:left;
  }
  .steps .step.completed{
    color: #0099ff;
  }
  .steps .step .step-bar{
    width:100%;
    height: 4px;
    margin: 11px 0;
    background-color: #797979;
    position: relative;
  }
  .steps .step .step-bar span{
    width:25px;
    height:25px;
    background-image: url(../../assets/img/circle_check_1.png);
    position: absolute;
    left: 50%;
    top:50%;
    margin-left: -13px;
    margin-top:-13px;
  }
  .steps .step.completed .step-bar{
    background-color: #0099ff;
  }
  .steps .step.completed .step-bar span{
    background-image: url(../../assets/img/circle_check_2.png);
  }
  .steps .step .title{
    margin-top: 15px;
  }
</style>
