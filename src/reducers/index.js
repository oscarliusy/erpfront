import { combineReducers} from 'redux'
import dashboard from './dashboard'
import instockTable from './instockTable'

export default combineReducers({
    dashboard,
    instockTable
})