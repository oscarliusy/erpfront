import {
    SignIn,
    SignUp,
    NotFound,
    IMList,
    MaterialAdd,
    Currency,
    UserList,
    Manage,
    Instock,
    IMLogs,
    ProductList,
    ProductAdd,
    ProductOutstock,
    PreOutstock,
    PreOutstockList,
    ProductLogs,
    Notifications,
    Dashboard,
    Profile,
    NoAuth,
    AdminLogs,
    MaterialUpdateList,
    ProductUpdateList,
    MaterialEdit
    
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
    materialRoutes:[{
        pathname:'/erp/comm/material/list',
        exact:true,
        component:IMList,
        isNav:true,
        title:'库存',
        icon:'home'
    },{
        pathname:'/erp/comm/material/edit/:id',
        component:MaterialEdit
    },{
        pathname:'/erp/comm/material/add',
        component:MaterialAdd,
        isNav:true,
        title:'新品',
        icon:'bulb'
    },{
        pathname:'/erp/comm/material/instock',
        component:Instock,
        isNav:true,
        title:'入库',
        icon:'import'
    },{
        pathname:'/erp/comm/material/update',
        component:MaterialUpdateList,
        isNav:true,
        title:'修改',
        icon:'tool'
    },{
        pathname:'/erp/comm/material/logs',
        component:IMLogs,
        isNav:true,
        title:'日志',
        icon:'container'
    }],
    productRoutes:[{
       pathname:'/erp/comm/product/list' ,
       component:ProductList,
       isNav:true,
       title:'清单',
       icon:'shop'
    },{
        pathname:'/erp/comm/product/add' ,
        component:ProductAdd,
        isNav:true,
        title:'新品',
        icon:'bulb'
     },{
        pathname:'/erp/comm/product/outstock' ,
        component:ProductOutstock,
        isNav:true,
        title:'出库',
        icon:'shopping-cart'
     },{
        pathname:'/erp/comm/product/preoutstock' ,
        component:PreOutstock,
        isNav:true,
        title:'预出库',
        icon:'car'
     },{
        pathname:'/erp/comm/product/preoutstocklist' ,
        component:PreOutstockList,
        isNav:true,
        title:'预出库记录',
        icon:'menu'
     },{
        pathname:'/erp/comm/product/update' ,
        component:ProductUpdateList,
        isNav:true,
        title:'修改',
        icon:'tool'
     },{
        pathname:'/erp/comm/product/logs' ,
        component:ProductLogs,
        isNav:true,
        title:'日志',
        icon:'container'
     },{
        pathname:'/erp/comm/product/detail/:id',
        component:ProductLogs
     }],
    userRoutes:[{
        pathname:'/erp/comm/user/notifications',
        component:Notifications,
        isNav:true,
    },{
        pathname:'/erp/comm/user/dashboard',
        component:Dashboard,
        isNav:true,
        title:'仪表盘',
        icon:'dashboard'
    },{
        pathname:'/erp/comm/user/profile/:id',
        component:Profile,
        isNav:true,
        title:'个人信息',
        icon:'user'
    },{
        pathname:'/erp/comm/user/noauth',
        component:NoAuth
    }]
}





export const adminRoutes = [{
    pathname:'/erp/admin/currency',
    component:Currency,
    isNav:true,
    title:'修改汇率',
    icon:'dollar'
},{
    pathname:'/erp/admin/account/list',
    component:UserList,
    isNav:true,
    title:'账号管理',
    icon:'team'
},{
    pathname:'/erp/admin/account/:id',
    component:Manage,
    isNav:true,
    title:'账号设置',
    icon:'usergroup-add'
},{
    pathname:'/erp/admin/logs',
    component:AdminLogs,
    isNav:true,
    title:'日志',
    icon:'container'
}]