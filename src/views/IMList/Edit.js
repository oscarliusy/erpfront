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
    Icon
} from 'antd'
import axios from 'axios'

import {postMaterialEdit,getMaterialDetailById} from '../../requests'

const formLayout = {
    labelCol:{
        span:4
    },
    wrapperCol:{
        span:16
    }
}

const { Option } = Select
//const purchaserList = ['FAN','LICH','BO','OSCAR']
@Form.create()
class Edit extends Component {
    constructor(){
        super()
        this.state={
            id:0,
            uniqueId:'',
            amount:0,
            price:0,
            userPurchase_id:'',
            image:'',
            description:'',
            isSpin:false,
            isUploading:false,
            usersList:[],

            purchaserList:[],
            purchaser:''
        }
    }

    initData = () =>{
        this.setState({
            isSpin:true
        })
        getMaterialDetailById(this.props.location.pathname.split('/').pop())
        .then(resp=>{
            if(!this.updater.isMounted(this)) return
            this.setState({
                ...this.state,
                ...resp
            },()=>{
                this.buildPurchaserInfo()
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

    buildPurchaserInfo = () =>{
        let _purchaserList = this.state.usersList.map(item=>{
            return item.name
        })
        let _purchaser = ''
        for(let item of this.state.usersList){
            if(item.id.toString() === this.state.userPurchase_id.toString()){
                _purchaser = item.name
            }
        }
        this.setState({
            purchaser:_purchaser,
            purchaserList:_purchaserList
        })
    }

    handleSubmit = e =>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            const params = Object.assign({},values,{
                image:this.state.image,
                userPurchase_id:this.state.userPurchase_id
            })
            postMaterialEdit(params)
            .then(resp=>{
                console.log(resp);
                
                message.success(resp.msg)
                this.props.history.push('/erp/comm/material/list')
            })
            .catch(err=>{
                console.log(err)
            })
            .finally(()=>{
            })
          }else{
              console.log(err)
          }
        });   
    }

    handleSelectPurchaserChange = (value) =>{
        let _id = ''
        for(let item of this.state.usersList){
            if(item.name === value){
                _id = item.id
            }
        }
        this.setState({
            purchaser:value,
            userPurchase_id:_id
        },()=>{
            console.log(`selected ${value}`,this.state.userPurchase_id)
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
            //console.log(resp)
            if(resp.status === 200){
                this.setState({
                    image:resp.data.linkurl
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

    componentDidMount(){
        this.initData()  
    }

    render() {
        const { getFieldDecorator } = this.props.form
        
        return (
            <Spin spinning={this.state.isSpin}>
            <Card
                title='编辑物料信息'
                bordered={false}
                extra={<Button onClick={this.props.history.goBack}>取消</Button>} 
            >
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
                            initialValue:this.state.id
                            })(
                            <Input readOnly="readOnly" />
                        )}                        
                    </Form.Item>
                    <Form.Item
                        label="唯一识别吗"
                    >
                        {getFieldDecorator('uniqueId', {
                            rules: [
                                {
                                    required:true,
                                    message:'uniqueId是必须填写的'
                                }
                            ],
                            initialValue:this.state.uniqueId
                            })(
                            <Input />
                        )}                        
                    </Form.Item>
                    <Form.Item
                        label="库存数量"
                    >
                        {getFieldDecorator('amount', {
                            rules: [
                                {
                                    required:true,
                                    message:'库存数量是必须填写的，默认为0'
                                }
                            ],
                            initialValue:this.state.amount
                            })(
                            <InputNumber />
                        )}                        
                    </Form.Item>
                    <Form.Item
                        label="详细信息"
                    >
                        {getFieldDecorator('description', {
                            rules: [
                                {
                                    required:true,
                                    message:'详细信息是必须填写的'
                                }
                            ],
                            initialValue:this.state.description
                            })(
                            <Input  />
                        )}                        
                    </Form.Item>
                    <Form.Item
                        label="采购人"
                    >
                        {getFieldDecorator('purchaser', {
                            rules: [
                                {
                                    required:true,
                                    message:'采购人是必须填写的'
                                }
                            ],
                            initialValue:this.state.purchaser
                            })(
                                <Select 
                                style={{ width: 200 }} 
                                onChange={this.handleSelectPurchaserChange}
                            >
                                {
                                    this.state.purchaserList.map(item=>{
                                        return(
                                            <Option value={item} key={item}>{item}</Option>
                                        )
                                    })
                                }
                            </Select>
                        )} 
                    </Form.Item>
                    <Form.Item
                        label="采购价（￥）"
                    >
                        {getFieldDecorator('price', {
                            rules: [
                                {
                                    required:true,
                                    message:'采购价是必须填写的，默认为0'
                                }
                            ],
                            initialValue:this.state.price
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
                                            src={this.state.image} 
                                            alt={this.state.image}
                                        /> 
                                    </div>
                                </Spin>
                            </Upload>
                    </Form.Item>
                    <Form.Item wrapperCol={{ offset:4 }}>
                        <Button type="primary" htmlType="submit">
                            保存修改
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            </Spin>
        )
    }
}

export default Edit