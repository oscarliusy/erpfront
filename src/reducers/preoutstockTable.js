import actionTypes from '../actions/actionTypes'

const initState = {
    products:[],
    count:0
}

export default (state=initState,action) => {
    switch(action.type){
        case actionTypes.SAVE_PREOUTSTOCK_PRODUCT_TABLE:
            //console.log(action.payload.newData)
            return action.payload.newState
        case actionTypes.RESET_PREOUTSTOCK_PRODUCT_TABLE:
            return initState
        default:
            return state
    }
}