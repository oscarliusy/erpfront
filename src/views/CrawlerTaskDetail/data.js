const data = {
  code:200,
  errMsg:'',
  data:{
    generalInfo:{
      createdAt:1596179795317,
      updatedAt:1596179795317,
      totalOrders:100,//订单数
      totalUnits:150,//单品销量
      totalSales:3000,//净销售额
      totalASB:20,//平均单品净销售额
      week:31,
    },
    siteInfo:[
      {
        site:'SL-US',
        siteCurreny:'usd',
        siteSales:140,
        siteRmbSales:980,
        siteOrders:50,
        siteUnits:70,
        siteASB:20,
        siteReturnUnits:5,
        siteStock:200
      },
      {
        site:'SL-CA',
        siteCurreny:'cad',
        siteSales:180,
        siteRmbSales:750,
        siteOrders:40,
        siteUnits:60,
        siteASB:25,
        siteReturnUnits:4,
        siteStock:300
      },
    ],
    detail:{
      totalSku:2,
      list:[
        {
          asin:'B07HDUEJ9',
          title:'gun bag',
          sku:'yincangqiangtao-hei',
          salesToday:130,//今日净销售额
          unitsToday:13,
          asbToday:10.00,//今日单价
          returnToday:2,
          salesYesterday:100,//某时间段内销量
          unitsYesterday:5,//今日净销售额
          ASBYesterday:20.00,//今日单价
          FBAStock:200,
          transferStock:150
        },
        {
          asin:'B08KP7YU',
          title:'tennis',
          sku:'pingpangqiu',
          salesToday:120,//今日净销售额
          unitsToday:12,
          asbToday:10.00,//今日单价
          returnToday:3,
          salesYesterday:110,//某时间段内销量
          unitsYesterday:5,//今日净销售额
          ASBYesterday:22.00,//今日单价
          FBAStock:120,
          transferStock:180
        }
      ]
    }
  }
}

module.exports = {
  data:data.data
}