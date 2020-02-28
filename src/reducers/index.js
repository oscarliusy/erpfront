import { combineReducers} from 'redux'
import dashboard from './dashboard'
import instockTable from './instockTable'
import productTable from './productTable'
import preoutstockTable from './preoutstockTable'

export default combineReducers({
    dashboard,
    instockTable,
    productTable,
    preoutstockTable
})