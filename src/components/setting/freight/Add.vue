<template>
  <div id="BrandAdd">
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">                       
                        <div class="ibox-content p-m">
                          <div class="hd-title">添加模板</div> 
                            <vue-form :state="formstate" name="commentForm" @submit.prevent="onSubmit" class="form-horizontal m-t" id="commentForm" >
                                <validate class="form-group">
                                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>模板名称：</label>
                                    <div class="col-sm-4">                 
                                        <input type="text" name="templet_name" class="form-control" v-model="fields.templet_name" required :class="fieldClassName(formstate.templet_name)">
                                        <field-messages name="templet_name" show="$touched ||$submitted" class="form-control-callback">
                                            <div class="valid">Success!</div>
                                            <div slot="required" class="error">模板名称不能为空.</div>
                                        </field-messages>
                                    </div>
                                </validate>
                                <validate class="form-group">
                                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>保价费用：</label>
                                    <div class="col-sm-4">                 
                                        <input type="text" name="insured_cost" class="form-control" v-model="fields.insured_cost" required pattern="^([1-9]\d*|0)(\.\d{1,2})?$" :class="fieldClassName(formstate.insured_cost)">
                                        <span class="units">元</span>
                                        <field-messages name="insured_cost" show="$touched ||$submitted" class="form-control-callback">
                                            <div class="valid">Success!</div>
                                            <div slot="required" class="error">保价费用不能为空.</div>
                                            <div slot="pattern" class="error">格式不正确.</div>
                                        </field-messages>
                                    </div>
                                </validate>
                                <div class="form-group">
                                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>货到付款：</label>
                                    <div class="col-sm-6">
                                        <el-radio class="radio" v-model="fields.cash_on_delivery" :label="1">是</el-radio>
                                        <el-radio class="radio" v-model="fields.cash_on_delivery" :label="0">否</el-radio>
                                    </div>
                                </div>
                                <validate class="form-group">
                                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>配送方式描述：</label>
                                    <div class="col-sm-4">                 
                                        <textarea name="remark" class="form-control" v-model="fields.remark" required :class="fieldClassName(formstate.remark)">{{fields.remark}}</textarea>
                                        <field-messages name="remark" show="$touched ||$submitted" class="form-control-callback">
                                            <div class="valid">Success!</div>
                                            <div slot="required" class="error">配送方式描述不能为空.</div>
                                        </field-messages>
                                    </div>
                                </validate>                                
                                <div class="form-group">
                                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>费用计算方式：</label>
                                    <div class="col-sm-6">        
                                          <el-radio class="radio" v-model="fields.calculation" :label="0">按重量计算</el-radio>
                                          <el-radio class="radio" v-model="fields.calculation" :label="1">按件数计算</el-radio>                                    
                                    </div>
                                </div>                                         
                                <div class="form-group" v-if="fields.calculation==0">
                                    <label class="col-sm-3 control-label">运送方式：</label>
                                    <div class="col-sm-7 m-t-8">
                                        <div class="transport">
                                          <div class="transport-header">
                                            默认运费
                                          <validate>
                                            <input type="text" name="default_weight" class="finput" v-model="fields.default_weight" @input="formatNumber('default_weight')" required :class="fieldClassName(formstate.default_weight)" />
                                            <field-messages name="default_weight" show="$touched ||$submitted" class="form-control-callback">
                                              <!-- <div slot="required" class="error"></div> -->
                                            </field-messages>
                                        </validate>kg内 
                                        <validate>
                                        <input type="text" name="default_freight" class="finput" v-model="fields.default_freight" @input="formatNumber('default_freight')" required :class="fieldClassName(formstate.default_freight)" />
                                          <field-messages name="default_freight" show="$touched ||$submitted" class="form-control-callback">
                                            <!-- <div slot="required" class="error">默认费用.</div> -->
                                          </field-messages>
                                        </validate>元 每增加
                                        <validate>
                                        <input type="text" name="extra_freight" class="finput" v-model="fields.extra_freight" @input="formatNumber('extra_freight')" required :class="fieldClassName(formstate.extra_freight)" />
                                          <field-messages name="extra_freight" show="$touched ||$submitted" class="form-control-callback">
                                            <!-- <div slot="required" class="error">续重量.</div> -->
                                          </field-messages>
                                        </validate>kg,增加运费
                                        <validate>
                                        <input type="text" name="extra_weight" class="finput" v-model="fields.extra_weight" @input="formatNumber('extra_weight')" required :class="fieldClassName(formstate.extra_weight)" />
                                          <field-messages name="extra_weight" show="$touched ||$submitted" class="form-control-callback">
                                            <!-- <div slot="required" class="error">续费.</div> -->
                                          </field-messages>
                                        </validate>元
                                          </div>
                                          <table class="table table-bordered">
                                              <thead>
                                                  <tr>
                                                      <th width="220">运送到</th>
                                                      <th class="text-center">首重量(kg)</th>
                                                      <th class="text-center">首费(元)</th>
                                                      <th class="text-center">续重量(kg)</th>
                                                      <th class="text-center">续费(元)</th>
                                                      <th class="text-center">操作</th>
                                                  </tr>
                                              </thead>                                    
                                              <tbody>                                     
                                                  <tr v-for="(item,index) in TransportList">
                                                      <td><span class="m-r-sm" v-for="area in item.delivery_addr_name">{{area.name}}</span><a class="blue" @click="editAdr(index)">编辑</a></td>
                                                      <td class="text-center"><input type="text" class="finput" v-model="item.weight" @input="formatNumber2(index,'weight')"/></td>
                                                      <td class="text-center"><input type="text" class="finput" v-model="item.freight" @input="formatNumber2(index,'freight')" /></td>
                                                      <td class="text-center"><input type="text" class="finput" v-model="item.extra_weight" @input="formatNumber2(index,'extra_weight')"/></td>
                                                      <td class="text-center"><input type="text" class="finput" v-model="item.extra_freight" @input="formatNumber2(index,'extra_freight')"/></td>           
                                                      <td class="text-center"><a @click="removeList(index)">删除</a></td>
                                                  </tr> 
                                              </tbody>
                                          </table>
                                          <div><a class="blue" @click="addList">为指定地区城市设置运费</a></div>
                                        </div>
                                    </div>
                                </div>
                                <validate class="form-group" v-if="fields.calculation==1">
                                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>单件商品费用：</label>
                                    <div class="col-sm-4">                 
                                        <input type="text" name="unit_freight" class="form-control" v-model="fields.unit_freight" required 
                                        pattern="^([1-9]\d*|0)(\.\d{1,2})?$" 
                                        :class="fieldClassName(formstate.unit_freight)">
                                        <span class="units">元</span>
                                        <field-messages name="unit_freight" show="$touched ||$submitted" class="form-control-callback">                                            
                                            <div slot="required" class="error">单件商品费用不能为空.</div>
                                            <div slot="pattern" class="error">格式不正确.</div>
                                        </field-messages>
                                    </div>
                                </validate>
                              <div class="hr-line-dashed"></div>
                                <div class="form-group draggable ui-draggable">
                                    <div class="col-sm-12 col-sm-offset-3">
                                        <!--<button class="btn btn-primary" type="submit">提交</button>
                                        <router-link to="/setting/freight/list" class="btn btn-white m-l-sm">返回列表</router-link>-->
                                        <el-button type="primary" native-type="submit">确定</el-button>
                                        <router-link to="/setting/freight/list" class="white-btn m-l-sm">返回列表</router-link>
                                    </div>  
                                </div>
                            </vue-form>
                      </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="选择区域" :visible.sync="dialogAreaVisible" :close-on-click-modal="false">          
          <div class="areaBox">
            <div class="menu-item clearfix" v-for="(item,index) in AreaList">
              <div class="menu-title">
                <div class="checkbox-square-green" :class="{'checked':item.isChecked}" @click="checkLevelOne(item)">
                  <input type="checkbox" class="checks">
                </div>
                <label>{{item.addressName}}</label>
              </div>
              <div class="submenu-item">
                <template v-for="(item2,index2) in item.children">
                  <div class="submenu">
                    <div class="checkbox-square-green" :class="{'checked':item2.isChecked}" @click="checkLevelTwo(item,item2)">
                      <input type="checkbox" class="checks">
                    </div>
                    <label>{{item2.addressName}}</label>
                  </div>                  
                </template>
              </div>
            </div>            
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogAreaVisible=false">取消</el-button>
            <el-button type="primary" @click="changeArea">确定</el-button>
          </div>
        </el-dialog>
  </div>
