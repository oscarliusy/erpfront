//这里没有对list数据增加pagination。

import React, { Component } from 'react'
import { 
    Card,
    Button,
    List, 
    Badge,
    Avatar,
} from 'antd'
import { connect} from 'react-redux'
import { socket } from '../../requests'

const mapState = (state) =>{
    const {
        total,
        list
    } = state.notification
    return {
        total,
        list
    }
}

@connect(mapState)
class Notifications extends Component {
    markNotificationHasreadById = (id) =>{
        //console.log(id)
        socket.emit('markHasreadById',(id))
    }

    markAllNotificationsHasread = () =>{
        socket.emit('markAllHasread')
    }
    render() {
        return (
            <>
               <Card
                    title="通知中心"
                    bordered={false}
                    extra={<Button 
                        disabled={this.props.list.every(item => item.unRead === false)}
                        onClick = {this.markAllNotificationsHasread}
                        >全部标记为已读</Button>}
                >
                    <List
                        itemLayout="horizontal"
                        dataSource={this.props.list}
                        renderItem={item => (
                        <List.Item
                        extra={
                                item.unRead 
                                ? 
                                <Button 
                                    onClick={this.markNotificationHasreadById.bind(this,item.id)}
                                >
                                    标记为已读
                                </Button>
                                :
                                null
                            }
                        >
                            <List.Item.Meta
                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                title={<Badge dot={item.unRead}>{item.from}</Badge>}
                                description={item.msg}
                            />
                        </List.Item>
                        )}
                    />
                </Card>
            </>
        )
    }
}

export default Notifications
