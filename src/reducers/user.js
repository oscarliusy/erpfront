import actionTypes from '../actions/actionTypes'

const isSignIn = Boolean(window.localStorage.getItem('authToken') || window.sessionStorage.getItem('authToken'))

const userInfo = JSON.parse(window.localStorage.getItem('userInfo')) || JSON.parse(window.sessionStorage.getItem('userInfo'))

const initState = {
    ...userInfo,
    isSignIn:isSignIn,
    isLoading:false
}

export default (state = initState,action) =>{
    switch(action.type){
        case actionTypes.START_SIGNIN:
            return {
                ...state,
                isLoading:true
            }
        case actionTypes.SIGNIN_SUCCESS:
            return {
                ...state,
                ...action.payload.userInfo,
                isLoading:false,
                isSignIn:true
            }
        case actionTypes.SIGNIN_FAILED:
            return {
                id:'',
                avatar:'',
                username:'',
                role:'',
                isLoading:false,
                isSignIn:false
            }
        case actionTypes.CHANGE_AVATAR:
            return{
                ...state,
                avatar:action.payload.avatarUrl,
            }
        case actionTypes.CHANGE_USERNAME:
            return{
                ...state,
                username:action.payload.username,
            }
        default:
            return state
    }
}