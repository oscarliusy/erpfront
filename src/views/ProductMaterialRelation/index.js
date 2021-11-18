import { Table, Input, Card, Drawer, Button, Pagination } from 'antd';
import React, { Component } from 'react'
import { postProductRelation, postSearchProductRelation, postShowMeterialNoneProduct } from '../../requests'
const { Search } = Input;


const title = [{
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
}, {
  title: '物料信息',
  children: [
  ]
}
]
const meterialColumns = [
  {
    title: 'uniqueId',
    dataIndex: 'uniqueId',
    key: 'uniqueId',
  },
  {
    title: 'description',
    dataIndex: 'description',
    key: 'description',
  },
]

export default class PMRelationship extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      meterial: [],
      visible: false,
      meterialKeys: [],
      pageSize: 10,
      pageNum: 1,
      total: 0,
      offset: 0,
      limited: 10,
    };
  }

  componentDidMount() {
    this.getProductList()
  }

  getProductList = async () => {
    postProductRelation({ offset: this.state.offset, limited: this.state.limited }).then(response => {
      this.createColumns(response.data)
      this.setState({
        dataSource: response.data,
        columns: title,
        total: response.total,
      });
    })
  }


  createColumns = (response) => {
    let count = 1
    if (response.length === 0) {
      return
    }
    let keys = Object.keys(response[0])
    let children = []
    for (let i = 3; i < keys.length; i = i + 2, count++) {
      let meterialInfo = {}
      let singletonChildren = []
      let uniqInfo = {}
      let amountInfo = {}
      uniqInfo["title"] = "唯一识别码"
      uniqInfo["dataIndex"] = `uniqueId${count}`
      uniqInfo["key"] = `uniqueId${count}`
      amountInfo["title"] = "所需数量"
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
    this.onShowSizeChange(1,10)
    let searchItem = { item: value, offset: this.state.offset, limited: this.state.limited }
    postSearchProductRelation(searchItem).then(response => {
      this.createColumns(response.data)
      await this.setState({
        dataSource: response.data,
        columns: title,
        total: response.total
      });
    })
  }
  showDrawer = () => {
    postShowMeterialNoneProduct().then(response => {
      this.setState({
        meterial: response,
        visible: true
      })
    })
  }
  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onShowSizeChange = async (current, pageSize) => {
    if (current <= 0) {
      current = 1
    }

    await this.setState({
      pageSize: pageSize,
      pageNum: current,
      offset: pageSize * (current - 1),
      limited: pageSize
    })
    this.getProductList()
  }

  render() {
    return (
      <Card title="产品物料关系">
        <Search placeholder="输入SKU或者description" enterButton="Search" size="large" style={{ width: 600 }} onSearch={value => this.onSearch(value)} />
        <Button type="primary" size="large" style={{ float: "right" }} onClick={this.showDrawer} >查看孤品物料</Button>
        <br /><br />
        <Table columns={this.state.columns} dataSource={this.state.dataSource} bordered
          pagination={{
            total: this.state.total,
            onChange: this.onShowSizeChange,
            showQuickJumper: true,
            onShowSizeChange: this.onShowSizeChange,
            showSizeChanger: true,
            current: this.state.offset / this.state.limited + 1
          }}
        />
        <Drawer title="孤品物料" placement="right" onClose={this.onClose} destroyOnClose={true} visible={this.state.visible} width="40%">
          <Table columns={meterialColumns} dataSource={this.state.meterial} bordered />
        </Drawer>
      </Card>
    )
  }
}