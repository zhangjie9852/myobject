<template>
	<div id="skuData">
	<vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t" id="commentForm">
		<div class="table-responsive clearfix">
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>规格值名称</th>
                        <th>规格图片</th>
                        <th v-if='skuMsg.goods_retail==true||(skuMsg.goods_wholesale==false && skuMsg.goods_retail==false)'>售价(元)</th>
                        <th v-if='skuMsg.goods_wholesale==true'>批发价(元)</th>
                        <th>市场价(元)</th>
                        <th>成本价(元)</th>
                        <th>库存</th>
                        <th>商品编码</th>
                        <th>重量(g)</th>
                        <th>上架</th>
                        <th>排序</th>
                        <th>操作</th>
                    </tr>
                </thead>                                    
                <tbody>                                     
                    <tr v-for="(item,index) in skuList" :key="index" v-if="skuList">                    
                        <td><input type="text" class="w150" name="goods_sku" v-model="skuList[index].goods_sku"></td>
                        <td class="text-center"><img v-if="skuList[index].product_img" :src="skuList[index].product_img" class="listImg" @click="picChange(index)"/><a v-else @click="picChange(index)">选择图片</a></td>
                        <td class="text-center" v-if='skuMsg.goods_retail==true||(skuMsg.goods_wholesale==false && skuMsg.goods_retail==false)'><input type="number" onmousewheel="return false;" class="w80" name="product_sku_price" v-model="skuList[index].product_sku_price"></td><!-- 售价 -->
                        <td class="text-center" v-if='skuMsg.goods_wholesale==true'><template v-if="skuList[index].price_model != null">{{skuList[index].goods_wholesale_type}}{{skuList[index].goods_wholesale_pri}}</template><i class="icon_l_add addPri" v-if="skuMsg.goods_wholesale==true" @click="openPriDialog(index)"></i></td><!-- 批发价 -->
                        <td class="text-center"><input type="number" onmousewheel="return false;" class="w80" name="price_market" v-model="skuList[index].price_market"></td><!-- 市场价 -->
                        <td class="text-center"><input type="number" onmousewheel="return false;" class="w80" name="price_cost" v-model="skuList[index].price_cost"></td><!-- 成本价 -->
                        <td class="text-center"><input type="number" onmousewheel="return false;" class="w100" name="product_store_nums" min="1" v-model="skuList[index].product_store_nums"></td><!-- 库存 -->
                        <td class="text-center"><input type="text" class="w80" name="product_code" v-model="skuList[index].product_code"></td><!-- 商品编码 -->
                        <td class="text-center"><input type="number" onmousewheel="return false;" class="w100" name="goods_weight" v-model="skuList[index].goods_weight"></td><!-- 重量 -->
                        <td class="text-center">
                          <el-checkbox v-model="skuList[index].goods_isonline" name="isonline"></el-checkbox>
                        <!--<input type="checkbox" name="isonline" v-model="skuList[index].goods_isonline">-->

                         <!-- 上架 --> 
                        </td>
                        <td class="text-center"><input type="number" onmousewheel="return false;" class="w100" name="goods_sort" v-model="skuList[index].sort"></td><!-- 排序 -->
                        <td class="text-center">
                            <a class="shop icon-shanchu1" @click="delItem(index,skuList[index].goods_product_id)" title="删除"></a>
                        </td>                                                           
                    </tr>
                </tbody>
            </table>
            <div class="clearfix">
              <!--<button type="button" class="btn btn-m btn-primary m-r-xs" @click="addSku">添加规格值</button>
              <button type="button" class="btn btn-m btn-primary" @click="batchAddSku">批量添加规格</button>-->
              <el-button type="primary" class="m-r-xs" @click="addSku">添加规格值</el-button>
              <el-button type="primary" class="m-r-xs" @click="batchAddSku">批量添加规格</el-button>
              <div class="hj_fr"><a @click="openBatchDialog">批量设置</a> <!-- <a>售价</a> <a>库存</a> --></div>              
            </div>
            <div class="m-t">总库存：{{sumStock}}<!-- <input type="number" v-model="sum_stock" disabled> --></div>     
        </div>
        <div class="hr-line-dashed"></div>
        <div class="form-group draggable ui-draggable">
            <div class="col-sm-12 col-sm-offset-5">
               <!-- <button class="btn btn-primary" type="submit" v-show="skuList!=''">提交</button>-->
                <el-button type="primary" v-show="skuList!=''">提交</el-button>
            </div>  
        </div>
        </vue-form>
		    <el-dialog title="选择图片" :visible.sync="dialogPic" :top="mgTop+'px'">
            <el-tabs v-model="activeName2" type="card">
              <el-tab-pane label="本地图片" name="first">
                <el-upload
                  class="avatar-uploader"
                  :action="sevUrl+'/admin/upload'" 
                  :show-file-list="false"
                  :data="usermsg"                                          
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="uploadPic" :src="uploadPic" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>                        
              </el-tab-pane>
              <el-tab-pane label="图片库" name="second" :data-val="galleryPicUrl">
                <PicLlibrary v-if="dialogPic"></PicLlibrary>
              </el-tab-pane>
              <el-tab-pane label="网络图片" name="third">
                网络图片：<input type="text" class="web-pic" v-model="webLinkPic" @blur="CheckUrl(webLinkPic)"> 图片地址必须以http开头,以jpg,png,bmp,gif结束
              </el-tab-pane>            
            </el-tabs>          
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="SureBtn">确 定</el-button>
              <el-button @click="CancelBtn">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="商品规格" :visible.sync="goodSpecVisible" :top="mgTop+'px'">
          <div class="spec-box">
            <div class="spec-head">商品规格（点选当前产品所需要规格）</div>
            <div class="spec-body clearfix">
              <div class="spec-left">
                <ul>
                  <li v-for="(item,index) in goodSpecList" :class="{'current':index==curIndex}"
                      @click="specSelect(item,index)">{{item.goods_sku_name}}<span v-if="item.checkedItem.length>0">（{{item.checkedItem.length}}）</span>
                  </li>
                </ul>
              </div>
              <div class="spec-right" v-if="goodSpecList.length>0">
                <div class="check-box">
                  <div class="check-all">
                    <el-checkbox v-model="goodSpecList[curIndex].checkAll" @change="checkAllChange">全选</el-checkbox>
                  </div>
                  <div class="check-group">
                    <el-checkbox-group v-model="goodSpecList[curIndex].checkedItem" @change="checkedItemChange">
                      <el-checkbox v-for="item in curItemSpec" :label="item" :key="item">{{item}}</el-checkbox>
                    </el-checkbox-group>
                  </div>
              </div>
            </div>
          </div>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="goodSpecVisible = false">取 消</el-button>
            <el-button type="primary" @click="generateAll">生成所有货品</el-button>
          </div>
        </el-dialog>
        <el-dialog title="价格模式" :visible.sync="dialogPrice" :top="mgTop+'px'" v-if="skuList!=''">      
          <vue-form :state="formstate2" @submit.prevent="onSubmit2" class="form-horizontal">
              <div class="form-group">
                <label class="col-sm-3 control-label">价格模式：</label>
                <div class="col-sm-7">
                  <el-radio-group v-model="price_model">
                    <el-radio-button :label="0">统一价格</el-radio-button>
                    <el-radio-button :label="1">阶梯价格</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
              <div class="form-group" v-if="price_model==1">
                <label class="col-sm-3 control-label">阶梯价格：</label>
                <div class="col-sm-7">
                  <div class="price-table">
                    <ul class="price-table-head">
                      <li>数量</li>
                      <li>价格</li>
                      <li class="opt-list">操作</li>
                    </ul>
                    <div class="price-table-body">
                      <ul v-for="(item,index) in skuList[dialogInd].priceArr" :key="index">
                        <li><input type="number" onmousewheel="return false;" v-model="item.amount"></li>
                        <li><input type="number" onmousewheel="return false;" v-model="item.prix"></li>
                        <li class="opt-list"><a @click="delPrice(index)">删除</a></li>
                      </ul>      
                    </div>
                  </div>
                    <a class="add-list" @click="addPrice" v-if="skuList[dialogInd].priceArr.length<3">添加</a>
                </div>
              </div>
              <validate class="form-group" v-if="price_model==0">
                <label class="col-sm-3 control-label">统一价格：</label>
                <div class="col-sm-7">
                  <input type="text" name="flat_price" class="form-control" v-model="skuList[dialogInd].flat_price" 
                  pattern="^([1-9]\d*|0)(\.\d{1,2})?$"
                   :class="fieldClassName(formstate2.flat_price)">
                  <field-messages name="flat_price" show="$touched || $submitted" class="form-control-callback">
                      <div slot="pattern" class="error">统一价格格式不正确</div>                    
                    </field-messages>                  
                </div>
              </validate>
              <validate class="form-group" v-if="price_model==0">
                <label class="col-sm-3 control-label"><span class="f-c-r">*</span>最小起订量：</label>
                <div class="col-sm-7">
                  <input type="text" name="min_moq" class="form-control" v-model="skuList[dialogInd].min_moq" required 
                  pattern="^[0-9]*[1-9][0-9]*$"
                   :class="fieldClassName(formstate2.min_moq)">
                  <field-messages name="min_moq" show="$touched || $submitted" class="form-control-callback">
                      <div slot="required" class="error">最小起订量不能为空</div>
                      <div slot="pattern" class="error">最小起订量格式不正确</div>                   
                    </field-messages>                  
                </div>
              </validate>
              <div class="form-group m-b-no">
                <div class="col-sm-12 col-sm-offset-4">
                  <button class="btn btn-primary" type="submit">确定</button>
                  <button class="btn btn-white m-l-sm" type="button" @click="dialogPrice=false">取消</button>
                </div>
              </div>
          </vue-form>
        </el-dialog>
        <el-dialog title="批量设置" :visible.sync="dialogBatchPrice" :top="mgTop+'px'">        
          <vue-form :state="formstate3" @submit.prevent="onSubmit3" class="form-horizontal">
              <div class="form-group" v-if='skuMsg.goods_retail==true||(skuMsg.goods_wholesale==false && skuMsg.goods_retail==false)'>
                <label class="col-sm-3 control-label">售价：</label>
                <validate class="col-sm-7">
                  <input type="text" name="batch_sku_price" class="form-control" v-model="batchPrice.sku_price" 
                  pattern="^([1-9]\d*|0)(\.\d{1,2})?$"
                   :class="fieldClassName(formstate3.batch_sku_price)">
                  <field-messages name="batch_sku_price" show="$touched || $submitted" class="form-control-callback">
                      <div slot="pattern" class="error">售价格式不正确</div>                    
                    </field-messages>
                </validate>
              </div>
              <div class="form-group">
                <label class="col-sm-3 control-label">库存：</label>
                <validate class="col-sm-7">
                  <input type="text" name="batch_stock" class="form-control" v-model="batchPrice.sku_stock" 
                  pattern="^[1-9]\d*$"
                   :class="fieldClassName(formstate3.batch_stock)">
                  <field-messages name="batch_stock" show="$touched || $submitted" class="form-control-callback">
                      <div slot="pattern" class="error">库存格式不正确</div>                    
                    </field-messages>
                </validate>
              </div>
              <template v-if="skuMsg.goods_wholesale==1">
              <div class="form-group">
                <label class="col-sm-3 control-label">价格模式：</label>
                <div class="col-sm-7">
                  <el-radio-group v-model="batchPrice.price_model">
                    <el-radio-button :label="0">统一价格</el-radio-button>
                    <el-radio-button :label="1">阶梯价格</el-radio-button>
                  </el-radio-group>
                </div>
              </div>
              <div class="form-group" v-if="batchPrice.price_model==1">
                <label class="col-sm-3 control-label">阶梯价格：</label>
                <div class="col-sm-7">
                  <div class="price-table">
                    <ul class="price-table-head">
                      <li>数量</li>
                      <li>价格</li>
                      <li class="opt-list">操作</li>
                    </ul>
                    <div class="price-table-body">
                      <ul v-for="(item,index) in batchPrice.priceArr" :key="index">
                        <li><input type="number" onmousewheel="return false;" v-model="item.amount"></li>
                        <li><input type="number" onmousewheel="return false;" v-model="item.prix"></li>
                        <li class="opt-list"><a @click="delBatchPrice(index)">删除</a></li>
                      </ul>      
                    </div>
                  </div>
                    <a class="add-list" @click="addBatchPrice" v-if="batchPrice.priceArr.length<3">添加</a>
                </div>
              </div>
              <validate class="form-group" v-if="batchPrice.price_model==0">
                <label class="col-sm-3 control-label">统一价格：</label>
                <div class="col-sm-7">
                  <input type="text" name="batch_flat_price" class="form-control" v-model="batchPrice.flat_price" 
                  pattern="^([1-9]\d*|0)(\.\d{1,2})?$"
                   :class="fieldClassName(formstate3.batch_flat_price)">
                  <field-messages name="batch_flat_price" show="$touched || $submitted" class="form-control-callback">
                      <div slot="pattern" class="error">统一价格格式不正确</div>                    
                    </field-messages>                  
                </div>
              </validate>
              <validate class="form-group" v-if="batchPrice.price_model==0">
                <label class="col-sm-3 control-label"><span class="f-c-r">*</span>最小起订量：</label>
                <div class="col-sm-7">
                  <input type="text" name="batch_min_moq" class="form-control" v-model="batchPrice.min_moq" required 
                  pattern="^[0-9]*[1-9][0-9]*$"
                   :class="fieldClassName(formstate3.batch_min_moq)">
                  <field-messages name="batch_min_moq" show="$touched || $submitted" class="form-control-callback">
                      <div slot="required" class="error">最小起订量不能为空</div>
                      <div slot="pattern" class="error">最小起订量格式不正确</div>                   
                    </field-messages>                  
                </div>
              </validate>
              </template>
              <div class="form-group m-b-no">
                <div class="col-sm-12 col-sm-offset-4">
                  <button class="btn btn-primary" type="submit">确定</button>
                  <button class="btn btn-white m-l-sm" type="button" @click="dialogBatchPrice=false">取消</button>
                </div>
              </div>
          </vue-form>
        </el-dialog>
	</div>
