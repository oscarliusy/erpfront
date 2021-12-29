//字段对应表
export const INSTOCK_KEYS = {
  uniqueId:{
    text:'唯一识别码',
    type:'string'
  },
  description:{
    text:'备注',
    type:'string'
  },
  instockAmount:{
    text:'入库数量',
    type:'number'
  },
  purchaser:{
    text:'采购人',
    type:'string'
  },
  price:{
    text:'采购价',
    type:'float'
  }
}

export const OUTSTOCK_KEYS = {
  site:{
    text:'站点',
    type:'string'
  },
  sku:{
    text:'sku',
    type:'string'
  },
  amount:{
    text:'出库数量',
    type:'number'
  }
}

export const OUTSTOCK_KEYS_BRAND = {
  brand:{
    text:'品牌',
    type:'string'
  },
  sku:{
    text:'sku',
    type:'string'
  },
  amount:{
    text:'出库数量',
    type:'number'
  }
}