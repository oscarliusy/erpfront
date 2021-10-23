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
    ProductMaterialRelation,
    ProductAdd,
    ProductOutstock,
    PreOutstockAdd,
    PreOutstockList,
    ProductLogs,
    Notifications,
    Dashboard,
    Profile,
    NoAuth,
    AdminLogs,
    MaterialUpdateList,
    ProductEdit,
    MaterialEdit,
    PreoutstockEdit,
    InstockUpload,
    CrawlerTaskList,
    CrawlerTaskAdd,
    CrawlerTaskDetail,
    CrawlerBestSellerList
    
} from '../views'

export const mainRoutes = [{
    pathname:'/signin',
    component:SignIn
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
        icon:'home',
        roles:['001','002','003']
    },{
        pathname:'/erp/comm/material/edit/:id',
        component:MaterialEdit,
        roles:['002','003']
    },{
        pathname:'/erp/comm/material/add',
        component:MaterialAdd,
        isNav:true,
        title:'新品',
        icon:'bulb',
        roles:['001','002','003']
    },{
        pathname:'/erp/comm/material/instock',
        component:Instock,
        isNav:true,
        title:'入库',
        icon:'import',
        roles:['001','002','003']
    },{
        pathname:'/erp/comm/material/instockupload',
        component:InstockUpload,
        isNav:true,
        title:'批量入库',
        icon:'car',
        roles:['001','002','003']
    },{
        pathname:'/erp/comm/material/update',
        component:MaterialUpdateList,
        title:'修改',
        icon:'tool',
        roles:['002','003']
    },{
        pathname:'/erp/comm/material/logs',
        component:IMLogs,
        isNav:true,
        title:'日志',
        icon:'container',
        roles:['001','002','003']
    }],

    productRoutes:[{
       pathname:'/erp/comm/product/list' ,
       component:ProductList,
       isNav:true,
       title:'清单',
       icon:'shop',
       roles:['001','002','003']
    },{
        pathname:'/erp/comm/product/pmrelationship/list' ,
        component:ProductMaterialRelation,
        isNav:true,
        title:'产品物料关系',
        icon:'bars',
        roles:['001','002','003']
     },{
        pathname:'/erp/comm/product/add' ,
        component:ProductAdd,
        isNav:true,
        title:'新品',
        icon:'bulb',
        roles:['001','002','003']
     },{
        pathname:'/erp/comm/product/preoutstock/add' ,
        component:PreOutstockAdd,
        roles:['001','002','003']
     },{
        pathname:'/erp/comm/product/preoutstock/list' ,
        component:PreOutstockList,
        isNav:true,
        title:'预出库',
        icon:'menu',
        roles:['001','002','003']
     },{
        pathname:'/erp/comm/product/outstock' ,
        component:ProductOutstock,
        isNav:true,
        title:'批量出库',
        icon:'shopping-cart',
        roles:['001','002','003']
     },{
        pathname:'/erp/comm/product/edit/:id' ,
        component:ProductEdit,
        roles:['002','003']
     },{
        pathname:'/erp/comm/product/logs' ,
        component:ProductLogs,
        isNav:true,
        title:'日志',
        icon:'container',
        roles:['001','002','003']
     },{
        pathname:'/erp/comm/product/preoutstock/edit/:id',
        component:PreoutstockEdit,
        roles:['001','002','003']
     }
    ],
    userRoutes:[{
        pathname:'/erp/comm/user/notifications',
        component:Notifications,
        isNav:true,
        roles:['001','002','003']
    },{
        pathname:'/erp/comm/user/dashboard',
        component:Dashboard,
        isNav:true,
        title:'仪表盘',
        icon:'dashboard',
        roles:['001','002','003']
    },{
        pathname:'/erp/comm/user/profile/:id',
        component:Profile,
        isNav:true,
        title:'个人信息',
        icon:'user',
        roles:['001','002','003']
    },{
        pathname:'/erp/comm/user/noauth',
        component:NoAuth,
        roles:['001','002','003']
    }]
}

//ECAS: E-Commerce-Auxiliary-System
export const ECASRoutes = [{
    // pathname:'/erp/admin/currency',
    // component:Currency,
    pathname:'/erp/crawler/tasklist',
    component:CrawlerTaskList,
    isNav:true,
    exact:true,
    title:'爬虫任务列表',
    icon:'bars',
    roles:['001','002','003']
},{
    pathname:'/erp/crawler/taskadd',
    component:CrawlerTaskAdd,
    roles:['001','002','003']
},{
    pathname:'/erp/crawler/detail/:id',
    component:CrawlerTaskDetail,
    roles:['001','002','003'],
    isNav:true,
    exact:true,
    title:'仿海卖页面调试',
    icon:'bars'
},{
    pathname:'/erp/crawler/bestsellers/detail/:id',
    component:CrawlerBestSellerList,
    roles:['001','002','003'],
    exact:true
}
]


export const adminRoutes = [{
    pathname:'/erp/admin/currency',
    component:Currency,
    isNav:true,
    title:'修改汇率',
    icon:'dollar',
    roles:['002','003']
},{
    pathname:'/erp/admin/account/list',
    component:UserList,
    isNav:true,
    title:'账号管理',
    icon:'team',
    roles:['002','003']
},{
    pathname:'/erp/admin/account/detail/:id',
    component:Manage,
    roles:['002','003']
},{
    pathname:'/erp/admin/logs',
    component:AdminLogs,
    isNav:true,
    title:'日志',
    icon:'container',
    roles:['002','003']
},{
    pathname:'/erp/admin/account/signup',
    component:SignUp,
    roles:['003']
}]

