import actionTypes from '../actions/actionTypes'

const isSignIn = Boolean(window.localStorage.getItem('authToken') || window.sessionStorage.getItem('authToken'))

const userInfo = isSignIn ? JSON.parse(window.localStorage.getItem('userInfo')) || JSON.parse(window.sessionStorage.getItem('userInfo')) : {}

const initState = {
    ...userInfo,
    isSignIn:isSignIn
}

export default (state = initState,action) =>{
    switch(action.type){
        case actionTypes.START_SIGNIN:
            return {
                ...state
            }
        case actionTypes.SIGNIN_SUCCESS:
            return {
                ...state,
                ...action.payload.userInfo,
                isSignIn:true
            }
        case actionTypes.SIGNIN_FAILED:
            return {
                id:'',
                avatar:'',
                username:'',
                role:'',
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
                email:action.payload.email
            }
        default:
            return state
    }
}