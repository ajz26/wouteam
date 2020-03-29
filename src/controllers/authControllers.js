const User = require('../models/User');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


const moment = require('moment');

exports.authUser = async (req, res) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    var { email, password } = req.body;

    email = email.toLowerCase();

    try {

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                response: 'error',
                msg: 'el usuario no existe'
            });
        }

        const match = await bcrypt.compare(password, user.password);


        if(!match) {
            return res.status(400).json({
                response: 'error',
                msg: 'contraseña incorrecta'
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

    try {

        const user = await User.findById(req.user.ID).select('-password');

        res.status(200).json({user});
        
    } catch (error) {
        
        console.log(error);

        res.status(500).json({
            response: 'error',
            msg: 'ha ocurrido un error',
        });

    }

}