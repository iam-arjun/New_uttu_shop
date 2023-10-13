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
            type: Number
        },

        itemqty: {
            type: Number
        },
        featured: {
            type: Boolean
        },


    }

)

const CartModel = mongoose.model('Cart-02', CartSchema)


module.exports = CartModel