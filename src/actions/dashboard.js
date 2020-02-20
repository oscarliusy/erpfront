import actionTypes from './actionTypes'
import { getDashboardStatistic } from '../requests'

const startDashboardStatisticPost = () => {
    return {
        type:actionTypes.START_DASHBOARD_STATISTIC_POST
    }
}

const finishDashboardStatisticPost = () => {
    return {
        type:actionTypes.FINISH_DASHBOARD_STATISTIC_POST
    }
}

export const dashboardStatisticPost = () => {
    return dispatch => {
        dispatch(startDashboardStatisticPost())
        getDashboardStatistic()
        .then(resp => {
            dispatch({
                type:actionTypes.RECEIVE_DASHBOARD_STATISTIC,
                payload:{resp}
            })
            dispatch(finishDashboardStatisticPost())
        })        
    }
}