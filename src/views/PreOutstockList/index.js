import React, { Component } from 'react'
import { 
    Card,
    Table,
    Button,
    Spin,
    Descriptions,
    Drawer,
    message
} from 'antd'

import { getPreoutstockList } from '../../requests'

const titleDisplayMap = {
    id:'Id',
    code:'Code',
    createAt: '创建/修改时间',
    desc:'详细信息',
    user:'用户',
    weight: '总重量(kg)',
    volumn:'总体积(m³)',
    cost:'运费(￥)'
}

export default class PreOutstockList extends Component {
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
            products:[],
            detailKeys:[],


        }
    }

    showDrawer = () => {
        this.setState({
            visible: true
        })
    }

    onDetailClick = (record) => {
        let _products = [...record.products]
        this.setState({
            detail:record,
            products:_products
        },()=>{
            this.showDrawer()
        })
    }

    toEdit = (record) =>{
        this.props.history.push(`/erp/comm/product/preoutstock/edit/${record.id}`)
    }

    toOutstock = (record) =>{
        const _dataSource = [...this.state.dataSource]
        _dataSource.map(item=>{
            if(item.id === record.id){
                item.hasOutstock = true
            }
            return item
        })
        //这里实际应当为一个网络请求，这里省略为一个状态管理。
        this.setState({
            dataSource:_dataSource
        },()=>{
            message.success('已成功出库')
        })
    }

    createColumns = (columnsKeys) =>{
        const columns = columnsKeys.map(item=>{
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
                    <Button size="small" type="primary" onClick={this.onDetailClick.bind(this,record)}>详情</Button>
                    <Button
                     size = "small" 
                     type = "link" 
                     style = {{marginLeft:"5px",marginRight:"5px"}} 
                     onClick = {this.toEdit.bind(this,record)}
                     disabled = {record.hasOutstock}
                    >编辑</Button>
                    {
                        record.hasOutstock 
                        ?
                        <span size="small" style={{color:"red"}} >已出库</span>
                        :
                        <Button size="small" type="success" onClick={this.toOutstock.bind(this,record)}>出库</Button>
                    }
                </>
              )
            }
        })
        return columns
    }

    getData = () =>{
        getPreoutstockList(this.state.offset,this.state.limited)
        .then(resp=>{
            const columnsKeys = Object.keys(resp.list[0])
            columnsKeys.splice(1,1)//这里要把product去除，具体根据服务器决定如何处理。
            const columns = this.createColumns(columnsKeys)
            if(!this.updater.isMounted(this)) return
            this.setState({
                columns:columns,
                dataSource:resp.list,
                total:resp.total
            })
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

    onClose = () => {
        this.setState({
          visible: false,
        })
    }

    toPreoutstockAdd = () =>{
        this.props.history.push('/erp/comm/product/preoutstock/add')
    }

    componentDidMount(){
        this.getData()
    }
    render() {
        return (
            <>
                <Spin spinning={this.state.isLoading}>
                    <Card
                        title="预出库记录"
                        bordered={false}
                        extra={
                            <Button onClick={this.toPreoutstockAdd}>新建预出库</Button>
                        }
                    >
                        <Table
                            rowKey={record=>record.id}
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
                <div>
                    <Drawer
                        title="详细信息"
                        placement="right"
                        closable={true}
                        onClose={this.onClose}
                        visible={this.state.visible}
                        width="800px"
                        destroyOnClose={true}
                    >
                        <Descriptions title="Product List" column={1} bordered>
                            {
                                this.state.products.map(item=>{
                                    return(
                                        <Descriptions.Item label={item.sku} key={item.sku}>
                                            {item.amount}
                                        </Descriptions.Item>
                                    )
                                })
                            }
                        </Descriptions>
                    </Drawer>
                </div>
            </>
        )
    }
}
