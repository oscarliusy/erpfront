import React, { Component } from 'react'
import { Table, Input, Button, Popconfirm, Form,Icon } from 'antd'
import { connect } from 'react-redux'
import { saveProductConstructTable } from '../../actions/productTable'

const EditableContext = React.createContext()

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
      <tr {...props} />
    </EditableContext.Provider>
)

const EditableFormRow = Form.create()(EditableRow)

class EditableCell extends React.Component {
    state = {
      editing: false,
    };
  
    toggleEdit = () => {
      const editing = !this.state.editing;
      this.setState({ editing }, () => {
        if (editing) {
          this.input.focus();
        }
      });
    };
  
    save = e => {
      const { record, handleSave } = this.props;
      this.form.validateFields((error, values) => {
        if (error && error[e.currentTarget.id]) {
          return;
        }
        this.toggleEdit();
        handleSave({ ...record, ...values });
      });
    };
  
    renderCell = form => {
      this.form = form;
      const { children, dataIndex, record, title } = this.props;
      const { editing } = this.state;
      return editing ? (
        <Form.Item style={{ margin: 0 }}>
          {form.getFieldDecorator(dataIndex, {
            rules: [
              {
                required: true,
                message: `${title} is required.`,
              },
            ],
            initialValue: record[dataIndex],
          })(<Input ref={node => (this.input = node)} onPressEnter={this.save} onBlur={this.save} />)}
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{ paddingRight: 24 }}
          onClick={this.toggleEdit}
        >
          {children}
        </div>
      );
    };
  
    render() {
      const {
        editable,
        dataIndex,
        title,
        record,
        index,
        handleSave,
        children,
        ...restProps
      } = this.props;
      return (
        <td {...restProps}>
          {editable ? (
            <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
          ) : (
            children
          )}
        </td>
      );
    }
}

const mapState = (state) =>{
    const { 
        materials,
        count    
    } = state.productTable
    return {
        materials,
        count
    } 
}


@connect(mapState,{ saveProductConstructTable })
class ProductEditTable extends Component {
  constructor(props){
      super(props)
      this.state = {
      }
      this.columns = [
          {
              title:'序号',
              dataIndex:'key'
          },
          {
              title:'唯一识别码',
              dataIndex:'uniqueId',
          },
          {
              title:'所需数量',
              dataIndex:'amount',
              editable:true
          },
          {
              title:'操作',
              dataIndex:'operation',
              render:(text,record) =>
                  this.props.materials.length >=1 ? (
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
      this.props.setSelectedSearchRowKey(key)
      this.props.showDrawer()
      this.props.setDrawerSubmitDisable()
  }

  handleDelete = key => {
      const {count,materials} = this.props
      const _materials = [...materials].filter(item=>item.key !== key)

      this.props.saveProductConstructTable({
          materials:_materials,
          count:count
      })
  }

  handleAdd = () => {
      const {count,materials} = this.props
      const newData = {
          key: count,
          uniqueId:'uniqueId',
          amount:'amount'
      }
      this.props.saveProductConstructTable({
          materials:[...materials,newData],
          count:count+1
      })
  }

  handleSave = row => {
    const _materials = [...this.props.materials]
    const index = _materials.findIndex(item => row.key === item.key)//返回数组中满足条件的第一个元素的索引。否则返回-1
    const item = _materials[index]
    _materials.splice(index,1,{
        ...item,
        ...row,
    })
    this.props.saveProductConstructTable({
      materials:_materials,
      count:_materials.length+1
  })
}

  render() {
      const { materials} = this.props
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
      return (
        <div>
            <Button onClick={this.handleAdd} type="primary" style={{ marginBottom: 16 }}>
                Add a row
            </Button>
            <Table 
                components={components}
                rowClassName={()=> 'editable-row'}
                bordered
                dataSource={materials}
                columns={columns}
            />
        </div>
      )
    }
}

export default ProductEditTable