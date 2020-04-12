const Tasks = require('../models/Tasks');
const Project = require('../models/Projects');
const validator = require('validator')

const moment = require('moment');

exports.create = async (req, res) => {

    const { project } = req.params;

    const { title, description } = req.body;

    try {

        task = await new Tasks({
            title,
            description,
            createdBy: req.user.ID,
            project,
            users:[
                {
                    user: req.user.ID,
                    addedBy: req.user.ID,
                }
            ],
        });

        const t = await task.save();

        res.status(200).json({
            response: 'success',
            msg: `Se ha creado la tarea "${task.title}" exitosamente`,
            task: t._id
        });

    } catch (error) {

        console.log(error);

        res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error al crear la tarea',
        });
    }

}


exports.list = async (req, res) => {

    const currentUser = req.user.ID;

    const project = req.params.project;

    try {
        
        const tasks = await Tasks.find({'project':project,'status':'publish'} ).select('title description excerpt completed ').populate({path:'users.user',select:'name avatar lastName email'}).populate({path:'createdBy.user',select:'name lastName email'});

        return res.status(200).json({
            response: 'success',
            msg: 'tareas cargadas exitosamente',
            tasks
        });

    } catch (error) {

        console.log(error);

        res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error al cargar las tareas',
        });
    }

}

// auth


exports.deleteTask = async (req, res) => {

    const { task } = req.params;

    try {

       const projectDeleted =  await Tasks.findOneAndDelete({'_id':task} );

        if(projectDeleted){
            res.status(200).json({
                response: 'success',
                msg: 'Tarea eliminada exitosamente',
            });
        }else{
            res.status(404).json({
                response: 'error',
                msg: 'No se encontró ninguna tarea',
            });
        }

       

    } catch (error) {

        console.log(error);

        res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error al cargar la tarea',
        });
    }

}



exports.getTask = async (req, res) => {

    const { task } = req.params;

    try {

        const getTask = await Tasks.findOne({'_id':task}).populate({path:'users.user',select:'name lastName avatar'}).populate({path:'createdBy',select:'name lastName avatar'})

        if(getTask){
            res.status(200).json({
                response: 'success',
                msg: 'Cuenta cargada exitosamente',
                task:getTask
            });
        }else{
            res.status(404).json({
                response: 'error',
                msg: 'No se encontró ninguna tarea',
            });
        }

       

    } catch (error) {

        res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error al cargar las cuentas',
        });
    }

}



exports.update = async (req, res) => {

    const { task } = req.params;

    const { title, description, status,completed,excerpt } = req.body;


    const data = {
        title,
        description,
        excerpt,
        status,
        completed,
        modifiedDate: moment.now(), 
    }

    if(!title) delete data.title;
    if(!description) delete data.description;
    if(!excerpt) delete data.excerpt;
    if(!status) delete data.status;
    if(!completed) delete data.completed;

    


    try {

        const getTask = await Tasks.findOneAndUpdate({ '_id':task},data,{
            new:true
        }).populate({path:'users.user',select:'name lastName avatar'}).populate({path:'createdBy',select:'name lastName avatar'});

        if(getTask){
            res.status(200).json({
                response: 'success',
                msg: 'Tarea actualizada exitosamente',
                project:getTask
            });
        }else{
            res.status(400).json({
                response: 'error',
                msg: 'No se pudo actualizar la tarea',
            });
        }

       

    } catch (error) {

        console.log(error);

        res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error al cargar las tareas',
        });
    }

}
