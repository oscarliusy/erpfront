import React, { Component } from 'react'
import { 
  Card,
  Table,
  Button,
  Spin,
  Tag
} from 'antd'
import { timeStamp2date } from '../../assets/lib/utils'
import { getCrawlerTaskList } from '../../requests/crawler'

// const tasks = [{
//   _id:'11111',
//   name:'亚马逊seal bottle等',
//   type:'SearchWords',
//   createdAt:1594002940450,
//   finishedAt:1594003940450,
//   createdBy:'oscar',
//   status:'Finish',
//   detail:[{
//     KEYWORD:'Seal Bottle',
//     total:240
//   },{
//     KEYWORD:'Bootleg Bottle',
//     total:180
//   }]
// },{
//   _id:'11112',
//   name:'爬取数据',
//   type:'TargetProduct',
//   createdAt:1594086578841,
//   finishedAt:0,
//   createdBy:'wangbo',
//   status:'Ongoing',
//   detail:[{
//     KEYWORD:'Paddle'
//   },{
//     KEYWORD:'Chair'
//   }]
// },{
//   _id:'11113',
//   name:'爬取榜单',
//   type:'Board',
//   createdAt:1594086598841,
//   finishedAt:0,
//   createdBy:'wangbo',
//   status:'Error',
//   detail:[{
//     KEYWORD:'Book'
//   },{
//     KEYWORD:'Coat'
//   }]
// }]

const titleDisplayMap = {
  _id:'Id',
  name:'任务名称',
  type:'任务类型',
  createdAt: '开始时间',
  finishedAt:'结束时间',
  status:'状态',
  createdBy: '用户',
  searchList:'检索词列表',
  KEYWORD:'检索词'
}

const statusColorMap = {
  'Finish':{
    'text':'已完成',
    'color':'blue'
  },
  'Ongoing':{
    'text':'进行中',
    'color':'green'
  },
  'Error':{
    'text':'错误终止',
    'color':'red'
  }
}

const crawlerTypeMap = {
  SearchWords:'关键词',
  TargetProduct:'指定产品',
  Board:'榜单'

}

const colorMap = {
  '已完成':'blue',
  '进行中':'green',
  '错误终止':'red'
}

export default class CrawlerTaskList extends Component {
  constructor(){
    super()
    this.state={
        offset:0,
        limited:10,
        isLoading:false,
        dataSource:[],
        columns:[],
        total:0,
        detail:{},
        visible:false,
    }
  }  

  onDetailClick = (record) =>{}

  onCopyClick = async(record) => {}

  toEdit = (record) =>{}

  onPageChange=(page, pageSize)=>{
    this.setState({
      offset:pageSize*(page - 1),
      limited:pageSize
    },()=>{
      this.getData()
    })
}

  createColumns = (columnsKeys) =>{
    const columns = columnsKeys.map(item=>{
      if(item === 'status'){
        return {
          title:titleDisplayMap[item],
          dataIndex:item,
          key:item,
          render:(text,record)=>{
            let color
            color = colorMap[record.status] || 'red'
            return (
              <>
                <Tag color={color} key={item}>
                  {record.status}
                </Tag>
              </>
            )
          }
        }
      }
      return {
          title:titleDisplayMap[item],
          dataIndex:item,
          key:item
      }
    })
    columns.push({
        title:'Action',
        key:'action',
        width:250,
        render:(text,record)=>{
          return (
            <>
                <Button 
                    size="small" 
                    onClick={this.onCopyClick.bind(this,record)}
                    style = {{marginRight:"10px"}} 
                >
                    再次爬取
                </Button>
                <Button size="small" type="primary" onClick={this.onDetailClick.bind(this,record)}>
                    详情
                </Button>
                <Button
                 size = "small" 
                 type = "link" 
                 style = {{marginLeft:"5px",marginRight:"5px"}} 
                 onClick = {this.toEdit.bind(this,record)}
                 disabled = {record.has_out}
                >
                    编辑
                </Button>
            </>
          )
        }
    })
    return columns
}
  buildColumnsDataSource = (resp)=>{
    const dataSource = resp.list.map(item=>{
      if(item.createdAt){
          let dateFormat = timeStamp2date(item.createdAt)
          item.createdAt = dateFormat
      }
      if(item.finishedAt === 0){
        item.finishedAt = '--'
      }else{
        item.finishedAt = timeStamp2date(item.finishedAt)
      }
      if(item.status){
        item.status = statusColorMap[item.status].text
      }
      if(item.type){
        item.type = crawlerTypeMap[item.type]
      }
      return item
    })
    return dataSource
  }

  getData = async() => {
    this.setState({isLoading:true})
    //网络请求获取数据
    const resp = await getCrawlerTaskList(this.state.offset,this.state.limited)
    const columnsKeys = Object.keys(resp.list[0])
    columnsKeys.splice(columnsKeys.length-1,1)
    const columns = this.createColumns(columnsKeys)
    const dataSource = this.buildColumnsDataSource(resp)
    
    if(!this.updater.isMounted(this)) return
    this.setState({
      columns:columns,
      dataSource:dataSource,
      total:resp.total
    })
    this.setState({isLoading:false})
    
  }

  componentDidMount(){
    this.getData()
  }

  render() {
    return (
      <>
       <Spin spinning={this.state.isLoading}>
          <Card
              title="爬虫任务记录"
              bordered={false}
              extra={
                  <Button onClick={this.toPreoutstockAdd}>新建爬虫任务</Button>
              }
          >
              <Table
                  rowKey={record=>record._id}
                  dataSource={this.state.dataSource}
                  columns={this.state.columns}
                  pagination={{
                      total:this.state.total,
                      onChange : this.onPageChange,
                      showQuickJumper:true,
                      current: this.state.offset / this.state.limited + 1
                  }}
              />
          </Card>
        </Spin>
      </>
    )
  }
}
