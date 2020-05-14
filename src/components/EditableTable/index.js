import React, { Component } from 'react'
import { Table, Button, Popconfirm,Icon } from 'antd'
import { connect } from 'react-redux'
import { addEmptyRowToInstockTable,deleteInstockRow,saveInstockRowModify } from '../../actions/instockTable'
import { EditableCell,EditableFormRow} from '../EditableComponent'

const mapState = state =>{
    const {
        dataSource,
        count
    } = state.instockTable

    return {
        dataSource,
        count
    }
}

@connect(mapState,{addEmptyRowToInstockTable,deleteInstockRow,saveInstockRowModify})
class EditableTable extends Component {
    constructor(props){
        super(props)
        this.columns = [
            {
                title:'序号',
                dataIndex:'key'
            },
            {
                title:'入库数',
                dataIndex:'instockAmount',
                editable:true
            },
            {
                title:'唯一识别码',
                dataIndex:'uniqueId',
            },
            {
                title:'库存',
                dataIndex:'amount',
            },
            {
                title:'详细信息',
                dataIndex:'description'
            },
            {
                title:'操作',
                dataIndex:'operation',
                render:(text,record) =>
                    this.props.dataSource.length >=1 ? (
                        <>
                            <Popconfirm title="确认删除该行？" onConfirm={()=> this.handleDelete(record.key)}>
                                <span style={{color:"blue"}}>删除</span>
                            </Popconfirm>
                            <Button style={{ marginLeft:"20px"}} onClick={()=>this.handleSearch(record.key)}>
                                <Icon type="search" />
                            </Button>
                        </>
                    ) : null 
            }
        ]
    }

    handleSearch = key =>{
        //console.log('search:',key)
        this.props.setSelectedSearchRowKey(key)
        this.props.showDrawer()
        this.props.setDrawerSubmitDisable()
    }

    handleDelete = key => {
        const dataSource = [...this.props.dataSource].filter(item=>item.key !== key)
        this.props.deleteInstockRow(dataSource)
    }

    handleAdd = () => {
        const { count,dataSource } = this.props
        const newData = {
            key: count,
            instockAmount:0,
            uniqueId:'uniqueId',
            amount:'amount',
            description:'description'
        }
        this.props.addEmptyRowToInstockTable({
            dataSource:[...dataSource,newData],
            count:count+1
        })
    }

    handleSave = row => {
        const newData = [...this.props.dataSource]
        const index = newData.findIndex(item => row.key === item.key)//返回数组中满足条件的第一个元素的索引。否则返回-1
        const item = newData[index]
        newData.splice(index,1,{
            ...item,
            ...row,
        })
        this.props.saveInstockRowModify(newData)
    }

    render(){
        //console.log('props:',this.props)
        const { dataSource } = this.props
        const components = {
            body: {
                row: EditableFormRow,
                cell:EditableCell
            }
        }
        const columns = this.columns.map(col => {
            if(!col.editable){
                return col
            }
            return {
                ...col,
                onCell: record =>({
                    record,
                    editable: col.editable,
                    dataIndex: col.dataIndex,
                    title: col.title,
                    handleSave: this.handleSave 
                })
            }
        })
        return(
            <div>
                <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                    Add a row
                </Button>
                <Table 
                    components={components}
                    rowClassName={()=> 'editable-row'}
                    bordered
                    dataSource={dataSource}
                    columns={columns}
                />
            </div>
        )
    }
    
}

export default EditableTable