const express   = require('express');
const router    =  express.Router();
const {create,list,deleteTask,getTask,update} = require('../../controllers/taskControllers');
const {auth,projectAuth} = require('../../middlewares/auth');


// *endpoint* /api/v1/tasks/

// Create an business
router.post('/:project/',auth,projectAuth,create);

router.get('/:project/',auth,projectAuth,list);

router.get('/:project/:task',auth,getTask);

router.get('/:project/:task',auth,getTask);

router.delete('/:project/:task',auth,projectAuth,deleteTask);

router.patch('/:project/:task',auth,projectAuth,update);

module.exports = router;
