import React, { Component } from 'react'
import { Route,Switch,Redirect } from 'react-router-dom'
import { commonRoutes,adminRoutes,ECASRoutes} from './routes'
import { Frame } from '../src/components'
import {connect} from 'react-redux'

const commonMaterialMenu = commonRoutes.materialRoutes.filter(route=>route.isNav === true)
const commonProductMenu = commonRoutes.productRoutes.filter(route=>route.isNav === true)
const userMenu = commonRoutes.userRoutes.filter(route=>route.isNav === true)
const adminMenu = adminRoutes.filter(route=>route.isNav === true)
const ecasMenu = ECASRoutes.filter(route=>route.isNav === true)

//redux初始化后,从store中取出原先storage中的登录数据
const mapState = state =>({
    isSignIn:state.user.isSignIn,
    role:state.user.role
})


@connect(mapState)
class App extends Component {
    render() {
        return (
            this.props.isSignIn
            ?
            <Frame 
                commonMaterialMenu = {commonMaterialMenu}
                commonProductMenu = {commonProductMenu}
                adminMenu = {adminMenu}
                userMenu = {userMenu}
                ecasMenu = {ecasMenu}

            >
                <Switch>
                    {
                        commonRoutes.materialRoutes.map(route=>{
                            return (
                                <Route 
                                    key={route.pathname}
                                    path={route.pathname}
                                    exact = {route.exact}
                                    render={(routerProps)=>{
                                        const hasPermission = route.roles.includes(this.props.role)
                                        return hasPermission ? < route.component {...routerProps}/> : <Redirect to="/erp/comm/user/noauth" />
                                    }}
                                />
                            )
                        })
                    }
                    {
                        commonRoutes.productRoutes.map(route=>{
                            return (
                                <Route 
                                    key={route.pathname}
                                    path={route.pathname}
                                    exact = {route.exact}
                                    render={(routerProps)=>{
                                        const hasPermission = route.roles.includes(this.props.role)
                                        return hasPermission ? < route.component {...routerProps}/> : <Redirect to="/erp/comm/user/noauth" />
                                    }}
                                />
                            )
                        })
                    }
                    {
                        commonRoutes.userRoutes.map(route=>{
                            return (
                                <Route 
                                    key={route.pathname}
                                    path={route.pathname}
                                    exact = {route.exact}
                                    render={(routerProps)=>{
                                        const hasPermission = route.roles.includes(this.props.role)
                                        return hasPermission ? < route.component {...routerProps}/> : <Redirect to="/erp/comm/user/noauth" />
                                    }}
                                />
                            )
                        })
                    }
                    {
                        adminRoutes.map(route=>{
                            return (
                                <Route 
                                    key={route.pathname}
                                    path={route.pathname}
                                    exact = {route.exact}
                                    render={(routerProps)=>{
                                        const hasPermission = route.roles.includes(this.props.role)
                                        return hasPermission ? < route.component {...routerProps}/> : <Redirect to="/erp/comm/user/noauth" />
                                    }}
                                />
                            )
                        })
                    }
                    {
                        ECASRoutes.map(route=>{
                            return (
                                <Route 
                                    key={route.pathname}
                                    path={route.pathname}
                                    exact = {route.exact}
                                    render={(routerProps)=>{
                                        const hasPermission = route.roles.includes(this.props.role)
                                        return hasPermission ? < route.component {...routerProps}/> : <Redirect to="/erp/comm/user/noauth" />
                                    }}
                                />
                            )
                        })
                    }
                    <Redirect to={commonMaterialMenu[0].pathname} from='/erp' exact/>
                    <Redirect to='/404/' />
                </Switch>
            </Frame>
            :
            <Redirect to="/signin" />
        )
    }
}

export default  App