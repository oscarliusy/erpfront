import React, { Component } from 'react'
import { 
    Tabs,
    Table,
    Button,
    Spin,
    Drawer,
    Card
 } from 'antd'
import './imlogs.less'
import { timeStamp2date } from '../../assets/lib/utils'
import {getMaterialEditLogs,getMaterialInstockLogs,getInstockDetailById} from '../../requests'
 
const { TabPane } = Tabs
const titleDisplayMap = {
    id:'编号',
    uniqueId:'唯一识别码',
    c_time:'时间',
    user:'用户',
    description:'备注',
    amountIn:'入库数量',
    amount:'当前数量',
    createAt:'时间',
    action:'操作内容'
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

            currentTab:"",

            visible:false,
            idDrawer:0,
            columnsDrawer:[],
            dataSourceDrawer:[],
            offsetDrawer:0,
            limitedDrawer:10,
            totalDrawer:0,

            isLoadingTab:false,
            isLoadingDrawer:false
        }
    }

    callback= (key) =>{
        this.setState({
            currentTab:key
        },()=>{
            this.getData()
        })
    }

    toInstockDetail = (record) =>{
        this.setState({
            idDrawer:record.id
        })
        this.showDrawer()
    }

    showDrawer = () => {
        this.setState({
          visible: true,
          currentTab:'drawer'
        },()=>{
            this.getData()
        })

    }

    onClose = () => {
        this.setState({
          visible: false,
          currentTab:"tab1",
          columnsDrawer:[],
          dataSourceDrawer:[],
          totalDrawer:[]
        });
    }

    renderDrawer = () => {     
        this.setState({
            isLoadingDrawer:true
        })
        getInstockDetailById(
            this.state.idDrawer,
            this.state.offsetDrawer,
            this.state.limitedDrawer
        )
        .then(resp=>{
            const {columns,dataSource} = this.buildColumnsDataSource(resp)
            if(!this.updater.isMounted(this)) return
            this.setState({
                columnsDrawer:columns,
                dataSourceDrawer:dataSource,
                totalDrawer:resp.total
            })
        })
        .catch(err=>{
            console.log(err)
        })
        .finally(()=>{
            this.setState({
                isLoadingDrawer:false
            }) 
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
        if(tabName === "tab1"){
            columns.push({
                title:'操作',
                key:'action',
                render:(text,record)=>{
                  return (
                    <Button size="small" type="primary" onClick={this.toInstockDetail.bind(this,record)}>查看详情</Button>
                  )
                }
            })
        }
        return columns
    }

    buildColumnsDataSource = (resp)=>{
        console.log('detail:',resp)
        const columnsKeys = Object.keys(resp.list[0])
        const columns = this.createColumns(columnsKeys,this.state.currentTab)
        const dataSource = resp.list.map(item=>{
            if(item.c_time){
                let dateFormat = timeStamp2date(item.c_time)
                item.c_time = dateFormat
            }
            if(item.createAt){
                let dateFormat2 = timeStamp2date(item.createAt)
                item.createAt = dateFormat2
            }
            return item
        })
        return {columns,dataSource}
    }

    renderTab1=()=>{
        this.setState({
            isLoadingTab:true
        })
        
        getMaterialInstockLogs(this.state.offsetTab1,this.state.limitedTab1)
        .then(resp=>{
            const {columns,dataSource} = this.buildColumnsDataSource(resp)
            if(!this.updater.isMounted(this)) return
            this.setState({
                columnsTab1:columns,
                dataSourceTab1:dataSource,
                totalTab1:resp.total
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

    renderTab2 = () =>{
        this.setState({
            isLoadingTab:true
        })
        getMaterialEditLogs(this.state.offsetTab2,this.state.limitedTab2)
        .then(resp=>{
            const {columns,dataSource} = this.buildColumnsDataSource(resp)
            if(!this.updater.isMounted(this)) return
            this.setState({
                columnsTab2:columns,
                dataSourceTab2:dataSource,
                totalTab2:resp.total
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
        switch (this.state.currentTab){
            case "tab1":
                this.renderTab1()
                return
            case "tab2":
                this.renderTab2()
                return
            case "tab3":
                console.log('tab3')
                return
            case "drawer":
                this.renderDrawer()
                return
            default:
                return
        }

    }

    onPageChangeTab = (page, pageSize) =>{
        switch(this.state.currentTab){
            case "tab1":
                this.setState({
                    offsetTab1:pageSize*(page - 1),
                    limitedTab1:pageSize
                  },()=>{
                    this.getData()
                })
                return
            case "tab2":
                this.setState({
                    offsetTab2:pageSize*(page - 1),
                    limitedTab2:pageSize
                    },()=>{
                    this.getData()
                })
                return
            case "drawer":
                this.setState({
                    offsetDrawer:pageSize*(page - 1),
                    limitedDrawer:pageSize
                    },()=>{
                    this.getData()
                })
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
            <>
                <Spin spinning={this.state.isLoadingTab}>
                <div className="tab-container">
                    <Tabs onChange={this.callback} type="card">
                        <TabPane tab="入库" key="tab1">
                            <Table 
                                dataSource = {this.state.dataSourceTab1} 
                                columns = {this.state.columnsTab1} 
                                rowKey = {record => record.id}
                                pagination = {{
                                    total:this.state.totalTab1,
                                    onChange : this.onPageChangeTab,
                                }}
                            />
                        </TabPane>
                        <TabPane tab="物料编辑" key="tab2">
                            <Table 
                                dataSource = {this.state.dataSourceTab2} 
                                columns = {this.state.columnsTab2} 
                                rowKey = {record => record.id}
                                pagination = {{
                                    total:this.state.totalTab2,
                                    onChange : this.onPageChangeTab,
                                }}
                            />
                        </TabPane>
                        <TabPane tab="其他" key="tab3">
                            等PM设计好了再做
                        </TabPane>
                    </Tabs>
                </div>
                </Spin>
                
                <div>
                    <Drawer
                        title="入库详情"
                        placement="right"
                        closable={true}
                        onClose={this.onClose}
                        visible={this.state.visible}
                        width={800}
                        destroyOnClose={true}
                    >
                        <div style={{width:"700px",padding:"10px"}}>
                            <Card
                            bordered={false}
                            > 
                                <Spin spinning={this.state.isLoadingDrawer}>
                                    <div>
                                        <Table 
                                            rowKey={record=>record.uniqueId}
                                            columns={this.state.columnsDrawer} 
                                            dataSource={this.state.dataSourceDrawer} 
                                            pagination={{
                                                total:this.state.totalDrawer,
                                                onChange : this.onPageChangeTab,
                                                pageSize:10
                                            }}
                                        />
                                    </div>
                                </Spin>
                            </Card>
                        </div> 
                    </Drawer>
                </div>
               
            </>
        )
    }
}
