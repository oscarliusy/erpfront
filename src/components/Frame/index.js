import React, { Component } from 'react'
import { Layout, Menu, Icon,Dropdown,Avatar,Badge } from 'antd'
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
    rootSubmenuKeys = ['sub1', 'sub2', 'sub3'];

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
        this.setState({ 
            collapsed,
            openKeys:[]
         });
      };

    onMenuClick=({key})=>{
        this.props.history.push({
            pathname:key
        })
    }

    onDropdownMenuClick=({key})=>{
        
        this.props.history.push({pathname:key})
    }

    renderDropdown=()=> (
        <Menu onClick={this.onDropdownMenuClick}>
          <Menu.Item
            key="/erp/comm/user/notifications"
          >
            <Badge dot={true}>
              通知中心
            </Badge>
          </Menu.Item>
          <Menu.Item
            key="/erp/comm/user/profile/:id"
            >
            个人设置
          </Menu.Item>
          <Menu.Item
            key="/login"
          >
            退出登录(bug)
          </Menu.Item>
        </Menu>
      );

    render() {
        //console.log(this.props)
        return (
            <Layout style={{minHeight:'100%'}}>
                <Header className="header spl-header">
                    <div className="spl-logo" >
                        <img src={logo} alt="SPLADMIN"/>
                    </div> 
                    <Dropdown overlay={this.renderDropdown()} trigger={['click','hover']}>
                        <div style={{display:'flex',alignItems:'center'}}> 
                            <Avatar  src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                            <span>欢迎您！oscar</span> 
                            <Badge count="10" offset={[0,0]}>
                            <Icon type="down" />
                            </Badge> 
                        </div>      
                    </Dropdown>
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
                            onClick = {this.onMenuClick}
                        >
                        <Menu.Item key="/erp/comm/user/dashboard">
                            <Icon type="dashboard" />
                            <span>仪表盘</span>
                        </Menu.Item>
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
                            title={<span><Icon type="gift" /> 产品 </span>}
                            onClick = {this.onMenuClick}
                        >
                            {
                                this.props.commonProductMenu.map(item => {
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
                            key="sub3"
                            title={<span><Icon type="trophy" /> 高级 </span>}
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