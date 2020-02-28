import actionTypes from './actionTypes'

export const savePreoutstockProductTable = (newState) =>{
    return {
        type:actionTypes.SAVE_PREOUTSTOCK_PRODUCT_TABLE,
        payload:{
            newState
        }
    }
}

export const resetPreoutstockProductTable = () =>{
    return {
        type:actionTypes.RESET_PREOUTSTOCK_PRODUCT_TABLE
    }
}