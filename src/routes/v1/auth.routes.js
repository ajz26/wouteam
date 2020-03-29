//routes/auth.js
const express   = require('express');
const router    = express.Router();
const {authUser,authLogUser} = require('../../controllers/authControllers'); 
const {check} = require('express-validator');  
const {auth} = require('../../middlewares/auth');

/* POST login. */

// loguear usuario
router.post('/',authUser);

// obtener usuario logueado
router.get('/',auth,authLogUser);


module.exports = router;
