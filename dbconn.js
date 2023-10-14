const mongoose = require('mongoose')

const dburl = "mongodb://localhost:27017"
const atlas_url = "mongodb+srv://iamarjun537:iamarjun12345@cluster0.hcyxdft.mongodb.net/?retryWrites=true&w=majority"


mongoose.connect(atlas_url,{useNewUrlParser: true, useUnifiedTopology: true }).then(()=>console.log('DATABASE ACTIVATED')).catch((err)=>console.log('REFUSE TO CONNECT DATABASE'+err))