import React, { Component } from 'react'
import { getAccountList } from '../../requests'
import { 
    Card,
    Table,
    Button,
    Tag,
    Input,
    Spin
} from 'antd'
const { Search } = Input

const titleDisplayMap = {
    id:'编号',
    username:'姓名',
    department: '部门',
    position:'职级',
    authority:'权限',
    avatar: '头像',
    state:'状态'
}
export default class UserList extends Component {
    constructor(){
        super()
        this.state={
            columns:[],
            dataSource:[],
            total:0,
            offset:0,
            limited:10,
            searchword:'',
            isLoading:false
        }
    }

    toEdit = (record) =>{
        this.props.history.push(`/erp/admin/account/detail/${record.id}`)
    }

    onSearch = (value)=>{
        this.setState({
             searchword:value
        },()=>{
            this.getData()
        })
    }

    createColumns = (columnsKeys) =>{
        const columns = columnsKeys.map(item=>{
            if( item === 'avatar'){
                return {
                    title:titleDisplayMap[item],
                    key:item,
                    render:(text,record)=>{
                        return (
                            <img src={record.avatar} alt={record.avatar} style={{width:"60px",height:"60px"}}/>
                        )
                    }
                }
            }
            if( item === 'state'){
                return {
                    title:titleDisplayMap[item],
                    key:item,
                    render:(text,record)=>{
                        return (
                            <Tag 
                                color={
                                    record.state === "在职"
                                    ? 
                                    "#87d068"
                                    :
                                    "#f50"
                                }
                            >
                                {record.state}
                            </Tag>
                        )
                    }
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
                <Button size="small" type="primary" onClick={this.toEdit.bind(this,record)}>详情</Button>
              )
            }
        })
        return columns
    }

    getData = () =>{
        this.setState({isLoading:true})
        getAccountList(this.state.searchword,this.state.offset,this.state.limited)
        .then(resp=>{
            const columnsKeys = Object.keys(resp.list[0])
            const colunms = this.createColumns(columnsKeys)
            if(!this.updater.isMounted(this)) return
            this.setState({
                columns:colunms,
                dataSource:resp.list,
                total:resp.total
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

    toSignUp = () =>{
        this.props.history.push('/erp/admin/account/signup')
    }

    componentDidMount(){
        this.getData()
    }

    render() {
        return (
            <Spin spinning={this.state.isLoading}>
                <Card
                    title={<span>用户总数：{this.state.total}</span>}
                    bordered={false}
                    extra={<Button onClick={this.toSignUp}>新用户注册</Button>} 
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
                            total:this.state.total,
                            onChange : this.onPageChange,
                            hideOnSinglePage:true,
                            current: this.state.offset / this.state.limited + 1,
                        }}
                    />
                </Card>
            </Spin>
        )
    }
}

