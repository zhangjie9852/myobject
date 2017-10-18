<template>
  <div id="RoleEdit">
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-title">
              <h5>会员详情</h5>
            </div>
            <div class="ibox-content">
              <el-tabs v-model="activeName" type="card">
                <el-tab-pane label="基本信息" name="first">
                  <basic-info :user-id="userId"></basic-info>
                </el-tab-pane>
                <el-tab-pane label="收货信息" name="second">
                  <delivery-address :user-id="userId"></delivery-address>
                </el-tab-pane>
                <el-tab-pane label="查看订单" name="third">
                  <order-list :user-id="userId"></order-list>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import HjCrumb from '../comms/BreadCrumb.vue'
  import BasicInfo from './memberDetailChildren/basicInfo.vue'
  import DeliveryAddress from './memberDetailChildren/deliveryAddress.vue'
  import OrderList from './memberDetailChildren/orderList.vue'

  export default{
    components: {
      HjCrumb,
      BasicInfo,
      DeliveryAddress,
      OrderList
    },
    data(){
      return {
        CrumbBox:{
          CrumbList:[
            {
              title:'会员管理',
              url:'/member/list'
            },
            {
              title:'会员列表',
              url:'/member/list'
            },
            {
              title:'会员详情',
              url:''
            }
          ]
        },
        userId:"",
        activeName:'first'
      }
    },
    created () {
      this.userId=this.$route.params.id;
    }
  }
</script>

<style scoped>

</style>

