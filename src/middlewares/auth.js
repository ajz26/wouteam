const jwt = require('jsonwebtoken');
const moment = require('moment');
const User = require('../models/User');
const validator = require('validator')




exports.auth = async (req, res, next) => {


  const token = req.header('x-auth-token');

  if(!token || !validator.isJWT(token)) return res.status(401).json({
    response: 'error',
    msg: 'No existe un token de sesión válido'
});

  try {

    const verifyToken = jwt.verify(token,process.env.SECRET);

    req.user = verifyToken.user;

    const user = await User.findOne({_id:verifyToken.user.ID})

    if (!user){
      return res.status(401).json({
        response: 'error',
        msg: 'usuario no válido válido'
    });
    }

    next();
    
  } catch (error) {
    

    console.log(error);

    res.status(401).json({
        response: 'error',
        msg: 'token de sesión no válido'
    });

  }


}
