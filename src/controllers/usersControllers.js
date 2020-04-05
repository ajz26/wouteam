const User = require('../models/User');
const jwt = require('jsonwebtoken');
const validator = require('validator')
const path = require('path');
const multer	= require('multer');

const storage = multer.diskStorage({
    destination: path.join('src/public/upload/'),
    filename: function (req, file, cb) {
        console.log(req.body)
      cb(null,Date.now()+'-'+file.originalname)
    }
  })

exports.uploadAvatar  = multer({storage}).single('avatar');


exports.create = async (req, res) => {

    var { name, email, password } = req.body;

    email = (email) ? email.toLowerCase() : undefined;


    try {

        if ((!name || validator.isEmpty(name)) && (!email || !validator.isEmail(email))) {
            return res.status(401).json({
                response: 'error',
                msg: 'Por favor ingresa un nombre y correo válido',
            });
        }


        if (!name || validator.isEmpty(name)) {
            return res.status(401).json({
                response: 'error',
                msg: 'Por favor ingresa un nombre válido',
            });
        }

        if (!email || !validator.isEmail(email)) {
            return res.status(401).json({
                response: 'error',
                msg: 'Por favor ingresa un correo válido',
            });
        }

        if (!password || validator.isEmpty(password)) {
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

            user = await user.save();

            const payload = {
                user: {
                    ID: user._id
                }
            };

            var secret = process.env.SECRET;
            var token = jwt.sign(payload, secret, {
                expiresIn: 432000,
            }, (error, token) => {
                if (error) throw error;

                res.status(200).json({
                    response: 'success',
                    msg: 'Bienvenido, Usuario registrado exitosamente',
                    token
                });

            });

        } catch (error) {

            res.status(400).json({
                response: 'error',
                msg: 'ha ocurrido un error',
                token: token
            });
        }


    } catch (error) {
        console.log(error)
    }

}




exports.update = async (req, res) => {

    const { name, lastName, profession } = req.body;

    const avatar = (req.file) ? req.file.filename : undefined;

    console.log(avatar);

    const data = {
        name,
        lastName,
        profession,
        avatar
    }

    if(!name) delete data.name;
    if(!lastName) delete data.lastName;
    if(!profession) delete data.profession;
    if(!avatar) delete data.avatar;


    User.findOneAndUpdate({ _id: req.user.ID }, data, {
        new: true,
        fields: {
            "name": 1,
            "email": 1,
            "lastName": 1,
            "register": 1,
            "profession": 1,
            "_id": 1,
            "status": 1,
            "avatar": 1,
        },
    }).then(user => {
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


    }).catch(error => {

        console.log(error)

        return res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error',
        });

    });

}


exports.updateUserPasswordGenerateToken = async (req, res) => {

    const { email } = req.body;

    if (!email || !validator.isEmail(email)) {
        return res.status(401).json({
            response: 'error',
            msg: 'Por favor ingresa un correo válido',
        });
    }


    User.findOne({ email }).then(user => {
        if (!user) {
            return res.status(401).json({
                response: 'error',
                msg: 'Uupps, No existe ningun usuario con ese correo',
            });
        }

        var secret = process.env.SECRET;

        const payload = {
            user: user._id
        };

        jwt.sign(payload, secret, {
            expiresIn: 3600,
        }, (error, token) => {
            if (error) throw error;

            res.status(200).json({
                response: 'success',
                msg: 'Solicitud de recuperación de contraseña realizada con exito, revisa tu correo electrónico',
                token
            });

        });


    }).catch(error => {

        return res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error',
        });

    });

}


exports.PasswordUpdate = async (req, res) => {

    const { token } = req.params;

    const { password } = req.body;

    const verifyToken = (validator.isJWT(token)) ? jwt.verify(token, process.env.SECRET) : false;

    if (!token || !verifyToken) {

        return res.status(301).json({
            response: 'error',
            msg: 'Token invalido, intenta de nuevo tu solicitud',
        });
    }

    if (!password || validator.isEmpty(password)) {

        return res.status(400).json({
            response: 'error',
            msg: 'por favor ingresa una contraseña nueva',
        });
    }

    try {

        const ID = verifyToken.user;

        const user = await User.findOne({ _id: ID });

        user.password = await user.encryptPassword(password);

        await user.save();

        res.status(200).json({
            response: 'success',
            msg: 'contraseña actualizada correctamente',
        });
    }

    catch (error) {
        console.log('ha ocurrido un error al actualizar la contraseña')

        return res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error',
        });

    }

}

exports.findOnebyEmail = async (req, res) => {

    var { email } = req.body;

    email = (email) ? email.toLowerCase() : undefined;

    if (!email || !validator.isEmail(email)) {
        return res.status(401).json({
            response: 'error',
            msg: 'Por favor ingresa un correo válido',
        });
    }

    try {

        let user = await User.findOne({ email }, { 'name': 1, 'avatar': 1 });

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



exports.friends = async (req, res) => {

    const currentUser = req.user.ID;

    const friend = (req.query) ? req.query.friend : undefined; 

    console.log(friend);


    try {

        let friends = (!friend) ?
        
        await User.findOne({ _id: currentUser }, { friends: '1' }).populate({ path: 'friends', select: 'name lastName email' }):
             
        
        await User.findOne({$and:[{ _id: friend }, { friends: currentUser }]}, { name: '1','lastname': '1', email:'1'});


        console.log(Array.isArray(friends.friends))


        return res.status(200).json({
            response: 'success',
            msg: 'Lista de amigos cargada con exito',
            friends : (friends.friends) ? friends.friends : friends
        })

    } catch (error) {

        console.log(error);

        return res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error',
        });
    }

}



exports.friend = async (req, res) => {

    const currentUser = req.user.ID;

    const friend = req.params.friend; 

    if(!validator.isMongoId(friend)){
        return res.status(400).json({
            response: 'error',
            msg: 'No se presentó un ID de usuario válido',
        });
    }


    try {

        let f = await User.findOne({$and:[{ _id: friend }, { friends: currentUser }]}, { name: '1','lastname': '1', avatar:'1', email:'1'});

        if(!f){
            return res.status(400).json({
                response: 'error',
                msg: 'No se encontró ningun amigo con el ID suministrado',
            });
        }

        return res.status(200).json({
            response: 'success',
            msg: 'Amigo cargado con exito',
            friend : f
        })

    } catch (error) {

        console.log(error);

        return res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error',
        });
    }

}