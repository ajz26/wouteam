const express 		= require('express');
const morgan  		= require('morgan'); //uso en desarrollo para ver las peticiones al servidor
const path    		= require('path');
const cors 			= require('cors');
const bodyParser 	= require('body-parser');
					  require('./config/database'); // configuracion de base de datos
const app 			= express();
// settings

app.set('port',process.env.PORT || 3001);

// middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// routes

app.use('/api/v1/user/', require('./routes/v1/users.routes.js'));
app.use('/api/v1/business/', require('./routes/v1/business.routes.js'));
app.use('/api/v1/auth/', require('./routes/v1/auth.routes.js'));
app.use('/api/v1/contacts/', require('./routes/v1/contacts.routes.js'));

app.use( (req,res,next) => {
	return res.status(404).json({
		response: 'error',
		msg: 'Endpoint no encontrado',
	});
}
);

// Static files
app.use(express.static(path.join(__dirname,'public')));

// iniciar el servidor
app.listen(app.get('port'),()=>{
	console.log(`servidor listo y ejecutando en el puerto ${app.get('port')}`);
})