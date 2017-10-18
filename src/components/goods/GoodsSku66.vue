<template>
	<div id="skuData">
	<vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t" id="commentForm">
		<div class="table-responsive clearfix">
            <h5>规格值</h5>
            <table class="table table-bordered table-hover">
                <thead>
                    <tr>
                        <th>规格值名称</th>
                        <th class="text-center">规格图片</th>
                        <th class="text-center">售价(元)</th>
                        <th class="text-center">市场价(元)</th>
                        <th class="text-center">成本价(元)</th>
                        <th class="text-center">库存</th>
                        <th class="text-center">商品编码</th>
                        <th class="text-center">重量(g)</th>
                        <th class="text-center">上架</th>
                        <th class="text-center">排序</th>
                        <th class="text-center" >操作</th>
                    </tr>
                </thead>                                    
                <tbody>                                     
                    <tr v-for="(item,index) in skuList" :key="index" v-if="skuList">
                        <td><input type="text" class="w150" name="goods_sku" v-model="skuList[index].goods_sku"></td>
                        <td class="text-center"><img v-if="skuList[index].product_img" :src="skuList[index].product_img" class="listImg" @click="picChange(index)"/><a v-else @click="picChange(index)">选择图片</a></td>
                        <td class="text-center"><input type="number" onmousewheel="return false;" class="w80" name="product_sku_price" v-model="skuList[index].product_sku_price"><i class="icon_l_add addPri" @click="openPriDialog(index)"></i></td>
                        <td class="text-center"><input type="number" onmousewheel="return false;" class="w80" name="price_market" v-model="skuList[index].price_market"></td>
                        <td class="text-center"><input type="number" onmousewheel="return false;" class="w80" name="price_cost" v-model="skuList[index].price_cost"></td>
                        <td class="text-center"><input type="number" onmousewheel="return false;" class="w100" name="product_store_nums" min="1" v-model="skuList[index].product_store_nums"></td>
                        <td class="text-center"><input type="text" class="w80" name="product_code" v-model="skuList[index].product_code"></td>
                        <td class="text-center"><input type="number" onmousewheel="return false;" class="w80" name="goods_weight" v-model="skuList[index].goods_weight"></td>
                        <td class="text-center"><input type="checkbox" name="isonline" v-model="skuList[index].goods_isonline">  
                        </td>
                        <td class="text-center"><input type="number" onmousewheel="return false;" class="w100" name="goods_sort" v-model="skuList[index].sort"></td>
                        <td class="text-center">
                            <a class="icon_l_delete" @click="delItem(index)" title="删除"></a>
                        </td>                                                           
                    </tr>
                </tbody>
            </table>
            <button type="button" class="btn btn-m btn-primary m-r-xs" @click="addSku">添加规格值</button>
            <button type="button" class="btn btn-m btn-primary" @click="batchAddSku">批量添加规格</button>           
        </div>
        <div class="hr-line-dashed"></div>
        <div class="form-group draggable ui-draggable">
            <div class="col-sm-12 col-sm-offset-5">
                <button class="btn btn-primary" type="submit" v-show="skuList!=''">提交</button>
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
                网络图片：<input type="text" class="web-pic" v-model="webLinkPic"> 图片地址必须以http开头,以jpg,png,bmp,gif结束
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
                <el-radio-group v-model="skuList[dialogInd].price_model">
                  <el-radio-button :label="0">统一价格</el-radio-button>
                  <el-radio-button :label="1">阶梯价格</el-radio-button>
                </el-radio-group>
              </div>
            </div>
            <div class="form-group" v-if="skuList[dialogInd].price_model==1">
              <label class="col-sm-3 control-label">阶梯价格：</label>
              <div class="col-sm-7">
                <div class="price-table">
                  <ul class="price-table-head">
                    <li>数量</li>
                    <li>价格</li>
                    <li class="opt-list">操作</li>
                  </ul>
                  <div class="price-table-body">
                    <ul v-for="(item,index) in skuList[dialogInd].price_wholesale.wholesale_price" :key="index">
                      <li><input type="text" name="min_omq" id="min_omq"></li>
                      <li><input type="text" name="min_omq" id="min_omq"></li>
                      <li class="opt-list"><a @click="delPrice(index)">删除</a></li>
                    </ul>      
                  </div>
                </div>
                  <a class="add-list" @click="addPrice">添加</a>
              </div>
            </div>
            <validate class="form-group" v-if="skuList[dialogInd].price_model==0">
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
            <validate class="form-group">
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
                uploadPic:'',
                webLinkPic:'',
                galleryPic:'',
                dialogInd:0,
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
            }
        }, 
        computed: {     
            ...mapGetters([           
              'galleryUrl'      
            ]),
            galleryPicUrl(){
                this.galleryPic= this.galleryUrl;
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
                  product_code: '',
                  product_img: '',
                  price_market: 0,
                  product_store_nums: 0,
                  price_cost: 0,
                  product_sku_price: 0,
                  goods_weight: 0,
                  sort: 0,
                  goods_isonline: true,
                  isBatch:true,
                  price_model:0,                
                  min_moq:null,
                  flat_price:null,
                  priceArr:[]
                })
              })
              this.goodSpecVisible = false;
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
            dataInfo(cid){
                var that = this;
                that.$http({
                          method:'post',
                          url: '/goods_product/listdata',
                          params:{
                            'goods_id':cid                       
                          }           
                        }).then(function (res) { 
                            //console.log(res)                                                   
                            var  fieldList =  res.data.data.table_data;                                  
                            if(res.data.error==0){                                
                                that.skuList=[];
                                for(var i=0;i<fieldList.length;i++){                                   
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
                                        price_model:0,
                                        price_wholesale:fieldList[i].price_wholesale,           
                                        min_moq:null,
                                        flat_price:null,
                                        priceArr:[]   
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
            delItem:function(index){
                this.skuList.splice(index, 1);                
            },
            addSku:function(){
                this.isaddsku = true;            	
                this.skuList.push({
                    goods_product_id:"",
                    product_code:"",
                    product_img:'',
                    product_store_nums:0,
                    price_market:this.skuMsg.price_market,
                    price_cost:this.skuMsg.price_cost,
                    goods_sku:'',
                    product_sku_price:this.skuMsg.goods_price,
                    goods_weight:this.skuMsg.goods_weight,
                    sort:0,
                    goods_isonline:true,
                    isBatch:false,
                    price_model:0,
                    price_wholesale:{
                      wholesale_price:[],
                      min_moq:null
                    },             
                    min_moq:null,
                    flat_price:null,
                    priceArr:[]      
                 });
            },
            addPrice:function(){                                   
                this.skuList[this.dialogInd].price_wholesale.wholesale_price.push({
                    amount:null,
                    prix:null
                 });
            },
            delPrice:function(index){
                this.skuList[this.dialogInd].price_wholesale.wholesale_price.splice(index, 1);                
            },
            SurePrice:function(index){//确定价格弹窗
                           
            },
            SureBtn(){
                var ind = this.dialogInd;                
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
                this.dialogInd = index;
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
                //return isJPG && isLt2M;
                return (isJPG||isPNG||isGIF) && isLt2M;
            },            
            onSubmit:function(){
                var that = this;
                var skusum = 0;
                var skuArr = that.skuList;                              
                for(var ii=0; ii<skuArr.length; ii++) {                                        
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
                    }else if(skuArr[ii].price_market==''){
                        that.$message({
                          message: '市场价不能为空',
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
                    }else if(skuArr[ii].product_store_nums==''){ 
                        that.$message({
                          message: '库存不能为空',
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
                    skusum += skuArr[ii].product_store_nums;
                }            
                if(this.Verification){                                                                        
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
            },
            openPriDialog:function(index){
              this.dialogPrice = true;
              this.dialogInd = index;                     
            },
            onSubmit2:function(){
              var that = this; 
              if (this.formstate.$valid) {
                console.log(66)
              }
            },
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
  .addPri{font-size: 15px; font-weight: 700; color: #2FB2E6; margin-left: 5px;}
  .add-list{position: absolute; right: -22px; top: 5px}
  .price-body{height: 50px; overflow: scroll;}
  .price-table .price-table-head{height: 30px; line-height: 30px; background: #2FB2E6; color: #fff}
  .price-table .price-table-head li{display: inline-block; text-align: center; width: 100px}
  .price-table .opt-list{text-align: left; width: 50px !important;}
  .price-table .price-table-body{height:auto;max-height: 100px; overflow-y: auto; border: 1px solid #E5E6E7;}
  .price-table .price-table-body li{display: inline-block; height: 30px; line-height: 30px; text-align: center;  width: 100px; font-size: 12px;}
  .price-table .price-table-body li input{height: 20px; line-height: 20px; width: 60px; text-align: center;}
</style>
