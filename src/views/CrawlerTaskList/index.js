import React, { Component } from 'react'
import { 
  Card,
  Table,
  Menu,
  Dropdown,
  Spin,
  Tag,
  Button,
  Icon,
} from 'antd'
import { timeStamp2date } from '../../assets/lib/utils'
import { getCrawlerTaskList } from '../../requests/crawler'


const titleDisplayMap = {
  SN:'序号',
  name:'任务名称',
  taskType:'任务类型',
  region:'区域',
  searchList:'检索词',
  createdAt: '开始时间',
  finishedAt:'结束时间',
  createdBy: '用户',
  status:'状态'
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
  1:'bestSellers',
  SearchWords:'关键词',
  TargetProduct:'指定产品',
  Board:'榜单',
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

  //根据taskType，进入不同的详情页，并且携带taskId，便于查询
  onDetailClick = (record) =>{
    console.log('查看爬虫结果')
    if(record.taskType === 'bestSellers'){
      //在list中仍然保留_id,传入详情页
      this.props.history.push(`/erp/crawler/bestsellers/detail/${record._id}`)
      console.log('进入bestSellers详情页')
    }
  }

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
                    编辑表单
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
      if(item.taskType){
        item.taskType = crawlerTypeMap[item.taskType] ? crawlerTypeMap[item.taskType] : item.taskType 
      }
      if(item.searchList){
        item.searchList = item.searchList[0]+'...'
      }
      return item
    })
    return dataSource
  }

  getData = async() => {
    this.setState({isLoading:true})
    //网络请求获取数据
    const resp = await getCrawlerTaskList(this.state.offset,this.state.limited)
    const columnsKeys = Object.keys(titleDisplayMap)
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

  //新增爬虫任务，根据key进入不同表单页
  onAddClick = (key) =>{
    console.log('click',key.key)
    //进入新建任务的不同分支表单
    //this.props.history.push(`/erp/crawler/newTask/${key.key}`)
  }

  render() {
    const menu = (
      <Menu onClick={this.onAddClick}>
        <Menu.Item key="bestSellers">Best Sellers</Menu.Item>
        <Menu.Item key="2" disabled>自由检索（disabled）</Menu.Item>
        <Menu.Item key="3" disabled>其他任务（disabled）</Menu.Item>
      </Menu>
    );
    return (
      <>
       <Spin spinning={this.state.isLoading}>
          <Card
              title="爬虫任务记录"
              bordered={false}
              extra={
                <Dropdown overlay={menu}>
                  <span className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    新增爬虫任务 <Icon type="down" />
                  </span>
                </Dropdown>
              }
          >
              <Table
                  rowKey={record=>record.SN}
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
