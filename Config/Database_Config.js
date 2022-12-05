const mongoose = require('mongoose');
exports.Database_Config =()=>{
	mongoose.connect(process.env.DATABSE_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }, (err)=>{
		err ? console.log(err) : console.log('connected') 
	})
} 
