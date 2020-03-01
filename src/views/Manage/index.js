import React, { Component } from 'react'
import {
    Card,
    Button,
    Form,
    Spin,
    message,
    Select,
    Icon,
    Row,
    Col,
    Descriptions,
    Switch,
    Checkbox,
    Tooltip
} from 'antd'
import './manage.less'

const { Option } = Select


const dataSource = {
    id:'2019003',
    username:'阿里巴巴',   
    avatar: 'https://tupian.qqw21.com/article/UploadPic/2020-2/202022222690100.jpg',
    entryTime:'2019年10月1日',
    resume:'《指南》提出党政机关法律顾问和公职律师要做好有关部门出台复工复产政策举措合法性审查和法律论证工作。要组织律师编制发布复工复产法律指引，第一时间让企业知悉掌握。要针对企业普遍关心的政策性金融、减费降税、社会保险延期缴纳等举措，加强政策解读，回应企业关切。',
    phoneNumber:'13877776666',
    department: '部门',
    position:'职级',
    authority:['001','002'],
    status:true,
}

const formLayout = {
    labelCol:{
        span:4
    },
    wrapperCol:{
        span:8
    }
}

const departmentList = ['产品部','运营部','技术部','后勤部']

const positionList = ['经理','主管','专员','实习']

const plainOptions = ['001', '002', '003']

const defaultOptions = ['001']

const tooltip = {
    authority:'001:物料/产品的查阅/新增/出入库. 002：物料/产品的编辑/删除.003:其余高级功能'
}

@Form.create()
class Manage extends Component {

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log(values)
              }else{
                message.error('请检查表单是否填写正确')
              }
        })
    }

    onChange = (checkedValues) =>{
        console.log('checked = ', checkedValues)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <>
            <Card
                title='用户详情'
                bordered={false}
                extra={<Button onClick={this.props.history.goBack}>退出</Button>} 
            >
                <Row>
                    <Col span={18}>
                        <Descriptions  bordered column={1}>
                            <Descriptions.Item label="姓名">{dataSource.username}</Descriptions.Item>
                            <Descriptions.Item label="工号">{dataSource.id}</Descriptions.Item>
                            <Descriptions.Item label="入职时间">{dataSource.entryTime}</Descriptions.Item>
                            <Descriptions.Item label="联系方式">{dataSource.phoneNumber}</Descriptions.Item>
                            <Descriptions.Item label="个人简历">{dataSource.resume}</Descriptions.Item>
                        </Descriptions>    
                    </Col>
                    <Col span={6}>
                        <img 
                            style={{width:"200px",height:"250px",margin:"10px"}} 
                            src={dataSource.avatar} 
                            alt={dataSource.avatar}
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
                                        initialValue:departmentList[0]
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
                                        initialValue:positionList[0]
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
                                        initialValue:defaultOptions
                                        })(
                                        <Checkbox.Group onChange={this.onChange}>
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
                                        initialValue: dataSource.status,
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
            </>
        )
    }
}

export default Manage
