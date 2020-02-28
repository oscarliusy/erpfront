import React, { Component } from 'react'
import {
    Card,
    Button,
    Form,
    Input,
    Spin,
    message,
    Select,
    Drawer,
    Table,
} from 'antd'
import moment from 'moment'

import { getPreoutstockById,preoutstockProductSearch,postPreoutstockEdit } from '../../requests'
import { connect } from 'react-redux'
import { savePreoutstockProductTable,resetPreoutstockProductTable} from '../../actions/preoutstockTable'
import { PreoutstockEditTable } from '../../components'

const { Search } = Input
const { Option } = Select

const formLayout = {
    labelCol:{
        span:4
    },
    wrapperCol:{
        span:8
    }
}

const titleDisplayMap = {
    id:'id',
    sku:'SKU',
    title: 'Title',
    desc:'Description',
    site:'Site'
}

const userList = ['FAN','LICH','BO','OSCAR']

const mapState = (state) =>{
    const { products } = state.preoutstockTable
    return {
        products
    } 
}

@connect(mapState,{ savePreoutstockProductTable,resetPreoutstockProductTable})
@Form.create()
class PreoutstockEdit extends Component {
    constructor(){
        super()
        this.state = {
            isSpin:false,
            dataSource:{ },
            visible:false,
            isSearchSpin:false,
            searchKeyWord:'',
            offset:0,
            limited:5,
            total:0,
            columns:[],
            searchDataSource:[],
            drawerSubmitDisabled:false,
            selectedSearchRowKey:0,
            selectedRowData:[]
        }
    }

