import Loadable from 'react-loadable'
import {Loading} from '../components'

//mainRoute views
const SignIn = Loadable({
    loader: () => import('./SignIn'),
    loading: Loading
})

const SignUp = Loadable({
    loader: () => import('./SignUp'),
    loading: Loading
})

const NotFound = Loadable({
    loader: () => import('./NotFound'),
    loading: Loading
})

//commonRoute views
const IMList = Loadable({
    loader: () => import('./IMList'),
    loading: Loading
})

const IMDetail = Loadable({
    loader: () => import('./IMDetail'),
    loading: Loading
})

const MaterialAdd = Loadable({
    loader: () => import('./MaterialAdd'),
    loading: Loading
})

const Instock = Loadable({
    loader: () => import('./Instock'),
    loading: Loading
})


//adminRoute views
const Currency = Loadable({
    loader: () => import('./Currency'),
    loading: Loading
})

const UserList = Loadable({
    loader: () => import('./UserList'),
    loading: Loading
})

const Manage = Loadable({
    loader: () => import('./Manage'),
    loading: Loading
})

const IMLogs = Loadable({
    loader: () => import('./IMLogs'),
    loading: Loading
})

const ProductList = Loadable({
    loader: () => import('./ProductList'),
    loading: Loading
})

const ProductAdd = Loadable({
    loader: () => import('./ProductAdd'),
    loading: Loading
})


const ProductOutstock = Loadable({
    loader: () => import('./ProductOutstock'),
    loading: Loading
})

const PreOutstock = Loadable({
    loader: () => import('./PreOutstock'),
    loading: Loading
})

const PreOutstockList = Loadable({
    loader: () => import('./PreOutstockList'),
    loading: Loading
})

const ProductLogs = Loadable({
    loader: () => import('./ProductLogs'),
    loading: Loading
})

const ProductDetail = Loadable({
    loader: () => import('./ProductDetail'),
    loading: Loading
})

const Notifications = Loadable({
    loader: () => import('./Notifications'),
    loading: Loading
})

const Dashboard = Loadable({
    loader: () => import('./Dashboard'),
    loading: Loading
})

const Profile = Loadable({
    loader: () => import('./Profile'),
    loading: Loading
})

const NoAuth = Loadable({
    loader: () => import('./NoAuth'),
    loading: Loading
})

const AdminLogs = Loadable({
    loader: () => import('./AdminLogs'),
    loading: Loading
})

const MaterialUpdateList = Loadable({
    loader: () => import('./MaterialUpdateList'),
    loading: Loading
})

const ProductUpdateList = Loadable({
    loader: () => import('./ProductUpdateList'),
    loading: Loading
})
export {
    SignIn,
    SignUp,
    NotFound,
    IMList,
    IMDetail,
    MaterialAdd,
    Currency,
    UserList,
    Manage,
    Instock,
    IMLogs,
    ProductList,
    ProductAdd,
    ProductOutstock,
    PreOutstock,
    PreOutstockList,
    ProductLogs,
    ProductDetail,
    Notifications,
    Dashboard,
    Profile,
    NoAuth,
    AdminLogs,
    MaterialUpdateList,
    ProductUpdateList
}