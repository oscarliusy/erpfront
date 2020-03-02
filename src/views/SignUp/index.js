import React, { Component } from 'react'
import { HRSETTINGS } from '../../constants'
import moment from 'moment'
import {
    Card,
    Button,
    Form,
    Spin,
    message,
    Select,
    Row,
    Col,
    Switch,
    Checkbox,
    Tooltip,
    DatePicker,
    Input,
    Radio,
    Upload,
    Icon
} from 'antd'
import { postSignUp } from '../../requests'
import axios from 'axios'

const { Option } = Select

const formLayout = {
    labelCol:{
        span:4
    },
    wrapperCol:{
        span:8
    }
}

@Form.create()
class SignUp extends Component {
    constructor(){
        super()
        this.state = {
            isLoading:false,
            isUploading:false,
            avatar:'http://pic1.zhimg.com/50/v2-2f3dfd6f7da18983fd5a4e48747d7ee3_hd.jpg',
        }
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
                    avatar:resp.data.linkurl
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

    formDataValidator = (values) =>{
        let addAccountErr=''
        let params = Object.assign({},values)
        params.entryAt = moment(values.entryAt).valueOf()
        params.avatar = this.state.avatar
        //这里增加验证内容
        return {params,addAccountErr}
    }

    handleSubmit = e => {
        this.setState({
            isLoading:true
        })
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                const {params,addAccountErr} = this.formDataValidator(values)
                if(addAccountErr){
                    message.error(addAccountErr)
                }else{
                    //console.log('submit parms:',params)
                    postSignUp(params)          
                    .then(resp=>{
                        message.success(resp.msg)
                        this.setState({isLoading:false})                        
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                    .finally(()=>{
                        this.props.history.push('/erp/admin/account/list')
                    })
                }
              }else{
                message.error('请检查表单是否填写正确')
              }
        })
    }

    componentDidMount(){
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <>
                <Spin spinning={this.state.isLoading}>
                    <Card
                        title='新用户注册'
                        bordered={false}
                        extra={<Button onClick={this.props.history.goBack}>退出</Button>} 
                    >
                        <div>
                            <Form
                                onSubmit={this.handleSubmit}
                                {...formLayout}
                            >
                                <Row>
                                    <Col span={16} >
                                        <Form.Item label="姓名" >
                                            {getFieldDecorator('username', {
                                                rules: [
                                                    {
                                                        required:true,
                                                        message:'username是必须填写的'
                                                    }
                                                ],
                                                })(
                                                <Input />
                                            )}                        
                                        </Form.Item>
                                        <Form.Item label="性别" >
                                            {getFieldDecorator('gender', {
                                                 rules: [
                                                    {
                                                        required:true,
                                                        message:'gender是必须的'
                                                    }
                                                ],
                                                initialValue:"male"
                                                })(
                                                    <Radio.Group >
                                                        <Radio value="male">男</Radio>
                                                        <Radio value="female">女</Radio>
                                                   </Radio.Group>
                                            )}                        
                                        </Form.Item>
                                        <Form.Item
                                            label="入职时间"
                                        >
                                            {getFieldDecorator('entryAt', {
                                                    rules: [
                                                        {
                                                            required:true,
                                                            message:'入职时间是必须的'
                                                        }
                                                    ],
                                            })(
                                                <DatePicker showTime placeholder="选择时间"  />
                                            )}
                                        </Form.Item>
                                        <Form.Item label="身份证号" >
                                            {getFieldDecorator('identityNumber', {
                                                rules: [
                                                    {
                                                        required:true,
                                                        message:'identityNumber是必须填写的'
                                                    }
                                                ],
                                                })(
                                                <Input />
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
                                                </Spin>
                                            </Upload>
                                        </Form.Item>
                                        <Form.Item
                                            label="简历"
                                        >
                                            {getFieldDecorator('resume', {
                                                    rules: [
                                                        {
                                                            required:true,
                                                            message:'resume是必须的'
                                                        }
                                                    ],
                                            })(
                                                <textarea 
                                                    rows="3"
                                                    cols="50"
                                                    style={{
                                                        resize:"none"
                                                    }}
                                                />
                                            )}
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} >
                                    <img 
                                        style={{width:"200px",height:"250px",margin:"10px"}} 
                                        src={this.state.avatar} 
                                        alt={this.state.avatar}
                                    /> 
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <Form.Item label="部门" >
                                            {getFieldDecorator('department', {
                                                rules: [
                                                    {
                                                        required:true,
                                                        message:'department是必须填写的'
                                                    }
                                                ],
                                                initialValue:HRSETTINGS.DEPARTMENT_LIST[0]
                                                })(
                                                <Select 
                                                    style={{ width: 200 }} 
                                                >
                                                    {
                                                        HRSETTINGS.DEPARTMENT_LIST.map(item=>{
                                                            return(
                                                                <Option value={item} key={item}>{item}</Option>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            )}                        
                                        </Form.Item>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="职级" >
                                            {getFieldDecorator('position', {
                                                rules: [
                                                    {
                                                        required:true,
                                                        message:'position是必须填写的'
                                                    }
                                                ],
                                                initialValue:HRSETTINGS.POSITION_LIST[0]
                                                })(
                                                <Select 
                                                    style={{ width: 200 }} 
                                                >
                                                    {
                                                        HRSETTINGS.POSITION_LIST.map(item=>{
                                                            return(
                                                                <Option value={item} key={item}>{item}</Option>
                                                            )
                                                        })
                                                    }
                                                </Select>
                                            )}                        
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span={12}>
                                        <Tooltip title={HRSETTINGS.TOOLTIP.AUTHORITY}>
                                        <Form.Item label="权限" >
                                            {getFieldDecorator('authority', {
                                                rules: [
                                                    {
                                                        required:true,
                                                        message:'authority是必须填写的'
                                                    }
                                                ],
                                                initialValue:[HRSETTINGS.PLAIN_OPTIONS[0]]
                                                })(
                                                <Checkbox.Group >
                                                    <Row>
                                                    {
                                                        HRSETTINGS.PLAIN_OPTIONS.map(item=>{
                                                            return (
                                                                <Col span={10} key={item}>
                                                                    <Checkbox value={item}>{item}</Checkbox>
                                                                </Col>
                                                            )
                                                        })
                                                    }
                                                    </Row>
                                                </Checkbox.Group>
                                            )}                        
                                        </Form.Item>
                                        </Tooltip>
                                    </Col>
                                    <Col span={12}>
                                        <Form.Item label="工作状态" >
                                            {getFieldDecorator('status', {
                                                initialValue: true,
                                                valuePropName: 'checked'
                                                })(
                                                <Switch 
                                                    checkedChildren="在职" 
                                                    unCheckedChildren="离职" 
                                                />
                                            )}                        
                                        </Form.Item>
                                    </Col>
                                </Row>
                                <Form.Item wrapperCol={{ offset:4 }}>
                                    <Button type="primary" htmlType="submit">
                                        提交
                                    </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Card>
                </Spin>
            </>
        )
    }
}

export default SignUp