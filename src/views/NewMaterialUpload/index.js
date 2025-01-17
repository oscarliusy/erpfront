import { Upload, Button, Icon, Card, message, Table, Select, Modal } from 'antd'
import React, { Component } from 'react'
import { readFile } from '../../assets/lib/utils'
import xlsx from 'xlsx'
import { INSTOCK_KEYS } from '../../assets/lib/model-constant'
import { getPurchaserList } from '../../requests'
import { postMaterialNewUpload } from '../../requests'

const { Option } = Select;
const materialColumns = ["唯一识别码", "备注", '入库数量',"采购价"]

export default class NewMaterialUpload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            instockerList: [],
            usersList: [],
            fileList: [],
            dataSource: [],
            columns: [],
            sheetName: "",
            excelOriginalData: [],
            submitInstockList: [],
            visible: false,
            seletcUser: "",
            isUploadExcelSpin: false,
            isSubmitSpin: false,
            isInitSpin: false,
            reqData: [],
            modelVisible: false,
            modelTitle: "",
            modelContent: ""
        }
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
        //构造呈现的data和向后端传递的data
        if (this.confirmAllColumnExist(data)) {
            this.buildTableData(data)
            this.buildSubmitInstockList(data)
        }
    }

    confirmAllColumnExist = (data) => {
        let status = true
        console.log(data)
        for (let i = 0; i < data.length; i++) {
            let material = data[i]
            for (let j = 0; j < materialColumns.length; j++) {
                let item = materialColumns[j]
                if (material[item] === undefined || (isNaN(material[item]) && material[item].trim() === "")) {
                    message.error(`第${i + 2}行${materialColumns[j]}列不存在`)
                    status = false
                    break
                }
            }
            if (!status) {
                break
            }
        }
        return status
    }

    buildTableData = () => {
        if (this.state.sheetName !== 'instock') {
            message.warning('未使用入库模板,请检查')
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

    buildSubmitInstockList = () => {
        let arr = []
        this.state.excelOriginalData.forEach(item => {
            let obj = {}
            for (let key in INSTOCK_KEYS) {
                if (!INSTOCK_KEYS.hasOwnProperty(key)) break
                let keyConfig = INSTOCK_KEYS[key],
                    text = keyConfig.text,
                    type = keyConfig.type
                let value = item[text] || ""
                value = this.typeTransform(value, type)
                obj[key] = value
            }
            arr.push(obj)
        })
        this.setState({
            submitInstockList: arr,
            isUploadExcelSpin: false
        })
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
    initTableData = () => {
        this.setState({
            dataSource: [],
            columns: [],
            sheetName: "",
            excelOriginalData: [],
            fileList: []
        })
    }

    handleSubmit = () => {
        let data = []
        let map = new Map()
        let reqpeatList = []
        let hasEmpty = false
        this.state.dataSource.map(item => {
            let cur = this.buildData(item)
            if (cur.uniqueId === 'undefined' || cur.description === 'undefined' || cur.amount === 'undefined' || cur.price === 'undefined') {
                hasEmpty = true
            }
            if (map.get(cur.uniqueId) === undefined) {
                let uniqueId = cur.uniqueId
                cur.uniqueId = uniqueId.trim()
                map.set(cur.uniqueId, 1)
                data.push(cur)
            } else {
                reqpeatList.push(cur.uniqueId.toString())
            }
        })
        if (reqpeatList.length > 0) {
            message.error(`含有重复项，唯一识别码为:${reqpeatList}`)
        } else if (hasEmpty) {
            message.error(`表格中存在未填项`)
        } else {
            this.setState({
                reqData: data,
                visible: true
            })
        }
    }

    handleChange = (value) => {
        this.setState({
            seletcUser: value
        })
    }

    buildData(data) {
        let res = {}
        res.uniqueId = (data["唯一识别码"] + "").trim()
        res.description = (data["备注"] + "").trim()
        res.amount = data["入库数量"]
        res.price = data["采购价"]
        return res
    }

    handleCancel = () => {
        this.setState({
            visible: false
        })
    }

    handleOk = () => {
        this.setState({
            visible: false,
        });
        let userId
        this.state.usersList.map(item => {
            if (item.name === this.state.seletcUser) {
                userId = item.id
            }
        })
        let reqData = {
            user: userId,
            data: this.state.reqData
        }
        postMaterialNewUpload(reqData)
            .then(resp => {
                console.log(resp)
                if (resp.repeatList.length > 0) {
                    this.setState({
                        modelTitle: "请检查表格，以下物料uniqueId已存在",
                        modelContent: resp.repeatList.toString(),
                        modelVisible: true
                    })
                } else if (resp.errList.length > 0) {
                    this.setState({
                        modelTitle: "请检查表格，以下物料数量或价格为非正整数、价格为负数",
                        modelContent: resp.errList.toString(),
                        modelVisible: true
                    })
                } else if (resp.success) {
                    message.success(resp.msg)
                } else {
                    message.error(`数据库操作出错，${resp.msg}`)
                }
            })

    }

    closeModal = () => {
        this.setState({
            modelVisible: false
        })
    }

    componentDidMount() {
        this.initData()
    }

    initData = () => {
        this.setState({
            isInitSpin: true
        })
        getPurchaserList()
            .then(resp => {
                let _instockerList = resp.map(item => {
                    return item.name
                })
                this.setState({
                    instockerList: _instockerList,
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

    render() {
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
            <>
                <Card title="批量新建物料" extra={
                    <Button type="primary" onClick={this.handleSubmit}>提交表单</Button>
                }>
                    <Upload {...props} >
                        <Button>
                            <Icon type="upload" /> 点击上传Excel文件
                        </Button>
                    </Upload>

                    <Modal title="选择上传用户" visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
                        <Select style={{ width: 120 }} onChange={this.handleChange}>
                            {
                                this.state.instockerList.map(item => {
                                    return (
                                        <Option value={item} key={item}>{item}</Option>
                                    )
                                })
                            }
                        </Select>
                    </Modal>
                </Card>
                <Table columns={this.state.columns} dataSource={this.state.dataSource} bordered />
                <Modal
                    title={this.state.modelTitle}
                    visible={this.state.modelVisible}
                    onOk={this.closeModal}
                    onCancel={this.closeModal}
                >
                    <p>{this.state.modelContent}</p>
                </Modal>
            </>
        )
    }
}