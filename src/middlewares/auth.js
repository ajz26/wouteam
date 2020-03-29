const jwt = require('jsonwebtoken');
const moment = require('moment');
const User = require('../models/User');
const Projects = require('../models/Projects');

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


exports.projectAuth = async (req, res, next) => {

  const {project} = req.params;

  const {user} = req;

  if(!project || !validator.isMongoId(project)){
    
    return res.status(301).json({
      response: 'error',
      msg: 'El id de proyecto no parece válido'
    });

  }



  try {


    const currentProject = await Projects.findOne({_id:project,'users.user': user.ID}) 

    if(!currentProject){
    
      return res.status(301).json({
        response: 'error',
        msg: 'El proyecto no existe, o no tienes permiso para modificarlo'
      });
  
    }

    next();
    
  } catch (error) {
    
    res.status(401).json({
        response: 'error',
        msg: 'token de sesión no válido'
    });

  }

}