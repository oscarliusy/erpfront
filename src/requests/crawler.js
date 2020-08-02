import axios from 'axios'
import {message} from 'antd'
//import { PROJECT_CONFIG } from '../config'

const serviceCrawlerMock = axios.create({
  baseURL: 'http://rap2api.taobao.org/app/mock/260231'
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

export const getCrawlerTaskList = (offset = 0, limited = 10) =>{
  return serviceCrawlerMock.post('/ecas/v1/crawler/tasklist',{
      offset,
      limited
  })
}