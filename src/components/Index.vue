<template>
  <div id="index">
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-3">
          <div class="ibox clearfix count-con sales-count">
            <div class="icon-box"><i class="shop icon-xiaoshoue"></i></div>
            <div class="count-box">
              <div class="count">￥{{todaySales}}</div>
              <div class="title">今日销售额</div>
            </div>
          </div>
        </div>
        <div class="col-lg-3">
          <div class="ibox clearfix count-con order-count">
            <div class="icon-box"><i class="shop icon-dingdanzongshu"></i></div>
            <div class="count-box">
              <div class="count">{{orderTotal}}</div>
              <div class="title">订单总数</div>
            </div>
          </div>
        </div>
        <div class="col-lg-3">
          <div class="ibox clearfix count-con comment-count">
            <div class="icon-box"><i class="shop icon-pinglunshu"></i></div>
            <div class="count-box">
              <div class="count">{{evalTotal}}</div>
              <div class="title">今日评论数</div>
            </div>
          </div>
        </div>
        <div class="col-lg-3">
          <div class="ibox clearfix count-con shop-count">
            <div class="icon-box"><i class="shop icon-dianpushuliang"></i></div>
            <div class="count-box">
              <div class="count">{{storeTotal}}</div>
              <div class="title">店铺总数</div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-6">
          <div class="ibox">
            <div class="ibox-title">
              <h5><i class="shop icon-huiyuanxinxi"></i><span>会员信息</span></h5>
              <div class="pull-right">（单位：位）</div>
            </div>
            <div class="ibox-content">
              <ul class="info-container clearfix">
                <li v-for="info in memberInfo">
                  <div>{{info.count}}</div>
                  <div>{{info.title}}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div class="col-lg-6">
          <div class="ibox">
            <div class="ibox-title">
              <h5><i class="shop icon-dingdanxinxi"></i><span>订单信息</span></h5>
              <div class="pull-right">（单位：笔）</div>
            </div>
            <div class="ibox-content">
              <ul class="info-container clearfix">
                <li v-for="info in orderInfo">
                  <div>{{info.count}}</div>
                  <div>{{info.title}}</div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox">
            <div class="ibox-title">
              <h5><i class="shop icon-dingdantongji"></i><span>订单统计</span></h5>
              <div class="pull-right text-blue">月订单统计</div>
            </div>
            <div class="ibox-content">
              <div class="echart-box" id="order_statistics"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox">
            <div class="ibox-title">
              <h5><i class="shop icon-xiaoshoutongji"></i><span>销售统计</span></h5>
              <div class="pull-right text-orange">月销售额统计</div>
            </div>
            <div class="ibox-content">
              <div class="echart-box" id="sales_statistics"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>  
  import HjCrumb from './comms/BreadCrumb.vue'
  let echarts = require('echarts/lib/echarts')
  require('echarts/lib/chart/line')
  require('echarts/lib/component/tooltip')

  export default{
    components: {
      HjCrumb
    },
    data () {
      return {
        CrumbBox: {
          CrumbList: [
            {
              title: '主页',
              url: '/Index'
            },
            {
              title: '系统首页',
              url: ''
            }
          ]
        },
        todaySales: 0,
        orderTotal: 0,
        evalTotal: 0,
        storeTotal: 0,
        memberInfo: [],
        orderInfo: [],
        allMonth: [],
        orderData: [],
        salesData: []
      }
    },
    methods: {
      baseinfo(){
        var that = this;
        that.$http({
          method: 'post',
          url: '/order/indexData'
        }).then(function (res) {
          if (res.data.error == 0) {
            that.todaySales = res.data.data.今日销售额;
            that.orderTotal = res.data.data.订单总数;
            that.evalTotal = res.data.data.今日评论数;
            that.storeTotal = res.data.data.店铺总数;
            that.memberInfo = res.data.data.memberInfo;//会员信息
            that.orderInfo = res.data.data.orderInfo; //订单信息
            that.allMonth = res.data.data.month;
            that.orderData = res.data.data.monthcount;//订单数
            that.salesData = res.data.data.monthamount;//总额
            var orderOption = echarts.init(document.getElementById('order_statistics'));//订单统计
            orderOption.setOption({
              tooltip: {
                trigger: 'axis'
              },
              grid: {
                left: '1%',
                right: '3%',
                bottom: '1%',
                top: '13%',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                splitLine: {
                  show: true
                },
                data: that.allMonth
              },
              yAxis: {
                type: 'value',
                name: '单位：单',
                splitLine: {
                  show: true
                }
              },
              series: [
                {
                  name: '订单数',
                  type: 'line',
                  data: that.orderData,
                  itemStyle: {
                    normal: {color: '#0099ff'}
                  }
                }
              ]
            });
            var salesOption = echarts.init(document.getElementById('sales_statistics'));//销售统计
            salesOption.setOption({
              tooltip: {
                trigger: 'axis'
              },
              grid: {
                left: '1%',
                right: '3%',
                bottom: '1%',
                top: '13%',
                containLabel: true
              },
              xAxis: {
                type: 'category',
                boundaryGap: false,
                splitLine: {
                  show: true
                },
                data: that.allMonth
              },
              yAxis: {
                type: 'value',
                name: '单位：元',
                splitLine: {
                  show: true
                }
              },
              series: [
                {
                  name: '销售额',
                  type: 'line',
                  data: that.salesData,
                  itemStyle: {
                    normal: {color: '#ff9900'}
                  }
                }
              ]
            });

          } else {
            that.$message({
              message: res.data.desc,
              type: 'error'
            });
          }
        }).catch(function (error) {
          console.log(error);
        });
      }
    },
    mounted(){
      this.baseinfo();
    }
  }
</script>
<style scoped>
  .ibox-content {
    min-height: auto;
  }

  .count-con {
    padding: 20px 30px;
    border-radius: 5px;
    font-size: 16px;
    color: #fff;
    text-align: center;
    line-height: 30px;
  }

  .sales-count {
    background-color: #f7ba2a;
  }

  .order-count {
    background-color: #13ce66;
  }

  .comment-count {
    background-color: #20a0ff;
  }

  .shop-count {
    background-color: #ff8a6a;
  }

  .count-con .icon-box {
    float: left;
  }

  .count-con .icon-box i {
    font-size: 52px;
    line-height: 60px;
  }

  .count-con .count-box {
    float: right;
  }

  .count-con .count-box .count {
    font-size: 20px;
  }

  .ibox-title {
    overflow: hidden;
  }

  .ibox-title h5 i {
    display: inline-block;
    font-size: 16px;
    color: #b3bcd3;
    vertical-align: top;
    margin-right: 6px;
  }

  .info-container {
    padding: 22px 0;
  }

  .info-container li {
    width: 25%;
    font-size: 16px;
    text-align: center;
    line-height: 30px;
    float: left;;
  }

  .info-container li > div:first-child {
    font-size: 20px;
  }

  .echart-box {
    height: 240px;
  }

  .text-orange {
    color: #f7ba2a;
  }

  .text-blue {
    color: #20a0ff;
  }
</style>