</template>

<script>
import  vm from '../../main.js'
import {Imgpath,sevUrl,CustomFun} from '../comms/main.js'
import PicLlibrary from '../comms/PicLlibrary.vue'
import {mapGetters,mapActions} from 'vuex'
import UnderScore from 'underscore'
    export default{
        name:"skuData",
        props: ['skuMsg'],
        components:{
          PicLlibrary
        },
        data(){
            return{                             
                formstate:{},
                formstate2:{},
                formstate3:{},           
                skuList:[],
                skuList2:{},
                activeName2: 'first',
                Imgpath:Imgpath,
                sevUrl:sevUrl,
                Verification:true,
                messages:'',
                isaddsku:false,
                dialogPic:false,
                dialogPrice:false,
                dialogBatchPrice:false,                           
                uploadPic:'',
                webLinkPic:'',
                galleryPic:'',
                dialogInd:0,
                pdialogInd:0,
                mgTop:'100',                            
                usermsg:{
                    'token_admin':JSON.parse(window.localStorage.getItem('access_token')),
                    'admin_id':JSON.parse(window.localStorage.getItem('userid'))
                },
                goodSpecVisible: false,
                goodSpecList: [],
                curItemSpec: [],
                curIndex: 0,  //当前第几个规格
                selectedSpecList: [],
                price_model:0,
                batchPrice:{
                  sku_price:'',
                  sku_stock:'',                   
                  price_model:0,
                  min_moq:null,
                  flat_price:null,
                  priceArr:[],
                }                                          
            }
        }, 
        computed: {     
            ...mapGetters([           
              'galleryUrl'      
            ]),
            galleryPicUrl(){
                this.galleryPic= this.galleryUrl;
            },
            sumStock(){
              var sumVal = 0;
              this.skuList.forEach(function (item,index) {
                sumVal = sumVal+parseInt(item.product_store_nums);                    
              });              
              return sumVal;
            }   
        },   
        mounted(){
            this.$store.commit('GALLERY_PIC_URL', '');
            this.dataInfo(this.skuMsg.goods_id);
            this.getGoodSpecList();                                          
        },
        updated(){            
            this.$emit('skulist', JSON.stringify(this.skuList),this.skuList2,false);             
        },        
        methods:{
            CheckUrl:CustomFun.CheckUrl,
            priceValid:CustomFun.priceValid,
            getScrollTop:CustomFun.getScrollTop,
            batchAddSku () {
                this.goodSpecVisible = true;
                if(this.getScrollTop()>1){
                    this.mgTop = this.getScrollTop();
                }else{
                    this.mgTop = "100"
                }
            },
            getGoodSpecList () {
              var that = this;
              that.$http({
                method: 'post',
                url: '/goods_sku/listdata'
              }).then(function (res) {
                if (res.data.error == '0') {
                  var goodSpec = res.data.data.table_data;
                  goodSpec.forEach(function (item, index) {
                    if (item.status_goods_sku == '已启用') {
                      that.$set(item, "checkedItem", []);
                      that.$set(item, "checkAll", false);
                      that.goodSpecList.push(item);
                    }
                  })
                  //默认选中第一个
                  that.specSelect(that.goodSpecList[0], 0);
                } else {
                  that.$message({
                    type: 'error',
                    message: res.data.desc
                  });
                }
              }).catch(function (error) {
                console.log(error);
              })
            },
            specSelect (item, index) {
              this.curIndex = index;
              if (item.goods_sku_value.indexOf(',') > 0) {
                this.curItemSpec = item.goods_sku_value.split(',');
              } else {
                this.curItemSpec.push(item.goods_sku_value);
              }
            },
            checkAllChange(event) {
              this.goodSpecList[this.curIndex].checkedItem = event.target.checked ? this.curItemSpec : [];
            },
            checkedItemChange(value) {
              this.goodSpecList[this.curIndex].checkedItem = value;
              this.goodSpecList[this.curIndex].checkAll = (value.length == this.curItemSpec.length);
            },
            bothDescartes (m, n) {
              var r = [];
              for (var i = 0; i < m.length; i++) {
                for (var j = 0; j < n.length; j++) {
                  var t = [];
                  if (Array.isArray(m[i])) {
                    t = m[i].slice(0);
                  } else {
                    t.push(m[i]);
                  }
                  t.push(n[j]);
                  r.push(t);
                }
              }
              return r;
            },
            descartes(args){
              var result = [];
              for (var i = 0; i < args.length; i++) {
                if (!Array.isArray(args[i])) {
                  return false;
                }
              }
              ;
              for (var i = 0; i < args.length; i++) {
                if (i == 0) {
                  result = args[i];
                } else {
                  result = this.bothDescartes(result, args[i]);
                }
              }
              return result;
            },
            generateAll () {
              var that = this;
              var selectedSpec = [];
              var skuTempList=that.skuList;
              that.skuList=[];
              skuTempList.forEach(function (item,index) {
                if(!item.isBatch){
                  that.skuList.push(item)
                }
              });
              that.goodSpecList.forEach(function (item, index) {
                if (item.checkedItem.length > 0) {
                  selectedSpec.push(item.checkedItem);
                }
              });
              that.selectedSpecList = that.descartes(selectedSpec);
              that.selectedSpecList.forEach(function (item, index) {
                that.skuList.push({
                  goods_sku: Array.isArray(item)?item.join(' '):item,
                  goods_product_id:null,
                  product_code: '',
                  product_img: '',
                  price_market: that.skuMsg.price_market,
                  product_store_nums: 0,
                  price_cost: that.skuMsg.price_cost,
                  product_sku_price: that.skuMsg.goods_price,
                  goods_weight: that.skuMsg.goods_weight,
                  sort: 0,
                  goods_isonline: true,
                  isBatch:true,
                  price_model:0,
                  min_moq:null,
                  flat_price:null,
                  priceArr:[],
                  price_wholesale:{},
                  goods_wholesale_type:'',
                  goods_wholesale_pri:'',
                })
              })
              this.goodSpecVisible = false;
              //console.log(that.skuList)
            },
            objectAssign (obj,oldObj) {
                for (var key in oldObj){
                  obj[key]=oldObj[key];
                }
            },                    
            fieldClassName:function(field){
                if(!field){
                    return '';
                }else if((field.$submitted) && field.$invalid){
                    return 'error';
                }else if((field.$submitted) && field.$valid){
                    return 'valid';
                }
            },
            dataInfo:function(cid){
                var that = this;
                that.$http({
                          method:'post',
                          url: '/goods_product/listdata',
                          params:{
                            'goods_id':cid                       
                          }           
                        }).then(function (res) {                       
                            var  fieldList =  res.data.data.table_data;                                  
                            if(res.data.error==0){                                
                                that.skuList=[];                                
                                var priceType = 0;
                                var priceArr = [];
                                var priArr = [];
                                var min_moq = null;
                                var flat_price = null;
                                var maxPri = null;
                                var minPri = null;
                                for(var i=0;i<fieldList.length;i++){
                                  if(fieldList[i].price_model!=null && fieldList[i].price_wholesale!=null){
                                  var price_wholesale_arr = JSON.parse(fieldList[i].price_wholesale); 
                                    if(fieldList[i].price_model == 1){//阶梯价
                                      if(Array.isArray(price_wholesale_arr.wholesale_price)){
                                        priceArr = price_wholesale_arr.wholesale_price;
                                        priceArr.forEach(function (item,index) {
                                          priArr.push(item.prix);                 
                                        });
                                        maxPri = Math.max.apply(null, priArr);//最大值
                                        minPri = Math.min.apply(null, priArr); //最小值
                                      }else{
                                        priceArr = [];
                                      }
                                      flat_price = null;
                                      min_moq = null;                                              
                                    }else{
                                      flat_price = price_wholesale_arr.wholesale_price;
                                      min_moq = price_wholesale_arr.min_moq;
                                      priceArr = [];
                                      maxPri = null;
                                      minPri = null;
                                    }
                                  }
                                  var priModel = fieldList[i].price_model==null?0:fieldList[i].price_model;                                 
                                    that.skuList.push({
                                        goods_product_id:fieldList[i].goods_product_id,
                                        goods_sku:fieldList[i].goods_sku,
                                        product_code:fieldList[i].product_code,
                                        product_img:fieldList[i].product_img,
                                        price_market:fieldList[i].price_market,
                                        product_store_nums:fieldList[i].product_store_nums,
                                        price_cost:fieldList[i].price_cost,
                                        product_sku_price:fieldList[i].product_sku_price,
                                        goods_weight:fieldList[i].goods_weight,
                                        sort:fieldList[i].sort,
                                        goods_isonline:fieldList[i].goods_isonline,
                                        isBatch:false,
                                        price_model:fieldList[i].price_model,
                                        price_wholesale:fieldList[i].price_wholesale,
                                        priceArr:priceArr,
                                        min_moq:min_moq,
                                        flat_price:flat_price,
                                        goods_wholesale_pri:priModel==0?flat_price:minPri+'-'+maxPri,//批发价
                                        goods_wholesale_type:priModel==0?'统一价：':'阶梯价：'                 
                                     });
                                }                                
                                that.skuList2 = JSON.stringify(that.skuList);                   
                            }else{                                 
                                that.$message({
                                type: 'warning',
                                message: '规格信息-'+res.data.desc
                              });
                            }                                                        
                        }).catch(function (error) {
                            console.log(error);
                        });
            },
            delItem:function(index,id){
              var that = this;
              if(id>0){
                this.$confirm('您确定要删除此规格吗？', '提示', {
                  confirmButtonText: '确认',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  that.$http({
                    method:'post',
                    url: '/goods_product/delete',
                    params:{
                      'goods_product_id':id 
                    }
                  }).then(function (res) {                
                    if(res.data.error==0){
                      that.skuList.splice(index, 1);              
                      that.$message({
                        type: 'success',
                        message: '删除成功!'
                      });                      
                    }else{
                      that.$message({
                        message: res.data.desc,
                        type: 'warning'
                      });
                    }
                  }).catch(function (error) {
                    console.log(error);
                  });
                }).catch(() => {
                  //已取消
                });           
              }else{
                //console.log(that.skuList);
                this.$confirm('您确定要删除此规格吗？', '提示', {
                  confirmButtonText: '确认',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.skuList.splice(index, 1);
                }).catch(() => {
                  //已取消
                });                
              }       
            },
            addSku:function(){
                this.isaddsku = true;            	
                this.skuList.push({
                    goods_product_id:'',
                    product_code:'',
                    product_img:'',
                    product_store_nums:0,
                    goods_wholesale_type:'',
                    goods_wholesale_pri:'',
                    price_market:this.skuMsg.price_market,
                    price_cost:this.skuMsg.price_cost,
                    goods_sku:'',
                    product_sku_price:this.skuMsg.goods_price,
                    goods_weight:this.skuMsg.goods_weight,
                    sort:0,
                    goods_isonline:true,
                    isBatch:false,
                    price_model:0,
                    min_moq:null,
                    flat_price:null,
                    priceArr:[],
                    price_wholesale:{}   
                 });                
            },
            addPrice:function(){                                   
                this.skuList[this.dialogInd].priceArr.push({
                    amount:null,
                    prix:null
                 });
            },
            delPrice:function(index){
                this.skuList[this.dialogInd].priceArr.splice(index, 1);                
            },            
            openPriDialog:function(index){
              this.dialogPrice = true;
              this.dialogInd = index;
              this.price_model = this.skuList[index].price_model;
              if(this.price_model == null){
                this.price_model = 0;
              }
              if(this.getScrollTop()>1){
                  this.mgTop = this.getScrollTop();
              }else{
                  this.mgTop = "100"
              }                     
            },
            onSubmit2:function(){//确定价格模式弹窗
              var that = this;
              var priArr = [];                                     
              if (this.formstate2.$valid) {
                that.skuList[that.dialogInd].price_model = that.price_model;             
                if(that.skuList[that.dialogInd].price_model == 1){
                     if(that.skuList[that.dialogInd].priceArr==""){//阶梯价不能为空 
                          that.$message({
                            message: '阶梯价不能为空',
                            type: 'warning'
                          }); 
                          return
                      }                                  
                    that.skuList[that.dialogInd].price_wholesale={
                      wholesale_price:that.skuList[that.dialogInd].priceArr,
                      min_moq:0
                    };
                    that.skuList[that.dialogInd].price_wholesale.wholesale_price.forEach(function (item,index) {
                      priArr.push(item.prix);                 
                    });                    
                    var maxPri = Math.max.apply(null, priArr);//最大值
                    var minPri = Math.min.apply(null, priArr); //最小值
                    that.skuList[that.dialogInd].goods_wholesale_type = '阶梯价：';
                    that.skuList[that.dialogInd].goods_wholesale_pri = minPri+'-'+maxPri;
                    that.skuList[that.dialogInd].flat_price = null;
                    that.skuList[that.dialogInd].min_moq = null;
                }else{                  
                  that.skuList[that.dialogInd].price_wholesale={
                      wholesale_price:that.skuList[that.dialogInd].flat_price,
                      min_moq:that.skuList[that.dialogInd].min_moq
                    };
                   that.skuList[that.dialogInd].goods_wholesale_type = '统一价：';
                   that.skuList[that.dialogInd].goods_wholesale_pri = that.skuList[that.dialogInd].flat_price;
                   that.skuList[that.dialogInd].priceArr = [];
                }           
                that.dialogPrice = false;
                that.dialogInd = 0;
              }
            },
            /* 批量价格设置*/
            openBatchDialog:function(){
              this.dialogBatchPrice = true;
              this.batchPrice={
                  sku_price:'',
                  sku_stock:'',                   
                  price_model:null,
                  min_moq:null,
                  flat_price:null,
                  priceArr:[],
                }              
              if(this.getScrollTop()>1){
                  this.mgTop = this.getScrollTop();
              }else{
                  this.mgTop = "100"
              }                     
            },
            addBatchPrice:function(){                                   
                this.batchPrice.priceArr.push({
                    amount:null,
                    prix:null
                 });
            },
            delBatchPrice:function(index){
                this.batchPrice.priceArr.splice(index, 1);                
            },
            onSubmit3:function(){//确定批量价格弹窗
              var that = this;              
              if (this.formstate3.$valid) {
                if(that.batchPrice.sku_price!=''&&that.batchPrice.sku_price!=null){//售价
                  that.skuList.forEach(function (item,index) {
                    item.product_sku_price = that.batchPrice.sku_price;                    
                  });
                }
                if(that.batchPrice.sku_stock!=''&&that.batchPrice.sku_stock!=null){//库存
                  that.skuList.forEach(function (item,index) {
                    item.product_store_nums = that.batchPrice.sku_stock;                    
                  });
                }
                if(that.batchPrice.price_model!=null){//价格模式
                  if(that.batchPrice.price_model==0){
                    that.skuList.forEach(function (item,index) {
                      item.price_model = that.batchPrice.price_model;
                      item.min_moq = that.batchPrice.min_moq;
                      item.flat_price = that.batchPrice.flat_price;
                      item.priceArr=[];
                      item.price_wholesale = {
                        min_moq:that.batchPrice.min_moq,
                        wholesale_price:that.batchPrice.flat_price
                      };
                      item.goods_wholesale_type = '统一价：';
                      item.goods_wholesale_pri = that.batchPrice.flat_price;
                    });                    
                  }else{
                    var priArr = [];
                    if(that.batchPrice.priceArr==""){//阶梯价不能为空 
                        that.$message({
                          message: '阶梯价不能为空',
                          type: 'warning'
                        });                          
                        return                        
                    }
                    that.skuList.forEach(function (item,index) {
                      item.price_model = that.batchPrice.price_model;
                      item.min_moq = null;
                      item.flat_price = null;                      
                      item.priceArr = that.batchPrice.priceArr;                      
                      item.price_wholesale = {
                        min_moq:0,
                        wholesale_price:that.batchPrice.priceArr
                      };
                      item.goods_wholesale_type = '阶梯价：';
                      item.priceArr.forEach(function (items,index) {
                        priArr.push(items.prix);                 
                      });
                      var maxPri = Math.max.apply(null, priArr);//最大值
                      var minPri = Math.min.apply(null, priArr); //最小值
                      item.goods_wholesale_pri = minPri+'-'+maxPri;
                    });
                  }
                }                                             
                that.dialogBatchPrice = false;
              }
            },
            SureBtn:function(){
                var ind = this.pdialogInd;                
                if(this.activeName2 == "first"){
                    if(this.uploadPic != ""){
                        this.skuList[ind].product_img = this.uploadPic;
                        this.dialogPic = false; 
                    }else{
                        this.$message({
                          message: '请选择文件后再上传',
                          type: 'warning'
                        });
                    }                   
                }else if(this.activeName2 == "second"){
                    if(this.galleryPic != ""){
                        this.skuList[ind].product_img = this.galleryPic;
                        this.dialogPic = false;
                        this.$store.commit('GALLERY_PIC_URL', ''); 
                        this.activeName2 = 'first';
                    }else{                        
                        this.$message({
                          message: '未选择任何图片',
                          type: 'warning'
                        });
                    }                   
                }else{
                    if(this.webLinkPic != ""){
                        var str = this.webLinkPic;                        
                        if(this.CheckUrl(str)){
                            this.skuList[ind].product_img = this.webLinkPic;
                            this.dialogPic = false;
                            this.activeName2 = 'first';
                        }else{
                            this.$message({
                              message: '请正确输入地址',
                              type: 'warning'
                            });
                        }                         
                    }else{
                        this.$message({
                          message: '请输入网络图片地址',
                          type: 'warning'
                        });
                    }
                }                                 
            },
            CancelBtn(){
              this.dialogPic = false;              
              this.activeName2 = 'first';
            },
            picChange(index){
                this.dialogPic = true;
                this.pdialogInd = index;
                this.uploadPic = '';
                this.webLinkPic = '';
                this.galleryPic = '';
                if(this.getScrollTop()>1){
                    this.mgTop = this.getScrollTop();
                }else{
                    this.mgTop = "100"
                }               
            },
            handleAvatarSuccess(res, file) {                                         
                var PcPath = Imgpath+res.data.file_path;
                this.uploadPic = PcPath;
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isGIF = file.type === 'image/gif';
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isJPG&&!isPNG&&!isGIF) {
                  this.$message.error('上传图片只能是 JPG、PNG、GIF 格式!');
                }
                if (!isLt2M) {
                  this.$message.error('上传图片大小不能超过 2MB!');
                }
                return (isJPG||isPNG||isGIF) && isLt2M;
            },            
            onSubmit:function(){
                var that = this;
                var skusum = 0;
                var skuArr = that.skuList;           
                for(var ii=0; ii<skuArr.length; ii++) {
                    //skuArr[ii].product_store_nums =  parseInt(skuArr[ii].product_store_nums);
                    if(that.skuMsg.goods_wholesale==true){//批发价不能为空 
                       if(UnderScore.isEmpty(skuArr[ii].price_wholesale)){                            
                            that.$message({
                              message: '批发价不能为空',
                              type: 'warning'
                            }); 
                            return
                            this.Verification = false;
                        }
                    }                                      
                    if(skuArr[ii].goods_sku==''){
                        //console.log(skuArr[0].goods_sku)
                        that.$message({
                          message: '规格值名称不能为空',
                          type: 'warning'
                        }); 
                        return
                        this.Verification = false;
                    }else if(skuArr[ii].product_img==''){
                        that.$message({
                          message: '图片不能为空',
                          type: 'warning'
                        });
                        return
                        this.Verification = false;
                    }else if(skuArr[ii].product_sku_price==''){
                        that.$message({
                          message: '售价不能为空',
                          type: 'warning'
                        });
                        return
                        this.Verification = false;
                    }else if(!that.priceValid(skuArr[ii].product_sku_price)){
                        that.$message({
                          message: '售价格式不正确',
                          type: 'warning'
                        });
                        return
                        this.Verification = false;
                    }else if(skuArr[ii].price_market==''){
                        that.$message({
                          message: '市场价不能为空',
                          type: 'warning'
                        });
                        return
                        this.Verification = false;
                    }else if(!that.priceValid(skuArr[ii].price_market)){
                        that.$message({
                          message: '市场价格式不正确',
                          type: 'warning'
                        });
                        return
                        this.Verification = false;
                    }else if(skuArr[ii].price_cost==''){
                        that.$message({
                          message: '成本价不能为空',
                          type: 'warning'
                        });
                        return 
                        this.Verification = false;
                    }else if(!that.priceValid(skuArr[ii].price_cost)){
                        that.$message({
                          message: '成本价格式不正确',
                          type: 'warning'
                        });
                        return 
                        this.Verification = false;
                    }else if(skuArr[ii].product_store_nums==''){ 
                        that.$message({
                          message: '库存不能为空',
                          type: 'warning'
                        });
                        return 
                        this.Verification = false;
                    }else if(skuArr[ii].product_store_nums<1){ 
                        that.$message({
                          message: '库存不能小于0',
                          type: 'warning'
                        });
                        return 
                        this.Verification = false;
                    }else if(skuArr[ii].product_code==''){
                        that.$message({
                          message: '商品编码不能为空',
                          type: 'warning'
                        });
                        return 
                        this.Verification = false;
                    }else{
                        this.Verification = true;
                    }
                    skusum += parseInt(skuArr[ii].product_store_nums);
                }            
                if(this.Verification){
                  // for(var v=0;v<that.skuList.length;v++){
                  //   delete that.skuList[v].flat_price;
                  //   delete that.skuList[v].priceArr;
                  //   delete that.skuList[v].min_moq;
                  // }                                                                       
                    that.$http({
                          method:'post',
                          url: '/goods_product/editsubmit',
                          params:{ 
                            'goods_id':that.skuMsg.goods_id,
                            'goods_store_nums':skusum,                        
                            'proArr':JSON.stringify(that.skuList)
                          }           
                        }).then(function (res) {                                                 
                            if(res.data.error==0){
                                that.$message({
                                  message: '规格更新成功',
                                  type: 'success'
                                });
                                that.skuList2 = JSON.stringify(that.skuList);
                                that.$emit('skulist', JSON.stringify(that.skuList),that.skuList2,true); 
                                that.dataInfo(that.skuMsg.goods_id);
                            }else{
                                that.$message({
                                  message: res.data.desc,
                                  type: 'warning'
                                });                                
                            }                               
                        }).catch(function (error) {
                            console.log(error);
                        });
                }else{
                    that.$message({
                      message: this.messages,
                      type: 'warning'
                    });
                }
            }            
        }
    }
