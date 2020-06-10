import React, { Component } from 'react'
import { IMAGE_UPLOADER  } from '../../constants'
import {
    Card,
    Button,
    Form,
    Spin,
    message,
    Row,
    Col,
    Input,
    Upload,
    Icon
} from 'antd'
import axios from 'axios'
import { connect } from 'react-redux'
import { profileEditPost } from '../../requests'
import { changeAvatar,changeUsername,signOut } from '../../actions/user'

const formLayout = {
    labelCol:{
        span:4
    },
    wrapperCol:{
        span:8
    }
}

const mapState = (state) =>({
    username:state.user.username,
    avatar:state.user.avatar,
    email:state.user.email
})

@connect(mapState,{changeAvatar,changeUsername,signOut})
@Form.create()
class Profile extends Component {
    constructor(){
        super()
        this.state = {
            isLoading:false,
            new_password:"",
            new_email:"",
            new_username:""
        }
    }

    handleUploadImage = ({file}) =>{
        const data = new FormData()
        data.append('Token',IMAGE_UPLOADER.TOKEN)
        data.append('file',file)
        this.setState({
            isLoading:true
        })
        axios.post(IMAGE_UPLOADER.URL,data)
        .then(resp=>{
            //console.log(resp)
            if(resp.status === 200){
               this.props.changeAvatar(resp.data.linkurl)
            }else{
                //处理其他问题
            }
        })
        .catch(err=>{
            //处理错误
        })
        .finally(()=>{ 
            this.setState({
                isLoading:false
            })
        })
    }

    formDataValidator = (values) =>{
        let editAccountErr=''
        if(!values.new_email && !values.new_username && !values.new_password) editAccountErr = '请填写需要修改的项目'
        const params = {
            email:this.props.email,
            new_email:values.new_email.trim() || this.props.email,
            new_username:values.new_username.trim() || this.props.username,
            password:values.password.trim(),
            new_password:values.new_password.trim()
        }
        
        return {params,editAccountErr}
    }

    handleSubmit = e => {
        this.setState({isLoading:true})
        e.preventDefault()
        this.props.form.validateFieldsAndScroll(async(err, values) => {
            if (!err) {
                const {params,editAccountErr} = this.formDataValidator(values)
                if(editAccountErr){
                    message.error(editAccountErr)
                    this.setState({isLoading:false})
                }else{
                    //console.log('submit parms:',params)
                    let editRes = await profileEditPost(params)  
                    if(editRes.status === 'succeed'){
                        message.success(editRes.msg)
                        this.setState({isLoading:false}) 
                        //重新登录的好处是不需要处理token和storage,登录一并处理好了
                        //this.props.changeUsername(params.new_username,params.new_email) 
                        this.props.signOut()
                    }else{
                        message.warning(editRes.msg)
                        this.setState({isLoading:false})
                    }
                }
            }else{
                message.error('请检查表单是否填写正确')
                this.setState({isLoading:false})
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <>
                <Spin spinning={this.state.isLoading}>
                    <Card
                        title='个人登录信息设置'
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
                                        
                                        <Form.Item label="登录密码" >
                                            {getFieldDecorator('password', {
                                                rules: [
                                                    {
                                                        required:true,
                                                        message:'password是必须填写的'
                                                    }
                                                ],
                                                })(
                                                <Input.Password placeholder="input password"/>
                                            )}                        
                                        </Form.Item>
                                        <Form.Item label="新的密码(不改勿填)" >
                                            {getFieldDecorator('new_password', {
                                                rules: [
                                                ],
                                                initialValue:this.state.new_password
                                                })(
                                                <Input.Password placeholder="input new password"/>
                                            )}                        
                                        </Form.Item>
                                        <Form.Item label="新的用户名(不改勿填)" >
                                            {getFieldDecorator('new_username', {
                                                initialValue:this.state.new_username
                                                })(
                                                <Input />
                                            )}                        
                                        </Form.Item>
                                        <Form.Item label="新的登录邮箱(不改勿填)" >
                                            {getFieldDecorator('new_email', {
                                                rules: [
                                                    {
                                                        type: 'email',
                                                        message: 'The input is not valid E-mail!',
                                                    },
                                                ],
                                                initialValue:this.state.new_email
                                                })(
                                                <Input />
                                            )}                        
                                        </Form.Item>
                                        <Form.Item label="更换头像(暂不支持)" >                        
                                            <Upload  
                                                showUploadList={false}
                                                customRequest={this.handleUploadImage}
                                            >
                                                <div>
                                                    <Button disabled>
                                                        <Icon type="upload" /> Click to upload
                                                    </Button>
                                                </div>
                                            </Upload>
                                        </Form.Item>
                                    </Col>
                                    <Col span={8} >
                                    <img 
                                        style={{width:"200px",height:"250px",margin:"10px"}} 
                                        src={this.props.avatar} 
                                        alt={this.props.avatar}
                                    /> 
                                    </Col>
                                </Row>
                                <Form.Item wrapperCol={{ offset:3 }}>
                                    <div>
                                        <Button type="primary" htmlType="submit">
                                            提交
                                        </Button>
                                        <span>(提交后请重新登录)</span>
                                    </div>
                                </Form.Item>
                            </Form>
                        </div>
                    </Card>
                </Spin>
            </>
        )
    }
}

export default Profile