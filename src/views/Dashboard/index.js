import React, { Component,createRef } from 'react'
import{
    Card,
    Row,
    Col,
    Spin
} from 'antd'
import echarts from 'echarts'
import { connect } from 'react-redux'
import './dashboard.less'
import { dashboardStatisticPost } from '../../actions/dashboard'

const mapState = state => {
    const {
        isLoading,
        instockAmount,
        outstockAmount,
        totalSales,
        returns,
        saleList
    } = state.dashboard
    return {
        isLoading,
        instockAmount,
        outstockAmount,
        totalSales,
        returns,
        saleList      
    }
}

@connect(mapState,{dashboardStatisticPost})
class Dashboard extends Component {
    constructor(){
        super()
        this.saleListChartRef = createRef()
    }

    initSaleListChart = () =>{
        this.saleListChart = echarts.init(this.saleListChartRef.current)
        const option = {
            xAxis:{
                type:'category',
                boundaryGap: false,
                data:this.props.saleList.map(item => item.week )    
            },
            yAxis:{
                type:'value'
            },
            series:[{
                data:this.props.saleList.map(item => item.sale),
                type:'line',
                areaStyle:{}
            }]
        }
        this.saleListChart.setOption(option)      
    }

    componentDidMount(){
        this.props.dashboardStatisticPost()
        //this.initSaleListChart()       
    }

    componentDidUpdate(){
        this.initSaleListChart()
    }

    render() {
        return (
            <>
                <Spin spinning={this.props.isLoading}>
                    <Card 
                    title='一周信息概览'
                    bordered={false}
                    >
                        <Row gutter={16}>
                            <Col className="gutter-row" span={6}>
                                <div className="gutter-box" style={{backgroundColor:'#29B6F6'}}>
                                    <div>
                                        入库(件):
                                        <span className="in-gutter-box">{this.props.instockAmount}</span>
                                    </div>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <div className="gutter-box" style={{backgroundColor:'#AB47BC'}}>
                                    <div>
                                        出库(件):
                                        <span className="in-gutter-box">{this.props.outstockAmount}</span>
                                    </div>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <div className="gutter-box" style={{backgroundColor:'#FF7043'}}>
                                    <div>
                                        销售总额$:
                                        <span className="in-gutter-box">{this.props.totalSales}</span>
                                    </div>
                                </div>
                            </Col>
                            <Col className="gutter-row" span={6}>
                                <div className="gutter-box" style={{backgroundColor:'#43A047'}}><div>
                                        退货(件):
                                        <span className="in-gutter-box">{this.props.returns}</span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Card>

                    <Card 
                    title='近十周销售量'
                    bordered={false}
                    >
                        <div ref={this.saleListChartRef} style={{height:'400px'}}/>
                    </Card>
                    <div style={{textAlign: 'center',color:'black'}}>
                        <a href="https://beian.miit.gov.cn">京ICP备20026508号-1</a>
                    </div>
                </Spin>
            </>
        )
    }
}

export default  Dashboard