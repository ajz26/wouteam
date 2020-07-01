const Project = require('../models/Projects');
const User = require('../models/User');
const moment = require('moment');

exports.createProject = async (req, res) => {

    const { name } = req.body;

    if(!name){
        return res.status(400).json({
            response: 'error',
            msg: 'Por favor ingresa un nombre válido para el proyecto',
        }); 
    }

    try {

        project = await new Project({
            name,
            createdBy: {
                user: req.user.ID
            },
            users:[
                {
                    user: req.user.ID,
                    permissions: 'master',
                    addedBy: req.user.ID,
                }
            ],
            owner: req.user.ID,
            progress:{
                status:[
                    {
                        statement: 'pending',
                        changedBy: req.user.ID,
                    }
                ]
            }
        });

        p = await project.save();

        res.status(200).json({
            response: 'success',
            msg: `Se ha creado "${project.name}" exitosamente`,
            project
        });

    } catch (error) {

        console.log(error);

        res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error',
        });
    }

}


exports.listProjects = async (req, res) => {

    try {

        const projects = await Project.find({ 'users.user': req.user.ID} ).populate({path:'users.user',select:'name lastName email'}).populate({path:'createdBy.user',select:'name lastName email'}).populate({path:'owner',select:'name lastName email'});

        count = projects.length;

        res.status(200).json({
            response: 'success',
            msg: (count === 1 ) ? 'Proyecto cargado con exito' :'Proyectos cargados exitosamente',
            projects,
            count
        });

    } catch (error) {

        console.log(error);

        res.status(400).json({
            response: 'error',
            msg: 'ha ocurrido un error al cargar las cuentas',
        });
    }

}

exports.projectUser = async (req, res) => {

    try {

        const projects = await Project.find({ 'users.user': req.user.ID},{ "users":1} ).populate({path:'users.user',select:'name lastName email'}).populate({path:'createdBy.user',select:'name lastName email'});

        res.status(200).json({
            response: 'success',
            msg: 'Proyectos cargadps exitosamente',
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





exports.getProject = async (req, res) => {

    const { project } = req.params;

    try {

        const p = await Project.findOne({ 'users.user': req.user.ID,'_id':project},{} ).populate({path:'users.user',select:'name avatar lastName email'}).populate({path:'createdBy.user',select:'name lastName email'}).populate({path:'owner',select:'name lastName email'});

        if(p){
            res.status(200).json({
                response: 'success',
                msg: 'Proyecto cargado exitosamente',
                project: p
            });
        }else{
            res.status(400).json({
                response: 'error',
                msg: 'No se encontró ningun proyecto',
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


function clean(obj) {
    for (var propName in obj) { 
      if (obj[propName] === null || obj[propName] === undefined) {
        delete obj[propName];
      }
    }
}

exports.update = async (req, res) => {

    const { project } = req.params;
    const {name, startDate, endDate,priority,description } = req.body;


    let update = {
        name,
        "progress.start": (startDate) ? startDate : null,
        "progress.end":(endDate) ? endDate : null ,
        "priority":(priority) ? priority : null ,
        "description":(description) ? priority : null ,
    }

    clean(update);
    
    try {

        const getProject = await Project.findOneAndUpdate({ 'users.user': req.user.ID,'_id':project},{ $set: update },{upsert: true, new: true}).populate({path:'users.user',select:'name avatar lastName email'}).populate({path:'createdBy.user',select:'name lastName email'}).populate({path:'owner',select:'name lastName email'});

        if(getProject){
            res.status(200).json({
                response: 'success',
                msg: 'Proyecto actualizado exitosamente',
                project:getProject
            });
        }else{
            res.status(400).json({
                response: 'error',
                msg: 'No se encontró ningun proyecto',
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


exports.Delete = async (req, res) => {

    const { project } = req.params;

    try {

        const projectDeleted = await Project.findOneAndDelete({ 'users.user': req.user.ID, '_id':project} );

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