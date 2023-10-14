const mongoose = require('mongoose')

const dburl = "mongodb://localhost:27017"


mongoose.connect(dburl,{useNewUrlParser: true, useUnifiedTopology: true }).then(()=>console.log('DATABASE ACTIVATED')).catch((err)=>console.log('REFUSE TO CONNECT DATABASE'+err))