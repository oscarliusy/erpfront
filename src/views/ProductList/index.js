/**
 * 1.如果需要调整显示项目,主要修改server端的PRODUCTKEYS的顺序
 * 以及下方splice的数量
 */
import React, { Component } from 'react'
import { 
    Card,
    Table,
    Button,
    Input,
    Spin,
    Descriptions,
    Drawer
} from 'antd'
import { getProductList } from '../../requests'

const { Search } = Input

const titleDisplayMap = {
    id:'Id',
    site:'Site',
    sku: 'SKU',
    childAsin:'(Child)ASIN',
    title:'Title',
    image: 'Image',
    description:'Description'
}

export default class ProductList extends Component {
    constructor(){
        super()
        this.state={
            isLoading:false,
            visible:false,
            detail:{},
            detailKeys:[],
            materials:[],
            searchword:'',
            offset:0,
            limited:10,
            columns:[],
            dataSource:[],
            total:0
        }
    }

    onDetailClick = (record) => {
        let _materials = [...record.materials]
        this.setState({
            detail:record,
            materials:_materials
        },()=>{
            this.showDrawer()
        })
    }

    showDrawer = () => {
        const keyArr = Object.keys(this.state.detail)
        keyArr.splice(0,7)
        keyArr.pop()
        this.setState({
            visible: true,
            detailKeys:keyArr
        })
    }
    
    onClose = () => {
        this.setState({
          visible: false,
        })
    }

    getValue = (item) =>{
        const itemKey = Object.values(item)[0]
        if(itemKey==='materials'){
            return
        }
        return this.state.detail[itemKey]
    }

    createColumns = (columnsKeys) =>{
        const columns = columnsKeys.map(item=>{
            if( item === 'image'){
                return {
                    title:titleDisplayMap[item],
                    key:item,
                    render:(text,record)=>{
                        return (
                            <img src={record.image} alt={record.image} style={{width:"60px",height:"60px"}}/>
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
            render:(text,record)=>{
              return (
                <>
                    <Button size="small" type="primary" onClick={this.onDetailClick.bind(this,record)}>详情</Button>
                    <Button size="small" type="link" onClick={this.toEdit.bind(this,record)}>编辑</Button>
                </>
              )
            }
        })
        return columns
    }

    toEdit = (record) =>{
        this.props.history.push(`/erp/comm/product/edit/${record.id}`)
    }
    
    getData = () =>{
        this.setState({isLoading:true})
        getProductList(this.state.searchword,this.state.offset,this.state.limited)
        .then(resp=>{
            //console.log(resp)
            const columnsKeys = Object.keys(resp.list[0]).splice(0,7)
            const colunms = this.createColumns(columnsKeys)
            if(!this.updater.isMounted(this)) return
            this.setState({
                columns:colunms,
                dataSource:resp.list,
                total:resp.total
            })
        })
        .catch(err=>{
            console.log(err)
        })
        .finally(()=>{
            this.setState({isLoading:false})
        })
    }

    onSearch = (value)=>{
        this.setState({
             searchword:value
        },()=>{
            this.getData()
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

    componentDidMount(){
        this.getData()
    }
    render() {
        return (
            <>
                <Spin spinning={this.state.isLoading}>
                    <Card
                        title="产品清单"
                        bordered={false}
                        extra={
                            <Button>导出当前页excel</Button>
                        }
                    >
                        <div style={{width:"600px",padding:"10px"}}>
                            <Search
                                placeholder="输入SKU/childASIN/Title/Description进行搜索"
                                enterButton="Search"
                                size="large"
                                onSearch={value=>{this.onSearch(value)}}                         
                            />
                        </div>
                        <Table
                            rowKey={record=>record.id}
                            dataSource={this.state.dataSource}
                            columns={this.state.columns}
                            size="small"
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
                        <Descriptions title={this.state.detail.sku}  column={2} bordered size="small">
                            {
                                this.state.detailKeys.map(item=>{
                                    return(
                                        <Descriptions.Item label={item} key={item}>
                                            {
                                               this.getValue({item})
                                            }
                                        </Descriptions.Item>
                                    )
                                })
                            }
                        </Descriptions>
                        <Descriptions title="Materials" column={1} bordered>
                            {
                                this.state.materials.map(item=>{
                                    return(
                                        <Descriptions.Item label={item.name} key={item.name}>
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
 