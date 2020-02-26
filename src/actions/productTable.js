import actionTypes from './actionTypes'

export const saveProductConstructTable = (newState) =>{
    return {
        type:actionTypes.SAVE_PRODUCT_CONSTRUCT_TABLE,
        payload:{
            newState
        }
    }
}