const mongoose = require('mongoose')


const FinalOrderSchema = mongoose.Schema(
    {


       finalemail: {
            type: String
        },
        shipping: {
            type: Array
        },
        cartitems: {
            type: Array
        },
        ordersummary: {
            type: Object

        },
        paymentmethod: {
            type: String

        },


    }

)

const FinalOrderModel = mongoose.model('FinalOrder-02', FinalOrderSchema)


module.exports = FinalOrderModel