</template>
<script>
  import HjCrumb from '../../comms/BreadCrumb.vue'   
  export default{
    components:{
        HjCrumb
      },
      data(){
        return{
          CrumbBox:{
            CrumbList:
            [
              {
                  title:'系统设置',
                  url:'/setting/freight/list'
              },
              {
                  title:'运费模板',
                  url:'/setting/freight/list'
              },
              {
                  title:'添加',
                  url:''
              }
            ]
          }, 
          cprops:{
              value:'id',
              label:'addressName'              
          },
          selectedList:[],
          selectedList2:[],
          dialogAreaVisible: false,
          dialogInd:0,             
          formstate:{},          
          AreaList:[],                        
          fields:{
              templet_name:"",
              cash_on_delivery:0,
              default_weight:'',
              default_freight:'',
              extra_freight:'',
              extra_weight:'',              
              insured_cost:null,
              remark:'',
              calculation:0,
              unit_freight:null                         
          },
          TransportList:[
            {              
              weight:'',
              freight:'',
              extra_weight:'',
              extra_freight:'',
              delivery_addr:'',
              delivery_addr_name:[]             
            }            
          ]
        }
      }, 
        mounted(){
            this.getAreaLists();//所有地区                  
        },        
        methods:{                     
            formatNumber (key) {              
              this.fields[key]=this.fields[key].replace(/[^\d.]/g,"");
              this.fields[key]=this.fields[key].replace(/\.{2,}/g,"");
              this.fields[key]=this.fields[key].replace(/^\./g,"");
              this.fields[key]=this.fields[key].replace(".","$#$").replace(/\./g,"").replace("$#$",".");
              this.fields[key]=this.fields[key].replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
            },
            formatNumber2 (index,key) {
              this.TransportList[index][key]=this.TransportList[index][key].replace(/[^\d.]/g,"");
              this.TransportList[index][key]=this.TransportList[index][key].replace(/\.{2,}/g,"");
              this.TransportList[index][key]=this.TransportList[index][key].replace(/^\./g,"");
              this.TransportList[index][key]=this.TransportList[index][key].replace(".","$#$").replace(/\./g,"").replace("$#$",".");
              this.TransportList[index][key]=this.TransportList[index][key].replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
            },            
            getAreaLists () {//全部地区
              var that=this;
              that.$http({
                method:'post',
                url: '/freight_temp/getCity'
              }).then(function (res) {
                //console.log(res)
                if(res.data.error=='0'){
                  that.AreaList=res.data.data;
                  that.AreaList.forEach(function (item,index) {
                    that.$set(item,"isChecked",false);
                    if(typeof item.children !="undefined"){
                      item.children.forEach(function(item2,index2){
                        that.$set(item2,"isChecked",false);                        
                      })
                    }
                  })
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
            checkLevelOne(obj){
              var that=this;
              obj.isChecked=!obj.isChecked;
              if(typeof obj.children !="undefined"){
                obj.children.forEach(function (item,index) {
                  item.isChecked=obj.isChecked;
                  if(typeof item.children !="undefined"){
                    item.children.forEach(function (subitem,subindex) {
                      subitem.isChecked=obj.isChecked;
                    })
                  }
                })
              }
            },
            checkLevelTwo (parentObj,obj) {
              var that=this;
              obj.isChecked=!obj.isChecked;
              if(typeof obj.children !="undefined"){
                obj.children.forEach(function (item,index) {
                  item.isChecked=obj.isChecked;
                })
              }
              parentObj.isChecked=false;              
              that.selectedList2=[];
              parentObj.children.forEach(function (item,index) {
                if(item.isChecked){
                  that.selectedList2.push(item);
                }
              });
              if(that.selectedList2.length==parentObj.children.length){
                parentObj.isChecked=true;
              }else{
                parentObj.isChecked=false;
              }
            },
            addList(){//为指定地区城市设置运费
              this.TransportList.push({ 
                weight:null,
                freight:null,
                extra_weight:null,
                extra_freight:null,
                delivery_addr:'',
                delivery_addr_name:[]  
              });
            },
            editAdr(index){//编辑运送地址
              this.dialogAreaVisible = true;              
              this.dialogInd = index;
              var that = this;
              var checkArr = that.TransportList[index].delivery_addr_name;              
              for(var i=0; i<that.AreaList.length; i++){                
                that.AreaList[i].isChecked = false;
                checkArr.forEach(function (item,index) { 
                  if(that.AreaList[i].addressID == item.adrId){
                    that.AreaList[i].isChecked=true;                                      
                  }
                });
                if(typeof that.AreaList[i].children !="undefined"){
                  for(var j=0; j<that.AreaList[i].children.length; j++){
                    that.AreaList[i].children[j].isChecked = false;
                    checkArr.forEach(function (subitem,index) {
                      if(that.AreaList[i].addressID == subitem.adrId){
                        that.AreaList[i].children[j].isChecked=true;
                      }else if(that.AreaList[i].children[j].addressID == subitem.adrId){
                        that.AreaList[i].children[j].isChecked=true;                      
                      }
                    });
                  }
                }                
              }              
            },                    
            removeList(id){//删除运送方式
              if(id!=null){
                this.$confirm('您确定删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                  }).then(() => {
                      this.TransportList.splice(id, 1);                  
                  }).catch(() => {
                    //取消
                  });
              }
            },            
            fieldClassName:function(field){
                if(!field){
                    return '';
                }else if((field.$touched ||field.$submitted) && field.$invalid){
                    return 'error';
                }else if((field.$touched ||field.$submitted) && field.$valid){
                    return 'valid';
                }
            },
            changeArea: function () { //确定选择区域            
              var that = this;
              var ind = that.dialogInd;
              that.selectedList = [];             
              that.AreaList.forEach(function (item,index) {
                if(item.isChecked){
                  that.selectedList.push({                    
                    adrId:item.addressID,
                    name:item.addressName
                  });                  
                }else{
                  if(typeof item.children !="undefined"){
                    item.children.forEach(function (item2,index2) {
                      if(item2.isChecked){
                        that.selectedList.push({                          
                          adrId:item2.addressID,
                          name:item2.addressName
                        });                          
                      }
                    })
                  }                  
                }
              });
              if(that.selectedList !=''){
                this.dialogAreaVisible = false;
                var adrIdStr = [];
                that.TransportList[ind].delivery_addr_name = that.selectedList;
                 that.selectedList.forEach(function (item,index) {                    
                    adrIdStr.push(item.adrId);                    
                 });
                 that.TransportList[ind].delivery_addr = adrIdStr.join(",");
              }else{
                that.$message({
                  message: '请至少选择地区',
                  type: 'error'
                });
              }
            },
            onSubmit:function(){//提交              
                var that = this;
                var templetData = '';
                if(this.formstate.$valid){
                  if(that.fields.calculation==0){
                    for(var i=0;i<this.TransportList.length;i++){
                      if(this.TransportList[i].weight == ''||this.TransportList[i].weight == null){
                        this.$message({
                          type: 'warning',
                          message: '首重量不能为空'
                        });
                        return;
                      }else if(this.TransportList[i].freight == ''||this.TransportList[i].freight == null){
                        this.$message({
                          type: 'warning',
                          message: '首费不能为空'
                        });
                        return;
                      }else if(this.TransportList[i].extra_weight == ''||this.TransportList[i].extra_weight == null){
                        this.$message({
                          type: 'warning',
                          message: '续重量不能为空'
                        });
                        return;
                      }else if(this.TransportList[i].extra_freight == ''||this.TransportList[i].extra_freight == null){
                        this.$message({
                          type: 'warning',
                          message: '续费不能为空'
                        });
                        return;
                      }else if(this.TransportList[i].delivery_addr_name == ''||this.TransportList[i].delivery_addr_name==null){
                        this.$message({
                          type: 'warning',
                          message: '运送地址不能为空'
                        });
                        return;
                      }
                    };
                  }                    
                    if(that.fields.calculation==0){                      
                      templetData = JSON.stringify(that.TransportList);
                    }else{
                      templetData = null;
                      that.fields.default_freight = 0;
                      that.fields.default_weight = 0;
                      that.fields.extra_freight = 0;
                      that.fields.extra_weight = 0;
                    }                                
                    that.$http({
                          method:'post',
                          url: '/freight_temp/addsubmit',
                          params:{ 
                            'shop_id':JSON.parse(window.localStorage.getItem("shopid")),
                            'templet_name':that.fields.templet_name,
                            'insured_cost':that.fields.insured_cost,
                            'cash_on_delivery':that.fields.cash_on_delivery,
                            'remark':that.fields.remark,
                            'calculation':that.fields.calculation,
                            'default_freight':that.fields.default_freight,
                            'default_weight':that.fields.default_weight,
                            'extra_freight':that.fields.extra_freight,
                            'extra_weight':that.fields.extra_weight,
                            'unit_freight':that.fields.unit_freight,
                            'templetDatasJson':templetData
                          }           
                        }).then(function (res) {
                            //console.log(res)                                               
                            if(res.data.error==0){
                                that.$message({
                                  message: '添加成功',
                                  type: 'success'
                                }); 
                                that.$router.push('/setting/freight/list/');
                            }else{
                                that.$message({
                                  message: '保存失败',
                                  type: 'warning'
                                });                                
                            }                            
                            //console.log(that.cateList)                                  
                        }).catch(function (error) {
                            console.log(error);
                        });
                }
            }
        }
  }
</script>
<style scoped>
  .transport-header{background: #E9F3FF; padding: 10px}
  .transport-header>div{display: inline-block;}
  .areaBox{max-height: 220px; overflow: auto;}
  .menu-item label{font-weight: 100;}
  .menu-item .menu-title{
    padding:8px 15px;
    font-size:14px;    
    width:30%;
    max-width: 170px;
    float:left;
  }
/*  .menu-item:hover{background-color: #F7F7F7}
  .menu-item:hover .submenu-item{height: inherit;}*/
  .submenu-item{
    width:70%;
    /*height: 40px;*/
    padding-left:0px;
    float:left;
    overflow: hidden;
  }
  .submenu-item .submenu{  
    float: left;
    margin-top: 8px;
    margin-bottom: 8px;
    margin-right: 8px;
  }
</style>
