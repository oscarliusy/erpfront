/*
*TODO: 导出excel还没写，没确定是导出当前页还是所有数据。
*/



import React, { Component } from 'react'
import { 
    Card,
    Table,
    Button,
    Input,
    Icon,
    Spin,
    Modal, message
} from 'antd'
import { getInventoryMaterialList,deleteIMItem,getIMtotalNumber } from '../../requests'

const { confirm } = Modal;


const { Search } = Input
const titleDisplayMap = {
        id:'编号',
        uniqueId:'唯一识别码',
        amount: '库存数量',
        description:'详细信息',
        purchaser:'采购人',
        price: '采购价(￥)',
        image:'缩略图',
        isLoading:false
}

//物料库存页
export default class IMList extends Component {
    constructor(){
        super()
        this.state={
            columns:[],
            dataSource:[],
            totalInventory:0,
            offset:0,
            limited:10,
            searchword:'',
            sort:1,
            totalIMNumberString:'未计算'

        }
    }
    sortByAmount=()=>{
        const newsort = this.state.sort === 1 ? -1 :1
        this.setState({
            sort: newsort
        },()=>{
            this.getData()
        })
        
    }

    showConfirm = (record,getData) => {
        confirm({
          title: '你确定要删除该物料么？',
          content: `${record.uniqueId} 数量: ${record.amount}`,
          onOk() {
            deleteIMItem(record.id)
            .then(resp=>{
                if(resp.status === 'success'){
                    message.success('已成功删除')
                    getData() //刷新页面数据，不跳转
                }else{
                    message.error('删除失败，请刷新确认')
                }
            })
          },
          onCancel() {
            console.log('Cancel');
          },
        });
      }

    createColumns = (columnsKeys) =>{
        const columns = columnsKeys.map(item=>{
            if( item === 'image'){
                return {
                    title:titleDisplayMap[item],
                    key:item,
                    render:(text,record)=>{
                        return (
                            <img src={record.image} alt={record.image} style={{width:"60px",height:"60px"}}/>
                        )
                    }
                }
            }
            if( item === 'amount'){
                return {
                title:<span onClick={this.sortByAmount}>
                        {titleDisplayMap[item]}
                        <Icon type="swap" />
                      </span>,
                key:item,
                dataIndex:item
                }
            }
            return {
                title:titleDisplayMap[item],
                dataIndex:item,
                key:item
            }
        })
        columns.push({
            title:'操作',
            key:'action',
            render:(text,record)=>{
              return (
                <>
                    <Button size="small" type="primary" onClick={this.toEdit.bind(this,record)}>编辑</Button>
                    <Button  size="small" type="default" disabled
                        onClick={this.showConfirm.bind(this,record,this.getData)}
                        style = {{marginLeft:"5px"}} 
                    >删除</Button>
                </>
              )
            }
        })
        return columns
    }

    toEdit = (record) =>{
        window.open(`#/erp/comm/material/edit/${record.id}`)
    }

    getData = () =>{
        this.setState({isLoading:true})
        getInventoryMaterialList(this.state.offset,this.state.limited,this.state.searchword,this.state.sort)
        .then(resp=>{        
            const columnsKeys = Object.keys(resp.list[0])
            columnsKeys.splice(0,1)//不在table中显示id
            const colunms = this.createColumns(columnsKeys)
            if(!this.updater.isMounted(this)) return
            this.setState({
                columns:colunms,
                dataSource:resp.list,
                totalInventory:resp.totalInventory
            })
        })
        .catch(err=>{
            console.log(err)
        })
        .finally(()=>{
            this.setState({isLoading:false})
        })
    }

    onPageChange=(page, pageSize)=>{
        this.setState({
          offset:pageSize*(page - 1),
          limited:pageSize
        },()=>{
          this.getData()
        })
    }

    onShowSizeChange=(current, size)=>{
        //变更页面回到首页
        this.setState({
          offset:0,
          limited:size
        },()=>{
          this.getData()
        })
    }
    
    onSearch = (value)=>{
        this.setState({
             searchword:value
        },()=>{
            this.getData()
        })
    }

    toExcel = () =>{
        console.log("还没有开发")
    }

    getTotalNum = async() =>{
        this.setState({isLoading:true})
        const resp = await getIMtotalNumber()
        this.setState({
            totalIMNumberString:String(resp.totalNum)
        })
        this.setState({isLoading:false})
    }

    componentDidMount(){
        this.getData()
    }

    render() {
        return (
            <Spin spinning={this.state.isLoading}>
                <Card
                    title={
                        <>
                             <span>当前物料种类：{this.state.totalInventory}</span>
                             <span style = {{marginLeft:"20px"}}>物料总数：{this.state.totalIMNumberString}</span>
                        </>}
                    bordered={false}
                    extra={
                        <>
                            <Button onClick={this.getTotalNum} type="primary">计算物料总数</Button>
                            <Button onClick={this.toExcel} style = {{marginLeft:"10px"}}>导出当前页excel</Button>
                        </>
                    }
                >
                    <div style={{width:"600px",padding:"10px"}}>
                        <Search
                            placeholder="输入唯一识别码或详细信息进行搜索"
                            enterButton="Search"
                            size="large"
                            onSearch={value=>{this.onSearch(value)}}                        
                        />
                    </div>
                    <Table
                        rowKey={record=>record.id}
                        dataSource={this.state.dataSource}
                        columns={this.state.columns}
                        pagination={{
                            total:this.state.totalInventory,
                            onChange : this.onPageChange,
                            hideOnSinglePage:true,
                            showQuickJumper:true,
                            showSizeChanger:true,
                            onShowSizeChange:this.onShowSizeChange,
                            current: this.state.offset / this.state.limited + 1,
                            pageSizeOptions:['10','20','50']
                        }}
                    />
                </Card>
            </Spin>
        )
    }
}
