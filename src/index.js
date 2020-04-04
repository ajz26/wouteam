const express 		= require('express');
const fileUpload 	= require('express-fileupload');
var compression 	= require('compression');
const morgan  		= require('morgan'); //uso en desarrollo para ver las peticiones al servidor
const path    		= require('path');
const cors 			= require('cors');
const bodyParser 	= require('body-parser');
					  require('./config/database'); // configuracion de base de datos
const app 			= express();
const helmet 		= require('helmet')
const {auth} 		= require('./middlewares/auth');

const rateLimit = require("express-rate-limit");

// settings

app.set('port',process.env.PORT || 3001);

// middlewares

// app.use(fileUpload({
// 	createParentPath: true,
// 	safeFileNames: /\\/g,
// }));

app.use(morgan('dev'));

app.use(helmet())
app.disable('x-powered-by')
app.use(compression());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const apiLimiter = rateLimit({
	windowMs: 0.5 * 60 * 1000, // 15 minutes
	max: 5,
	message:
    "Haz realizado muchas solicitudes desde esta IP, intentalo de nuevo mas tarde"

  });

// routes

app.use('/api/v1/user/', require('./routes/v1/users.routes.js'));
app.use('/api/v1/projects/', require('./routes/v1/projects.routes.js'));
app.use('/api/v1/auth/',apiLimiter, require('./routes/v1/auth.routes.js'));
app.use('/api/v1/tasks/', require('./routes/v1/tasks.routes.js'));

app.use('/api/v1/friend-request/', require('./routes/v1/friendRequest.routes.js'));
app.use('/upload/',auth);



// Static files
app.use(express.static(path.join(__dirname,'public')));


app.use( (req,res,next) => {
	return res.status(404).json({
		response: 'error',
		msg: 'Endpoint no encontrado',
	});
}
);
// iniciar el servidor
app.listen(app.get('port'),()=>{
	console.log(`servidor listo y ejecutando en el puerto ${app.get('port')}`);
})