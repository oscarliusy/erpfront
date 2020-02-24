import React, { Component } from 'react'
import { 
    Tabs,
    Table
 } from 'antd'
import './imlogs.less'
import moment from 'moment'
import {getMaterialEditLogs} from '../../requests'

const { TabPane } = Tabs
const titleDisplayMap = {
    id:'编号',
    uniqueId:'唯一识别码',
    creatAt:'时间',
    user:'用户',
}

export default class IMLogs extends Component {
    constructor(){
        super()
        this.state = {
            columnsTab1:[],
            dataSourceTab1:[],
            offsetTab1:0,
            limitedTab1:10,
            totalTab1:0,

            columnsTab2:[],
            dataSourceTab2:[],
            offsetTab2:0,
            limitedTab2:10,
            totalTab2:0,

            columnsTab3:[],
            dataSourceTab3:[],
            offsetTab3:0,
            limitedTab3:10,
            totalTab3:0,

            currentTab:""
        }
    }
    callback= (key) =>{
        this.setState({
            currentTab:key
        },()=>{
            this.getData()
        })
    }


    createColumns = (columnsKeys) =>{
        const columns = columnsKeys.map(item=>{
            return {
                title:titleDisplayMap[item],
                dataIndex:item,
                key:item
            }
        })
        return columns
    }

    renderTab1=()=>{
        getMaterialEditLogs(this.state.offsetTab1,this.state.limitedTab1)
        .then(resp=>{
            const columnsKeys = Object.keys(resp.list[0])
            const columns = this.createColumns(columnsKeys)
            const _dataSource = resp.list.map(item=>{
                item.createAt = moment(item.createAt).format('YYYY-MM-DD HH:mm:ss')
                return item
            })
            if(!this.updater.isMounted(this)) return
            this.setState({
                columnsTab1:columns,
                dataSourceTab1:_dataSource,
                totalTab1:resp.total
            })
        })
    }

    getData = () =>{
        switch (this.state.currentTab){
            case "tab1":
                this.renderTab1()
                return
            case "tab2":
                console.log(2)
                return
            case "tab3":
                console.log(3)
                return
            default:
                return
        }

    }


    componentDidMount(){
        this.callback("tab1")
    }

    render() {
        return (
            <div className="tab-container">
                <Tabs onChange={this.callback} type="card">
                    <TabPane tab="入库" key="tab1">
                        <Table 
                            dataSource = {this.state.dataSourceTab1} 
                            columns = {this.state.columnsTab1} 
                            rowKey = {record => record.id}
                            pagination = {{
                                total:this.state.totalTab1
                            }}
                        />
                    </TabPane>
                    <TabPane tab="物料编辑" key="tab2">
                        Content of Tab Pane 2
                    </TabPane>
                    <TabPane tab="其他" key="tab3">
                        Content of Tab Pane 3
                    </TabPane>
                </Tabs>
            </div>
        )
    }
}
