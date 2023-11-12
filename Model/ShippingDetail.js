const mongoose = require('mongoose')


const ShippingSchema = mongoose.Schema(
    {

        email: {
            type: String
        },
        fullname: {
            type: String
        },
        phone: {
            type: String
        },
        country: {
            type: String

        },
        state: {
            type: String

        },
        city: {
            type: String

        },
        streetaddress: {
            type: String

        }

    }

)

const ShippingModel = mongoose.model('Shipping-02', ShippingSchema)


module.exports = ShippingModel