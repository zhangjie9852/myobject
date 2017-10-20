<template>
  <li :dataVal="isopen">
    <div class="body-con">
      <div><input type="number" @keyup.enter="sort(item)"
                  @blur="sort(item)" v-model="item.displayorder"></div>
      <div class="listTitle" :style="{'padding-left': 30+(item.level-1)*paddingSize + 'px'}">
        <a @click="toggle()" :class="['icon','shop',open?'icon-dianjishouqi':'icon-dianjizhankai']" v-if="isFolder"></a>
        <a class="split-icon shop icon-zijifenge" v-else></a>
        <template v-if="!item.isSubmitted">
          <input type="text" v-model="item.article_cate_name" placeholder="分类名称">
          <button type="button" class="button save-btn" @click="subAdd">保存</button>
          <button type="button" class="button" @click="$emit('remove')">取消</button>
        </template>
        <template v-else>
          <span>{{item.article_cate_name}}</span>
          <a class="m-l icon shop icon-xinzeng1" @click="addChild" title="添加分类" v-if="item.level<2"></a>
        </template>
      </div>
      <div>
        <el-switch
          v-model="item.status_article_cate"
          on-text=""
          off-text=""
          :on-value="1" :off-value="-1"
          @change="changeArticleCateStatus(item)">
        </el-switch>
      </div>
      <div class="listOpt">
        <router-link :to="'/help/category/edit/'+item.id">管理</router-link>
        <a @click="$emit('remove')" v-if="!isFolder">删除</a>
      </div>
    </div>
    <ul v-show="open" v-if="isFolder && item.level<2">
      <treelist v-for="(val, index) in item.children" :item="val" @subm="$emit('subm')"
                @remove="delItem(index,val.id)" :key="index"></treelist>
    </ul>
  </li>
</template>
<script type="text/ecmascript-6">
  import vm from '../../main.js'
  import {CustomFun} from '../comms/main.js'
  import {mapGetters, mapActions} from 'vuex'
  export default{
    name: "treelist",
    props: {
      item: Object
    },
    computed: {
      ...mapGetters([
        'tree',
        'cate_parent_id'
      ]),
      isFolder: function () {
        return this.item.children && this.item.children.length
      },
      isopen: function () {
        return this.open = this.tree
      }
    },
    data(){
      return {
        open: false,
        paddingSize: 15
      }
    },
    methods: {
      toggle: function () {
        if (this.isFolder) {
          this.open = !this.open;
        }
      },
      addChild: function () {
        if (this.item['id'] > 0) {
          this.item['id'] = this.item['id']
        } else {
          this.item['id'] = this.cate_parent_id
        }
        if (!this.isFolder) {
          vm.$set(this.item, 'children', [])
        }
        this.open = true;
        this.item.children.push({
          article_cate_name: '',
          displayorder: 0,
          status_article_cate:1,
          parent_id: this.item['id'],
          level: parseInt(this.item['level']) + 1,
          isSubmitted:false
        })
      },
      subAdd: function () {
        var that = this;
        var paid = 0;
        if (this.item['parent_id'] === "undefined") {
          paid = this.cate_parent_id;
        } else {
          paid = that.item['parent_id'];
        }
        if (this.item['article_cate_name'] == "") {
          that.$message({
            message: '分类名称不能为空',
            type: 'warning'
          });
          return;
        }
        that.$http({
          method: 'post',
          url: '/help_category/addsubmit',
          params: {
            article_cate_name: that.item['article_cate_name'],
            displayorder: that.item['displayorder'],
            status_article_cate: that.item['status_article_cate'],
            parent_id: that.item['parent_id']
          }
        }).then(function (res) {
          if (res.data.error == 0) {
            that.$store.commit('CATE_PARENT_ID', res.data.data);
            that.item['isSubmitted'] = true;
            that.$emit('subm');
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
      delItem:function (index, id) {
        if(id==undefined){
          this.item['children'].splice(index, 1);
        }else{
          var that = this;
          this.$confirm('确认删除此分类吗？', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
            closeOnClickModal:false
          }).then(() => {
            that.$http({
              method: 'post',
              url: '/help_category/batchsubmit',
              params: {
                article_cate_ids: id,
                method: -2
              }
            }).then(function (res) {
              if(res.data.error=='0'){
                that.item['children'].splice(index, 1);
                that.$message({
                  type: 'success',
                  message: '删除成功!'
                });
                that.$emit('subm');
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
      },
      changeArticleCateStatus(item){
        var that = this;
        that.$http({
          method: 'post',
          url: '/help_category/editsubmit',
          params: {
            id: item.id,
            status_article_cate: item.status_article_cate
          }
        }).then(function (res) {
          if(res.data.error=='0'){
            that.$emit('subm');
          }else {
            that.$message({
              type: 'error',
              message: res.data.desc
            });
          }
        }).catch(function (error) {
          console.log(error);
        });
      },
      sort (item) {
        var that = this;
        that.$http({
          method: 'post',
          url: '/help_category/editsubmit',
          params: {
            id: item.id,
            displayorder: item.displayorder
          }
        }).then(function (res) {
          if(res.data.error=='0'){
            that.$emit('subm');
          }else {
            that.$message({
              type: 'error',
              message: res.data.desc
            });
          }
        }).catch(function (error) {
          console.log(error);
        });
      }
    }
  }
</script>

<style scoped>

</style>
