const express   = require('express');
const router    =  express.Router();
const {createBusiness,businessAuth,listBusiness,get_current_business} = require('../../controllers/businessControllers');
const {check} = require('express-validator');  
const {auth,authBusiness} = require('../../middlewares/auth');


// *endpoint* /api/v1/business/

// Create an business
router.post('/',auth,createBusiness);

router.get('/',auth,listBusiness);

router.post('/auth/',auth,businessAuth);

router.get('/auth/',auth,authBusiness,get_current_business);

// router.get('/prueba',auth,authBusiness);



module.exports = router;
