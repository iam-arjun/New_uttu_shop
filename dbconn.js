const mongoose = require('mongoose')

const dburl = "mongodb+srv://iamarjun537:iamarjun12345@cluster0.hcyxdft.mongodb.net/?retryWrites=true&w=majority"


mongoose.connect(dburl,{useNewUrlParser: true, useUnifiedTopology: true }).then(()=>console.log('DATABASE ACTIVATED')).catch((err)=>console.log('REFUSE TO CONNECT DATABASE'+err))