import React, { Component } from 'react'

export default class NoAuth extends Component {
    render() {
        return (
            <div style={{
                margin:'30px 30px',
                fontSize:'24px'
            }}>
                <span>没有权限访问该页面</span>
            </div>
        )
    }
}
