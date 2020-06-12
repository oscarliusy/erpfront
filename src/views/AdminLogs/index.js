import React, { Component } from 'react'
import { getAccountCurrencyLogs,getAccountManageLogs } from '../../requests'
import { 
    Tabs,
    Table,
    Spin
 } from 'antd'
import moment from 'moment'
 
const { TabPane } = Tabs
const titleDisplayMap = {
    id:'Id',
    site:'站点',
    createAt:'时间',
    user:'用户',
    action:'操作内容',
    userAdmin:'管理员',
    currency:'币种' 

}
export default class AdminLogs extends Component {
    constructor(){
        super()
        this.requestList = [
            getAccountManageLogs,
            getAccountCurrencyLogs
        ]
        this.tabList = [
            {
                tabName:"账号管理",
                key:0
            },{
                tabName:"汇率修改",
                key:1
            }
        ]
        this.state = {
            columnsTab:[],
            dataSourceTab:[],
            offsetTab:0,
            limitedTab:10,
            totalTab:0,

            currentTab:0,
            isLoadingTab:false,
        }
    }

    callback= (key) =>{
        this.setState({
            currentTab:key
        },()=>{
            this.getData()
        })
    }

    createColumns = (columnsKeys,tabName) =>{
        const columns = columnsKeys.map(item=>{
            return {
                title:titleDisplayMap[item],
                dataIndex:item,
                key:item
            }
        })
        return columns
    }

    buildColumnsDataSource = (resp)=>{
        const columnsKeys = Object.keys(resp.list[0])
        const columns = this.createColumns(columnsKeys,this.state.currentTab)
        const dataSource = resp.list.map(item=>{
            if(item.createAt) item.createAt = moment(item.createAt).format('YYYY-MM-DD HH:mm:ss')
            return item
        })
        return {columns,dataSource}
    }

    renderTab = (index) =>{
        this.setState({
            isLoadingTab:true
        })
        this.requestList[index](this.state.offsetTab,this.state.limitedTab)
        .then(resp=>{
            const {columns,dataSource} = this.buildColumnsDataSource(resp)
            if(!this.updater.isMounted(this)) return
            this.setState({
                columnsTab:columns,
                dataSourceTab:dataSource,
                totalTab:resp.total
            })
        })
        .catch(err=>{
            console.log(err)
        })
        .finally(()=>{
            this.setState({
                isLoadingTab:false
            }) 
        })
    }

    getData = () =>{
        this.renderTab(this.state.currentTab)
    }

    onPageChangeTab = (page, pageSize) =>{
        this.setState({
            offsetTab:pageSize*(page - 1),
            limitedTab:pageSize
            },()=>{
            this.getData()
        })
    }

    componentDidMount(){
        this.callback(0)
    }

    render() {
        return (
            <>
                <Spin spinning={this.state.isLoadingTab}>
                <div className="tab-container">
                    <Tabs onChange={this.callback} type="card">
                        {
                            this.tabList.map(item=>{
                                return(
                                    <TabPane tab={item.tabName} key={item.key}>
                                        <Table 
                                            dataSource = {this.state.dataSourceTab}
                                            columns = {this.state.columnsTab} 
                                            rowKey = {record => record.id}
                                            pagination = {{
                                                total:this.state.totalTab,
                                                onChange : this.onPageChangeTab,
                                            }}
                                        />
                                    </TabPane>
                                )
                            })
                        }
                    </Tabs>
                </div>
                </Spin>
            </>
        )
    }
}
