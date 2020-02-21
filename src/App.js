import React, { Component } from 'react'
import { Route,Switch,Redirect } from 'react-router-dom'
import { commonRoutes,adminRoutes} from './routes'
import { Frame } from '../src/components'

const commonMaterialMenu = commonRoutes.materialRoutes.filter(route=>route.isNav === true)
const commonProductMenu = commonRoutes.productRoutes.filter(route=>route.isNav === true)
const userMenu = commonRoutes.userRoutes.filter(route=>route.isNav === true)
const adminMenu = adminRoutes.filter(route=>route.isNav === true)



export default class App extends Component {
    render() {
        return (
            <Frame 
                commonMaterialMenu={commonMaterialMenu}
                commonProductMenu={commonProductMenu}
                adminMenu={adminMenu}
                userMenu={userMenu}

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
                                        return < route.component {...routerProps} />
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
                                        return < route.component {...routerProps} />
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
                                        return < route.component {...routerProps} />
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
                                        return < route.component {...routerProps} />
                                    }}
                                />
                            )
                        })
                    }
                    <Redirect to={commonMaterialMenu[0].pathname} from='/erp' exact/>
                    <Redirect to='/404/' />
                </Switch>
            </Frame>
        )
    }
}
