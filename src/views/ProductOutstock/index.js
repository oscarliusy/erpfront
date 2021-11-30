/**
 * 页面逻辑与批量入库类似
 * 逻辑处理略有不同
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
import { readFile } from '../../assets/lib/utils'
import { OUTSTOCK_KEYS } from '../../assets/lib/model-constant'
import { getPurchaserList, postOutstockUpload } from '../../requests'
import './outstockupload.less'

const { Option } = Select
const columns = ["站点","sku","出库数量"]


const formLayout = {
    labelCol: {
        span: 4
    },
    wrapperCol: {
        span: 16
    }
}
@Form.create()
class ProductOutstock extends Component {
    constructor() {
        super()
        this.state = {
            outstockerList: [],
            usersList: [],

            fileList: [],
            dataSource: [],
            columns: [],
            sheetName: "",
            excelOriginalData: [],
            submitOutstockList: [],

            isUploadExcelSpin: false,
            isSubmitSpin: false,
            isInitSpin: false
        }
    }

    initTableData = () => {
        this.setState({
            dataSource: [],
            columns: [],
            sheetName: "",
            excelOriginalData: [],
            fileList: []
        })
    }

    initData = () => {
        this.setState({
            isInitSpin: true
        })
        getPurchaserList()
            .then(resp => {
                let _outstockerList = resp.map(item => {
                    return item.name
                })
                this.setState({
                    outstockerList: _outstockerList,
                    usersList: resp
                })
            })
            .catch(err => {
                console.log(err)
            })
            .finally(() => {
                this.setState({
                    isInitSpin: false
                })
            })
    }

    handleUpload = async (file) => {
        if (!file || !file.name) return
        this.setState({
            isUploadExcelSpin: true
        })
        //读取excel数据,变为json格式
        let data = await readFile(file)
        let workbook = xlsx.read(data, { type: 'binary' })
        let worksheet = workbook.Sheets[workbook.SheetNames[0]]//取出第一个表中的数据
        data = xlsx.utils.sheet_to_json(worksheet) //使用内置工具转化为json
        this.setState({
            sheetName: workbook.SheetNames[0],
            excelOriginalData: data
        })
        this.buildTableData()
        this.buildSubmitOutstockList()

    }

    buildTableData = () => {
        if (this.state.sheetName !== 'outstock') {
            message.warning('未使用出库模板,请检查')
            this.initTableData()
            this.setState({
                isUploadExcelSpin: false
            })
            return
        }
        let _columns = []
        let _dataSource = []
        const keys = Object.keys(this.state.excelOriginalData[0])
        _columns = keys.map(item => {
            return {
                title: item,
                dataIndex: item,
                key: item
            }
        })
        _columns.unshift({
            title: "",
            dataIndex: "key",
            key: "key"
        })
        _dataSource = this.state.excelOriginalData.map((item, index) => {
            let _item = Object.assign({ key: index + 1 }, item)
            return _item
        })
        this.setState({
            dataSource: _dataSource,
            columns: _columns,
            isUploadExcelSpin: false
        })
    }

    buildSubmitOutstockList = () => {
        let arr = []
        let status = true
        this.state.excelOriginalData.forEach(item => {
            let obj = {}
            for (let key in OUTSTOCK_KEYS) {
                if(item.key===undefined){
                    status = false
                }
                if (!OUTSTOCK_KEYS.hasOwnProperty(key)) break
                let keyConfig = OUTSTOCK_KEYS[key],
                    text = keyConfig.text,
                    type = keyConfig.type
                let value = item[text] || ""
                value = this.typeTransform(value, type)
                obj[key] = value
            }
            arr.push(obj)
        })
        if(status){
            this.setState({
                submitOutstockList: arr,
                isUploadExcelSpin: false
            })
        }else{
            message.error("列缺失，请检查")
        }
    }
    
    typeTransform = (value, type) => {
        switch (type) {
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

    findUserId = (userName) => {
        let id = 0
        for (let item of this.state.usersList) {
            if (item.name === userName) {
                id = item.id
            }
        }
        return id
    }

    excelDataValidator = () => {
        let outstockError = ''
        if (!this.state.submitOutstockList.length) {
            outstockError = '未添加入库EXCEL文件'
            return outstockError
        }

        this.state.submitOutstockList.forEach(item => {
            if (item.amount <= 0 || !Boolean(Number(item.amount)) || item.amount % 1 !== 0) {
                outstockError = '出库项数量有误，请检查'
            }
        })

        let _skus = this.state.submitOutstockList.map(item => {
            return item.sku
        })
        let _skuSet = new Set(_skus)
        if (_skuSet.size !== _skus.length) {
            outstockError = '出库物料中存在重复项'
        }
        return outstockError
    }

    formDataValidator = (values) => {
        let outstockError = ''
        let params = {}
        outstockError = this.excelDataValidator()
        if (outstockError) return { params, outstockError }

        let _userId = this.findUserId(values.outstocker)
        params = {
            code: values.code,
            description: values.description,
            c_time: values.outstockAt.format("x"),
            userOutstock_id: _userId,
            products: this.state.submitOutstockList
        }
        return { params, outstockError }
    }

    handleSubmit = e => {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll(async (err, values) => {
            if (!err) {
                const { params, outstockError } = this.formDataValidator(values)
                if (outstockError) {
                    message.error(outstockError)
                } else {
                    var warningMsg
                    this.setState({ isSubmitSpin: true })
                    let upRes = await postOutstockUpload(params)
                    if (upRes.status === 'succeed' && upRes.productNotFound.list.length === 0) {
                        if (upRes.negativeStock !== 0) {
                            warningMsg = "有" + upRes.negativeStock + "次物料扣减库操作存为负数"
                            message.success(warningMsg)
                            // setTimeout(()=>{
                            //     this.props.history.push('/erp/comm/product/logs')
                            // },2000)
                        } else {
                            message.success('success')
                            setTimeout(() => {
                                this.props.history.push('/erp/comm/product/logs')
                            }, 1500)
                        }
                        this.setState({ isSubmitSpin: false })
                    } else if (upRes.status === 'failed') {
                        if (upRes.productNotFound.list.length > 0) {
                            warningMsg = "产品出库失败，以下产品未找到："
                            for (let i = 0; i < upRes.productNotFound.list.length; i++) {
                                warningMsg += "\n" + JSON.stringify(upRes.productNotFound.list[i]);
                            }
                            message.warning(warningMsg, 10)
                        } else {
                            message.warning(upRes.msg)
                        }
                        this.setState({ isSubmitSpin: false })
                    } else {
                        this.setState({ isSubmitSpin: false })
                    }
                }

            } else {
                message.error('请检查必填项和入库项是否填写正确')
            }
        })
    }

    componentDidMount() {
        this.initData()
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { fileList } = this.state
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
            accept: ".xlsx,xls"
        }
        return (
            <div>
                <Spin spinning={this.state.isInitSpin}>
                    <Card
                        title={<span>批量出库</span>}
                        bordered={false}
                        extra={
                            <Button type="primary" onClick={this.handleSubmit}>提交表单</Button>
                        }
                    >
                        <Spin spinning={this.state.isSubmitSpin}>
                            <Form {...formLayout} className='form'>
                                <div className='form-item-wrap'>
                                    <Form.Item
                                        label="出库编号"
                                        className="form-item"
                                    >
                                        {getFieldDecorator('code', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '出库编号是必须填写的'
                                                }
                                            ],
                                        })(
                                            <Input placeholder="OutstockCode" />
                                        )}
                                    </Form.Item>
                                    <Form.Item
                                        label="出库信息"
                                        className="form-item"
                                    >
                                        {getFieldDecorator('description', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '出库信息是必须填写的'
                                                }
                                            ],
                                        })(
                                            <Input placeholder="InstockDescription" />
                                        )}
                                    </Form.Item>
                                </div>
                                <div className='form-item-wrap'>
                                    <Form.Item
                                        label="出库时间"
                                        className="form-item"
                                    >
                                        {getFieldDecorator('outstockAt', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '出库时间是必须的'
                                                }
                                            ],
                                        })(
                                            <DatePicker showTime placeholder="选择时间" />
                                        )}
                                    </Form.Item>
                                    <Form.Item
                                        label="出库人"
                                        className="form-item"
                                    >
                                        {getFieldDecorator('outstocker', {
                                            rules: [
                                                {
                                                    required: true,
                                                    message: '出库人是必须填写的'
                                                }
                                            ],
                                            initialValue: this.state.outstockerList[0]
                                        })(
                                            <Select
                                                style={{ width: 200 }}
                                            >
                                                {
                                                    this.state.outstockerList.map(item => {
                                                        return (
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
                                        点击选择出库EXCEL文件
                                    </Button>
                                </Upload>
                            </div>
                        </Spin>
                        <Spin spinning={this.state.isUploadExcelSpin}>
                            <Table
                                className="table"
                                rowKey={record => record.key}
                                dataSource={this.state.dataSource}
                                columns={this.state.columns}
                                pagination={{
                                    total: this.state.dataSource.length,
                                    showQuickJumper: true,
                                }}
                            />
                        </Spin>
                    </Card>
                </Spin>
            </div>
        )
    }
}
export default ProductOutstock