</script>

<style scoped>
  .el-dialog__wrapper {
    outline: 0;
  }
  .el-checkbox {    
    margin-right: 15px;
  }

  .el-checkbox + .el-checkbox {
    margin-left: 0;
  }

  .spec-box {
    margin: -15px -20px;
  }

  .spec-box .spec-head {
    line-height: 24px;
    padding-bottom: 8px;
    padding-left: 20px;
  }

  .spec-box .spec-body {
    height: 200px;
    border-top: 1px solid #dedede;
    border-bottom: 1px solid #dedede;
  }

  .spec-box .spec-body .spec-left {
    width: 28%;
    height: 100%;
    padding: 10px;
    border-right: 1px solid #dedede;
    float: left;
  }

  .spec-box .spec-body .spec-left ul li {
    line-height: 24px;
    padding: 0 5px;
    cursor: pointer;
  }

  .spec-box .spec-body .spec-left ul li:hover {
    background-color: #f5f5f5;
  }

  .spec-box .spec-body .spec-left ul li.current {
    background-color: #ececec;
  }

  .spec-box .spec-body .spec-right {
    width: 72%;
    height: 100%;
    padding: 10px;
    float: right;
    overflow: auto;
  }
  .check-box{
    border:1px solid #dedede;
    margin-bottom: 10px;
  }
  .check-all {
    height: 34px;
    line-height: 34px;
    background-color: #f3f3f3;
    border-bottom:1px solid #dedede;
    padding: 0 10px;
    margin-bottom: 16px;
  }
  .check-group {
    margin: 8px 24px;
  }
  .addPri{font-size:15px; font-weight:700; color:#2FB2E6; margin-left:5px;vertical-align:text-bottom;
}
  .add-list{/*position: absolute; right: -22px; top: 5px*/}
  .price-body{height: 50px; overflow: scroll;}
  .price-table .price-table-head{height: 30px; line-height: 30px; background: #2FB2E6; color: #fff}
  .price-table .price-table-head li{display: inline-block; text-align: center; width: 100px}
  .price-table .opt-list{text-align: left; width: 50px !important;}
  .price-table .price-table-body{height:auto;max-height: 100px; overflow-y: auto; border: 1px solid #E5E6E7;}
  .price-table .price-table-body li{display: inline-block; height: 30px; line-height: 30px; text-align: center;  width: 100px; font-size: 12px;}
  .price-table .price-table-body li input{height: 20px; line-height: 20px; width: 60px; text-align: center;}
</style>
