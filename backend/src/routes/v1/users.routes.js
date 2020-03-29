const express   = require('express');
const router    =  express.Router();
const {createUser,updateUser} = require('../../controllers/usersControllers');
const {check} = require('express-validator');  
const {auth} = require('../../middlewares/auth');

// Create an user


// *endpoint* /api/v1/user/ 
router.post('/new/',

[
    check('name','El nombre es requerido').not().isEmpty(),
    check('email','Agrega un email válido').isEmail(),
    check('password','la contraseña debe ser de mínimo 6 caracteres').isLength({min:6}),
]
,createUser);

router.put('/',auth,updateUser);



module.exports = router;
