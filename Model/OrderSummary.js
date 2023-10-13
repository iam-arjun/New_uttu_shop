const mongoose = require('mongoose')


const OrderSummarySchema = mongoose.Schema(
    {

        total_items: {
            type: Number
        },
        total_payable: {
            type: Number
        },
     
    }

)

const OrderSummaryModel = mongoose.model('OrderSummary-02', OrderSummarySchema)


module.exports = OrderSummaryModel