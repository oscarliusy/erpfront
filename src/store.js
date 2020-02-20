import { createStore,applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import rooteReducer from './reducers'

export default createStore(
    rooteReducer,
    applyMiddleware(thunk)
)