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
import { changeAvatar,changeUsername } from '../../actions/user'

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
    avatar:state.user.avatar
})

@connect(mapState,{changeAvatar,changeUsername})
@Form.create()
class Profile extends Component {
    constructor(){
        super()
        this.state = {
            isLoading:false
            
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
        let addAccountErr=''
        let params = Object.assign({},values)
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
                    profileEditPost(params)          
                    .then(resp=>{
                        message.success(resp.msg)
                        this.setState({isLoading:false})  
                        this.props.changeUsername(params.username)                      
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                    .finally(()=>{
                        
                    })
                }
              }else{
                message.error('请检查表单是否填写正确')
              }
        })
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
                                        <Form.Item label="修改用户名" >
                                            {getFieldDecorator('username', {
                                                rules: [
                                                    {
                                                        required:true,
                                                        message:'username是必须填写的'
                                                    }
                                                ],
                                                initialValue:this.props.username
                                                })(
                                                <Input />
                                            )}                        
                                        </Form.Item>
                                        <Form.Item label="修改登录密码" >
                                            {getFieldDecorator('password', {
                                                rules: [
                                                    {
                                                        required:true,
                                                        message:'password是必须填写的'
                                                    }
                                                ],
                                                })(
                                                <Input placeholder="******"/>
                                            )}                        
                                        </Form.Item>
                                        <Form.Item label="更换头像" >                        
                                            <Upload  
                                                showUploadList={false}
                                                customRequest={this.handleUploadImage}
                                            >
                                                <div>
                                                    <Button>
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

export default Profile