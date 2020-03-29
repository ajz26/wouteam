const express   = require('express');
const router    =  express.Router();
const {createUser,updateUser,updateUserPasswordGenerateToken,PasswordUpdate} = require('../../controllers/usersControllers');
const {check} = require('express-validator');  
const {auth} = require('../../middlewares/auth');

// Create an user


// *endpoint* /api/v1/user/ 
router.post('/new/',createUser);

router.put('/',auth,updateUser);

router.post('/reset-password/',updateUserPasswordGenerateToken);

router.post('/reset-password/:token',PasswordUpdate);



module.exports = router;
