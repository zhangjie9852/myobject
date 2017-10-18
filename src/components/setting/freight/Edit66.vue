<template>
  <div id="BrandAdd">
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
            <div class="row">
                <div class="col-lg-12">
                    <div class="ibox float-e-margins">
                        <div class="ibox-title">
                            <h5>添加模板</h5>
                        </div>                        
                        <div class="ibox-content add-user">
                            <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t" id="commentForm" >
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
                                <div class="form-group">
                                    <label class="col-sm-3 control-label"><span class="f-c-r">*</span>宝贝地址：</label>
                                    <div class="col-sm-4">                                        
                                        <el-cascader
                                          placeholder="请选择分类"
                                          :options="cateList"
                                          :props="cprops"
                                          filterable                                       
                                          @change="handleChange"
                                          v-model="fields.ship_addr_detail_arr"            
                                          change-on-select
                                        ></el-cascader>                                        
                                    </div>
                                </div>
                                <field class="form-group">
                                    <label class="col-sm-3 control-label">是否开启：</label>
                                    <div class="col-sm-6">
                                        <div class="r-state">                        
                                            <el-radio class="radio" v-model="fields.is_show" :label="0">是</el-radio>
                                            <el-radio class="radio" v-model="fields.is_show" :label="1">否</el-radio>
                                        </div>                                                
                                    </div>
                                </field>                                          
                                <div class="form-group">
                                    <label class="col-sm-3 control-label">运送方式：</label>
                                    <div class="col-sm-7 m-t-8">
                                        <div class="transport">
                                          <div class="transport-header">
                                            默认运费<input type="text" class="finput" v-model="fields.default_weight" onkeyup="value=value.replace(/[^\-?\d.]/g,'')"/>kg内 <input type="text" class="finput" v-model="fields.default_freight" onkeyup="value=value.replace(/[^\-?\d.]/g,'')" />元 每增加<input type="text" class="finput" v-model="fields.extra_freight" onkeyup="value=value.replace(/[^\-?\d.]/g,'')" />kg,增加运费<input type="text" class="finput" v-model="fields.extra_weight" onkeyup="value=value.replace(/[^\-?\d.]/g,'')" />元
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
                                                      <td class="text-center"><input type="text" class="finput" v-model="item.weight" onkeyup="value=value.replace(/[^\-?\d.]/g,'')"/></td>
                                                      <td class="text-center"><input type="text" class="finput" v-model="item.freight" onkeyup="value=value.replace(/[^\-?\d.]/g,'')"/></td>
                                                      <td class="text-center"><input type="text" class="finput" v-model="item.extra_weight" onkeyup="value=value.replace(/[^\-?\d.]/g,'')"/></td>
                                                      <td class="text-center"><input type="text" class="finput" v-model="item.extra_freight" onkeyup="value=value.replace(/[^\-?\d.]/g,'')"/></td>           
                                                      <td class="text-center"><a @click="removeList(index)">删除</a></td>
                                                  </tr> 
                                              </tbody>
                                          </table>
                                          <div><a class="blue" @click="addList">为指定地区城市设置运费</a></div>
                                        </div>
                                    </div>
                                </div>
                              <div class="hr-line-dashed"></div>
                                <div class="form-group draggable ui-draggable">
                                    <div class="col-sm-12 col-sm-offset-3">
                                        <button class="btn btn-primary" type="submit">提交</button>
                                        <router-link to="/freight/list" class="btn btn-white m-l-sm">返回列表</router-link>
                                    </div>  
                                </div>
                            </vue-form>
                      </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="选择区域" :visible.sync="dialogAreaVisible">          
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
          cateList:[],
          AreaList:[],                        
          fields:{
              id:0,
              templet_name:"",
              ship_addr:0,
              ship_addr_detail:'',
              ship_addr_detail_arr:[],
              default_weight:null,
              default_freight:null,
              extra_freight:null,
              extra_weight:null,
              is_show:0                           
          },
          TransportList:[]
        }
      }, 
        mounted(){          
            this.CatePrent(); //宝贝地址  
            this.getAreaLists();//所有地区 
            this.InfoData(this.$route.params.id);                 
        },        
        methods:{
            CatePrent() {
                var that = this;                                         
                that.$http({
                      method:'post',
                      url: '/freight_temp/getCity'                                
                    }).then(function (res) {                                     
                        if(res.data.error==0){
                           that.cateList = res.data.data;                             
                        }else{
                            this.$message({
                              type: 'error',
                              message: res.data.desc
                            });                                                      
                        }                               
                    }).catch(function (error) {
                        console.log(error);
                    });
            },
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
            InfoData(id){
                var that = this;
                that.$http({
                          method:'post',
                          url: '/freight_temp/infodata',
                          params:{
                            'id':id                       
                          }           
                        }).then(function (res) {
                            //console.log(res)
                            var  Flist =  res.data.data;          
                            if(res.data.error==0){ 
                                that.fields.id = id;                               
                                that.fields.templet_name = Flist.templet_name;
                                that.fields.ship_addr = Flist.ship_addr;
                                var addrArr = Flist.ship_addr_detail.split(",");
                                addrArr.forEach(function(data,index,arr){
                                    that.fields.ship_addr_detail_arr.push(+data);
                                });                                
                                that.fields.default_freight = Flist.default_freight;
                                that.fields.default_weight = Flist.default_weight;
                                that.fields.extra_freight = Flist.extra_freight;
                                that.fields.extra_weight = Flist.extra_weight;
                                that.fields.is_show = Flist.status;                               
                                Flist.templetDatas.forEach(function(item,index){
                                    that.TransportList.push({
                                      weight:item.weight,
                                      freight:item.freight,
                                      extra_weight:item.extra_weight,
                                      extra_freight:item.extra_freight,
                                      delivery_addr:item.delivery_addr,
                                      delivery_addr_name:JSON.parse(item.delivery_addr_name)
                                    })
                                });
                                //console.log(that.TransportList)
                            }else{
                                this.$message({
                                  type: 'error',
                                  message: res.data.desc
                                });                      
                            }                                                    
                        }).catch(function (error) {
                            console.log(error);
                        });
            },
            handleChange(value) {//选择宝贝地址
                this.fields.ship_addr= value[value.length-1];                
                this.fields.ship_addr_detail = value.join(",");                
                //console.log(this.fields.ship_addr,this.fields.ship_addr_detail);
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
              }
                var that = this;
                if(this.formstate.$valid){                                     
                    that.$http({
                          method:'post',
                          url: '/freight_temp/editsubmit',
                          params:{
                            'id':that.fields.id,
                            'templet_name':that.fields.templet_name,
                            'ship_addr':that.fields.ship_addr,
                            'ship_addr_detail':that.fields.ship_addr_detail,
                            'default_freight':that.fields.default_freight,
                            'default_weight':that.fields.default_weight,
                            'extra_freight':that.fields.extra_freight,
                            'extra_weight':that.fields.extra_weight,
                            'templetDatasJson':JSON.stringify(that.TransportList),
                            'status':that.fields.is_show,                    
                          }           
                        }).then(function (res) {
                            //console.log(res)                                               
                            if(res.data.error==0){
                                that.$message({
                                  message: '更新成功',
                                  type: 'success'
                                }); 
                                that.$router.push('/freight/list/');
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
  .areaBox{max-height: 220px; overflow: auto;}
  .menu-item label{font-weight: 100;}
  .menu-item .menu-title{
    padding:8px 15px;
    font-size:14px;    
    width:30%;
    max-width: 170px;
    float:left;
  }  
  .submenu-item{
    width:70%;
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
