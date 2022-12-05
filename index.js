const express = require('express');
const app = express();



app.listen(5000, (err) => {
	err ? console.log(err) : console.log('running at port 500')
})
