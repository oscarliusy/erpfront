import axios from 'axios'
import {message} from 'antd'
const isDev = process.env.NODE_ENV === 'development'

const service = axios.create({
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

export const getDashboardStatistic = () =>{
    return service.post('/api/v1/dashboard')
}

export const getInventoryMaterialList = (offset = 0, limited = 10,keyword,sort) =>{
    return service.post('/api/v1/material/list',{
        offset,
        limited,
        keyword,
        sort
    })
}

export const postMaterialEdit = (params)=>{
    return service.post('/api/v1/material/edit',params)
}

export const getMaterialDetailById = (id) =>{
    return service.post(`/api/v1/material/detail/${id}`)
}

export const postMaterialAdd = (params) =>{
    //console.log({params})
    return service.post('/api/v1/material/add',params)
}

//params={keyword,offset,limited}
export const instockMaterialSearch = (params) =>{
    return service.post('/api/v1/material/search',params)
}

//params={code,desc,createAt,user,data={dataSource,count}}
export const instockMaterialPost = (params) =>{
    return service.post('/api/v1/material/instock',params)
}

export const getMaterialEditLogs = (offset = 0, limited = 10) =>{
    return service.post('/api/v1/material/editlog',{
        offset,
        limited
    })
}

export const getMaterialInstockLogs = (offset = 0, limited = 10) =>{
    return service.post('/api/v1/material/instocklog',{
        offset,
        limited
    })
}

export const getInstockDetailById = (id,offset = 0, limited = 10) =>{
    return service.post(`/api/v1/material/instock/${id}`,{
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