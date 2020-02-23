import actionTypes from '../actions/actionTypes'

const initState = {
    dataSource:[],
    count:0
}

export default (state=initState,action) => {
    switch(action.type){
        case actionTypes.ADD_EMPTY_INSTOCK_ROW:
            return {
                ...state,
                ...action.payload.newData
            }
        case actionTypes.REMOVE_INSTOCK_ROW:
            return {
                ...state,
                ...action.payload
            }
        case actionTypes.SAVE_INSTOCK_ROW_MODIFY:
            return {
                ...state,
                dataSource:action.payload.newData
            }
        default:
            return state
    }
}