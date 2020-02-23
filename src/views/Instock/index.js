import React, { Component } from 'react'
import { 
    Drawer,
    Button,
    Card,
    Form,
    Input,
    Select,
    Table,
    DatePicker
 } from 'antd'
 
import { EditableTable } from '../../components'
import { connect } from 'react-redux'
import { saveInstockRowModify } from '../../actions/instockTable'


const { Search } = Input
const { Option } = Select
const instockerList = ['FAN','LICH','BO','OSCAR']
 
const formLayout = {
    labelCol:{
        span:4
    },
    wrapperCol:{
        span:16
    }
}

const columnsD = [
    {
      title: '唯一识别码',
      dataIndex: 'uniqueId',
      render: text => <span>{text}</span>,
    },
    {
      title: '库存数量',
      dataIndex: 'amount',
    },
    {
      title: '详细信息',
      dataIndex: 'desc',
    },
  ];
  const dataD = [
    {
      key: '1',
      uniqueId: 'Snow walker',
      amount: 32,
      desc: '雪地爬犁',
    },
    {
      key: '2',
      uniqueId: 'Bycicle Shadow',
      amount: 12,
      desc: '自行车挡板',
    },
    {
      key: '3',
      uniqueId: 'Fishing dish',
      amount: 0,
      desc: '钓鱼玩具',
    },
    {
      key: '4',
      uniqueId: 'Gun bag',
      amount: 22,
      desc: '枪袋',
    },
  ];

const mapState = state =>{
    const {
        dataSource,
        count
    } = state.instockTable

    return {
        dataSource,
        count
    }
} 
  
@connect(mapState,{saveInstockRowModify})  
@Form.create()
class Instock extends Component {
    constructor(){
        super()
        this.state={ 
            visible: false,
            selectedRowData:[],
            selectedSearchRowKey:0
        }
    }


    showDrawer = () => {
      this.setState({
        visible: true,
      });
    };
  
    onClose = () => {
      this.setState({
        visible: false,
      });
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values)
          }
        })
    }
    handleSelectPurchaserChange = (value) =>{
        console.log(`selected ${value}`)
        // this.setState({
        //     purchaser:value
        // })
    }

    onDrawerSearch = ( value ) => {
        console.log('drawer Search:',value)
    }

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          //console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
          this.setState({
              selectedRowData:[...selectedRows]
          })
        },
        getCheckboxProps: record => ({
          disabled: record.name === 'Disabled User', // Column configuration not to be checked
          name: record.name,
        }),
    }

    setSelectedSearchRowKey = (key) =>{
        this.setState({
            selectedSearchRowKey:key
        })
    }

    handleDrawerSubmit = () =>{
        this.setState({
            visible: false
        })
        let _dataSource = [...this.props.dataSource]
        _dataSource =_dataSource.map(item=>{
            if(item.key === this.state.selectedSearchRowKey){
                item.uniqueId = this.state.selectedRowData[0].uniqueId
                item.amount = this.state.selectedRowData[0].amount
                item.desc = this.state.selectedRowData[0].desc
            }
            return item
        })
        this.props.saveInstockRowModify(_dataSource)
    }
    componentDidMount(){
        
    }
    componentDidUpdate(){

    }
    render() {
      const { getFieldDecorator } = this.props.form
      return (
        <>
            <Card
                title='入库'
                bordered={false}
                extra={<Button onClick={this.props.history.goBack}>取消</Button>} 
            >
               <Form
                    onSubmit={this.handleSubmit}
                    {...formLayout}
                >
                <Form.Item
                        label="入库编号"
                    >
                    {getFieldDecorator('instockCode', {
                        rules: [
                            {
                                required:true,
                                message:'instockCode是必须填写的'
                            }
                        ],
                        })(
                        <Input placeholder="InstockCode"/>
                    )}                        
                </Form.Item>
                <Form.Item
                        label="入库信息"
                    >
                    {getFieldDecorator('instockDesc', {
                        rules: [
                            {
                                required:true,
                                message:'instockDesc是必须填写的'
                            }
                        ],
                        })(
                        <Input placeholder="InstockDescription"/>
                    )}                        
                </Form.Item>
                <Form.Item
                    label="入库时间"
                >
                    {getFieldDecorator('instockAt', {
                            rules: [
                                {
                                    required:true,
                                    message:'入库时间是必须的'
                                }
                            ],
                    })(
                        <DatePicker showTime placeholder="选择时间"  />
                    )}
                </Form.Item>
                <Form.Item
                    label="入库人"
                >
                    {getFieldDecorator('instocker', {
                        rules: [
                            {
                                required:true,
                                message:'入库人是必须填写的'
                            }
                        ],
                        initialValue:instockerList[0]
                        })(
                            <Select 
                            style={{ width: 200 }} 
                            onChange={this.handleSelectPurchaserChange}
                        >
                            {
                                instockerList.map(item=>{
                                    return(
                                        <Option value={item} key={item}>{item}</Option>
                                    )
                                })
                            }
                        </Select>
                    )} 
                </Form.Item>
                <Form.Item
                    label="添加入库项"
                >
                    <EditableTable 
                        showDrawer={this.showDrawer} 
                        setSelectedSearchRowKey={this.setSelectedSearchRowKey}
                    />
                </Form.Item>
                </Form> 
            </Card>
            <div>
            <Button type="primary" onClick={this.showDrawer}>
                Open
            </Button>
            <Drawer
                title="选择出库项"
                placement="right"
                onClose={this.onClose}
                visible={this.state.visible}
                width={800}
                closable={true}
                destroyOnClose={true}
            >
                <div style={{width:"400px",padding:"10px"}}>
                    <Card
                     bordered={false}
                    > 
                        <div style={{width:"600px",padding:"10px"}}>
                            <Search
                                placeholder="输入唯一识别码或详细信息进行搜索"
                                enterButton="Search"
                                size="large"
                                onSearch={value=>{this.onDrawerSearch(value)}}                        
                            />
                        </div>
                        <div  style={{width:"600px",padding:"10px"}}>
                            <Table 
                                rowSelection={this.rowSelection} 
                                columns={columnsD} 
                                dataSource={dataD} 
                            />
                        </div>
                        <div
                            style={{
                            position: 'absolute',
                            left: 0,
                            bottom: 0,
                            width: '100%',
                            borderTop: '1px solid #e9e9e9',
                            padding: '10px 16px',
                            background: '#fff',
                            textAlign: 'right',
                            }}
                        >
                            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
                                Cancel
                            </Button>
                            <Button onClick={this.handleDrawerSubmit} type="primary">
                                Submit
                            </Button>
                        </div>
                    </Card>
                </div>
            </Drawer>
            </div>`
        </>
      );
    }
}

export default Instock