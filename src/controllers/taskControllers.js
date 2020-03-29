const Tasks = require('../models/Tasks');
const Project = require('../models/Projects');
const validator = require('validator')

const moment = require('moment');

exports.createTask = async (req, res) => {

    const { project } = req.params;

    const { title, description } = req.body;

    try {

        task = await new Tasks({
            title,
            description,
            createdBy: {
                user: req.user.ID
            },
            project,
            users:[
                {
                    user: req.user.ID,
                    addedBy: req.user.ID,
                }
            ],
            status:[
                {
                    statement: 'pending',
                    changedBy: req.user.ID,
                }
            ]
        });

        await task.save();

        res.status(200).json({
            response: 'success',
            msg: `Se ha creado la tarea "${task.title}" exitosamente`,
            task
        });

    } catch (error) {

        console.log(error);

        res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error al crear la tarea',
        });
    }

}


exports.listTasks = async (req, res) => {

    const project = req.params;

    try {

        const tasks = await Tasks.find({ 'users.user': req.user.ID,'project':project} );

        res.status(200).json({
            response: 'success',
            msg: 'Cuentas cargadas exitosamente',
            projects
        });

    } catch (error) {

        console.log(error);

        res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error al cargar las cuentas',
        });
    }

}

// auth


exports.deleteTask = async (req, res) => {

    const { project } = req.body;

    try {

        const projectDeleted = await Project.findOneAndDelete({ 'users.user': req.user.ID,'_id':project} );

        if(projectDeleted){
            res.status(200).json({
                response: 'success',
                msg: 'Cuenta eliminada exitosamente',
            });
        }else{
            res.status(400).json({
                response: 'error',
                msg: 'No se encontró ninguna cuenta',
            });
        }

       

    } catch (error) {

        console.log(error);

        res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error al cargar las cuentas',
        });
    }

}



exports.getTask = async (req, res) => {

    const { project } = req.params;

    try {

        const getProject = await Project.findOne({ 'users.user': req.user.ID,'_id':project} );

        if(getProject){
            res.status(200).json({
                response: 'success',
                msg: 'Cuenta cargada exitosamente',
                project:getProject
            });
        }else{
            res.status(400).json({
                response: 'error',
                msg: 'No se encontró ninguna cuenta',
            });
        }

       

    } catch (error) {

        console.log(error);

        res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error al cargar las cuentas',
        });
    }

}

