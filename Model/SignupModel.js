const mongoose = require('mongoose')


const SignupSchema = mongoose.Schema(
    {
        fullname: {
            type: String
        },
        email: {
            type: String
        },
        password: {
            type: String
        },
        cpassword: {
            type: String
        }
    }

)

const SignupModel = mongoose.model('Signup-02', SignupSchema)


module.exports = SignupModel