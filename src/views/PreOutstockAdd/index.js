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
import { preoutstockProductSearch, postPreoutstockAdd,calcPreoutstock,getPurchaserList } from '../../requests'
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
    description:'Description',
    site:'Site'
}

//const userList = ['FAN','LICH','BO','OSCAR']

const mapState = (state) =>{
    const { products } = state.preoutstockTable
    return {
        products
    } 
}


@connect(mapState,{ savePreoutstockProductTable,resetPreoutstockProductTable})
@Form.create()
class PreOutstockAdd extends Component {
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
            selectedRowData:[],

            usersList:[],
            preoutstockerList:[],

            pcode:'',
            pdescription:'',
            total_freightfee:0,
            total_weight:0,
            total_volume:0,
        }
    }

    formDataValidator = (values) =>{
        let params = {}
        const { productErr,_products} = this.productsDataValidator()
        if(productErr) return {params,productErr}

        let _userId = this.findUserId(values.user)
        //这里user_id应该使用登录信息,暂时放个假数据
        params={
            pcode:values.pcode,
            pdescription:values.pdescription,
            user_id:_userId,
            total_weight:this.state.total_weight,
            total_volume:this.state.total_volume,
            total_freightfee:this.state.total_freightfee,
            has_out:0,
            products:_products
        }
        return {params,productErr}
    }

    productsDataValidator = () =>{
        let productErr=''
        let _products =  [...this.props.products]
        if(_products.length <= 0) {
            productErr = '无出库产品项'
        }
        _products.forEach(item=>{
            if(item.amount === 0 || !Boolean(Number(item.amount)) || item.sku === 'sku'){
                productErr='出库产品项项填写有误，请检查'  
            }
        })
        let _productsIds = _products.map(item=>{
            return item.id
        })
        let _productsSet = new Set(_productsIds)
        if(_productsSet.size !== _productsIds.length){
            productErr='产品存在重复项'
        }
        return {
            productErr,
            _products
        }
    }

    findUserId = (userName)=>{
        let id = 1
        for(let item of this.state.usersList){
            if(item.name === userName){
                id = item.id
            }
        }
        return id
    }

    calcPreoutstock = async() =>{
        const { productErr,_products} = this.productsDataValidator()
        //console.log(_products)
        if(productErr){
            message.warning(productErr)
        }else{
            let calcRes = await calcPreoutstock({products:_products})
            console.log(calcRes)
            if(calcRes.status === 'succeed'){
                this.setState({
                    total_freightfee:calcRes.indexes.total_freightfee.toFixed(3),
                    total_volume:calcRes.indexes.total_volume.toFixed(3),
                    total_weight:calcRes.indexes.total_weight.toFixed(3)
                })
                message.success(calcRes.msg)
            }else{
                message.warning(calcRes.msg)
            }
        }
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll(async(err, values) => {
            if (!err) {
                const {params,productErr} = this.formDataValidator(values)
                if(productErr){
                    message.error(productErr)
                }else{
                    this.setState({isSpin:true})
                    console.log('submit parms:',params)
                    let addRes = await postPreoutstockAdd(params)   
                    this.setState({isSpin:false})        
                    if(addRes.status === 'succeed'){
                        message.success(addRes.msg)
                        this.props.resetPreoutstockProductTable()
                        this.props.history.push('/erp/comm/product/preoutstock/list')
                    }else if(addRes.status === 'failed'){
                        message.warning(addRes.msg)
                    }else{}
                }
              }else{
                message.error('请检查必填项和出库产品项是否填写正确')
              }
        })
    }

    initData = async() =>{
        this.props.resetPreoutstockProductTable()
        this.initUserList()
    }

    initUserList = async() =>{
        let userRes = await getPurchaserList()
        let _preoutstockerList = userRes.map(item=>{
            return item.name
        })

        this.setState({
            preoutstockerList:_preoutstockerList,//["BO", "FAN", "LICH", "oscar", "R.X", "tester"]
            usersList:userRes//[{id: 2, name: "BO"},{id: 3, name: "FAN"}2: {id: 5, name: "LICH"},{id: 1, name: "oscar"},{id: 4, name: "R.X"},{id: 6, name: "tester"}]
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
            //columnsKeys.splice(0,1)//不在table中显示id
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
                item.id = this.state.selectedRowData[0].id
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

    componentDidMount(){
        this.initData()
    }


    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <>
            <Card
            title='新增预出库'
            bordered={false}
            extra={<Button onClick={this.props.history.goBack}>取消</Button>} 
            >
                <Spin spinning={this.state.isSpin}>
                <Form
                    onSubmit={this.handleSubmit}
                    {...formLayout}
                >
                    <Form.Item  label="Code">
                        {getFieldDecorator('pcode', {
                            rules: [
                                {
                                    required:true,
                                    message:'code是必须填写的'
                                }
                            ],
                            initialValue:this.state.pcode
                            })(
                            <Input />
                        )}                        
                    </Form.Item>
                    <Form.Item  label="Description">
                        {getFieldDecorator('pdescription', {
                            rules: [
                                {
                                    required:true,
                                    message:'descrption是必须填写的'
                                }
                            ],
                            initialValue:this.state.pdescription
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
                            initialValue:this.state.preoutstockerList[0]
                            })(
                            <Select 
                                style={{ width: 200 }} 
                            >
                                {
                                    this.state.preoutstockerList.map(item=>{
                                        return(
                                            <Option value={item} key={item}>{item}</Option>
                                        )
                                    })
                                }
                            </Select>
                        )}                        
                    </Form.Item>
                    <Form.Item
                        label="总运费(￥)"
                    >
                        <span>{this.state.total_freightfee}</span>        
                    </Form.Item>
                    <Form.Item
                        label="总重量(kg)"
                    >
                        <span>{this.state.total_weight}</span>        
                    </Form.Item>
                    <Form.Item
                        label="总重量(m³)"
                    >
                        <span>{this.state.total_volume}</span>        
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
                           提交表单
                        </Button>
                        <Button  type="primary" style = {{marginLeft:"30px"}} onClick={this.calcPreoutstock}>
                           参数计算
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

export default PreOutstockAdd