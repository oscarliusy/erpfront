import React, { Component } from 'react'
import {
  Card,
  Table,
  Select,
  Input,
  Spin,
  Icon
} from 'antd'
import { timeStamp2date } from '../../assets/lib/utils'
//import {data} from './data'
import { getBestSellersDetailById } from '../../requests/crawler'

const { Search } = Input
const { Option } = Select
//本地模拟数据
//const resp = data.data
const testTaskId = "5f44ddff704b340f249a1582"

const titleDisplayMap = {
  SN:'序号',
  rank:'排名',
  title:'名称',
  star:'星级',
  starNumber:'星数',
  lowPrice:'最低价',
  highPrice:'最高价',
  secondOrder:'二级菜单',
  thirdOrder:'三级菜单',
  fourthOrder:'四级菜单',
  imgUrl:'缩略图'
}

export default class CrawlerBestSellerList extends Component {
  constructor(){
    super()
    this.state = {
      isLoading:false,
      dataSource:[],  //Table数据
      columns:[],     //Table列元素
      total:0,        //记录总数

      //顶部任务详情
      firstOrder:'',
      user:'',
      startAt:'',
      finishAt:'',
      regionCode:'',

      //请求参数
      offset:0,     //页数
      limited:10,   //页容量
      sort:"",      //排序的项目：star,starNumber,lowPrice,highPrice
      sortIndex:1,  //排序方式  1 正序 -1 倒序
      keyword:'',   //搜索词
      order:5,  //菜单等级  1-4 对应1-4级菜单任务
      star:5       //星数等级  5:全部    4：小于四星  3：小于三星
    }
  }
  onSearch = (value)=>{
    this.setState({
      keyword:value
    },()=>{
      this.getData()
    })
  }
  createColumns = (columnsKeys) =>{
    const columns = columnsKeys.map(item=>{
      if( item === 'lowPrice'){
        return {
        title:<span onClick={this.changeSort.bind(this,"lowPrice")}>
                {titleDisplayMap[item]}
                <Icon type="swap" />
              </span>,
        key:item,
        dataIndex:item
        }
      }
      if( item === 'highPrice'){
        return {
        title:<span onClick={this.changeSort.bind(this,"highPrice")}>
                {titleDisplayMap[item]}
                <Icon type="swap" />
              </span>,
        key:item,
        dataIndex:item
        }
      }
      if( item === 'star'){
        return {
        title:<span onClick={this.changeSort.bind(this,"star")}>
                {titleDisplayMap[item]}
                <Icon type="swap" />
              </span>,
        key:item,
        dataIndex:item
        }
      }
      if( item === 'starNumber'){
        return {
        title:<span onClick={this.changeSort.bind(this,"starNumber")}>
                {titleDisplayMap[item]}
                <Icon type="swap" />
              </span>,
        key:item,
        dataIndex:item
        }
      }
      if( item === 'imgUrl'){
        return {
            title:titleDisplayMap[item],
            key:item,
            render:(text,record)=>{
                return (
                    <img src={record.imgUrl} alt={record.image} style={{width:"60px",height:"60px"}}/>
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
    return columns
  }
  /**
   * 
   * @param {Str} sortOption star,starNumber,lowPrice,highPrice其中之一
   */
  changeSort = (sortOption) =>{
    const newsort = this.state.sortIndex === 1 ? -1 : 1
    this.setState({
      sort: sortOption,
      sortIndex:newsort
    },()=>{
        this.getData()
    })
  }

  buildColumnsDataSource = (resp)=>{
    const dataSource = resp.list.map(item=>{
      return item
    })
    return dataSource
  }

  buildRequestParams = () =>{
    const params = {
      offset:this.state.offset,
      limited:this.state.limited,
      sort:this.state.sort,
      keyword:this.state.keyword,
      order:this.state.order,
      star:this.state.star,
      sortIndex:this.state.sortIndex
    }
    console.log('params:',params)
    return params
  }

  getData = async() =>{
    try{
      this.setState({isLoading:true})
      const params = this.buildRequestParams()
      const resp = await getBestSellersDetailById(testTaskId,params)
      this.setGeneralInfo(resp)
      //为了控制显示顺序使用titleDisplayMap生成表头
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
    }catch(e){
      console.log('CrawlerBestSellerList-getData-ERROR:',e)
    }
  }

  setGeneralInfo = (resp) =>{
    this.setState({
      firstOrder:resp.firstOrder,
      user:resp.user,
      startAt:timeStamp2date(resp.startAt),
      finishAt:timeStamp2date(resp.finishAt),
      regionCode:resp.regionCode
    })
  }

  onPageChange=(page, pageSize)=>{
    this.setState({
      offset:pageSize*(page - 1),
      limited:pageSize
    },()=>{
      this.getData()
    })
  }
  handleMenuOrderChange = (value)=>{
    this.setState({
      order:value
    },()=>{
      this.getData()
    })
  }
  handleStarChange = (value)=>{
    this.setState({
      star:value
    },()=>{
      this.getData()
    })
  }
  onShowSizeChange=(current, size)=>{
    //变更页面回到首页
    this.setState({
      offset:0,
      limited:size
    },()=>{
      this.getData()
    })
  }

  componentDidMount(){
    this.getData()
  }

  render() {
    return (
      <>
        <Spin spinning={this.state.isLoading}>
          <Card
              title="Best Sellers"
              bordered={false}
              extra={
                <div>
                  <span style={{paddingLeft:"10px" }}>一级菜单：{this.state.firstOrder}</span>
                  <span style={{paddingLeft:"10px" }}>操作人：{this.state.user}</span>
                  <span style={{paddingLeft:"10px" }}>开始时间：{this.state.startAt}</span>
                  <span style={{paddingLeft:"10px" }}>结束时间：{this.state.finishAt}</span>
                  <span style={{paddingLeft:"10px" }}>区域代码：{this.state.regionCode}</span>
                </div>
              }
          >
              <div style={{width:"600px",padding:"10px"}}>
                  <Search
                      placeholder="输入产品名称/各级菜单关键字进行搜索"
                      enterButton="Search"
                      size="large"
                      onSearch={value=>{this.onSearch(value)}}                         
                  />
              </div>
              <div style={{width:"600px",padding:"10px"}}>
                <Select defaultValue="5" style={{ width: 120}} onChange={this.handleMenuOrderChange}>
                  <Option value="5">全部级别</Option>
                  <Option value="1">一级菜单</Option>
                  <Option value="2">二级菜单</Option>
                  <Option value="3">三级菜单</Option>
                  <Option value="4">四级菜单</Option>
                </Select>
                <Select defaultValue="5" style={{ width: 120,paddingLeft:"10px" }} onChange={this.handleStarChange}>
                  <Option value="5">全部星级</Option>
                  <Option value="4">小于四星</Option>
                  <Option value="3">小于三星</Option>
                </Select>
              </div>
              <Table
                  rowKey={record=>record._id}
                  dataSource={this.state.dataSource}
                  columns={this.state.columns}
                  size="small"
                  pagination={{
                      total:this.state.total,
                      onChange : this.onPageChange,
                      showQuickJumper:true,
                      current: this.state.offset / this.state.limited + 1,
                      showSizeChanger:true,
                      onShowSizeChange:this.onShowSizeChange,
                      pageSizeOptions:['10','20','50']
                  }}
              />
          </Card>
      </Spin>
      </>
    )
  }
}