    formDataValidator = (values) =>{
        let productErr=''
        let params = {}
        let _products =  [...this.props.products]
        if(_products.length <= 0) {
            productErr = '无出库产品项'
            return {params,productErr}
        }
        _products.map(item=>{
            if(item.amount === 0 || !Boolean(Number(item.amount)) || item.sku === 'sku'){
                productErr='出库产品项项填写有误，请检查'  
            }
            return item
        })
        if(productErr) return {params,productErr}

        params={
            id:values.id,
            desc:values.desc,
            user:values.user,
            products:_products
        }
        return {params,productErr}
    }


    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const {params,productErr} = this.formDataValidator(values)
                if(productErr){
                    message.error(productErr)
                }else{
                    this.setState({isSpin:true})
                    console.log('submit parms:',params)
                    postPreoutstockEdit(params)          
                    .then(resp=>{
                        message.success(resp.msg)
                        this.props.resetPreoutstockProductTable()
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                    .finally(()=>{
                        this.setState({isSpin:false})      
                        this.props.history.push('/erp/comm/product/preoutstock/list')
                    })
                }
              }else{
                message.error('请检查必填项和出库产品项是否填写正确')
              }
        })
    }

    initData = () =>{
        this.setState({
            isSpin:true
        })
        getPreoutstockById(this.props.location.pathname.split('/').pop())
        .then(resp=>{
            //console.log(resp)
            if(!this.updater.isMounted(this)) return
            this.setState({
                 dataSource:resp
             },()=>{
                const _products = this.state.dataSource.products.map((item,index)=>{
                    item.key = index+1
                    return item
                })
                this.props.savePreoutstockProductTable({
                    products:_products,
                    count:_products.length+1
                })
            })
        })
        .catch(err=>{
            console.log(err)
        })
        .finally(()=>{
            this.setState({
                isSpin:false
            })
        })
    }

    showDrawer = () => {
        this.setState({
          visible: true,
        });
    }

    setSelectedSearchRowKey = (key) =>{
        this.setState({
            selectedSearchRowKey:key
        })
    }

    setDrawerSubmitDisable = () =>{
        this.setState({
            drawerSubmitDisabled:true
        })
    }

    onClose = () => {
        this.setState({
          visible: false,
        })
    }

    onDrawerSearch = ( value ) => {
        this.setState({
            searchKeyWord:value
        },()=>{
            this.getSearchData()
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
        return columns
    }

    getSearchData = () =>{
        this.setState({ isSearchSpin: true})
        const params = {
            keyword:this.state.searchKeyWord,
            offset:this.state.offset,
            limited:this.state.limited
        }

        preoutstockProductSearch(params)
        .then(resp=>{
            const columnsKeys = Object.keys(resp.list[0])
            columnsKeys.splice(0,1)//不在table中显示id
            const colunms = this.createColumns(columnsKeys)
            if(!this.updater.isMounted(this)) return
            this.setState({
                columns:colunms,
                searchDataSource:resp.list,
                total:resp.total
            })
        })
        .catch(err=>{
            console.log(err)
        })
        .finally(()=>{
            this.setState({ isSearchSpin: false})
        })
    }

    onPageChange=(page, pageSize)=>{
        this.setState({
          offset:pageSize*(page - 1),
          limited:pageSize
        },()=>{
          this.getSearchData()
        })
    }

    handleDrawerSubmit = () =>{
        this.setState({
            visible: false
        })
        let _products = [...this.props.products]
        _products =_products.map(item=>{
            if(item.key === this.state.selectedSearchRowKey){
                item.sku = this.state.selectedRowData[0].sku
                item.amount = 1
            }
            return item
        })
        this.props.savePreoutstockProductTable({
            products:_products,
            count:_products.length+1
        })
    }

    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
          if(selectedRows.length !== 1){
              this.setState({
                  drawerSubmitDisabled:true
              })
          }else{
            this.setState({
                selectedRowData:[...selectedRows],
                drawerSubmitDisabled:false
            })
          }
        }
    }

    checkHasOutstock=()=>{
        if(this.state.dataSource.hasOutstock){
            message.warning('已出库，禁止编辑')
            this.props.history.push('/erp/comm/product/preoutstock/list')
        }
    }

    componentDidMount(){
        this.initData()
    }

    componentDidUpdate(){
        this.checkHasOutstock()
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <>
            <Card
            title='编辑预出库信息'
            bordered={false}
            extra={<Button onClick={this.props.history.goBack}>取消</Button>} 
            >
                <Spin spinning={this.state.isSpin}>
                <Form
                    onSubmit={this.handleSubmit}
                    {...formLayout}
                >
                    <Form.Item  label="ID" >
                        {getFieldDecorator('id', {
                            rules: [
                                {
                                    required:true,
                                    message:'ID是不可变更的'
                                }
                            ],
                            initialValue:this.state.dataSource.id
                            })(
                            <Input readOnly="readOnly" />
                        )}                        
                    </Form.Item>
                    <Form.Item  label="Description">
                        {getFieldDecorator('desc', {
                            rules: [
                                {
                                    required:true,
                                    message:'desc是必须填写的'
                                }
                            ],
                            initialValue:this.state.dataSource.desc
                            })(
                            <Input />
                        )}                        
                    </Form.Item>
                    <Form.Item label="用户" >
                        {getFieldDecorator('user', {
                            rules: [
                                {
                                    required:true,
                                    message:'user是必须填写的'
                                }
                            ],
                            initialValue:userList[0]
                            })(
                            <Select 
                                style={{ width: 200 }} 
                            >
                                {
                                    userList.map(item=>{
                                        return(
                                            <Option value={item} key={item}>{item}</Option>
                                        )
                                    })
                                }
                            </Select>
                        )}                        
                    </Form.Item>
                    <Form.Item
                        label="创建（上次修改）时间"
                    >
                        <span>{moment(this.state.dataSource.createAt).format('YYYY-MM-DD HH:mm:ss')}</span>        
                    </Form.Item>
                    <Form.Item
                        label="总运费(￥)"
                    >
                        <span>{this.state.dataSource.cost}</span>        
                    </Form.Item>
                    <Form.Item
                        label="总重量(kg)"
                    >
                        <span>{this.state.dataSource.weight}</span>        
                    </Form.Item>
                    <Form.Item
                        label="总重量(m³)"
                    >
                        <span>{this.state.dataSource.volumn}</span>        
                    </Form.Item>
                    <Form.Item lable="出库清单" wrapperCol={{ offset:4 }}>
                        <PreoutstockEditTable
                            showDrawer={this.showDrawer} 
                            setSelectedSearchRowKey={this.setSelectedSearchRowKey}
                            setDrawerSubmitDisable = {this.setDrawerSubmitDisable}
                        />
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset:4 }}>
                        <Button type="primary" htmlType="submit">
                           提交
                        </Button>
                    </Form.Item>
                </Form>
                </Spin>
            </Card>
            <div>
                <Drawer
                    title="选择出库产品"
                    placement="right"
                    onClose={this.onClose}
                    visible={this.state.visible}
                    width={1200}
                    closable={true}
                    destroyOnClose={true}
                >
                    <Spin spinning={this.state.isSearchSpin}>
                    <div style={{width:"850px",padding:"10px"}}>
                        <Card
                        bordered={false}
                        > 
                            <div style={{width:"800px",padding:"10px"}}>
                                <Search
                                    placeholder="输入SKU或Title进行搜索"
                                    enterButton="Search"
                                    size="large"
                                    onSearch={value=>{this.onDrawerSearch(value)}}                        
                                />
                            </div>
                            <div  style={{width:"800px",padding:"10px",marginBottom:"20px"}}>
                                <Table 
                                    rowKey={record=>record.id}
                                    rowSelection={this.rowSelection} 
                                    columns={this.state.columns} 
                                    dataSource={this.state.searchDataSource} 
                                    pagination={{
                                        total:this.state.total,
                                        onChange : this.onPageChange,
                                        pageSize:5
                                    }}
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
                                <Button 
                                    onClick={this.handleDrawerSubmit} 
                                    type="primary" 
                                    disabled={this.state.drawerSubmitDisabled}
                                >
                                    Submit
                                </Button>
                            </div>
                        </Card>
                    </div>
                    </Spin>
                </Drawer>
            </div>
            </>
        )
    }
}

export default PreoutstockEdit