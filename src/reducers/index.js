import { combineReducers} from 'redux'
import dashboard from './dashboard'
import instockTable from './instockTable'
import productTable from './productTable'

export default combineReducers({
    dashboard,
    instockTable,
    productTable
})