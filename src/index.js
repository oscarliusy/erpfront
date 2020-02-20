import React from 'react'
import {render} from 'react-dom'
import { HashRouter as Router, Route, Switch,Redirect} from 'react-router-dom'
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider} from 'antd'
import App from './App'
import './index.less'
import { mainRoutes } from './routes'
import store from './store'
import { Provider } from 'react-redux'

render(
    <Provider store={store}>
        <ConfigProvider locale={zhCN}>
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
        </ConfigProvider>
    </Provider>
    ,
    document.querySelector('#root')
)