import { Table,Input,Card } from 'antd';
import React, { Component } from 'react'
import { postProductRelation,postSearchProductRelation } from '../../requests'
const { Search } = Input;

const title =[{
    title: '产品信息',
    children: [
        {
          title: 'id',
          dataIndex: 'id',
          key: 'id',
        },
        {
          title: 'sku',
          dataIndex: 'sku',
          key: 'sku',
        }, 
        {
          title: 'description',
          dataIndex: 'description',
          key: 'description',
        },
      ],
    },{
      title: '物料信息',
      children: [
      ]
    }
]

export default class PMRelationship extends Component{
  constructor(props){
    super(props)
    this.state = {
      dataSource:[],
      columns:[],
    };
  }
  componentDidMount(){
    postProductRelation().then(response=>{
      this.createColumns(response)
      this.setState({
        dataSource:response,
        columns:title,
      });
    })
  }
  createColumns = (response) => {
    let count = 1
    if(response.length === 0) {
      return
    }
    let keys = Object.keys(response[0])
    let children = []
    for(let i = 3; i < keys.length; i=i+2,count++){
      let meterialInfo = {}
      let singletonChildren = []
      let uniqInfo = {}
      let amountInfo = {}
      uniqInfo["title"] ="唯一识别码"
      uniqInfo["dataIndex"] = `uniqueId${count}`
      uniqInfo["key"] = `uniqueId${count}`
      amountInfo["title"] ="所需数量"
      amountInfo["dataIndex"] = `pmAmount${count}`
      amountInfo["key"] = `pmAmount${count}`
      singletonChildren.push(uniqInfo)
      singletonChildren.push(amountInfo)
      meterialInfo["title"] = `物料${count}`
      meterialInfo["children"] = singletonChildren
      children.push(meterialInfo)
    }
    title[1]["children"] = children
  }
  onSearch = (value) => {
    let searchItem = {item: value}    
    postSearchProductRelation(searchItem).then(response =>{
      this.createColumns(response)
      this.setState({
        dataSource:response,
        columns:title,
      });
    })
  }

  render(){
        return (
            <Card title="产品物料关系">
            <Search placeholder="输入SKU或者description" enterButton="Search" size="large" style={{ width: 600 }} onSearch={value => this.onSearch(value)} />
              <br/><br/>
            <Table columns={this.state.columns} dataSource={this.state.dataSource} bordered pagination={{showQuickJumper:true} } />
            </Card>
        )
  }
}