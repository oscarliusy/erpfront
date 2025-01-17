import { Upload, Button, Icon, Card, message, List, Select, Modal } from 'antd'
import React, { Component } from 'react'
import { readFile } from '../../assets/lib/utils'
import xlsx from 'xlsx'
import { INSTOCK_KEYS } from '../../assets/lib/model-constant'
import { postUploadNewProduct, getPurchaserList } from '../../requests'

const { Option } = Select;

const productColumns = ["产品SKU", "title", 'description', "site", "品牌"]

export default class NewMaterialUpload extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fileList: [],
            dataSource: [],
            columns: [],
            sheetName: "",
            excelOriginalData: [],
            submitInstockList: [],
            isUploadExcelSpin: false,
            reqData: [],
            duplicateProductList: [],
            duplicateMaterialList: [],
            visible: false,
            seletcUser: "",
            instockerList: [],
            usersList: [],
            hasError: false,
            modelVisible: false,
            modelTitle:"",
            modelContent:""
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
        this.buildTableData(data)
        if (this.confirmAllColumnExist()) {
            this.buildSubmitInstockList(data)
            this.buildListData()
        }
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

    confirmAllColumnExist = () => {
        let status = true
        let materialIndex = 1
        let rowIndex = 2
        for (let product of this.state.dataSource) {
            materialIndex = 1
            let keysCount = Object.keys(product).length
            let i = 0
            for (let item of productColumns) {
                if (product[item] === undefined) {
                    message.error(`第${rowIndex}行${productColumns[i]}不存在`)
                    status = false
                    break
                }
                i++
            }
            while (status) {
                let material = `物料${materialIndex}`
                let materialCount = `物料${materialIndex}数量`
                if (product[material] !== undefined && product[materialCount] !== undefined) {
                    materialIndex++
                } else if (product[material] === undefined && product[materialCount] === undefined) {
                    break
                } else {
                    message.error(`物料数量、名称缺失无法上传`)
                    status = false
                }
            }

            //product对象中会比Excel表多一个属性，所以要对keysCount - 1
            if ((productColumns.length + (materialIndex - 1) * 2) != (keysCount-1) && status) {
                message.error(`格式有误`)
                status = false
            }
            if (status === false) {
                break
            }
        }
        return status
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

    buildListData = () => {
        let data = []
        let productMap = new Map()
        let duplicateProductList = []
        let duplicateMaterialList = []
        this.state.dataSource.map(item => {
            let cur = this.buildData(item)
            let materialSet = new Set()
            cur.materialList.map(material => {
                materialSet.add(material.uniqueId)
            })
            if (materialSet.size !== cur.materialList.length) {
                duplicateMaterialList.push(cur.sku)
            }
            if (productMap.get(cur.sku) === undefined) {
                let sku = cur.sku
                cur.sku = sku.trim()
                productMap.set(cur.sku, 1)
                data.push(cur)
            } else {
                duplicateProductList.push(cur.sku.toString())
            }
        })
        this.setState({
            duplicateProductList: duplicateProductList,
            duplicateMaterialList: duplicateMaterialList,
            reqData: data
        })
    }

    handleSubmit = () => {
        this.setState({
            visible: true
        })
    }



    buildData(data) {
        let res = {}
        res.sku = (data["产品SKU"] + "").trim()
        res.title = (data["title"] + "").trim()
        res.description = (data["description"] + "").trim()
        res.site = (data["site"] + "").trim()
        res.brandName = (data["品牌"] + "").trim()
        res.materialList = []
        let idx = 1
        let cur = {
            uniqueId: data[`物料${idx}`] + '',
            materialAmount: data[`物料${idx}数量`]
        }
        while (cur.uniqueId) {
            cur.uniqueId = cur.uniqueId.trim()
            if (cur.uniqueId.length !== 0) {
                res.materialList.push(cur)
            }
            idx++
            cur = {
                uniqueId: data[`物料${idx}`],
                materialAmount: data[`物料${idx}数量`]
            }
        }
        return res
    }

    componentDidMount() {
        this.initData()
    }

    initData = () => {

        getPurchaserList().then(resp => {
            let _instockerList = resp.map(item => {
                return item.name
            })
            this.setState({
                instockerList: _instockerList,
                usersList: resp
            })
        })
    }

    handleOk = () => {
        if (this.state.duplicateProductList.length > 0) {
            message.error(`请重新上传，产品SKU重复，SKU为:${this.state.duplicateProductList}`)
        } else if (this.state.duplicateMaterialList.length > 0) {
            message.error(`请重新上传，产品${this.state.duplicateMaterialList.toString()}中含有重复物料`)
        } else {
            let data = this.state.reqData
            let creater_id
            this.state.usersList.map(item => {
                if (item.name === this.state.seletcUser) {
                    creater_id = item.id
                }
            })
            for (let i = 0; i < data.length; i++) {
                data[i].creater_id = creater_id
            }
            this.setState({
                reqData: data
            })
            postUploadNewProduct(this.state.reqData).then(response => {
                let modelTitle = ""
                let content = ""
                if (!response.productExistInfo.allNewProductNotExist) {
                    modelTitle = "以下产品(SKU)已存在"
                    content = response.productExistInfo.reapeatSku.toString()
                } else if (!response.materialExistInfo.allMaterialExist) {
                    modelTitle = "以下物料不存在"
                    content = response.materialExistInfo.materialNotFindList.toString()
                } else if (!response.brandExistInfo.allBrandExist) {
                    modelTitle = "以下品牌不存在"
                    content = response.brandExistInfo.brandNotFound.toString()

                } else if (!response.siteExistInfo.allSitesExist) {
                    modelTitle = "以下站点不存在"
                    content = response.siteExistInfo.siteNotFound.toString()

                } else if (!response.amountInfo.amountAllInt) {
                    modelTitle = "以下sku中的物料数量不是正整数"
                    content = response.amountInfo.illegalSku.toString()

                } else if (response.emptyInfo.hasEmpty) {
                    message.error(`检查Excel表，SKU、title、title存在空(undefined)`)
                } else if (response.insertResult.success) {
                    message.success(response.insertResult.message)
                }

                if(!response.insertResult.success){
                    this.setState({
                        modelTitle:modelTitle,
                        modelContent:content,
                        modelVisible:true,
                        visible: false
                    })
                }
            })
        }
    }

    handleCancel = () => {
        this.setState({
            visible: false
        })
    }

    handleChange = (value) => {
        this.setState({
            seletcUser: value
        })
    }

    closeModal = () => {
        this.setState({
            modelVisible:false
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
                <Card title="批量上传产品" extra={
                    <Button type="primary" onClick={this.handleSubmit}>提交表单</Button>
                }>
                    <Upload {...props} >
                        <Button>
                            <Icon type="upload" /> 点击上传Excel文件
                        </Button>
                    </Upload>

                </Card>
                <List
                    itemLayout="horizontal"
                    bordered={true}
                    dataSource={this.state.reqData}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                title={"产品SKU：" + item.sku + " 品牌：" + item.brandName}
                                description={"物料：" + item.materialList.map(item => (
                                    item.uniqueId + ": " + item.materialAmount + "个"
                                ))}
                            />
                        </List.Item>
                    )}
                />
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