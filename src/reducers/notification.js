import actionTypes from "../actions/actionTypes"

const initState = {
    total:0,
    unread:0,
    list:[]
}

export default (state=initState,action) => {
    switch(action.type){
        case actionTypes.UPDATE_NOTIFICATIONLIST:
            //console.log(action.payload)
            return {
                ...state,
                ...action.payload.msgObj
            }
        default:
            return state
    }
}