import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/components/Home.vue'
import NotFound from '@/components/404.vue'
import Login from '@/components/Login.vue'
import Index from '@/components/Index.vue'

//商品列表
import GoodList from '@/components/goods/List.vue'
import GoodListAdd from '@/components/goods/ListAdd.vue'
import GoodListEdit from '@/components/goods/ListEdit.vue'
//商品分类
import GoodCategory from '@/components/goods/Category.vue'
import GoodCategoryAdd from '@/components/goods/CategoryAdd.vue'
import GoodCategoryEdit from '@/components/goods/CategoryEdit.vue'
//商品属性
import GoodAttribute from '@/components/goods/Attribute.vue'
import GoodAttributeAdd from '@/components/goods/AttributeAdd.vue'
import GoodAttributeEdit from '@/components/goods/AttributeEdit.vue'
//商品规格
import GoodSku from '@/components/goods/Sku.vue'
import GoodSkuAdd from '@/components/goods/SkuAdd.vue'
import GoodSkuEdit from '@/components/goods/SkuEdit.vue'
//商品品牌
import GoodBrand from '@/components/goods/Brand.vue'
import GoodBrandAdd from '@/components/goods/BrandAdd.vue'
import GoodBrandEdit from '@/components/goods/BrandEdit.vue'
import GoodBrandDetails from '@/components/goods/BrandDetails.vue'
//商品图库
import GoodAnnex from '@/components/goods/Annex.vue'
import GoodAnnexAdd from '@/components/goods/AnnexAdd.vue'
import GoodAnnexEdit from '@/components/goods/AnnexEdit.vue'
import GoodAnnexDetails from '@/components/goods/AnnexDetails.vue'
//会员管理
import MemberList from '@/components/member/MemberList.vue'
import MemberAdd from '@/components/member/MemberAdd.vue'
import MemberEdit from '@/components/member/MemberEdit.vue'
import MemberDetail from '@/components/member/MemberDetail.vue'
//商品标签
import GoodLabel from '@/components/goods/Label.vue'
import GoodLabelAdd from '@/components/goods/LabelAdd.vue'
import GoodLabelEdit from '@/components/goods/LabelEdit.vue'
//推荐管理
import RecomListWap from '@/components/recom/wap/List.vue'
import RecomItemWap from '@/components/recom/wap/RecomItem.vue'
import RecomItemAdd from '@/components/recom/wap/ItemAdd.vue'
import RecomItemEdit from '@/components/recom/wap/ItemEdit.vue'
//广告管理
import AdvList from '@/components/adv/List.vue'
import AdvAdd from '@/components/adv/Add.vue'
import AdvEdit from '@/components/adv/Edit.vue'
import AdvSetting from '@/components/adv/Setting.vue'
import AdvSettingAdd from '@/components/adv/SettingAdd.vue'
import AdvSettingEdit from '@/components/adv/SettingEdit.vue'
//系统设置
import SetWebsite from '@/components/setting/Website.vue'
import SetSeo from '@/components/setting/Seo.vue'
//订单管理
import OrderList from '@/components/order/List.vue'
import OrderDetail from '@/components/order/orderDetail.vue'
//物流单据
import CarryInvoice from '@/components/carry/Invoice.vue'
import CarryInvoiceDetail from '@/components/carry/InvoiceDetail.vue'
import CarryReceipt from '@/components/carry/Receipt.vue'
//财物单据
import BillReceipt from '@/components/bill/Receipt.vue'
import BillRefund from '@/components/bill/Refund.vue'
//文章管理
import ArticleList from '@/components/article/List.vue'
import ArticleCategory from '@/components/article/Category.vue'
import ArticleListAdd from '@/components/article/ListAdd.vue'
import ArticleListEdit from '@/components/article/ListEdit.vue'
import ArticleCategoryEdit from '@/components/article/CategoryEdit.vue'
//帮助管理
import HelpList from '@/components/help/List.vue'
import HelpCategory from '@/components/help/Category.vue'
import HelpListAdd from '@/components/help/ListAdd.vue'
import HelpListEdit from '@/components/help/ListEdit.vue'
import HelpCategoryEdit from '@/components/help/CategoryEdit.vue'

//import CustomAppraise from '@/components/custom/Appraise.vue'

//敏感词
import SetKeyFilter from '@/components/setting2/KeyFilter.vue'
import KeyFilterAdd from '@/components/setting2/KeyFilterAdd.vue'
import KeyFilterEdit from '@/components/setting2/KeyFilterEdit.vue'

