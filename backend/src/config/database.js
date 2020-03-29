require('dotenv').config({ path:'vars.env'})

const mongoose = require('mongoose');

const URI = process.env.DB_MONGO;

mongoose.connect(URI,{
	useCreateIndex: true,
	useNewUrlParser: true, 
	useFindAndModify:false,
   useUnifiedTopology: true
})
.then(db=> console.log('La base de datos se conecto correctamente'))
.catch(err =>console.log(err));

module.exports = mongoose; 