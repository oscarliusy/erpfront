import React, { Component } from 'react'
import { Form, Icon, Input, Button,Checkbox,Card,Spin} from 'antd'
import { Redirect } from 'react-router-dom'
import { signIn } from '../../actions/user'
import { connect } from 'react-redux'
import './signin.less'

const mapState = (state)=>({
    isSignIn : state.user.isSignIn,
    isLoading : state.user.isLoading
}) 


@connect(mapState,{ signIn })
@Form.create()
class SignIn extends Component {
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
          if (!err) {
            this.props.signIn(values)
            //console.log('values',values)
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
            <Spin spinning={this.props.isLoading}>
            <Card
                title="登录"
                className="signin-wrapper"
            >
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <Form.Item>
                        {getFieldDecorator('email', {
                            rules: [{ required: true, message: '请输入注册邮箱!' }],
                        })(
                            <Input
                                disabled={this.props.isLoading}
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
                            disabled={this.props.isLoading}
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
                        })(<Checkbox disabled={this.props.isLoading}>记住我</Checkbox>)}
                        <Button loading={this.props.isLoading} type="primary" htmlType="submit" className="login-form-button">
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
