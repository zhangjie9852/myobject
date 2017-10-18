<template>
  <div id="orderList">
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-title">
              <h5>发货单列表</h5>
            </div>
            <div class="ibox-content">
              <form action="#" class="form-inline m-b-md" id="form1" role="form">
                <div class="form-group m-r-xs m-t-xs">
                  <input type="text" class="form-control" name="keyword" placeholder="订单编号/发货单单号/收货人姓名" v-model="keyword">
                </div>
                <div class="form-group m-r-xs m-t-xs">
                  <select class="form-control" name="province_id" v-model="provinceId" @change="changeProvince">
                    <option :value="null">发往所在省</option>
                    <template v-for="item in provinceList">
                      <option :value="item.region_id">{{item.region_name}}</option>
                    </template>
                  </select>
                </div>
                <div class="form-group m-r-xs m-t-xs">
                  <select class="form-control" name="city_id" v-model="cityId" :disabled="provinceId==null" @change="changeCity">
                    <option :value="null">发往所在市</option>
                    <template v-for="item in cityList">
                      <option :value="item.region_id">{{item.region_name}}</option>
                    </template>
                  </select>
                </div>
                <div class="form-group m-r-xs m-t-xs">
                  <select class="form-control" name="region_id" v-model="regionId" :disabled="cityId==null">
                    <option :value="null">发往所在区</option>
                    <template v-for="item in regionList">
                      <option :value="item.region_id">{{item.region_name}}</option>
                    </template>
                  </select>
                </div>
                <div class="form-group m-r-xs m-t-xs">
                  <select class="form-control" name="status_invoice" v-model="statusInvoice">
                    <option :value="null">发货单状态</option>
                    <option value="0">未发货</option>
                    <option value="1">已发货</option>
                    <option value="-1">已取消</option>
                    <option value="2">已送达</option>
                  </select>
                </div>
                <div class="form-group m-r-xs m-t-xs">
                  <button type="button" class="btn btn-primary" @click="getInvoiceList(1,pageData.Perpage,true)">查询</button>
                </div>
              </form>
              <div class="btn-group m-b-md">
                <button type="button" class="btn btn-primary m-r-xs" @click="remove">删除</button>
                <!--<button type="button" class="btn btn-primary m-r-xs" @click="deliver">发货</button>-->
                <button type="button" class="btn btn-primary m-r-xs" @click="cancelDeliver">取消发货</button>
              </div>
              <div class="table-box">
                <div class="table-responsive clearfix">
                  <table class="table table-striped table-bordered table-hover">
                    <thead>
                    <tr>
                      <th>
                        <div class="checkbox-square-green" :class="{'checked':checkAllFlag}" @click="checkedAll(invoiceList)">
                          <input type="checkbox" class="checks">
                        </div>
                      </th>
                      <th>订单编号</th>
                      <th>物流编号</th>
                      <th>商家名称</th>
                      <th>收货人</th>
                      <th>发货时间</th>
                      <th>创建时间</th>
                      <th>状态</th>
                      <th class="opt-select">操作</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item,index) in invoiceList">
                      <td>
                        <div class="checkbox-square-green" :class="{'checked':item.isChecked}" @click="chkSelectAndAll(invoiceList,item)">
                          <input type="checkbox" class="checks">
                        </div>
                      </td>
                      <td>{{item.order_no}}</td>
                      <td>{{item.express_no}}</td>
                      <td class="text-org">{{item.shop_name}}</td>
                      <td>{{item.accept_name}}</td>
                      <td>{{item.time_invoice}}</td>
                      <td>{{item.time_create}}</td>
                      <td :class="{'text-red':item.status_invoice=='已取消'}">{{item.status_invoice}}</td>
                      <td class="opt-select">
                        <div class="opt" @click.stop="viewOpt(invoiceList,'invoice_id',item.invoice_id)">处理<i class="fa fa-caret-down"></i></div>
                        <ul v-show="item.isOptShow">
                          <li><router-link :to="'/carry/invoice/detail/'+item.invoice_id"><i class="icon_l_see"></i> 查看</router-link></li>
                          <li @click="removeSingle(item.invoice_id)"><a href="javascript:;"><i class="icon_l_delete"></i> 删除</a></li>
                          <li v-if="item.status_invoice=='未发货'" @click="singleDeliver(item.invoice_id)"><a href="javascript:;"><i class="fa fa-bus"></i> 发货</a></li>
                          <li v-if="item.status_invoice=='未发货'" @click="cancelDeliverSingle(item.invoice_id,'取消')"><a href="javascript:;"><i class="icon_lb_reject"></i> 取消</a></li>
                          <li v-if="item.status_invoice=='已发货'" @click="cancelDeliverSingle(item.invoice_id,'取消发货')"><a href="javascript:;"><i class="icon_lb_reject"></i> 取消发货</a></li>
                        </ul>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                  <div v-if="invoiceList.length==0" class="text-center">暂无信息</div>
                  <div class="hj_fr">
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="pageData.PageID"
                      :page-sizes="PSLists"
                      :page-size="pageData.Perpage"
                      v-show="invoiceList.length>0"
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
                url:'/carry/invoice'
              },
              {
                title:'物流单据',
                url:'/carry/invoice'
              },
              {
                title:'发货单',
                url:''
              }
            ]
        },
        invoiceList:[],
        keyword:"",
        provinceId:null,
        cityId:null,
        regionId:null,
        statusInvoice:null,
        checkAllFlag:false,
        selectedList:[],
        PSLists:pageSizes,
        pageData:{
          PageID:1,
          Perpage:10,
          Results:1,
          Pages:1
        },
        provinceList:[],
        cityList:[],
        regionList:[],
        queryFlag:false,
        invoiceId:'',
        orderInfo:{},
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
      viewOpt:CustomFun.viewOpt,
      checkedAll:CustomFun.checkedAll,
      chkSelectAndAll:CustomFun.chkSelectAndAll,
      /*
       * pageID 请求的是第几页
       * Perpage 每页几条数据
       * flag true代表有查询条件，false代表无查询条件
       * */
      getInvoiceList (pageID,Perpage,flag) {
        var that=this;
        that.queryFlag=flag;
        that.checkAllFlag=false;
        that.selectedList=[];
        var paramObj={
          PageID:pageID,
          Perpage:Perpage
        };
        if(flag){
          if(that.keyword!=""){
            paramObj["keyword"]=that.keyword;
          }
          if(that.provinceId){
            paramObj["province_id"]=that.provinceId;
          }
          if(that.cityId){
            paramObj["city_id"]=that.cityId;
          }
          if(that.regionId){
            paramObj["region_id"]=that.regionId;
          }
          if(that.statusInvoice){
            paramObj["status_invoice"]=that.statusInvoice;
          }
        }else{
          that.keyword="";
          that.provinceId=null;
          that.cityId=null;
          that.regionId=null;
          that.statusInvoice=null;
        }
        that.$http({
          method:'post',
          url: '/bill_invoice/listdata',
          params:paramObj
        }).then(function (res) {
          if(res.data.error=='0'){
            that.invoiceList=res.data.data.table_data;
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
            message: '发货单列表加载失败，请重新加载!'
          });
        });
      },
      getProvinceList () {
        var that=this;
        that.$http({
          method:'post',
          url: '/common/citymenu'
        }).then(function (res) {
          if(res.data.error=='0'){
            that.provinceList=res.data.data.table_data;
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
            message: '省份加载失败，请重新加载!'
          });
        });
      },
      changeProvince () {
        var that=this;
        that.cityId=null;
        that.regionId=null;
        that.$http({
          method:'post',
          url: '/common/citymenu',
          params:{
            parent_id:that.provinceId
          }
        }).then(function (res) {
          if(res.data.error=='0'){
            that.cityList=res.data.data.table_data;
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
            message: '城市加载失败，请重新选择省份!'
          });
        });
      },
      changeCity () {
        var that=this;
        that.regionId=null;
        that.$http({
          method:'post',
          url: '/common/citymenu',
          params:{
            parent_id:that.cityId
          }
        }).then(function (res) {
          if(res.data.error=='0'){
            that.regionList=res.data.data.table_data;
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
            message: '地区加载失败，请重新选择城市!'
          });
        });
      },
      handleSizeChange(val) {
        this.pageData.Perpage = val;
        this.getInvoiceList(1,this.pageData.Perpage,this.queryFlag);
      },
      handleCurrentChange(val) {
        this.getInvoiceList(val,this.pageData.Perpage,this.queryFlag);
      },
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
            that.$http({
              method:'post',
              url: '/order/infodata',
              params:{
                order_id:res.data.data.order_id
              }
            }).then(function (response) {
              if(response.data.error=='0'){
                that.orderInfo=response.data.data;
              }else{
                that.$message({
                  type: 'error',
                  message: response.data.desc
                });
              }
            }).catch(function (error) {
              console.log(error);
              that.$message({
                type: 'error',
                message: '订单信息加载失败，请重新加载!'
              });
            });
          }else{
            that.$message({
              type: 'error',
              message: res.data.desc
            });
          }
        }).catch(function (error) {
          that.$message({
            type: 'error',
            message: '发货单信息加载失败，请重新加载!'
          });
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
            message: '物流公司列表加载失败，请重新加载!'
          });
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
      singleDeliver (id) {
        this.deliverFormVisible=true;
        this.operatorName=this.adminInfo.realname;
        this.expressNo='';
        this.expressCompanyId=null;
        this.expressCompanyNameAlias='';
        this.invoiceRemark='';
        this.invoiceId=id;
        this.getInvoiceInfo(id);
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
            that.getInvoiceList(1,that.pageData.Perpage,that.queryFlag);
            that.deliverFormVisible=false;
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
            message: '发货失败，请重新提交!'
          });
        });
      },
      remove () {
        var that=this;
        if(that.selectedList.length>0){
          var selectedId=[];
          var isRight=true;
          that.selectedList.forEach(function(item,index){
            if(item.status_invoice=='逻辑删除'){
              that.$message({
                type: 'warning',
                message: '所选项包含已删除数据，请重新选择!'
              });
              isRight=false;
              return;
            }else{
              selectedId.push(item.invoice_id);
            }
          })
          if(isRight){
            this.$confirm('确认删除此发货单吗？', '提示', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning',
              closeOnClickModal:false
            }).then(() => {
              that.$http({
                method:'post',
                url: '/bill_invoice/batchsubmit',
                params:{
                  status_invoice:-2,
                  invoice_id:selectedId.join(',')
                }
              }).then(function (res) {
                if(res.data.error=='0'){
                  that.$message({
                    type: 'success',
                    message: '发货单删除成功!'
                  });
                  that.getInvoiceList(1,that.pageData.Perpage,that.queryFlag);
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
                  message: '发货单删除失败，请重新提交!'
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
      removeSingle (id) {
        var that=this;
        this.$confirm('确认删除此条发货单吗？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal:false
        }).then(() => {
          that.$http({
            method:'post',
            url: '/bill_invoice/batchsubmit',
            params:{
              status_invoice:-2,
              invoice_id:id
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '发货单删除成功!'
              });
              that.getInvoiceList(1,that.pageData.Perpage,that.queryFlag);
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
              message: '发货单删除失败，请重新提交!'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      deliver () {
        var that=this;
        if(that.selectedList.length>0){
          var selectedId=[];
          var isRight=true;
          that.selectedList.forEach(function(item,index){
            if(item.status_invoice!='未发货' && item.status_invoice!='已取消'){
              that.$message({
                type: 'warning',
                message: '所选项包含已发货或已删除数据，请重新选择!'
              });
              isRight=false;
              return;
            }else{
              selectedId.push(item.invoice_id);
            }
          })
          if(isRight){
            this.$confirm('确认对此发货单进行发货吗？', '提示', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning',
              closeOnClickModal:false
            }).then(() => {
              that.$http({
                method:'post',
                url: '/bill_invoice/batchsubmit',
                params:{
                  status_invoice:1,
                  invoice_id:selectedId.join(',')
                }
              }).then(function (res) {
                if(res.data.error=='0'){
                  that.$message({
                    type: 'success',
                    message: '发货单发货成功!'
                  });
                  that.getInvoiceList(1,that.pageData.Perpage,that.queryFlag);
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
                  message: '发货单发货失败，请重新提交!'
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
      deliverSingle (id) {
        var that=this;
        this.$confirm('确认对此发货单进行发货吗？', '提示', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning',
          closeOnClickModal:false
        }).then(() => {
          that.$http({
            method:'post',
            url: '/bill_invoice/batchsubmit',
            params:{
              status_invoice:1,
              invoice_id:id
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '发货单发货成功!'
              });
              that.getInvoiceList(1,that.pageData.Perpage,that.queryFlag);
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
              message: '发货单发货失败，请重新提交!'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      },
      cancelDeliver () {
        var that=this;
        if(that.selectedList.length>0){
          var selectedId=[];
          var isRight=true;
          that.selectedList.forEach(function(item,index){
            if(item.status_invoice!='已发货'){
              that.$message({
                type: 'warning',
                message: '所选项包含不可取消发货数据，请重新选择!'
              });
              isRight=false;
              return;
            }else{
              selectedId.push(item.invoice_id);
            }
          })
          if(isRight){
            this.$confirm('确认对此发货单进行取消发货吗？', '提示', {
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
                  invoice_id:selectedId.join(',')
                }
              }).then(function (res) {
                if(res.data.error=='0'){
                  that.$message({
                    type: 'success',
                    message: '取消发货成功!'
                  });
                  that.getInvoiceList(1,that.pageData.Perpage,that.queryFlag);
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
                  message: '取消发货失败，请重新提交!'
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
              that.getInvoiceList(1,that.pageData.Perpage,that.queryFlag);
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
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.getProvinceList();
        this.getInvoiceList(1,this.pageData.Perpage,false);
        this.getAdminInfo();
        this.getExpressCompany();
        // 点击操作以外的地方，操作隐藏
        var that=this;
        document.addEventListener("click",function(event){
          if(!this.contains(this.$el,event.target)){
            if(that.invoiceList.length>0){
              that.invoiceList.forEach(function (item,index) {
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
  .table-box{
    overflow-x: auto;
  }
  .table-responsive{
    min-width: 1020px;
    padding-bottom: 80px;
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
  .table thead tr .opt-select{
    width:96px;
    text-align: right;
    padding-right: 20px;
  }
  .table tbody tr .opt-select{
    width: 96px;
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
