import React, { Component } from 'react'
import {
    Form,
    Button,
    Select,
} from 'antd'

const { Option } = Select

@Form.create()
class SiteCurrencyForm extends Component {
    constructor(props){
        super(props)
        this.state = {
            currencyList:[]
        }
    }


    handleSubmit = e =>{
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.setSiteCurrency(values)
            }else{
              console.log(err)
            }
        })   
    }

    handleSelectSiteChange = (value) =>{
        const _currency = this.props.siteInfo.filter(item=>item.site === value)
        this.props.form.setFieldsValue({
            currency: _currency[0].currency
        })
    }

    uniq = (array)=>{
        var temp = []; //一个新的临时数组
        for(var i = 0; i < array.length; i++){
            if(temp.indexOf(array[i]) === -1){
                temp.push(array[i]);
            }
        }
        return temp;
    }

    buildCurrencyList = () =>{
        const originCurrencyList = this.props.siteInfo.map(item=>{
            return item.currency
        })
        return this.uniq(originCurrencyList)
    }

    initData = () =>{
        const _currencyList = this.buildCurrencyList()
        this.setState({
            currencyList:_currencyList
        })
    }

    componentDidMount(){
        this.initData()
    }
    render() {
        const { getFieldDecorator } = this.props.form
        return (
            <Form
                onSubmit={this.handleSubmit}
                layout="inline"
            >
                <Form.Item
                    label="站点"
                >
                    {getFieldDecorator('site', {
                        rules: [
                            {
                                required:true,
                                message:'site是必须填写的'
                            }
                        ],
                        initialValue:this.props.siteInfo[0].site
                        })(
                            <Select 
                            style={{ width: 200 }} 
                            onChange={this.handleSelectSiteChange}
                        >
                            {
                                this.props.siteInfo.map(item=>{
                                    return(
                                        <Option value={item.site} key={item.site}>{item.site}</Option>
                                    )
                                })
                            }
                        </Select>
                    )} 
                </Form.Item>
                <Form.Item
                    label="货币"
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
                <Form.Item>
                        <Button type="primary" htmlType="submit">
                           修改
                        </Button>
                </Form.Item>
            </Form>
        )
    }
}

export default SiteCurrencyForm
