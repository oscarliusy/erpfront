import actionTypes from './actionTypes'

export const addEmptyRowToInstockTable = (newData) =>{
    return {
        type:actionTypes.ADD_EMPTY_INSTOCK_ROW,
        payload:{
            newData
        }
    }
}

export const deleteInstockRow = (dataSource) =>{
    return {
        type:actionTypes.REMOVE_INSTOCK_ROW,
        payload:{
            dataSource
        }
    }
}

export const saveInstockRowModify = (newData) =>{
    return {
        type:actionTypes.SAVE_INSTOCK_ROW_MODIFY,
        payload:{
            newData
        }
    }
}