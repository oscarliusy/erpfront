import React from 'react'
import {render} from 'react-dom'
import { HashRouter as Router, Route, Switch,Redirect} from 'react-router-dom'

import App from './App'
import './index.less'
import { mainRoutes } from './routes'

render(
    <Router>
        <Switch>
            {/*这里出了问题，无法导航至admin路由*/}
            <Route path="/erp" component={App} />
            {    
                //signIn,signOut,NotFount三个页面
                mainRoutes.map(route=>{
                    return <Route 
                            key={route.pathname}
                            path={route.pathname}
                            component={route.component}
                            />
                })
            }
            <Redirect to="/erp" from="/" exact/>
            <Redirect to="/404" />
        </Switch>
    </Router>
    ,
    document.querySelector('#root')
)