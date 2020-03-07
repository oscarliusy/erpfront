import { combineReducers} from 'redux'
import dashboard from './dashboard'
import instockTable from './instockTable'
import productTable from './productTable'
import preoutstockTable from './preoutstockTable'
import user from './user'
import notification from './notification'

export default combineReducers({
    dashboard,
    instockTable,
    productTable,
    preoutstockTable,
    user,
    notification
})