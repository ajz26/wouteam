const express   = require('express');
const router    =  express.Router();
const {create,update,uploadAvatar,updateUserPasswordGenerateToken,PasswordUpdate,findOnebyEmail} = require('../../controllers/usersControllers');
const {auth} = require('../../middlewares/auth');

// Create an user


// *endpoint* /api/v1/user/ 
router.post('/new/',create);

router.put('/',auth,uploadAvatar,update);

router.post('/reset-password/',updateUserPasswordGenerateToken);

router.post('/reset-password/:token',PasswordUpdate);

router.get('/find/', auth,findOnebyEmail);



module.exports = router;
