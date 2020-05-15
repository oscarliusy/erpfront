import axios from 'axios'
import {message} from 'antd'
//import io from 'socket.io-client'

//export const socket = io('http://localhost:4000')

const isDev = process.env.NODE_ENV === 'development'

const service = axios.create({
    baseURL: isDev ? 'http://rap2api.taobao.org/app/mock/245040' : ''
})

const serviceNoauth = axios.create({
    baseURL: isDev ? 'http://rap2api.taobao.org/app/mock/245040' : ''
})

service.interceptors.request.use((config)=>{
    config.data = Object.assign({},config.data,{
        //authToken:window.localStorage.getItem('authToken')
        authToken:'itisatoken'
    })
    return config
})

service.interceptors.response.use((resp)=>{
    if (resp.data.code === 200 ){
        return resp.data.data
    }else{
        //全局处理错误
        message.error(resp.data.errMsg)
        console.log('network err:',resp)
    }
})

const serviceKoa = axios.create({
    baseURL:'http://localhost:8000'
})

serviceKoa.interceptors.request.use((config)=>{
    config.data = Object.assign({},config.data,{
        //authToken:window.localStorage.getItem('authToken')
        authToken:'itisatoken'
    })
    return config
})

serviceKoa.interceptors.response.use((resp)=>{
    if (resp.data.code === 200 ){
        return resp.data.data
    }else{
        //全局处理错误
        message.error(resp.data.errMsg)
        console.log('network err:',resp)
    }
})


export const getDashboardStatistic = () =>{
    return serviceKoa.post('/api/v1/dashboard')
}

export const getInventoryMaterialList = (offset = 0, limited = 10,keyword,sort) =>{
    return serviceKoa.post('/api/v1/material/list',{
        offset,
        limited,
        keyword,
        sort
    })
}

export const getMaterialDetailById = (id) =>{
    return serviceKoa.post(`/api/v1/material/detail/${id}`)
}

export const postMaterialEdit = (params)=>{
    return serviceKoa.post('/api/v1/material/edit',params)
}

export const getPurchaserList = () =>{
    return serviceKoa.post('/api/v1/material/purchaserList')
}


export const postMaterialAdd = (params) =>{
    //console.log({params})
    return serviceKoa.post('/api/v1/material/add',params)
}

//params={keyword,offset,limited}
export const instockMaterialSearch = (params) =>{
    return serviceKoa.post('/api/v1/material/search',params)
}

//params={code,desc,createAt,user,data={dataSource,count}}
export const instockMaterialPost = (params) =>{
    return serviceKoa.post('/api/v1/material/instock',params)
}

export const getMaterialEditLogs = (offset = 0, limited = 10) =>{
    return service.post('/api/v1/material/editlog',{
        offset,
        limited
    })
}

export const getMaterialInstockLogs = (offset = 0, limited = 10) =>{
    return serviceKoa.post('/api/v1/material/instocklog',{
        offset,
        limited
    })
}

export const getInstockDetailById = (id,offset = 0, limited = 10) =>{
    return serviceKoa.post(`/api/v1/material/instock/${id}`,{
        offset,
        limited
    })
}

export const getProductList = (keyword,offset=0,limited=10)=>{
    return service.post('/api/v1/product/list',{
        keyword,
        offset,
        limited
    })
}

export const getProductDetailById = (id) =>{
    return service.post(`/api/v1/product/detail/${id}`)
}

export const saveProductEdit = (params)=>{
    return service.post('/api/v1/product/edit',params)
}

export const postProductAdd = (params)=>{
    return service.post('/api/v1/product/add',params)
}

export const getPreoutstockList = (offset=0,limited=10) =>{
    return service.post('/api/v1/preoutstock/list',{
        offset,
        limited
    })
}

export const getPreoutstockById = (id) =>{
    return service.post(`/api/v1/product/preoutstock/${id}`)
}

//params={keyword,offset,limited}
export const preoutstockProductSearch = (params) =>{
    return service.post('/api/v1/product/preoutstock/search',params)
}

//params={id,desc,user,products}
export const postPreoutstockEdit = (params) =>{
    return service.post('/api/v1/product/preoutstock/edit',params)
}

//params={desc,user,products}
export const postPreoutstockAdd = (params) =>{
    return service.post('/api/v1/product/preoutstock/add',params)
}

export const getProductEditLogs = (offset = 0, limited = 10) =>{
    return service.post('/api/v1/product/editlog',{
        offset,
        limited
    })
}

export const getProductOutstockLogs = (offset = 0, limited = 10) =>{
    return service.post('/api/v1/product/outstocklog',{
        offset,
        limited
    })
}

export const getOutstockDetailById = (id,offset = 0, limited = 10) =>{
    return service.post(`/api/v1/product/outstock/${id}`,{
        offset,
        limited
    })
}

export const getSiteCurrency = () =>{
    return service.post('/api/v1/currency/site')
}

export const modifySiteCurrency = (siteInfo) => {
    return service.post('/api/v1/currency/sitemodify',{
        siteInfo
    })
}

export const getExchangeRate = () =>{
    return service.post('/api/v1/currency/exchangerate')
}

export const setExchangeRate = (exchangeRate) =>{
    return service.post('/api/v1/currency/setexchangerate',{
        exchangeRate
    })
}

export const getAccountList = (keyword,offset = 0, limited = 10) =>{
    return service.post('/api/v1/account/list',{
        keyword,
        offset,        
        limited
    })
}

export const getAccountDetailById = (id) =>{
    return service.post(`/api/v1/account/detail/${id}`)
}

//params={id,department,position,authority,status}
export const postAccountDetailEdit = (params) =>{
    return service.post('/api/v1/account/edit',params)
}

//params={username,gender,entryAt,identityNumber,resume,department,position,authority,status}
export const postSignUp = (params) =>{
    return service.post('/api/v1/account/signup',params)
}

//params = { id,username,password,avatar}
export const profileEditPost = (params) =>{
    return service.post('/api/v1/account/profile',{params})
}

//signInInfo = { email, password}
export const signInRequest = (signInInfo) =>{
    return serviceNoauth.post('/api/v1/signin',{
        email:signInInfo.email,
        password:signInInfo.email
    })
}

export const getAccountCurrencyLogs = (offset = 0, limited = 10) =>{
    return service.post('/api/v1/account/logs/currency',{
        offset,
        limited
    })
}

export const getAccountManageLogs = (offset = 0, limited = 10) =>{
    return service.post('/api/v1/account/logs/manage',{
        offset,
        limited
    })
}