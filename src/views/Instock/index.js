import React, { Component } from 'react'
import { 
    Drawer,
    Button,
    Card,
    Form,
    Input,
    Spin,
    message,
    Select,
    Icon,
    DatePicker
 } from 'antd'

const { Option } = Select
const instockerList = ['FAN','LICH','BO','OSCAR']
 
const formLayout = {
    labelCol:{
        span:4
    },
    wrapperCol:{
        span:16
    }
}

@Form.create()
class Instock extends Component {
    constructor(){
        super()
        this.state={ 
            visible: false 
        }
    }

    showDrawer = () => {
      this.setState({
        visible: true,
      });
    };
  
    onClose = () => {
      this.setState({
        visible: false,
      });
    };

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            console.log('Received values of form: ', values)
          }
        })
    }
    handleSelectPurchaserChange = (value) =>{
        console.log(`selected ${value}`)
        // this.setState({
        //     purchaser:value
        // })
    }
    render() {
      const { getFieldDecorator } = this.props.form
      return (
        <>
            <Card
                title='入库'
                bordered={false}
                extra={<Button onClick={this.props.history.goBack}>取消</Button>} 
            >
               <Form
                    onSubmit={this.handleSubmit}
                    {...formLayout}
                >
                <Form.Item
                        label="入库编号"
                    >
                    {getFieldDecorator('instockCode', {
                        rules: [
                            {
                                required:true,
                                message:'instockCode是必须填写的'
                            }
                        ],
                        })(
                        <Input placeholder="InstockCode"/>
                    )}                        
                </Form.Item>
                <Form.Item
                        label="入库信息"
                    >
                    {getFieldDecorator('instockDesc', {
                        rules: [
                            {
                                required:true,
                                message:'instockDesc是必须填写的'
                            }
                        ],
                        })(
                        <Input placeholder="InstockDescription"/>
                    )}                        
                </Form.Item>
                <Form.Item
                    label="入库时间"
                >
                    {getFieldDecorator('instockAt', {
                            rules: [
                                {
                                    required:true,
                                    message:'入库时间是必须的'
                                }
                            ],
                    })(
                        <DatePicker showTime placeholder="选择时间"  />
                    )}
                </Form.Item>
                <Form.Item
                    label="入库人"
                >
                    {getFieldDecorator('instocker', {
                        rules: [
                            {
                                required:true,
                                message:'入库人是必须填写的'
                            }
                        ],
                        initialValue:instockerList[0]
                        })(
                            <Select 
                            style={{ width: 200 }} 
                            onChange={this.handleSelectPurchaserChange}
                        >
                            {
                                instockerList.map(item=>{
                                    return(
                                        <Option value={item} key={item}>{item}</Option>
                                    )
                                })
                            }
                        </Select>
                    )} 
                </Form.Item>
                </Form> 
            </Card>
            <div>
            <Button type="primary" onClick={this.showDrawer}>
                Open
            </Button>
            <Drawer
                title="Basic Drawer"
                placement="right"
                closable={false}
                onClose={this.onClose}
                visible={this.state.visible}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
            </div>`
        </>
      );
    }
}

export default Instock