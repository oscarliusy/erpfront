//如果是拿到数据处理,把文件按照二进制进行读取
//如果以断点续传方式,通常以base64格式读取
export function readFile(file){
  return new Promise(resolve=>{
    let reader = new FileReader()
    reader.readAsBinaryString(file)
    //读取需要时间,在读取完毕onload事件发生后,获取result数据
    reader.onload = ev =>{
      resolve(ev.target.result)
    }
  })
}


