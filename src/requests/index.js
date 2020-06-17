import axios from 'axios'
import {message} from 'antd'

// import store from '../store'
// const state = store.getState()

//import io from 'socket.io-client'

//export const socket = io('http://localhost:4000')

const isDev = process.env.NODE_ENV === 'development'

const service = axios.create({
    baseURL: isDev ? 'http://rap2api.taobao.org/app/mock/245040' : ''
})


service.interceptors.request.use((config)=>{
    // config.data = Object.assign({},config.data,{
    //     //authToken:window.localStorage.getItem('authToken')
    //     authToken:'itisatoken'
    // })
    const token = localStorage.getItem('authToken')
    console.log(token)
    config.headers.Authorization = `Bearer ${token}`
    return config
})

service.interceptors.response.use((resp)=>{
    console.log(resp)
    if (resp.data.code === 200 ){
        return resp.data.data
    }else{
        //全局处理错误
        message.error(resp.data.errMsg)
        console.log('network err:',resp)
    }
})

const serviceKoa = axios.create({
    baseURL: isDev ? 'http://localhost:8000' : 'http://localhost:80'
})

serviceKoa.interceptors.request.use(
    (config)=>{
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken')
    config.headers.Authorization = `Bearer ${token}`
    return config
    },
    err =>{
     return Promise.reject(err)   
    })

serviceKoa.interceptors.response.use(
    resp => {
        if (resp.data.code === 200 ){
            return resp.data.data
        }else{
            //全局处理错误
            message.error(resp.data.errMsg)
            console.log('network err:',resp)
        }
    },
    error =>{
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    message.warning('登录信息已过期,请重新登录')
                    // store.dispatch({
                    //     type:'SIGNIN_FAILED'
                    // })
                    break
                default:
                    console.log('default error')
            }
        }
        return Promise.reject(error.response)
    }
)


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
    return serviceKoa.post('/api/v1/material/editlog',{
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
    return serviceKoa.post('/api/v1/product/list',{
        keyword,
        offset,
        limited
    })
}

export const getProductDetailById = (id) =>{
    return serviceKoa.post(`/api/v1/product/detail/${id}`)
}

export const saveProductEdit = (params)=>{
    return serviceKoa.post('/api/v1/product/edit',params)
}

export const getSiteMap = () =>{
    return serviceKoa.post('/api/v1/product/siteMap')
}

export const postProductAdd = (params)=>{
    return serviceKoa.post('/api/v1/product/add',params)
}

export const getPreoutstockList = (offset=0,limited=10) =>{
    return serviceKoa.post('/api/v1/product/preoutstock/list',{
        offset,
        limited
    })
}

export const copyPreoutstockById = (id) =>{
    return serviceKoa.post(`/api/v1/product/preoutstock/copy/${id}`)
}

export const preToOutstockById = (id) =>{
    return serviceKoa.post(`/api/v1/product/preoutstock/outstock/${id}`)
}

export const getPreoutstockById = (id) =>{
    return serviceKoa.post(`/api/v1/product/preoutstock/detail/${id}`)
}

//params={keyword,offset,limited}
export const preoutstockProductSearch = (params) =>{
    return serviceKoa.post('/api/v1/product/preoutstock/search',params)
}

export const calcPreoutstock = (params)=>{
    return serviceKoa.post('/api/v1/product/preoutstock/calc',params)
}

export const postPreoutstockEdit = (params) =>{
    return serviceKoa.post('/api/v1/product/preoutstock/edit',params)
}

export const postOutstockUpload = (params) =>{
    return serviceKoa.post('/api/v1/product/outstock/upload',params)
}

export const postPreoutstockAdd = (params) =>{
    return serviceKoa.post('/api/v1/product/preoutstock/add',params)
}

export const getProductEditLogs = (offset = 0, limited = 10) =>{
    return serviceKoa.post('/api/v1/product/editlog',{
        offset,
        limited
    })
}

export const getProductOutstockLogs = (offset = 0, limited = 10) =>{
    return serviceKoa.post('/api/v1/product/outstocklog',{
        offset,
        limited
    })
}

export const getOutstockDetailById = (id,offset = 0, limited = 10) =>{
    return serviceKoa.post('/api/v1/product/outstock/detail',{
        id,
        offset,
        limited
    })
}

export const getSiteCurrency = () =>{
    return serviceKoa.post('/api/v1/currency/site')
}

export const modifySiteCurrency = (params) => {
    return serviceKoa.post('/api/v1/currency/sitemodify',{
        site:params.site,
        currency:params.currency
    })
}

export const getExchangeRate = () =>{
    return serviceKoa.post('/api/v1/currency/exchangerate')
}

export const setExchangeRate = (params) =>{
    return serviceKoa.post('/api/v1/currency/setexchangerate',{
        currency:params.currency,
        exchangeRate:params.exchangeRate
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
    return serviceKoa.post('/api/v1/account/editprofile',params)
}

//signInInfo = { email, password}
export const signInRequest = (signInInfo) =>{
    return serviceKoa.post('/api/v1/signin',{
        email:signInInfo.email,
        password:signInInfo.password
    })
}

export const getAccountCurrencyLogs = (offset = 0, limited = 10) =>{
    return serviceKoa.post('/api/v1/currency/editlog',{
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