const express   = require('express');
const router    =  express.Router();
const {New,acceptInvitation,list} = require('../../controllers/friendRequestControllers');
const {auth} = require('../../middlewares/auth');

// Create an user


// *endpoint* /api/v1/user/ 
router.post('/',auth,New);


router.get(':all?',auth,list);

router.post('/accept/:invitation',auth,acceptInvitation);



module.exports = router;
