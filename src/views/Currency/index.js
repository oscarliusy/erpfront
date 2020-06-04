import React, { Component } from 'react'
import { 
    Statistic, 
    Card, 
    Row, 
    Col,
    message,
    Spin,
    Divider
} from 'antd'
import './currency.less'
import { SiteCurrencyForm,ExchangeRateForm } from '../../components'
import { getSiteCurrency,modifySiteCurrency,getExchangeRate,setExchangeRate} from '../../requests'
import axios from 'axios'
       
export default class Currency extends Component {
    constructor(){
        super()
        this.state = {
            siteInfo:[],
            exchangeRate:{},
            hasLoaded:false,
            isLoading:false
        }
    }

    //values:{site: "SLUS", currency: "USD"}
    setSiteCurrency = async(values) =>{
        let _siteInfo = [...this.state.siteInfo]
        _siteInfo.map(item=>{
            if(item.site === values.site){
                item.currency = values.currency
            }
            return item
        })

        this.setState({
            isLoading:true
        })
        let siteRes = await modifySiteCurrency(values)
        if(siteRes.status === 'success'){
            message.success(siteRes.msg)
            this.setState({ isLoading:false })
            this.initData()
        }else if(siteRes.status === 'failed'){
            message.warn(siteRes.msg)
            this.setState({ isLoading:false })
        }else{

        }
    }

    //values: {currency: "USD", exchangeRate: 6.52}
    setExchangeRate = async(values)=>{
        let _exchangeRate = Object.assign({},this.state.exchangeRate)
        if(_exchangeRate[values.currency]){
            _exchangeRate[values.currency] = values.exchangeRate
        }

        this.setState({
            isLoading:true
        })
 
        let exRes = await setExchangeRate(values)
        if(exRes.status === 'success'){
            message.success(exRes.msg)
            this.setState({ isLoading:false })
            this.initData()
        }else if(exRes.status === 'failed'){
            message.warn(exRes.msg)
            this.initData()
            this.setState({ isLoading:false })
        }else{

        }
    }

    initData = () =>{
        axios.all([
            getSiteCurrency(),
            getExchangeRate()
        ])
        .then(axios.spread((currencyResp,exchangeResp)=>{
            this.setState({
                siteInfo:currencyResp.list,
                exchangeRate:exchangeResp.exchangeRate
            })
        }))
        .catch(err=>{
            console.log(err)
        })   
        .finally(()=>{
            this.setState({
                hasLoaded:true
            })
        })
    }

    componentDidMount(){
        this.initData()
    }
    render() {
        return (
            this.state.hasLoaded
            ?
            <>
                <Spin spinning={this.state.isLoading}>
                <div className="site-statistic-demo-card">
                    <Row justify="space-between" gutter={24}>
                        {
                            this.state.siteInfo.map((item,index)=>{
                                return(
                                    <Col span={4} key={item.site}>
                                        <Card >
                                        <Statistic
                                            title={item.site}
                                            value={this.state.exchangeRate[item.currency]}
                                            precision={2}
                                            valueStyle={ index % 2 === 1 ? { color:'#3f8600' }: { color: '#cf1322' }}
                                            prefix={item.currency+":"}
                                        />
                                        </Card>
                                    </Col>
                                )
                            })
                        }
                    </Row>
                </div>
                <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}>
                    设置站点结算货币
                </Divider>
                <div className="horizontal-form">
                    <SiteCurrencyForm 
                        siteInfo={this.state.siteInfo}
                        exchangeRate = {this.state.exchangeRate}
                        setSiteCurrency={this.setSiteCurrency} 
                    />
                </div>
                <Divider orientation="left" style={{ color: '#333', fontWeight: 'normal' }}>
                    设置货币兑人民币汇率
                </Divider>
                <div className="horizontal-form">
                    <ExchangeRateForm 
                        exchangeRate={this.state.exchangeRate}
                        setExchangeRate={this.setExchangeRate}
                    />
                </div>
                </Spin>
            </>
            :
            null
        )
    }
}