//消息提醒设置
import SetMsg from '@/components/setting2/Msg.vue'
//日志记录
import SetLogList from '@/components/setting3/LogList.vue'
//管理员管理
import AdminList from '@/components/admin/List.vue'
import AdminGroup from '@/components/admin/Group.vue'
import AdminRoleAdd from '@/components/admin/RoleAdd.vue'
import AdminRoleEdit from '@/components/admin/RoleEdit.vue'
import AdminRoleDetail from '@/components/admin/RoleDetail.vue'
import AdminListAdd from '@/components/admin/ListAdd.vue'
import AdminListEdit from '@/components/admin/ListEdit.vue'
//商家管理
import SellerList from '@/components/seller/List.vue'
import SellerAdd from '@/components/seller/Add.vue'
import SellerEdit from '@/components/seller/Edit.vue'
//商品评论
import EvaluateList from '@/components/goods/evaluate/List.vue'
import EvaluateDetails from '@/components/goods/evaluate/Details.vue'
//商品咨询
import ConsultList from '@/components/goods/consult/List.vue'
import ConsultDetails from '@/components/goods/consult/Details.vue'
//运费模板
import FreightList from '@/components/setting/freight/List.vue'
import FreightAdd from '@/components/setting/freight/Add.vue'
import FreightEdit from '@/components/setting/freight/Edit.vue'
//导航设置
import NavList from '@/components/setting/navigate/List.vue'
import NavAdd from '@/components/setting/navigate/Add.vue'
import NavEdit from '@/components/setting/navigate/Edit.vue'

Vue.use(Router)

