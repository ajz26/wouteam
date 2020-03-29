const express   = require('express');
const router    =  express.Router();
const {createContact,getContacts,getContact,updateContact} = require('../../controllers/contactsControllers.js');
const {auth,authBusiness} = require('../../middlewares/auth');


// *endpoint* /api/v1/contacts/

// Create an business

router.post('/',auth,authBusiness,createContact);

router.get('/',auth,authBusiness,getContacts);

router.get('/:contactID/',auth,authBusiness,getContact);

router.put('/:contactID/',auth,authBusiness,updateContact);

module.exports = router;
