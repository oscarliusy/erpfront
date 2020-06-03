/**
 * 页面分成两个区域  顶部增加一个批量入库按钮
 * 上半部分与零星入库一致
 * 下面是数据预览,自动根据excel的column生成列
 * 根据数据的行数可以分页预览
 * 
 * 向后端发送数据时,需要对所有数据进行校验.
 * 已存在的增加数量
 * 不存在的先新增,再增加数量
 */

import React, { Component } from 'react'
import { 
    Card,
    Table,
    Button,
    Input,
    Spin,
    Form,
    Select,
    DatePicker,
    message,
    Upload
} from 'antd'
import xlsx from 'xlsx'
import './instockupload.less'
import {readFile} from '../../assets/lib/utils'
import { INSTOCK_KEYS } from '../../assets/lib/model-constant'
import { getPurchaserList,instockMaterialPost } from '../../requests'

const { Option } = Select

const formLayout = {
labelCol:{
    span:4
},
wrapperCol:{
    span:16
}
}

@Form.create()
class InstockUpload extends Component {
    constructor(){
        super()
        this.state={ 
            instockerList:[],
            usersList:[],

            fileList: [],
            dataSource:[],
            columns:[],
            sheetName:"",
            excelOriginalData:[],
            submitInstockList:[],

            isUploadExcelSpin:false,
            isSubmitSpin:false,
            isInitSpin:false
        }
    }
    /**
     * 1.拿到上传的xlsx文件
     * 2.构造table的数据源
     * 3.构造上传后台的数据源.
     */
    handleUpload = async(file)=>{
        if(!file || !file.name) return

        this.setState({
            isUploadExcelSpin:true
        })
        //读取excel数据,变为json格式
        let data = await readFile(file)
        let workbook = xlsx.read(data,{type:'binary'})     
        let worksheet = workbook.Sheets[workbook.SheetNames[0]]//取出第一个表中的数据
        data = xlsx.utils.sheet_to_json(worksheet) //使用内置工具转化为json
        this.setState({
            sheetName:workbook.SheetNames[0],
            excelOriginalData:data
        })
        //构造呈现的data和向后端传递的data
        this.buildTableData(data) 
        this.buildSubmitInstockList(data)
    }

    buildTableData = () =>{
        if(this.state.sheetName !== 'instock'){
            message.warning('未使用入库模板,请检查')
            this.initTableData()
            this.setState({
                isUploadExcelSpin:false
            })
            return
        }
        let _columns = []
        let _dataSource = []
        
        const keys = Object.keys(this.state.excelOriginalData[0])
        _columns = keys.map(item=>{
            //修改入库数量功能,暂时关闭
            // if(item === '入库数量'){
            //     return {
            //         title:item,
            //         key:item,
            //         render:(text,record)=>{
            //             return (
            //                 <Input placeholder={record["入库数量"]}/>
            //             )
            //         }
            //     }
            // }
            return {
                title:item,
                dataIndex:item,
                key:item
            }
        })
        _columns.unshift({
            title:"",
            dataIndex:"key",
            key:"key"
        })
        _dataSource = this.state.excelOriginalData.map((item,index)=>{
            let _item = Object.assign({key:index+1},item)
            return _item
        })
        this.setState({
            dataSource:_dataSource,
            columns:_columns,
            isUploadExcelSpin:false
        })
    }

    buildSubmitInstockList = () =>{
        let arr = [] 
        this.state.excelOriginalData.forEach(item=>{
            let obj = {}
            for(let key in INSTOCK_KEYS){
                if(!INSTOCK_KEYS.hasOwnProperty(key)) break
                let keyConfig = INSTOCK_KEYS[key],
                    text = keyConfig.text,
                    type = keyConfig.type
                let value = item[text] || ""
                value = this.typeTransform(value,type)
                obj[key] = value
            }
            arr.push(obj)
        })
        this.setState({
            submitInstockList:arr,
            isUploadExcelSpin:false
        })
        //console.log('arr',arr)
    }

    typeTransform = (value,type)=>{
        switch(type){
            case "string":
                return String(value)
            case "number":
                return Number(value)
            case "float":
                return parseFloat(value)
            default:
                message.warning('检测到不明数据类型')
                return ""
        }
    }

    initTableData = () =>{
        this.setState({
            dataSource:[],
            columns:[],
            sheetName:"",
            excelOriginalData:[],
            fileList: []
        })
    }

