const User = require('../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const validator = require('validator')
const path 			= require('path');


exports.createUser = async (req, res) => {

    var { name, email, password } = req.body;

    email = (email) ? email.toLowerCase(): undefined;


    try{

        if((!name || validator.isEmpty(name)) && (!email || !validator.isEmail(email)) ){
            return res.status(401).json({
                response: 'error',
                msg: 'Por favor ingresa un nombre y correo válido',
            });
        }

        
        if(!name || validator.isEmpty(name)){
            return res.status(401).json({
                response: 'error',
                msg: 'Por favor ingresa un nombre válido',
            });
        }

        if(!email || !validator.isEmail(email)){
            return res.status(401).json({
                response: 'error',
                msg: 'Por favor ingresa un correo válido',
            });
        }

        if(!password || validator.isEmpty(password)){
            return res.status(401).json({
                response: 'error',
                msg: 'Por favor ingresa una contraseña mas fuerte',
            });
        }

        try {

        let user = await User.findOne({ email });

        if (user) {
            return res.status(401).json({
                response: 'already',
                msg: 'Uupps, Ya existe un usuario con este correo',
                email: user.email
            });
        }

        user = new User({ name, email, password });
        user.password = await user.encryptPassword(user.password);        
        
        user =  await user.save();

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
                msg: 'Bienvenido, Usuario registrado exitosamente',
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


    }catch(error){
        console.log(error)
    }

}


exports.updateUser = async (req, res) => {
    

    const { name, lastName, profession } = req.body;
    
    const { avatar } = req.files;
    
    const data = {
        name,
        lastName,
        profession,
    }

    ;
    
    avatar.mv(path.join('src/public/upoad/filename.jpg'), function(err) {
        if (err)
          return res.status(500).send(err);
          });

    ;
    User.findOneAndUpdate({ _id : req.user.ID },data,{
            new:true,
            fields:{ "name":1,
                     "email":1,
                     "lastName":1,
                     "register":1,
                     "profession":1,
                     "_id":1,
                     "status":1,
                    },}).then( user => {
        if (!user) {
            return res.status(401).json({
                response: 'error',
                msg: 'Uupps, No existe ningun usuario con ese ID',
            });
        }

        return res.status(200).json({
            response: 'success',
            msg: 'Usuario actualizado exitosamente',
            user
        });
        

    }).catch( error => {

        return res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error',
        });

    });

}


exports.updateUserPasswordGenerateToken = async (req, res) => {

    const { email } = req.body;

    if(!email || !validator.isEmail(email)){
        return res.status(401).json({
            response: 'error',
            msg: 'Por favor ingresa un correo válido',
        });
    }


    User.findOne({ email }).then( user => {
        if (!user) {
            return res.status(401).json({
                response: 'error',
                msg: 'Uupps, No existe ningun usuario con ese correo',
            });
        }

        var secret = process.env.SECRET;

        const payload = {
            user:user._id
        };

        jwt.sign(payload, secret,{
            expiresIn: 3600,
        },(error,token) => {
            if (error) throw error;

            res.status(200).json({
                response: 'success',
                msg: 'Solicitud de recuperación de contraseña realizada con exito, revisa tu correo electrónico',
                token
            });

        });
        

    }).catch( error => {

        return res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error',
        });

    });

}


exports.PasswordUpdate = async (req, res) => {

    const {token} = req.params;

    const {password} = req.body;
 
    const verifyToken = ( validator.isJWT(token)) ? jwt.verify(token,process.env.SECRET) : false;

    if (!token || !verifyToken){

        return res.status(301).json({
            response: 'error',
            msg: 'Token invalido, intenta de nuevo tu solicitud',
        });
    }

    if (!password || validator.isEmpty(password)){

        return res.status(400).json({
            response: 'error',
            msg: 'por favor ingresa una contraseña nueva',
        });
    }

    try{

        const ID = verifyToken.user;

        const user = await User.findOne({_id:ID});

        user.password = await user.encryptPassword(password);        
        
        await user.save();

        res.status(200).json({
            response: 'success',
            msg: 'contraseña actualizada correctamente',
        });
    }
    
    catch ( error) {
        console.log('ha ocurrido un error al actualizar la contraseña')

        return res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error',
        });

    }

}

exports.findOnebyEmail = async (req, res) => {

    var {email} = req.body;

        email = (email) ? email.toLowerCase(): undefined;

        if(!email || !validator.isEmail(email)){
            return res.status(401).json({
                response: 'error',
                msg: 'Por favor ingresa un correo válido',
            });
        }

        try {

        let user = await User.findOne({ email },{'name':1,'avatar':1});

        if (!user) {
            return res.status(401).json({
                response: 'error',
                msg: 'No se encontró ningun usuario con ese correo, puedes invitarlo a crear una nueva cuenta',
                email
            });
        }

        return res.status(200).json({
            response: 'success',
            msg: 'Usuario encontrado exitosamente',
            user
        });

    } catch (error) {

        console.log(error);

        return res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error',
            token: token
        });
    }

}



exports.friendList = async (req, res) => {

    const currentUser = req.user.ID;

    try {

        let friends = await User.findOne({ _id: currentUser }, { friends: '1' }).populate({ path: 'friends', select: 'name lastName email' });

        return res.status(200).json({
            response: 'success',
            msg: 'Lista de amigos cargada con exito',
            friends: friends.friends
        })

    } catch (error) {

        console.log(error);

        return res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error',
        });
    }

}