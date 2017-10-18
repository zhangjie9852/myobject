<template>
  <div>
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-title">
              <h5>发货单信息</h5>
            </div>
            <div class="ibox-content">
              <div class="detail-info">
                <h6 class="text-org">订单编号：{{orderInfo.order_no}}<span class="m-l-xl" v-if="invoiceInfo.express_no">物流单号：{{invoiceInfo.express_no}}</span></h6>
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
                <div class="form-group m-t clearfix">
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
              </div>
              <div class="detail-info" v-if="invoiceInfo.status_invoice!='未发货'">
                <h6>物流信息</h6>
                <div class="form-group m-t clearfix">
                  <div class="col-lg-5">
                    <div class="info-item">
                      <label>经手人姓名：</label>
                      <span>{{invoiceInfo.operator_name}}</span>
                    </div>
                    <div class="info-item">
                      <label>物流公司名称：</label>
                      <span>{{invoiceInfo.express_company_name}}</span>
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="info-item">
                      <label>物流公司代码：</label>
                      <span>{{invoiceInfo.express_company_code}}</span>
                    </div>
                    <div class="info-item">
                      <label>物流公司电话：</label>
                      <span>{{invoiceInfo.express_company_tel}}</span>
                    </div>
                  </div>
                  <div class="col-lg-3">
                    <div class="info-item">
                      <label>发货时间：</label>
                      <span>{{invoiceInfo.time_invoice}}</span>
                    </div>
                  </div>
                  <div class="col-lg-12">
                    <div class="info-item">
                      <label>发货单备注：</label>
                      <span>{{invoiceInfo.invoice_remark}}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="detail-info" v-if="invoiceInfo.status_invoice=='未发货' || invoiceInfo.status_invoice=='已发货'">
                <h6>操作信息</h6>
                <div class="btn-group m">
                  <button type="button" class="btn btn-primary m-r-xs" v-if="invoiceInfo.status_invoice=='未发货'" @click="deliverFormVisible=true">一键发货</button>
                  <button type="button" class="btn btn-primary m-r-xs" v-if="invoiceInfo.status_invoice=='未发货'" @click="cancelDeliverSingle(invoiceId,'取消')">取消</button>
                  <button type="button" class="btn btn-primary m-r-xs" v-if="invoiceInfo.status_invoice=='已发货'" @click="cancelDeliverSingle(invoiceId,'取消发货')">取消发货</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog title="收货地址" :visible.sync="deliverFormVisible">
      <div class="form-group">
        <div class="deliver-row clearfix">
          <label>收货人：</label>
          <div class="row-con">{{orderInfo.accept_name}}</div>
        </div>
        <div class="deliver-row clearfix">
          <label>联系电话：</label>
          <div class="row-con">{{orderInfo.accept_mobile}}</div>
        </div>
        <div class="deliver-row clearfix">
          <label>收货地址：</label>
          <div class="row-con">{{orderInfo.accept_address}}</div>
        </div>
        <div class="deliver-row clearfix">
          <label><span class="f-c-r">*</span>经手人姓名：</label>
          <div class="row-con">
            <input class="form-control" name="operator_name" v-model="operatorName">
          </div>
        </div>
        <div class="deliver-row clearfix">
          <label><span class="f-c-r">*</span>物流单号：</label>
          <div class="row-con">
            <input class="form-control" name="express_no" v-model="expressNo" placeholder="请输入物流单号">
          </div>
        </div>
        <div class="deliver-row clearfix">
          <label><span class="f-c-r">*</span>物流公司：</label>
          <div class="row-con">
            <select class="form-control" name="express_company_id" v-model="expressCompanyId" @change="changeExpressCompany">
              <option :value="null">请选择物流公司</option>
              <template v-for="item in expressCompany">
                <option :value="item.express_company_id">{{item.express_company_name}}</option>
              </template>
            </select>
          </div>
        </div>
        <div class="deliver-row clearfix">
          <label>物流公司别名：</label>
          <div class="row-con">
            <input class="form-control" name="express_company_name_alias" v-model="expressCompanyNameAlias">
          </div>
        </div>
        <div class="deliver-row clearfix">
          <label>备注：</label>
          <div class="row-con">
            <textarea class="form-control" name="invoice_remark" v-model="invoiceRemark"></textarea>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="deliverCancel">取 消</el-button>
        <el-button type="primary" @click="deliverConfirm">确 定</el-button>
      </div>
    </el-dialog>
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
                title:'物流单据',
                url:'/carry/invoice'
              },
              {
                title:'发货单',
                url:'/carry/invoice'
              },
              {
                title:'发货单信息',
                url:''
              }
            ]
        },
        invoiceId:'',
        invoiceInfo:{},
        orderId:'',
        orderInfo:{},
        goodsList:[],
        deliverFormVisible:false,
        operatorName:'',
        adminInfo:{},
        expressNo:'',
        expressCompanyId:null,
        expressCompanyName:'',
        expressCompany:[],
        expressCompanyNameAlias:'',
        expressCompanyCode:'',
        expressCompanyTel:'',
        invoiceRemark:''
      }
    },
    methods:{
      getInvoiceInfo (id) {
        var that=this;
        that.$http({
          method:'post',
          url: '/bill_invoice/infodata',
          params:{
            invoice_id:id
          }
        }).then(function (res) {
          if(res.data.error=='0'){
            that.invoiceInfo=res.data.data;
            that.$http({
              method:'post',
              url: '/order/infodata',
              params:{
                order_id:that.invoiceInfo.order_id
              }
            }).then(function (response) {
              if(response.data.error=='0'){
                that.orderInfo=response.data.data;
                that.goodsList=response.data.data.goods_list;
              }else{
                that.$message({
                  type: 'error',
                  message: response.data.desc
                });
              }
            }).catch(function (error) {
              console.log(error);
            });
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
      getAdminInfo () {
        var that=this;
        that.$http({
          method:'post',
          url: '/base/main'
        }).then(function (res) {
          if(res.data.error=='0'){
            that.adminInfo=res.data.data;
            that.operatorName=that.adminInfo.realname;
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
      getExpressCompany () {
        var that=this;
        that.$http({
          method:'post',
          url: '/bill_invoice/getexpresslist'
        }).then(function (res) {
          if(res.data.error=='0'){
            that.expressCompany=res.data.data;
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
      changeExpressCompany () {
        var that=this;
        that.expressCompany.forEach(function (item,index) {
          if(item.express_company_id==that.expressCompanyId){
            that.expressCompanyName=item.express_company_name;
            that.expressCompanyCode=item.express_company_code;
            that.expressCompanyTel=item.express_company_tel;
            return;
          }
        })
      },
      cancelDeliverSingle (id,str) {
        var that=this;
        this.$confirm('确认对此发货单进行'+str+'吗？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal:false
        }).then(() => {
          that.$http({
            method:'post',
            url: '/bill_invoice/batchsubmit',
            params:{
              status_invoice:-1,
              invoice_id:id
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: str+'成功!'
              });
              that.getInvoiceInfo(that.invoiceId);
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
              message: str+'失败，请重新提交!'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      deliverCancel () {
        this.deliverFormVisible=false;
        this.operatorName=this.adminInfo.realname;
        this.expressNo='';
        this.expressCompanyId=null;
        this.expressCompanyNameAlias='';
        this.invoiceRemark='';
      },
      deliverConfirm () {
        var that=this;
        if(that.operatorName==''){
          that.$message({
            type: 'warning',
            message: '经手人姓名不能为空'
          });
          return;
        }else if(that.expressNo==''){
          that.$message({
            type: 'warning',
            message: '物流单号不能为空'
          });
          return;
        }else if(that.expressCompanyId==null){
          that.$message({
            type: 'warning',
            message: '物流公司不能为空'
          });
          return;
        }
        that.$http({
          method:'post',
          url: '/bill_invoice/batchsubmit',
          params:{
            status_invoice:1,
            invoice_id:that.invoiceId,
            operator_name:that.operatorName,
            express_no:that.expressNo,
            express_company_id:that.expressCompanyId,
            express_company_name:that.expressCompanyNameAlias || that.expressCompanyName,
            express_company_code:that.expressCompanyCode,
            express_company_tel:that.expressCompanyTel,
            invoice_remark:that.invoiceRemark
          }
        }).then(function (res) {
          if(res.data.error=='0'){
            that.getInvoiceInfo(that.invoiceId);
          }else{
            that.$message({
              type: 'error',
              message: res.data.desc
            });
          }
        }).catch(function (error) {
          console.log(error);
        });
        that.deliverFormVisible=false;
      }
    },
    mounted () {
      this.$nextTick(function () {
        var that=this;
        that.invoiceId=that.$route.params.id;
        setTimeout(function(){
          that.getInvoiceInfo(that.invoiceId);
        },20)
        that.getAdminInfo();
        that.getExpressCompany();
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
  .total-price{
    padding:0 20px;
    font-size: 13px;
    text-align: right;
    margin-top:-10px;
  }

  .deliver-row{
    margin-bottom: 10px;
  }
  .deliver-row label{
    width: 120px;
    line-height: 34px;
    text-align: right;
    margin-bottom: 0;
    float: left;
  }
  .deliver-row .row-con{
    margin-left: 130px;
    line-height: 34px;
  }
  .deliver-row .form-control{
    max-width: 360px;
  }
</style>
