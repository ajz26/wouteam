const Contact = require('../models/Contacts');
const moment = require('moment');
const validator = require('validator')




exports.createContact = async (req, res) => {

    const business = req.businessID,
        user = req.user.ID;


    const { name,
        lastName,
        type,
        nif,
        nationality,
        addressLine,
        country,
        city,
        zipCode,
        province,
        phone,
        facebook,
        instagram,
        linkedIn,
        email } = req.body;

        if (!validator.isEmail(email) ||!name) {
            return res.status(400).json({
                response: 'error',
                msg: `por favor confirma los campos obligatorios`,
            });
        }

    try {

        const exist = await Contact.findOne({
            'business': business,
            'contact.email': email
        })

        if (exist) {
            return res.status(400).json({
                response: 'error',
                msg: `Ya existe un usuario con el email ${email}`,
                exist: email
            });
        }

        newContact = await new Contact({
            name,
            lastName,
            type,
            nif,
            nationality,
            contact: {
                email,
                phone,
                facebook,
                instagram,
                linkedIn
            },
            business,
            createdBy: {
                user,
                business
            },
            address: {
                addressLine,
                country,
                city,
                zipCode,
                province,
            }
        });

        await newContact.save()

        return res.status(200).json({
            response: 'success',
            msg: `Se ha creado "${newContact.name}" exitosamente`,
            contact: newContact
        });

    } catch (error) {

        return res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error al crear el usuario',
        });
    }

}


exports.getContacts = async (req, res) => {

    const business = req.businessID,
        user = req.user.ID;

    try {

        const contacts = await Contact.find({ 'business': business });

        res.status(200).json({
            response: 'success',
            msg: 'Contactos cargados exitosamente',
            contacts
        });

    } catch (error) {

        // console.log(error);

        res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error al cargar los contactos',
        });
    }

}


exports.getContact = async (req, res) => {

    const { contactID } = req.params;

    const business = req.businessID,
        user = req.user.ID;

    try {

        const contact = await Contact.findOne({
            'business': business,
            _id: contactID
        });

        if (contact !== null) {
            return res.status(200).json({
                response: 'success',
                msg: 'Usuario cargado exitosamente',
                contact
            });
        }

        res.status(200).json({
            response: 'error',
            msg: 'no se encontró ningun usuario',
        });

    } catch (error) {

        // console.log(error);

        res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error al cargar los contactos',
        });
    }

}



exports.updateContact = async (req, res) => {

    const { contactID } = req.params;

    const business = req.businessID,
        user = req.user.ID;


        const { name,
            lastName,
            type,
            nif,
            nationality,
            addressLine,
            country,
            city,
            zipCode,
            province,
            phone,
            facebook,
            instagram,
            linkedIn,
            email } = req.body;

    try {

        const Newcontact = await Contact.findOneAndUpdate({
            'business': business,
            _id: contactID
        },{
            name,
            lastName,
            type,
            nif,
            nationality,
            contact: {
                email,
                phone,
                facebook,
                instagram,
                linkedIn
            },
            business,
            createdBy: {
                user,
                business
            },
            address: {
                addressLine,
                country,
                city,
                zipCode,
                province,
            }
        },{new:true});

        if (Newcontact !== null) {
            return res.status(200).json({
                response: 'success',
                msg: 'Usuario actualizado exitosamente',
                contact:Newcontact
            });
        }

        res.status(200).json({
            response: 'error',
            msg: 'no se encontró ningun usuario',
        });

    } catch (error) {

        // console.log(error);

        res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error al cargar los contactos',
        });
    }

}


// auth