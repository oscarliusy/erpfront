import React, { Component } from 'react'
import {
    Card,
    Button,
    Form,
    Input,
    Spin,
    message,
    InputNumber,
    Select,
    Upload,
    Icon,
    Drawer,
    Table
} from 'antd'
import axios from 'axios'
import { saveProductConstructTable,resetProductConstructTable } from '../../actions/productTable'
import { connect } from 'react-redux'
import { ProductEditTable } from '../../components'
import { getProductDetailById,instockMaterialSearch,saveProductEdit } from '../../requests'

const { Search } = Input

const formLayout = {
    labelCol:{
        span:4
    },
    wrapperCol:{
        span:8
    }
}
const { Option } = Select
const titleDisplayMap = {
    id:'ID',
    uniqueId:'唯一识别码',
    amount: '库存数量',
    description:'详细信息'
}

const mapState = (state) =>{
    const { materials } = state.productTable
    return {
        materials
    } 
}

@connect(mapState,{ saveProductConstructTable,resetProductConstructTable })
@Form.create()
class ProductEdit extends Component {
    constructor(){
        super()
        this.state = {
            isSpin:false,
            isUploading:false,
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
            siteList:[],
            siteMap:[],
            siteDefault:""

        }
    }

    formDataValidator = (values) =>{
        let productErr=''
        let params = {}
        let _materials =  [...this.props.materials]

        //无物料
        if(_materials.length <= 0) {
            productErr = '无物料项'
            return {params,productErr}
        }
        //填写错误
        _materials.map(item=>{
            if(item.amount === 0 || !Boolean(Number(item.amount)) || item.uniqueId === 'uniqueId'){
                productErr='物料项填写有误，请检查'  
            }
            return item
        })
        //物料查重
        let _materialIds = _materials.map(item=>{
            return item.id
        })
        let _materialSet = new Set(_materialIds)
        if(_materialSet.size !== _materialIds.length){
            productErr='物料项存在重复项'
        }

        if(productErr) return {params,productErr}

        let _site_id = 1
        this.state.siteMap.forEach(item=>{
            if(item.name === values.site){
                _site_id = item.id
            }
        })

        params={
            id:values.id,
            site_id:_site_id,
            sku:values.sku,
            childAsin:values.childAsin,
            title:values.title,
            purchasePrice:values.purchasePrice,
            freightFee:values.freightFee,
            amazonSalePrice:values.amazonSalePrice,
            image:this.state.dataSource.image,
            materials:_materials
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
                    saveProductEdit(params)          
                    .then(resp=>{
                        message.success(resp.msg)
                        this.props.resetProductConstructTable()
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                    .finally(()=>{
                        this.setState({isSpin:false})      
                        this.props.history.push('/erp/comm/product/list')
                    })
                }
              }else{
                message.error('请检查必填项和物料项是否填写正确')
              }
        })
    }

    initData = () =>{
        this.setState({
            isSpin:true
        })
        getProductDetailById(this.props.location.pathname.split('/').pop())
        .then(resp=>{
            if(!this.updater.isMounted(this)) return
            this.setState({
                dataSource:resp.detail
            },()=>{
                const _materials = this.state.dataSource.materials.map((item,index)=>{
                    item.key = index+1
                    return item
                })
                this.props.saveProductConstructTable({
                    materials:_materials,
                    count:_materials.length+1
                })
                this.siteInfoInit()
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

    siteInfoInit = ()=>{
        let _siteList = this.state.dataSource.siteMap.map(item=>{
            return item.name
        })
        let _siteDefault
        this.state.dataSource.siteMap.forEach(item=>{
            if(item.id === this.state.dataSource.site_id){
                _siteDefault = item.name
            }
        })
        this.setState({
            siteList:_siteList,
            siteMap:this.state.dataSource.siteMap,
            siteDefault:_siteDefault
        })
    }

    handleUploadImage = ({file}) =>{
        const data = new FormData()
        data.append('Token','8fe17a2751e28f842c1ca5b304717968c7e60a71:NL0_25owASxQHc5mLS4QyxSRReU=:eyJkZWFkbGluZSI6MTU4MTkwOTg2MiwiYWN0aW9uIjoiZ2V0IiwidWlkIjoiNzA5ODUwIiwiYWlkIjoiMTY2NDE1MCIsImZyb20iOiJmaWxlIn0=')
        data.append('file',file)
        this.setState({
            isUploading:true
        })
        axios.post("http://up.imgapi.com/",data)
        .then(resp=>{
            
            if(resp.status === 200){
                //无法通过setState修改对象的属性，必须整体赋值
                let _dataSource = Object.assign({},this.state.dataSource)
                _dataSource.image = resp.data.linkurl
                this.setState({
                    dataSource: _dataSource
                })
            }else{
                //处理其他问题
            }
        })
        .catch(err=>{
            //处理错误
        })
        .finally(()=>{ 
            this.setState({
                isUploading:false
            })
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
        instockMaterialSearch(params)
        .then(resp=>{
            const columnsKeys = Object.keys(resp.list[0])
            //columnsKeys.splice(0,1)//不在table中显示id
            const colunms = this.createColumns(columnsKeys)
            if(!this.updater.isMounted(this)) return
            this.setState({
                columns:colunms,
                searchDataSource:resp.list,
                total:resp.totalInventory
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
        let _materials = [...this.props.materials]
        //console.log('drawer materials',this.state.selectedRowData[0])
        
        _materials =_materials.map(item=>{
            if(item.key === this.state.selectedSearchRowKey){
                item.uniqueId = this.state.selectedRowData[0].uniqueId
                item.amount = 1
                item.id = this.state.selectedRowData[0].id
            }
            return item
        })
        this.props.saveProductConstructTable({
            materials:_materials,
            count:_materials.length+1
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
            title='编辑产品信息'
            bordered={false}
            extra={<Button onClick={this.props.history.goBack}>取消</Button>} 
            >
                <Spin spinning={this.state.isSpin}>
                <Form
                    onSubmit={this.handleSubmit}
                    {...formLayout}
                >
                    <Form.Item
                        label="ID"
                    >
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
                    <Form.Item
                        label="Site"
                        >
                        {getFieldDecorator('site', {
                            rules: [
                                {
                                    required:true,
                                    message:'站点是必须填写的'
                                }
                            ],
                            initialValue:this.state.siteDefault
                            })(
                                <Select 
                                style={{ width: 200 }} 
                            >
                                {
                                    this.state.siteList.map(item=>{
                                        return(
                                            <Option value={item} key={item}>{item}</Option>
                                        )
                                    })
                                }
                            </Select>
                        )} 
                    </Form.Item>
                    <Form.Item
                        label="SKU"
                    >
                        {getFieldDecorator('sku', {
                            rules: [
                                {
                                    required:true,
                                    message:'sku是必须填写的'
                                }
                            ],
                            initialValue:this.state.dataSource.sku
                            })(
                            <Input />
                        )}                        
                    </Form.Item>
                    <Form.Item
                        label="(Child)ASIN"
                    >
                        {getFieldDecorator('childAsin', {
                            rules: [
                                {
                                    required:true,
                                    message:'childAsin是必须填写的'
                                }
                            ],
                            initialValue:this.state.dataSource.childAsin
                            })(
                            <Input />
                        )}                        
                    </Form.Item>
                    <Form.Item
                        label="Title"
                    >
                        {getFieldDecorator('title', {
                            rules: [
                                {
                                    required:true,
                                    message:'title是必须填写的'
                                }
                            ],
                            initialValue:this.state.dataSource.title
                            })(
                            <Input />
                        )}                        
                    </Form.Item>
                    <Form.Item
                        label="Purchase Price(￥)"
                    >
                        {getFieldDecorator('purchasePrice', {
                            rules: [
                                {
                                    required:true,
                                    message:'purchasePrice是必须填写的，默认为0'
                                }
                            ],
                            initialValue:this.state.dataSource.purchasePrice
                            })(
                            <InputNumber min={0} step={0.01} />
                        )}                        
                    </Form.Item>
                    <Form.Item
                        label="Freight Fee(￥)"
                    >
                        {getFieldDecorator('freightFee', {
                            rules: [
                                {
                                    required:true,
                                    message:'freightFee是必须填写的，默认为0'
                                }
                            ],
                            initialValue:this.state.dataSource.freightFee
                            })(
                            <InputNumber min={0} step={0.01}/>
                        )}                        
                    </Form.Item>
                    <Form.Item
                        label="Amazon Sale Price($)"
                    >
                        {getFieldDecorator('amazonSalePrice', {
                            rules: [
                                {
                                    required:true,
                                    message:'amazonSalePrice是必须填写的，默认为0'
                                }
                            ],
                            initialValue:this.state.dataSource.amazonSalePrice
                            })(
                            <InputNumber min={0} step={0.01}/>
                        )}                        
                    </Form.Item>
                    <Form.Item label="上传图片" >                
                            <Upload  
                                showUploadList={false}
                                customRequest={this.handleUploadImage}
                            >
                                <Spin spinning={this.state.isUploading}>
                                    <div>
                                        <Button>
                                            <Icon type="upload" /> Click to upload
                                        </Button>
                                    </div>
                                    <div>
                                        <img 
                                            style={{width:"150px",height:"150px",margin:"10px"}} 
                                            src={this.state.dataSource.image} 
                                            alt={this.state.dataSource.image}
                                        /> 
                                    </div>
                                </Spin>
                            </Upload>
                    </Form.Item>
                    <Form.Item lable="物料组成" wrapperCol={{ offset:4 }}>
                        <ProductEditTable 
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
                    title="选择物料"
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
                                    placeholder="输入唯一识别码或详细信息进行搜索"
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

export default ProductEdit