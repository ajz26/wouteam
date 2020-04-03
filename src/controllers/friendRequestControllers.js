const User = require('../models/User');
const FriendRequest = require('../models/friendRequest');
const validator = require('validator')
const moment = require('moment')





exports.New = async (req, res) => {

    const { friend } = req.body;

    const currentUser = req.user.ID;


    const request = await FriendRequest.findOne({
        $or:
        [  
        {$and: [
            {
                sender: currentUser
            },
            {
                receptor: friend
            }, {
                'is_accepted.response': null
            }
        ]
    },
    {$and: [
        {
            sender: currentUser
        },
        {
            receptor: friend
        }, {
            'is_accepted.response': true
        }
    ]
},
           
        ]
         
    })

    if(request){
        return res.status(401).json({
            response: 'error',
            msg: 'ya has invitado a este usuario',
            email: friend.email
        });
    }

    if (!friend || validator.isObjectId) {
        return res.status(401).json({
            response: 'error',
            msg: 'No se encontró ningun usuario con ese correo, puedes invitarlo a crear una nueva cuenta',
            email: friend.email
        });
    }

    try {

        let user = await User.findOne({ _id: friend }, {});

        if (!user) {
            return res.status(401).json({
                response: 'error',
                msg: 'No se encontró ningun usuario con ese correo, puedes invitarlo a crear una nueva cuenta',
                email: user.email
            });
        }

        const Request = {
            sender: currentUser,
            receptor: user._id
        }

        const friendreq = await new FriendRequest(Request);

        resp = await friendreq.save();

        return res.status(200).json({
            response: 'success',
            msg: 'solicitud de amistad creada con exito',
            resp
        })


    } catch (error) {

        console.log(error);

        return res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error',
        });
    }

}


exports.acceptInvitation = async (req, res) => {

    const { invitation } = req.params;
    const { response } = req.body;

    const currentDate = moment().format();

    const currentUser = req.user.ID;

    try {

        let request = await FriendRequest.findOne({ $and: [{ _id: invitation }, { receptor: currentUser }, { '': null }] });

        if (request.is_accepted !== null ) {

            return res.status(400).json({
                response: 'error',
                msg: 'esta solicitud ya fue aceptada',
            })

        }
        const friendReqUp = await FriendRequest.findOneAndUpdate({ _id: invitation }, { 'is_accepted.response': response,'is_accepted.date': currentDate }, { new: true })

        await User.findOneAndUpdate({ _id: request.receptor }, { $push: { friends: request.sender } })

        await User.findOneAndUpdate({ _id: request.sender }, { $push: { friends: request.receptor } })

        return res.status(200).json({
            response: 'success',
            msg: 'Invitación respondida exitosamente',
            request : friendReqUp
        })

    } catch (error) {

        console.log(error);

        return res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error al aceptar la invitación ',
        });
    }

}



exports.list = async (req, res) => {



    const currentUser = req.user.ID;

    const all = req.query.all;

    try {


        let request = (!all) ?
            await FriendRequest.findOne({
                $and: [{
                    receptor: currentUser
                }, {
                    'is_accepted.response': null
                }
                ]
            }).populate({
                path: 'receptor',
                select: 'name lastName email'
            }).populate({
                path: 'sender',
                select: 'name lastName email'
            })
            : await FriendRequest.findOne({
                receptor: currentUser
            }).populate({
                path: 'receptor',
                select: 'name lastName email'
            }).populate({
                path: 'sender',
                select: 'name lastName email'
            })

        return res.status(200).json({
            response: 'success',
            msg: 'Solicitudes de amistad cargadas con exito',
            request
        })

    } catch (error) {

        console.log(error);

        return res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error',
        });
    }

}