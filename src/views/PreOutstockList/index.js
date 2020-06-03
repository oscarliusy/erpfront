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

import { getPreoutstockList,copyPreoutstockById,preToOutstockById } from '../../requests'

const titleDisplayMap = {
    id:'Id',
    pcode:'Code',
    ptime: '创建/修改时间',
    pdescription:'详细信息',
    user:'用户',
    total_weight: '总重量(kg)',
    total_volume:'总体积(m³)',
    total_freightfee:'总运费(¥)'
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

    /**
     * 1.拿到record.id
     * 2.request.copyPreoutstock()发送复制请求
     * 3.后台返回status:succeed || failed
     *  3.1 成功: 重新请求list
     *  3.2 失败: msg.warning
     */
    onCopyClick = async(record) => {
        let resCopy = await copyPreoutstockById(record.id)
        console.log(resCopy)
        
        if(resCopy.status === 'failed'){
            message.warning(resCopy.msg)
        }else if(resCopy.status === 'succeed'){
            this.getData()
            message.success(resCopy.msg)
        }
    }
    toEdit = (record) =>{
        this.props.history.push(`/erp/comm/product/preoutstock/edit/${record.id}`)
    }

    /**
     * 1.向后端发送预出库id
     * 2.拿到返回值后
     *   failed: 发出警告.
     *   succeed:重新请求数据.
     */
    toOutstock = async(record) =>{
        let outRes = await preToOutstockById(record.id)
        if(outRes.status === 'failed'){
            message.warning(outRes.msg)
        }else if(outRes.status === 'succeed'){
            message.success(outRes.msg)
            this.getData()
        }else{

        }
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
                    <Button 
                        size="small" 
                        onClick={this.onCopyClick.bind(this,record)}
                        style = {{marginRight:"10px"}} 
                    >
                        复制
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
                    {
                        record.has_out 
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
        this.setState({
            isLoading:true
        })
        getPreoutstockList(this.state.offset,this.state.limited)
        .then(resp=>{
            const columnsKeys = Object.keys(resp.list[0])
            columnsKeys.splice(columnsKeys.length-2,2)//这里要把product,has_out去除，具体根据服务器决定如何处理。
            const columns = this.createColumns(columnsKeys)
            if(!this.updater.isMounted(this)) return
            this.setState({
                columns:columns,
                dataSource:resp.list,
                total:resp.total
            })
        })
        .catch(err=>{
            console.log(err)
        })
        .finally(()=>{
            this.setState({
                isLoading:false
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
