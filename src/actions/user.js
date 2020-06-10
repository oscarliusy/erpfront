import actionTypes from './actionTypes'

const startSignIn = () =>{
    return {
        type: actionTypes.START_SIGNIN
    }
}

const signInSuccess = (userInfo) =>{
    return {
        type:actionTypes.SIGNIN_SUCCESS,
        payload:{
            userInfo
        }
    }
}

const signInFailed = (msg) =>{
    window.localStorage.removeItem('authToken')
    window.sessionStorage.removeItem('authToken')
    window.localStorage.removeItem('userInfo')
    window.sessionStorage.removeItem('userInfo')
    return {
        type:actionTypes.SIGNIN_FAILED,
    }
}

export const signOut = ()=>{
    return dispatch =>{
        dispatch(signInFailed())
    }
}

export const signIn = (signInInfo) =>{
    return dispatch => {
        dispatch(startSignIn)
        const {
            authToken,
            userInfo,
            remember,
            status
        } = signInInfo
        if(status === 'succeed'){
            if(remember === true){
                window.localStorage.setItem('authToken',authToken)
                window.localStorage.setItem('userInfo',JSON.stringify(userInfo))
            }else{
                window.sessionStorage.setItem('authToken',authToken)
                window.sessionStorage.setItem('userInfo',JSON.stringify(userInfo))
            }
            dispatch(signInSuccess(userInfo))
        }else if(status === 'failed'){
            dispatch(signInFailed())
        }else{

        }
    }
}

export const changeAvatar = (avatarUrl)  =>{
    return {
        type: actionTypes.CHANGE_AVATAR,
        payload:{
            avatarUrl
        }
    }
}

export const changeUsername = (username,email)  =>{
    return {
        type: actionTypes.CHANGE_USERNAME,
        payload:{
            username,
            email
        }
    }
}