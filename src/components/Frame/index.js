import React, { Component } from 'react'
import { Layout, Menu, Icon } from 'antd'
import { withRouter } from 'react-router-dom'
import logo  from './logo.png'
import './Frame.less'
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

@withRouter
class Frame extends Component {
    constructor(){
        super()
        this.state={
            collapsed: false,
            openKeys:['sub1']
        }
    }
    rootSubmenuKeys = ['sub1', 'sub2', 'sub3','sub4','sub5'];

    onOpenChange = openKeys => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
          this.setState({ openKeys });
        } else {
          this.setState({
            openKeys: latestOpenKey ? [latestOpenKey] : [],
          });
        }
      }

    onCollapse = collapsed => {
        this.setState({ collapsed });
      };

    onMenuClick=({key})=>{
        this.props.history.push({
            pathname:key
        })
    }
    render() {
        //console.log(this.props)
        return (
            <Layout style={{minHeight:'100%'}}>
                <Header className="header spl-header">
                    <div className="spl-logo" >
                        <img src={logo} alt="SPLADMIN"/>
                    </div> 
                    {/* TODO: Dropdown*/}
                </Header>
                <Layout>
                    <Sider 
                        width={200} 
                        style={{ background: '#fff' }}
                        collapsible
                        collapsed={this.state.collapsed} 
                        onCollapse={this.onCollapse}
  
                    >
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{ height: '100%', borderRight: 0 }}
                            openKeys={this.state.openKeys}
                            onOpenChange={this.onOpenChange}
                        >
                        <SubMenu
                            key="sub1"
                            title={<span><Icon type="build" /> 物料 </span>}
                            onClick = {this.onMenuClick}
                        >
                            {
                                this.props.commonMaterialMenu.map(item => {
                                    return (
                                        <Menu.Item key={item.pathname}>
                                            <Icon type={item.icon} />
                                            <span>{item.title}</span>
                                        </Menu.Item>
                                    )
                                })
                            }
                        </SubMenu>
                        <SubMenu
                            key="sub2"
                            title={
                            <span>
                                <Icon type="laptop" />
                                产品
                            </span>
                            }
                        >
                            <Menu.Item key="5">option5</Menu.Item>
                            <Menu.Item key="6">option6</Menu.Item>
                            <Menu.Item key="7">option7</Menu.Item>
                            <Menu.Item key="8">option8</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub3"
                            title={
                            <span>
                                <Icon type="notification" />
                                设置
                            </span>
                            }
                        >
                            <Menu.Item key="9">option9</Menu.Item>
                            <Menu.Item key="10">option10</Menu.Item>
                            <Menu.Item key="11">option11</Menu.Item>
                            <Menu.Item key="12">option12</Menu.Item>
                        </SubMenu>
                        <SubMenu
                            key="sub4"
                            title={
                            <span>
                                <Icon type="notification" />
                                仪表盘
                            </span>
                            }
                        >
                        </SubMenu>
                        <SubMenu
                            key="sub5"
                            title={<span><Icon type="trophy" /> 高级操作 </span>}
                            onClick = {this.onMenuClick}
                        >
                                {
                                this.props.adminMenu.map(item => {
                                    return (
                                        <Menu.Item key={item.pathname}>
                                            <Icon type={item.icon} />
                                            <span>{item.title}</span>
                                        </Menu.Item>
                                    )
                                })
                            }
                        </SubMenu>
                        </Menu>
                    </Sider>                                            
                    <Layout style={{ padding: '16px' }}>
                        <Content
                        style={{
                            background: '#fff',
                            margin: 0,
                        }}
                        >
                        { this.props.children}
                        </Content>
                    </Layout>       
                </Layout>
            </Layout>
        )
    }
}

export default Frame