    initData = () =>{
        this.setState({
            isInitSpin:true
        })
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
        .finally(()=>{
            this.setState({
                isInitSpin:false
            })
        })
    }

    componentDidMount(){
        this.initData()
    }

    handleSubmit = e =>{
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const {params,instockErr} = this.formDataValidator(values)
                if(instockErr){
                    message.error(instockErr)
                }else{
                    //console.log('params',params)
                    this.setState({isSubmitSpin:true})
                    instockMaterialPost(params)          
                    .then(resp=>{
                        message.success(resp.msg)
                        this.props.history.push('/erp/comm/material/list')
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

    formDataValidator = (values) =>{
        let instockErr=''
        let params = {}
        instockErr = this.excelDataValidator()
        
        if(instockErr) return {params,instockErr}

        let _userId = this.findUserId(values.instocker)
        params={
            code:values.instockCode,
            description:values.instockDesc,
            createAt:values.instockAt.format("x"),
            userId:_userId,
            data:{
                dataSource:this.state.submitInstockList
            }
        }
        return {params,instockErr}
    }

    excelDataValidator = () =>{
        let instockErr = ''
        if(!this.state.submitInstockList.length){
            instockErr = '未添加入库EXCEL文件'
            return instockErr
        }

        this.state.submitInstockList.forEach(item=>{
            if(item.instockAmount === 0 || !Boolean(Number(item.instockAmount))){
                instockErr='入库项数量有误，请检查'  
            }
        })

        let _materialUniqueIds = this.state.submitInstockList.map(item=>{
            return item.uniqueId
        })
        let _materialSet = new Set(_materialUniqueIds)
        if(_materialSet.size !== _materialUniqueIds.length){
            instockErr='入库物料中存在重复项'
        }
        return instockErr
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

    render() {
        const { getFieldDecorator } = this.props.form
        const {fileList } = this.state
        const props = {
            onRemove: file => {
                this.setState(state => {
                    const index = state.fileList.indexOf(file);
                    const newFileList = state.fileList.slice();
                    newFileList.splice(index, 1);
                    this.initTableData()
                    return {
                    fileList: newFileList,
                    }
                })
            },
            beforeUpload: file => {
                this.handleUpload(file)
                this.setState(state => ({
                    fileList: [...state.fileList, file]
                  }))
                return false
            },
            fileList,
            accept:".xlsx,xls"
        }
        return (
            <div>
            <Spin spinning={this.state.isInitSpin}>
              <Card
                    title={<span>批量入库</span>}
                    bordered={false}
                    extra={
                        <Button type="primary" onClick={this.handleSubmit}>提交表单</Button>
                    }
                >
                    <Spin spinning={this.state.isSubmitSpin}>
                    <Form {...formLayout} className='form'>
                        <div className ='form-item-wrap'>
                            <Form.Item
                                label="入库编号"
                                className="form-item"
                            >
                                {getFieldDecorator('instockCode', {
                                    rules: [
                                        {
                                            required:true,
                                            message:'入库编号是必须填写的'
                                        }
                                    ],
                                    })(
                                    <Input placeholder="InstockCode"/>
                                )}                        
                            </Form.Item>
                            <Form.Item
                                label="入库信息"
                                className="form-item"
                            >
                                {getFieldDecorator('instockDesc', {
                                    rules: [
                                        {
                                            required:true,
                                            message:'入库信息是必须填写的'
                                        }
                                    ],
                                    })(
                                    <Input placeholder="InstockDescription"/>
                                )}                        
                            </Form.Item> 
                        </div>
                        <div className ='form-item-wrap'>
                            <Form.Item
                                label="入库时间"
                                className="form-item"
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
                                className="form-item"
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
                        </div>     
                    </Form>
                    <div className="excel-btn">
                        <Upload {...props}>
                            <Button type="primary" disabled={this.state.fileList.length}>
                               点击选择入库EXCEL文件
                            </Button>
                        </Upload>
                    </div>
                    </Spin>
                    <Spin spinning={this.state.isUploadExcelSpin}>
                        <Table
                            className="table"
                            rowKey={record=>record.key}
                            dataSource={this.state.dataSource}
                            columns={this.state.columns}
                            pagination={{
                                total:this.state.dataSource.length,
                                showQuickJumper:true,
                            }}
                        />
                    </Spin>
                </Card>
                </Spin>
            </div>
        )
    }
}
export default InstockUpload