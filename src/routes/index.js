import {
    SignIn,
    SignUp,
    NotFound,
    IMList,
    IMDetail,
    MaterialAdd,
    Currency,
    UserList,
    Manage,
    Instock,
    IMUpload,
    IMLogs,
    ProductList,
    ProductAdd,
    ProductUploadAdd,
    ProductUploadOutstock,
    PreOutstock,
    PreOutstockList,
    ProductLogs
} from '../views'

export const mainRoutes = [{
    pathname:'/signin',
    component:SignIn
},{
    pathname:'/signup',
    component:SignUp
},{
    pathname:'/404',
    component:NotFound
}]

export const commonRoutes = {
    materialMenu:[{
        pathname:'/erp/comm/material/list',
        component:IMList,
        isNav:true,
        title:'库存清单',
        icon:'bank'

    },{
        pathname:'/erp/comm/material/detail/:id',
        component:IMDetail
    },{
        pathname:'/erp/comm/material/add',
        component:MaterialAdd,
        isNav:true,
        title:'新增物料',
        icon:'bulb'
    },{
        pathname:'/erp/comm/material/instock',
        component:Instock,
        isNav:true,
        title:'入库',
        icon:'import'
    },{
        pathname:'/erp/comm/material/upload',
        component:IMUpload,
        isNav:true,
        title:'批量操作',
        icon:'shopping-cart'
    },{
        pathname:'/erp/comm/material/logs',
        component:IMLogs,
        isNav:true,
        title:'日志',
        icon:'container'
    }],
    productMenu:[{
       pathname:'/erp/comm/product/list' ,
       component:ProductList,
       isNav:true,
       title:'清单'
    },{
        pathname:'/erp/comm/product/add' ,
        component:ProductAdd,
        isNav:true,
        title:'新增'
     },{
        pathname:'/erp/comm/product/upload/add' ,
        component:ProductUploadAdd,
        isNav:true,
        title:'批量新增'
     },{
        pathname:'/erp/comm/product/upload/outstock' ,
        component:ProductUploadOutstock,
        isNav:true,
        title:'批量出库'
     },{
        pathname:'/erp/comm/product/preoutstock' ,
        component:PreOutstock,
        isNav:true,
        title:'预出库'
     },{
        pathname:'/erp/comm/product/preoutstocklist' ,
        component:PreOutstockList,
        isNav:true,
        title:'预出库记录'
     },{
        pathname:'/erp/comm/product/logs' ,
        component:ProductLogs,
        isNav:true,
        title:'日志'
     },{
        pathname:'/erp/comm/product/detail/:id',
        component:ProductLogs
     }],
    userMenu:[]
}





export const adminRoutes = [{
    pathname:'/erp/admin/currency',
    component:Currency,
    isNav:true,
    title:'修改汇率',
    icon:'dollar'
},{
    pathname:'/erp/admin/users/list',
    component:UserList,
    isNav:true,
    title:'账号管理',
    icon:'team'
},{
    pathname:'/erp/admin/users/profile/:id',
    component:Manage,
    isNav:true,
    title:'账号设置',
    icon:'usergroup-add'
}]