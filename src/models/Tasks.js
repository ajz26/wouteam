const mongoose = require('mongoose');
const { Schema } = mongoose;
const USER = require('./User');
const PROJECTS = require('./Projects');


const userChildSchema = new Schema({
    user: {
    type: Schema.ObjectId,
    required:true,
    ref: "USER"
},
addedBy: {
    type: Schema.ObjectId,
    required:true,
},
date: {
    type: Date,
    default: Date.now
}
}, { _id: false });



const childTasksSchema = new Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    },
    modifiedDate: {
        type: Date,
    },
    status: {
        type: String,
        default: 'publish',
    },
    completed:{
        type: Boolean,
        default: false,
    },
    responsable:userChildSchema
    
});

const TasksSchema = new Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
    },
    excerpt: {
        type: String,
    },
    project: {
        type: Schema.ObjectId,
        required:true,
        ref:'PROJECTS'
    },
    createdBy: {
            type: Schema.ObjectId,
            required:true,
            ref:'USER'
    },
    date: {
        type: Date,
        default: Date.now
    },
    modifiedDate: {
        type: Date,
    },
    status: {
        type: String,
        default: 'publish',
    },
    completed:{
        type: Boolean,
        default: false,
    },
    users:[userChildSchema],
    childTask:[childTasksSchema]
    
});

module.exports = mongoose.model('TASKS', TasksSchema);
