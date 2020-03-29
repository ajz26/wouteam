const express   = require('express');
const router    =  express.Router();
const {createProject,listProjects,deleteProject,getProject} = require('../../controllers/projectsControllers');
const {check} = require('express-validator');  
const {auth,authBusiness} = require('../../middlewares/auth');


// *endpoint* /api/v1/projects/

// Create an business
router.post('/',auth,createProject);

router.get('/',auth,listProjects);

router.get('/:project',auth,getProject);

router.delete('/',auth,deleteProject);

module.exports = router;
