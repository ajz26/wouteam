const jwt = require('jsonwebtoken');
const moment = require('moment');
const User = require('../models/User');




exports.auth = async (req, res, next) => {


  const token = req.header('x-auth-token');

  if(!token) return res.status(401).json({
    response: 'error',
    msg: 'No existe un token de sesión válido'
});

  try {

    const verifyToken = jwt.verify(token,process.env.SECRET);

    req.user = verifyToken.user;
    next();
    
  } catch (error) {
    

    console.log(error);

    res.status(401).json({
        response: 'error',
        msg: 'token de sesión no válido'
    });

  }


}


exports.authBusiness = async (req, res, next) => {


  const BusinessAuth = req.header('BusinessAuth');

  if(!BusinessAuth) return res.status(401).json({
      response: 'error',
      msg: 'No existe un token de negocio',
  })

  try {

    const verifyToken = jwt.verify(BusinessAuth,process.env.SECRET);

    req.businessID = verifyToken.businessID;
    
    next();
    
  } catch (error) {

    console.log(error);

    res.status(401).json({
        response: 'error',
        msg: 'token de negocio no válido'
    });

  }


}