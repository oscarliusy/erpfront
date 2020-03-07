import actionTypes from './actionTypes'

export const updateNotificationList = (msgObj) =>{
    return {
        type:actionTypes.UPDATE_NOTIFICATIONLIST,
        payload:{
            msgObj
        }
    }
}
