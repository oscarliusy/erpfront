import React, { Component } from 'react'

const dataSource =  {
    key:'1',
    id:'1',
    site:'LKSUS',
    sku:'zixingchebali-110mm',
    childAsin:'B07N8VCK2T',
    title:'Linkin Sport 0-60 Degre Adjustable Bicycle Stem Aluminum Alloy Mountain Bike Stem (31.8mm x 110mm)',
    image:'http://dummyimage.com/60x60',
    purchasePrice:8.89,
    dhlShippingFee:0.00,
    freightFee:10.00,
    packageFee:1.00,
    opFee:6.00,
    currency:6.50,
    fbaFullfillmentFee:3.28,
    shrinkage:0.97,
    adCost:1.00,
    amazonReferralFee:'15%',
    payoneerServiceFee:'1.2%',
    amazonSalePrice:18.99,
    margin:44.078,
    materials : [
        {
            id:11223,
            uniqueId:"toy bear",
            amount:1
        },
        {
            id:11335,
            uniqueId:'wrap bag L',
            amount:3
        }
    ]
}

export default class ProductAdd extends Component {
    constructor(){
        super()
        this.state={
            dataSource:dataSource
        }
    }
    render() {
        return (
            <div>
                增加产品,忘记公式项了，回北京做
            </div>
        )
    }
}
