import actionTypes from '../actions/actionTypes'

const initState = {
    materials : [
    ],
    count:0
}

export default (state=initState,action) => {
    switch(action.type){
        case actionTypes.SAVE_PRODUCT_CONSTRUCT_TABLE:
            //console.log(action.payload.newData)
            return action.payload.newState
        case actionTypes.RESET_PRODUCT_CONSTRUCT_TABLE:
            return initState
        default:
            return state
    }
}