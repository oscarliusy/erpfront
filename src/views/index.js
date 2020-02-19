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

const IMUpload = Loadable({
    loader: () => import('./IMUpload'),
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

const ProductUploadAdd = Loadable({
    loader: () => import('./ProductUploadAdd'),
    loading: Loading
})

const ProductUploadOutstock = Loadable({
    loader: () => import('./ProductUploadOutstock'),
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
    IMUpload,
    IMLogs,
    ProductList,
    ProductAdd,
    ProductUploadAdd,
    ProductUploadOutstock,
    PreOutstock,
    PreOutstockList,
    ProductLogs,
    ProductDetail
}