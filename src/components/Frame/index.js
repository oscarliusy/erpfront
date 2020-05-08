import React, { Component } from 'react'
import { Layout, Menu, Icon,Dropdown,Avatar,Badge } from 'antd'
import { withRouter } from 'react-router-dom'
import logo  from './logo.png'
import './Frame.less'
import { connect } from 'react-redux' 
import {signOut } from '../../actions/user'
import { updateNotificationList } from '../../actions/notification'
//import { socket } from '../../requests'

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const mapState=(state)=>({
    username:state.user.username,
    avatar:state.user.avatar,
    unreadNotifacationNumber:state.notification.unread
})

@connect(mapState,{ signOut,updateNotificationList })
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
        if(key === '/signin'){
            this.props.signOut()
        }
        this.props.history.push({pathname:key})
    }

    renderDropdown=()=> (
        <Menu onClick={this.onDropdownMenuClick}>
          <Menu.Item
            key="/erp/comm/user/notifications"
          >
            <Badge dot={Boolean(this.props.unreadNotifacationNumber)}>
              通知中心
            </Badge>
          </Menu.Item>
          <Menu.Item
            key="/erp/comm/user/profile/:id"
            >
            个人设置
          </Menu.Item>
          <Menu.Item
            key="/signin"
          >
            退出登录
          </Menu.Item>
        </Menu>
      )

    // initNotificationList = () =>{
    //     socket.emit('signIn')
    //     socket.on('updateNotificationList',(msgObj)=>{
    //         this.props.updateNotificationList(msgObj)
    //     })
    // }

    componentDidMount(){
        //this.initNotificationList()
    }

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
                            <Avatar  src={this.props.avatar} />
                            <span>欢迎您！{this.props.username}</span> 
                            <Badge count={this.props.unreadNotifacationNumber} offset={[0,0]}>
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