export default new Router({
  //mode: 'history',
  routes: [
    {
        path: '/',
        redirect: { path: '/index' }
    },
    {
      path:'/',
      name: 'Home',
      meta: {
            requireAuth: true,  //添加该字段，表示进入这个路由是需要登录的
        },
      component:Home,
      children: [
            { path: '/index', component: Index, name: 'index'},
            { path: '/goods/list', component: GoodList, name: 'goodList'},
            { path: '/goods/list/add', component: GoodListAdd, name: 'goodListAdd'},
            { path: '/goods/list/edit/:id', component: GoodListEdit, name: 'goodListEdit'},
            { path: '/goods/category', component: GoodCategory, name: 'goodCategory'},
            { path: '/goods/category/add', component: GoodCategoryAdd, name: 'goodCategoryAdd'},
            { path: '/goods/category/edit/:id', component: GoodCategoryEdit, name: 'goodCategoryEdit'},
            { path: '/goods/attribute', component: GoodAttribute, name: 'goodAttribute'},
            { path: '/goods/attribute/add', component: GoodAttributeAdd, name: 'goodAttributeAdd'},
            { path: '/goods/attribute/edit/:id', component: GoodAttributeEdit, name: 'goodAttributeEdit'},
            { path: '/goods/sku', component: GoodSku, name: 'goodSku'},
            { path: '/goods/sku/add', component: GoodSkuAdd, name: 'GoodSkuAdd'},
            { path: '/goods/sku/edit/:id', component: GoodSkuEdit, name: 'GoodSkuEdit'},
            { path: '/goods/brand', component: GoodBrand, name: 'goodBrand'},
            { path: '/goods/brand/add', component: GoodBrandAdd, name: 'goodBrandAdd'},
            { path: '/goods/brand/edit/:id', component: GoodBrandEdit, name: 'goodBrandEdit'},
            { path: '/goods/brand/details/:id', component: GoodBrandDetails, name: 'goodBrandDetails'},
            { path: '/goods/images', component: GoodAnnex, name: 'goodAnnex'},
            { path: '/goods/images/add', component: GoodAnnexAdd, name: 'goodAnnexAdd'},
            { path: '/goods/images/edit/:id', component: GoodAnnexEdit, name: 'goodAnnexEdit'},
            { path: '/goods/images/details/:id', component: GoodAnnexDetails, name: 'goodAnnexDetails'},
            { path: '/member/list', component: MemberList, name: 'MemberList'},
            { path: '/member/add', component: MemberAdd, name: 'MemberAdd'},
            { path: '/member/edit/:id', component: MemberEdit, name: 'MemberEdit'},
            { path: '/member/detail/:id', component: MemberDetail, name: 'MemberDetail'},
            { path: '/goods/label', component: GoodLabel, name: 'GoodLabel'},
            { path: '/goods/label/add', component: GoodLabelAdd, name: 'GoodLabelAdd'},
            { path: '/goods/label/edit/:id', component: GoodLabelEdit, name: 'GoodLabelEdit'},
            { path: '/recom/wap/list', component: RecomListWap, name: 'RecomListWap'},
            { path: '/recom/wap/item/:id', component: RecomItemWap, name: 'RecomItemWap'},
            { path: '/recom/wap/itemadd/:id', component: RecomItemAdd, name: 'RecomItemAdd'},
            { path: '/recom/wap/itemedit/:pid/:id', component: RecomItemEdit, name: 'RecomItemEdit'},

            { path: '/adv/list', component: AdvList, name: 'AdvList'},
            { path: '/adv/add', component: AdvAdd, name: 'AdvAdd'},
            { path: '/adv/edit/:id', component: AdvEdit, name: 'AdvEdit'},
            { path: '/adv/setting', component: AdvSetting, name: 'AdvSetting'},
            { path: '/adv/setting/add', component: AdvSettingAdd, name: 'AdvSettingAdd'},
            { path: '/adv/setting/edit/:id', component: AdvSettingEdit, name: 'AdvSettingEdit'},
            { path: '/setting/website', component: SetWebsite, name: 'SetWebsite'},
            { path: '/setting/seo', component: SetSeo, name: 'SetSeo'},
            { path: '/setting/freight/list', component: FreightList, name: 'FreightList'},
            { path: '/setting/freight/add', component: FreightAdd, name: 'FreightAdd'},
            { path: '/setting/freight/edit/:id', component: FreightEdit, name: 'FreightEdit'},
            { path: '/setting/navigation/list', component: NavList, name: 'NavList'},
            { path: '/setting/navigation/add', component: NavAdd, name: 'NavAdd'},
            { path: '/setting/navigation/edit/:id', component: NavEdit, name: 'NavEdit'},
            { path: '/order/list', component: OrderList, name: 'OrderListList'},
            { path: '/order/detail/:id/:paytype', component: OrderDetail, name: 'OrderDetail'},
            { path: '/carry/invoice', component: CarryInvoice, name: 'CarryInvoice'},
            { path: '/carry/invoice/detail/:id', component: CarryInvoiceDetail, name: 'CarryInvoiceDetail'},
            { path: '/carry/receipt', component: CarryReceipt, name: 'CarryReceipt'},
            { path: '/bill/receipt', component: BillReceipt, name: 'BillReceipt'},
            { path: '/bill/refund', component: BillRefund, name: 'BillRefund'},
            { path: '/article/list', component: ArticleList, name: 'ArticleList'},
            { path: '/article/category', component: ArticleCategory, name: 'ArticleCategory'},
            { path: '/article/list/add', component: ArticleListAdd, name: 'ArticleListAdd'},
            { path: '/article/list/edit/:id', component: ArticleListEdit, name: 'ArticleListEdit'},
            { path: '/article/category/edit/:id', component: ArticleCategoryEdit, name: 'ArticleCategoryEdit'},
            { path: '/help/list', component: HelpList, name: 'HelpList'},
            { path: '/help/category', component: HelpCategory, name: 'HelpCategory'},
            { path: '/help/list/add', component: HelpListAdd, name: 'HelpListAdd'},
            { path: '/help/list/edit/:id', component: HelpListEdit, name: 'HelpListEdit'},
            { path: '/help/category/edit/:id', component: HelpCategoryEdit, name: 'HelpCategoryEdit'},
            //{ path: '/custom/appraise', component: CustomAppraise, name: 'CustomAppraise'},
            { path: '/setting2/keyfilter', component: SetKeyFilter, name: 'SetKeyFilter'},
            { path: '/setting2/keyfilter/add', component: KeyFilterAdd, name: 'KeyFilterAdd'},
            { path: '/setting2/keyfilter/edit/:id', component: KeyFilterEdit, name: 'KeyFilterEdit'},
            { path: '/setting2/msg', component: SetMsg, name: 'SetMsg'},
            { path: '/setting3/loglist', component: SetLogList, name: 'SetLogList'},
            { path: '/admin/list', component: AdminList, name: 'AdminList'},
            { path: '/admin/group', component: AdminGroup, name: 'AdminGroup'},
            { path: '/admin/role/add', component: AdminRoleAdd, name: 'AdminRoleAdd'},
            { path: '/admin/role/edit/:id', component: AdminRoleEdit, name: 'AdminRoleEdit'},
            { path: '/admin/role/detail/:id', component: AdminRoleDetail, name: 'AdminRoleDetail'},
            { path: '/admin/list/add', component: AdminListAdd, name: 'AdminListAdd'},
            { path: '/admin/list/edit/:id', component: AdminListEdit, name: 'AdminListEdit'},
            { path: '/shop/list', component: SellerList, name: 'SellerList'},
            { path: '/shop/add', component: SellerAdd, name: 'SellerAdd'},
            { path: '/shop/edit/:id', component: SellerEdit, name: 'SellerEdit'},
            { path: '/goods/evaluate/list', component: EvaluateList, name: 'EvaluateList'},
            { path: '/goods/evaluate/details/:id', component: EvaluateDetails, name: 'EvaluateDetails'},
            { path: '/goods/consult/list', component: ConsultList, name: 'ConsultList'},
            { path: '/goods/consult/details/:id', component: ConsultDetails, name: 'ConsultDetails'},
        ]
	},
	{
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
	{
	    path:'/login',
	    name: 'Login',
	    component:Login,
	    hidden: true
	},
	{
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
  ]
})
