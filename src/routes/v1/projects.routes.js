const express   = require('express');
const router    =  express.Router();
const { createProject,
        listProjects,
        Delete,
        getProject,
        update,
        projectUser } = require('../../controllers/projectsControllers');

const {auth} = require('../../middlewares/auth');


// *endpoint* /api/v1/projects/

// Create an business
router.post('/',auth,createProject);

router.get('/',auth,listProjects);

router.get('/:project',auth,getProject);
router.put('/:project',auth,update);

router.get('/:project/users',auth,projectUser);

router.delete('/:project',auth,Delete);

module.exports = router;
