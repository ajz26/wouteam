const User = require('../models/User');
const Tasks = require('../models/Tasks');
const Project = require('../models/Projects');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const validator = require('validator')




const moment = require('moment');

exports.authUser = async (req, res) => {
    var ip = req.headers['x-forwarded-for'] || 
    req.connection.remoteAddress || 
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

    var { email, password } = req.body;

    email = (email) ? email.toLowerCase(): undefined;
    

    if((!email || !validator.isEmail(email) )  && (!password || validator.isEmpty(password) ) ){
        return res.status(401).json({
            response: 'error',
            msg: 'Por favor ingresa un  correo y su contraseña',
        });
    }

    
    if(!password || validator.isEmpty(password)){
        return res.status(401).json({
            response: 'error',
            msg: 'Por favor ingresa una contraseña',
        });
    }

    if(!email || !validator.isEmail(email)){
        return res.status(401).json({
            response: 'error',
            msg: 'Por favor ingresa un correo válido',
        });
    }




    try {

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                response: 'error',
                code    : '001',
                msg: `el correo "${email}" no está registrado`,
                ip
            });
        }

        const match = await bcrypt.compare(password, user.password);


        if(!match) {
            return res.status(401).json({
                response: 'error',
                msg: 'La contraseña ingresada es incorrecta'
            });
        }

        const payload = {
            user: {
                ID : user._id
            }
         };
        var secret = process.env.SECRET;
        var token = jwt.sign(payload, secret,{
            expiresIn: 432000,
        },(error,token) => {
            if (error) throw error;

            res.status(200).json({
                response: 'success',
                msg: `Hola ${user.name}, bienvenido`,
                token
            });

        });

    } catch (error) {

        console.log(error);

        res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error',
            token: token
        });
    }

}


exports.authLogUser = async (req,res) => {

    const currentUser = req.user.ID;

    try {

        const user = await User.findById(currentUser).select('-password').populate({path:'friends', select:'name lastName email avatar'});
        
        const tasksTotal = await Tasks.estimatedDocumentCount({ 'users.user': currentUser});
        // const projectsTotal = await Project.count({ 'users.user': req.user.ID});

        console.log(tasksTotal)

        res.status(200).json(user);
        
    } catch (error) {
        
        console.log(error);

        res.status(500).json({
            response: 'error',
            msg: 'ha ocurrido un error',
        });

    }

}