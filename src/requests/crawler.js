import axios from 'axios'
import {message} from 'antd'
import { PROJECT_CONFIG } from '../config'

const serviceCrawlerMock = axios.create({
  baseURL: 'http://rap2api.taobao.org/app/mock/260231',
})
serviceCrawlerMock.interceptors.request.use((config)=>{
  const token = localStorage.getItem('authToken')
  config.headers.Authorization = `Bearer ${token}`
  return config
})

serviceCrawlerMock.interceptors.response.use((resp)=>{
  console.log(resp)
  if (resp.data.code === 200 ){
      return resp.data.data
  }else{
      //全局处理错误
      message.error(resp.data.errMsg)
      console.log('network err:',resp)
  }
})

const serviceCrawler = axios.create({
  baseURL: PROJECT_CONFIG[`${process.env.NODE_ENV}`]['crawlerURL']
})

serviceCrawler.interceptors.request.use((config)=>{
  const token = localStorage.getItem('authToken')
  config.headers.Authorization = `Bearer ${token}`
  return config
})

serviceCrawler.interceptors.response.use((resp)=>{
  console.log(resp)
  if (resp.data.code === 200 ){
      return resp.data.data
  }else{
      //全局处理错误
      message.error(resp.data.errMsg)
      console.log('network err:',resp)
  }
})

export const getCrawlerTaskList = (offset = 0, limited = 10) =>{
  return serviceCrawler.post('/crawler/v1/task/list',{
      offset,
      limited
  })
}

export const getBestSellersDetailById = (id,params) =>{
  return serviceCrawler.post(`/crawler/v1/bestsellers/detail/${id}`,params)
}