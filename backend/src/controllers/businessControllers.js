const Business = require('../models/Business');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const moment = require('moment');

exports.createBusiness = async (req, res) => {

    const { name } = req.body;

    try {

        business = await new Business({
            name,

            createdBy: {
                user: req.user.ID
            },
            users:[
                {
                    user: req.user.ID,
                    permissions: 'master',
                    addedBy: req.user.ID,
                }
            ]


        });

        business = await business.save();

        res.status(200).json({
            response: 'success',
            msg: `Se ha creado "${business.BusinessName}" exitosamente`,
            business
        });

    } catch (error) {

        console.log(error);

        res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error',
        });
    }

}


exports.listBusiness = async (req, res) => {

    try {

        const business = await Business.find({ 'users.user': req.user.ID} );

        res.status(200).json({
            response: 'success',
            msg: 'Cuentas cargadas exitosamente',
            business
        });

    } catch (error) {

        console.log(error);

        res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error al cargar las cuentas',
        });
    }

}

// auth

exports.businessAuth = async (req, res) => {

    const { businessID } = req.body;

    try {

    let business = await Business.findOne({ _id:businessID, 'users.user': req.user.ID });

        if (!business) {
            return res.status(400).json({
                response: 'error',
                msg: 'error en la autenticación'
            });
        }


        const payload = {
            businessID:business._id
        };

        var secret = process.env.SECRET;

        jwt.sign(payload, secret,{
            expiresIn: 432000,
        },(error,token) => {
            if (error) throw error;

            res.status(200).json({
                response: 'success',
                token,
                business: business,
            });

        });

    } catch (error) {

        console.log(error);

        res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error al autenticar la cuenta',
        });
    }

}


exports.get_current_business = async (req, res) => {

    try {

    let business = await Business.findOne({ _id:req.businessID, 'users.user': req.user.ID });

        if (!business) {
            return res.status(400).json({
                response: 'error',
                msg: 'error en la autenticación'
            });
        }

        res.status(200).json({
            response: 'success',
            business: business,
        });

    
    } catch (error) {

        console.log(error);

        res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error al autenticar la cuenta',
        });
    }

}