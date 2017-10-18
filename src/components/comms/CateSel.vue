<template>  
    <ul class="clearfix">      
        <li :style="{'padding-left': item.level*paddingSize + 'px'}" style="text-align:left" @click="chanSel(item.category_id,item.category_name,item.category_code)" :class="cate_changed.id == item.category_id?'select_box_checkde':''">{{item.category_name}}</li> 
        <CateSel v-for="(val, index) in item.children" :item="val" :key="index"></CateSel>
    </ul>
  </template>
  <script>
  import  vm from '../../main.js'
  import {CustomFun} from '../comms/main.js'
  import {mapGetters} from 'vuex' 
    export default{
      name:"CateSel",
      props: {
        item: Object        
      },
      computed: {
        ...mapGetters([           
            'cate_changed'      
        ]),
        isFolder: function() {
            return this.item.children && this.item.children.length
        }
      },
      data(){
        return {
            paddingSize: 15,           
        }
    },    
      mounted(){
         this.$store.commit('CATE_CHANGE_ID', '');
      },
      methods: {                       
        chanSel: function(id,name,code) {          
          var chanid = {
            id:id,
            name:name,
            codes:code
          }          
          this.$store.commit('CATE_CHANGE_ID', chanid);
          //this.$emit('cselect'); 
        }        
      }
    }
  </script> 