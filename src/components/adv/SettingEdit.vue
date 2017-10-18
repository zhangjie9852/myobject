<template>
  <div id="MemberAdd">
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-title">
              <h5>编辑广告位</h5>
            </div>
            <div class="ibox-content">
              <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t">
                <validate class="form-group">
                  <label class="col-sm-3 control-label"><span class="f-c-r">*</span>广告位名称：</label>
                  <div class="col-sm-4">
                    <input type="text" name="ad_position_name" class="form-control" v-model="adPositionInfo.adPositionName" required
                           :class="fieldClassName(formstate.ad_position_name)" @blur="validateIsExist" @focus="isExist=false">
                    <field-messages name="ad_position_name" show="$touched || $submitted" class="form-control-callback">
                      <div slot="required" class="error">广告位名称不能为空</div>
                      <div class="error" v-if="isExist">该广告位名称已经存在</div>
                    </field-messages>
                  </div>
                </validate>
                <validate class="form-group">
                  <label class="col-sm-3 control-label"><span class="f-c-r">*</span>广告位宽度：</label>
                  <div class="col-sm-4">
                    <input type="number" onmousewheel="return false;" name="ad_position_wide" class="form-control" v-model="adPositionInfo.adPositionWide" required
                           :class="fieldClassName(formstate.ad_position_wide)">
                    <span class="units">PX</span>
                    <field-messages name="ad_position_wide" show="$touched || $submitted" class="form-control-callback">
                      <div slot="required" class="error">广告位宽度不能为空</div>
                    </field-messages>
                  </div>
                </validate>
                <validate class="form-group">
                  <label class="col-sm-3 control-label"><span class="f-c-r">*</span>广告位高度：</label>
                  <div class="col-sm-4">
                    <input type="number" onmousewheel="return false;" name="ad_position_high" class="form-control" v-model="adPositionInfo.adPositionHigh" required
                           :class="fieldClassName(formstate.ad_position_high)">
                    <span class="units">PX</span>
                    <field-messages name="ad_position_high" show="$touched || $submitted" class="form-control-callback">
                      <div slot="required" class="error">广告位高度不能为空</div>
                    </field-messages>
                  </div>
                </validate>
                <div class="form-group">
                  <label class="col-sm-3 control-label">广告位描述：</label>
                  <div class="col-sm-4">
                    <textarea class="form-control" :rows="4" name="ad_position_desc" v-model="adPositionInfo.adPositionDesc"></textarea>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-sm-3 control-label">是否启用：</label>
                  <div class="col-sm-4">
                    <el-radio class="radio" name="is_open" v-model="adPositionInfo.isOpen" :label="1">是</el-radio>
                    <el-radio class="radio" name="is_open" v-model="adPositionInfo.isOpen" :label="-1">否</el-radio>
                  </div>
                </div>
                <div class="hr-line-dashed"></div>
                <div class="form-group draggable ui-draggable">
                  <div class="col-sm-12 col-sm-offset-3">
                    <button class="btn btn-primary" type="submit">确定</button>
                    <router-link to="/adv/setting" class="btn btn-white m-l-sm">返回列表</router-link>
                  </div>
                </div>
              </vue-form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import HjCrumb from '../comms/BreadCrumb.vue'
  import vueForm from 'vue-form'
  export default{
    components: {
      HjCrumb
    },
    mixins: [vueForm],
    data(){
      return {
        CrumbBox: {
          CrumbList: [
            {
              title:'运营中心',
              url:'/adv/setting'
            },
            {
              title:'广告管理',
              url:'/adv/setting'
            },
            {
              title:'编辑广告位',
              url:''
            }
          ]
        },
        formstate: {},
        shopId:'',
        isExist:false,
        adPositionId:'',
        originAdPositionName:'',
        adPositionInfo: {
          adPositionName: '',
          adPositionWide:'',
          adPositionHigh:'',
          adPositionDesc:'',
          isOpen:1
        }
      }
    },
    methods: {
      fieldClassName: function (field) {
        if (!field) {
          return '';
        } else if ((field.$touched || field.$submitted) && field.$invalid) {
          return 'error';
        }
      },
      getAdPositionInfo () {
        var that=this;
        that.$http({
          method:'post',
          url: '/adposition/infodata',
          params:{
            adposition_id:that.adPositionId
          }
        }).then(function (res) {
          if(res.data.error=='0'){
            that.adPositionInfo.adPositionName=res.data.data.ad_position_name;
            that.adPositionInfo.adPositionWide=res.data.data.ad_position_wide;
            that.adPositionInfo.adPositionHigh=res.data.data.ad_position_high;
            that.adPositionInfo.adPositionDesc=res.data.data.ad_position_desc;
            that.adPositionInfo.isOpen=res.data.data.is_open;
            that.originAdPositionName=res.data.data.ad_position_name;
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
      validateIsExist () {
        var that=this;
        if(that.adPositionInfo.adPositionName!=that.originAdPositionName){
          that.$http({
            method:'post',
            url: '/adposition/validateRepeat',
            params:{
              adPosition_name:that.adPositionInfo.adPositionName,
              shop_id:that.shopId
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.isExist=false;
            }else{
              that.isExist=true;
            }
          }).catch(function (error) {
            console.log(error);
          });
        }else{
          that.isExist=false;
        }
      },
      onSubmit: function () {
        var that = this;
        if (that.formstate.$valid && !that.isExist) {
          that.$http({
            method: 'post',
            url: '/adposition/editsubmit',
            params: {
              id:that.adPositionId,
              goods_shop_base_id:that.shopId,
              ad_position_name:that.adPositionInfo.adPositionName,
              ad_position_wide:that.adPositionInfo.adPositionWide,
              ad_position_high:that.adPositionInfo.adPositionHigh,
              ad_position_desc:that.adPositionInfo.adPositionDesc,
              is_open:that.adPositionInfo.isOpen
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '广告位修改成功!'
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
              message: '广告位修改失败，请重新提交!'
            });
          });
        }
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.shopId=JSON.parse(window.localStorage.getItem("shopid"));
        this.adPositionId=this.$route.params.id;
        this.getAdPositionInfo();
      })
    }
  }
</script>

<style scoped>
  .el-switch { margin-top: 5px; }
</style>
