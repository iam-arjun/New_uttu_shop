const mongoose = require('mongoose')


const CartSchema = mongoose.Schema(
    {

        id: {
            type: String
        },

        itemname: {
            type: String
        },

        itemimg: {
            type: String
        },

        itemprice: {
            type: String
        },

        itemqty: {
            type: Number
        },
        featured: {
            type: Boolean
        },
        email: {
            type: String
        },


    }

)

const CartModel = mongoose.model('Cart-02', CartSchema)


module.exports = CartModel