import React, { Component } from 'react'
import {
    Card,
    Button,
    Form,
    Spin,
    message,
    Select,
    Row,
    Col,
    Descriptions,
    Switch,
    Checkbox,
    Tooltip
} from 'antd'
import './manage.less'
import { getAccountDetailById,postAccountDetailEdit } from '../../requests'
import moment from 'moment'

const { Option } = Select

const formLayout = {
    labelCol:{
        span:4
    },
    wrapperCol:{
        span:8
    }
}

//下面的常数要么放进数据库，要么放进一个专门管常量的地方管理起来。
const departmentList = ['产品部','运营部','技术部','后勤部']
const positionList = ['经理','主管','专员','实习']
const plainOptions = ['001', '002', '003']
const tooltip = {
    authority:'001:物料/产品的查阅/新增/出入库. 002：物料/产品的编辑/删除.003:其余高级功能'
}


@Form.create()
class Manage extends Component {
    constructor(){
        super()
        this.state = {
            isLoading:false,
            dataSource:{}
        }
    }

    handleSubmit = e => {
        this.setState({
            isLoading:true
        })
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                values.id = this.props.location.pathname.split('/').pop()
                postAccountDetailEdit(values)
                .then(resp=>{
                    message.success(resp.msg)
                    this.props.history.push('/erp/admin/account/list')
                })
                .catch(err=>{
                    console.log(err)
                })
                .finally(()=>{
                    this.setState({
                        isLoading:false
                    })
                })
              }else{
                message.error('请检查表单是否填写正确')
              }
        })
    }

    initData = () =>{
        this.setState({
            isLoading:true
        })
        getAccountDetailById(this.props.location.pathname.split('/').pop())
        .then(resp=>{
            if(!this.updater.isMounted(this)) return
            if(resp.entryTime) resp.entryTime = moment(resp.entryTime).format('YYYY-MM-DD ')
            this.setState({
               dataSource:resp
            })
        })
        .catch(err=>{
            console.log(err)
        })
        .finally(()=>{
            this.setState({
                isLoading:false
            })
        })
    }

    componentDidMount(){
        this.initData()
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <>
            <Spin spinning={this.state.isLoading}>
            <Card
                title='用户详情'
                bordered={false}
                extra={<Button onClick={this.props.history.goBack}>退出</Button>} 
            >
                <Row>
                    <Col span={18}>
                        <Descriptions  bordered column={1}>
                            <Descriptions.Item label="姓名">{this.state.dataSource.username}</Descriptions.Item>
                            <Descriptions.Item label="工号">{this.state.dataSource.id}</Descriptions.Item>
                            <Descriptions.Item label="入职时间">{this.state.dataSource.entryTime}</Descriptions.Item>
                            <Descriptions.Item label="联系方式">{this.state.dataSource.phoneNumber}</Descriptions.Item>
                            <Descriptions.Item label="个人简历">{this.state.dataSource.resume}</Descriptions.Item>
                        </Descriptions>    
                    </Col>
                    <Col span={6}>
                        <img 
                            style={{width:"200px",height:"250px",margin:"10px"}} 
                            src={this.state.dataSource.avatar} 
                            alt={this.state.dataSource.avatar}
                        /> 
                    </Col>
                </Row>
                <div className="acount-form">
                    <Form
                        onSubmit={this.handleSubmit}
                        {...formLayout}
                    >
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
                                        initialValue:this.state.dataSource.department
                                        })(
                                        <Select 
                                            style={{ width: 200 }} 
                                        >
                                            {
                                                departmentList.map(item=>{
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
                                        initialValue:this.state.dataSource.position
                                        })(
                                        <Select 
                                            style={{ width: 200 }} 
                                        >
                                            {
                                                positionList.map(item=>{
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
                                <Tooltip title={tooltip.authority}>
                                <Form.Item label="权限" >
                                    {getFieldDecorator('authority', {
                                        rules: [
                                            {
                                                required:true,
                                                message:'authority是必须填写的'
                                            }
                                        ],
                                        initialValue:this.state.dataSource.authority
                                        })(
                                        <Checkbox.Group >
                                            <Row>
                                            {
                                                plainOptions.map(item=>{
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
                                        initialValue: this.state.dataSource.status,
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
                                提交修改
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

export default Manage
