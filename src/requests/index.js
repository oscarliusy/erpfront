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