<template>
  <div>
    <HjCrumb :crumbMsg="CrumbBox"></HjCrumb>
    <div class="wrapper wrapper-content animated fadeInRight">
      <div class="row">
        <div class="col-lg-12">
          <div class="ibox float-e-margins">
            <div class="ibox-content">
              <div class="form-inline m-b-md clearfix">
                <el-button type="primary" class="m-r-xs" @click="allOpen">全部展开</el-button>
                <el-button type="primary" class="gray-btn" @click="allPack">全部收起</el-button>
                <el-button type="primary" class="hj_fr" @click="add"><i class="shop icon-xinzeng"></i> 添加一级分类</el-button>
              </div>
              <div class="table-responsive">
                <ul class="clearfix listhead">
                  <li>排序</li>
                  <li class="listTitle">分类名称</li>
                  <li>是否启用</li>
                  <li class="listOpt">操作</li>
                </ul>
                <ul class="list-body">
                  <TreeList v-for="(val, index) in items" :item="val" @subm="getList()" @remove="delItem(index,val.id)" :key="index"></TreeList>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script type="text/ecmascript-6">
  import HjCrumb from '../comms/BreadCrumb.vue'
  import TreeList from './TreeList.vue'
  import {CustomFun} from '../comms/main.js'
  import {mapGetters,mapActions} from 'vuex'
  export default{
    components:{
      HjCrumb,
      TreeList
    },
    data(){
      return {
        title:'',
        CrumbBox:{
          CrumbList:
            [
              {
                title:'内容管理',
                url:'/article/category'
              },
              {
                title:'文章管理',
                url:'/article/category'
              },
              {
                title:'文章分类',
                url:''
              }
            ]
        },
        mydata: {},
        items:[]
      }
    },
    computed: {
      ...mapGetters([
        'tree',
        'cate_parent_id'
      ])
    },
    mounted(){
      this.getList();
    },
    methods:{
      allPack(){
        this.$store.dispatch('hideTree');
      },
      allOpen(){
        this.$store.dispatch('showTree');
      },
      /*
      * 为列表项设置层级
      * */
      setLevel (item,level) {
        var that=this;
        if(typeof item.children !='undefined'){
          item.children.forEach(function (subitem,subindex) {
            that.$set(subitem,"level",level+1);
            that.$set(subitem,"isSubmitted",true);
            that.setLevel(subitem,level+1);
          })
        }
      },
      getList() {
        var that = this;
        that.$http({
          method:'post',
          url: '/article_category/listdata'
        }).then(function (res) {
          if(res.data.error=='0'){
            that.items = res.data.data.table_data;
            that.items.forEach(function (item,index) {
              that.$set(item,"level",1);
              that.$set(item,"isSubmitted",true);
              that.setLevel(item,1);
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
      add:function(){
        this.mydata['article_cate_name'] = '';
        this.mydata['displayorder'] = 0;
        this.mydata['status_article_cate'] = 1;
        this.mydata['level'] = 1;
        this.mydata['isSubmitted'] = false;
        this.items.unshift(this.mydata);
        this.mydata = {};
      },
      delItem:function(index,id){
        if(id==undefined){
          this.items.splice(index, 1);
        }else{
          var that=this;
          this.$confirm('确认删除此分类吗？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal:false
          }).then(() => {
            that.$http({
              method:'post',
              url: '/article_category/batchsubmit',
              params: {
                article_cate_ids: id,
                method: -2
              }
            }).then(function (res) {
              if(res.data.error=='0'){
                that.items.splice(index, 1);
                that.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                that.getList();
              }else{
                that.$message({
                  type: 'error',
                  message: res.data.desc
                });
              }
            }).catch(function (error) {
              console.log(error);
            });
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消操作'
            });
          });
        }
      }
    }
  }
</script>

<style scoped>

</style>
