<template>
  <div>
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-title">
              <h5>编辑敏感词</h5>
            </div>
            <div class="ibox-content">
              <vue-form :state="formstate" @submit.prevent="onSubmit" class="form-horizontal m-t">
                <validate class="form-group">
                  <label class="col-sm-3 control-label"><span class="f-c-r">*</span>敏感词内容：</label>
                  <div class="col-sm-4">
                    <input type="text" name="sen_content" class="form-control" v-model="sensitiveInfo.senContent" required
                           :class="fieldClassName(formstate.sen_content)">
                    <field-messages name="sen_content" show="$touched || $submitted" class="form-control-callback">
                      <div slot="required" class="error">敏感词内容不能为空</div>
                    </field-messages>
                  </div>
                </validate>
                <div class="hr-line-dashed"></div>
                <div class="form-group draggable ui-draggable">
                  <div class="col-sm-12 col-sm-offset-3">
                    <button class="btn btn-primary" type="submit">确定</button>
                    <router-link to="/setting2/keyfilter" class="btn btn-white m-l-sm">返回列表</router-link>
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
              title: '高级设置',
              url: '/setting2/keyfilter'
            },
            {
              title: '敏感词过滤',
              url: '/setting2/keyfilter'
            },
            {
              title: '编辑敏感词',
              url: ''
            }
          ]
        },
        formstate: {},
        senId:'',
        sensitiveInfo: {
          senContent: ''
        }
      }
    },
    created () {
      this.senId = this.$route.params.id;
    },
    methods: {
      fieldClassName: function (field) {
        if (!field) {
          return '';
        } else if ((field.$touched || field.$submitted) && field.$invalid) {
          return 'error';
        }
      },
      getSensitiveInfo () {
        var that = this;
        that.$http({
          method: 'post',
          url: '/setting_sensitive/listdata'
        }).then(function (res) {
          if(res.data.error=='0'){
            var sensitiveList = res.data.data.table_data;
            sensitiveList.forEach(function (item,index) {
              if(item.id==that.senId){
                that.sensitiveInfo.senContent=item.sen_content;
                return false;
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
      onSubmit: function () {
        var that = this;
        if (this.formstate.$valid) {
          that.$http({
            method: 'post',
            url: '/setting_sensitive/editsubmit',
            params: {
              id:that.senId,
              sen_content:that.sensitiveInfo.senContent
            }
          }).then(function (res) {
            if(res.data.error=='0'){
              that.$message({
                type: 'success',
                message: '敏感词修改成功!'
              });
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
              message: '敏感词保存失败，请重新提交!'
            });
          });
        }
      }
    },
    mounted () {
      this.$nextTick(function () {
        this.getSensitiveInfo();
      })
    }
  }
</script>

<style>

</style>
