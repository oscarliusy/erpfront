import React, { Component } from 'react'
import { 
    Card,
    Table,
    Button,
    Input,
    Spin,
    Descriptions,
    Drawer,
} from 'antd'
const { Search } = Input



const dataSource = [
    {
        key:'1',
        id:'1',
        site:'LKSUS',
        sku:'zixingchebali-110mm',
        childAsin:'B07N8VCK2T',
        title:'Linkin Sport 0-60 Degre Adjustable Bicycle Stem Aluminum Alloy Mountain Bike Stem (31.8mm x 110mm)',
        image:'http://dummyimage.com/60x60',
        purchasePrice:8.89,
        dhlShippingFee:0.00,
        freightFee:10.00,
        packageFee:1.00,
        opFee:6.00,
        currency:6.50,
        fbaFullfillmentFee:3.28,
        shrinkage:0.97,
        adCost:1.00,
        amazonReferralFee:'15%',
        payoneerServiceFee:'1.2%',
        amazonSalePrice:18.99,
        margin:44.078,
        materials:[
            {
                name:'huabanbao-hei-201800024',
                amount:1
            },
            {
                name:'bag-xl',
                amount:2
            }
        ]
    },
    {
        key:'2',
        id:'2',
        site:'LKSUS',
        sku:'huabanbao-hei x 1',
        childAsin:'B07LBWBKK7',
        title:'Linkin Sport 32" x 8" Skateboard Carry Bag with Mesh Pouch and Adjustable Shoulder Straps (Black x 1)',
        image:'http://dummyimage.com/60x60',
        purchasePrice:10.89,
        dhlShippingFee:0.00,
        freightFee:10.00,
        packageFee:1.00,
        opFee:6.00,
        currency:6.50,
        fbaFullfillmentFee:4.28,
        shrinkage:1.41,
        adCost:1.00,
        amazonReferralFee:'15%',
        payoneerServiceFee:'1.2%',
        amazonSalePrice:11.99,
        margin:5.42,
        materials:[
            {
                name:'ZHeDieYi-Lan-201900119',
                amount:3
            },
            {
                name:'bag-s',
                amount:1
            }
        ]
    },
]

export default class ProductList extends Component {
    constructor(){
        super()
        this.state={
            isLoading:false,
            visible:false,
            detail:{},
            detailKeys:[],
            materials:[]
        }
        this.columns = [
            {
                title:'Id',
                dataIndex:'id',
                key:'id'  
            },
            {
                title:'Site',
                dataIndex:'site',
                key:'site'  
            },
            {
                title:'SKU',
                dataIndex:'sku',
                key:'sku'  
            },
            {
                title:'(Child)ASIN',
                dataIndex:'childAsin',
                key:'childAsin'  
            },
            {
                title:'Title',
                dataIndex:'title',
                key:'title',
                width: 400  
            },
            {
                title:'Image',
                dataIndex:'image',
                render:(text,record)=>{
                    return(
                        <img src={record.image} alt={record.image} style={{width:"60px",height:"60px"}}/>
                    )
                }
            },
            {
                title:'Action',
                dataIndex:'action',
                render:(text,record)=>{
                    return (
                        <>
                            <Button size="small" type="primary" onClick={this.onDetailClick.bind(this,record)}>详情</Button>
                            <Button size="small" type="link" >编辑</Button>
                        </>
                    )
                }
            }
        ]
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
                            />
                        </div>
                        <Table
                            rowKey={record=>record.id}
                            dataSource={dataSource}
                            columns={this.columns}
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
                        <Descriptions title={this.state.detail.sku}  column={2} bordered>
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
