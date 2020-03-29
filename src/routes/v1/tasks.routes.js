const express   = require('express');
const router    =  express.Router();
const {createTask,listTasks,deleteTask,getTask} = require('../../controllers/taskControllers');
const {auth,projectAuth} = require('../../middlewares/auth');


// *endpoint* /api/v1/tasks/

// Create an business
router.post('/:project/',auth,projectAuth,createTask);

router.get('/:project/',auth,listTasks);

router.get('/:project/:task',auth,getTask);

router.delete('/',auth,deleteTask);

module.exports = router;
