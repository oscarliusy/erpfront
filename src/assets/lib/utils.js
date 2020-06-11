const moment = require('moment')


//如果是拿到数据处理,把文件按照二进制进行读取
//如果以断点续传方式,通常以base64格式读取
export const readFile = (file) =>{
  return new Promise(resolve=>{
    let reader = new FileReader()
    reader.readAsBinaryString(file)
    //读取需要时间,在读取完毕onload事件发生后,获取result数据
    reader.onload = ev =>{
      resolve(ev.target.result)
    }
  })
}

export const dateFormat = (timestamp,fmt) =>{
  let date = new Date(timestamp)
  //匹配fmt中是否有1-多个y
  if(/(y+)/.test(fmt)){
    //RegExp.$1是匹配结果，将其替换成计算出的年份，根据y的个数保留几位
    fmt = fmt.replace(RegExp.$1,(date.getFullYear()+'').substr(4-RegExp.$1.length))
  }
  let o ={
    'M+':date.getMonth()+1,
    'd+':date.getDate(),
    'h+':date.getHours(),
    'm+':date.getMinutes(),
    's+':date.getSeconds()
  }

  for(let k in o){
    if(new RegExp(`(${k})`).test(fmt)){
      //将str转为字符串
      let str=o[k] + ''
      //匹配后，补0显示
      fmt = fmt.replace(RegExp.$1,(RegExp.$1.length === 1) ? str : padLeftZero(str))
    }
  }
  return fmt
}

const padLeftZero=(str)=>{
  return ('00'+str).substr(str.length)
}

export const timeStamp2date = (timeStamp) =>{
  return moment(Number(timeStamp)).format('YYYY-MM-DD HH:mm:ss')
}