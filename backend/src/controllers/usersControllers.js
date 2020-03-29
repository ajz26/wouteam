const User = require('../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    var { name, email, password } = req.body;

    email = email.toLowerCase();

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

}


exports.updateUser = async (req, res) => {

    const { name, email } = req.body;


    SameEmail = await User.findOne({email});

    // if (SameEmail) {
    //     return res.status(401).json({
    //         response: 'error',
    //         msg: 'Uupps, ya existe un usuario con este email',
    //     });
    // }

    User.findOneAndUpdate({ _id : req.user.ID },req.body,{
            new:true,
            fields:{ "name":1,
                     "email":1,
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

        if(error.codeName === 'DuplicateKey') {
            return res.status(400).json({
                response: 'error',
                msg: 'Ya existe un usuario con este correo electrónico',
            });
        }

        return res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error',
        });

        
    });

}