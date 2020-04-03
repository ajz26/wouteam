const express   = require('express');
const router    =  express.Router();
const {createUser,updateUser,updateUserPasswordGenerateToken,PasswordUpdate,findOnebyEmail} = require('../../controllers/usersControllers');
const {auth} = require('../../middlewares/auth');

// Create an user


// *endpoint* /api/v1/user/ 
router.post('/new/',createUser);

router.put('/',auth,updateUser);

router.post('/reset-password/',updateUserPasswordGenerateToken);

router.post('/reset-password/:token',PasswordUpdate);

router.get('/find/', auth,findOnebyEmail);



module.exports = router;
