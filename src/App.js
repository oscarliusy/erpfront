import React, { Component } from 'react'
import { Route,Switch,Redirect } from 'react-router-dom'
import { commonRoutes,adminRoutes} from './routes'
import { Frame } from '../src/components'

const commonMaterialMenu = commonRoutes.materialMenu.filter(route=>route.isNav === true)
const adminMenu = adminRoutes.filter(route=>route.isNav === true)


export default class App extends Component {
    render() {
        return (
            <Frame 
                commonMaterialMenu={commonMaterialMenu}
                adminMenu={adminMenu}
            >
                <Switch>
                    {
                        commonMaterialMenu.map(route=>{
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
                        adminMenu.map(route=>{
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
                    <Redirect to='/404' />
                </Switch>
            </Frame>
        )
    }
}
