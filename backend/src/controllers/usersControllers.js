const User = require('../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const validator = require('validator')

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

    const data = {
        name,
        lastName,
        profession,
    }

    User.findOneAndUpdate({ _id : req.user.ID },data,{
            new:true,
            fields:{ "name":1,
                     "email":1,
                     "lastName":1,
                     "register":1,
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