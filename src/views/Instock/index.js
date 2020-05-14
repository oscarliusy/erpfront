import React, { Component } from 'react'
import { 
    Drawer,
    Button,
    Card,
    Form,
    Input,
    Select,
    Table,
    DatePicker,
    message,
    Spin
 } from 'antd'
 
import { EditableTable } from '../../components'
import { connect } from 'react-redux'
import { saveInstockRowModify } from '../../actions/instockTable'
import { getPurchaserList,instockMaterialSearch,instockMaterialPost } from '../../requests'
//import moment from 'moment'


const { Search } = Input
const { Option } = Select
//const instockerList = ['FAN','LICH','BO','OSCAR']
 
const formLayout = {
    labelCol:{
        span:4
    },
    wrapperCol:{
        span:20
    }
}

const titleDisplayMap = {
    uniqueId:'唯一识别码',
    amount: '库存数量',
    description:'详细信息',
    id:'ID'
}

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
            selectedSearchRowKey:0,
            offset:0,
            limited:5,
            total:0,
            searchKeyWord:'',
            drawerSubmitDisabled:true,
            columns:[],
            dataSource:[],
            instockSubmitDisabled:false,
            isSearchSpin:false,
            isSubmitSpin:false,
            instockerList:[],
            usersList:[]
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

    formDataValidator = (values) =>{
        let instockErr=''
        let params = {}
        let _dataSource =  [...this.props.dataSource]
        let _count = this.props.count
        if(_dataSource.length <= 0) {
            instockErr = '无入库项'
            return {params,instockErr}
        }
        _dataSource.map(item=>{
            if(item.instockAmount === 0 || !Boolean(Number(item.instockAmount)) || item.uniqueId === 'uniqueId'){
                instockErr='入库项填写有误，请检查'  
            }
            return item
        })
        if(instockErr) return {params,instockErr}

        let _dataSourceSubmit = _dataSource.map(item=>{
            return {
                uniqueId:item.uniqueId,
                instockAmount:parseInt(item.instockAmount)
            }
        })

        let _userId = this.findUserId(values.instocker)
        params={
            code:values.instockCode,
            description:values.instockDesc,
            createAt:values.instockAt.format("x"),
            userId:_userId,
            data:{
                dataSource:_dataSourceSubmit,
                count:_count
            }
        }
        return {params,instockErr}
    }

    findUserId = (userName)=>{
        let id = 0
        for(let item of this.state.usersList){
            if(item.name === userName){
                id = item.id
            }
        }
        return id
    }
    handleSubmit = e => {  
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            const {params,instockErr} = this.formDataValidator(values)
            if(instockErr){
                message.error(instockErr)
            }else{
                this.setState({isSubmitSpin:true})
                //console.log('submit parms:',params)
                instockMaterialPost(params)          
                .then(resp=>{
                    message.success(resp.msg)
                    //this.props.history.push('/erp/comm/material/list')
                })
                .catch(err=>{
                    console.log(err)
                })
                .finally(()=>{
                    this.setState({isSubmitSpin:false})
                })
            }
          }else{
            message.error('请检查必填项和入库项是否填写正确')
          }
        })
    }

    //已被Form自动管理，无需再设置
    handleSelectPurchaserChange = (value) =>{
        console.log(`selected ${value}`)
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
                item.description = this.state.selectedRowData[0].description
            }
            return item
        })
        this.props.saveInstockRowModify(_dataSource)
    }

    setDrawerSubmitDisable = () =>{
        this.setState({
            drawerSubmitDisabled:true
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
            columnsKeys.splice(0,1)//不在table中显示id
            const colunms = this.createColumns(columnsKeys)
            if(!this.updater.isMounted(this)) return
            this.setState({
                columns:colunms,
                dataSource:resp.list,
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


    componentDidMount(){
        this.initData()
        
    }

    initData = () =>{
        getPurchaserList()
        .then(resp=>{
            let _instockerList = resp.map(item=>{
                return item.name
            })
            this.setState({
                instockerList:_instockerList,
                usersList:resp
            })
        })
        .catch(err=>{
            console.log(err)
        })
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
            <Spin spinning={this.state.isSubmitSpin}>
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
                        initialValue:this.state.instockerList[0]
                        })(
                            <Select 
                            style={{ width: 200 }} 
                        >
                            {
                                this.state.instockerList.map(item=>{
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
                        setDrawerSubmitDisable = {this.setDrawerSubmitDisable}
                    />
                </Form.Item>
                <Form.Item wrapperCol={{ offset:4 }}>
                        <Button type="primary" htmlType="submit" disabled={this.state.instockSubmitDisabled}>
                           提交
                        </Button>
                </Form.Item>
                </Form> 
                </Spin>
            </Card>
            <div>
            <Drawer
                title="选择出库项"
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
                                dataSource={this.state.dataSource} 
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

export default Instock