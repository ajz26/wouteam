const Project = require('../models/Projects');
const User = require('../models/User');
const moment = require('moment');

exports.createProject = async (req, res) => {

    const { name } = req.body;

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

        const projects = await Project.find({ 'users.user': req.user.ID} ).populate({path:'users.user',select:'name lastName email'}).populate({path:'createdBy.user',select:'name lastName email'});

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

exports.projectUser = async (req, res) => {

    try {

        const projects = await Project.find({ 'users.user': req.user.ID},{ "users":1} ).populate({path:'users.user',select:'name lastName email'}).populate({path:'createdBy.user',select:'name lastName email'});

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


exports.deleteProject = async (req, res) => {

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



exports.getProject = async (req, res) => {

    const { project } = req.params;

    try {

        const getProject = await Project.findOne({ 'users.user': req.user.ID,'_id':project},{} ).populate({path:'users.user',select:'name avatar lastName email'}).populate({path:'createdBy.user',select:'name lastName email'});;

        if(getProject){
            res.status(200).json({
                response: 'success',
                msg: 'Cuenta cargada exitosamente',
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

