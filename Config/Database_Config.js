const mongoose = require('mongoose')

// database conncetion 
const Database_Connect = () => {
  mongoose.connect(process.env.DATABASE_URL,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(console.log('Connected'))
    .catch(err => console.log(err))

}

module.exports = Database_Connect;