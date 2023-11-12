const mongoose = require('mongoose')


const LoginSchema = mongoose.Schema(
    {

        name: {
            type: String
        },
        email: {
            type: String
        },
        password: {
            type: String
        },
        token: {
            type: String

        }

    }

)

const LoginModel = mongoose.model('Login-02', LoginSchema)


module.exports = LoginModel