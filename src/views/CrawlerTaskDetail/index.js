import React, { Component } from 'react'
import {data} from './data'
import { timeStamp2date } from '../../assets/lib/utils'
import { 
  Divider,
  Table,
  Select
} from 'antd'
import './ctd.less'

const titleDisplayMap = {
  site:'Site',
  siteCurreny:'Currency',
  siteSales:'Sales',
  siteRmbSales:'Sales¥',
  siteOrders:'Order',
  siteUnits:'Units',
  siteASB:'ASB',
  siteReturnUnits:'Return Units',
  siteStock:'Stock',

  asin:'ASIN',
  title:'TITLE',
  sku:'SKU',
  salesToday:'SALES TODAY',//今日净销售额
  unitsToday:'UNITS TODAY',
  asbToday:'ASB TODAY',//今日单价
  returnToday:'RETURN TODAY',
  salesYesterday:'SALES Yesterday',//某时间段内销量
  unitsYesterday:'UNITS Yesterday',//今日净销售额
  ASBYesterday:'ASB Yesterday',//今日单价
  FBAStock:'FBA Stock',
  transferStock:'Transfer Stock'
}

const { Option } = Select
export default class CrawlerTaskDetail extends Component {
  constructor(props){
    super(props)
    this.state = {
      generalInfo:data.generalInfo,
      date:'',
      time:'',
      
      siteColumns:[],
      siteDataSource:[],

      columns:[],
      dataSource:[],
      totalSku:0,
      offset:0,
      limited:10,
      sort:1,

      sitesList:['All','SL-US','SL-CA','LKS-US','LKS-CA']
    }
  }

  createColumns = (columnsKeys) =>{
    const columns = columnsKeys.map(item=>{
      //按数量排序，先不加
      // if( item === 'amount'){
      //   return {
      //   title:<span onClick={this.sortByAmount}>
      //           {titleDisplayMap[item]}
      //           <Icon type="swap" />
      //         </span>,
      //   key:item,
      //   dataIndex:item
      //   }
      // }
      return {
        title:titleDisplayMap[item],
        dataIndex:item,
        key:item
      }
    })
    return columns
}
  transferDate = () => {
    let _generalInfo = this.state.generalInfo
    _generalInfo.updatedAt = timeStamp2date(_generalInfo.updatedAt)
    let _date = _generalInfo.updatedAt.split(' ')[0]
    let _time = _generalInfo.updatedAt.split(' ')[1]
    this.setState({
      generalInfo:_generalInfo,
      time:_time,
      date:_date
    })
  }

  buildSiteTable = () => {
    const siteColumnsKeys = Object.keys(data.siteInfo[0])
    const siteColumns = this.createColumns(siteColumnsKeys)
    if(!this.updater.isMounted(this)) return
    this.setState({
      siteColumns,
      siteDataSource:data.siteInfo
    })
  }

  buildDetailTable = () =>{
    const detailColumnsKeys = Object.keys(data.detail.list[0])
    const detailColumns = this.createColumns(detailColumnsKeys)
    if(!this.updater.isMounted(this)) return
    this.setState({
      columns:detailColumns,
      dataSource:data.detail.list,
      totalSku:data.detail.totalSku
    })
  }

  componentDidMount(){
    this.transferDate()
    this.buildSiteTable()
    this.buildDetailTable()
  }


  render() {
    const {generalInfo} = this.state
    return (
      <>
        <div className="ctd-title">
          <span>产品销售报告</span>
        </div>
        <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}>
          总览
        </Divider>
        <div className="ctd-general-info">
          <div className="ctd-general-info-date">
            <span className="ctd-general-info-date-detail">Date:{this.state.date}</span>
            <span className="ctd-general-info-date-detail">Week:CW{generalInfo.week}</span>
            <span className="ctd-general-info-date-detail">Sales:Today so far till {this.state.time}</span>
          </div>
          <div className="ctd-general-info-sale">
              <span className="ctd-general-info-sale-item">Sales：¥{generalInfo.totalSales}</span>
              <span className="ctd-general-info-sale-item">Order：{generalInfo.totalOrders}</span>
              <span className="ctd-general-info-sale-item">Units：{generalInfo.totalUnits}</span>   
              <span className="ctd-general-info-sale-item">ASB：¥{generalInfo.totalASB}</span>
          </div>
        </div>
        <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}>
          分站点
        </Divider>
        <Table
          rowKey={record=>record.site}
          dataSource={this.state.siteDataSource}
          columns={this.state.siteColumns}
          pagination={{
              hideOnSinglePage:true,
          }}
        />
        <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}>
          详情
        </Divider>
        <div className="ctd-select">
          <Select 
            style={{ width: 200 }} 
            defaultValue="All"
            //onChange={this.handleSelectPurchaserChange}
          >
            {
              this.state.sitesList.map(item=>{
                return(
                    <Option value={item} key={item}>{item}</Option>
                )
              })
            }
          </Select>
          <span className="ctd-select-btn">选择站点</span>
        </div>
        <Table
          rowKey={record=>record.asin}
          dataSource={this.state.dataSource}
          columns={this.state.columns}
          pagination={{
              total:this.state.totalSku,
              //onChange : this.onPageChange,
              hideOnSinglePage:true,
              showQuickJumper:true,
              showSizeChanger:true,
              //onShowSizeChange:this.onShowSizeChange,
              current: this.state.offset / this.state.limited + 1,
              //pageSizeOptions:['10','20','50']
          }}
        />
      </>
    )
  }
}
