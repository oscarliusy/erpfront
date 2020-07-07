import React, { Component } from 'react'
import { Form, Icon, Input, Button,Checkbox,Card,Spin,message} from 'antd'
import { Redirect } from 'react-router-dom'
import { signIn } from '../../actions/user'
import { connect } from 'react-redux'
import './signin.less'
import { signInRequest} from '../../requests'

//从redux获取user.state和相关的action函数
const mapState = (state)=>({
    isSignIn : state.user.isSignIn,
    msg:state.user.msg
}) 


@connect(mapState,{ signIn })
@Form.create()
class SignIn extends Component {
    constructor(){
        super()
        this.state={
            isLoading:false
        }
    }

    // values:{email: "1069176850@qq.com",password: "123",remember: true}
    formDataValidator = (values) =>{
        let signInErr=''
        let params = {}
        params.email = values.email.trim()
        params.password = values.password.trim()
        params.remember = values.remember

        return {
            params,
            signInErr
        }
    }

    handleSubmit = (e) => {
        this.setState({isLoading:true})
        e.preventDefault()
        this.props.form.validateFields(async(err, values) => {
          if (!err) {
            const {params,signInErr} = this.formDataValidator(values)
            if(signInErr){
                message.error(signInErr)
            }else{
                let signinRes = await signInRequest(params)
                console.log('signinRes',signinRes)
                if(signinRes.status === 'succeed'){
                    message.success(signinRes.msg)
                    this.setState({isLoading:false})
                    this.props.signIn({
                        authToken:signinRes.authToken,
                        userInfo:signinRes.userInfo,
                        remember:params.remember,
                        status:signinRes.status
                    })
                }else if(signinRes.status === 'failed'){
                    message.warning(signinRes.msg)
                    this.setState({isLoading:false})
                }
            }           
          }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form
   
        return (
            this.props.isSignIn
            ?
            <Redirect to='/erp' />
            :
            <Spin spinning={this.state.isLoading}>
            <Card
                title="登录"
                className="signin-wrapper"
            >
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                        {getFieldDecorator('email', {
                            rules: [
                                {
                                    type: 'email',
                                    message: 'The input is not valid E-mail!',
                                },
                                { 
                                    required: true, 
                                    message: '请输入注册邮箱!' 
                                }
                            ],
                        })(
                            <Input
                                disabled={this.state.isLoading}
                                prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="email"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码!' }],
                        })(
                            <Input
                            disabled={this.state.isLoading}
                            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                            type="password"
                            placeholder="密码"
                            />,
                        )}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(<Checkbox disabled={this.state.isLoading}>记住我</Checkbox>)}
                        <Button loading={this.state.isLoading} type="primary" htmlType="submit" className="login-form-button">
                            登录
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            </Spin>
        )
    }
}
export default SignIn
