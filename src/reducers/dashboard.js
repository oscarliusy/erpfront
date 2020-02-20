import actionTypes from '../actions/actionTypes'

const initState = {
    isLoading:false,
    instockAmount:0,
    outstockAmount:0,
    totalSales:0,
    returns:0,
    saleList:[]
}

export default (state=initState,action) => {
    switch(action.type){
        case actionTypes.START_DASHBOARD_STATISTIC_POST:
            return {
                ...state,
                isLoading:true
            }
        case actionTypes.FINISH_DASHBOARD_STATISTIC_POST:
            return {
                ...state,
                isLoading:false
            }
        case actionTypes.RECEIVE_DASHBOARD_STATISTIC:
            return{
                ...state,
                instockAmount:action.payload.resp.instockAmount,
                outstockAmount:action.payload.resp.outstockAmount,
                totalSales:action.payload.resp.totalSales,
                returns:action.payload.resp.returns,
                saleList:action.payload.resp.saleList
            }
        default:
            return state
    }
}