const mongoose = require('mongoose')



mongoose.connect('mongodb://localhost:27017',{useNewUrlParser: true, useUnifiedTopology: true }).then(()=>console.log('DATABASE ACTIVATED')).catch((err)=>console.log('REFUSE TO CONNECT DATABASE'+err))