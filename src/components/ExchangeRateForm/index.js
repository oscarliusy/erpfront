import React, { Component,createRef } from 'react'
import {
    Form,
    Button,
    InputNumber,
    Select,
} from 'antd'

const { Option } = Select

@Form.create()
class ExchangeRateForm extends Component {
    constructor(){
        super()
        this.state={
            currency:'USD',
            currencyList:[]
        }
        this.formRef = createRef()
    }

    handleSubmit = e =>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.setExchangeRate(values)
            }else{
              console.log(err)
            }
        })   
    }

    handleSelectCurrencyChange = (value) =>{
        this.props.form.setFieldsValue({
            exchangeRate: this.props.exchangeRate[value]
        })
    }

    initData = () =>{
        const _currencyList = Object.keys(this.props.exchangeRate)
        this.setState({
            currencyList:_currencyList
        })
    }

    componentDidMount(){
        this.initData()
    }

    componentDidUpdate(){
        
    }

    render() {
        const { getFieldDecorator } = this.props.form
        //console.log('props',this.props)
        return (
            <Form
                onSubmit={this.handleSubmit}
                layout="inline"
                ref = {this.formRef}
            >
                <Form.Item
                    label="1货币"
                >
                    {getFieldDecorator('currency', {
                        rules: [
                            {
                                required:true,
                                message:'currency是必须填写的'
                            }
                        ],
                        initialValue:this.state.currencyList[0]
                        })(
                            <Select 
                            style={{ width: 200 }} 
                            onChange={this.handleSelectCurrencyChange}
                        >
                            {
                                this.state.currencyList.map(item=>{
                                    return(
                                        <Option value={item} key={item}>{item}</Option>
                                    )
                                })
                            }
                        </Select>
                    )} 
                </Form.Item>
                <Form.Item
                        label="= RMB"
                    >
                        {getFieldDecorator('exchangeRate', {
                            rules: [
                                {
                                    required:true,
                                    message:'exchangeRate是必须填写的，默认为0'
                                }
                            ],
                            initialValue:this.props.exchangeRate[this.state.currencyList[0]]
                            })(
                            <InputNumber style={{ width: 180 }}  min={0} step={0.01} />
                        )}                        
                    </Form.Item>
                <Form.Item>
                        <Button type="primary" htmlType="submit">
                           修改
                        </Button>
                </Form.Item>
            </Form>
        )
    }
}

export default ExchangeRateForm